/**
 * Lightweight in-memory rate limiter for Next.js API routes (Node.js runtime).
 *
 * Uses a Map as an LRU-style store: entries are evicted once the window expires.
 * This is single-process only — suitable for a single-instance deployment.
 * For multi-instance/serverless, swap the Map for a Redis-backed store (e.g. Upstash).
 *
 * Default rule: 10 requests per 15-minute sliding window per key (usually an IP).
 */

interface RateLimitEntry {
  count: number;
  windowStart: number; // Unix ms timestamp when the current window started
}

const WINDOW_MS   = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 10;

// Global map — persists across requests within the same Node.js process.
const store = new Map<string, RateLimitEntry>();

/**
 * Check whether `key` (typically an IP address) has exceeded the rate limit.
 *
 * @returns `true`  — request is allowed (within limit)
 * @returns `false` — limit exceeded, caller should return 429
 */
export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    // No prior entry, or the window has expired — start a fresh window.
    store.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    // Still within the window and limit reached.
    return false;
  }

  // Within the window and under the limit — increment.
  entry.count += 1;
  return true;
}

/**
 * Extract the best available IP address from a Request's headers.
 * Falls back to a placeholder when no IP can be determined (e.g. local dev).
 */
export function getClientIp(headers: Headers): string {
  // Standard proxy header (Vercel, Cloudflare, most reverse proxies)
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    // May contain a comma-separated list; the first entry is the originating client.
    return forwarded.split(",")[0].trim();
  }

  // Nginx / direct proxy header
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  // Fallback — local development / direct connection with no proxy
  return "127.0.0.1";
}
