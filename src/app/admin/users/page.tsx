"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

/* ─────────────────────────────────────────
   Types
   ───────────────────────────────────────── */
interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  purchasedCount: number;
  createdAt: string; // ISO
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SummaryStats {
  totalStudents: number;
  totalAdmins: number;
  totalPurchases: number;
}

/* ─────────────────────────────────────────
   Helpers
   ───────────────────────────────────────── */
function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  return `${mo}mo ago`;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ─────────────────────────────────────────
   User row
   ───────────────────────────────────────── */
function UserRow({ user, isLast }: { user: AdminUser; isLast: boolean }) {
  const isAdmin = user.role === "admin";

  return (
    <tr
      style={{ borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)" }}
      className="group transition-colors duration-150 hover:bg-white/[0.015]"
    >
      {/* Name + email */}
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 text-xs font-bold"
            style={{
              background: isAdmin
                ? "rgba(245,158,11,0.12)"
                : "rgba(124,31,255,0.12)",
              border: isAdmin
                ? "1px solid rgba(245,158,11,0.25)"
                : "1px solid rgba(124,31,255,0.22)",
              color: isAdmin ? "#fbbf24" : "#b890ff",
            }}
          >
            {initials(user.name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
              {user.name}
            </p>
            <p className="text-[0.68rem] truncate" style={{ color: "var(--foreground-muted)" }}>
              {user.email}
            </p>
          </div>
        </div>
      </td>

      {/* Role badge */}
      <td className="py-4 px-4">
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.68rem] font-semibold tracking-wide uppercase"
          style={
            isAdmin
              ? { background: "rgba(245,158,11,0.1)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.25)" }
              : { background: "rgba(124,31,255,0.08)", color: "#b890ff", border: "1px solid rgba(124,31,255,0.2)" }
          }
        >
          {isAdmin ? "Admin" : "Student"}
        </span>
      </td>

      {/* Purchases */}
      <td className="py-4 px-4 hidden sm:table-cell">
        {user.purchasedCount > 0 ? (
          <div className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: "#34d399" }}>
              <path d="M2 3.5h8M4 1v2.5M8 1v2.5M2 5.5h8v4a1 1 0 01-1 1H3a1 1 0 01-1-1V5.5z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
            <span className="text-sm tabular-nums font-medium" style={{ color: "#34d399" }}>
              {user.purchasedCount}
            </span>
          </div>
        ) : (
          <span className="text-sm" style={{ color: "var(--foreground-disabled)" }}>—</span>
        )}
      </td>

      {/* Joined */}
      <td className="py-4 px-4 hidden md:table-cell">
        <div>
          <p className="text-xs tabular-nums" style={{ color: "var(--foreground-secondary)" }}>
            {fmtDate(user.createdAt)}
          </p>
          <p className="text-[0.65rem]" style={{ color: "var(--foreground-disabled)" }}>
            {timeAgo(user.createdAt)}
          </p>
        </div>
      </td>

      {/* ID */}
      <td className="py-4 px-5 hidden lg:table-cell text-right">
        <span
          className="text-[0.6rem] font-mono px-2 py-1 rounded-md"
          style={{ background: "rgba(255,255,255,0.04)", color: "var(--foreground-disabled)" }}
        >
          {user._id.slice(-8)}
        </span>
      </td>
    </tr>
  );
}

/* ─────────────────────────────────────────
   Page
   ───────────────────────────────────────── */
export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "student" | "admin">("all");

  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, limit: 50, total: 0, totalPages: 1 });
  const [stats, setStats] = useState<SummaryStats>({ totalStudents: 0, totalAdmins: 0, totalPurchases: 0 });

  /* ── Fetch users ─────────────────────────────────────────────────── */
  const fetchUsers = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users?page=${pageNum}&limit=50`);
      const data = await res.json() as {
        success: boolean;
        users?: AdminUser[];
        pagination?: PaginationMeta;
        stats?: SummaryStats;
        message?: string;
      };
      if (data.success && data.users) {
        setUsers(data.users);
        if (data.pagination) setPagination(data.pagination);
        if (data.stats) setStats(data.stats);
      } else {
        setError(data.message ?? "Failed to load users.");
      }
    } catch {
      setError("Network error. Could not reach the server.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  /* ── Filter (client-side on current page) ────────────────────────── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  /* ── Pagination handlers ─────────────────────────────────────────── */
  function goToPage(newPage: number) {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination((p) => ({ ...p, page: newPage }));
    fetchUsers(newPage);
  }

  return (
    <div className="space-y-7 max-w-[1200px]">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#9455ff", boxShadow: "0 0 6px #9455ff" }} />
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em]" style={{ color: "#9455ff88" }}>
              Admin — Users
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight" style={{ color: "var(--foreground)" }}>
            Registered{" "}
            <span style={{ background: "linear-gradient(135deg, #9455ff 20%, #c4a0ff 60%, #9455ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Users
            </span>
          </h1>
          <p className="text-sm mt-1.5" style={{ color: "var(--foreground-muted)" }}>
            All accounts registered on the platform
          </p>
        </div>
        <button
          onClick={() => fetchUsers(pagination.page)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 shrink-0 self-start"
          style={{
            background: "rgba(124,31,255,0.1)",
            border: "1px solid rgba(124,31,255,0.25)",
            color: "#b890ff",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={loading ? "animate-spin" : ""}>
            <path d="M11.5 6.5A5 5 0 106.5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Students", value: stats.totalStudents, color: "#9455ff", bg: "rgba(124,31,255,0.08)", border: "rgba(124,31,255,0.18)" },
          { label: "Admin Accounts", value: stats.totalAdmins,   color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.18)" },
          { label: "Total Purchases", value: stats.totalPurchases, color: "#34d399", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.18)" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: card.bg, border: `1px solid ${card.border}` }}
          >
            <div>
              {loading ? (
                <div className="h-7 w-12 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.08)" }} />
              ) : (
                <p className="font-display font-bold text-2xl" style={{ color: card.color }}>
                  {card.value.toLocaleString()}
                </p>
              )}
              <p className="text-xs font-medium mt-0.5" style={{ color: "var(--foreground-muted)" }}>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table card ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Toolbar */}
        <div
          className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Search */}
          <div className="relative flex-1">
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--foreground-disabled)" }}
            >
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm transition-all focus:outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "var(--foreground)",
              }}
            />
          </div>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as "all" | "student" | "admin")}
            className="rounded-xl px-3 py-2.5 text-sm transition-all focus:outline-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "var(--foreground)",
            }}
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="admin">Admins</option>
          </select>

          <span className="text-xs shrink-0" style={{ color: "var(--foreground-disabled)" }}>
            {loading ? "Loading…" : `${filtered.length} of ${pagination.total.toLocaleString()} users`}
          </span>
        </div>

        {/* Column headers */}
        <div
          className="grid px-5 py-2.5"
          style={{
            gridTemplateColumns: "1fr auto auto auto auto",
            background: "rgba(0,0,0,0.2)",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {[
            { label: "User", class: "" },
            { label: "Role", class: "" },
            { label: "Purchases", class: "hidden sm:block" },
            { label: "Joined", class: "hidden md:block" },
            { label: "ID", class: "hidden lg:block text-right" },
          ].map(({ label, class: cls }) => (
            <span
              key={label}
              className={`text-[0.6rem] font-bold uppercase tracking-widest ${cls}`}
              style={{ color: "var(--foreground-disabled)" }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
              ))}
            </div>
          ) : error ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm font-medium" style={{ color: "#f87171" }}>{error}</p>
              <button
                onClick={() => fetchUsers(pagination.page)}
                className="mt-3 text-xs font-semibold transition-colors hover:underline"
                style={{ color: "#9455ff" }}
              >
                Try again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                {users.length === 0 ? "No registered users yet." : "No users match your search."}
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[600px]">
              <tbody>
                {filtered.map((user, i) => (
                  <UserRow key={user._id} user={user} isLast={i === filtered.length - 1} />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer — pagination controls */}
        {!loading && !error && (
          <div
            className="px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <p className="text-xs" style={{ color: "var(--foreground-disabled)" }}>
              Page {pagination.page} of {pagination.totalPages} &mdash; showing {users.length} users
              {search || roleFilter !== "all" ? ` (${filtered.length} match filters)` : ""}
            </p>

            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:-translate-y-px"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    color: "var(--foreground-secondary)",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M7.5 2.5L4 6l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Previous
                </button>

                <span
                  className="text-xs tabular-nums px-2.5 py-1.5 rounded-lg font-medium"
                  style={{ background: "rgba(124,31,255,0.1)", color: "#b890ff", border: "1px solid rgba(124,31,255,0.2)" }}
                >
                  {pagination.page} / {pagination.totalPages}
                </span>

                <button
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:-translate-y-px"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    color: "var(--foreground-secondary)",
                  }}
                >
                  Next
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
