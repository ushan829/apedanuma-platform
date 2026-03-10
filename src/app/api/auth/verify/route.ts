import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

/* ─────────────────────────────────────────
   GET /api/auth/verify?token=...
   ───────────────────────────────────────── */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return new NextResponse("Token is missing.", { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      // Redirect to a failure page or login with an error
      return NextResponse.redirect(new URL("/login?error=Invalid or expired verification link", req.url));
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    // Redirect to login or success page
    return NextResponse.redirect(new URL("/login?verified=true", req.url));
  } catch (error) {
    console.error("[GET /api/auth/verify]", error);
    return new NextResponse("An error occurred during verification.", { status: 500 });
  }
}
