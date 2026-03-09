import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-cookie";

/* ─────────────────────────────────────────
   GET /api/auth/me
   Returns the authenticated user's basic info from the session cookie.
   Returns 401 if not authenticated — no DB call needed.
   ───────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const session = getSession(req);

  if (!session) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.sub,
      name: session.name,
      email: session.email,
      role: session.role,
    },
  });
}
