"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import AnimatedSearchBar from "@/components/AnimatedSearchBar";
import FilterSidebar from "@/components/layout/FilterSidebar";
import UniversalCard from "@/components/Resource/UniversalCard";
import { 
  FREE_RESOURCES, 
  getSubjectStyle,
  type Grade,
  type MaterialType,
  type TermFilter,
  type FreeResource
} from "@/lib/free-resources";

export default function FreeResourcesSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Initial State from URL
  const [grade, setGrade] = useState<Grade>(() => {
    const g = searchParams.get("grade");
    return (g === "11" ? 11 : 10) as Grade;
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

  // 2. Sync State -> URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (grade === 11) params.set("grade", "11");
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
    setGrade(10);
    setMaterialType("all");
    setTermFilter(null);
    setSelectedSubjects(new Set());
    setSearchQuery("");
    setYear(null);
  };

  /* Client-side filtering */
  const filtered = useMemo<FreeResource[]>(() => {
    return FREE_RESOURCES.filter((r) => {
      if (r.grade !== grade) return false;
      if (materialType !== "all") {
        if (r.type !== materialType) return false;
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
  }, [grade, materialType, termFilter, selectedSubjects, year, searchQuery]);

  const availableYears = useMemo<number[]>(() => {
    const years = new Set<number>();
    FREE_RESOURCES.forEach((r) => { if (r.year) years.add(r.year); });
    return Array.from(years).sort((a, b) => b - a);
  }, []);

  const activeFilterCount =
    (materialType !== "all" ? 1 : 0) +
    (termFilter !== null ? 1 : 0) +
    selectedSubjects.size +
    (year !== null ? 1 : 0);

  const sidebarContent = (
    <FilterSidebar
      grade={grade}               onGradeChange={handleGradeChange}
      materialType={materialType} onMaterialTypeChange={setMaterialType}
      termFilter={termFilter}     onTermFilterChange={setTermFilter}
      selectedSubjects={selectedSubjects} onToggleSubject={toggleSubject}
      onClearAll={clearAll}       activeFilterCount={activeFilterCount}
      year={year}                 onYearChange={setYear} availableYears={availableYears}
    />
  );

  return (
    <section id="free-resources" className="section relative z-10" aria-labelledby="free-resources-title">
      <div className="container-xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-14">
          <div className="badge-gold w-fit">Completely Free</div>
          <h2 id="free-resources-title" className="text-balance">
            Free Study <span className="text-gradient-luminary">Materials</span>
          </h2>
          <p className="max-w-lg text-lg leading-relaxed text-foreground-secondary">
            High-quality notes, guides and practice packs for all O/L English
            Medium subjects — curated by expert teachers and updated for the 2025 syllabus.
          </p>
        </div>

        {/* Search */}
        <div className="mb-10 max-w-2xl mx-auto">
          <AnimatedSearchBar 
            value={searchQuery} 
            onChange={setSearchQuery}
            placeholders={[
              "Search for Grade 10 Science...",
              "Find Mathematics short notes...",
              "Browse free ICT past papers...",
              "Look for Grade 11 History guides..."
            ]}
          />
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <p className="text-sm text-foreground-muted">
            <span className="text-foreground-secondary font-semibold">{filtered.length}</span>{" "}
            resources found
          </p>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="btn-ghost py-2 px-4 rounded-xl text-sm font-bold flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        {/* Mobile filters panel */}
        {showMobileFilters && (
          <div className="lg:hidden mb-8 rounded-2xl p-5 glass-dark">
            {sidebarContent}
          </div>
        )}

        <div className="flex gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside
            className="hidden lg:block shrink-0 scrollbar-hide w-[260px] sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto bg-white/[0.025] border border-white/[0.07] rounded-[1.25rem] p-5 backdrop-blur-[20px]"
          >
            {sidebarContent}
          </aside>

          {/* Grid Area */}
          <div className="flex-1 min-w-0">
            {/* Results Info */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <p className="text-sm font-medium text-foreground-muted">
                Showing <span className="text-foreground">{filtered.length}</span> resources
                {selectedSubjects.size > 0 && ` in ${selectedSubjects.size} subjects`}
              </p>
              {activeFilterCount > 0 && (
                <button onClick={clearAll} className="text-xs font-bold text-arcane-400 hover:text-white transition-colors">
                  Clear All Filters
                </button>
              )}
            </div>

            {/* Subject Pills */}
            {selectedSubjects.size > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {Array.from(selectedSubjects).map(s => {
                  const style = getSubjectStyle(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSubject(s)}
                      className="chip py-1 px-3"
                      style={{ background: style.bg, color: style.color, borderColor: style.border }}
                    >
                      {s} <span className="ml-1 opacity-60">×</span>
                    </button>
                  );
                })}
              </div>
            )}

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {filtered.map(r => (
                    <m.div
                      key={r.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                    >
                      <UniversalCard resource={r} isPremium={false} />
                    </m.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <m.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-24 text-center glass rounded-[2rem] flex flex-col items-center justify-center gap-5"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-amber-500/[0.06] border border-amber-500/[0.15]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-luminary-500">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 11h6M11 8v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" transform="rotate(45 11 11)" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground">No matches found</h3>
                  <p className="text-sm mt-1 text-foreground-muted">
                    Try adjusting your filters or search query to find what you're looking for.
                  </p>
                </div>
                <button onClick={clearAll} className="btn-primary px-8 py-2.5 mt-2 rounded-xl text-sm font-bold">
                  Clear All Filters
                </button>
              </m.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
