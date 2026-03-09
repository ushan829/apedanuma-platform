"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSubjectStyle } from "@/lib/free-resources";

type PurchasedResource = {
  _id: string;
  title: string;
  subject: string;
  grade: number;
  materialType: string;
  description: string;
  pageCount: number | null;
  fileSize: string | null;
};

type DashboardUser = {
  name: string;
  email: string;
  role: string;
  createdAt: string;
  purchasedResources: PurchasedResource[];
};

const MOTIVATIONAL_QUOTES = [
  "Every expert was once a beginner. Keep going.",
  "Small progress is still progress. Stay consistent.",
  "Your future self will thank you for studying today.",
  "Success is the sum of small efforts repeated daily.",
];

function StatCard({
  label, value, sub, accentColor, accentBg, accentBorder, icon,
}: {
  label: string; value: string; sub?: string;
  accentColor: string; accentBg: string; accentBorder: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="relative rounded-2xl p-5 flex flex-col gap-3 overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}44 40%, ${accentColor}22 60%, transparent)` }} />
      <div className="absolute top-0 right-0 rounded-full pointer-events-none"
        style={{ width: 80, height: 80, background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`, filter: "blur(12px)" }} />
      <div className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
        style={{ background: accentBg, border: `1px solid ${accentBorder}`, color: accentColor }}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-display font-bold" style={{ color: "var(--foreground)" }}>{value}</p>
        <p className="text-xs font-medium mt-0.5" style={{ color: "var(--foreground-secondary)" }}>{label}</p>
      </div>
      {sub && <p className="text-[0.7rem] font-medium mt-auto" style={{ color: accentColor }}>{sub}</p>}
    </div>
  );
}

function ResourceCard({ resource }: { resource: PurchasedResource }) {
  const s = getSubjectStyle(resource.subject);
  return (
    <div
      className="relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
    >
      <div
        className="relative h-[64px] flex items-end justify-between px-4 pb-3 shrink-0"
        style={{ background: `linear-gradient(135deg, ${s.bg.replace(/[\d.]+\)$/, "0.35)")} 0%, rgba(10,10,10,0.9) 100%)`, borderBottom: `1px solid ${s.border}` }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
        <span className="relative z-10 text-[0.62rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
          style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
          {resource.subject}
        </span>
        <span className="relative z-10 text-[0.58rem] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
          Grade {resource.grade}
        </span>
      </div>
      <div className="flex flex-col gap-3 p-4 flex-1">
        <div>
          <h3 className="font-display font-semibold text-sm leading-snug" style={{ color: "var(--foreground)" }}>{resource.title}</h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[0.6rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
              style={{ background: "rgba(255,255,255,0.06)", color: "var(--foreground-muted)", border: "1px solid rgba(255,255,255,0.09)" }}>
              {resource.materialType}
            </span>
            {resource.pageCount && <span className="text-[0.62rem]" style={{ color: "var(--foreground-muted)" }}>{resource.pageCount} pages</span>}
            {resource.fileSize && <span className="text-[0.62rem]" style={{ color: "var(--foreground-muted)" }}>{resource.fileSize}</span>}
          </div>
        </div>
        <a
          href={`/api/download/premium/${resource._id}`}
          download
          className="relative mt-auto flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-sm font-bold overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #7c1fff 0%, #9455ff 55%, #7c1fff 100%)",
            backgroundSize: "200% auto",
            boxShadow: "0 0 20px rgba(124,31,255,0.3), 0 4px 12px rgba(0,0,0,0.3)",
            color: "#fff", textDecoration: "none",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M6.5 1v8M4 6.5l2.5 3 2.5-3M1 11h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Download PDF
        </a>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div>
        <div className="h-4 w-20 rounded-full mb-3" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="h-10 w-64 rounded-xl mb-2" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="h-4 w-80 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1,2,3].map((i) => <div key={i} className="rounded-2xl h-28" style={{ background: "rgba(255,255,255,0.05)" }} />)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1,2,3].map((i) => <div key={i} className="rounded-2xl h-52" style={{ background: "rgba(255,255,255,0.04)" }} />)}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [quote] = useState(
    () => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
  );

  useEffect(() => {
    fetch("/api/user/me")
      .then((r) => r.json())
      .then((data: { success: boolean; user?: DashboardUser }) => {
        if (data.success && data.user) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const firstName = user?.name.split(" ")[0] ?? "there";
  const purchased = user?.purchasedResources ?? [];
  const uniqueSubjects = new Set(purchased.map((r) => r.subject)).size;
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—";

  return (
    <div className="space-y-10">
      {/* Welcome */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[0.7rem] font-bold uppercase tracking-widest" style={{ color: "#9455ff" }}>Dashboard</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl" style={{ color: "var(--foreground)" }}>
          Welcome back, <span className="text-gradient-arcane">{firstName}.</span>
        </h1>
        <p className="mt-2 text-sm italic" style={{ color: "var(--foreground-muted)" }}>&ldquo;{quote}&rdquo;</p>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--foreground-muted)" }}>Your Account</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Purchased Resources" value={String(purchased.length)}
            sub={purchased.length === 0 ? "Visit the store to get started" : `${purchased.length} PDF${purchased.length !== 1 ? "s" : ""} in your library`}
            accentColor="#9455ff" accentBg="rgba(124,31,255,0.1)" accentBorder="rgba(124,31,255,0.22)"
            icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v2H4V5z" fill="currentColor" opacity="0.35" /><rect x="4" y="7" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" /><path d="M7 12h6M7 15h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>}
          />
          <StatCard
            label="Subjects Covered" value={String(uniqueSubjects)}
            sub={uniqueSubjects > 0 ? `Across ${uniqueSubjects} subject${uniqueSubjects !== 1 ? "s" : ""}` : "No subjects yet"}
            accentColor="#34d399" accentBg="rgba(16,185,129,0.1)" accentBorder="rgba(16,185,129,0.22)"
            icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4" /><path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          />
          <StatCard
            label="Member Since" value={memberSince} sub={user?.email}
            accentColor="#fbbf24" accentBg="rgba(245,158,11,0.1)" accentBorder="rgba(245,158,11,0.22)"
            icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.4" /><path d="M3 18c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>}
          />
        </div>
      </div>

      {/* Recent purchases */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--foreground-muted)" }}>Recent Purchases</h2>
          {purchased.length > 3 && (
            <Link href="/dashboard/history" className="text-xs font-semibold transition-colors hover:text-[#b890ff]" style={{ color: "#9455ff", textDecoration: "none" }}>
              View all ({purchased.length}) →
            </Link>
          )}
        </div>
        {purchased.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
              style={{ background: "rgba(124,31,255,0.07)", border: "1px solid rgba(124,31,255,0.16)" }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ color: "#9455ff" }}>
                <path d="M8 4h13l7 7v21H8V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M21 4v7h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13 16h10M13 21h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-xl mb-2" style={{ color: "var(--foreground)" }}>No Resources Yet</h3>
            <p className="text-sm max-w-xs leading-relaxed mb-6" style={{ color: "var(--foreground-muted)" }}>
              You haven&apos;t purchased any premium resources. Browse the store to unlock full study packs.
            </p>
            <Link href="/premium-store" className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #7c1fff 0%, #9455ff 55%, #7c1fff 100%)", boxShadow: "0 0 20px rgba(124,31,255,0.35), 0 4px 12px rgba(0,0,0,0.3)", color: "#fff", textDecoration: "none" }}>
              Browse Premium Store
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {purchased.slice(0, 3).map((r) => <ResourceCard key={r._id} resource={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}
