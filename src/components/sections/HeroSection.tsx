import Link from "next/link";
import dynamic from "next/dynamic";
import { Zap } from "lucide-react";
import GeometricBackground from "./hero/GeometricBackground";
import StaticMobileHeroContent from "./hero/StaticMobileHeroContent";

// Desktop visual components are strictly isolated and lazily loaded ONLY for lg screens (1024px+)
const DesktopHeroVisuals = dynamic(() => import("./hero/DesktopHeroVisuals"), { 
  ssr: false,
});

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden group/hero"
      style={{ minHeight: "calc(100vh - 68px)" }}
      aria-label="Hero"
    >
      <GeometricBackground />

      <div className="container-xl relative z-10 flex items-center" style={{ minHeight: "calc(100vh - 68px)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_500px] gap-8 lg:gap-12 xl:gap-20 w-full py-12 lg:py-16">

          <div className="flex flex-col justify-center gap-6 lg:gap-10">
            <div className="inline-flex items-center gap-2 text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-400 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] w-fit lg:animate-heroBadgePop motion-reduce:animate-none">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #9455ff, #f59e0b)",
                  boxShadow: "0 0 4px rgba(148,85,255,0.4)",
                }}
              />
              <span className="text-foreground-muted">🇱🇰</span>
              <span>
                Designed for Sri Lanka&rsquo;s O/L Students
              </span>
            </div>

            <div className="flex flex-col gap-1 lg:animate-heroFadeUp lg:[animation-duration:0.25s] motion-reduce:animate-none">
              <h1
                className="font-display leading-[1.08] tracking-tight"
                style={{ fontSize: "clamp(2.4rem, 6.5vw, 4.5rem)" }}
              >
                <span className="text-foreground">Master Your</span>
                <br />
                <span
                  className="bg-clip-text text-transparent bg-gradient-to-r from-[#d4a8ff] via-[#9455ff] to-[#f59e0b]"
                  style={{
                    backgroundSize: "200% auto",
                  }}
                >
                  O/L Journey.
                </span>
              </h1>
            </div>

            <p
              className="text-base sm:text-lg leading-[1.75] max-w-[520px] lg:animate-heroFadeUp lg:[animation-duration:0.25s] lg:[animation-delay:0.2s] motion-reduce:animate-none text-foreground-secondary"
            >
              Access <span className="font-medium text-white">elite study materials</span>, comprehensive notes, and expert guidance designed exclusively for <span className="font-bold text-arcane-400">English Medium achievers</span>.
            </p>

            {/* CTA Container */}
            <div className="flex flex-col sm:flex-row gap-4 lg:animate-heroFadeUp lg:[animation-duration:0.25s] lg:[animation-delay:0.3s] motion-reduce:animate-none">
              <Link 
                href="/premium-store" 
                className="relative inline-flex items-center justify-center gap-2.5 font-display font-bold text-[0.9375rem] tracking-wide px-8 py-3.5 rounded-[0.875rem] text-white bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800 shadow-[0_0_24px_rgba(124,31,255,0.4),0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] border border-purple-400/50 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_36px_rgba(124,31,255,0.55),0_12px_32px_rgba(0,0,0,0.5)] overflow-hidden group w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                <Zap className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100" />
                <span>Explore Premium Notes</span>
              </Link>
              <Link 
                href="/free-resources" 
                className="inline-flex items-center justify-center gap-2.5 font-display font-bold text-[0.9375rem] tracking-wide px-8 py-3.5 rounded-[0.875rem] text-slate-400 bg-white/[0.03] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-300 hover:text-white hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-1 group w-full sm:w-auto"
              >
                <span>Browse Free Resources</span>
              </Link>
            </div>

            {/* ── MOBILE-ONLY STATIC CONTENT (100% JS-FREE) ── */}
            <StaticMobileHeroContent />

            {/* Desktop-only animated stats wrapper */}
            <div className="hidden lg:block min-h-[70px]">
              <DesktopHeroVisuals type="stats" />
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center w-full lg:animate-heroScaleIn lg:[animation-duration:0.3s] lg:[animation-delay:0.2s] motion-reduce:animate-none min-h-[500px]">
            {/* Desktop-only: Heavy dashboard logic */}
            <DesktopHeroVisuals type="dashboard" />
          </div>

        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-t from-background to-transparent"
      />
    </section>
  );
}
