import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

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
    const newUser = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password, // plain-text — hashed inside the pre-save hook
      role: "student",
    });

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
