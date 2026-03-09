import Link from "next/link";
import HeroSection from "@/components/sections/HeroSection";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">

      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Features Grid ── */}
      <section className="section z-10 relative">
        <div className="container-xl">
          <div className="text-center mb-16 space-y-4">
            <div className="badge-gold mx-auto w-fit">Why Ape Danuma</div>
            <h2 className="text-balance">
              Everything you need to{" "}
              <span className="text-gradient-luminary">ace your O/Ls</span>
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: "var(--foreground-secondary)" }}>
              We provide the most comprehensive, high-quality study materials designed
              specifically for Sri Lankan English Medium students.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`card ${i === 0 ? "card-accent" : i === 2 ? "card-gold" : ""}`}
              >
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                  style={{
                    background: i % 3 === 0
                      ? "rgba(124,31,255,0.12)"
                      : i % 3 === 2
                      ? "rgba(245,158,11,0.12)"
                      : "rgba(255,255,255,0.05)",
                    border: `1px solid ${
                      i % 3 === 0
                        ? "rgba(124,31,255,0.25)"
                        : i % 3 === 2
                        ? "rgba(245,158,11,0.25)"
                        : "rgba(255,255,255,0.08)"
                    }`,
                  }}
                >
                  {f.icon}
                </div>
                <h4 className="mb-2 font-display font-semibold" style={{ color: "var(--foreground)" }}>
                  {f.title}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="section z-10 relative">
        <div className="container-xl">
          <div
            className="rounded-3xl p-12 text-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,31,255,0.12) 0%, rgba(10,10,10,0.8) 50%, rgba(245,158,11,0.08) 100%)",
              border: "1px solid rgba(124,31,255,0.2)",
              boxShadow:
                "0 0 60px rgba(124,31,255,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="absolute -top-20 -left-20 rounded-full opacity-30"
              style={{
                width: 300, height: 300,
                background: "radial-gradient(circle, rgba(124,31,255,0.3), transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            <div
              className="absolute -bottom-20 -right-20 rounded-full opacity-20"
              style={{
                width: 280, height: 280,
                background: "radial-gradient(circle, rgba(245,158,11,0.3), transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            <div className="relative z-10 space-y-6">
              <div className="badge-accent mx-auto w-fit">Limited Enrollment Open</div>
              <h2 className="text-balance max-w-2xl mx-auto">
                Your journey to{" "}
                <span className="text-gradient-premium">fluent, powerful English</span>{" "}
                begins today
              </h2>
              <p className="max-w-lg mx-auto" style={{ color: "var(--foreground-secondary)" }}>
                Join thousands of learners who have transformed their communication,
                careers, and confidence with Ape Danuma EM.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <a href="#" className="btn-primary px-10 py-3.5 text-base">Claim Your Spot</a>
                <a href="#" className="btn-outline-accent px-10 py-3.5 text-base">View Curriculum</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-10 z-10 relative" style={{ borderColor: "var(--border)" }}>
        <div
          className="container-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
          style={{ color: "var(--foreground-muted)" }}
        >
          <span className="font-display font-semibold flex items-baseline gap-1.5">
            <span style={{ color: "var(--foreground)" }}>Ape Danuma</span>
            <span
              style={{
                background: "linear-gradient(135deg, #9455ff, #7c1fff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              EM
            </span>
          </span>
          <span>© {new Date().getFullYear()} Ape Danuma EM. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white transition-colors" style={{ color: "var(--foreground-muted)" }}>Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors" style={{ color: "var(--foreground-muted)" }}>Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors" style={{ color: "var(--foreground-muted)" }}>Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: "✦",
    title: "Complete Resource Library",
    description:
      "Access thousands of past papers, term test papers, and model papers for all three terms in one organized place.",
  },
  {
    icon: "⬡",
    title: "All O/L Subjects Covered",
    description:
      "From Core subjects to Categories 1, 2, and 3, find dedicated study materials for every single subject you face.",
  },
  {
    icon: "◈",
    title: "Premium Short Notes",
    description:
      "Highly organized, beautifully formatted short notes designed specifically for quick revision and maximum retention.",
  },
  {
    icon: "◉",
    title: "Strictly Syllabus Aligned",
    description:
      "Every single note and paper is 100% aligned with the latest Sri Lankan G.C.E O/L English Medium curriculum.",
  },
  {
    icon: "⬟",
    title: "Smart Search & Filters",
    description:
      "Don't waste time scrolling. Find the exact grade, subject, and material type you need in seconds with our advanced filters.",
  },
  {
    icon: "✧",
    title: "High-Quality PDFs",
    description:
      "Crystal clear, professionally formatted PDF documents that are perfect for reading on any device or printing out.",
  },
];
