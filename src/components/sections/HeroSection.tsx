"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Pi, Languages, Monitor, Zap } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Rotating Stats Component
   ───────────────────────────────────────────────────────────── */
function RotatingStats() {
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
          <motion.div
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Geometric background — dot grid + perspective fan + shapes
   ───────────────────────────────────────────────────────────── */
function GeometricBackground() {
  /* Fan lines: 9 lines converging from bottom to top-center (50, 0) */
  const fanLines = [0, 12, 25, 37, 50, 63, 75, 88, 100];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">

      {/* ── Layer 1: Fine dot grid ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.35 }}
      >
        <defs>
          <pattern id="hero-dot-grid" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="18" cy="18" r="0.8" fill="rgba(255,255,255,0.55)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dot-grid)" />
      </svg>

      {/* ── Layer 2: Perspective fan lines ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ opacity: 1 }}
      >
        <defs>
          {/* Gradient: fades from visible at bottom to invisible at top */}
          <linearGradient id="fan-fade" x1="0" y1="1" x2="0" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#7c1fff" stopOpacity="0.13" />
            <stop offset="55%"  stopColor="#7c1fff" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#7c1fff" stopOpacity="0"    />
          </linearGradient>
          {/* Gradient for the horizon line */}
          <linearGradient id="horizon-grad" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#7c1fff" stopOpacity="0"    />
            <stop offset="30%"  stopColor="#7c1fff" stopOpacity="0.1"  />
            <stop offset="50%"  stopColor="#9455ff" stopOpacity="0.15" />
            <stop offset="70%"  stopColor="#f59e0b" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"    />
          </linearGradient>
        </defs>

        {/* Fan lines */}
        {fanLines.map((x) => (
          <line
            key={x}
            x1={`${x}`} y1="100"
            x2="50"      y2="0"
            stroke="url(#fan-fade)"
            strokeWidth="0.25"
          />
        ))}

        {/* Horizon cross-line at ~62% height */}
        <line x1="0" y1="62" x2="100" y2="62" stroke="url(#horizon-grad)" strokeWidth="0.3" />

        {/* Secondary cross-lines */}
        <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(124,31,255,0.04)" strokeWidth="0.2" />
        <line x1="0" y1="45" x2="100" y2="45" stroke="rgba(124,31,255,0.03)" strokeWidth="0.2" />
      </svg>

      {/* ── Layer 3: Glow orbs ── */}
      <div
        className="absolute rounded-full"
        style={{
          width: 800,
          height: 700,
          top: -280,
          left: "50%",
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse at 50% 30%, rgba(124,31,255,0.22) 0%, rgba(87,0,190,0.1) 40%, transparent 70%)",
          filter: "blur(60px)",
          animation: "glowPulse 5s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 400,
          bottom: -100,
          right: "-8%",
          background: "radial-gradient(ellipse, rgba(245,158,11,0.1) 0%, transparent 65%)",
          filter: "blur(50px)",
          animation: "glowPulse 7s 2s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          bottom: "-5%",
          left: "5%",
          background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Ultra-Premium Interactive Subject Dashboard
   ───────────────────────────────────────────────────────────── */
function UltraPremiumDashboard() {
  const subjects = [
    { 
      name: "Science", 
      icon: FlaskConical,
      color: "#34d399",
      glowColor: "rgba(52,211,153,0.5)",
      href: "/free-resources?subject=science",
      particles: ["●", "○", "✧"],
      specialEffect: "bioluminescent"
    },
    { 
      name: "Mathematics", 
      icon: Pi,
      color: "#60a5fa",
      glowColor: "rgba(96,165,250,0.5)",
      href: "/free-resources?subject=mathematics",
      particles: ["π", "∞", "Σ"],
      specialEffect: "numerical"
    },
    { 
      name: "English", 
      icon: Languages,
      color: "#f59e0b",
      glowColor: "rgba(245,158,11,0.5)",
      href: "/free-resources?subject=english",
      particles: ["A", "B", "C"],
      specialEffect: "golden"
    },
    { 
      name: "ICT", 
      icon: Monitor,
      color: "#22d3ee",
      glowColor: "rgba(34,211,238,0.5)",
      href: "/free-resources?subject=ict",
      particles: ["1", "0", "□"],
      specialEffect: "digital"
    },
  ];

  return (
    <div className="relative w-full max-w-[480px]">
      {/* ── Plasma Energy Background Layer ── */}
      <div className="absolute inset-0 -z-10 rounded-[2.5rem] overflow-hidden opacity-30">
        <div className="absolute inset-0 bg-slate-900" />
        <motion.div 
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -40, 40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-arcane-500/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{
            x: [0, -50, 50, 0],
            y: [0, 50, -50, 0],
            scale: [1, 0.8, 1.3, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 1 }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-amber-500/10 blur-[100px] rounded-full"
        />
      </div>

      {/* ── Main Premium Card Container ── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 backdrop-blur-2xl bg-slate-800/40 border border-slate-700/50 rounded-[2.5rem] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.4)]"
        style={{
          boxShadow: "0 0 0 1px rgba(255,255,255,0.05) inset"
        }}
      >
        {/* Animated Continuous Border Glow */}
        <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none p-[1px]">
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-arcane-500/40 via-transparent to-amber-500/40 animate-border-glow" />
        </div>

        {/* Header with Light Leak Effect */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="relative">
            <h3 className="text-xl font-black text-white tracking-tighter flex items-center gap-2">
              <span className="relative">
                QUICK ACCESS
                <span className="absolute inset-0 bg-gradient-to-r from-arcane-400 via-amber-400 to-cyan-400 blur-md opacity-20 animate-pulse" />
              </span>
            </h3>
            <p className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 opacity-70">
              Select Your Focus Subject
            </p>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-arcane-500/20 blur-xl rounded-full group-hover:bg-arcane-500/40 transition-colors" />
            <motion.div 
              whileHover={{ rotate: 180 }}
              className="relative h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 flex"
            >
              <Zap className="w-5 h-5 text-arcane-400" fill="currentColor" />
            </motion.div>
          </div>
        </div>

        {/* Isometric Subject Grid */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          {subjects.map((s) => (
            <Link key={s.name} href={s.href} className="group outline-none">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative h-40 rounded-3xl p-6 transition-all duration-500 overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                }}
              >
                {/* 3D Depth Layer */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/5 group-hover:bg-white/10 transition-colors" />
                
                {/* Unique Bioluminescent Glow Background */}
                <div 
                  className="absolute -top-10 -right-10 w-32 h-32 blur-[40px] opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                  style={{ background: s.glowColor }}
                />

                {/* Particle System */}
                <AnimatePresence>
                  <div className="absolute inset-0 pointer-events-none">
                    {s.particles.map((p, pIdx) => (
                      <motion.span
                        key={pIdx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: [0, 0.6, 0], 
                          y: [-10, -30], 
                          x: [0, (pIdx % 2 === 0 ? 15 : -15)],
                          scale: [1, 1.2, 0.8]
                        }}
                        transition={{ 
                          duration: 2 + Math.random(), 
                          repeat: Infinity, 
                          delay: pIdx * 0.5 
                        }}
                        className="absolute bottom-1/4 left-1/2 text-[10px] font-bold"
                        style={{ color: s.color }}
                      >
                        {p}
                      </motion.span>
                    ))}
                  </div>
                </AnimatePresence>

                {/* Icon Rendering with Isometric Transforms */}
                <div className="flex flex-col items-center justify-center h-full gap-3 relative z-10">
                  <motion.div
                    animate={s.specialEffect === "bioluminescent" ? {
                      filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative"
                  >
                    <s.icon 
                      className="w-10 h-10 group-hover:scale-110 transition-transform duration-500"
                      style={{ 
                        color: s.color,
                        filter: `drop-shadow(0 0 12px ${s.color}60)`
                      }}
                    />
                    {s.specialEffect === "golden" && (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border border-amber-500/20 rounded-full scale-[1.8]"
                      />
                    )}
                  </motion.div>
                  <span className="text-sm font-black text-slate-300 group-hover:text-white tracking-tight transition-colors">
                    {s.name}
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Hero Section
   ───────────────────────────────────────────────────────────── */
export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "calc(100vh - 68px)" }}
      aria-label="Hero"
    >
      <GeometricBackground />

      <div className="container-xl relative z-10 flex items-center" style={{ minHeight: "calc(100vh - 68px)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_500px] gap-12 xl:gap-20 w-full py-20 lg:py-16">

          <div className="flex flex-col justify-center gap-7 lg:gap-8">
            <div
              className="hero-badge w-fit"
              style={{ animation: "heroBadgePop 0.6s 0.1s cubic-bezier(0.34,1.56,0.64,1) both" }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #9455ff, #f59e0b)",
                  boxShadow: "0 0 6px rgba(148,85,255,0.6)",
                  animation: "pulseDot 2.5s ease-in-out infinite",
                }}
              />
              <span style={{ color: "var(--foreground-muted)" }}>🇱🇰</span>
              <span className="tracking-widest uppercase text-[0.65rem]" style={{ color: "var(--foreground-secondary)" }}>
                Designed for Sri Lanka&rsquo;s O/L Students
              </span>
            </div>

            <div
              className="flex flex-col gap-1"
              style={{ animation: "heroFadeUp 0.7s 0.2s ease both" }}
            >
              <h1
                className="font-display leading-[1.08] tracking-tight"
                style={{ fontSize: "clamp(2.6rem, 6vw, 4.5rem)" }}
              >
                <span style={{ color: "var(--foreground)" }}>Master Your</span>
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #d4a8ff 0%, #9455ff 35%, #7c1fff 55%, #f59e0b 85%, #fbbf24 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animation: "gradientShift 5s ease-in-out infinite",
                  }}
                >
                  O/L Journey.
                </span>
              </h1>
            </div>

            <p
              className="text-lg leading-[1.75] max-w-[520px]"
              style={{
                color: "var(--foreground-secondary)",
                animation: "heroFadeUp 0.7s 0.35s ease both",
              }}
            >
              Access <span className="font-medium text-white">elite study materials</span>, comprehensive notes, and expert guidance designed exclusively for <span className="font-bold text-arcane-400">English Medium achievers</span>.
            </p>

            <div
              className="flex flex-wrap gap-4 items-center"
              style={{ animation: "heroFadeUp 0.7s 0.5s ease both" }}
            >
              <Link href="/premium-store" className="btn-hero-primary group">
                <Zap className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span>Explore Premium Notes</span>
                <svg className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </Link>
              <Link href="/free-resources" className="btn-hero-ghost group">
                <svg className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                </svg>
                <span>Browse Free Resources</span>
              </Link>
            </div>

            <div
              className="flex flex-col gap-3"
              style={{ animation: "heroFadeUp 0.7s 0.65s ease both" }}
            >
              <RotatingStats />
            </div>
          </div>

          <div
            className="flex items-center justify-center w-full"
            style={{ animation: "heroScaleIn 0.8s 0.4s cubic-bezier(0.25,0.46,0.45,0.94) both" }}
          >
            <UltraPremiumDashboard />
          </div>

        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
      />
    </section>
  );
}
