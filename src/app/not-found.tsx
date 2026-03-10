import Link from "next/link";

// not-found.tsx must NOT be a "use client" component in the App Router to override the default 404 reliably across all boundaries.
export default function NotFound() {
  return (
    <main className="relative min-h-[calc(100vh-68px)] flex items-center justify-center px-4 py-16 overflow-hidden">

      {/* ── Background glows ── */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 800,
            height: 800,
            background: "radial-gradient(circle, rgba(124,31,255,0.05) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* 404 Graphic */}
        <div className="relative mb-8">
          <div 
            className="absolute inset-0 blur-3xl opacity-50"
            style={{ background: "linear-gradient(135deg, #b890ff, #3b82f6)" }}
          />
          <h1 
            className="relative font-display font-black tracking-tighter"
            style={{ 
              fontSize: "clamp(6rem, 15vw, 10rem)",
              lineHeight: 0.8,
              background: "linear-gradient(135deg, #ffffff 0%, #b890ff 50%, #3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 40px rgba(124,31,255,0.3))"
            }}
          >
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="font-display font-bold text-2xl sm:text-3xl mb-4" style={{ color: "var(--foreground)" }}>
          Page Not Found
        </h2>
        <p className="text-base sm:text-lg mb-10 leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
          Oops! The resource you are looking for has vanished into the dark. It might have been moved, deleted, or never existed in the first place.
        </p>

        {/* CTA */}
        <Link 
          href="/" 
          className="relative inline-flex items-center justify-center gap-2.5 rounded-xl px-8 py-4 font-bold text-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9455ff]"
          style={{
            background: "linear-gradient(135deg, #7c1fff 0%, #9455ff 55%, #7c1fff 100%)",
            backgroundSize: "200% auto",
            boxShadow: "0 0 28px rgba(124,31,255,0.45), 0 4px 16px rgba(0,0,0,0.35)",
            color: "#fff",
          }}
        >
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 3.5s linear infinite",
            }}
          />
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="relative z-10">
            <path d="M7 3.5L2.5 8l4.5 4.5M2.5 8h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="relative z-10">Return to Homepage</span>
        </Link>
      </div>
    </main>
  );
}
