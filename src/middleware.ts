import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "ad_session";

interface SessionPayload {
  sub: string;
  role: string;
  emailVerified: boolean;
}

/**
 * Security Audit: verifyToken uses jose (Edge-compatible)
 */
async function verifyToken(token: string): Promise<SessionPayload | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("MIDDLEWARE_ERROR: JWT_SECRET is missing.");
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload as unknown as SessionPayload;
  } catch (err) {
    return null;
  }
}

/**
 * Audit: Adding Security Headers (CSP, HSTS, etc.)
 */
function applySecurityHeaders(res: NextResponse) {
  // Prevent clickjacking
  res.headers.set("X-Frame-Options", "DENY");
  // Enforce HSTS (1 year)
  res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  // Prevent MIME sniffing
  res.headers.set("X-Content-Type-Options", "nosniff");
  // Referrer Policy
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // Permissions Policy (Geolocation, Camera, etc. disabled by default)
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Skip middleware for static assets early to save edge execution time
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/auth") || // Handle NextAuth separately if applicable
    pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|pdf)$/)
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value ?? "";
  const session = token ? await verifyToken(token) : null;

  // 2. Initialise Response
  let response = NextResponse.next();

  /* ── Rate Limiting structure (placeholder for future Upstash/Redis integration) ── */
  // Currently we use standard Next.js logic. For high-traffic launch, 
  // consider adding 'x-rate-limit' headers here.

  /* ── /admin/** — must be authenticated AND have role === "admin" ────── */
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== "admin") {
      const homeUrl = req.nextUrl.clone();
      homeUrl.pathname = "/";
      homeUrl.search = "";
      return NextResponse.redirect(homeUrl);
    }
  }

  /* ── /dashboard/** — must be authenticated ──────────────── */
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
    if (!session) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
      }
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Auth Flaw Check: Verified check
    if (!session.emailVerified) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, message: "Please verify your email to purchase." }, { status: 403 });
      }
      const dashboardUrl = req.nextUrl.clone();
      dashboardUrl.pathname = "/dashboard";
      dashboardUrl.searchParams.set("verify", "required");
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // 3. Pass session data to server components via headers (internal only)
  // This allows Server Components to read 'x-user-role' without re-verifying JWT
  if (session) {
    response.headers.set("x-user-id", session.sub);
    response.headers.set("x-user-role", session.role);
  }

  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    "/admin/:path*", 
    "/dashboard/:path*", 
    "/premium-store/:path*", 
    "/api/payments/checkout",
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ],
};
