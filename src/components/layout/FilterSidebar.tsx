"use client";

import { useState } from "react";
import { 
  SUBJECT_CATEGORIES, 
  getSubjectStyle, 
  TYPE_META,
  type Grade,
  type MaterialType,
  type TermFilter
} from "@/lib/free-resources";

interface FilterSidebarProps {
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
  showGradeFilter?: boolean;
}

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
    <div className="border-b border-white/[0.05]">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between py-3 text-left transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane-500/50 rounded-lg px-1 text-foreground-secondary"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-tight">{category.label}</span>
          {activeCount > 0 && (
            <span
              className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full bg-arcane-500/20 text-arcane-300 border border-arcane-500/30"
            >
              {activeCount}
            </span>
          )}
        </div>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
          className={`shrink-0 text-foreground-muted transition-transform duration-[220ms] ${isOpen ? "rotate-180" : "rotate-0"}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={`grid transition-[grid-template-rows] duration-[230ms] ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-0.5 pb-3">
            {category.subjects.map((subject) => {
              const isActive = selectedSubjects.has(subject);
              const s = getSubjectStyle(subject);
              return (
                <button
                  key={subject}
                  type="button"
                  onClick={() => onToggleSubject(subject)}
                  aria-pressed={isActive}
                  className={`flex items-center gap-2 w-full rounded-lg px-2 py-1.5 text-left text-xs transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane-500/50 ${isActive ? 'font-semibold' : 'font-normal'}`}
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

export default function FilterSidebar({
  grade, onGradeChange,
  materialType, onMaterialTypeChange,
  termFilter, onTermFilterChange,
  selectedSubjects, onToggleSubject,
  onClearAll, activeFilterCount,
  year, onYearChange, availableYears,
  showGradeFilter = true
}: FilterSidebarProps) {
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
    <div className="scrollbar-hide">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[0.65rem] font-bold uppercase tracking-widest text-foreground-muted">Filters</span>
        {activeFilterCount > 0 && (
          <button 
            type="button" 
            onClick={onClearAll} 
            className="text-[0.65rem] font-bold transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:underline text-arcane-400" 
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Grade toggle */}
      {showGradeFilter && (
        <div className="mb-5">
          <p className="text-[0.6rem] font-bold uppercase tracking-widest mb-2.5 text-foreground-muted">Grade</p>
          <div className="flex rounded-xl p-1 gap-1 bg-white/[0.04] border border-white/[0.07]">
            {([10, 11] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onGradeChange(g)}
                aria-pressed={grade === g}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane-500/50 ${
                  grade === g
                    ? "bg-gradient-to-br from-arcane-500/40 to-arcane-600/50 text-[#e0d0ff] border border-arcane-500/40 shadow-[0_0_12px_rgba(124,31,255,0.25)]"
                    : "bg-transparent text-foreground-muted border border-transparent"
                }`}
              >
                Grade {g}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Material type */}
      <div className="mb-5">
        <p className="text-[0.6rem] font-bold uppercase tracking-widest mb-2.5 text-foreground-muted">Material Type</p>
        <div className="flex flex-col gap-1">
          {baseMaterialTypes.map((t) => {
            const isActive = materialType === t.value;
            const meta = TYPE_META[t.value] ?? null;
            return (
              <div key={t.value}>
                <button
                  type="button"
                  onClick={() => { onMaterialTypeChange(t.value); if (t.value !== "term-test") onTermFilterChange(null); }}
                  aria-pressed={isActive}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane-500/50"
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
                        aria-pressed={termFilter === term}
                        className={`flex-1 py-1.5 rounded-lg text-[0.65rem] font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sovereign-500/50 ${
                          termFilter === term
                            ? "bg-sovereign-400/20 text-sovereign-300 border border-sovereign-400/35"
                            : "bg-white/[0.04] text-foreground-muted border border-white/[0.07]"
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
              <div className="my-1.5 h-px bg-gradient-to-r from-transparent via-luminary-500/25 to-transparent" aria-hidden="true" />
              <p className="text-[0.55rem] font-bold uppercase tracking-wider px-1 mb-1 text-luminary-500/60">Grade 11 Only</p>
              {grade11Types.map((t) => {
                const isActive = materialType === t.value;
                const meta = TYPE_META[t.value];
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => onMaterialTypeChange(t.value)}
                    aria-pressed={isActive}
                    className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane-500/50"
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
          <label htmlFor="year-filter" className="text-[0.6rem] font-bold uppercase tracking-widest mb-2.5 block text-foreground-muted">Year</label>
          <select
            id="year-filter"
            value={year ?? ""}
            onChange={(e) => onYearChange(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer text-sm"
          >
            <option className="bg-slate-900 text-white" value="">All Years</option>
            {availableYears.map((y) => (
              <option className="bg-slate-900 text-white" key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4 h-px bg-white/[0.06]" aria-hidden="true" />

      {/* Subject accordions */}
      <nav aria-label="Subject filters">
        <p className="text-[0.6rem] font-bold uppercase tracking-widest mb-1 text-foreground-muted">Subjects</p>
        {SUBJECT_CATEGORIES.map((cat, i) => (
          <AccordionSection
            key={cat.id}
            category={cat}
            selectedSubjects={selectedSubjects}
            onToggleSubject={onToggleSubject}
            defaultOpen={i === 0}
          />
        ))}
      </nav>
    </div>
  );
}
