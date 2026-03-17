"use client";

import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { FlaskConical, Pi, Languages, Monitor, Zap } from "lucide-react";

export default function UltraPremiumDashboard() {
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
        <m.div 
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -40, 40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-arcane-500/20 blur-[120px] rounded-full"
        />
        <m.div 
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
      <m.div 
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
            <m.div 
              whileHover={{ rotate: 180 }}
              className="relative h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 flex"
            >
              <Zap className="w-5 h-5 text-arcane-400" fill="currentColor" />
            </m.div>
          </div>
        </div>

        {/* Isometric Subject Grid */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          {subjects.map((s) => (
            <Link key={s.name} href={s.href} className="group outline-none">
              <m.div
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
                      <m.span
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
                      </m.span>
                    ))}
                  </div>
                </AnimatePresence>

                {/* Icon Rendering with Isometric Transforms */}
                <div className="flex flex-col items-center justify-center h-full gap-3 relative z-10">
                  <m.div
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
                      <m.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border border-amber-500/20 rounded-full scale-[1.8]"
                      />
                    )}
                  </m.div>
                  <span className="text-sm font-black text-slate-300 group-hover:text-white tracking-tight transition-colors">
                    {s.name}
                  </span>
                </div>
              </m.div>
            </Link>
          ))}
        </div>
      </m.div>
    </div>
  );
}
