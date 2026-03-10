import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { SESSION_COOKIE } from "@/lib/auth-cookie";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/* ─────────────────────────────────────────
   GET /api/auth/verify?token=...
   ───────────────────────────────────────── */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/login?error=Token is missing", req.url));
    }

    await connectToDatabase();

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      // Redirect to a failure page or login with an error
      return NextResponse.redirect(new URL("/login?error=Invalid or expired verification link", req.url));
    }

    user.emailVerified = true;
    user.verificationToken = undefined;

    await user.save();

    /* ── Sign the JWT to log the user in ─────────────────────────────── */
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("[GET /api/auth/verify] JWT_SECRET is not defined.");
      return NextResponse.redirect(new URL("/login?verified=true", req.url));
    }

    const sessionToken = jwt.sign(
      {
        sub: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      jwtSecret,
      { expiresIn: COOKIE_MAX_AGE }
    );

    // Redirect to dashboard
    const response = NextResponse.redirect(new URL("/dashboard?verified=true", req.url));

    response.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("[GET /api/auth/verify]", error);
    return NextResponse.redirect(new URL("/login?error=Verification failed due to a server error", req.url));
  }
}
