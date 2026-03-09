import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "ad_session";

interface SessionPayload {
  sub: string;
  role: string;
}

async function verifyToken(token: string): Promise<SessionPayload | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(SESSION_COOKIE)?.value ?? "";
  const session = token ? await verifyToken(token) : null;

  /* ── /admin/** — must be authenticated AND have role === "admin" ────── */
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== "admin") {
      // Authenticated but not admin — send to home, not /dashboard,
      // so students don't discover this URL exists.
      const homeUrl = req.nextUrl.clone();
      homeUrl.pathname = "/";
      homeUrl.search = "";
      return NextResponse.redirect(homeUrl);
    }
  }

  /* ── /dashboard/** — must be authenticated (any role) ──────────────── */
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
