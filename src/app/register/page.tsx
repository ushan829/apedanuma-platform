"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { registerSchema } from "@/lib/validations/user";

export default function RegisterPage() {
  const router = useRouter();

  /* ── Form state ── */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* ── UI state ── */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ── Password strength logic ── */
  const requirements = [
    { label: "8+ Characters", met: password.length >= 8 },
    { label: "Uppercase (A-Z)", met: /[A-Z]/.test(password) },
    { label: "Lowercase (a-z)", met: /[a-z]/.test(password) },
    { label: "Number (0-9)", met: /[0-9]/.test(password) },
    { label: "Special Character", met: /[^a-zA-Z0-9]/.test(password) },
  ];

  /* ── Submit handler ── */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Client-side validation with Zod
    const result = registerSchema.safeParse({ name, email, password });
    
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please check and try again.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data: { success: boolean; message: string; errors?: Record<string, string[]> } = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Registration failed. Please try again.");
        return;
      }

      // Show success banner, then redirect to login after a short delay
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
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
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 800,
            height: 700,
            background: "radial-gradient(ellipse, rgba(124,31,255,0.09) 0%, transparent 65%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute top-0 right-0 rounded-full"
          style={{
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)",
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
              Create Your Account
            </h1>
            <p className="text-sm mt-1.5 max-w-xs leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
              Join thousands of O/L students and take the first step towards exam success.
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

          {/* ── Success banner ── */}
          {success && (
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5 text-sm font-medium"
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.3)",
                color: "#34d399",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
                <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Account created! Redirecting you to sign in…
            </div>
          )}

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

          {/* ── Google Sign Up ── */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            disabled={loading || success}
            className="flex items-center justify-center gap-3 w-full rounded-xl py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--foreground)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs" style={{ color: "var(--foreground-disabled)" }}>or continue with email</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-sm font-medium"
                style={{ color: "var(--foreground-secondary)" }}
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Kavindu Perera"
                className="input"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading || success}
              />
            </div>

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
                disabled={loading || success}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium"
                style={{ color: "var(--foreground-secondary)" }}
              >
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  className="input pr-11"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-foreground-muted hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>

              {/* Requirements Checklist */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-1 px-1">
                {requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-1.5 transition-all duration-300">
                    <div
                      className="shrink-0 w-3 h-3 rounded-full flex items-center justify-center transition-all duration-500"
                      style={{
                        background: req.met ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.05)",
                        border: req.met ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(255,255,255,0.08)"
                      }}
                    >
                      {req.met && (
                        <svg width="6" height="6" viewBox="0 0 10 8" fill="none" style={{ color: "#34d399" }}>
                          <path d="M1 4.5l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="text-[0.65rem] font-medium tracking-tight"
                      style={{
                        color: req.met ? "#34d399" : "var(--foreground-disabled)",
                        opacity: req.met ? 1 : 0.6
                      }}
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirm-password"
                className="text-sm font-medium"
                style={{ color: "var(--foreground-secondary)" }}
              >
                Confirm Password
              </label>
              <div className="relative group">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  className="input pr-11"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-foreground-muted hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Register button */}
            <button
              type="submit"
              disabled={loading || success}
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
                  <span className="relative z-10">Creating account…</span>
                </>
              ) : (
                <>
                  <svg
                    width="15" height="15" viewBox="0 0 15 15" fill="none"
                    aria-hidden="true" className="relative z-10"
                  >
                    <path d="M7.5 1v13M1 7.5h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <span className="relative z-10">Register</span>
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

          {/* Sign in inline text link */}
          <p className="text-center text-sm" style={{ color: "var(--foreground-muted)" }}>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold transition-colors duration-200 hover:text-[#b890ff]"
              style={{ color: "#9455ff" }}
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-6" style={{ color: "var(--foreground-disabled)" }}>
          By creating an account you agree to our{" "}
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
