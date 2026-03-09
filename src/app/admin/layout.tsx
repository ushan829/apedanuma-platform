"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

/* ─────────────────────────────────────────
   Sidebar nav items
   ───────────────────────────────────────── */
const ADMIN_NAV = [
  {
    id: "overview",
    label: "Overview",
    href: "/admin",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "upload",
    label: "Upload Resource",
    href: "/admin/upload",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 11V3m0 0L5 6m3-3l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12v1.5A1.5 1.5 0 003.5 15h9a1.5 1.5 0 001.5-1.5V12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "content",
    label: "Manage Content",
    href: "/admin/manage",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 4a1 1 0 011-1h10a1 1 0 011 1v9a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M5 3V2M11 3V2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "blog",
    label: "Blog",
    href: "/admin/blog",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 3h12M2 6h8M2 9h10M2 12h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "users",
    label: "Users",
    href: "/admin/users",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M1 14c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M11 8a2 2 0 100-4M15 14c0-2-1.5-4-4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "analytics",
    label: "Sales Analytics",
    href: "/admin/analytics",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 13L6 8l3 3 3-4 2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 14h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "messages",
    label: "Inbox",
    href: "/admin/messages",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
        <path d="M1 6l6.47 4.04a1 1 0 001.06 0L15 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────
   Layout
   ───────────────────────────────────────── */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Route protection is handled server-side by src/middleware.ts.
  // No localStorage checks needed here.

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch { /* ignore — still redirect */ }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-[calc(100vh-68px)]">

      {/* ── Ambient glows ── */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 rounded-full"
          style={{
            width: 600, height: 600,
            background: "radial-gradient(circle, rgba(124,31,255,0.06) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 rounded-full"
          style={{
            width: 500, height: 500,
            background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════ */}
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-[68px] z-40 lg:z-auto
          h-[calc(100vh-68px)] flex flex-col shrink-0
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          width: 240,
          background: "rgba(6,6,12,0.92)",
          backdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* ── Brand header ── */}
        <div className="px-5 pt-6 pb-5">
          <div className="flex items-center gap-2.5">
            {/* Icon */}
            <div
              className="flex items-center justify-center w-8 h-8 rounded-[9px] shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(180,100,0,0.35))",
                border: "1px solid rgba(245,158,11,0.4)",
                boxShadow: "0 0 14px rgba(245,158,11,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "#fbbf24" }}>
                <path d="M7 1l1.5 4H13L9.5 8l1.5 4L7 10 3.5 12l1.5-4L1 5h4.5z" fill="currentColor" opacity="0.9" />
              </svg>
            </div>
            {/* Wordmark */}
            <div className="leading-none">
              <p
                className="font-display font-bold text-sm tracking-tight"
                style={{ color: "var(--foreground)" }}
              >
                Admin <span style={{
                  background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>Panel</span>
              </p>
              <p className="text-[0.58rem] font-semibold tracking-[0.14em] uppercase mt-0.5" style={{ color: "#f59e0b88" }}>
                Ape Danuma
              </p>
            </div>
          </div>

          {/* Gold separator */}
          <div
            className="mt-5 h-px"
            style={{
              background: "linear-gradient(90deg, rgba(245,158,11,0.4), rgba(245,158,11,0.08) 70%, transparent)",
            }}
          />
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 overflow-y-auto" aria-label="Admin navigation">
          <p
            className="px-2 pb-2 text-[0.58rem] font-bold uppercase tracking-[0.15em]"
            style={{ color: "rgba(245,158,11,0.5)" }}
          >
            Navigation
          </p>
          <ul className="flex flex-col gap-0.5">
            {ADMIN_NAV.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(124,31,255,0.08))"
                        : "transparent",
                      border: isActive
                        ? "1px solid rgba(245,158,11,0.2)"
                        : "1px solid transparent",
                      color: isActive ? "#fcd34d" : "var(--foreground-muted)",
                      boxShadow: isActive ? "0 0 10px rgba(245,158,11,0.06) inset" : "none",
                    }}
                  >
                    <span style={{ color: isActive ? "#f59e0b" : "var(--foreground-muted)", opacity: isActive ? 1 : 0.55 }}>
                      {item.icon}
                    </span>
                    {item.label}
                    {isActive && (
                      <span
                        className="ml-auto w-1 h-4 rounded-full shrink-0"
                        style={{ background: "linear-gradient(180deg, #f59e0b, #d97706)" }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Bottom: logout + back to site ── */}
        <div
          className="px-3 py-4 space-y-1.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium w-full transition-all duration-200 hover:bg-white/[0.04]"
            style={{ color: "var(--foreground-muted)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M7 2L2 6.5l5 4.5M2 6.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 hover:bg-red-500/[0.07]"
            style={{ color: "#f87171", border: "1px solid rgba(239,68,68,0.14)" }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M4.5 1H2A1.5 1.5 0 00.5 2.5v8A1.5 1.5 0 002 12h2.5M9 9.5l3-3-3-3M4.5 6.5h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════
          MAIN CONTENT AREA
      ══════════════════════════════════════ */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Mobile top bar */}
        <div
          className="lg:hidden flex items-center gap-3 px-4 py-3 sticky top-[68px] z-20"
          style={{
            background: "rgba(6,6,12,0.9)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open admin menu"
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200"
            style={{
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.2)",
              color: "#f59e0b",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
          <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Admin Panel
          </span>
        </div>

        <main className="flex-1 px-5 lg:px-8 xl:px-10 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
