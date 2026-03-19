"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import AnimatedSearchBar from "@/components/AnimatedSearchBar";
import FilterSidebar from "@/components/layout/FilterSidebar";
import UniversalCard from "@/components/Resource/UniversalCard";
import {
  getSubjectStyle,
  type Grade,
  type MaterialType,
  type TermFilter,
} from "@/lib/free-resources";
import type { LiveResource } from "@/lib/resource-constants";

export default function PremiumGrid({ products }: { products: LiveResource[] }) {
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
  const filtered = useMemo<LiveResource[]>(() => {
    return products.filter((r) => {
      if (r.grade !== grade) return false;
      if (materialType !== "all") {
        if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      }
      if (selectedSubjects.size > 0 && !selectedSubjects.has(r.subject)) return false;
      if (year !== null && r.year !== year) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !r.title.toLowerCase().includes(q) &&
          !r.subject.toLowerCase().includes(q)
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
    <div className="flex gap-8 items-start">
      {/* Mobile filter toggle */}
      <div className="flex flex-col w-full lg:hidden mb-6">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="btn-ghost w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 mb-4"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
        {showMobileFilters && (
          <div className="rounded-2xl p-5 glass-dark mb-4">
            {sidebarContent}
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:block shrink-0 scrollbar-hide"
        style={{
          width: 260,
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
        <div className="mb-8">
          <AnimatedSearchBar 
            value={searchQuery} 
            onChange={setSearchQuery}
            placeholders={[
              "Search for Premium Notes...",
              "Find Grade 11 Past Papers...",
              "Browse Model Answer packs...",
              "Search for O/L Masterclasses..."
            ]}
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium" style={{ color: "var(--foreground-muted)" }}>
            Found <span style={{ color: "var(--foreground)" }}>{filtered.length}</span> Premium Products
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((p) => (
                <m.div
                  key={p._id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <UniversalCard resource={p} isPremium={true} />
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
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(124,31,255,0.06)", border: "1px solid rgba(124,31,255,0.15)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ color: "#9455ff" }}>
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 11h6M11 8v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" transform="rotate(45 11 11)" />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg" style={{ color: "var(--foreground)" }}>No premium products found</h3>
              <p className="text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>
                We couldn't find any premium materials matching your current filters.
              </p>
            </div>
            <button onClick={clearAll} className="btn-primary px-8 py-2.5 mt-2 rounded-xl text-sm font-bold">
              Clear All Filters
            </button>
          </m.div>
        )}
      </div>
    </div>
  );
}
