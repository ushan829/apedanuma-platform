/**
 * Shared admin-auth helper.
 * Import this in every admin API route instead of duplicating the logic.
 * Reads the session from the httpOnly `ad_session` cookie.
 */
import { type NextRequest } from "next/server";
import { getSession, type SessionPayload } from "@/lib/auth-cookie";

export type { SessionPayload as AdminJwtPayload };

/**
 * Verifies the session cookie and asserts role === "admin".
 * Throws an Error with a `.status` property on failure so callers can
 * return the right HTTP status code.
 */
export function verifyAdminToken(req: NextRequest): SessionPayload {
  const session = getSession(req);

  if (!session) {
    throw Object.assign(new Error("Authentication required. Please sign in."), { status: 401 });
  }

  if (session.role !== "admin") {
    throw Object.assign(new Error("Forbidden: admin access required."), { status: 403 });
  }

  return session;
}

/** Convenience wrapper — returns a NextResponse-ready error tuple on failure. */
export function authError(err: unknown): { message: string; status: number } {
  const e = err as Error & { status?: number };
  return { message: e.message, status: e.status ?? 401 };
}
