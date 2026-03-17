import { FlaskConical, Pi, Languages, Monitor, Zap, Download, Users, BookOpen, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function StaticMobileHeroContent() {
  const stats = [
    { value: "12,000+", label: "Students", icon: Users },
    { value: "9",       label: "Subjects", icon: BookOpen },
    { value: "2025",    label: "Syllabus", icon: CheckCircle },
  ];

  const subjects = [
    { name: "Science", icon: FlaskConical, color: "#34d399", href: "/free-resources?subject=science" },
    { name: "Mathematics", icon: Pi, color: "#60a5fa", href: "/free-resources?subject=mathematics" },
    { name: "English", icon: Languages, color: "#f59e0b", href: "/free-resources?subject=english" },
    { name: "ICT", icon: Monitor, color: "#22d3ee", href: "/free-resources?subject=ict" },
  ];

  return (
    <div className="lg:hidden flex flex-col gap-10 mt-6 w-full">
      
      {/* ── Mobile Stats Strip ── */}
      <div className="grid grid-cols-3 gap-2 py-6 border-y border-white/5 bg-white/[0.02] -mx-4 px-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center text-center gap-1">
            <span className="text-lg font-black text-arcane-400 leading-none">
              {stat.value}
            </span>
            <span className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Mobile Quick Access Grid ── */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
          <span className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-slate-500 whitespace-nowrap">
            Quick Subject Access
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {subjects.map((s) => (
            <Link 
              key={s.name} 
              href={s.href}
              className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/40 border border-white/5 active:scale-[0.98] transition-transform"
            >
              <div 
                className="p-2 rounded-lg bg-white/5 flex items-center justify-center shrink-0"
                style={{ border: `1px solid ${s.color}20` }}
              >
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <span className="text-[0.75rem] font-bold text-slate-300 uppercase tracking-tight">
                {s.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Mobile Trust Banner ── */}
      <div className="rounded-2xl p-5 bg-gradient-to-br from-arcane-500/10 to-transparent border border-arcane-500/10 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-arcane-300 uppercase tracking-wide flex items-center gap-1.5">
            <Zap className="w-3 h-3 fill-current" />
            Premium Resources
          </span>
          <p className="text-[0.7rem] text-slate-400">Join 40,000+ learners island-wide.</p>
        </div>
        <Link href="/premium-store" className="p-2.5 rounded-xl bg-arcane-500 text-white shadow-lg shadow-arcane-500/20">
          <Download className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
