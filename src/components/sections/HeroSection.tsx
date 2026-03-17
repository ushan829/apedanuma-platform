import Link from "next/link";
import dynamic from "next/dynamic";
import { Zap } from "lucide-react";
import GeometricBackground from "./hero/GeometricBackground";

// Dynamically import heavy interactive components with ssr: false
const RotatingStats = dynamic(() => import("./hero/RotatingStats"), { 
  ssr: false,
  loading: () => <div className="h-20 w-full animate-pulse bg-white/5 rounded-xl" />
});

const UltraPremiumDashboard = dynamic(() => import("./hero/UltraPremiumDashboard"), { 
  ssr: false,
  loading: () => (
    <div className="relative w-full max-w-[480px] aspect-square rounded-[2.5rem] bg-slate-800/40 border border-slate-700/50 animate-pulse flex items-center justify-center">
       <div className="w-12 h-12 rounded-full border-4 border-arcane-500/20 border-t-arcane-500 animate-spin" />
    </div>
  )
});

/* ─────────────────────────────────────────────────────────────
   Main Hero Section (Server Component)
   ───────────────────────────────────────────────────────────── */
export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "calc(100vh - 68px)" }}
      aria-label="Hero"
    >
      {/* Background is now a separate component, partially static SVGs */}
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
