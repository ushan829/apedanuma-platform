"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AnimatedSearchBar from "@/components/AnimatedSearchBar";
import {
  SUBJECT_CATEGORIES,
  getSubjectStyle,
  TYPE_META,
  type Grade,
  type MaterialType,
  type TermFilter,
} from "@/lib/free-resources";
import type { LiveResource } from "@/lib/resource-constants";

/* ─────────────────────────────────────────
   DB materialType → sidebar filter key
   ───────────────────────────────────────── */
const FILTER_TO_DB_TYPES: Record<string, string[]> = {
  "term-test":       ["Term Test Paper"],
  "short-notes":     ["Short Note"],
  "unit-test":       ["Model Paper", "Revision Paper", "MCQ Paper", "Essay Guide"],
  "textbooks":       [],
  "ol-past-papers":  ["Past Paper"],
  "marking-schemes": ["Marking Scheme"],
};

/* ─────────────────────────────────────────
   DB materialType color meta
   ───────────────────────────────────────── */
const DB_TYPE_META: Record<string, { shortLabel: string; color: string; bg: string; border: string }> = {
  "Past Paper":     { shortLabel: "Past Paper",  color: "#fda4af", bg: "rgba(244,63,94,0.12)",   border: "rgba(244,63,94,0.26)"   },
  "Term Test Paper":{ shortLabel: "Term Test",   color: "#93c5fd", bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.28)"  },
  "Marking Scheme": { shortLabel: "Mark Scheme", color: "#fdba74", bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.26)"  },
  "Short Note":     { shortLabel: "Short Note",  color: "#6ee7b7", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.28)"  },
  "Model Paper":    { shortLabel: "Model",       color: "#fcd34d", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.28)"  },
  "Revision Paper": { shortLabel: "Revision",    color: "#2dd4bf", bg: "rgba(20,184,166,0.12)",  border: "rgba(20,184,166,0.28)"  },
  "MCQ Paper":      { shortLabel: "MCQ",         color: "#818cf8", bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.26)"  },
  "Essay Guide":    { shortLabel: "Essay",       color: "#f472b6", bg: "rgba(236,72,153,0.12)",  border: "rgba(236,72,153,0.26)"  },
};

function getTypeMeta(materialType: string) {
  return DB_TYPE_META[materialType] ?? {
    shortLabel: materialType,
    color: "var(--foreground-muted)",
    bg: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.09)",
  };
}

/* ─────────────────────────────────────────
   Doc icon (matches Free Resources style)
   ───────────────────────────────────────── */
function DocIcon({ subject }: { subject: string }) {
  const s = getSubjectStyle(subject);
  return (
    <div
      className="flex items-center justify-center rounded-xl shrink-0"
      style={{ width: 46, height: 52, background: s.bg, border: `1px solid ${s.border}` }}
    >
      <svg width="22" height="26" viewBox="0 0 20 24" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="18" height="22" rx="3" stroke={s.color} strokeWidth="1.4" />
        <path d="M1 7h18" stroke={s.color} strokeWidth="1" />
        <path d="M5 11h10M5 14h7M5 17h9" stroke={s.color} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M13 1v5a1 1 0 001 1h5" stroke={s.color} strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────
   Product card (flat doc-icon style)
   ───────────────────────────────────────── */
function ProductCard({ resource }: { resource: LiveResource }) {
  const subjectStyle = getSubjectStyle(resource.subject);
  const typeMeta     = getTypeMeta(resource.materialType);

  return (
    <div className="resource-card flex flex-col gap-3">
      {/* Header row: icon + badges */}
      <div className="flex items-start gap-3">
        <DocIcon subject={resource.subject} />
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex flex-wrap gap-1">
            <span
              className="inline-flex text-[0.58rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
              style={{ background: subjectStyle.bg, color: subjectStyle.color, border: `1px solid ${subjectStyle.border}` }}
            >
              {resource.subject.length > 16 ? resource.subject.split(" ")[0] : resource.subject}
            </span>
            <span
              className="inline-flex text-[0.58rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
              style={{ background: "rgba(255,255,255,0.05)", color: "var(--foreground-muted)", border: "1px solid rgba(255,255,255,0.09)" }}
            >
              Gr {resource.grade}
            </span>
            <span
              className="inline-flex text-[0.58rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
              style={{ background: typeMeta.bg, color: typeMeta.color, border: `1px solid ${typeMeta.border}` }}
            >
              {resource.term ? `Term ${resource.term}` : typeMeta.shortLabel}
            </span>
          </div>
          {resource.year && (
            <span className="text-[0.6rem]" style={{ color: "var(--foreground-muted)" }}>{resource.year}</span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-sm leading-snug line-clamp-2 flex-1" style={{ color: "var(--foreground)" }}>
        {resource.title}
      </h3>

      {/* Meta row: pages · size · price */}
      <div className="flex items-center gap-3 text-xs" style={{ color: "var(--foreground-muted)" }}>
        {resource.pageCount && (
          <span className="flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <rect x="0.5" y="0.5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1" />
              <path d="M2 3h6M2 5h4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
            </svg>
            {resource.pageCount}p
          </span>
        )}
        {resource.fileSize && <span>{resource.fileSize}</span>}
        <span
          className="ml-auto font-bold text-sm"
          style={{ color: "var(--foreground)" }}
        >
          <span className="text-[0.6rem] font-medium mr-0.5" style={{ color: "var(--foreground-muted)" }}>LKR</span>
          {(resource.price ?? 0).toLocaleString()}
        </span>
      </div>

      {/* CTA */}
      <Link
        href={`/premium-store/${resource.slug || resource._id}`}
        className="w-full mt-auto flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 hover:-translate-y-px"
        style={{
          background: "linear-gradient(135deg, #7c1fff 0%, #9455ff 100%)",
          boxShadow: "0 0 16px rgba(124,31,255,0.3)",
          color: "#fff",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        View &amp; Buy
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────
   AccordionSection
   ───────────────────────────────────────── */
function AccordionSection({
  category, selectedSubjects, onToggleSubject, defaultOpen = false,
}: {
  category: { id: string; label: string; subjects: string[] };
  selectedSubjects: Set<string>;
  onToggleSubject: (s: string) => void;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const activeCount = category.subjects.filter((s) => selectedSubjects.has(s)).length;

  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3 text-left transition-colors duration-150 hover:text-white"
        style={{ color: "var(--foreground-secondary)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">{category.label}</span>
          {activeCount > 0 && (
            <span
              className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: "rgba(124,31,255,0.2)", color: "#b890ff", border: "1px solid rgba(124,31,255,0.3)" }}
            >
              {activeCount}
            </span>
          )}
        </div>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 220ms ease", flexShrink: 0, color: "var(--foreground-muted)" }}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 230ms ease" }}>
        <div style={{ overflow: "hidden" }}>
          <div className="flex flex-col gap-0.5 pb-3">
            {category.subjects.map((subject) => {
              const isActive = selectedSubjects.has(subject);
              const s = getSubjectStyle(subject);
              return (
                <button
                  key={subject}
                  type="button"
                  onClick={() => onToggleSubject(subject)}
                  className="flex items-center gap-2 w-full rounded-lg px-2 py-1.5 text-left text-xs transition-all duration-150"
                  style={{
                    background: isActive ? s.bg : "transparent",
                    color: isActive ? s.color : "var(--foreground-secondary)",
                    border: `1px solid ${isActive ? s.border : "transparent"}`,
                  }}
                >
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: isActive ? s.color : "rgba(255,255,255,0.2)" }} />
                  <span className="leading-tight">{subject}</span>
                  {isActive && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" className="ml-auto shrink-0">
                      <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Sidebar
   ───────────────────────────────────────── */
function Sidebar({
  grade, onGradeChange,
  materialType, onMaterialTypeChange,
  termFilter, onTermFilterChange,
  selectedSubjects, onToggleSubject,
  onClearAll, activeFilterCount,
  year, onYearChange, availableYears,
}: {
  grade: Grade;
  onGradeChange: (g: Grade) => void;
  materialType: MaterialType;
  onMaterialTypeChange: (t: MaterialType) => void;
  termFilter: TermFilter | null;
  onTermFilterChange: (t: TermFilter | null) => void;
  selectedSubjects: Set<string>;
  onToggleSubject: (s: string) => void;
  onClearAll: () => void;
  activeFilterCount: number;
  year: number | null;
  onYearChange: (y: number | null) => void;
  availableYears: number[];
}) {
  const baseMaterialTypes: { value: MaterialType; label: string }[] = [
    { value: "all",         label: "All Materials" },
    { value: "term-test",   label: "Term Test Papers" },
    { value: "short-notes", label: "Short Notes" },
    { value: "unit-test",   label: "Unit Test Papers" },
    { value: "textbooks",   label: "Text Books" },
  ];
  const grade11Types: { value: MaterialType; label: string }[] = [
    { value: "ol-past-papers",  label: "O/L Past Papers" },
    { value: "marking-schemes", label: "Marking Schemes" },
  ];

  return (
    <aside className="scrollbar-hide" style={{ overflowY: "auto" }}>
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--foreground-muted)" }}>Filters</span>
        {activeFilterCount > 0 && (
          <button type="button" onClick={onClearAll} className="text-[0.65rem] font-semibold transition-colors duration-150 hover:text-white" style={{ color: "#9455ff" }}>
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Grade toggle */}
      <div className="mb-5">
        <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-2.5" style={{ color: "var(--foreground-muted)" }}>Grade</p>
        <div className="flex rounded-xl p-1 gap-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {([10, 11] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onGradeChange(g)}
              className="flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200"
              style={
                grade === g
                  ? { background: "linear-gradient(135deg, rgba(124,31,255,0.4), rgba(87,0,190,0.5))", color: "#e0d0ff", border: "1px solid rgba(124,31,255,0.4)", boxShadow: "0 0 12px rgba(124,31,255,0.25)" }
                  : { background: "transparent", color: "var(--foreground-muted)", border: "1px solid transparent" }
              }
            >
              Grade {g}
            </button>
          ))}
        </div>
      </div>

      {/* Material type */}
      <div className="mb-5">
        <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-2.5" style={{ color: "var(--foreground-muted)" }}>Material Type</p>
        <div className="flex flex-col gap-1">
          {baseMaterialTypes.map((t) => {
            const isActive = materialType === t.value;
            const meta = TYPE_META[t.value] ?? null;
            return (
              <div key={t.value}>
                <button
                  type="button"
                  onClick={() => { onMaterialTypeChange(t.value); if (t.value !== "term-test") onTermFilterChange(null); }}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-all duration-150"
                  style={{
                    background: isActive ? (meta ? meta.bg : "rgba(255,255,255,0.07)") : "transparent",
                    color:      isActive ? (meta ? meta.color : "var(--foreground)") : "var(--foreground-secondary)",
                    border: `1px solid ${isActive ? (meta ? meta.border : "rgba(255,255,255,0.12)") : "transparent"}`,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: isActive && meta ? meta.color : "rgba(255,255,255,0.2)" }} />
                  {t.label}
                </button>
                {t.value === "term-test" && isActive && (
                  <div className="flex gap-1 mt-1.5 ml-5 mb-1">
                    {([1, 2, 3] as const).map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => onTermFilterChange(termFilter === term ? null : term)}
                        className="flex-1 py-1.5 rounded-lg text-[0.65rem] font-bold transition-all duration-150"
                        style={
                          termFilter === term
                            ? { background: "rgba(96,165,250,0.2)", color: "#93c5fd", border: "1px solid rgba(96,165,250,0.35)" }
                            : { background: "rgba(255,255,255,0.04)", color: "var(--foreground-muted)", border: "1px solid rgba(255,255,255,0.07)" }
                        }
                      >
                        T{term}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {grade === 11 && (
            <>
              <div className="my-1.5 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.25), transparent)" }} />
              <p className="text-[0.58rem] font-bold uppercase tracking-wider px-1 mb-1" style={{ color: "rgba(245,158,11,0.6)" }}>Grade 11 Only</p>
              {grade11Types.map((t) => {
                const isActive = materialType === t.value;
                const meta = TYPE_META[t.value];
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => onMaterialTypeChange(t.value)}
                    className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-all duration-150"
                    style={{
                      background: isActive ? meta.bg : "transparent",
                      color:      isActive ? meta.color : "var(--foreground-secondary)",
                      border: `1px solid ${isActive ? meta.border : "transparent"}`,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: isActive ? meta.color : "rgba(255,255,255,0.2)" }} />
                    {t.label}
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* Year filter */}
      {availableYears.length > 0 && (
        <div className="mb-5">
          <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-2.5" style={{ color: "var(--foreground-muted)" }}>Year</p>
          <select
            value={year ?? ""}
            onChange={(e) => onYearChange(e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-xl px-3 py-2 text-xs font-medium appearance-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${year ? "rgba(124,31,255,0.3)" : "rgba(255,255,255,0.09)"}`,
              color: year ? "#c4a0ff" : "var(--foreground-muted)",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="">All Years</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

      {/* Subject accordions */}
      <div>
        <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--foreground-muted)" }}>Subjects</p>
        {SUBJECT_CATEGORIES.map((cat, i) => (
          <AccordionSection
            key={cat.id}
            category={cat}
            selectedSubjects={selectedSubjects}
            onToggleSubject={onToggleSubject}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────
   Empty state
   ───────────────────────────────────────── */
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 gap-5 text-center relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 40%, rgba(124,31,255,0.07) 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="flex items-center justify-center w-16 h-16 rounded-2xl"
        style={{ background: "rgba(124,31,255,0.08)", border: "1px solid rgba(124,31,255,0.22)", boxShadow: "0 0 24px rgba(124,31,255,0.12)" }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8" stroke="rgba(148,85,255,0.55)" strokeWidth="1.5" />
          <path d="M18 18l5 5" stroke="rgba(148,85,255,0.55)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9 12h6M12 9v6" stroke="rgba(148,85,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>No products match your filters</p>
        <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>Try a different subject, grade, or material type.</p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-px"
        style={{
          background: "linear-gradient(135deg, rgba(124,31,255,0.18) 0%, rgba(87,0,190,0.22) 100%)",
          border: "1px solid rgba(124,31,255,0.35)",
          color: "#c4a8ff",
          boxShadow: "0 0 18px rgba(124,31,255,0.15)",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Clear Filters
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main export
   ───────────────────────────────────────── */
export default function PremiumGrid({ products }: { products: LiveResource[] }) {
  const [grade, setGrade]                       = useState<Grade>(10);
  const [materialType, setMaterialType]         = useState<MaterialType>("all");
  const [termFilter, setTermFilter]             = useState<TermFilter | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery]           = useState("");
  const [year, setYear]                         = useState<number | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleGradeChange = (g: Grade) => {
    setGrade(g);
    if (g === 10 && (materialType === "ol-past-papers" || materialType === "marking-schemes")) {
      setMaterialType("all");
    }
    setSelectedSubjects(new Set());
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(subject)) next.delete(subject); else next.add(subject);
      return next;
    });
  };

  const clearAll = () => {
    setMaterialType("all");
    setTermFilter(null);
    setSelectedSubjects(new Set());
    setSearchQuery("");
    setYear(null);
  };

  /* Client-side filtering */
  const filtered = useMemo<LiveResource[]>(() => {
    return products.filter((r) => {
      if (r.grade !== grade) return false;
      if (materialType !== "all") {
        const allowed = FILTER_TO_DB_TYPES[materialType] ?? [];
        if (!allowed.includes(r.materialType)) return false;
        if (materialType === "term-test" && termFilter !== null && r.term !== termFilter) return false;
      }
      if (selectedSubjects.size > 0 && !selectedSubjects.has(r.subject)) return false;
      if (year !== null && r.year !== year) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !r.title.toLowerCase().includes(q) &&
          !r.subject.toLowerCase().includes(q) &&
          !(r.description ?? "").toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [products, grade, materialType, termFilter, selectedSubjects, year, searchQuery]);

  const availableYears = useMemo<number[]>(() => {
    const years = new Set<number>();
    products.forEach((r) => { if (r.year) years.add(r.year); });
    return Array.from(years).sort((a, b) => b - a);
  }, [products]);

  const activeFilterCount =
    (materialType !== "all" ? 1 : 0) +
    (termFilter !== null ? 1 : 0) +
    selectedSubjects.size +
    (year !== null ? 1 : 0);

  const sidebarContent = (
    <Sidebar
      grade={grade}               onGradeChange={handleGradeChange}
      materialType={materialType} onMaterialTypeChange={setMaterialType}
      termFilter={termFilter}     onTermFilterChange={setTermFilter}
      selectedSubjects={selectedSubjects} onToggleSubject={toggleSubject}
      onClearAll={clearAll}       activeFilterCount={activeFilterCount}
      year={year}                 onYearChange={setYear} availableYears={availableYears}
    />
  );

  return (
    <div>
      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
          <span style={{ color: "var(--foreground-secondary)", fontWeight: 600 }}>{filtered.length}</span>{" "}
          {filtered.length === 1 ? "product" : "products"} · Grade {grade}
        </p>
        <button
          type="button"
          onClick={() => setShowMobileFilters((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200"
          style={{
            background: showMobileFilters ? "rgba(124,31,255,0.15)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${showMobileFilters ? "rgba(124,31,255,0.35)" : "rgba(255,255,255,0.09)"}`,
            color: showMobileFilters ? "#b890ff" : "var(--foreground-secondary)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span
              className="flex items-center justify-center w-4 h-4 rounded-full text-[0.55rem] font-black"
              style={{ background: "rgba(124,31,255,0.5)", color: "#e0d0ff" }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filters panel */}
      {showMobileFilters && (
        <div
          className="lg:hidden mb-8 rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}
        >
          {sidebarContent}
        </div>
      )}

      {/* Two-column layout */}
      <div className="flex gap-7 items-start">

        {/* Sticky sidebar (desktop) */}
        <aside
          className="hidden lg:block shrink-0 scrollbar-hide"
          style={{
            width: 248,
            position: "sticky",
            top: 80,
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "1.25rem",
            padding: "1.25rem",
            backdropFilter: "blur(20px)",
          }}
        >
          {sidebarContent}
        </aside>

        {/* Content area */}
        <div className="flex-1 min-w-0">

          {/* Search */}
          <div className="mb-6">
            <AnimatedSearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
              placeholders={[
                "Search for Premium Notes...",
                "Find Expert Study Guides...",
                "Discover Model Answers...",
                "Search for O/L Masterclasses...",
                "Find curated PDF packs..."
              ]}
            />
          </div>

          {/* Results row */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
              <span style={{ color: "var(--foreground-secondary)", fontWeight: 600 }}>{filtered.length}</span>{" "}
              {filtered.length === 1 ? "product" : "products"} for{" "}
              <span style={{ color: "var(--foreground)" }}>Grade {grade}</span>
            </p>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="hidden sm:block text-xs font-semibold transition-colors duration-150 hover:text-white"
                style={{ color: "#9455ff" }}
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Active subject pills */}
          {selectedSubjects.size > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {Array.from(selectedSubjects).map((s) => {
                const style = getSubjectStyle(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSubject(s)}
                    className="inline-flex items-center gap-1 text-[0.65rem] font-semibold px-2 py-1 rounded-full transition-all duration-150 hover:opacity-75"
                    style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}
                  >
                    {s}
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                      <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </button>
                );
              })}
            </div>
          )}

          {/* Grid or empty state */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((p) => <ProductCard key={p._id} resource={p} />)}
            </div>
          ) : (
            <EmptyState onReset={clearAll} />
          )}

          {/* Trust strip */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm" style={{ color: "var(--foreground-muted)" }}>
            {[
              { icon: "🔒", label: "Secure Checkout" },
              { icon: "📥", label: "Instant PDF Download" },
              { icon: "♻️", label: "Free Lifetime Updates" },
              { icon: "💬", label: "24/7 Support" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-2">
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
