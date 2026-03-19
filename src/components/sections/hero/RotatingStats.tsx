"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";

export default function RotatingStats() {
  const stats = [
    { value: "12,000+", label: "Students enrolled" },
    { value: "9",       label: "Core subjects" },
    { value: "2025",    label: "Syllabus aligned" },
    { value: "Free",    label: "Resources available" },
  ] as const;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 2) % stats.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [stats.length]);

  const currentStats = [
    stats[index],
    stats[(index + 1) % stats.length]
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Label with lines */}
      <div className="flex items-center gap-3">
        <div className="h-[1px] w-8" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1))" }} />
        <span className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-slate-500 whitespace-nowrap">
          Trusted by students island-wide
        </span>
        <div className="h-[1px] flex-1 max-w-[100px]" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.1), transparent)" }} />
      </div>

      {/* Animated Stats Display */}
      <div className="h-10 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <m.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-8 md:gap-12"
          >
            {currentStats.map((stat, _idx) => (
              <div key={_idx} className="flex items-center gap-3 group">
                <span 
                  className="text-xl font-black tracking-tight"
                  style={{ 
                    color: "var(--foreground)",
                    textShadow: "0 0 20px rgba(148,85,255,0.3)"
                  }}
                >
                  <span className="text-arcane-400">{stat.value}</span>
                </span>
                <span className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest leading-tight max-w-[80px]">
                  {stat.label}
                </span>
              </div>
            ))}
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
