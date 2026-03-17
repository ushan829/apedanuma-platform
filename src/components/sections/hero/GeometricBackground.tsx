export default function GeometricBackground() {
  /* Fan lines: 9 lines converging from bottom to top-center (50, 0) */
  const fanLines = [0, 12, 25, 37, 50, 63, 75, 88, 100];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">

      {/* ── Layer 1: Fine dot grid (CSS background is often faster than SVG rect for large grids) ── */}
      <div 
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.55) 0.8px, transparent 0.8px)`,
          backgroundSize: '36px 36px'
        }}
      />

      {/* ── Layer 2: Perspective fan lines ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ opacity: 1 }}
      >
        <defs>
          <linearGradient id="fan-fade" x1="0" y1="1" x2="0" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#7c1fff" stopOpacity="0.13" />
            <stop offset="55%"  stopColor="#7c1fff" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#7c1fff" stopOpacity="0"    />
          </linearGradient>
          <linearGradient id="horizon-grad" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#7c1fff" stopOpacity="0"    />
            <stop offset="30%"  stopColor="#7c1fff" stopOpacity="0.1"  />
            <stop offset="50%"  stopColor="#9455ff" stopOpacity="0.15" />
            <stop offset="70%"  stopColor="#f59e0b" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"    />
          </linearGradient>
        </defs>

        {fanLines.map((x) => (
          <line
            key={x}
            x1={`${x}`} y1="100"
            x2="50"      y2="0"
            stroke="url(#fan-fade)"
            strokeWidth="0.25"
          />
        ))}

        <line x1="0" y1="62" x2="100" y2="62" stroke="url(#horizon-grad)" strokeWidth="0.3" />
        <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(124,31,255,0.04)" strokeWidth="0.2" />
        <line x1="0" y1="45" x2="100" y2="45" stroke="rgba(124,31,255,0.03)" strokeWidth="0.2" />
      </svg>

      {/* ── Layer 3: Glow orbs (Simplified for better paint performance) ── */}
      <div
        className="absolute rounded-full will-change-[opacity]"
        style={{
          width: 'min(800px, 100vw)',
          height: 'min(700px, 80vh)',
          top: -280,
          left: "50%",
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse at 50% 30%, rgba(124,31,255,0.22) 0%, rgba(87,0,190,0.1) 40%, transparent 70%)",
          filter: "blur(60px)",
          // CSS animation instead of Framer Motion for background
          animation: "glowPulse 5s ease-in-out infinite",
        }}
      />
      
      {/* Hidden on small mobile to reduce paint cost and main thread work */}
      <div
        className="hidden sm:block absolute rounded-full will-change-[opacity]"
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
    </div>
  );
}
