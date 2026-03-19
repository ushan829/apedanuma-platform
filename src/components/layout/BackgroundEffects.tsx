/**
 * BackgroundEffects: Renders the Ghibli-inspired stars and noise texture.
 * Optimized as a Server Component to keep JS execution off the main thread.
 */
export default function BackgroundEffects() {
  return (
    <>
      {/* Ghibli-inspired Star Glimmers */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed inset-0 z-[-1] opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 10% 10%, rgba(255,255,255,0.4) 100%, transparent),
            radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.2) 100%, transparent),
            radial-gradient(2px 2px at 40% 70%, rgba(255,255,255,0.5) 100%, transparent),
            radial-gradient(1px 1px at 60% 20%, rgba(255,255,255,0.3) 100%, transparent),
            radial-gradient(2px 2px at 80% 80%, rgba(255,255,255,0.6) 100%, transparent),
            radial-gradient(1.5px 1.5px at 90% 40%, rgba(255,255,255,0.4) 100%, transparent)
          `,
          backgroundSize: '150px 150px',
          animation: 'twinkle 10s ease-in-out infinite alternate'
        }}
      />

      {/* Subtle noise texture overlay */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed inset-0 z-[0] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px'
        }}
      />
    </>
  );
}
