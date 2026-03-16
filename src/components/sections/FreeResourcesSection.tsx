"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Types & constants
   ───────────────────────────────────────────────────────────── */
interface Resource {
  id: string;
  subject: string;
  abbr: string;
  title: string;
  description: string;
  pages: number;
  fileSize: string;
  type: "Notes" | "Past Papers" | "Practice" | "Guide";
  color: string;
  accent: string;
}

const FILTER_SUBJECTS = [
  "All",
  "Mathematics",
  "Science",
  "History",
  "ICT",
  "English",
  "Geography",
] as const;

type SubjectFilter = (typeof FILTER_SUBJECTS)[number];

/* ─────────────────────────────────────────────────────────────
   Resource data — 12 O/L English Medium study packs
   ───────────────────────────────────────────────────────────── */
const RESOURCES: Resource[] = [
  // Mathematics
  {
    id: "math-01",
    subject: "Mathematics",
    abbr: "M",
    title: "Algebra & Quadratic Equations — Complete Notes",
    description:
      "Fully worked examples, formula sheets and step-by-step solutions covering every algebra topic in the 2025 G.C.E. O/L syllabus.",
    pages: 48,
    fileSize: "3.2 MB",
    type: "Notes",
    color: "#60a5fa",
    accent: "rgba(96,165,250,0.14)",
  },
  {
    id: "math-02",
    subject: "Mathematics",
    abbr: "M",
    title: "Geometry, Trigonometry & Mensuration Pack",
    description:
      "Annotated diagrams, theorems, proofs and practice questions for all geometry, trigonometry and mensuration topics.",
    pages: 56,
    fileSize: "4.1 MB",
    type: "Practice",
    color: "#60a5fa",
    accent: "rgba(96,165,250,0.14)",
  },
  {
    id: "math-03",
    subject: "Mathematics",
    abbr: "M",
    title: "Statistics & Probability — Worked Solutions",
    description:
      "Frequency tables, histograms, mean / median / mode and probability trees with fully solved model answers.",
    pages: 32,
    fileSize: "2.4 MB",
    type: "Practice",
    color: "#60a5fa",
    accent: "rgba(96,165,250,0.14)",
  },
  // Science
  {
    id: "sci-01",
    subject: "Science",
    abbr: "Sc",
    title: "Combined Science: Chemistry Unit Summary",
    description:
      "Atoms, elements, compounds, chemical reactions and the periodic table — crystal-clear notes with lab diagrams.",
    pages: 60,
    fileSize: "5.8 MB",
    type: "Notes",
    color: "#34d399",
    accent: "rgba(52,211,153,0.14)",
  },
  {
    id: "sci-02",
    subject: "Science",
    abbr: "Sc",
    title: "Physics: Motion, Forces & Energy Guide",
    description:
      "Newton's laws, velocity–acceleration graphs, work, energy and power explained with solved numericals.",
    pages: 44,
    fileSize: "3.7 MB",
    type: "Guide",
    color: "#34d399",
    accent: "rgba(52,211,153,0.14)",
  },
  // History
  {
    id: "hist-01",
    subject: "History",
    abbr: "H",
    title: "Sri Lanka: Colonial Period & Independence",
    description:
      "Detailed timeline, key figures and model essay answers covering the colonial era through independence.",
    pages: 38,
    fileSize: "2.9 MB",
    type: "Notes",
    color: "#fbbf24",
    accent: "rgba(251,191,36,0.14)",
  },
  {
    id: "hist-02",
    subject: "History",
    abbr: "H",
    title: "World History: 20th Century Key Events",
    description:
      "World Wars, the Cold War, post-war reconstruction and the emergence of newly independent nations.",
    pages: 42,
    fileSize: "3.4 MB",
    type: "Notes",
    color: "#fbbf24",
    accent: "rgba(251,191,36,0.14)",
  },
  // ICT
  {
    id: "ict-01",
    subject: "ICT",
    abbr: "ICT",
    title: "Computer Systems & Networking — Full Guide",
    description:
      "Hardware, software, OS concepts, network topologies, protocols and data-security essentials in one place.",
    pages: 50,
    fileSize: "4.2 MB",
    type: "Guide",
    color: "#22d3ee",
    accent: "rgba(34,211,238,0.14)",
  },
  {
    id: "ict-02",
    subject: "ICT",
    abbr: "ICT",
    title: "Spreadsheets & Database Fundamentals",
    description:
      "Functions, formulas, sorting and filtering in spreadsheets; database design, tables and query basics.",
    pages: 34,
    fileSize: "2.8 MB",
    type: "Notes",
    color: "#22d3ee",
    accent: "rgba(34,211,238,0.14)",
  },
  // English
  {
    id: "eng-01",
    subject: "English",
    abbr: "En",
    title: "Essay & Directed Writing Masterclass",
    description:
      "Formal and informal letter formats, argumentative essays and report writing with scored sample answers.",
    pages: 40,
    fileSize: "3.1 MB",
    type: "Guide",
    color: "#b890ff",
    accent: "rgba(184,144,255,0.14)",
  },
  {
    id: "eng-02",
    subject: "English",
    abbr: "En",
    title: "Grammar, Comprehension & Summary Skills",
    description:
      "Tenses, active and passive voice, determiners, comprehension strategies and step-by-step summary writing.",
    pages: 52,
    fileSize: "4.5 MB",
    type: "Notes",
    color: "#b890ff",
    accent: "rgba(184,144,255,0.14)",
  },
  // Geography
  {
    id: "geo-01",
    subject: "Geography",
    abbr: "Geo",
    title: "Physical Geography: Diagrams & Model Answers",
    description:
      "Weathering, erosion, rivers, coastal landforms, climate zones and natural disasters with labelled diagrams.",
    pages: 46,
    fileSize: "3.8 MB",
    type: "Notes",
    color: "#fb923c",
    accent: "rgba(251,146,60,0.14)",
  },
];

/* ─────────────────────────────────────────────────────────────
   Subject icons — minimal SVG, one per subject
   ───────────────────────────────────────────────────────────── */
function SubjectIcon({ subject, color }: { subject: string; color: string }) {
  const cls = "w-4 h-4 shrink-0";
  const props = { className: cls, fill: "none", viewBox: "0 0 24 24", stroke: color, strokeWidth: 1.75 };

  switch (subject) {
    case "Mathematics":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M4 12h16M12 4v16M7 7l10 10M17 7L7 17" />
        </svg>
      );
    case "Science":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 3h6M10 3v5.5L5.5 17A1 1 0 006.4 19h11.2a1 1 0 00.9-1.45L14 8.5V3" />
          <circle cx="12" cy="15" r="1" fill={color} stroke="none" />
        </svg>
      );
    case "History":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 8v4l3 3M12 2a10 10 0 100 20A10 10 0 0012 2z" />
        </svg>
      );
    case "ICT":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="13" rx="1.5" strokeLinecap="round" />
          <path strokeLinecap="round" d="M8 21h8M12 17v4" />
          <path strokeLinecap="round" d="M7.5 10l2.5 2-2.5 2" />
          <path strokeLinecap="round" d="M12.5 14h3" />
        </svg>
      );
    case "English":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 6.5C10 4 6 4 4 6v13c2-2 6-2 8 0V6.5zm0 0C14 4 18 4 20 6v13c-2-2-6-2-8 0" />
        </svg>
      );
    case "Geography":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M3 12h18M12 3c-2.5 3-4 6-4 9s1.5 6 4 9M12 3c2.5 3 4 6 4 9s-1.5 6-4 9" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path strokeLinecap="round" d="M9 12h6M12 9v6" />
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      );
  }
}

/* ─────────────────────────────────────────────────────────────
   Search bar
   ───────────────────────────────────────────────────────────── */
function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by title, subject, or topic…"
        className="w-full pl-12 pr-12 py-3.5 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-lg shadow-black/20"
        aria-label="Search free resources"
        spellCheck={false}
        autoComplete="off"
      />

      {/* Clear button — appears when query is non-empty */}
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-150 hover:bg-white/10 text-gray-400"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Single resource card
   ───────────────────────────────────────────────────────────── */
function ResourceCard({ r }: { r: Resource }) {
  const TYPE_COLORS: Record<Resource["type"], string> = {
    Notes:        "rgba(148,163,184,0.12)",
    Practice:     "rgba(251,191,36,0.1)",
    Guide:        "rgba(52,211,153,0.1)",
    "Past Papers":"rgba(248,113,113,0.1)",
  };
  const TYPE_TEXT: Record<Resource["type"], string> = {
    Notes:        "#94a3b8",
    Practice:     "#fbbf24",
    Guide:        "#34d399",
    "Past Papers":"#f87171",
  };

  return (
    <div className="resource-card">

      {/* ── Top: subject badge + type badge ── */}
      <div className="flex items-start justify-between gap-3 mb-5">
        {/* Subject badge */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{
            background: r.accent,
            border: `1px solid ${r.color}30`,
          }}
        >
          <SubjectIcon subject={r.subject} color={r.color} />
          <span
            className="font-display font-bold text-xs leading-none"
            style={{ color: r.color }}
          >
            {r.subject}
          </span>
        </div>

        {/* Type badge */}
        <span
          className="text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-full shrink-0"
          style={{
            background: TYPE_COLORS[r.type],
            border: `1px solid ${TYPE_TEXT[r.type]}25`,
            color: TYPE_TEXT[r.type],
          }}
        >
          {r.type}
        </span>
      </div>

      {/* ── Title ── */}
      <h3
        className="font-display font-bold text-[0.9375rem] leading-snug mb-2.5 line-clamp-2"
        style={{ color: "var(--foreground)" }}
      >
        {r.title}
      </h3>

      {/* ── Description ── */}
      <div
        className="prose prose-invert prose-slate prose-sm line-clamp-3 flex-1 mb-5 rich-text-content break-words overflow-hidden w-full"
        dangerouslySetInnerHTML={{ __html: r.description }}
      />

      {/* ── File metadata ── */}
      <div
        className="flex items-center gap-3 py-3.5 mb-4"
        style={{
          borderTop:    "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* PDF label chip */}
        <span
          className="flex items-center justify-center h-7 px-2 rounded-md text-[0.6rem] font-black tracking-wider shrink-0"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.22)",
            color: "#f87171",
          }}
        >
          PDF
        </span>

        {/* Stats */}
        <div
          className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs"
          style={{ color: "var(--foreground-muted)" }}
        >
          <span>{r.pages} pages</span>
          <span aria-hidden="true" style={{ opacity: 0.3 }}>·</span>
          <span>{r.fileSize}</span>
          <span aria-hidden="true" style={{ opacity: 0.3 }}>·</span>
          <span style={{ color: "#34d399", fontWeight: 600 }}>Free</span>
        </div>
      </div>

      {/* ── Download button ── */}
      <a
        href="#"
        className="btn-download group"
        aria-label={`Download ${r.title} as PDF`}
      >
        {/* Download icon — bounces down on hover */}
        <svg
          className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5"
          fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a2 2 0 002 2h14a2 2 0 002-2v-3" />
        </svg>
        Download Free PDF
      </a>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Empty state
   ───────────────────────────────────────────────────────────── */
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
      {/* Icon container */}
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <svg
          className="w-7 h-7"
          fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={1.5}
          style={{ color: "var(--foreground-muted)" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
        </svg>
      </div>

      <div className="space-y-2">
        <h4
          className="font-display font-semibold text-base"
          style={{ color: "var(--foreground)" }}
        >
          No resources found
        </h4>
        <p className="text-sm max-w-xs" style={{ color: "var(--foreground-muted)" }}>
          Try adjusting your search term or selecting a different subject filter.
        </p>
      </div>

      <button onClick={onReset} className="btn-ghost text-sm px-5 py-2">
        Reset all filters
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main section export
   ───────────────────────────────────────────────────────────── */
export default function FreeResourcesSection() {
  const [query,        setQuery]        = useState("");
  const [activeFilter, setActiveFilter] = useState<SubjectFilter>("All");

  /* Derived filtered list */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESOURCES.filter((r) => {
      const matchSubject = activeFilter === "All" || r.subject === activeFilter;
      const matchQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q);
      return matchSubject && matchQuery;
    });
  }, [query, activeFilter]);

  const resetAll = () => {
    setQuery("");
    setActiveFilter("All");
  };

  const isFiltered = query.trim() !== "" || activeFilter !== "All";

  return (
    <section
      id="free-resources"
      className="section relative z-10"
      aria-labelledby="free-resources-title"
    >
      <div className="container-xl">

        {/* ── Section header ── */}
        <div className="flex flex-col items-center text-center gap-4 mb-14">
          <div className="badge-gold w-fit">Completely Free</div>

          <h2 id="free-resources-title" className="text-balance">
            Free Study{" "}
            <span className="text-gradient-luminary">Materials</span>
          </h2>

          <p
            className="max-w-lg text-lg leading-relaxed"
            style={{ color: "var(--foreground-secondary)" }}
          >
            High-quality notes, guides and practice packs for all O/L English
            Medium subjects — curated by expert teachers and updated for the{" "}
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>
              2025 G.C.E. O/L syllabus
            </span>.
          </p>
        </div>

        {/* ── Controls: search + filter chips ── */}
        <div className="flex flex-col gap-4 mb-10">

          {/* Search bar */}
          <SearchBar value={query} onChange={setQuery} />

          {/* Filter chips — horizontally scrollable on mobile */}
          <div
            className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5"
            role="group"
            aria-label="Filter resources by subject"
          >
            {FILTER_SUBJECTS.map((subject) => {
              const isActive = activeFilter === subject;
              return (
                <button
                  key={subject}
                  onClick={() => setActiveFilter(subject)}
                  className={`filter-chip ${isActive ? "filter-chip-active" : ""}`}
                  aria-pressed={isActive}
                >
                  {/* Active dot indicator */}
                  {isActive && (
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "#b890ff" }}
                      aria-hidden="true"
                    />
                  )}
                  {subject}
                </button>
              );
            })}
          </div>

          {/* Results count + clear */}
          <div className="flex items-center justify-between gap-4 min-h-[1.25rem]">
            <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>
              Showing{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--foreground-secondary)" }}
              >
                {filtered.length}
              </span>{" "}
              of {RESOURCES.length} resources
              {activeFilter !== "All" && (
                <>
                  {" "}in{" "}
                  <span
                    className="font-semibold"
                    style={{ color: "var(--foreground-secondary)" }}
                  >
                    {activeFilter}
                  </span>
                </>
              )}
            </p>

            {/* Clear filters link — only visible when a filter/query is active */}
            {isFiltered && (
              <button
                onClick={resetAll}
                className="text-xs font-medium shrink-0 transition-colors duration-150"
                style={{ color: "var(--foreground-muted)" }}
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* ── Resource grid or empty state ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r) => (
              <ResourceCard key={r.id} r={r} />
            ))}
          </div>
        ) : (
          <EmptyState onReset={resetAll} />
        )}

      </div>
    </section>
  );
}
