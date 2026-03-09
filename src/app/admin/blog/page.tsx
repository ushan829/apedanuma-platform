"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ── Types ── */
interface PostRow {
  _id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  isPublished: boolean;
  viewCount: number;
  readingTimeMinutes: number;
  publishedAt: string | null;
  createdAt: string;
}

interface SubscriberRow {
  _id: string;
  email: string;
  createdAt: string;
}

interface BlogData {
  posts: PostRow[];
  subscriberCount: number;
  subscribers: SubscriberRow[];
}

/* ── Helpers ── */
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ background: "rgba(255,255,255,0.06)", ...style }}
    />
  );
}

/* ── Main page ── */
export default function AdminBlogPage() {
  const [data, setData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"posts" | "subscribers">("posts");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Session cookie is sent automatically — middleware already verified auth.
      const res = await fetch("/api/admin/blog");
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setData(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load blog data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setDeleting(null);
    }
  }

  const filtered = data?.posts.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }) ?? [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className="font-display font-bold text-2xl"
            style={{ color: "var(--foreground)" }}
          >
            Blog &amp; Newsletter
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>
            Manage posts, track reads, and view subscriber emails.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #7c1fff, #5700be)",
            color: "#fff",
            boxShadow: "0 0 20px rgba(124,31,255,0.3)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          New Post
        </Link>
      </div>

      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Posts",
            value: loading ? null : data?.posts.length ?? 0,
            sub: loading ? null : `${data?.posts.filter((p) => p.isPublished).length ?? 0} published`,
            color: "#9455ff",
          },
          {
            label: "Total Views",
            value: loading ? null : data?.posts.reduce((s, p) => s + p.viewCount, 0) ?? 0,
            sub: "across all posts",
            color: "#f59e0b",
          },
          {
            label: "Subscribers",
            value: loading ? null : data?.subscriberCount ?? 0,
            sub: "active newsletter",
            color: "#34d399",
          },
        ].map(({ label, value, sub, color }) => (
          <div
            key={label}
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--foreground-muted)" }}>
              {label}
            </p>
            {value === null ? (
              <Skeleton className="h-7 w-16 mb-1" />
            ) : (
              <p className="font-display font-bold text-2xl" style={{ color }}>
                {value.toLocaleString()}
              </p>
            )}
            <p className="text-xs mt-1" style={{ color: "var(--foreground-muted)" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 rounded-xl p-1 w-fit"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {(["posts", "subscribers"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200"
            style={{
              background: tab === t ? "linear-gradient(135deg, rgba(124,31,255,0.2), rgba(87,0,190,0.15))" : "transparent",
              color: tab === t ? "#c4a0ff" : "var(--foreground-muted)",
              border: tab === t ? "1px solid rgba(124,31,255,0.25)" : "1px solid transparent",
            }}
          >
            {t === "subscribers"
              ? `Subscribers${data ? ` (${data.subscriberCount})` : ""}`
              : `Posts${data ? ` (${data.posts.length})` : ""}`}
          </button>
        ))}
      </div>

      {/* ── Posts tab ── */}
      {tab === "posts" && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Search bar */}
          <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <input
              className="input w-full sm:w-72 text-sm"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Title", "Category", "Status", "Views", "Published", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--foreground-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        {[160, 100, 70, 40, 80, 90].map((w, j) => (
                          <td key={j} className="px-5 py-4">
                            <Skeleton className={`h-4 w-${w}`} style={{ width: w }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  : filtered.length === 0
                  ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-sm" style={{ color: "var(--foreground-muted)" }}>
                        {search ? "No posts match your search." : "No posts yet. Create your first post."}
                      </td>
                    </tr>
                  )
                  : filtered.map((post) => (
                    <tr
                      key={post._id}
                      className="transition-colors duration-150 hover:bg-white/[0.02]"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium line-clamp-1" style={{ color: "var(--foreground)" }}>
                          {post.title}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                          /{post.slug}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{
                            background: "rgba(124,31,255,0.12)",
                            color: "#c4a0ff",
                            border: "1px solid rgba(124,31,255,0.22)",
                          }}
                        >
                          {post.category}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={post.isPublished
                            ? { background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.22)" }
                            : { background: "rgba(255,255,255,0.06)", color: "var(--foreground-muted)", border: "1px solid rgba(255,255,255,0.1)" }
                          }
                        >
                          {post.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-5 py-4" style={{ color: "var(--foreground-secondary)" }}>
                        {post.viewCount}
                      </td>
                      <td className="px-5 py-4" style={{ color: "var(--foreground-muted)" }}>
                        {post.publishedAt ? fmtDate(post.publishedAt) : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/blog/${post._id}`}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:bg-white/[0.06]"
                            style={{ color: "#9455ff", border: "1px solid rgba(124,31,255,0.22)" }}
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:bg-white/[0.04]"
                            style={{ color: "var(--foreground-muted)", border: "1px solid rgba(255,255,255,0.08)" }}
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDelete(post._id, post.title)}
                            disabled={deleting === post._id}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:bg-red-500/10 disabled:opacity-40"
                            style={{ color: "#f87171", border: "1px solid rgba(239,68,68,0.18)" }}
                          >
                            {deleting === post._id ? "..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Subscribers tab ── */}
      {tab === "subscribers" && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Showing latest 50 active subscribers
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["#", "Email", "Subscribed"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--foreground-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        {[30, 220, 100].map((w, j) => (
                          <td key={j} className="px-5 py-4">
                            <Skeleton className="h-4" style={{ width: w }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  : (data?.subscribers ?? []).length === 0
                  ? (
                    <tr>
                      <td colSpan={3} className="px-5 py-12 text-center text-sm" style={{ color: "var(--foreground-muted)" }}>
                        No subscribers yet.
                      </td>
                    </tr>
                  )
                  : (data?.subscribers ?? []).map((s, i) => (
                    <tr
                      key={s._id}
                      className="transition-colors hover:bg-white/[0.02]"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <td className="px-5 py-4 text-xs" style={{ color: "var(--foreground-muted)" }}>
                        {i + 1}
                      </td>
                      <td className="px-5 py-4 font-medium" style={{ color: "var(--foreground)" }}>
                        {s.email}
                      </td>
                      <td className="px-5 py-4" style={{ color: "var(--foreground-muted)" }}>
                        {fmtDate(s.createdAt)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
