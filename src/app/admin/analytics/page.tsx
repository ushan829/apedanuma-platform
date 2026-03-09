"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

/* ─────────────────────────────────────────
   Types
   ───────────────────────────────────────── */
interface Overview {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  uniqueBuyers: number;
  revenueThisMonth: number;
  ordersThisMonth: number;
  revenueLastMonth: number;
  ordersLastMonth: number;
  totalPublishedResources: number;
}

interface MonthlyPoint {
  month: string; // "YYYY-MM"
  revenue: number;
  orders: number;
}

interface TopProduct {
  _id: string;
  title: string;
  subject: string;
  grade: number | null;
  price: number;
  sales: number;
  revenue: number;
}

interface SubjectRevenue {
  subject: string;
  revenue: number;
  orders: number;
}

interface RecentOrder {
  _id: string;
  userName: string;
  userEmail: string;
  resourceTitle: string;
  subject: string;
  grade: number | null;
  amount: number;
  paymentMethod: string;
  createdAt: string;
}

/* ─────────────────────────────────────────
   Helpers
   ───────────────────────────────────────── */
function fmtLKR(n: number): string {
  if (n >= 1_000_000) return `LKR ${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `LKR ${(n / 1_000).toFixed(1)}K`;
  return `LKR ${n.toLocaleString()}`;
}

function fmtLKRFull(n: number): string {
  return `LKR ${n.toLocaleString()}`;
}

function pctChange(current: number, previous: number): { pct: number; positive: boolean } | null {
  if (previous === 0) return null;
  const pct = Math.round(((current - previous) / previous) * 100);
  return { pct: Math.abs(pct), positive: pct >= 0 };
}

function monthLabel(ym: string): string {
  const [y, m] = ym.split("-");
  return new Date(+y, +m - 1).toLocaleDateString("en-US", { month: "short" });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-LK", {
    month: "short", day: "numeric", year: "numeric",
  });
}

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "#9455ff",
  Science:     "#34d399",
  English:     "#60a5fa",
  History:     "#fbbf24",
  ICT:         "#f472b6",
  Commerce:    "#fb923c",
  Geography:   "#a78bfa",
  Buddhism:    "#4ade80",
  Sinhala:     "#38bdf8",
  Tamil:       "#e879f9",
};

function subjectColor(subject: string): string {
  return SUBJECT_COLORS[subject] ?? "#94a3b8";
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card:     "Card",
  payhere:  "PayHere",
  genie:    "Genie",
  frimi:    "FriMi",
  manual:   "Manual",
};

/* ─────────────────────────────────────────
   Loading skeleton
   ───────────────────────────────────────── */
function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className}`}
      style={{ background: "rgba(255,255,255,0.06)", ...style }}
    />
  );
}

/* ─────────────────────────────────────────
   KPI card
   ───────────────────────────────────────── */
function KpiCard({
  label, value, delta, accentColor, accentBg, accentBorder, glowColor, icon, loading,
}: {
  label: string;
  value: string;
  delta?: { pct: number; positive: boolean } | null;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  glowColor: string;
  icon: React.ReactNode;
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
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: `0 0 32px ${glowColor} inset` }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}55 40%, ${accentColor}22 70%, transparent)`,
        }}
      />
      <div
        className="absolute -top-8 -right-8 rounded-full pointer-events-none"
        style={{
          width: 120, height: 120,
          background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
          filter: "blur(16px)",
        }}
      />

      <div
        className="flex items-center justify-center w-10 h-10 rounded-xl relative z-10"
        style={{ background: accentBg, border: `1px solid ${accentBorder}`, color: accentColor }}
      >
        {icon}
      </div>

      <div className="relative z-10">
        {loading ? (
          <>
            <Skeleton className="h-8 w-28 mb-1.5" />
            <Skeleton className="h-3 w-20" />
          </>
        ) : (
          <>
            <p className="font-display font-bold text-2xl xl:text-3xl tracking-tight leading-none" style={{ color: "var(--foreground)" }}>
              {value}
            </p>
            <p className="text-xs font-medium mt-1.5" style={{ color: "var(--foreground-secondary)" }}>
              {label}
            </p>
          </>
        )}
      </div>

      {!loading && delta !== undefined && delta !== null && (
        <div className="flex items-center gap-1.5 relative z-10 mt-auto">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: delta.positive ? "#34d399" : "#f87171" }}>
            <path
              d={delta.positive ? "M5 8V2M2 5l3-3 3 3" : "M5 2v6M2 5l3 3 3-3"}
              stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          <span className="text-[0.68rem] font-medium" style={{ color: delta.positive ? "#34d399" : "#f87171" }}>
            {delta.positive ? "+" : "-"}{delta.pct}% vs last month
          </span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Monthly revenue bar chart
   ───────────────────────────────────────── */
function RevenueChart({ data, loading }: { data: MonthlyPoint[]; loading: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxRev = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--foreground-muted)" }}>
            Revenue Trend
          </p>
          <p className="text-lg font-display font-semibold" style={{ color: "var(--foreground)" }}>
            Last 12 Months
          </p>
        </div>
        {!loading && hovered !== null && (
          <div
            className="rounded-xl px-3 py-2 text-right"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.18)" }}
          >
            <p className="text-xs font-semibold" style={{ color: "#fbbf24" }}>
              {new Date(data[hovered].month + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
            <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              {fmtLKRFull(data[hovered].revenue)}
            </p>
            <p className="text-[0.65rem]" style={{ color: "var(--foreground-muted)" }}>
              {data[hovered].orders} order{data[hovered].orders !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-end gap-2 h-36">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="flex-1" style={{ height: `${30 + Math.random() * 60}%` }} />
          ))}
        </div>
      ) : (
        <div className="flex items-end gap-1.5 sm:gap-2 h-36">
          {data.map((point, i) => {
            const heightPct = (point.revenue / maxRev) * 100;
            const isHovered = hovered === i;
            const isCurrentMonth = i === data.length - 1;
            return (
              <div
                key={point.month}
                className="flex-1 flex flex-col items-center gap-1.5 cursor-default"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="w-full relative rounded-t-md overflow-hidden" style={{ height: 112 }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-md transition-all duration-300"
                    style={{
                      height: `${Math.max(heightPct, point.revenue > 0 ? 4 : 1.5)}%`,
                      background: isCurrentMonth
                        ? "linear-gradient(180deg, #f59e0b, #d97706)"
                        : isHovered
                          ? "rgba(148,85,255,0.7)"
                          : "rgba(124,31,255,0.35)",
                      boxShadow: isCurrentMonth
                        ? "0 0 12px rgba(245,158,11,0.5)"
                        : isHovered
                          ? "0 0 10px rgba(148,85,255,0.5)"
                          : "none",
                    }}
                  />
                </div>
                <span
                  className="text-[0.5rem] sm:text-[0.55rem] font-medium"
                  style={{ color: isCurrentMonth ? "#f59e0b" : isHovered ? "#9455ff" : "var(--foreground-disabled)" }}
                >
                  {monthLabel(point.month)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {!loading && data.every((d) => d.revenue === 0) && (
        <p className="text-sm text-center" style={{ color: "var(--foreground-disabled)" }}>
          No completed orders yet — revenue will appear here once payments are processed.
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Revenue by subject bars
   ───────────────────────────────────────── */
function SubjectBreakdown({ data, loading }: { data: SubjectRevenue[]; loading: boolean }) {
  const maxRev = Math.max(...data.map((s) => s.revenue), 1);

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: "var(--foreground-muted)" }}>
          Revenue by Subject
        </p>
        <p className="text-[0.68rem]" style={{ color: "var(--foreground-disabled)" }}>
          All completed orders
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-9" />)}
        </div>
      ) : data.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--foreground-disabled)" }}>No sales data yet.</p>
      ) : (
        <div className="space-y-3.5">
          {data.map((item, i) => {
            const color = subjectColor(item.subject);
            const share = Math.round((item.revenue / maxRev) * 100);
            return (
              <div key={item.subject} className="flex items-center gap-3">
                <span className="text-xs w-4 text-right shrink-0" style={{ color: "var(--foreground-disabled)" }}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                      <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.subject}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs tabular-nums font-semibold" style={{ color }}>
                        {fmtLKR(item.revenue)}
                      </span>
                      <span className="text-[0.62rem] ml-1.5" style={{ color: "var(--foreground-disabled)" }}>
                        {item.orders} sale{item.orders !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="w-full rounded-full overflow-hidden" style={{ height: 4, background: "rgba(255,255,255,0.06)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(share, 2)}%`,
                        background: `linear-gradient(90deg, ${color}88, ${color})`,
                        boxShadow: `0 0 6px ${color}44`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Top products table
   ───────────────────────────────────────── */
function TopProducts({ data, loading }: { data: TopProduct[]; loading: boolean }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: "var(--foreground-muted)" }}>
          Top Selling Resources
        </p>
        <p className="text-[0.68rem]" style={{ color: "var(--foreground-disabled)" }}>
          Ranked by total revenue
        </p>
      </div>

      {loading ? (
        <div className="p-5 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
        </div>
      ) : data.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>No sales yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px]">
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                {["#", "Resource", "Grade", "Sales", "Revenue"].map((col, i) => (
                  <th
                    key={col}
                    className={`py-2.5 text-[0.6rem] font-bold uppercase tracking-widest text-left ${i === 0 ? "pl-5 pr-3 w-8" : i === 1 ? "px-3" : "px-4"}`}
                    style={{ color: "var(--foreground-disabled)" }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((product, i) => {
                const color = subjectColor(product.subject);
                return (
                  <tr
                    key={product._id}
                    className="transition-colors duration-150 hover:bg-white/[0.015]"
                    style={{ borderBottom: i === data.length - 1 ? "none" : "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <td className="py-3.5 pl-5 pr-3">
                      <span className="text-xs tabular-nums font-semibold" style={{ color: "var(--foreground-disabled)" }}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="text-sm font-medium leading-snug truncate max-w-[260px]" style={{ color: "var(--foreground)" }}>
                        {product.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                        <span className="text-[0.65rem]" style={{ color: "var(--foreground-disabled)" }}>
                          {product.subject}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {product.grade ? (
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-semibold"
                          style={{ background: "rgba(124,31,255,0.1)", color: "#b890ff", border: "1px solid rgba(124,31,255,0.2)" }}
                        >
                          G{product.grade}
                        </span>
                      ) : (
                        <span style={{ color: "var(--foreground-disabled)" }}>—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm tabular-nums font-semibold" style={{ color: "#34d399" }}>
                        {product.sales}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm tabular-nums font-semibold" style={{ color: "#fbbf24" }}>
                        {fmtLKR(product.revenue)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Recent orders table
   ───────────────────────────────────────── */
function RecentOrders({ data, loading }: { data: RecentOrder[]; loading: boolean }) {
  return (
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
            style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.22)" }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ color: "#34d399" }}>
              <rect x="1.5" y="3" width="10" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M1.5 6h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M4.5 2v2M8.5 2v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="font-display font-semibold text-sm" style={{ color: "var(--foreground)" }}>
            Recent Orders
          </h2>
          <span
            className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(52,211,153,0.08)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}
          >
            Completed
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-11" />)}
          </div>
        ) : data.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>No completed orders yet.</p>
          </div>
        ) : (
          <table className="w-full min-w-[680px]">
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                {["Buyer", "Resource", "Method", "Amount", "Date"].map((col, i) => (
                  <th
                    key={col}
                    className={`py-2.5 text-[0.6rem] font-bold uppercase tracking-widest text-left ${i === 0 ? "pl-5 pr-3" : "px-4"} ${i === 3 || i === 4 ? "text-right" : ""}`}
                    style={{ color: "var(--foreground-disabled)" }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((order, i) => {
                const color = subjectColor(order.subject);
                return (
                  <tr
                    key={order._id}
                    className="transition-colors duration-150 hover:bg-white/[0.015]"
                    style={{ borderBottom: i === data.length - 1 ? "none" : "1px solid rgba(255,255,255,0.04)" }}
                  >
                    {/* Buyer */}
                    <td className="py-3.5 pl-5 pr-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0 text-[0.6rem] font-bold"
                          style={{ background: "rgba(124,31,255,0.1)", border: "1px solid rgba(124,31,255,0.2)", color: "#b890ff" }}
                        >
                          {order.userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>{order.userName}</p>
                          <p className="text-[0.62rem] truncate" style={{ color: "var(--foreground-muted)" }}>{order.userEmail}</p>
                        </div>
                      </div>
                    </td>

                    {/* Resource */}
                    <td className="py-3.5 px-4">
                      <p className="text-xs truncate max-w-[200px] font-medium" style={{ color: "var(--foreground)" }}>
                        {order.resourceTitle}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                        <span className="text-[0.62rem]" style={{ color: "var(--foreground-disabled)" }}>
                          {order.subject}{order.grade ? ` · G${order.grade}` : ""}
                        </span>
                      </div>
                    </td>

                    {/* Payment method */}
                    <td className="py-3.5 px-4">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.62rem] font-semibold uppercase tracking-wide"
                        style={{ background: "rgba(255,255,255,0.05)", color: "var(--foreground-muted)", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        {PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm tabular-nums font-bold" style={{ color: "#fbbf24" }}>
                        {fmtLKRFull(order.amount)}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-right">
                      <p className="text-xs tabular-nums" style={{ color: "var(--foreground-secondary)" }}>{fmtDate(order.createdAt)}</p>
                      <p className="text-[0.62rem]" style={{ color: "var(--foreground-disabled)" }}>{timeAgo(order.createdAt)}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {!loading && data.length > 0 && (
        <div
          className="px-5 py-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <p className="text-xs" style={{ color: "var(--foreground-disabled)" }}>
            Showing {data.length} most recent completed orders
          </p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Page
   ───────────────────────────────────────── */
export default function AdminAnalyticsPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [monthly, setMonthly] = useState<MonthlyPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [bySubject, setBySubject] = useState<SubjectRevenue[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ── Fetch analytics ─────────────────────────────────────────────── */
  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Session cookie is sent automatically — middleware already verified auth.
      const res = await fetch("/api/admin/analytics");
      const data = await res.json() as {
        success: boolean;
        message?: string;
        overview?: Overview;
        monthly?: MonthlyPoint[];
        topProducts?: TopProduct[];
        bySubject?: SubjectRevenue[];
        recentOrders?: RecentOrder[];
      };
      if (data.success) {
        setOverview(data.overview!);
        setMonthly(data.monthly!);
        setTopProducts(data.topProducts!);
        setBySubject(data.bySubject!);
        setRecentOrders(data.recentOrders!);
      } else {
        setError(data.message ?? "Failed to load analytics.");
      }
    } catch {
      setError("Network error. Could not reach the server.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  /* ── KPI data ────────────────────────────────────────────────────── */
  const revenueDelta = useMemo(
    () => overview ? pctChange(overview.revenueThisMonth, overview.revenueLastMonth) : null,
    [overview]
  );
  const ordersDelta = useMemo(
    () => overview ? pctChange(overview.ordersThisMonth, overview.ordersLastMonth) : null,
    [overview]
  );


  return (
    <div className="space-y-8 max-w-[1200px]">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#f59e0b", boxShadow: "0 0 6px #f59e0b" }} />
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em]" style={{ color: "#f59e0b88" }}>
              Admin — Analytics
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight" style={{ color: "var(--foreground)" }}>
            Sales{" "}
            <span style={{ background: "linear-gradient(135deg, #f59e0b 20%, #fcd34d 60%, #f59e0b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Analytics
            </span>
          </h1>
          <p className="text-sm mt-1.5" style={{ color: "var(--foreground-muted)" }}>
            Revenue, orders, and product performance — all-time
          </p>
        </div>
        <button
          onClick={() => fetchAnalytics()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 shrink-0 self-start"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.22)", color: "#fbbf24" }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={loading ? "animate-spin" : ""}>
            <path d="M11.5 6.5A5 5 0 106.5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div
          className="rounded-xl px-5 py-4 flex items-center gap-3"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "#f87171", flexShrink: 0 }}>
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <p className="text-sm font-medium" style={{ color: "#f87171" }}>{error}</p>
          <button
            onClick={() => fetchAnalytics()}
            className="ml-auto text-xs font-semibold hover:underline"
            style={{ color: "#f87171" }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Total Revenue"
          value={overview ? fmtLKR(overview.totalRevenue) : "—"}
          delta={revenueDelta}
          accentColor="#f59e0b"
          accentBg="rgba(245,158,11,0.1)"
          accentBorder="rgba(245,158,11,0.22)"
          glowColor="rgba(245,158,11,0.15)"
          loading={loading}
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="5" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
              <path d="M2 9h16" stroke="currentColor" strokeWidth="1.4" />
              <path d="M6 13h2M12 13h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M6 3h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          }
        />
        <KpiCard
          label="Total Orders"
          value={overview ? overview.totalOrders.toLocaleString() : "—"}
          delta={ordersDelta}
          accentColor="#34d399"
          accentBg="rgba(16,185,129,0.1)"
          accentBorder="rgba(16,185,129,0.22)"
          glowColor="rgba(16,185,129,0.12)"
          loading={loading}
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
              <path d="M3 8.5h14" stroke="currentColor" strokeWidth="1.4" />
              <path d="M7 3v3M13 3v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M7 12h6M7 15h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          }
        />
        <KpiCard
          label="Avg Order Value"
          value={overview ? fmtLKR(overview.avgOrderValue) : "—"}
          accentColor="#9455ff"
          accentBg="rgba(124,31,255,0.1)"
          accentBorder="rgba(124,31,255,0.22)"
          glowColor="rgba(124,31,255,0.15)"
          loading={loading}
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 15L7 9l3.5 3.5 3-5L17 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 16h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          }
        />
        <KpiCard
          label="Unique Buyers"
          value={overview ? overview.uniqueBuyers.toLocaleString() : "—"}
          accentColor="#60a5fa"
          accentBg="rgba(59,130,246,0.1)"
          accentBorder="rgba(59,130,246,0.22)"
          glowColor="rgba(59,130,246,0.12)"
          loading={loading}
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="7.5" cy="6" r="3" stroke="currentColor" strokeWidth="1.4" />
              <path d="M1.5 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M13.5 9.5a2.5 2.5 0 100-5M18.5 17c0-2.5-1.8-4.8-4.5-5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          }
        />
      </div>

      {/* ── This month spotlight ── */}
      {!loading && overview && (overview.revenueThisMonth > 0 || overview.ordersThisMonth > 0) && (
        <div
          className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8"
          style={{
            background: "linear-gradient(135deg, rgba(245,158,11,0.06), rgba(124,31,255,0.06))",
            border: "1px solid rgba(245,158,11,0.15)",
          }}
        >
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-1" style={{ color: "#f59e0b88" }}>
              This Month
            </p>
            <p className="font-display font-bold text-2xl" style={{ color: "#fbbf24" }}>
              {fmtLKRFull(overview.revenueThisMonth)}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>
              {overview.ordersThisMonth} order{overview.ordersThisMonth !== 1 ? "s" : ""} completed
            </p>
          </div>
          <div className="h-px sm:h-10 sm:w-px" style={{ background: "rgba(245,158,11,0.15)" }} />
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
              Last Month
            </p>
            <p className="font-display font-bold text-2xl" style={{ color: "var(--foreground)" }}>
              {fmtLKRFull(overview.revenueLastMonth)}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>
              {overview.ordersLastMonth} order{overview.ordersLastMonth !== 1 ? "s" : ""}
            </p>
          </div>
          {revenueDelta !== null && (
            <>
              <div className="h-px sm:h-10 sm:w-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                  MoM Change
                </p>
                <p
                  className="font-display font-bold text-2xl"
                  style={{ color: revenueDelta.positive ? "#34d399" : "#f87171" }}
                >
                  {revenueDelta.positive ? "+" : "-"}{revenueDelta.pct}%
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>revenue growth</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Revenue chart (full width) ── */}
      <RevenueChart data={monthly.length > 0 ? monthly : Array.from({ length: 12 }).map((_, i) => {
        const now = new Date();
        const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
        return { month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, revenue: 0, orders: 0 };
      })} loading={loading} />

      {/* ── Top products + Subject breakdown ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        <TopProducts data={topProducts} loading={loading} />
        <SubjectBreakdown data={bySubject} loading={loading} />
      </div>

      {/* ── Recent orders ── */}
      <RecentOrders data={recentOrders} loading={loading} />

    </div>
  );
}
