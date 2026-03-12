import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { getSubjectStyle } from "@/lib/free-resources";
import { getPresignedUrl } from "@/lib/s3";
import PDFViewer from "@/components/Resource/PDFViewer";
import type { LiveResource } from "@/lib/resource-constants";

/* ─────────────────────────────────────────
   DB fetch helper
   ───────────────────────────────────────── */
async function getResource(slug: string): Promise<LiveResource | null> {
  try {
    await connectToDatabase();
    
    // Check if we should try searching by _id as a fallback
    const query: any = { 
      isPremium: false, 
      isPublished: true,
      $or: [
        { slug: slug },
      ]
    };
    
    if (mongoose.isValidObjectId(slug)) {
      query.$or.push({ _id: slug });
    }

    const doc = await Resource.findOne(query)
      .select("title slug description grade subject materialType term year pageCount fileSize downloadCount pdfUrl")
      .lean();
    if (!doc) return null;
    return {
      _id: String(doc._id),
      title: doc.title,
      slug: doc.slug || String(doc._id),
      description: doc.description,
      grade: doc.grade as 10 | 11,
      subject: doc.subject,
      materialType: doc.materialType,
      term: doc.term as 1 | 2 | 3 | undefined,
      year: doc.year,
      pageCount: doc.pageCount,
      fileSize: doc.fileSize,
      downloadCount: doc.downloadCount,
      pdfUrl: doc.pdfUrl,
    };
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────
   Helper to get presigned URL from public URL
   ───────────────────────────────────────── */
async function getSecurePdfUrl(publicUrl: string) {
  try {
    const url = new URL(publicUrl);
    const key = decodeURIComponent(url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname);
    return await getPresignedUrl(key);
  } catch {
    return publicUrl;
  }
}

/* ─────────────────────────────────────────
   Color meta keyed by DB materialType
   ───────────────────────────────────────── */
const TYPE_META: Record<string, { label: string; shortLabel: string; color: string; bg: string; border: string }> = {
  "Past Paper":     { label: "O/L Past Paper",  shortLabel: "Past Paper",  color: "#fda4af", bg: "rgba(244,63,94,0.12)",   border: "rgba(244,63,94,0.26)"   },
  "Term Test Paper":{ label: "Term Test Paper",  shortLabel: "Term Test",   color: "#93c5fd", bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.28)"  },
  "Marking Scheme": { label: "Marking Scheme",   shortLabel: "Mark Scheme", color: "#fdba74", bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.26)"  },
  "Short Note":     { label: "Short Note",       shortLabel: "Short Note",  color: "#6ee7b7", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.28)"  },
  "Model Paper":    { label: "Model Paper",      shortLabel: "Model",       color: "#fcd34d", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.28)"  },
  "Revision Paper": { label: "Revision Paper",   shortLabel: "Revision",    color: "#2dd4bf", bg: "rgba(20,184,166,0.12)",  border: "rgba(20,184,166,0.28)"  },
  "MCQ Paper":      { label: "MCQ Paper",        shortLabel: "MCQ",         color: "#818cf8", bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.26)"  },
  "Essay Guide":    { label: "Essay Guide",      shortLabel: "Essay",       color: "#f472b6", bg: "rgba(236,72,153,0.12)",  border: "rgba(236,72,153,0.26)"  },
};

function getTypeMeta(materialType: string) {
  return TYPE_META[materialType] ?? {
    label: materialType,
    shortLabel: materialType,
    color: "var(--foreground-muted)",
    bg: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.09)",
  };
}

/* ─────────────────────────────────────────
   Dynamic metadata
   ───────────────────────────────────────── */
const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "https://em.apedanuma.lk").replace(/\/$/, "");
const OG_PLACEHOLDER = `${BASE_URL}/og-default.jpg`;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const r = await getResource(params.slug);
  if (!r) return { title: "Resource Not Found" };
  const canonical = `${BASE_URL}/free-resources/${params.slug}`;
  const title = `${r.title} — Free ${r.materialType} | Ape Danuma EM`;
  const description = r.description || `Download this free ${r.subject} ${r.materialType} for Grade ${r.grade} O/L students.`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      images: [{ url: OG_PLACEHOLDER, width: 1200, height: 630, alt: r.title }],
      siteName: "Ape Danuma EM",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_PLACEHOLDER],
    },
  };
}

/* ─────────────────────────────────────────
   Ad Space placeholder
   ───────────────────────────────────────── */
function AdSpace({ label, width, height }: { label: string; width: string; height: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl gap-2 select-none"
      style={{
        width,
        height,
        background: "rgba(255,255,255,0.02)",
        border: "1px dashed rgba(255,255,255,0.1)",
        boxShadow: "inset 0 0 30px rgba(0,0,0,0.15)",
      }}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" style={{ opacity: 0.2 }}>
        <rect x="1" y="1" width="20" height="20" rx="4" stroke="white" strokeWidth="1.2" />
        <path d="M6 16l3-5 2.5 3.5 2-2.5 2.5 4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="8" r="1.5" fill="white" />
      </svg>
      <span className="text-[0.6rem] font-bold uppercase tracking-widest text-center px-2" style={{ color: "rgba(255,255,255,0.18)" }}>
        Advertisement
      </span>
      <span className="text-[0.55rem] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.1)" }}>
        {label}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Stat pill
   ───────────────────────────────────────── */
function StatPill({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-2.5 rounded-xl text-center flex-1"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <span className="font-display font-bold text-sm" style={{ color: color ?? "var(--foreground)" }}>{value}</span>
      <span className="text-[0.6rem] mt-0.5 uppercase tracking-wider" style={{ color: "var(--foreground-muted)" }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Page
   ───────────────────────────────────────── */
export default async function ResourcePreviewPage({ params }: { params: { slug: string } }) {
  const resource = await getResource(params.slug);
  if (!resource) notFound();

  const secureUrl = await getSecurePdfUrl(resource.pdfUrl || "");

  const subjectStyle = getSubjectStyle(resource.subject);
  const typeMeta = getTypeMeta(resource.materialType);
  const typeLabel = resource.term
    ? `${typeMeta.label} · Term ${resource.term}`
    : typeMeta.label;

  /* ── Product JSON-LD ── */
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: resource.title,
    description: resource.description,
    category: `${resource.subject} ${resource.materialType}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "LKR",
      price: "0",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/free-resources/${resource.slug}`,
    },
  };

  return (
    <main className="relative overflow-hidden">
      {/* Product JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/3 rounded-full"
          style={{
            width: 700, height: 600,
            background: `radial-gradient(circle, ${subjectStyle.bg.replace("0.1", "0.06")} 0%, transparent 65%)`,
            filter: "blur(90px)",
          }}
        />
      </div>

      <div className="container-xl py-10 sm:py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center flex-wrap gap-1.5 text-xs mb-8" aria-label="Breadcrumb" style={{ color: "var(--foreground-muted)" }}>
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/free-resources" className="hover:text-white transition-colors">Free Resources</Link>
          <span>/</span>
          <span style={{ color: "var(--foreground-secondary)" }}>Grade {resource.grade}</span>
          <span>/</span>
          <span style={{ color: subjectStyle.color }}>{resource.subject}</span>
          <span>/</span>
          <span style={{ color: typeMeta.color }}>{typeLabel}</span>
        </nav>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_380px] gap-8 xl:gap-12 items-start">

          {/* ── Left column: PDF Viewer + ad ── */}
          <div className="flex flex-col gap-6">
            <PDFViewer fileUrl={secureUrl} />
            <div className="flex justify-center">
              <AdSpace label="728 × 90 · Leaderboard" width="100%" height="90px" />
            </div>
          </div>

          {/* ── Right column: sticky details + CTA + ad ── */}
          <div className="flex flex-col gap-5 lg:sticky" style={{ top: 88 }}>
            {/* Detail card */}
            <div
              className="relative rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              {/* Top-edge highlight */}
              <div
                className="absolute top-0 left-0 right-0 h-px rounded-t-2xl pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${subjectStyle.color}55 40%, ${subjectStyle.color}33 60%, transparent)`,
                }}
              />

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span
                  className="text-[0.62rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)", color: "var(--foreground-muted)", border: "1px solid rgba(255,255,255,0.09)" }}
                >
                  Grade {resource.grade}
                </span>
                <span
                  className="text-[0.62rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: subjectStyle.bg, color: subjectStyle.color, border: `1px solid ${subjectStyle.border}` }}
                >
                  {resource.subject}
                </span>
                <span
                  className="text-[0.62rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: typeMeta.bg, color: typeMeta.color, border: `1px solid ${typeMeta.border}` }}
                >
                  {typeLabel}
                </span>
                {resource.year && (
                  <span
                    className="text-[0.62rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(16,185,129,0.1)", color: "#34d399", border: "1px solid rgba(16,185,129,0.22)" }}
                  >
                    {resource.year}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-display font-bold text-xl leading-snug mb-4" style={{ color: "var(--foreground)" }}>
                {resource.title}
              </h1>

              {/* Stat pills */}
              <div className="flex gap-2 mb-4">
                {resource.pageCount && <StatPill label="Pages" value={`${resource.pageCount}`} />}
                {resource.fileSize && <StatPill label="File Size" value={resource.fileSize} />}
                <StatPill label="Format" value="PDF" color="#34d399" />
                {resource.downloadCount > 0 && (
                  <StatPill label="Downloads" value={`${resource.downloadCount}`} color="#fbbf24" />
                )}
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--foreground-secondary)" }}>
                {resource.description}
              </p>

              {/* Free badge */}
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-5"
                style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 1l1.6 3.5 3.9.35-2.85 2.65.72 3.85L7 9.45l-3.37 1.9.72-3.85L1.5 4.85l3.9-.35L7 1z" stroke="#34d399" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
                <span className="text-xs font-semibold" style={{ color: "#34d399" }}>
                  100% Free — No account required
                </span>
              </div>

              {/* Download button — links to /api/download/[id] for force download */}
              <a
                href={`/api/download/${resource._id}`}
                download
                className="w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 font-bold text-sm transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "linear-gradient(135deg, #7c1fff 0%, #9455ff 60%, #7c1fff 100%)",
                  backgroundSize: "200% auto",
                  boxShadow: "0 0 28px rgba(124,31,255,0.45), 0 4px 16px rgba(0,0,0,0.35)",
                  color: "#fff",
                  textDecoration: "none",
                  display: "flex",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 2v8M5 7l3 4 3-4M2 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download PDF — Free
              </a>

              {/* Trust note */}
              <p className="text-center text-[0.6rem] mt-3 flex items-center justify-center gap-1" style={{ color: "var(--foreground-muted)" }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M5 1L1 3.5v2.5c0 2 1.6 3.88 4 4.5 2.4-.62 4-2.5 4-4.5V3.5L5 1z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
                </svg>
                Secure · No sign-up · Instant download
              </p>
            </div>

            {/* Ad space */}
            <AdSpace label="300 × 250 · Medium Rectangle" width="100%" height="250px" />

            {/* Back link */}
            <Link
              href="/free-resources"
              className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-px"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "var(--foreground-secondary)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M9 3L4 7l5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Resource Library
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
