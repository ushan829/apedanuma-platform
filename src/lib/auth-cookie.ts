/**
 * Shared helper for reading + verifying the session cookie in API route handlers.
 * Uses `jsonwebtoken` (Node.js runtime only — NOT for middleware).
 * For Edge middleware, use `jose` directly in `src/middleware.ts`.
 */
import { type NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const SESSION_COOKIE = "ad_session";

export interface SessionPayload {
  sub: string;    // MongoDB user _id
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
}

/**
 * Reads the `ad_session` httpOnly cookie from the request, verifies it,
 * and returns the decoded payload. Returns `null` on any failure.
 */
export function getSession(req: NextRequest): SessionPayload | null {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    return jwt.verify(token, secret) as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Reads the `ad_session` httpOnly cookie for Server Components.
 */
export function getServerSession(): SessionPayload | null {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    return jwt.verify(token, secret) as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Like `getSession`, but additionally asserts `role === "admin"`.
 * Returns null when the session is missing or the role does not match.
 */
export function getAdminSession(req: NextRequest): SessionPayload | null {
  const session = getSession(req);
  if (!session || session.role !== "admin") return null;
  return session;
}
