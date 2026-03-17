export default function Loading() {
  return (
    <main className="relative overflow-hidden">
      {/* Ambient background glows */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-40 left-1/3 rounded-full"
          style={{
            width: 700,
            height: 600,
            background: "radial-gradient(circle, rgba(124,31,255,0.08) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 rounded-full"
          style={{
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="container-xl py-16 sm:py-20">
        {/* Header Skeleton */}
        <header className="mb-12 space-y-4 text-center flex flex-col items-center">
          <div className="h-6 w-32 rounded-full bg-slate-800/50 animate-pulse" />
          <div className="h-12 w-64 sm:w-96 rounded-lg bg-slate-800/50 animate-pulse" />
          <div className="h-4 w-48 sm:w-80 rounded-md bg-slate-800/50 animate-pulse" />
        </header>

        <div className="flex gap-7 items-start">
          {/* Sidebar Skeleton (Mobile toggle) */}
          <div className="lg:hidden flex justify-between items-center w-full mb-6">
             <div className="h-4 w-32 rounded bg-slate-800/50 animate-pulse" />
             <div className="h-10 w-24 rounded-xl bg-slate-800/50 animate-pulse" />
          </div>

          {/* Sidebar Skeleton (Desktop) */}
          <aside
            className="hidden lg:block shrink-0 space-y-8"
            style={{
              width: 248,
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "1.25rem",
              padding: "1.25rem",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="space-y-4">
              <div className="h-4 w-12 rounded bg-slate-800/50 animate-pulse" />
              <div className="h-10 w-full rounded-xl bg-slate-800/50 animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-4 w-24 rounded bg-slate-800/50 animate-pulse" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 w-full rounded-lg bg-slate-800/50 animate-pulse" />
                ))}
              </div>
            </div>
          </aside>

          {/* Grid Skeleton */}
          <div className="flex-1 min-w-0">
            <div className="h-14 w-full rounded-2xl bg-slate-800/50 animate-pulse mb-6" />
            
            <div className="flex justify-between mb-6">
              <div className="h-4 w-32 rounded bg-slate-800/50 animate-pulse" />
              <div className="h-4 w-20 rounded bg-slate-800/50 animate-pulse" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl p-6 bg-white/5 border border-white/10 flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-14 w-12 rounded-xl bg-slate-800/50 animate-pulse shrink-0" />
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="flex gap-1">
                        <div className="h-5 w-16 rounded-md bg-slate-800/50 animate-pulse" />
                        <div className="h-5 w-12 rounded-md bg-slate-800/50 animate-pulse" />
                        <div className="h-5 w-20 rounded-md bg-slate-800/50 animate-pulse" />
                      </div>
                      <div className="h-3 w-10 rounded bg-slate-800/50 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-full rounded bg-slate-800/50 animate-pulse" />
                    <div className="h-4 w-2/3 rounded bg-slate-800/50 animate-pulse" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <div className="h-4 w-8 rounded bg-slate-800/50 animate-pulse" />
                      <div className="h-4 w-12 rounded bg-slate-800/50 animate-pulse" />
                    </div>
                    <div className="h-6 w-16 rounded-md bg-slate-800/50 animate-pulse" />
                  </div>
                  <div className="h-10 w-full rounded-xl bg-slate-800/50 animate-pulse mt-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
