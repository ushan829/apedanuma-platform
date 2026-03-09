import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-cookie";

/* ─────────────────────────────────────────
   POST /api/auth/logout
   Clears the httpOnly session cookie.
   ───────────────────────────────────────── */
export async function POST() {
  const response = NextResponse.json(
    { success: true, message: "Signed out successfully." },
    { status: 200 }
  );

  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
