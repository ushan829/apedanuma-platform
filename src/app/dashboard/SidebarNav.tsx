"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function SidebarNav({ type }: { type: "desktop" | "mobile" }) {
  const pathname = usePathname();

  if (type === "mobile") {
    return (
      <div
        className="lg:hidden sticky top-0 z-10 flex gap-1 px-4 py-3 overflow-x-auto no-scrollbar scrollbar-hide select-none"
        style={{
          background: "rgba(10,10,10,0.85)",
          backdropFilter: "blur(24px) saturate(150%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 shrink-0 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 whitespace-nowrap"
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
    );
  }

  return (
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
  );
}