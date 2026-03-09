"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type UserInfo = { name: string; email: string; role: string };

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    href: "/dashboard/history",
    label: "My Library",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 4a1 1 0 011-1h10a1 1 0 011 1v9a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M5 3V2M11 3V2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M2.5 14c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    fetch("/api/user/me")
      .then((r) => r.json())
      .then((data: { success: boolean; user?: UserInfo }) => {
        if (data.success && data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const initials = user
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "…";

  return (
    <div className="relative min-h-[calc(100vh-68px)] flex overflow-hidden">
      {/* Ambient glows */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-0 left-1/4 rounded-full"
          style={{
            width: 700, height: 600,
            background: "radial-gradient(circle, rgba(124,31,255,0.07) 0%, transparent 65%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 rounded-full"
          style={{
            width: 500, height: 500,
            background: "radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* ── Sidebar (desktop) ── */}
      <aside
        className="hidden lg:flex flex-col shrink-0 sticky top-[68px] h-[calc(100vh-68px)]"
        style={{
          width: 228,
          borderRight: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(10,10,10,0.6)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Avatar + name */}
        <div className="px-5 pt-7 pb-5">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 font-display font-bold text-sm"
              style={{
                background: "linear-gradient(135deg, rgba(124,31,255,0.35), rgba(87,0,190,0.5))",
                border: "1px solid rgba(124,31,255,0.4)",
                color: "#c4a0ff",
              }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>
                {user?.name ?? "Loading…"}
              </p>
              <p className="text-[0.65rem] capitalize" style={{ color: "var(--foreground-muted)" }}>
                {user?.role ?? "student"}
              </p>
            </div>
          </div>
        </div>

        <div className="mx-5 h-px mb-4" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 flex-1" aria-label="Dashboard navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
                style={{
                  background: isActive ? "rgba(124,31,255,0.12)" : "transparent",
                  border: isActive ? "1px solid rgba(124,31,255,0.22)" : "1px solid transparent",
                  color: isActive ? "#c4a0ff" : "var(--foreground-muted)",
                  boxShadow: isActive ? "0 0 12px rgba(124,31,255,0.1) inset" : "none",
                  textDecoration: "none",
                }}
              >
                <span style={{ color: isActive ? "#9455ff" : "var(--foreground-muted)", opacity: isActive ? 1 : 0.6 }}>
                  {item.icon}
                </span>
                {item.label}
                {isActive && (
                  <span
                    className="ml-auto w-1 h-4 rounded-full"
                    style={{ background: "linear-gradient(180deg, #9455ff, #7c1fff)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Back to site */}
        <div className="p-4 mt-auto">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium w-full transition-all duration-200 hover:bg-white/[0.04]"
            style={{ color: "var(--foreground-muted)", border: "1px solid rgba(255,255,255,0.06)", textDecoration: "none" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M8 2L3 7l5 5M3 7h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Site
          </Link>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0">
        {/* Mobile tab bar */}
        <div
          className="lg:hidden sticky top-[68px] z-10 flex gap-1 px-4 py-2 overflow-x-auto no-scrollbar"
          style={{
            background: "rgba(10,10,10,0.85)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200"
                style={{
                  background: isActive ? "rgba(124,31,255,0.15)" : "transparent",
                  border: isActive ? "1px solid rgba(124,31,255,0.25)" : "1px solid transparent",
                  color: isActive ? "#c4a0ff" : "var(--foreground-muted)",
                  textDecoration: "none",
                }}
              >
                <span style={{ color: isActive ? "#9455ff" : "inherit" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="px-6 lg:px-10 py-8 max-w-5xl">
          {children}
        </div>
      </div>
    </div>
  );
}
