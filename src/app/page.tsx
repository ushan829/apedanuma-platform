import HeroSection from "@/components/sections/HeroSection";
import dynamic from "next/dynamic";

const FeaturesGrid = dynamic(() => import("@/components/sections/FeaturesGrid"), {
  ssr: true,
});

const CTABanner = dynamic(() => import("@/components/sections/CTABanner"), {
  ssr: true,
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
