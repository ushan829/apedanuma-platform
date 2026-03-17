export default function StaticMobileStats() {
  const stats = [
    { value: "12,000+", label: "Students" },
    { value: "9",       label: "Subjects" },
    { value: "2025",    label: "Syllabus" },
    { value: "Free",    label: "Resources" },
  ];

  return (
    <div className="md:hidden pt-4 pb-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-[1px] w-8 bg-white/10" />
        <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-slate-500">
          Trusted Island-wide
        </span>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {stats.slice(0, 2).map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <span className="text-xl font-black text-arcane-400">
              {stat.value}
            </span>
            <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest leading-tight">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
