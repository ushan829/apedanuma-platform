import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { SESSION_COOKIE } from "@/lib/auth-cookie";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { loginSchema } from "@/lib/validations/user";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/* ─────────────────────────────────────────
   POST /api/auth/login
   ───────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    /* 1. Rate limiting ───────────────────────────────────────────────── */
    try {
      const ip = getClientIp(req.headers);
      if (!checkRateLimit(`login:${ip}`)) {
        return NextResponse.json(
          { success: false, message: "Too many attempts. Please try again in 15 minutes." },
          { status: 429 }
        );
      }
    } catch {
      // Fail open — if the rate limiter errors, allow the request through.
    }

    /* 2. Parse & validate the request body ──────────────────────────── */
    let jsonBody: unknown;
    try {
      jsonBody = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const result = loginSchema.safeParse(jsonBody);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: result.error.issues[0].message,
          errors: result.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    /* 2. Connect to the database ─────────────────────────────────────── */
    await connectToDatabase();

    /* 3. Look up the user — explicitly select the password field ────────
       The password field has `select: false` in the schema so it is
       excluded from all queries by default. We re-include it only here
       for the comparison step, then never expose it in the response.
    ──────────────────────────────────────────────────────────────────── */
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    /* 4. Verify the password ─────────────────────────────────────────── */
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    /* 5. Sign the JWT ────────────────────────────────────────────────── */
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("[POST /api/auth/login] JWT_SECRET is not defined.");
      return NextResponse.json(
        { success: false, message: "Server configuration error." },
        { status: 500 }
      );
    }

    const token = jwt.sign(
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

    /* 6. Set httpOnly cookie and return safe user data ───────────────── */
    const response = NextResponse.json(
      {
        success: true,
        message: "Signed in successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return response;
  } catch (error: unknown) {
    console.error("[POST /api/auth/login]", error);

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected server error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
