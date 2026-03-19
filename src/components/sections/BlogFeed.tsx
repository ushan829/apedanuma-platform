"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { PostSummary } from "@/app/blog/page";

/* ── Category colours ── */
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Study Tips":          { bg: "rgba(124,31,255,0.12)", text: "#c4a0ff", border: "rgba(124,31,255,0.25)" },
  "Exam Strategy":       { bg: "rgba(245,158,11,0.11)", text: "#fbbf24", border: "rgba(245,158,11,0.28)" },
  "Subject Guide":       { bg: "rgba(59,130,246,0.12)", text: "#93c5fd", border: "rgba(59,130,246,0.25)" },
  "Past Paper Analysis": { bg: "rgba(239,68,68,0.11)", text: "#fca5a5", border: "rgba(239,68,68,0.24)" },
  "Platform Update":     { bg: "rgba(16,185,129,0.11)", text: "#34d399", border: "rgba(16,185,129,0.24)" },
  "Student Success":     { bg: "rgba(16,185,129,0.11)", text: "#34d399", border: "rgba(16,185,129,0.24)" },
  "Parent Guide":        { bg: "rgba(245,158,11,0.11)", text: "#fbbf24", border: "rgba(245,158,11,0.28)" },
  "General":             { bg: "rgba(255,255,255,0.06)", text: "var(--foreground-muted)", border: "rgba(255,255,255,0.1)" },
};

function getCatStyle(cat: string) {
  return CATEGORY_COLORS[cat] ?? CATEGORY_COLORS["General"];
}

function CategoryBadge({ category, small }: { category: string; small?: boolean }) {
  const s = getCatStyle(category);
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full tracking-wide uppercase ${
        small ? "text-[0.6rem] px-2 py-0.5" : "text-[0.65rem] px-2.5 py-1"
      }`}
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      {category}
    </span>
  );
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ── Post card ── */
function PostCard({ post }: { post: PostSummary }) {
  const s = getCatStyle(post.category);
  return (
    <article
      className="group flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
      }}
    >
      {/* Cover image or coloured accent line */}
      {post.coverImage ? (
        <Link href={`/blog/${post.slug}`} className="block relative w-full overflow-hidden" style={{ height: 180 }}>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(10,10,10,0.6) 100%)" }} />
          {/* Category badge overlay */}
          <div className="absolute bottom-3 left-3">
            <CategoryBadge category={post.category} small />
          </div>
        </Link>
      ) : (
        <div
          className="h-0.5 w-full shrink-0"
          style={{ background: `linear-gradient(90deg, ${s.text}44, transparent)` }}
        />
      )}

      <div className="flex flex-col flex-1 p-5">
        {/* Category — only show here when no cover image (covered by overlay otherwise) */}
        {!post.coverImage && (
          <div className="mb-3">
            <CategoryBadge category={post.category} small />
          </div>
        )}

        {/* Title */}
        <h3
          className="font-display font-semibold text-base leading-snug mb-2.5 line-clamp-2 flex-1"
          style={{ color: "var(--foreground)" }}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-[#b890ff] transition-colors duration-200"
            style={{ textDecoration: "none" }}
          >
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p
            className="text-sm leading-relaxed mb-4 line-clamp-2"
            style={{ color: "var(--foreground-secondary)" }}
          >
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[0.6rem] px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "var(--foreground-muted)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between mt-auto pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div>
            <p className="text-xs font-medium" style={{ color: "var(--foreground-secondary)" }}>
              {post.author}
            </p>
            <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>
              {fmtDate(post.publishedAt)} · {post.readingTimeMinutes} min read
            </p>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold group/link shrink-0"
            style={{ color: "#9455ff", textDecoration: "none" }}
            aria-label={`Read: ${post.title}`}
          >
            Read
            <svg
              width="12" height="12" viewBox="0 0 12 12" fill="none"
              className="transition-transform duration-200 group-hover/link:translate-x-0.5"
              aria-hidden="true"
            >
              <path d="M2 6h8M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

import { subscribeSchema } from "@/lib/validations/user";

/* ── Newsletter block ── */
function NewsletterBlock() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = subscribeSchema.safeParse({ email });

    if (!result.success) {
      setStatus("error");
      setMsg(result.error.issues[0].message);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        setMsg(json.message ?? "Subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMsg(json.message ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMsg("Connection error.");
    }
  }

  return (
    <section
      className="rounded-2xl p-8 sm:p-10 text-center"
      style={{
        background: "linear-gradient(135deg, rgba(124,31,255,0.08), rgba(87,0,190,0.06))",
        border: "1px solid rgba(124,31,255,0.18)",
        boxShadow: "0 0 40px rgba(124,31,255,0.06) inset",
      }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center w-12 h-12 rounded-2xl mx-auto mb-5"
        style={{
          background: "linear-gradient(135deg, rgba(124,31,255,0.2), rgba(87,0,190,0.25))",
          border: "1px solid rgba(124,31,255,0.3)",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ color: "#9455ff" }}>
          <path d="M3 5h16a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2 6l9 7 9-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <h3
        className="font-display font-bold text-xl sm:text-2xl mb-2"
        style={{ color: "var(--foreground)" }}
      >
        Get new articles in your inbox
      </h3>
      <p className="text-sm mb-7 max-w-sm mx-auto" style={{ color: "var(--foreground-secondary)" }}>
        Study tips, exam strategies, and subject guides — delivered when we publish.
        No spam, unsubscribe any time.
      </p>

      {status === "success" ? (
        <div
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
          style={{
            background: "rgba(16,185,129,0.12)",
            color: "#34d399",
            border: "1px solid rgba(16,185,129,0.25)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {msg}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="input flex-1 text-sm"
            disabled={status === "loading"}
          />
          <button
            type="submit"
            disabled={status === "loading" || !email.trim()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-60 shrink-0"
            style={{
              background: "linear-gradient(135deg, #7c1fff, #5700be)",
              color: "#fff",
              boxShadow: "0 0 16px rgba(124,31,255,0.3)",
            }}
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-3 text-xs" style={{ color: "#f87171" }}>{msg}</p>
      )}
    </section>
  );
}

/* ── Main BlogFeed ── */
export default function BlogFeed({ initialPosts }: { initialPosts: PostSummary[] }) {
  const categories = ["All", ...Array.from(new Set(initialPosts.map((p) => p.category)))];
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = initialPosts.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-10">
      {/* Search + filter row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            width="14" height="14" viewBox="0 0 14 14" fill="none"
            style={{ color: "var(--foreground-muted)" }}
          >
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            className="input w-full pl-9 text-sm"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = activeCategory === cat;
            const s = cat === "All" ? null : getCatStyle(cat);
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                style={
                  active
                    ? {
                        background: s ? s.bg : "rgba(124,31,255,0.15)",
                        color: s ? s.text : "#c4a0ff",
                        border: `1px solid ${s ? s.border : "rgba(124,31,255,0.3)"}`,
                      }
                    : {
                        background: "rgba(255,255,255,0.04)",
                        color: "var(--foreground-muted)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }
                }
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid or empty state */}
      {initialPosts.length === 0 ? (
        <div
          className="rounded-[2rem] py-24 text-center flex flex-col items-center justify-center gap-4"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ color: "var(--foreground-muted)" }}>
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 4v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h3 className="font-display font-bold text-lg" style={{ color: "var(--foreground)" }}>No articles published yet</h3>
            <p className="text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>
              We're currently writing new guides. Check back soon!
            </p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[2rem] py-24 text-center flex flex-col items-center justify-center gap-5"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(124,31,255,0.06)", border: "1px solid rgba(124,31,255,0.15)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ color: "#9455ff" }}>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M8 11h6M11 8v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" transform="rotate(45 11 11)" />
            </svg>
          </div>
          <div>
            <h3 className="font-display font-bold text-lg" style={{ color: "var(--foreground)" }}>No matches found</h3>
            <p className="text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>
              We couldn't find any articles matching your current filters.
            </p>
          </div>
          <button
            onClick={() => { setActiveCategory("All"); setSearch(""); }}
            className="btn-primary px-8 py-2.5 mt-2 rounded-xl text-sm font-bold"
          >
            Clear All Filters
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((post) => (
              <motion.div
                key={post._id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Newsletter */}
      <NewsletterBlock />
    </div>
  );
}
