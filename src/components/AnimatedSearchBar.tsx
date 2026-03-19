"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface AnimatedSearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholders?: string[];
  className?: string;
}

const DEFAULT_PLACEHOLDERS = [
  "Search for O/L Science...",
  "Find Grade 11 Past Papers...",
  "Search for Premium Notes...",
  "Look for Marking Schemes...",
  "Discover Model Answers...",
];

export default function AnimatedSearchBar({
  value,
  onChange,
  placeholders = DEFAULT_PLACEHOLDERS,
  className = "",
}: AnimatedSearchBarProps) {
  const [placeholder, setPlaceholder] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Static Placeholder on Load ──
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * placeholders.length);
    setPlaceholder(placeholders[randomIndex]);
  }, [placeholders]);

  // ── Keyboard Shortcut ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={`relative group w-full ${className}`}>
      
      {/* ── Refined Icon Container ── */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div className="relative flex items-center justify-center">
          <Search 
            className={`w-5 h-5 transition-all duration-500 relative z-10 ${
              value 
                ? "text-purple-400" 
                : "text-slate-500 group-focus-within:text-purple-400"
            }`} 
          />
        </div>
      </div>

      {/* Main Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-16 py-4 bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:bg-white/10 transition-all rounded-2xl"
        aria-label="Search resources"
      />

      {/* Placeholder display for typewriter effect (if re-enabled later) or static display */}
      <span className="sr-only" aria-hidden="true">{placeholder}</span>

      {/* Right Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
        {value ? (
          <button
            onClick={() => onChange("")}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-all duration-200 active:scale-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0B0F19]"
            title="Clear Search"
            aria-label="Clear search query"
          >
            <X size={14} strokeWidth={3} />
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-700/50 bg-slate-900/50 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
              {typeof window !== 'undefined' && navigator?.platform?.toLowerCase().includes("mac") ? "⌘" : "Ctrl"}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">K</span>
          </div>
        )}
      </div>

      {/* Subtle bottom glow line */}
      <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
    </div>
  );
}
