"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import AnimatedSearchBar from "@/components/AnimatedSearchBar";
import {
  SUBJECT_CATEGORIES,
  getSubjectStyle, TYPE_META,
  type Grade, type MaterialType, type TermFilter, type FreeResource,
  FREE_RESOURCES,
  FILTER_TO_DB_TYPES,
} from "@/lib/free-resources";
import type { LiveResource } from "@/lib/resource-constants";

/* Color meta keyed by DB materialType string */
const DB_TYPE_META: Record<string, { label: string; shortLabel: string; color: string; bg: string; border: string }> = {
  "Past Paper":     { label: "O/L Past Paper",  shortLabel: "Past Paper",  color: "#fda4af", bg: "rgba(244,63,94,0.12)",   border: "rgba(244,63,94,0.26)"   },
  "Term Test Paper":{ label: "Term Test Paper",  shortLabel: "Term Test",   color: "#93c5fd", bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.28)"  },
  "Marking Scheme": { label: "Marking Scheme",   shortLabel: "Mark Scheme", color: "#fdba74", bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.26)"  },
  "Short Note":     { label: "Short Note",       shortLabel: "Short Note",  color: "#6ee7b7", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.28)"  },
  "Model Paper":    { label: "Model Paper",      shortLabel: "Model",       color: "#fcd34d", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.28)"  },
  "Revision Paper": { label: "Revision Paper",   shortLabel: "Revision",    color: "#2dd4bf", bg: "rgba(20,184,166,0.12)",  border: "rgba(20,184,166,0.28)"  },
  "MCQ Paper":      { label: "MCQ Paper",        shortLabel: "MCQ",         color: "#818cf8", bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.26)"  },
  "Essay Guide":    { label: "Essay Guide",      shortLabel: "Essay",       color: "#f472b6", bg: "rgba(236,72,153,0.12)",  border: "rgba(236,72,153,0.26)"  },
};

function getDbTypeMeta(materialType: string) {
  return (
    DB_TYPE_META[materialType] ?? {
      label: materialType,
      shortLabel: materialType,
      color: "var(--foreground-muted)",
      bg: "rgba(255,255,255,0.05)",
      border: "rgba(255,255,255,0.09)",
    }
  );
}

/* ─────────────────────────────────────────
   DocIcon
   ───────────────────────────────────────── */
function DocIcon({ subject, size = 40 }: { subject: string; size?: number }) {
  const s = getSubjectStyle(subject);
  return (
    <div
      className="flex items-center justify-center rounded-xl shrink-0"
      style={{ width: size, height: size + 6, background: s.bg, border: `1px solid ${s.border}` }}
    >
      <svg width={size * 0.5} height={size * 0.55} viewBox="0 0 20 24" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="18" height="22" rx="3" stroke={s.color} strokeWidth="1.4" />
        <path d="M1 7h18" stroke={s.color} strokeWidth="1" />
        <path d="M5 11h10M5 14h7M5 17h9" stroke={s.color} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M13 1v5a1 1 0 001 1h5" stroke={s.color} strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────
   ResourceCard — static FreeResource shape
   ───────────────────────────────────────── */
function StaticResourceCard({ resource }: { resource: FreeResource }) {
  const subjectStyle = getSubjectStyle(resource.subject);
  const typeMeta = TYPE_META[resource.type];

  return (
    <article className="relative flex flex-col gap-3 group rounded-[1.25rem] p-5 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] overflow-hidden transition-all duration-500 hover:bg-white/[0.08] hover:border-white/[0.2] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(139,92,246,0.15)]">
      <div className="flex items-start gap-3">
        <DocIcon subject={resource.subject} />
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex flex-wrap gap-1 items-center">
            <span
              className="inline-flex text-[0.58rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
              style={{ background: subjectStyle.bg, color: subjectStyle.color, border: `1px solid ${subjectStyle.border}` }}
            >
              {resource.subject.length > 16 ? resource.subject.split(" ")[0] : resource.subject}
            </span>
            <span
              className="inline-flex text-[0.58rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-white/[0.05] text-slate-400 border border-white/[0.09]"
            >
              Gr {resource.grade}
            </span>
            <span
              className="inline-flex text-[0.58rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
              style={{ background: typeMeta.bg, color: typeMeta.color, border: `1px solid ${typeMeta.border}` }}
            >
              {resource.term ? `Term ${resource.term}` : typeMeta.shortLabel}
            </span>
            {resource.year && (
              <span className="text-[0.6rem] text-slate-400 ml-0.5">{resource.year}</span>
            )}
          </div>
        </div>
      </div>
      <h3 className="font-display font-semibold text-sm leading-snug line-clamp-2 flex-1 text-white">
        {resource.title}
      </h3>
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <rect x="0.5" y="0.5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1" />
            <path d="M2 3h6M2 5h4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
          </svg>
          {resource.pages}p
        </span>
        <span>{resource.size}</span>
        <span
          className="ml-auto text-[0.6rem] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20"
        >
          Free
        </span>
      </div>
      <Link 
        href={`/free-resources/${resource.id}`} 
        className="inline-flex items-center justify-center gap-2 w-full font-display font-semibold text-[0.8125rem] tracking-wider py-2 rounded-xl text-purple-400 bg-purple-500/10 border border-purple-500/20 transition-all duration-300 hover:text-white hover:bg-gradient-to-br hover:from-purple-600/30 hover:to-purple-800/40 hover:-translate-y-1 group/btn mt-auto" 
        aria-label={`View details for ${resource.title}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M5 7h4M7 5l2 2-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        View Details
      </Link>
    </article>
  );
}

/* ─────────────────────────────────────────
   LiveResourceCard — MongoDB LiveResource shape
   ───────────────────────────────────────── */
function LiveResourceCard({ resource }: { resource: LiveResource }) {
  const subjectStyle = getSubjectStyle(resource.subject);
  const typeMeta = getDbTypeMeta(resource.materialType);

  return (
    <article className="relative flex flex-col gap-3 group rounded-[1.25rem] p-5 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] overflow-hidden transition-all duration-500 hover:bg-white/[0.08] hover:border-white/[0.2] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(139,92,246,0.15)]">
      <div className="flex items-start gap-3">
        {resource.previewImageUrl ? (
          <div className="relative w-12 h-14 shrink-0 rounded-xl overflow-hidden border border-white/10">
            <Image
              src={resource.previewImageUrl}
              alt={`${resource.title} - Grade ${resource.grade} ${resource.subject} study material`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 48px, 48px"
            />
          </div>
        ) : (
          <DocIcon subject={resource.subject} />
        )}
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex flex-wrap gap-1 items-center">
            <span
              className="inline-flex text-[0.58rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
              style={{ background: subjectStyle.bg, color: subjectStyle.color, border: `1px solid ${subjectStyle.border}` }}
            >
              {resource.subject.length > 16 ? resource.subject.split(" ")[0] : resource.subject}
            </span>
            <span
              className="inline-flex text-[0.58rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-white/[0.05] text-slate-400 border border-white/[0.09]"
            >
              Gr {resource.grade}
            </span>
            <span
              className="inline-flex text-[0.58rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
              style={{ background: typeMeta.bg, color: typeMeta.color, border: `1px solid ${typeMeta.border}` }}
            >
              {resource.term ? `Term ${resource.term}` : typeMeta.shortLabel}
            </span>
            {resource.year && (
              <span className="text-[0.6rem] text-slate-400 ml-0.5">{resource.year}</span>
            )}
          </div>
        </div>
      </div>
      <h3 className="font-display font-semibold text-sm leading-snug line-clamp-2 flex-1 text-white">
        {resource.title}
      </h3>
      <div className="flex items-center gap-3 text-xs text-slate-400">
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
          className="ml-auto text-[0.6rem] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20"
        >
          Free
        </span>
      </div>
      <Link 
        href={`/free-resources/${resource.slug || resource._id}`} 
        className="inline-flex items-center justify-center gap-2 w-full font-display font-semibold text-[0.8125rem] tracking-wider py-2 rounded-xl text-purple-400 bg-purple-500/10 border border-purple-500/20 transition-all duration-300 hover:text-white hover:bg-gradient-to-br hover:from-purple-600/30 hover:to-purple-800/40 hover:-translate-y-1 group/btn mt-auto" 
        aria-label={`View details for ${resource.title}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M5 7h4M7 5l2 2-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        View Details
      </Link>
    </article>
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
    <div className="border-b border-white/5">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3 text-left transition-colors duration-150 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">{category.label}</span>
          {activeCount > 0 && (
            <span
              className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30"
            >
              {activeCount}
            </span>
          )}
        </div>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
          className={`shrink-0 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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
                  className="flex items-center gap-2 w-full rounded-lg px-2 py-1.5 text-left text-xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
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
interface SidebarProps {
  grade: Grade | null;
  onGradeChange: (g: Grade | null) => void;
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
}

function Sidebar({
  grade, onGradeChange,
  materialType, onMaterialTypeChange,
  termFilter, onTermFilterChange,
  selectedSubjects, onToggleSubject,
  onClearAll, activeFilterCount,
  year, onYearChange, availableYears,
}: SidebarProps) {
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
    <nav className="scrollbar-hide overflow-y-auto" aria-label="Resource Filters">
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Filters</p>
        {activeFilterCount > 0 && (
          <button 
            type="button" 
            onClick={onClearAll} 
            className="text-[0.65rem] font-bold uppercase tracking-wider text-purple-400 transition-colors duration-150 hover:text-purple-300 focus:outline-none focus:underline" 
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Grade toggle */}
      <div className="mb-5">
        <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-2.5 text-slate-500">Grade</p>
        <div className="flex rounded-xl p-1 gap-1 bg-white/[0.04] border border-white/[0.07]">
          {([null, 10, 11] as const).map((g) => (
            <button
              key={g === null ? "all" : g}
              type="button"
              onClick={() => onGradeChange(g)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 ${
                grade === g
                  ? "bg-gradient-to-br from-purple-500/40 to-purple-800/50 text-purple-100 border border-purple-500/40 shadow-[0_0_12px_rgba(124,31,255,0.25)]"
                  : "bg-transparent text-slate-400 border border-transparent hover:text-slate-200"
              }`}
            >
              {g === null ? "All" : `Grade ${g}`}
            </button>
          ))}
        </div>
      </div>

      {/* Material Types */}
      <div className="mb-5">
        <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-2.5 text-slate-500">Material Type</p>
        <div className="flex flex-col gap-1">
          {baseMaterialTypes.map((t) => {
            const isActive = materialType === t.value;
            const meta = TYPE_META[t.value] ?? null;
            return (
              <div key={t.value}>
                <button
                  type="button"
                  onClick={() => { onMaterialTypeChange(t.value); if (t.value !== "term-test") onTermFilterChange(null); }}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  style={{
                    background: isActive ? (meta ? meta.bg : "rgba(255,255,255,0.07)") : "transparent",
                    color: isActive ? (meta ? meta.color : "var(--foreground)") : "var(--foreground-secondary)",
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
                        className={`flex-1 py-1.5 rounded-lg text-[0.65rem] font-bold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                          termFilter === term
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/35"
                            : "bg-white/5 text-slate-400 border border-white/10 hover:text-slate-200"
                        }`}
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
              <div className="my-1.5 h-px bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />
              <p className="text-[0.58rem] font-bold uppercase tracking-wider px-1 mb-1 text-amber-500/60">Grade 11 Only</p>
              {grade11Types.map((t) => {
                const isActive = materialType === t.value;
                const meta = TYPE_META[t.value];
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => onMaterialTypeChange(t.value)}
                    className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    style={{
                      background: isActive ? meta.bg : "transparent",
                      color: isActive ? meta.color : "var(--foreground-secondary)",
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
          <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-2.5 text-slate-500">Year</p>
          <select
            value={year ?? ""}
            onChange={(e) => onYearChange(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer text-sm"
          >
            <option className="bg-slate-900 text-white" value="">All Years</option>
            {availableYears.map((y) => (
              <option className="bg-slate-900 text-white" key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4 h-px bg-white/5" />

      {/* Subject Accordions */}
      <div>
      <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-1 text-slate-500">Subjects</p>
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
    </nav>
  );
}

/* ─────────────────────────────────────────
   Empty state
   ───────────────────────────────────────── */
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 gap-5 text-center relative">
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_40%_at_50%_40%,rgba(124,31,255,0.07)_0%,transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="flex items-center justify-center w-16 h-16 rounded-2xl relative bg-purple-500/10 border border-purple-500/20 shadow-[0_0_24px_rgba(124,31,255,0.12)]"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8" stroke="rgba(148,85,255,0.55)" strokeWidth="1.5" />
          <path d="M18 18l5 5" stroke="rgba(148,85,255,0.55)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9 12h6M12 9v6" stroke="rgba(148,85,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className="font-semibold mb-1 text-white">No resources match your filters</p>
        <p className="text-sm text-slate-400">Try a different subject, grade, or material type.</p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold bg-gradient-to-br from-purple-500/20 to-purple-800/30 border border-purple-500/40 text-purple-300 shadow-[0_0_18px_rgba(124,31,255,0.15)] transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-[#0B0F19]"
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
export default function ResourceLibrary({ resources }: { resources?: LiveResource[] }) {
  const isLive = resources !== undefined;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Initial State from URL
  const [grade, setGrade] = useState<Grade | null>(() => {
    const g = searchParams.get("grade");
    if (g === "11") return 11;
    if (g === "10") return 10;
    return null; // Default to All Grades
  });
  const [materialType, setMaterialType] = useState<MaterialType>(() => {
    return (searchParams.get("type") as MaterialType) || "all";
  });
  const [termFilter, setTermFilter] = useState<TermFilter | null>(() => {
    const t = searchParams.get("term");
    return t ? (parseInt(t) as TermFilter) : null;
  });
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(() => {
    const s = searchParams.get("subjects");
    return new Set(s ? s.split(",") : []);
  });
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "");
  const [year, setYear] = useState<number | null>(() => {
    const y = searchParams.get("year");
    return y ? parseInt(y) : null;
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // 2. Sync State -> URL (Update URL when filters change)
  useEffect(() => {
    const params = new URLSearchParams();
    if (grade !== null) params.set("grade", grade.toString());
    if (materialType !== "all") params.set("type", materialType);
    if (termFilter !== null) params.set("term", termFilter.toString());
    if (selectedSubjects.size > 0) {
      params.set("subjects", Array.from(selectedSubjects).join(","));
    }
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (year !== null) params.set("year", year.toString());

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    
    router.replace(url, { scroll: false });
  }, [grade, materialType, termFilter, selectedSubjects, searchQuery, year, pathname, router]);

  // 3. Sync URL -> State (Handles Browser Back/Forward buttons)
  useEffect(() => {
    const gVal = searchParams.get("grade");
    const newGrade = gVal ? (parseInt(gVal) as Grade) : null;
    if (grade !== newGrade) setGrade(newGrade);

    const tVal = (searchParams.get("type") as MaterialType) || "all";
    if (materialType !== tVal) setMaterialType(tVal);

    const termVal = searchParams.get("term");
    const newTerm = termVal ? (parseInt(termVal) as TermFilter) : null;
    if (termFilter !== newTerm) setTermFilter(newTerm);

    const subjectsVal = searchParams.get("subjects");
    const newSubjectsList = subjectsVal ? subjectsVal.split(",") : [];
    const newSubjectsSet = new Set(newSubjectsList);
    
    const isDifferent = selectedSubjects.size !== newSubjectsSet.size || 
                       ![...selectedSubjects].every(s => newSubjectsSet.has(s));
    if (isDifferent) setSelectedSubjects(newSubjectsSet);

    const qVal = searchParams.get("q") || "";
    if (searchQuery !== qVal) setSearchQuery(qVal);

    const yVal = searchParams.get("year");
    const newYear = yVal ? parseInt(yVal) : null;
    if (year !== newYear) setYear(newYear);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleGradeChange = (g: Grade | null) => {
    setGrade(g);
    if ((g === 10 || g === null) && (materialType === "ol-past-papers" || materialType === "marking-schemes")) {
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
    setGrade(null);
    setMaterialType("all");
    setTermFilter(null);
    setSelectedSubjects(new Set());
    setSearchQuery("");
    setYear(null);
  };

  /* Filter live resources */
  const filteredLive = useMemo<LiveResource[]>(() => {
    if (!isLive) return [];
    return resources!.filter((r) => {
      if (grade !== null && r.grade !== grade) return false;
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
  }, [isLive, resources, grade, materialType, termFilter, selectedSubjects, year, searchQuery]);

  /* Filter static resources */
  const filteredStatic = useMemo<FreeResource[]>(() => {
    if (isLive) return [];
    return FREE_RESOURCES.filter((r) => {
      if (grade !== null && r.grade !== grade) return false;
      if (materialType !== "all") {
        if (r.type !== materialType) return false;
        if (materialType === "term-test" && termFilter !== null && r.term !== termFilter) return false;
      }
      if (selectedSubjects.size > 0 && !selectedSubjects.has(r.subject)) return false;
      if (year !== null && r.year !== year) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!r.title.toLowerCase().includes(q) && !r.subject.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [isLive, grade, materialType, termFilter, selectedSubjects, year, searchQuery]);

  const availableYears = useMemo<number[]>(() => {
    const source = isLive ? (resources ?? []) : FREE_RESOURCES;
    const years = new Set<number>();
    source.forEach((r) => { if (r.year) years.add(r.year); });
    return Array.from(years).sort((a, b) => b - a);
  }, [isLive, resources]);

  const totalCount = isLive ? resources!.length : FREE_RESOURCES.length;
  const filteredCount = isLive ? filteredLive.length : filteredStatic.length;
  const isEmpty = filteredCount === 0;

  const activeFilterCount =
    (grade !== null ? 1 : 0) +
    (materialType !== "all" ? 1 : 0) +
    (termFilter !== null ? 1 : 0) +
    selectedSubjects.size +
    (year !== null ? 1 : 0);

  const sidebarContent = (
    <Sidebar
      grade={grade} onGradeChange={handleGradeChange}
      materialType={materialType} onMaterialTypeChange={setMaterialType}
      termFilter={termFilter} onTermFilterChange={setTermFilter}
      selectedSubjects={selectedSubjects} onToggleSubject={toggleSubject}
      onClearAll={clearAll} activeFilterCount={activeFilterCount}
      year={year} onYearChange={setYear} availableYears={availableYears}
    />
  );

  return (
    <div className="container-xl py-14 sm:py-18">
      {/* Page header */}
      <header className="mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25">Completely Free</div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-balance">
              O/L English Medium <span className="text-gradient-luminary">Free Study Materials</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300">
              {totalCount}+ resources — Term Tests, Notes, Past Papers &amp; more.
            </p>
          </div>
          <div className="flex items-center gap-3 lg:hidden self-start">
            <button
              type="button"
              onClick={() => setShowMobileFilters((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 shrink-0 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-[#0B0F19] ${
                showMobileFilters 
                  ? "bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]" 
                  : "bg-white/5 border border-white/10 text-slate-300"
              }`}
              aria-expanded={showMobileFilters}
              aria-label="Toggle filters menu"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-4 h-4 rounded-full text-[0.55rem] font-black bg-purple-500/50 text-purple-100">
                  {activeFilterCount}
                </span>
              )}
            </button>
            
            {/* Mobile Helper Badge */}
            <div 
              className="flex items-center px-3 py-1.5 rounded-full animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.15)] bg-amber-500/10 border border-amber-500/25"
            >
              <span className="text-[0.62rem] xs:text-[0.68rem] font-bold italic tracking-wide whitespace-nowrap text-amber-400">
                👈 Tap to find materials faster!
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile filters panel */}
      {showMobileFilters && (
        <div className="lg:hidden mb-8 rounded-2xl p-5 bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl">
          {sidebarContent}
        </div>
      )}

      {/* Two-column layout */}
      <div className="flex gap-7 items-start">
        {/* Sticky sidebar */}
        <aside
          className="hidden lg:block shrink-0 scrollbar-hide w-[248px] sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto bg-white/[0.025] border border-white/[0.07] rounded-[1.25rem] p-5 backdrop-blur-2xl"
        >
          {sidebarContent}
        </aside>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          <h2 className="sr-only">Resource Results</h2>
          {/* Search */}
          <div className="mb-6">
            <AnimatedSearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
              placeholders={[
                "Search for O/L Science...",
                "Find Grade 11 Past Papers...",
                "Search for Short Notes...",
                "Look for Marking Schemes...",
                "Search by subject or topic..."
              ]}
            />
          </div>

          {/* Results info */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <p className="text-sm text-slate-400">
              <span className="text-slate-200 font-bold">{filteredCount}</span>{" "}
              {filteredCount === 1 ? "resource" : "resources"} for{" "}
              <span className="text-white font-bold">{grade === null ? "All Grades" : `Grade ${grade}`}</span>
            </p>
            {activeFilterCount > 0 && (
              <button 
                type="button" 
                onClick={clearAll} 
                className="hidden sm:block text-xs font-bold uppercase tracking-wider text-purple-400 transition-colors duration-150 hover:text-purple-300 focus:outline-none focus:underline" 
              >
                Clear filters
              </button>
            )}
          </div>

          {selectedSubjects.size > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {Array.from(selectedSubjects).map((s) => {
                const style = getSubjectStyle(s);
                return (
                  <button 
                    key={s} 
                    type="button" 
                    onClick={() => toggleSubject(s)} 
                    className="inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all duration-150 hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-purple-500/40" 
                    style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }} 
                    aria-label={`Remove filter for ${s}`}
                  >
                    {s}
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true"><path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                  </button>
                );
              })}
            </div>
          )}

          {!isEmpty ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {isLive
                ? filteredLive.map((r) => <LiveResourceCard key={r._id} resource={r} />)
                : filteredStatic.map((r) => <StaticResourceCard key={r.id} resource={r} />)
              }
            </div>
          ) : (
            <EmptyState onReset={clearAll} />
          )}
        </div>
      </div>
    </div>
  );
}
