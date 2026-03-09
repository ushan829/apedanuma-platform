import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Ape Danuma EM — Sri Lanka's premier O/L English Medium study platform built for students who refuse to settle for average.",
};

/* ─────────────────────────────────────────
   Shared decorative: dot-grid SVG background
   ───────────────────────────────────────── */
function DotGrid({ opacity = 0.3 }: { opacity?: number }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity }}
    >
      <defs>
        <pattern id="about-dots" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
          <circle cx="18" cy="18" r="0.7" fill="rgba(255,255,255,0.5)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#about-dots)" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   1. HERO
   ───────────────────────────────────────── */
function Hero() {
  const stats = [
    { value: "12,000+", label: "Active Students" },
    { value: "Grade 10 & 11",  label: "O/L Focused" },
    { value: "All Subjects",   label: "EM Curriculum" },
    { value: "100% Free",      label: "Core Resources" },
  ];

  /* Perspective fan lines converging at top-center */
  const fanX = [0, 12, 25, 38, 50, 62, 75, 88, 100];

  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{ minHeight: "calc(100vh - 68px)" }}
    >
      {/* ── Ambient orbs ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: 900, height: 600,
            background: "radial-gradient(ellipse, rgba(124,31,255,0.14) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 rounded-full"
          style={{
            width: 500, height: 500,
            background: "radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute top-1/3 -left-20 rounded-full"
          style={{
            width: 400, height: 400,
            background: "radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* ── Geometric background ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
        <DotGrid opacity={0.28} />

        {/* Fan lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="hero-fan" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%"   stopColor="#7c1fff" stopOpacity="0.12" />
              <stop offset="60%"  stopColor="#7c1fff" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#7c1fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {fanX.map((x) => (
            <line
              key={x}
              x1={`${x}`} y1="100"
              x2="50"     y2="0"
              stroke="url(#hero-fan)"
              strokeWidth="0.2"
            />
          ))}
        </svg>

        {/* Bottom horizon glow line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 5%, rgba(124,31,255,0.25) 35%, rgba(148,85,255,0.4) 50%, rgba(245,158,11,0.15) 65%, transparent 95%)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="container-xl relative z-10 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] mb-8"
            style={{
              background: "rgba(124,31,255,0.1)",
              border: "1px solid rgba(124,31,255,0.28)",
              color: "#b890ff",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#9455ff", boxShadow: "0 0 6px rgba(124,31,255,0.8)" }}
            />
            About Ape Danuma EM
          </div>

          {/* Heading */}
          <h1
            className="font-display font-black tracking-tight mb-7 text-balance"
            style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)", lineHeight: 1.08 }}
          >
            Redefining Education
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #9455ff 0%, #7c1fff 40%, #b890ff 75%, #f59e0b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              for the Next Generation.
            </span>
          </h1>

          {/* Sub-headline */}
          <p
            className="max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed mb-14"
            style={{ color: "var(--foreground-secondary)" }}
          >
            We built <span style={{ color: "#c4a0ff", fontWeight: 600 }}>Ape Danuma EM</span> to
            be Sri Lanka&apos;s most trusted study platform for O/L English Medium students —
            where discipline meets resources, and every focused student gets the tools to reach
            the very top.
          </p>

          {/* Stats strip */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-2xl"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center px-6 py-5 gap-1"
                style={{ background: "rgba(10,10,10,0.85)" }}
              >
                <span
                  className="font-display font-black text-xl sm:text-2xl"
                  style={{
                    background: "linear-gradient(135deg, #f0f0f0 40%, #9455ff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {value}
                </span>
                <span className="text-xs font-medium" style={{ color: "var(--foreground-muted)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   2. OUR STORY
   ───────────────────────────────────────── */
function OurStory() {
  const milestones = [
    { year: "2023", label: "Community Founded", desc: "Started as a small WhatsApp group sharing study notes" },
    { year: "2024", label: "Platform Launched", desc: "Ape Danuma EM goes live with free O/L resources" },
    { year: "2025", label: "Premium Store", desc: "Expert-crafted packs launched for in-depth exam prep" },
  ];

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 600, height: 600,
          background: "radial-gradient(ellipse, rgba(124,31,255,0.07) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      <div className="container-xl relative z-10">
        <div className="grid lg:grid-cols-[1fr_420px] gap-14 xl:gap-20 items-start">

          {/* ── Left: story text ── */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.14em] mb-6"
              style={{
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.22)",
                color: "#fbbf24",
              }}
            >
              Our Story
            </div>

            <h2
              className="font-display font-black mb-6 text-balance"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)", lineHeight: 1.12 }}
            >
              Born from a Community.{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #9455ff, #b890ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Built for Excellence.
              </span>
            </h2>

            <div className="space-y-5 mb-10">
              <p className="text-[0.9375rem] leading-[1.85]" style={{ color: "var(--foreground-secondary)" }}>
                Ape Danuma EM started not as a company, but as a community — a group of students
                and educators who were frustrated by the lack of high-quality, organised study
                materials for Sri Lanka&apos;s G.C.E. O/L English Medium curriculum. Every
                resource was scattered, low quality, or behind a paywall that most families
                couldn&apos;t afford.
              </p>
              <p className="text-[0.9375rem] leading-[1.85]" style={{ color: "var(--foreground-secondary)" }}>
                We set out to change that. Starting with the core subjects — Mathematics, Combined
                Science, English Language, History, and ICT — and expanding to cover the full
                English Medium syllabus across{" "}
                <span style={{ color: "#c4a0ff", fontWeight: 500 }}>
                  Core subjects, Religion, and Categories 1, 2, and 3
                </span>
                , Ape Danuma became the single most comprehensive O/L resource hub in Sri Lanka.
              </p>
              <p className="text-[0.9375rem] leading-[1.85]" style={{ color: "var(--foreground-secondary)" }}>
                Today, more than 12,000 students trust Ape Danuma EM as their primary study
                platform. Every past paper, every short note, every premium pack is
                educator-verified and syllabus-aligned for the latest exams. This is not just a
                website — it&apos;s a movement.
              </p>
            </div>

            {/* Pull quote */}
            <blockquote
              className="relative pl-6 py-1"
              style={{ borderLeft: "3px solid rgba(124,31,255,0.5)" }}
            >
              <p
                className="text-base italic font-medium leading-relaxed"
                style={{ color: "#c4a0ff" }}
              >
                &ldquo;Every great student deserves great resources — regardless of where
                they live or what they can afford.&rdquo;
              </p>
              <footer
                className="text-xs mt-2 font-semibold uppercase tracking-wider"
                style={{ color: "var(--foreground-muted)" }}
              >
                — Ape Danuma EM Mission
              </footer>
            </blockquote>
          </div>

          {/* ── Right: origin & milestones card ── */}
          <div className="space-y-4">
            {/* Origin card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(124,31,255,0.1), rgba(87,0,190,0.06))",
                border: "1px solid rgba(124,31,255,0.22)",
                boxShadow: "0 0 40px rgba(124,31,255,0.08) inset",
              }}
            >
              {/* Top bar */}
              <div
                className="h-1 w-full"
                style={{
                  background: "linear-gradient(90deg, #7c1fff, #9455ff 50%, #f59e0b)",
                }}
              />
              <div className="p-7">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p
                      className="font-display font-black text-4xl leading-none"
                      style={{
                        background: "linear-gradient(135deg, #9455ff, #b890ff)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      2023
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "var(--foreground-muted)" }}>
                      Year Founded
                    </p>
                  </div>
                  {/* Decorative icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, rgba(124,31,255,0.2), rgba(87,0,190,0.3))",
                      border: "1px solid rgba(124,31,255,0.3)",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: "#9455ff" }}>
                      <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" fill="currentColor" opacity="0.9" />
                    </svg>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--foreground-secondary)" }}>
                  A single vision: give every O/L English Medium student in Sri Lanka access to
                  the same quality of resources that top-performing schools provide.
                </p>

                <div className="h-px mb-6" style={{ background: "rgba(124,31,255,0.15)" }} />

                {/* Milestones */}
                <div className="space-y-4">
                  {milestones.map((m, i) => (
                    <div key={m.year} className="flex gap-4 items-start">
                      {/* Timeline dot + line */}
                      <div className="flex flex-col items-center shrink-0" style={{ paddingTop: 2 }}>
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: i === milestones.length - 1
                              ? "linear-gradient(135deg, #f59e0b, #fbbf24)"
                              : "linear-gradient(135deg, #9455ff, #7c1fff)",
                            boxShadow: i === milestones.length - 1
                              ? "0 0 8px rgba(245,158,11,0.5)"
                              : "0 0 8px rgba(124,31,255,0.5)",
                          }}
                        />
                        {i < milestones.length - 1 && (
                          <div
                            className="w-px flex-1 mt-1.5"
                            style={{ background: "rgba(255,255,255,0.08)", minHeight: 28 }}
                          />
                        )}
                      </div>
                      <div className="pb-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold" style={{ color: "#9455ff" }}>{m.year}</span>
                          <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{m.label}</span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--foreground-muted)" }}>{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subject coverage badge */}
            <div
              className="rounded-xl px-5 py-4 flex items-center gap-4"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                style={{
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.22)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: "#f59e0b" }}>
                  <path d="M9 1.5L10.9 6.3H16L11.9 9.2L13.5 14L9 11.2L4.5 14L6.1 9.2L2 6.3H7.1L9 1.5Z" fill="currentColor" opacity="0.85" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  Full Curriculum Coverage
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                  Core · Religion · Cat 1 · Cat 2 · Cat 3
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   3. THE 1% PHILOSOPHY
   ───────────────────────────────────────── */
function PhilosophySection() {
  const traits = [
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      label: "Relentlessly Focused",
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2L9.5 6.2H14L10.5 8.7L11.8 13L8 10.6L4.2 13L5.5 8.7L2 6.2H6.5L8 2Z" fill="currentColor" opacity="0.85" />
        </svg>
      ),
      label: "Exceptionally Disciplined",
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 13V8M6 13V5M9 13V7M12 13V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      label: "Always Improving",
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1.5l1.5 4.5H14l-3.7 2.7 1.4 4.3L8 10.2l-3.7 2.8 1.4-4.3L2 6h4.5L8 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      ),
      label: "Refuses to Settle",
    },
  ];

  return (
    <section
      className="relative overflow-hidden py-28 sm:py-36"
      style={{ background: "rgba(6,4,14,0.96)" }}
    >
      {/* Dot grid overlay */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <DotGrid opacity={0.18} />

        {/* Central radial glow */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(124,31,255,0.1) 0%, transparent 70%)",
          }}
        />

        {/* Giant "1%" watermark — pure CSS decoration */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span
            className="font-display font-black leading-none"
            style={{
              fontSize: "clamp(16rem, 40vw, 32rem)",
              background: "linear-gradient(135deg, rgba(245,158,11,0.04) 0%, rgba(124,31,255,0.04) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.05em",
              userSelect: "none",
            }}
          >
            1%
          </span>
        </div>

        {/* Top + bottom edge lines */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent 5%, rgba(124,31,255,0.2) 30%, rgba(148,85,255,0.35) 50%, rgba(124,31,255,0.2) 70%, transparent 95%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent 5%, rgba(245,158,11,0.15) 30%, rgba(245,158,11,0.25) 50%, rgba(245,158,11,0.15) 70%, transparent 95%)",
          }}
        />
      </div>

      <div className="container-xl relative z-10">
        <div className="max-w-3xl mx-auto text-center">

          {/* Gold badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] mb-8"
            style={{
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.3)",
              color: "#fbbf24",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#f59e0b", boxShadow: "0 0 6px rgba(245,158,11,0.9)" }}
            />
            The 1% Philosophy
          </div>

          {/* Main heading */}
          <h2
            className="font-display font-black mb-6 text-balance"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", lineHeight: 1.1 }}
          >
            <span style={{ color: "#f0f0f0" }}>Not built for everyone.</span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #f59e0b 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Built for those who refuse to settle.
            </span>
          </h2>

          {/* Body */}
          <p
            className="text-base sm:text-lg leading-[1.9] mb-12 mx-auto"
            style={{ color: "var(--foreground-secondary)", maxWidth: "34rem" }}
          >
            Most platforms are built for the average student — designed to comfort,
            not to challenge. Ape Danuma EM is different. We built this for the
            student who wakes up early, stays up late, and doesn&apos;t accept mediocrity
            as a result. The 1% don&apos;t wait for motivation — they build systems.
            This platform is your system.
          </p>

          {/* Trait chips */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {traits.map(({ icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "rgba(245,158,11,0.07)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  color: "#fbbf24",
                  boxShadow: "0 0 0 1px rgba(245,158,11,0.06) inset",
                }}
              >
                <span style={{ color: "#f59e0b" }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   4. CORE VALUES
   ───────────────────────────────────────── */
function CoreValues() {
  const values = [
    {
      title: "Quality First",
      description:
        "Every single resource on Ape Danuma EM is hand-picked and educator-verified. We reject anything that isn't exam-ready, syllabus-aligned, and genuinely useful for Grade 10 & 11 students.",
      accent: { bg: "rgba(124,31,255,0.1)", border: "rgba(124,31,255,0.25)", glow: "rgba(124,31,255,0.12)", text: "#c4a0ff", icon: "#9455ff" },
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 2L13.5 8.5H20.5L14.7 12.7L17 19L11 15L5 19L7.3 12.7L1.5 8.5H8.5L11 2Z" fill="currentColor" opacity="0.9" />
        </svg>
      ),
      number: "01",
    },
    {
      title: "Accessibility",
      description:
        "Knowledge should have no gates. Our core library is completely free, works on any device, and is available 24/7 — whether you&apos;re studying at 3 AM or on a school bus.",
      accent: { bg: "rgba(245,158,11,0.09)", border: "rgba(245,158,11,0.25)", glow: "rgba(245,158,11,0.1)", text: "#fbbf24", icon: "#f59e0b" },
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="9.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M1.5 11h19M11 1.5C8.5 4.5 7 7.5 7 11s1.5 6.5 4 9.5M11 1.5C13.5 4.5 15 7.5 15 11s-1.5 6.5-4 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      number: "02",
    },
    {
      title: "Community Driven",
      description:
        "Ape Danuma EM didn't start in a boardroom — it started in group chats between students. Every feature, every resource, and every update is shaped by real students and real teachers.",
      accent: { bg: "rgba(16,185,129,0.09)", border: "rgba(16,185,129,0.22)", glow: "rgba(16,185,129,0.08)", text: "#34d399", icon: "#10b981" },
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="15" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2 19c0-3.866 2.686-7 6-7s6 3.134 6 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M15 12c2.5 0 4.5 2.5 4.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      number: "03",
    },
  ];

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Right glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 600, height: 600,
          background: "radial-gradient(ellipse, rgba(124,31,255,0.07) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      <div className="container-xl relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.14em] mb-5"
            style={{
              background: "rgba(124,31,255,0.08)",
              border: "1px solid rgba(124,31,255,0.22)",
              color: "#b890ff",
            }}
          >
            Core Values
          </div>
          <h2
            className="font-display font-black text-balance"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1.15 }}
          >
            What We{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #9455ff, #b890ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Stand For
            </span>
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map(({ title, description, accent, icon, number }) => (
            <div
              key={title}
              className="group relative rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1.5"
              style={{
                background: `linear-gradient(145deg, ${accent.bg}, rgba(10,10,10,0.6))`,
                border: `1px solid ${accent.border}`,
                boxShadow: `0 0 0 1px rgba(255,255,255,0.03) inset, 0 8px 32px rgba(0,0,0,0.3)`,
              }}
            >
              {/* Hover top-edge glow */}
              <div
                className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${accent.text}, transparent)` }}
              />

              {/* Number + Icon row */}
              <div className="flex items-start justify-between">
                {/* Icon badge */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: accent.bg,
                    border: `1px solid ${accent.border}`,
                    color: accent.icon,
                    boxShadow: `0 0 16px ${accent.glow}`,
                  }}
                >
                  {icon}
                </div>

                {/* Big number */}
                <span
                  className="font-display font-black text-5xl leading-none select-none"
                  style={{ color: accent.text, opacity: 0.12 }}
                >
                  {number}
                </span>
              </div>

              {/* Title */}
              <h3
                className="font-display font-bold text-lg"
                style={{ color: "var(--foreground)" }}
              >
                {title}
              </h3>

              {/* Description */}
              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: "var(--foreground-secondary)" }}
              >
                {description.replace(/&apos;/g, "'")}
              </p>

              {/* Bottom accent line */}
              <div
                className="h-px w-full opacity-40"
                style={{
                  background: `linear-gradient(90deg, ${accent.text}66, transparent)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   5. FOUNDER'S NOTE
   ───────────────────────────────────────── */
function FounderNote() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="container-xl relative z-10">
        <div className="max-w-2xl mx-auto">
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(245,158,11,0.07), rgba(10,10,10,0.8))",
              border: "1px solid rgba(245,158,11,0.22)",
              boxShadow: "0 0 60px rgba(245,158,11,0.06) inset",
            }}
          >
            {/* Top gold bar */}
            <div
              className="h-0.5 w-full"
              style={{
                background: "linear-gradient(90deg, transparent 5%, rgba(245,158,11,0.6) 30%, rgba(245,158,11,0.9) 50%, rgba(245,158,11,0.6) 70%, transparent 95%)",
              }}
            />

            <div className="p-8 sm:p-10">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[0.14em] mb-8"
                style={{
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  color: "#fbbf24",
                }}
              >
                Founder&apos;s Note
              </div>

              {/* Quote mark decoration */}
              <div
                className="font-display font-black leading-none mb-3 select-none"
                style={{
                  fontSize: "5rem",
                  lineHeight: 0.8,
                  color: "#f59e0b",
                  opacity: 0.18,
                }}
                aria-hidden="true"
              >
                &ldquo;
              </div>

              <blockquote>
                <p
                  className="text-base sm:text-[1.0625rem] leading-[1.9] mb-8"
                  style={{ color: "var(--foreground-secondary)" }}
                >
                  Sri Lanka has some of the most dedicated students in the world. Yet for too long,
                  access to quality study materials has been unequal — determined by which school
                  you attend or how much your family earns. I started Ape Danuma EM to close that
                  gap. To give every O/L English Medium student — whether in Colombo or Kilinochchi
                  — access to the same level of preparation. Education is the great equaliser, and
                  it&apos;s time we digitalised it for the generation that deserves it most.
                </p>
              </blockquote>

              {/* Founder row */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className="relative w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-display font-black text-lg"
                  style={{
                    background: "linear-gradient(135deg, #d97706, #f59e0b, #fbbf24)",
                    color: "#0a0a0a",
                    boxShadow: "0 0 20px rgba(245,158,11,0.4)",
                  }}
                >
                  U
                  {/* Online dot */}
                  <span
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full"
                    style={{
                      background: "#10b981",
                      border: "2px solid #0a0a0a",
                      boxShadow: "0 0 6px rgba(16,185,129,0.7)",
                    }}
                  />
                </div>

                <div>
                  <p className="font-display font-bold text-sm" style={{ color: "var(--foreground)" }}>
                    Ushan
                  </p>
                  <p className="text-xs" style={{ color: "#f59e0b" }}>
                    Founder &amp; Visionary, Ape Danuma EM
                  </p>
                </div>

                {/* Signature flourish */}
                <div className="ml-auto hidden sm:block">
                  <svg width="80" height="28" viewBox="0 0 80 28" fill="none" style={{ opacity: 0.35 }}>
                    <path d="M4 24 C14 4, 24 4, 34 14 S54 24, 64 14 S74 4, 78 8" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    <path d="M10 20 C18 12, 28 12, 38 18" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   6. FINAL CTA
   ───────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(124,31,255,0.05) 0%, rgba(124,31,255,0.12) 50%, rgba(87,0,190,0.06) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Central radial burst */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(124,31,255,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <DotGrid opacity={0.2} />
      </div>

      {/* Top + bottom border lines */}
      <div aria-hidden="true">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent 5%, rgba(124,31,255,0.3) 30%, rgba(148,85,255,0.5) 50%, rgba(124,31,255,0.3) 70%, transparent 95%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent 5%, rgba(124,31,255,0.2) 50%, transparent 95%)",
          }}
        />
      </div>

      <div className="container-xl relative z-10">
        <div className="max-w-2xl mx-auto text-center">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] mb-8"
            style={{
              background: "rgba(124,31,255,0.12)",
              border: "1px solid rgba(124,31,255,0.35)",
              color: "#c4a0ff",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#9455ff", boxShadow: "0 0 8px rgba(124,31,255,1)" }}
            />
            The Journey Starts Here
          </div>

          {/* Heading */}
          <h2
            className="font-display font-black mb-5 text-balance"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", lineHeight: 1.1 }}
          >
            Join the{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #f59e0b 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              1%
            </span>{" "}
            <span style={{ color: "#f0f0f0" }}>Today.</span>
          </h2>

          <p
            className="text-base sm:text-lg leading-relaxed mb-11"
            style={{ color: "var(--foreground-secondary)" }}
          >
            Create your free account in seconds and unlock every resource on
            Ape Danuma EM. Your O/L results will thank you.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="relative inline-flex items-center gap-2.5 rounded-xl px-9 py-3.5 text-sm font-bold overflow-hidden transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane-500"
              style={{
                background: "linear-gradient(135deg, #7c1fff 0%, #9455ff 50%, #7c1fff 100%)",
                backgroundSize: "200% auto",
                color: "#fff",
                boxShadow: "0 0 28px rgba(124,31,255,0.5), 0 6px 20px rgba(0,0,0,0.35)",
              }}
            >
              {/* Shimmer */}
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2.8s linear infinite",
                }}
                aria-hidden="true"
              />
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="relative z-10 shrink-0">
                <path d="M8 1.5L13.5 7.5L8 13.5M1.5 7.5h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="relative z-10">Create Free Account</span>
            </Link>

            <Link
              href="/free-resources"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold transition-all duration-200 hover:bg-white/[0.06]"
              style={{
                color: "var(--foreground-secondary)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Browse Free Resources
            </Link>
          </div>

          {/* Trust micro-copy */}
          <p className="mt-7 text-xs" style={{ color: "var(--foreground-disabled)" }}>
            No credit card required · Free forever · Join 12,000+ students
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PAGE
   ───────────────────────────────────────── */
export default function AboutPage() {
  return (
    <main className="relative overflow-hidden">
      <Hero />
      <OurStory />
      <PhilosophySection />
      <CoreValues />
      <FounderNote />
      <FinalCTA />
    </main>
  );
}
