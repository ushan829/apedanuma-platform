import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "ad_session";

interface SessionPayload {
  sub: string;
  role: string;
  emailVerified: boolean;
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

  /* ── /premium-store and checkout — must be authenticated & verified ── */
  if (pathname.startsWith("/premium-store") || pathname.startsWith("/api/payments/checkout")) {
    // If not authenticated, redirect to login (for page) or return 401 (for API)
    if (!session) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
      }
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // If authenticated but not verified, redirect to dashboard to see warning or return 403
    if (!session.emailVerified) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, message: "Please verify your email to purchase." }, { status: 403 });
      }
      const dashboardUrl = req.nextUrl.clone();
      dashboardUrl.pathname = "/dashboard";
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/premium-store/:path*", "/api/payments/checkout"],
};
