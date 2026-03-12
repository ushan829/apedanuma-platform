import type { Metadata } from "next";
import ResourceLibrary from "@/components/sections/ResourceLibrary";
import connectToDatabase from "@/lib/mongodb";
import Resource from "@/models/Resource";
import type { LiveResource } from "@/lib/resource-constants";

export const metadata: Metadata = {
  title: "Free Study Materials",
  description:
    "Browse and download free O/L English Medium study materials — Term Test Papers, Short Notes, Past Papers and more, organised by grade and subject.",
};

/* Revalidate every 5 minutes so new uploads appear without a full rebuild */
export const revalidate = 300;

async function getFreeResources(): Promise<LiveResource[]> {
  try {
    await connectToDatabase();
    const docs = await Resource.find({ isPremium: false, isPublished: true })
      .select("title slug description grade subject materialType term year pageCount fileSize downloadCount pdfUrl")
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
      pageCount: d.pageCount,
      fileSize: d.fileSize,
      downloadCount: d.downloadCount,
      pdfUrl: d.pdfUrl,
    }));
  } catch (err) {
    console.error("[free-resources] Failed to fetch from MongoDB:", err);
    return [];
  }
}

export default async function FreeResourcesPage() {
  const resources = await getFreeResources();

  return (
    <main className="relative overflow-hidden">
      {/* Ambient background glows */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-40 left-1/3 rounded-full"
          style={{
            width: 700,
            height: 600,
            background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 rounded-full"
          style={{
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(124,31,255,0.05) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>
      {/* Pass live data; falls back to static if DB is empty */}
      <ResourceLibrary resources={resources.length > 0 ? resources : undefined} />
    </main>
  );
}
