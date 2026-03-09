import Link from "next/link";

/* ─────────────────────────────────────────────────────────────
   Data
   ───────────────────────────────────────────────────────────── */
const SUBJECTS = [
  { name: "Mathematics",       chapters: 12, color: "#60a5fa", accent: "rgba(96,165,250,0.18)" },
  { name: "Combined Science",  chapters: 10, color: "#34d399", accent: "rgba(52,211,153,0.15)" },
  { name: "English Language",  chapters: 14, color: "#b890ff", accent: "rgba(184,144,255,0.18)" },
  { name: "History",           chapters:  9, color: "#fbbf24", accent: "rgba(251,191,36,0.15)"  },
  { name: "ICT",               chapters:  8, color: "#22d3ee", accent: "rgba(34,211,238,0.15)" },
] as const;

const TRUST_STATS = [
  { value: "12,000+", label: "Students enrolled" },
  { value: "9",       label: "Core subjects" },
  { value: "2025",    label: "Syllabus aligned" },
  { value: "Free",    label: "Resources available" },
] as const;

/* ─────────────────────────────────────────────────────────────
   Geometric background — dot grid + perspective fan + shapes
   ───────────────────────────────────────────────────────────── */
function GeometricBackground() {
  /* Fan lines: 9 lines converging from bottom to top-center (50, 0) */
  const fanLines = [0, 12, 25, 37, 50, 63, 75, 88, 100];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">

      {/* ── Layer 1: Fine dot grid ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.35 }}
      >
        <defs>
          <pattern id="hero-dot-grid" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="18" cy="18" r="0.8" fill="rgba(255,255,255,0.55)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dot-grid)" />
      </svg>

      {/* ── Layer 2: Perspective fan lines ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ opacity: 1 }}
      >
        <defs>
          {/* Gradient: fades from visible at bottom to invisible at top */}
          <linearGradient id="fan-fade" x1="0" y1="1" x2="0" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#7c1fff" stopOpacity="0.13" />
            <stop offset="55%"  stopColor="#7c1fff" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#7c1fff" stopOpacity="0"    />
          </linearGradient>
          {/* Gradient for the horizon line */}
          <linearGradient id="horizon-grad" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#7c1fff" stopOpacity="0"    />
            <stop offset="30%"  stopColor="#7c1fff" stopOpacity="0.1"  />
            <stop offset="50%"  stopColor="#9455ff" stopOpacity="0.15" />
            <stop offset="70%"  stopColor="#f59e0b" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"    />
          </linearGradient>
        </defs>

        {/* Fan lines */}
        {fanLines.map((x) => (
          <line
            key={x}
            x1={`${x}`} y1="100"
            x2="50"      y2="0"
            stroke="url(#fan-fade)"
            strokeWidth="0.25"
          />
        ))}

        {/* Horizon cross-line at ~62% height */}
        <line x1="0" y1="62" x2="100" y2="62" stroke="url(#horizon-grad)" strokeWidth="0.3" />

        {/* Secondary cross-lines */}
        <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(124,31,255,0.04)" strokeWidth="0.2" />
        <line x1="0" y1="45" x2="100" y2="45" stroke="rgba(124,31,255,0.03)" strokeWidth="0.2" />
      </svg>

      {/* ── Layer 3: Glow orbs ── */}
      {/* Primary arcane glow — top center, behind headline */}
      <div
        className="absolute rounded-full"
        style={{
          width: 800,
          height: 700,
          top: -280,
          left: "50%",
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse at 50% 30%, rgba(124,31,255,0.22) 0%, rgba(87,0,190,0.1) 40%, transparent 70%)",
          filter: "blur(60px)",
          animation: "glowPulse 5s ease-in-out infinite",
        }}
      />
      {/* Secondary gold — bottom right */}
      <div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 400,
          bottom: -100,
          right: "-8%",
          background: "radial-gradient(ellipse, rgba(245,158,11,0.1) 0%, transparent 65%)",
          filter: "blur(50px)",
          animation: "glowPulse 7s 2s ease-in-out infinite",
        }}
      />
      {/* Tertiary blue — bottom left */}
      <div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          bottom: "-5%",
          left: "5%",
          background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* ── Layer 4: Floating geometric wireframe shapes ── */}

      {/* Large hexagon — top right */}
      <svg
        className="absolute"
        style={{
          width: 280, height: 280,
          top: "4%", right: "3%",
          opacity: 0.04,
          animation: "floatSlow 11s 0s ease-in-out infinite",
          "--rot": "12deg",
        } as React.CSSProperties}
        viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="50,2 93,26 93,74 50,98 7,74 7,26" stroke="#b890ff" strokeWidth="1.5" />
        <polygon points="50,14 82,31 82,69 50,86 18,69 18,31" stroke="#b890ff" strokeWidth="0.75" />
      </svg>

      {/* Medium diamond — left edge, mid */}
      <svg
        className="absolute"
        style={{
          width: 160, height: 160,
          top: "38%", left: "-2%",
          opacity: 0.05,
          animation: "floatReverse 9s 1.2s ease-in-out infinite",
          "--rot": "-8deg",
        } as React.CSSProperties}
        viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="50,4 96,50 50,96 4,50" stroke="#f59e0b" strokeWidth="2" />
        <polygon points="50,20 80,50 50,80 20,50" stroke="#f59e0b" strokeWidth="1" />
      </svg>

      {/* Small hexagon — bottom left */}
      <svg
        className="absolute"
        style={{
          width: 100, height: 100,
          bottom: "12%", left: "18%",
          opacity: 0.04,
          animation: "floatSlow 13s 0.6s ease-in-out infinite",
          "--rot": "0deg",
        } as React.CSSProperties}
        viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" stroke="#9455ff" strokeWidth="2.5" />
      </svg>

      {/* Triangle — top left quadrant */}
      <svg
        className="absolute"
        style={{
          width: 130, height: 130,
          top: "15%", left: "8%",
          opacity: 0.035,
          animation: "floatReverse 14s 2s ease-in-out infinite",
          "--rot": "15deg",
        } as React.CSSProperties}
        viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="50,5 95,90 5,90" stroke="#b890ff" strokeWidth="2" />
        <polygon points="50,22 80,82 20,82" stroke="#b890ff" strokeWidth="1" />
      </svg>

      {/* Ring — bottom right area */}
      <svg
        className="absolute"
        style={{
          width: 120, height: 120,
          bottom: "22%", right: "12%",
          opacity: 0.04,
          animation: "floatSlow 10s 0.8s ease-in-out infinite",
        } as React.CSSProperties}
        viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="44" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="50" cy="50" r="30" stroke="#f59e0b" strokeWidth="1" />
        <circle cx="50" cy="50" r="16" stroke="#f59e0b" strokeWidth="0.75" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Study Pack Visual Card (desktop right column)
   ───────────────────────────────────────────────────────────── */
function StudyPackCard() {
  return (
    <div className="relative w-full">

      {/* Single perfectly-centered accent glow — sits behind the card only */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[1.25rem] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 45%, rgba(124,31,255,0.14) 0%, rgba(87,0,190,0.06) 45%, transparent 70%)",
          transform: "scale(1.12)",
          filter: "blur(20px)",
        }}
      />

      {/* The card — clean glass surface */}
      <div className="hero-visual-card relative z-10 p-8">

        {/* ── Header ── */}
        <div
          className="flex items-center gap-3.5 pb-6 mb-6"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Logo mark */}
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(124,31,255,0.22), rgba(87,0,190,0.3))",
              border: "1px solid rgba(124,31,255,0.3)",
            }}
          >
            <span className="font-display font-black text-xs text-gradient-arcane">EM</span>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-0.5 min-w-0">
            <span
              className="font-display font-bold text-sm leading-snug"
              style={{ color: "var(--foreground)" }}
            >
              2025 O/L Premium Study Pack
            </span>
            <span className="text-xs" style={{ color: "var(--foreground-muted)" }}>
              All English Medium Subjects
            </span>
          </div>

          {/* Live pill */}
          <div
            className="ml-auto flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.2)",
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{
                background: "#34d399",
                boxShadow: "0 0 5px rgba(52,211,153,0.8)",
                animation: "pulseDot 2s ease-in-out infinite",
              }}
            />
            <span
              className="text-[0.6rem] font-bold uppercase tracking-wider"
              style={{ color: "#34d399" }}
            >
              Live
            </span>
          </div>
        </div>

        {/* ── Subject list ── */}
        <div className="flex flex-col gap-5 mb-6">
          {SUBJECTS.map((s, i) => (
            <div key={s.name}>
              {/* Label row */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: s.color,
                      boxShadow: `0 0 5px ${s.color}60`,
                    }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--foreground-secondary)" }}
                  >
                    {s.name}
                  </span>
                </div>
                <span
                  className="text-[0.65rem] font-semibold tabular-nums px-2 py-0.5 rounded-md"
                  style={{ background: s.accent, color: s.color }}
                >
                  {s.chapters} chapters
                </span>
              </div>

              {/* Progress track */}
              <div
                className="w-full rounded-full overflow-hidden"
                style={{ height: 4, background: "rgba(255,255,255,0.05)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${72 + i * 5}%`,
                    background: `linear-gradient(90deg, ${s.color}70, ${s.color})`,
                    boxShadow: `0 0 6px ${s.color}40`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── More subjects row ── */}
        <div
          className="flex items-center justify-center gap-2 py-3 mb-6 rounded-xl text-xs font-medium"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px dashed rgba(255,255,255,0.07)",
            color: "var(--foreground-muted)",
          }}
        >
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          4 more subjects included
        </div>

        {/* ── Footer checkmarks ── */}
        <div
          className="flex flex-col gap-3.5 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          {[
            { text: "Aligned with 2025 G.C.E. O/L Syllabus", color: "#34d399" },
            { text: "Past Paper Analysis & Model Answers",    color: "#b890ff" },
          ].map(({ text, color }) => (
            <div key={text} className="flex items-center gap-3">
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full shrink-0"
                style={{
                  background: `${color}18`,
                  border: `1px solid ${color}35`,
                }}
              >
                <svg
                  className="w-3 h-3"
                  fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-xs leading-snug" style={{ color: "var(--foreground-secondary)" }}>
                {text}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Hero Section
   ───────────────────────────────────────────────────────────── */
export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "calc(100vh - 68px)" }}
      aria-label="Hero"
    >
      {/* Geometric background */}
      <GeometricBackground />

      {/* Content grid */}
      <div className="container-xl relative z-10 flex items-center" style={{ minHeight: "calc(100vh - 68px)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_500px] gap-12 xl:gap-20 w-full py-20 lg:py-16">

          {/* ════════════════════════════════
              LEFT — Text content
              ════════════════════════════════ */}
          <div className="flex flex-col justify-center gap-7 lg:gap-8">

            {/* Eyebrow badge */}
            <div
              className="hero-badge w-fit"
              style={{ animation: "heroBadgePop 0.6s 0.1s cubic-bezier(0.34,1.56,0.64,1) both" }}
            >
              {/* Animated status dot */}
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #9455ff, #f59e0b)",
                  boxShadow: "0 0 6px rgba(148,85,255,0.6)",
                  animation: "pulseDot 2.5s ease-in-out infinite",
                }}
              />
              <span style={{ color: "var(--foreground-muted)" }}>
                🇱🇰
              </span>
              <span className="tracking-widest uppercase text-[0.65rem]" style={{ color: "var(--foreground-secondary)" }}>
                Designed for Sri Lanka&rsquo;s O/L Students
              </span>
            </div>

            {/* Headline */}
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

            {/* Sub-headline */}
            <p
              className="text-lg leading-[1.75] max-w-[520px]"
              style={{
                color: "var(--foreground-secondary)",
                animation: "heroFadeUp 0.7s 0.35s ease both",
              }}
            >
              Access{" "}
              <span style={{ color: "var(--foreground)", fontWeight: 500 }}>elite study materials</span>,{" "}
              comprehensive notes, and expert guidance designed exclusively for{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #b890ff, #f59e0b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 600,
                }}
              >
                English Medium achievers
              </span>.
            </p>

            {/* CTA buttons */}
            <div
              className="flex flex-wrap gap-4 items-center"
              style={{ animation: "heroFadeUp 0.7s 0.5s ease both" }}
            >
              <Link href="/premium-store" className="btn-hero-primary group">
                {/* Sparkle icon */}
                <svg
                  className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                  viewBox="0 0 24 24" fill="currentColor"
                >
                  <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
                </svg>
                <span>Explore Premium Notes</span>
                {/* Arrow */}
                <svg
                  className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </Link>

              <Link href="/free-resources" className="btn-hero-ghost group">
                {/* Folder icon */}
                <svg
                  className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                </svg>
                <span>Browse Free Resources</span>
              </Link>
            </div>

            {/* Trust strip */}
            <div
              className="flex flex-col gap-3"
              style={{ animation: "heroFadeUp 0.7s 0.65s ease both" }}
            >
              {/* Divider with label */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                <span className="text-[0.65rem] font-semibold tracking-widest uppercase" style={{ color: "var(--foreground-disabled)" }}>
                  Trusted by students island-wide
                </span>
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
              </div>

              {/* Stats row */}
              <div className="trust-strip">
                {TRUST_STATS.map(({ value, label }, i) => (
                  <div key={label} className="trust-item">
                    {i > 0 && (
                      <span
                        className="hidden sm:block w-px h-3.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.1)" }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="trust-item-value">{value}</span>
                    <span className="text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ════════════════════════════════
              RIGHT — Visual card
              ════════════════════════════════ */}
          <div
            className="flex items-center justify-center w-full"
            style={{ animation: "heroScaleIn 0.8s 0.4s cubic-bezier(0.25,0.46,0.45,0.94) both" }}
          >
            <StudyPackCard />
          </div>

        </div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
      />
    </section>
  );
}
