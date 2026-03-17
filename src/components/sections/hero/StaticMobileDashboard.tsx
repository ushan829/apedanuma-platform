import { FlaskConical, Pi, Languages, Monitor } from "lucide-react";

export default function StaticMobileDashboard() {
  const subjects = [
    { name: "Science", icon: FlaskConical, color: "#34d399" },
    { name: "Mathematics", icon: Pi, color: "#60a5fa" },
    { name: "English", icon: Languages, color: "#f59e0b" },
    { name: "ICT", icon: Monitor, color: "#22d3ee" },
  ];

  return (
    <div className="relative w-full max-w-[400px] mx-auto md:hidden pt-4 pb-8">
      <div className="grid grid-cols-2 gap-4">
        {subjects.map((s) => (
          <div 
            key={s.name}
            className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-white/5 border border-white/10"
          >
            <s.icon 
              className="w-8 h-8"
              style={{ color: s.color }}
            />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {s.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
