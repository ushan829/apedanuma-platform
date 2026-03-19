import HeroSection from "@/components/sections/HeroSection";
import FeaturesGrid from "@/components/sections/FeaturesGrid";
import CTABanner from "@/components/sections/CTABanner";

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
