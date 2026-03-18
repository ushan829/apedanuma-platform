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
      className="relative overflow-hidden"
      style={{ minHeight: "calc(100vh - 68px)" }}
      aria-label="Hero"
    >
      <GeometricBackground />

      <div className="container-xl relative z-10 flex items-center" style={{ minHeight: "calc(100vh - 68px)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_500px] gap-8 lg:gap-12 xl:gap-20 w-full py-12 lg:py-16">

          <div className="flex flex-col justify-center gap-6 lg:gap-8">
            <div className="hero-badge w-fit lg:animate-heroBadgePop motion-reduce:animate-none">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full lg:animate-pulseDot motion-reduce:animate-none"
                style={{
                  background: "linear-gradient(135deg, #9455ff, #f59e0b)",
                  boxShadow: "0 0 6px rgba(148,85,255,0.6)",
                }}
              />
              <span style={{ color: "var(--foreground-muted)" }}>🇱🇰</span>
              <span className="tracking-widest uppercase text-[0.6rem] sm:text-[0.65rem]" style={{ color: "var(--foreground-secondary)" }}>
                Designed for Sri Lanka&rsquo;s O/L Students
              </span>
            </div>

            <div className="flex flex-col gap-1 lg:animate-heroFadeUp motion-reduce:animate-none">
              <h1
                className="font-display leading-[1.08] tracking-tight"
                style={{ fontSize: "clamp(2.4rem, 6.5vw, 4.5rem)" }}
              >
                <span style={{ color: "var(--foreground)" }}>Master Your</span>
                <br />
                <span
                  className="lg:animate-gradientShift motion-reduce:animate-none"
                  style={{
                    background: "linear-gradient(135deg, #d4a8ff 0%, #9455ff 35%, #7c1fff 55%, #f59e0b 85%, #fbbf24 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  O/L Journey.
                </span>
              </h1>
            </div>

            <p
              className="text-base sm:text-lg leading-[1.75] max-w-[520px] lg:animate-heroFadeUp lg:[animation-delay:0.1s] motion-reduce:animate-none"
              style={{ color: "var(--foreground-secondary)" }}
            >
              Access <span className="font-medium text-white">elite study materials</span>, comprehensive notes, and expert guidance designed exclusively for <span className="font-bold text-arcane-400">English Medium achievers</span>.
            </p>

            {/* CTA Container */}
            <div className="flex flex-col sm:flex-row gap-4 lg:animate-heroFadeUp lg:[animation-delay:0.2s] motion-reduce:animate-none">
              <Link href="/premium-store" className="btn-hero-primary group w-full sm:w-auto">
                <Zap className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100" />
                <span>Explore Premium Notes</span>
              </Link>
              <Link href="/free-resources" className="btn-hero-ghost group w-full sm:w-auto">
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

          <div className="hidden lg:flex items-center justify-center w-full lg:animate-heroScaleIn lg:[animation-delay:0.2s] motion-reduce:animate-none min-h-[500px]">
            {/* Desktop-only: Heavy dashboard logic */}
            <DesktopHeroVisuals type="dashboard" />
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
