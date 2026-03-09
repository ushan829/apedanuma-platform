"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
   ───────────────────────────────────────── */
interface OverviewStats {
  totalStudents: number;
  totalRevenue: number;
  premiumResources: number;
  totalDownloads: number;
}

interface WeeklyDay {
  date: string;   // "YYYY-MM-DD"
  amount: number;
}

interface TopSubject {
  subject: string;
  downloads: number;
}

interface ActivityEvent {
  type: "register" | "purchase";
  user: string;
  email: string;
  item: string;
  time: string; // ISO
}

/* ─────────────────────────────────────────
   Helpers
   ───────────────────────────────────────── */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d !== 1 ? "s" : ""} ago`;
}

function fmtLKR(n: number): string {
  if (n >= 1_000_000) return `LKR ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `LKR ${(n / 1_000).toFixed(0)}K`;
  return `LKR ${n}`;
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function dayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3);
}

/* ─────────────────────────────────────────
   Stat card
   ───────────────────────────────────────── */
const STAT_META = [
  {
    key: "totalStudents" as keyof OverviewStats,
    label: "Total Students",
    format: (n: number) => fmtNum(n),
    accentColor: "#9455ff",
    accentBg: "rgba(124,31,255,0.1)",
    accentBorder: "rgba(124,31,255,0.22)",
    glowColor: "rgba(124,31,255,0.15)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="7.5" cy="6" r="3" stroke="currentColor" strokeWidth="1.4" />
        <path d="M1.5 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M13.5 9.5a2.5 2.5 0 100-5M18.5 17c0-2.5-1.8-4.8-4.5-5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "totalRevenue" as keyof OverviewStats,
    label: "Total Revenue",
    format: (n: number) => fmtLKR(n),
    accentColor: "#f59e0b",
    accentBg: "rgba(245,158,11,0.1)",
    accentBorder: "rgba(245,158,11,0.22)",
    glowColor: "rgba(245,158,11,0.15)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="5" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2 9h16" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6 13h2M12 13h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M6 3h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "premiumResources" as keyof OverviewStats,
    label: "Premium Resources",
    format: (n: number) => fmtNum(n),
    accentColor: "#34d399",
    accentBg: "rgba(16,185,129,0.1)",
    accentBorder: "rgba(16,185,129,0.22)",
    glowColor: "rgba(16,185,129,0.12)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v2H3V5z" fill="currentColor" opacity="0.35" />
        <rect x="3" y="7" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M7 12h6M7 15h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "totalDownloads" as keyof OverviewStats,
    label: "Total Downloads",
    format: (n: number) => fmtNum(n),
    accentColor: "#60a5fa",
    accentBg: "rgba(59,130,246,0.1)",
    accentBorder: "rgba(59,130,246,0.22)",
    glowColor: "rgba(59,130,246,0.12)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 3v10m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 15v1.5A1.5 1.5 0 005.5 18h9a1.5 1.5 0 001.5-1.5V15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
] as const;

function StatCard({
  meta,
  value,
  loading,
}: {
  meta: (typeof STAT_META)[number];
  value: number;
  loading: boolean;
}) {
  return (
    <div
      className="group relative rounded-2xl p-5 flex flex-col gap-4 overflow-hidden cursor-default transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ boxShadow: `0 0 32px ${meta.glowColor} inset` }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${meta.accentColor}55 40%, ${meta.accentColor}28 65%, transparent)`,
        }}
      />
      <div
        className="absolute -top-6 -right-6 rounded-full pointer-events-none"
        style={{
          width: 100, height: 100,
          background: `radial-gradient(circle, ${meta.accentColor}20 0%, transparent 70%)`,
          filter: "blur(12px)",
        }}
      />

      <div
        className="flex items-center justify-center w-10 h-10 rounded-xl relative z-10"
        style={{
          background: meta.accentBg,
          border: `1px solid ${meta.accentBorder}`,
          color: meta.accentColor,
        }}
      >
        {meta.icon}
      </div>

      <div className="relative z-10">
        {loading ? (
          <div
            className="h-8 w-24 rounded-lg animate-pulse"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
        ) : (
          <p
            className="font-display font-bold text-2xl xl:text-3xl tracking-tight leading-none"
            style={{ color: "var(--foreground)" }}
          >
            {meta.format(value)}
          </p>
        )}
        <p className="text-xs font-medium mt-1.5" style={{ color: "var(--foreground-secondary)" }}>
          {meta.label}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Revenue sparkline
   ───────────────────────────────────────── */
function RevenueSparkline({
  days,
  loading,
}: {
  days: WeeklyDay[];
  loading: boolean;
}) {
  const values = days.map((d) => d.amount);
  const maxVal = Math.max(...values, 1);
  const weekTotal = values.reduce((a, b) => a + b, 0);

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--foreground-muted)" }}>
            Weekly Revenue
          </p>
          {loading ? (
            <div className="h-7 w-32 rounded-lg animate-pulse mt-1" style={{ background: "rgba(255,255,255,0.08)" }} />
          ) : (
            <p className="text-xl font-display font-bold mt-0.5" style={{ color: "var(--foreground)" }}>
              {fmtLKR(weekTotal)}
            </p>
          )}
        </div>
        {weekTotal > 0 && !loading && (
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}
          >
            This week
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-end gap-2 h-[72px]">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className="w-full rounded-t-sm animate-pulse"
                style={{ height: `${20 + Math.random() * 40}px`, background: "rgba(255,255,255,0.06)" }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-end gap-2 h-[72px]">
          {days.map((day, i) => {
            const heightPct = (day.amount / maxVal) * 100;
            const isToday = i === days.length - 1;
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full relative rounded-t-sm overflow-hidden" style={{ height: 56 }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-sm"
                    style={{
                      height: `${Math.max(heightPct, day.amount > 0 ? 6 : 2)}%`,
                      background: isToday
                        ? "linear-gradient(180deg, #f59e0b, #d97706)"
                        : "rgba(124,31,255,0.35)",
                      boxShadow: isToday ? "0 0 8px rgba(245,158,11,0.4)" : "none",
                    }}
                  />
                </div>
                <span
                  className="text-[0.55rem] font-medium"
                  style={{ color: isToday ? "#f59e0b" : "var(--foreground-disabled)" }}
                >
                  {dayLabel(day.date)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {!loading && weekTotal === 0 && (
        <p className="text-xs text-center mt-2" style={{ color: "var(--foreground-disabled)" }}>
          No revenue recorded this week
        </p>
      )}
    </div>
  );
}


/* ─────────────────────────────────────────
   Activity row
   ───────────────────────────────────────── */
const ACTION_STYLES = {
  purchase: {
    label: "Purchase",
    color: "#fbbf24",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
  },
  register: {
    label: "Registered",
    color: "#34d399",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.25)",
  },
};

function ActivityRow({
  row,
  isLast,
}: {
  row: ActivityEvent;
  isLast: boolean;
}) {
  const style = ACTION_STYLES[row.type];
  return (
    <tr
      className="group transition-colors duration-150"
      style={{ borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)" }}
    >
      <td className="py-3.5 px-5">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 text-xs font-bold"
            style={{
              background: "rgba(124,31,255,0.12)",
              border: "1px solid rgba(124,31,255,0.2)",
              color: "#b890ff",
            }}
          >
            {row.user.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
              {row.user}
            </p>
            <p className="text-[0.68rem] truncate" style={{ color: "var(--foreground-muted)" }}>
              {row.email}
            </p>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.68rem] font-semibold tracking-wide uppercase"
          style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}
        >
          {style.label}
        </span>
      </td>
      <td className="py-3.5 px-4 hidden sm:table-cell">
        <p className="text-sm truncate max-w-[200px]" style={{ color: "var(--foreground-secondary)" }}>
          {row.item}
        </p>
      </td>
      <td className="py-3.5 px-5 text-right hidden md:table-cell">
        <span className="text-xs tabular-nums" style={{ color: "var(--foreground-muted)" }}>
          {timeAgo(row.time)}
        </span>
      </td>
    </tr>
  );
}

/* ─────────────────────────────────────────
   Page
   ───────────────────────────────────────── */
export default function AdminDashboardPage() {
  const [stats, setStats] = useState<OverviewStats>({ totalStudents: 0, totalRevenue: 0, premiumResources: 0, totalDownloads: 0 });
  const [weeklyRevenue, setWeeklyRevenue] = useState<WeeklyDay[]>([]);
  const [topSubjects, setTopSubjects] = useState<TopSubject[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityEvent[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  /* ── Fetch overview data ─────────────────────────────────────────── */
  const fetchOverview = useCallback(async () => {
    setDataLoading(true);
    try {
      // Session cookie is sent automatically — middleware already verified auth.
      const res = await fetch("/api/admin/overview");
      const data = await res.json() as {
        success: boolean;
        stats?: OverviewStats;
        weeklyRevenue?: WeeklyDay[];
        topSubjects?: TopSubject[];
        recentActivity?: ActivityEvent[];
      };
      if (data.success) {
        setStats(data.stats!);
        setWeeklyRevenue(data.weeklyRevenue!);
        setTopSubjects(data.topSubjects!);
        setRecentActivity(data.recentActivity!);
      }
    } catch { /* silent */ }
    setDataLoading(false);
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  /* ── Top subjects: compute share % relative to max ──────────────── */
  const maxDownloads = topSubjects.length > 0 ? topSubjects[0].downloads : 1;

  return (
    <div className="space-y-8 max-w-[1200px]">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "#f59e0b", boxShadow: "0 0 6px #f59e0b" }}
            />
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em]" style={{ color: "#f59e0b99" }}>
              Admin — Ape Danuma
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight" style={{ color: "var(--foreground)" }}>
            Command{" "}
            <span style={{ background: "linear-gradient(135deg, #f59e0b 20%, #fcd34d 60%, #f59e0b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Center
            </span>
          </h1>
          <p className="text-sm mt-1.5" style={{ color: "var(--foreground-muted)" }}>
            Platform Overview &amp; Analytics — {new Date().toLocaleDateString("en-LK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <Link
          href="/admin/upload"
          className="relative inline-flex items-center gap-2.5 rounded-xl px-5 py-3 font-bold text-sm overflow-hidden shrink-0 self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b] transition-all duration-300 hover:-translate-y-1"
          style={{
            background: "linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #d97706 100%)",
            backgroundSize: "200% auto",
            boxShadow: "0 0 28px rgba(245,158,11,0.4), 0 4px 16px rgba(0,0,0,0.35)",
            color: "#0a0a0a",
          }}
        >
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 3s linear infinite",
            }}
          />
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" className="relative z-10">
            <path d="M7.5 1v13M1 7.5h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className="relative z-10">Upload New Material</span>
        </Link>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_META.map((meta) => (
          <StatCard
            key={meta.key}
            meta={meta}
            value={stats[meta.key]}
            loading={dataLoading}
          />
        ))}
      </div>

      {/* ── Analytics row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* Revenue sparkline */}
        <RevenueSparkline days={weeklyRevenue} loading={dataLoading} />

        {/* Top subjects */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--foreground-muted)" }}>
            Top Subjects by Downloads
          </p>
          {dataLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
              ))}
            </div>
          ) : topSubjects.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--foreground-disabled)" }}>No download data yet.</p>
          ) : (
            <div className="space-y-4">
              {topSubjects.map((item, i) => (
                <div key={item.subject} className="flex items-center gap-4">
                  <span className="text-xs w-4 text-right shrink-0 tabular-nums" style={{ color: "var(--foreground-disabled)" }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.subject}</span>
                      <span className="text-xs tabular-nums" style={{ color: "var(--foreground-muted)" }}>
                        {item.downloads.toLocaleString()} dl
                      </span>
                    </div>
                    <div className="w-full rounded-full overflow-hidden" style={{ height: 4, background: "rgba(255,255,255,0.06)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(4, Math.round((item.downloads / maxDownloads) * 100))}%`,
                          background: `linear-gradient(90deg, ${["#9455ff","#34d399","#fbbf24","#60a5fa","#f472b6"][i % 5]}88, ${["#9455ff","#34d399","#fbbf24","#60a5fa","#f472b6"][i % 5]})`,
                          boxShadow: `0 0 6px ${["#9455ff44","#34d39944","#fbbf2444","#60a5fa44","#f472b644"][i % 5]}`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-lg"
              style={{ background: "rgba(124,31,255,0.12)", border: "1px solid rgba(124,31,255,0.22)" }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ color: "#9455ff" }}>
                <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M4.5 6.5h4M6.5 4.5v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="font-display font-semibold text-sm" style={{ color: "var(--foreground)" }}>
              Recent Activity
            </h2>
            <span
              className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(124,31,255,0.1)", color: "#9455ff", border: "1px solid rgba(124,31,255,0.2)" }}
            >
              Live
            </span>
          </div>
          <Link href="/admin/users" className="text-xs font-semibold transition-colors hover:text-[#c4a0ff]" style={{ color: "#9455ff" }}>
            View all →
          </Link>
        </div>

        <div className="grid px-5 py-2" style={{ gridTemplateColumns: "1fr auto auto auto", background: "rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          {["User", "Action", "Item", "Time"].map((col, i) => (
            <span
              key={col}
              className={`text-[0.6rem] font-bold uppercase tracking-widest ${i === 2 ? "hidden sm:block" : ""} ${i === 3 ? "hidden md:block text-right" : ""}`}
              style={{ color: "var(--foreground-disabled)" }}
            >
              {col}
            </span>
          ))}
        </div>

        <div className="overflow-x-auto">
          {dataLoading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>No activity yet. Upload a resource or wait for registrations.</p>
            </div>
          ) : (
            <table className="w-full min-w-[520px]">
              <tbody>
                {recentActivity.map((row, i) => (
                  <ActivityRow
                    key={`${row.type}-${row.time}-${i}`}
                    row={row}
                    isLast={i === recentActivity.length - 1}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <p className="text-xs" style={{ color: "var(--foreground-disabled)" }}>
            {dataLoading ? "Loading…" : `Showing ${recentActivity.length} most recent events`}
          </p>
          <Link href="/admin/users" className="text-xs font-medium transition-colors hover:text-white" style={{ color: "var(--foreground-muted)" }}>
            All users →
          </Link>
        </div>
      </div>

      {/* ── Quick action cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Manage Content",
            desc: "Edit, unpublish, or delete existing resources and PDFs.",
            href: "/admin/manage",
            icon: (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: "#9455ff" }}>
                <path d="M2 4a1 1 0 011-1h12a1 1 0 011 1v11a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.3" />
                <path d="M6 8h6M6 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            ),
            accent: "#9455ff",
            accentBg: "rgba(124,31,255,0.08)",
            accentBorder: "rgba(124,31,255,0.18)",
          },
          {
            label: "View All Users",
            desc: "Browse registered students, manage roles and access.",
            href: "/admin/users",
            icon: (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: "#34d399" }}>
                <circle cx="7" cy="6" r="3" stroke="currentColor" strokeWidth="1.3" />
                <path d="M1 16c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M13 9v5M15.5 11.5h-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            ),
            accent: "#34d399",
            accentBg: "rgba(16,185,129,0.08)",
            accentBorder: "rgba(16,185,129,0.18)",
          },
          {
            label: "Sales Analytics",
            desc: "Deep dive into revenue trends, top products, and cohorts.",
            href: "/admin/analytics",
            icon: (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: "#fbbf24" }}>
                <path d="M2 15L6 9l3.5 3.5 3-5L16 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 16h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            ),
            accent: "#fbbf24",
            accentBg: "rgba(245,158,11,0.08)",
            accentBorder: "rgba(245,158,11,0.18)",
          },
        ].map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group relative flex flex-col gap-3 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: card.accentBg, border: `1px solid ${card.accentBorder}` }}
          >
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${card.accentBorder}` }}
            >
              {card.icon}
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{card.label}</p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--foreground-muted)" }}>{card.desc}</p>
            </div>
            <span className="text-xs font-semibold self-start transition-colors" style={{ color: card.accent }}>
              Go →
            </span>
          </Link>
        ))}
      </div>

    </div>
  );
}
