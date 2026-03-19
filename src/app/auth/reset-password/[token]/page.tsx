"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  /* ── Form state ── */
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* ── UI state ── */
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  /* ── Submit handler ── */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    if (password.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters long." });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.message ?? "An error occurred. Please try again." });
        return;
      }

      setMessage({ type: "success", text: data.message });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch {
      setMessage({ type: "error", text: "Could not connect to the server. Please check your connection." });
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
              Set New Password
            </h1>
            <p className="text-sm mt-1.5 max-w-xs leading-relaxed mx-auto" style={{ color: "var(--foreground-muted)" }}>
              Please enter your new password below.
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

          {/* ── Message banner ── */}
          {message && (
            <div
              className="flex items-start gap-3 rounded-xl px-4 py-3 mb-5 text-sm"
              style={
                message.type === "error"
                  ? {
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.28)",
                      color: "#f87171",
                    }
                  : {
                      background: "rgba(16,185,129,0.08)",
                      border: "1px solid rgba(16,185,129,0.28)",
                      color: "#34d399",
                    }
              }
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 mt-0.5">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
                <path
                  d={
                    message.type === "error"
                      ? "M8 5v3.5M8 10.5v.5" // Error icon (!)
                      : "M5 8l2 2 4-4" // Success icon (check)
                  }
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {message.text}
            </div>
          )}

          <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit}>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium"
                style={{ color: "var(--foreground-secondary)" }}
              >
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter new password"
                className="w-full px-4 py-3 rounded-xl transition-all bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:bg-white/10"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || message?.type === "success"}
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium"
                style={{ color: "var(--foreground-secondary)" }}
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                className="w-full px-4 py-3 rounded-xl transition-all bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:bg-white/10"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading || message?.type === "success"}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || message?.type === "success"}
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
                  <span className="relative z-10">Resetting Password…</span>
                </>
              ) : (
                <>
                  <svg
                    width="15" height="15" viewBox="0 0 15 15" fill="none"
                    aria-hidden="true" className="relative z-10"
                  >
                    <path d="M11 5L6 10l-2.5-2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="relative z-10">Reset Password</span>
                </>
              )}
            </button>

          </form>
        </div>

      </div>
    </main>
  );
}
