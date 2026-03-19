import dynamic from "next/dynamic";
import HeroSection from "@/components/sections/HeroSection";

/**
 * Performance Optimization: Lazy-loading below-the-fold components
 * 
 * FeaturesGrid and CTABanner are moved to separate components and 
 * dynamically imported with ssr: false (where appropriate) to reduce 
 * the initial JavaScript payload and improve Total Blocking Time (TBT).
 */
const FeaturesGrid = dynamic(() => import("@/components/sections/FeaturesGrid"), {
  ssr: false, // Lazy-load on client side to reduce initial bundle
  loading: () => <div className="min-h-[400px]" />
});

const CTABanner = dynamic(() => import("@/components/sections/CTABanner"), {
  ssr: false,
  loading: () => <div className="min-h-[300px]" />
});

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">

      {/* ── Hero (Critical LCP) ── */}
      <HeroSection />

      {/* ── Features Grid (Lazy) ── */}
      <FeaturesGrid />

      {/* ── CTA Banner (Lazy) ── */}
      <CTABanner />
      
    </main>
  );
}
