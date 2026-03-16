export default function Loading() {
  return (
    <div className="container-xl py-16 sm:py-20">
      {/* Page header skeleton */}
      <div className="mb-12 space-y-4 text-center max-w-xl mx-auto">
        <div className="h-6 w-32 bg-slate-800/50 rounded-full animate-pulse mx-auto" />
        <div className="h-12 w-full bg-slate-800/50 rounded-xl animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-800/40 rounded-lg animate-pulse" />
          <div className="h-4 w-3/4 bg-slate-800/40 rounded-lg animate-pulse mx-auto" />
        </div>
      </div>

      <div className="space-y-10">
        {/* Filter bar skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-white/5 pb-8">
          <div className="h-12 w-full sm:w-72 bg-slate-800/40 border border-white/5 rounded-2xl animate-pulse" />
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-slate-800/40 rounded-full animate-pulse" />
            <div className="h-9 w-24 bg-slate-800/40 rounded-full animate-pulse" />
            <div className="h-9 w-24 bg-slate-800/40 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 flex flex-col gap-4 h-[240px] animate-pulse"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-14 bg-slate-800/60 rounded-xl shrink-0" />
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex gap-1">
                    <div className="h-4 w-16 bg-slate-800/60 rounded-md" />
                    <div className="h-4 w-12 bg-slate-800/60 rounded-md" />
                  </div>
                  <div className="h-3 w-10 bg-slate-800/60 rounded-md" />
                </div>
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-4 w-full bg-slate-800/60 rounded-lg" />
                <div className="h-4 w-2/3 bg-slate-800/60 rounded-lg" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-slate-800/60 rounded-lg" />
                <div className="h-5 w-16 bg-slate-800/60 rounded-lg" />
              </div>
              <div className="h-10 w-full bg-slate-800/40 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
