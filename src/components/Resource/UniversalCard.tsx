"use client";

import Link from "next/link";
import Image from "next/image";
import { getSubjectStyle } from "@/lib/free-resources";

interface UniversalCardProps {
  resource: {
    _id?: string;
    id?: string;
    title: string;
    subject: string;
    grade: number;
    materialType?: string; // DB field
    type?: string;         // Free resource field
    term?: number;
    year?: number;
    pageCount?: number | null;
    pages?: number;
    fileSize?: string | null;
    size?: string;
    previewImageUrl?: string;
    price?: number;
    slug?: string;
  };
  isPremium?: boolean;
}

/* ─────────────────────────────────────────
   Doc icon (matches Free Resources style)
   ───────────────────────────────────────── */
function DocIcon({ subject }: { subject: string }) {
  const s = getSubjectStyle(subject);
  return (
    <div
      className="flex items-center justify-center rounded-xl shrink-0 w-[46px] h-[52px] bg-white/[0.03] border border-white/[0.1]"
    >
      <svg width="22" height="26" viewBox="0 0 20 24" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="18" height="22" rx="3" stroke={s.color} strokeWidth="1.4" />
        <path d="M1 7h18" stroke={s.color} strokeWidth="1" />
        <path d="M5 11h10M5 14h7M5 17h9" stroke={s.color} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M13 1v5a1 1 0 001 1h5" stroke={s.color} strokeWidth="1" />
      </svg>
    </div>
  );
}

export default function UniversalCard({ resource, isPremium = false }: UniversalCardProps) {
  const subjectStyle = getSubjectStyle(resource.subject);
  const resourceId = resource._id || resource.id;
  const materialType = resource.materialType || resource.type || "Resource";
  const pageCount = resource.pageCount ?? resource.pages;
  const fileSize = resource.fileSize ?? resource.size;

  // Premium store specific link
  const href = isPremium 
    ? `/premium-store/${resource.slug || resourceId}`
    : `/free-resources/${resourceId}`;

  return (
    <div className="relative flex flex-col gap-3 group rounded-[1.25rem] p-6 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] overflow-hidden transition-all duration-500 hover:bg-white/[0.08] hover:border-white/[0.2] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(139,92,246,0.15)]">
      {/* Header row: icon + badges */}
      <div className="flex items-start gap-3">
        {resource.previewImageUrl ? (
          <div className="relative w-12 h-14 shrink-0 rounded-xl overflow-hidden border border-white/10">
            <Image
              src={resource.previewImageUrl}
              alt={resource.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <DocIcon subject={resource.subject} />
        )}
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex flex-wrap gap-1">
            <span
              className="inline-flex items-center gap-1.5 text-[0.58rem] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md"
              style={{ background: "rgba(255,255,255,0.04)", color: subjectStyle.color, border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {resource.subject}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[0.58rem] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-white/[0.03] text-foreground-muted border border-white/[0.06]">
              Gr {resource.grade}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
             <span
              className={`inline-flex items-center gap-1.5 text-[0.58rem] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md ${
                isPremium 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' 
                  : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
              }`}
            >
              {resource.term ? `Term ${resource.term}` : materialType}
            </span>
            {resource.year && (
              <span className="text-[0.6rem] font-semibold text-foreground-muted">{resource.year}</span>
            )}
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-sm leading-snug line-clamp-2 flex-1 text-foreground">
        {resource.title}
      </h3>

      {/* Meta row: pages · size · price */}
      <div className="flex items-center gap-3 text-xs text-foreground-muted">
        {pageCount && (
          <span className="flex items-center gap-1 font-medium">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <rect x="0.5" y="0.5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1" />
              <path d="M2 3h6M2 5h4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
            </svg>
            {pageCount}p
          </span>
        )}
        {fileSize && <span className="font-medium">{fileSize}</span>}
        
        {isPremium && (
          <span
            className="ml-auto font-bold text-sm text-foreground [text-shadow:0_0_10px_rgba(245,158,11,0.2)]"
          >
            <span className="text-[0.6rem] font-medium mr-0.5 text-foreground-muted">LKR</span>
            {(resource.price ?? 0).toLocaleString()}
          </span>
        )}
        {!isPremium && (
          <span className="ml-auto inline-flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-green-500/12 text-green-400 border border-green-500/25">FREE</span>
        )}
      </div>

      {/* CTA */}
      {isPremium ? (
        <Link
          href={href}
          className="w-full mt-auto flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 hover:-translate-y-px bg-gradient-to-br from-purple-600 to-purple-800 border border-purple-500/30 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          View &amp; Buy
        </Link>
      ) : (
        <Link
          href={href}
          className="inline-flex items-center justify-center gap-2 w-full font-display font-semibold text-[0.8125rem] tracking-wider py-2.5 rounded-xl text-purple-400 bg-purple-500/10 border border-purple-500/20 transition-all duration-300 hover:text-white hover:bg-gradient-to-br hover:from-purple-600/30 hover:to-purple-800/40 hover:-translate-y-1 group/btn"
          aria-label={`Download ${resource.title} as PDF`}
        >
          <svg
            className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover/btn:translate-y-0.5"
            fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a2 2 0 002 2h14a2 2 0 002-2v-3" />
          </svg>
          Download Free PDF
        </Link>
      )}
    </div>
  );
}
