export default function Loading() {
  return (
    <div className="container-xl py-14 sm:py-18">
      {/* Page header skeleton */}
      <div className="mb-10 space-y-4">
        <div className="h-6 w-32 bg-slate-800/50 rounded-lg animate-pulse" />
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-3">
            <div className="h-10 w-64 sm:w-80 bg-slate-800/50 rounded-xl animate-pulse" />
            <div className="h-5 w-48 bg-slate-800/50 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-28 bg-slate-800/50 rounded-xl animate-pulse lg:hidden" />
        </div>
      </div>

      <div className="flex gap-7 items-start">
        {/* Sidebar skeleton */}
        <aside
          className="hidden lg:block shrink-0 w-[248px] h-[600px] bg-slate-800/20 border border-white/5 rounded-[1.25rem] p-5 animate-pulse"
        />

        {/* Content area skeleton */}
        <div className="flex-1 min-w-0">
          {/* Search bar skeleton */}
          <div className="h-14 w-full bg-slate-800/40 border border-white/5 rounded-2xl mb-6 animate-pulse" />

          {/* Results info skeleton */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 w-40 bg-slate-800/50 rounded-lg animate-pulse" />
          </div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 flex flex-col gap-4 h-[220px] animate-pulse"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-14 bg-slate-800/60 rounded-xl shrink-0" />
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-1">
                      <div className="h-4 w-16 bg-slate-800/60 rounded-md" />
                      <div className="h-4 w-12 bg-slate-800/60 rounded-md" />
                      <div className="h-4 w-16 bg-slate-800/60 rounded-md" />
                    </div>
                    <div className="h-3 w-10 bg-slate-800/60 rounded-md" />
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-full bg-slate-800/60 rounded-lg" />
                  <div className="h-4 w-2/3 bg-slate-800/60 rounded-lg" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-slate-800/60 rounded-lg" />
                  <div className="h-4 w-12 bg-slate-800/60 rounded-lg" />
                </div>
                <div className="h-10 w-full bg-slate-800/40 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
