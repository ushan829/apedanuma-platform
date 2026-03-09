export default function FreeResourcesLoading() {
  return (
    <div className="container-xl py-14 sm:py-18">
      {/* Page header skeleton */}
      <div className="mb-10 space-y-3">
        <div className="h-5 w-28 rounded-full animate-pulse" style={{ background: "rgba(245,158,11,0.15)" }} />
        <div className="h-9 w-72 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-4 w-56 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>

      <div className="flex gap-7 items-start">
        {/* Sidebar skeleton */}
        <aside
          className="hidden lg:flex flex-col gap-4 shrink-0"
          style={{
            width: 248,
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "1.25rem",
            padding: "1.25rem",
          }}
        >
          <div className="h-3 w-16 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.07)" }} />
          <div className="h-8 w-full rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
          <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.05)" }} />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-7 w-full rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          ))}
          <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.05)" }} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6 w-full rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
          ))}
        </aside>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {/* Search bar skeleton */}
          <div className="h-11 w-full rounded-xl mb-5 animate-pulse" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }} />
          {/* Results count skeleton */}
          <div className="h-4 w-40 rounded mb-4 animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />

          {/* Card grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-4 flex flex-col gap-3 animate-pulse"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", minHeight: 180 }}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-xl shrink-0" style={{ width: 40, height: 46, background: "rgba(255,255,255,0.06)" }} />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex gap-1.5">
                      <div className="h-4 w-16 rounded-md" style={{ background: "rgba(255,255,255,0.07)" }} />
                      <div className="h-4 w-10 rounded-md" style={{ background: "rgba(255,255,255,0.05)" }} />
                    </div>
                    <div className="h-3 w-12 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                  </div>
                </div>
                <div className="h-4 w-full rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
                <div className="h-4 w-3/4 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="mt-auto h-8 w-full rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
