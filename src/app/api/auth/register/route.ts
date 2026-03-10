import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import crypto from "crypto";
import { Resend } from "resend";

/* ─────────────────────────────────────────
   POST /api/auth/register
   ───────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    /* 1. Rate limiting ───────────────────────────────────────────────── */
    try {
      const ip = getClientIp(req.headers);
      if (!checkRateLimit(`register:${ip}`)) {
        return NextResponse.json(
          { success: false, message: "Too many attempts. Please try again in 15 minutes." },
          { status: 429 }
        );
      }
    } catch {
      // Fail open — if the rate limiter errors, allow the request through.
    }

    /* 2. Parse & validate the request body ───────────────────────────── */
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const { name, email, password } = body as Record<string, unknown>;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Name must be at least 2 characters." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "A valid email address is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    /* 2. Connect to the database ─────────────────────────────────────── */
    await connectToDatabase();

    /* 3. Check for duplicate email ───────────────────────────────────── */
    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    }).lean();

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email address already exists.",
        },
        { status: 400 }
      );
    }

    /* 4. Create the user ───────────────────────────────────────────────
       The User model's pre-save hook automatically hashes the password
       with bcrypt (12 salt rounds) before writing to the database.
       We intentionally do NOT hash here to avoid double-hashing.
    ──────────────────────────────────────────────────────────────────── */
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password, // plain-text — hashed inside the pre-save hook
      role: "student",
      verificationToken,
    });

    /* 4.5. Send verification email ───────────────────────────────────── */
    const apiKey = process.env.RESEND_API_KEY;
    const verifyUrl = `https://english-apedanuma.vercel.app/api/auth/verify?token=${verificationToken}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1f1f22; border-radius: 10px; background-color: #09090b;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #9455ff; margin: 0; font-size: 28px; font-weight: bold;">Ape Danuma</h1>
        </div>
        <p style="color: #e4e4e7; font-size: 16px;">Hello ${newUser.name},</p>
        <p style="color: #e4e4e7; font-size: 16px;">Welcome to Ape Danuma! Please verify your email address to access all features, including purchasing premium resources.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #9455ff; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block; box-shadow: 0 4px 14px 0 rgba(148, 85, 255, 0.39);">Verify Email</a>
        </div>
        <p style="color: #a1a1aa; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #27272a; margin: 30px 0;" />
        <p style="color: #71717a; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Ape Danuma. All rights reserved.</p>
      </div>
    `;

    if (apiKey) {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: "Ape Danuma <onboarding@resend.dev>",
        to: newUser.email,
        subject: "Verify your email - Ape Danuma",
        html: emailHtml,
      });
    } else {
      console.warn("RESEND_API_KEY is missing. Verification email not sent.");
      if (process.env.NODE_ENV === "development") {
        console.log("Verify Link (Dev):", verifyUrl);
      }
    }

    /* 5. Return success (never expose the password hash) ─────────────── */
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. Please sign in.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[POST /api/auth/register]", error);

    // Mongoose validation errors — surface them clearly.
    if (
      error !== null &&
      typeof error === "object" &&
      "name" in error &&
      (error as { name: string }).name === "ValidationError" &&
      "errors" in error
    ) {
      const mongoError = error as {
        errors: Record<string, { message: string }>;
      };
      const messages = Object.values(mongoError.errors).map((e) => e.message);
      return NextResponse.json(
        { success: false, message: messages[0] ?? "Validation failed." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected server error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
