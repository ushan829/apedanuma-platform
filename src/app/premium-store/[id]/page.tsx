import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import Resource from "@/models/Resource";
import User from "@/models/User";
import { getSubjectStyle } from "@/lib/free-resources";
import { getServerSession } from "@/lib/auth-cookie";
import { getPresignedUrl } from "@/lib/s3";
import BuySection from "@/components/sections/BuySection";
import PDFViewer from "@/components/Resource/PDFViewer";
import type { LiveResource } from "@/lib/resource-constants";

/* ─────────────────────────────────────────
   DB fetch helper
   ───────────────────────────────────────── */
async function getProduct(id: string): Promise<LiveResource | null> {
  try {
    await connectToDatabase();
    const doc = await Resource.findOne({ _id: id, isPremium: true, isPublished: true })
      .select("title description grade subject materialType term year price pageCount fileSize downloadCount pdfUrl")
      .lean();
    if (!doc) return null;
    return {
      _id: String(doc._id),
      title: doc.title,
      description: doc.description,
      grade: doc.grade as 10 | 11,
      subject: doc.subject,
      materialType: doc.materialType,
      term: doc.term as 1 | 2 | 3 | undefined,
      year: doc.year,
      price: doc.price ?? 0,
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
   Helper to check if user has purchased
   ───────────────────────────────────────── */
async function checkPurchase(userId: string, resourceId: string): Promise<boolean> {
  try {
    await connectToDatabase();
    const user = await User.findById(userId).select("purchasedResources role").lean();
    if (!user) return false;
    if (user.role === "admin") return true;
    return user.purchasedResources.some(id => id.toString() === resourceId);
  } catch {
    return false;
  }
}

/* ─────────────────────────────────────────
   Derive cover visuals from subject
   ───────────────────────────────────────── */
function getCoverStyle(subject: string) {
  const s = getSubjectStyle(subject);
  return {
    gradient: `linear-gradient(135deg, ${s.bg.replace(/[\d.]+\)$/, "0.22)")} 0%, rgba(10,10,10,0.85) 100%)`,
    accent: s.bg.replace(/[\d.]+\)$/, "0.30)"),
    color: s.color,
    bg: s.bg,
    border: s.border,
  };
}

const BASE_URL = "https://apedanuma.lk";
const OG_PLACEHOLDER = `${BASE_URL}/og-default.jpg`;

/* ─────────────────────────────────────────
   Dynamic metadata
   ───────────────────────────────────────── */
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = await getProduct(params.id);
  if (!p) return { title: "Product Not Found" };
  const canonical = `${BASE_URL}/premium-store/${params.id}`;
  const title = `${p.title} — ${p.subject} Premium ${p.materialType} | Ape Danuma EM`;
  const description = p.description || `Buy this premium ${p.subject} ${p.materialType} for Grade ${p.grade} O/L students. Instant PDF download.`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      images: [{ url: OG_PLACEHOLDER, width: 1200, height: 630, alt: p.title }],
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
   Large cover placeholder
   ───────────────────────────────────────── */
function LargeCover({ product }: { product: LiveResource }) {
  const cover = getCoverStyle(product.subject);
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{ aspectRatio: "3/4", background: cover.gradient, maxWidth: 340 }}
      aria-hidden="true"
    >
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 40%, ${cover.accent} 0%, transparent 60%)` }} />
      <svg className="absolute inset-0 w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`lc-${product._id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.6)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#lc-${product._id})`} />
      </svg>
      {/* PDF icon */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" style={{ opacity: 0.18 }}>
          <rect x="8" y="4" width="44" height="56" rx="5" stroke="white" strokeWidth="2" />
          <path d="M8 18h44" stroke="white" strokeWidth="1.5" />
          <path d="M18 28h36M18 36h28M18 44h32" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="font-display font-black text-2xl tracking-widest" style={{ color: "rgba(255,255,255,0.12)" }}>
          PDF
        </span>
      </div>
      {/* Type badge */}
      <div className="absolute top-4 right-4">
        <span
          className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
          style={{ background: "rgba(0,0,0,0.6)", color: cover.color, border: `1px solid ${cover.color}55`, backdropFilter: "blur(8px)" }}
        >
          {product.materialType}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.8), transparent)" }} />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <span className="text-[0.6rem] font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>
          English Medium
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Stat pill
   ───────────────────────────────────────── */
function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-3 rounded-xl text-center"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <span className="font-display font-bold text-base" style={{ color: "var(--foreground)" }}>{value}</span>
      <span className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Page
   ───────────────────────────────────────── */
export default async function ProductPreviewPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const session = getServerSession();
  const hasPurchased = session ? await checkPurchase(session.sub, product._id) : false;
  const secureUrl = await getSecurePdfUrl(product.pdfUrl || "");

  const cover = getCoverStyle(product.subject);
  const typeLabel = product.term
    ? `${product.materialType} · Term ${product.term}`
    : product.materialType;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    category: `${product.subject} ${product.materialType}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "LKR",
      price: String(product.price ?? 0),
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/premium-store/${product._id}`,
    },
  };

  return (
    <main className="relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 rounded-full"
          style={{
            width: 700, height: 700,
            background: `radial-gradient(circle, ${cover.accent} 0%, transparent 65%)`,
            filter: "blur(100px)",
            opacity: 0.5,
          }}
        />
      </div>

      <div className="container-xl py-12 sm:py-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-10" aria-label="Breadcrumb" style={{ color: "var(--foreground-muted)" }}>
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/premium-store" className="hover:text-white transition-colors">Premium Store</Link>
          <span>/</span>
          <span style={{ color: "var(--foreground-secondary)" }}>{product.title}</span>
        </nav>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_380px] gap-12 xl:gap-16 items-start">

          {/* Left — PDF Viewer (sticky on desktop) */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-24">
            <PDFViewer 
              fileUrl={secureUrl} 
              isPremium={true} 
              hasPurchased={hasPurchased} 
              price={product.price}
              resourceId={product._id}
            />
          </div>

          {/* Right — details */}
          <div className="flex flex-col gap-7">

            {/* Badges */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: cover.bg, color: cover.color, border: `1px solid ${cover.border}` }}
              >
                {product.subject}
              </span>
              <span
                className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.05)", color: "var(--foreground-muted)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                Grade {product.grade}
              </span>
              <span
                className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.05)", color: "var(--foreground-muted)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {typeLabel}
              </span>
              {product.year && (
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-md"
                  style={{ background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)" }}
                >
                  {product.year}
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl leading-tight" style={{ color: "var(--foreground)" }}>
                {product.title}
              </h1>
              <p className="text-lg mt-2" style={{ color: "var(--foreground-secondary)" }}>
                {product.subject} · Grade {product.grade} · {product.materialType}
              </p>
            </div>

            {/* Stat pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {product.pageCount && <StatPill label="Pages" value={`${product.pageCount}`} />}
              {product.fileSize && <StatPill label="File Size" value={product.fileSize} />}
              <StatPill label="Format" value="PDF" />
              {product.downloadCount > 0 && (
                <StatPill label="Sold" value={`${product.downloadCount}+`} />
              )}
            </div>

            {/* Divider */}
            <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 40%, transparent)" }} />

            {/* Description */}
            <div>
              <h2 className="font-display font-semibold text-base mb-3" style={{ color: "var(--foreground)" }}>
                About this document
              </h2>
              <p className="text-[0.9375rem] leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
                {product.description}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 40%, transparent)" }} />

            {/* Price + CTA — Client Component (checks purchase status on mount) */}
            <BuySection resourceId={product._id} price={product.price ?? 0} />

            {/* Trust note */}
            <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--foreground-muted)" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1L1 4v3c0 2.76 2.15 5.35 5 6 2.85-.65 5-3.24 5-6V4L6 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
              Secure payment · PDF delivered instantly to your account · Free updates included
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
