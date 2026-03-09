"use client";

import { useState, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────
   Types
   ───────────────────────────────────────── */
interface AdminMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

/* ─────────────────────────────────────────
   Helpers
   ───────────────────────────────────────── */
function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl ${className}`}
      style={{ background: "rgba(255,255,255,0.05)" }}
    />
  );
}

/* ─────────────────────────────────────────
   Message Card
   ───────────────────────────────────────── */
function MessageCard({
  msg,
  onToggleRead,
  onDelete,
  toggling,
  deleting,
}: {
  msg: AdminMessage;
  onToggleRead: (id: string) => void;
  onDelete: (id: string, subject: string) => void;
  toggling: boolean;
  deleting: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: msg.isRead
          ? "rgba(255,255,255,0.02)"
          : "rgba(124,31,255,0.06)",
        border: msg.isRead
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(124,31,255,0.3)",
        boxShadow: msg.isRead
          ? "none"
          : "0 0 20px rgba(124,31,255,0.08), inset 0 0 20px rgba(124,31,255,0.03)",
      }}
    >
      {/* Unread accent bar */}
      {!msg.isRead && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ background: "linear-gradient(180deg, #9455ff, #7c1fff)" }}
        />
      )}

      <div className={`p-5 ${!msg.isRead ? "pl-6" : ""}`}>

        {/* ── Header row ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              {/* Sender avatar */}
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold shrink-0"
                style={{
                  background: msg.isRead
                    ? "rgba(255,255,255,0.06)"
                    : "linear-gradient(135deg, rgba(124,31,255,0.35), rgba(87,0,190,0.5))",
                  border: msg.isRead
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(124,31,255,0.4)",
                  color: msg.isRead ? "var(--foreground-muted)" : "#c4a0ff",
                }}
              >
                {msg.name.charAt(0).toUpperCase()}
              </span>

              <div>
                <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  {msg.name}
                </span>
                <span className="text-sm ml-2" style={{ color: "var(--foreground-muted)" }}>
                  &lt;{msg.email}&gt;
                </span>
              </div>

              {!msg.isRead && (
                <span
                  className="inline-flex items-center gap-1 text-[0.6rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0"
                  style={{
                    background: "rgba(124,31,255,0.2)",
                    color: "#b890ff",
                    border: "1px solid rgba(124,31,255,0.35)",
                  }}
                >
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: "#9455ff" }}
                  />
                  Unread
                </span>
              )}
            </div>

            <p className="text-sm font-semibold truncate" style={{ color: msg.isRead ? "var(--foreground-secondary)" : "var(--foreground)" }}>
              {msg.subject}
            </p>
          </div>

          {/* Date */}
          <span className="text-xs shrink-0" style={{ color: "var(--foreground-disabled)" }}>
            {formatDate(msg.createdAt)}
          </span>
        </div>

        {/* ── Message body ── */}
        <div className="mt-3">
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "var(--foreground-secondary)",
              display: expanded ? "block" : "-webkit-box",
              WebkitLineClamp: expanded ? undefined : 2,
              WebkitBoxOrient: "vertical",
              overflow: expanded ? "visible" : "hidden",
            } as React.CSSProperties}
          >
            {msg.message}
          </p>
          {msg.message.length > 120 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs font-medium mt-1.5 transition-colors duration-200 hover:text-[#b890ff]"
              style={{ color: "#9455ff" }}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* ── Action row ── */}
        <div className="flex items-center gap-2.5 mt-4 pt-4 flex-wrap" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {/* Reply via email */}
          <a
            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:-translate-y-px"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--foreground-secondary)",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <rect x="1" y="2.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M1 4.5l4.5 2.8a1 1 0 001 0L11 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Reply
          </a>

          {/* Mark read / unread */}
          <button
            onClick={() => onToggleRead(msg._id)}
            disabled={toggling}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: msg.isRead ? "rgba(124,31,255,0.08)" : "rgba(52,211,153,0.08)",
              border: msg.isRead ? "1px solid rgba(124,31,255,0.2)" : "1px solid rgba(52,211,153,0.2)",
              color: msg.isRead ? "#9455ff" : "#34d399",
            }}
          >
            {toggling ? (
              <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="7 7" />
              </svg>
            ) : msg.isRead ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="6" cy="6" r="1.5" fill="currentColor" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M4 6l1.5 1.5L8 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {msg.isRead ? "Mark Unread" : "Mark as Read"}
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(msg._id, msg.subject)}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            style={{
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.18)",
              color: "#f87171",
            }}
          >
            {deleting ? (
              <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="7 7" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 3h8M5 3V2h2v1M4.5 3v6.5M7.5 3v6.5M3 3l.5 7h5l.5-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Page
   ───────────────────────────────────────── */
export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [filter,   setFilter]   = useState<"all" | "unread" | "read">("all");

  /* ── Action loading state per-message ── */
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  /* ── Fetch ── */
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/messages");
      const json = await res.json() as { success: boolean; messages?: AdminMessage[]; message?: string };
      if (!json.success) throw new Error(json.message ?? "Failed to load.");
      setMessages(json.messages ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── Toggle read ── */
  async function handleToggleRead(id: string) {
    setToggling(id);
    try {
      const res  = await fetch(`/api/admin/messages/${id}`, { method: "PATCH" });
      const json = await res.json() as { success: boolean; isRead?: boolean };
      if (json.success) {
        setMessages((prev) =>
          prev.map((m) => m._id === id ? { ...m, isRead: json.isRead! } : m)
        );
      }
    } catch { /* silent */ }
    setToggling(null);
  }

  /* ── Delete ── */
  async function handleDelete(id: string, subject: string) {
    if (!confirm(`Delete message "${subject}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res  = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      const json = await res.json() as { success: boolean };
      if (json.success) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
      }
    } catch { /* silent */ }
    setDeleting(null);
  }

  /* ── Filtered list ── */
  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.isRead;
    if (filter === "read")   return m.isRead;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  /* ── Render ── */
  return (
    <div className="space-y-7 max-w-[900px]">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display font-bold text-2xl" style={{ color: "var(--foreground)" }}>
              Inbox
            </h1>
            {unreadCount > 0 && (
              <span
                className="flex items-center justify-center min-w-[1.4rem] h-[1.4rem] rounded-full text-[0.65rem] font-bold px-1.5"
                style={{
                  background: "linear-gradient(135deg, #7c1fff, #9455ff)",
                  color: "#fff",
                  boxShadow: "0 0 10px rgba(124,31,255,0.5)",
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
            {messages.length} total · {unreadCount} unread
          </p>
        </div>

        {/* Refresh */}
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "var(--foreground-secondary)",
          }}
        >
          <svg className={loading ? "animate-spin" : ""} width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M12 7A5 5 0 112 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M12 3v4h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Filter chips ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "unread", "read"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition-all duration-200"
            style={{
              background: filter === f ? "rgba(124,31,255,0.18)" : "rgba(255,255,255,0.04)",
              border: filter === f ? "1px solid rgba(124,31,255,0.4)" : "1px solid rgba(255,255,255,0.07)",
              color: filter === f ? "#b890ff" : "var(--foreground-muted)",
            }}
          >
            {f === "all" ? `All (${messages.length})` : f === "unread" ? `Unread (${unreadCount})` : `Read (${messages.length - unreadCount})`}
          </button>
        ))}
      </div>

      {/* ── Error ── */}
      {error && (
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "#f87171" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          {error}
          <button onClick={load} className="ml-auto underline underline-offset-2 text-xs">Retry</button>
        </div>
      )}

      {/* ── Loading skeletons ── */}
      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && filtered.length === 0 && (
        <div
          className="flex flex-col items-center justify-center gap-4 rounded-2xl py-16 text-center"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="flex items-center justify-center w-14 h-14 rounded-2xl"
            style={{ background: "rgba(124,31,255,0.1)", border: "1px solid rgba(124,31,255,0.2)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: "#9455ff" }}>
              <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2 9l9.47 5.84a1 1 0 001.06 0L22 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
              {filter === "all" ? "No messages yet" : `No ${filter} messages`}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>
              {filter === "all"
                ? "When someone submits the contact form, their message will appear here."
                : `Switch to "All" to see all messages.`}
            </p>
          </div>
        </div>
      )}

      {/* ── Message list ── */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <MessageCard
              key={msg._id}
              msg={msg}
              onToggleRead={handleToggleRead}
              onDelete={handleDelete}
              toggling={toggling === msg._id}
              deleting={deleting === msg._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
