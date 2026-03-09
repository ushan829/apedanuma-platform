"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  /* ── Form state ── */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* ── UI state ── */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Submit handler ── */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data: {
        success: boolean;
        message: string;
        user?: { id: string; name: string; email: string; role: string };
      } = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Sign in failed. Please try again.");
        return;
      }

      // The JWT is now set as an httpOnly cookie by the server.
      // Redirect based on role so each user lands in the right place.
      const destination = data.user?.role === "admin" ? "/admin" : "/";
      router.push(destination);
      router.refresh(); // flush server-component cache so the navbar reflects the new session
    } catch {
      setError("Could not connect to the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Render ── */
  return (
    <main className="relative min-h-[calc(100vh-68px)] flex items-center justify-center px-4 py-16 overflow-hidden">

      {/* ── Background glows ── */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 700,
            height: 700,
            background: "radial-gradient(circle, rgba(124,31,255,0.1) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 rounded-full"
          style={{
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="w-full max-w-md">

        {/* ── Logo mark ── */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <Link href="/" aria-label="Go to homepage">
            <span
              className="flex items-center justify-center w-12 h-12 rounded-2xl transition-transform duration-200 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, rgba(124,31,255,0.3), rgba(87,0,190,0.45))",
                border: "1px solid rgba(124,31,255,0.45)",
                boxShadow: "0 0 24px rgba(124,31,255,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <span className="font-display font-black text-base text-gradient-arcane">AD</span>
            </span>
          </Link>
          <div className="text-center">
            <h1 className="font-display font-bold text-2xl" style={{ color: "var(--foreground)" }}>
              Welcome Back
            </h1>
            <p className="text-sm mt-1.5 max-w-xs leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
              Sign in to access your study materials and continue your O/L preparation journey.
            </p>
          </div>
        </div>

        {/* ── Glassmorphism card ── */}
        <div
          className="relative rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(24px) saturate(150%)",
            WebkitBackdropFilter: "blur(24px) saturate(150%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              "0 0 0 1px rgba(124,31,255,0.05) inset, 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Top-edge highlight */}
          <div
            className="absolute top-0 left-0 right-0 h-px rounded-t-2xl pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(124,31,255,0.45) 35%, rgba(148,85,255,0.25) 65%, transparent)",
            }}
          />

          {/* ── Error banner ── */}
          {error && (
            <div
              className="flex items-start gap-3 rounded-xl px-4 py-3 mb-5 text-sm"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.28)",
                color: "#f87171",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 mt-0.5">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
                <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit}>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium"
                style={{ color: "var(--foreground-secondary)" }}
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium"
                  style={{ color: "var(--foreground-secondary)" }}
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium transition-colors duration-200 hover:text-[#b890ff] shrink-0"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  Forgot Password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Sign In button */}
            <button
              type="submit"
              disabled={loading}
              className="relative flex items-center justify-center gap-2.5 w-full rounded-xl py-3.5 font-bold text-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9455ff] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{
                background: "linear-gradient(135deg, #7c1fff 0%, #9455ff 55%, #7c1fff 100%)",
                backgroundSize: "200% auto",
                boxShadow: "0 0 28px rgba(124,31,255,0.45), 0 4px 16px rgba(0,0,0,0.35)",
                color: "#fff",
              }}
            >
              {/* Shimmer sweep */}
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
                  backgroundSize: "200% 100%",
                  animation: loading ? "none" : "shimmer 3.5s linear infinite",
                }}
              />

              {loading ? (
                <>
                  <svg
                    className="relative z-10 animate-spin"
                    width="15" height="15" viewBox="0 0 15 15" fill="none"
                    aria-hidden="true"
                  >
                    <circle cx="7.5" cy="7.5" r="6" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                    <path d="M7.5 1.5a6 6 0 016 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="relative z-10">Signing in…</span>
                </>
              ) : (
                <>
                  <svg
                    width="15" height="15" viewBox="0 0 15 15" fill="none"
                    aria-hidden="true" className="relative z-10"
                  >
                    <path d="M13 7.5H2M9 3l4 4.5L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="relative z-10">Sign In</span>
                </>
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs" style={{ color: "var(--foreground-disabled)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          {/* Register inline text link */}
          <p className="text-center text-sm" style={{ color: "var(--foreground-muted)" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold transition-colors duration-200 hover:text-[#b890ff]"
              style={{ color: "#9455ff" }}
            >
              Register here
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-6" style={{ color: "var(--foreground-disabled)" }}>
          By signing in you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-[#b890ff] transition-colors">
            Terms
          </Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-[#b890ff] transition-colors">
            Privacy Policy
          </Link>.
        </p>

      </div>
    </main>
  );
}
