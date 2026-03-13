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
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Typewriter Effect ──
  useEffect(() => {
    const currentFullText = placeholders[placeholderIndex % placeholders.length];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setPlaceholder(currentFullText.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);

        if (charIndex === currentFullText.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setPlaceholder(currentFullText.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);

        if (charIndex === 0) {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => prev + 1);
        }
      }
    }, isDeleting ? 40 : 80);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, placeholderIndex, placeholders]);

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
      
      {/* ── Premium Animated Icon Container ── */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div className="relative flex items-center justify-center">
          {/* Animated Halo Rings (Active on group-focus-within) */}
          <div className="absolute inset-0 rounded-full bg-purple-500/20 scale-0 group-focus-within:animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-0 group-focus-within:opacity-100" />
          <div className="absolute inset-0 rounded-full bg-purple-400/10 scale-0 group-focus-within:animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-0 group-focus-within:opacity-100" style={{ animationDelay: '0.5s' }} />
          
          <Search 
            className={`w-5 h-5 transition-all duration-500 relative z-10 ${
              value 
                ? "text-purple-400 scale-110 rotate-[360deg]" 
                : "text-slate-500 group-focus-within:text-purple-400 group-focus-within:scale-110"
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
        className="w-full pl-12 pr-16 py-4 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl text-white placeholder-slate-500/70 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.1)] focus:shadow-[0_0_25px_rgba(168,85,247,0.2)]"
        aria-label="Search"
      />

      {/* Right Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
        {value ? (
          <button
            onClick={() => onChange("")}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-all duration-200 active:scale-90"
            title="Clear Search"
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
