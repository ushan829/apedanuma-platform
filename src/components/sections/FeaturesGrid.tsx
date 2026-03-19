import Link from "next/link";

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

export default function FeaturesGrid() {
  return (
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
              className={`relative p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.06] hover:border-white/20 group ${
                i === 0 ? "shadow-[0_0_30px_rgba(139,92,246,0.1)]" : i === 2 ? "shadow-[0_0_30px_rgba(245,158,11,0.1)]" : ""
              }`}
            >
              <div
                className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition-transform duration-500 group-hover:scale-110"
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
              <p className="mb-3 font-display font-bold text-lg text-white">
                {f.title}
              </p>
              <p className="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
