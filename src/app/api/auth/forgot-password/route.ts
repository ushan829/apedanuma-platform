import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const apiKey = process.env.RESEND_API_KEY;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return 200 even if user is not found to prevent email enumeration
      return NextResponse.json(
        { message: "If an account with that email exists, we have sent a password reset link." },
        { status: 200 }
      );
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now

    await user.save({ validateBeforeSave: false });

    // Send email via Resend
    const resetUrl = `https://english-apedanuma.vercel.app/auth/reset-password/${resetToken}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #7c1fff; margin: 0; font-size: 28px; font-weight: bold;">Ape Danuma</h1>
        </div>
        <p style="color: #333; font-size: 16px;">Hello ${user.name},</p>
        <p style="color: #333; font-size: 16px;">You requested to reset your password. Click the button below to choose a new one:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #9455ff; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #333; font-size: 16px;">This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eaeaec; margin: 30px 0;" />
        <p style="color: #888; font-size: 14px; text-align: center;">© ${new Date().getFullYear()} Ape Danuma. All rights reserved.</p>
      </div>
    `;

    if (apiKey) {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: "Ape Danuma <verify@apedanuma.lk>",
        to: user.email,
        subject: "Password Reset Request - Ape Danuma",
        html: emailHtml,
      });
    } else {
      console.warn("RESEND_API_KEY is missing. Password reset email not sent.");
      // In development or if keys are missing, we still want to show the success message 
      // but maybe log the link for testing if needed.
      if (process.env.NODE_ENV === "development") {
        console.log("Reset Link (Dev):", resetUrl);
      }
    }

    return NextResponse.json(
      { message: "If an account with that email exists, we have sent a password reset link." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
