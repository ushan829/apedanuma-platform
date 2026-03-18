import { Suspense } from "react";
import type { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import Resource from "@/models/Resource";
import PremiumGrid from "@/components/sections/PremiumGrid";
import type { LiveResource } from "@/lib/resource-constants";

export const metadata: Metadata = {
  title: "Premium Store — Study Materials",
  description:
    "Expert-crafted premium PDF packs for G.C.E. O/L English Medium students. Buy individual packs, download instantly, study anywhere.",
};

/* Revalidate every 5 minutes so new uploads appear without a full rebuild */
export const revalidate = 300;

async function getPremiumProducts(): Promise<LiveResource[]> {
  try {
    await connectToDatabase();
    const docs = await Resource.find({ isPremium: true, isPublished: true })
      .select("title slug description grade subject materialType term year price pageCount fileSize downloadCount pdfUrl previewImageUrl")
      .sort({ createdAt: -1 })
      .lean();

    return docs.map((d) => ({
      _id: String(d._id),
      title: d.title,
      slug: d.slug || String(d._id),
      description: d.description,
      grade: d.grade as 10 | 11,
      subject: d.subject,
      materialType: d.materialType,
      term: d.term as 1 | 2 | 3 | undefined,
      year: d.year,
      price: d.price ?? 0,
      pageCount: d.pageCount,
      fileSize: d.fileSize,
      downloadCount: d.downloadCount,
      pdfUrl: d.pdfUrl,
      previewImageUrl: d.previewImageUrl,
    }));
  } catch (err) {
    console.error("[premium-store] Failed to fetch from MongoDB:", err);
    return [];
  }
}

export default async function PremiumStorePage() {
  const products = await getPremiumProducts();

  return (
    <main className="relative overflow-hidden">
      {/* Ambient glows */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-40 left-1/3 rounded-full"
          style={{
            width: 700,
            height: 600,
            background: "radial-gradient(circle, rgba(124,31,255,0.08) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 rounded-full"
          style={{
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="container-xl py-16 sm:py-20">
        {/* Page header */}
        <header className="mb-12 space-y-4 text-center">
          <div className="badge-gold mx-auto w-fit">Premium Collection</div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-balance">
            Premium{" "}
            <span className="text-gradient-arcane">Study Materials</span>
          </h1>
          <p className="max-w-xl mx-auto text-base sm:text-lg leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
            Individual PDF packs crafted by expert educators — buy only what you
            need, download instantly, and study on any device.
          </p>
        </header>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div
              className="flex items-center justify-center w-20 h-20 rounded-2xl"
              style={{ background: "rgba(124,31,255,0.08)", border: "1px solid rgba(124,31,255,0.2)" }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect x="4" y="2" width="20" height="26" rx="3" stroke="rgba(148,85,255,0.6)" strokeWidth="1.5" />
                <path d="M4 8h20" stroke="rgba(148,85,255,0.4)" strokeWidth="1" />
                <path d="M9 14h12M9 18h8M9 22h10" stroke="rgba(148,85,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="font-display font-semibold text-lg" style={{ color: "var(--foreground)" }}>
              Premium materials coming soon
            </p>
            <p className="text-sm max-w-sm" style={{ color: "var(--foreground-muted)" }}>
              Our educators are preparing exclusive PDF packs. Check back shortly.
            </p>
          </div>
        ) : (
          <Suspense fallback={<div className="py-20 text-center">Loading Store...</div>}>
            <PremiumGrid products={products} />
          </Suspense>
        )}
      </div>
    </main>
  );
}
