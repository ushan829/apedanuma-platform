import type { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import BlogFeed from "@/components/sections/BlogFeed";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Study Tips & Insights",
  description:
    "Expert study tips, exam strategies, and subject guides for O/L English Medium students in Sri Lanka.",
};

export interface PostSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  readingTimeMinutes: number;
  publishedAt: string;
  viewCount: number;
  coverImage?: string;
}

export default async function BlogPage() {
  let posts: PostSummary[] = [];

  try {
    await connectToDatabase();
    const raw = await BlogPost.find({ isPublished: true })
      .select("title slug excerpt author category tags readingTimeMinutes publishedAt viewCount coverImage createdAt")
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();

    posts = raw.map((p) => ({
      _id: String(p._id),
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt ?? "",
      author: p.author,
      category: p.category,
      tags: p.tags ?? [],
      readingTimeMinutes: p.readingTimeMinutes,
      publishedAt: p.publishedAt
        ? (p.publishedAt as Date).toISOString()
        : (p.createdAt as Date).toISOString(),
      viewCount: p.viewCount,
      coverImage: p.coverImage ?? undefined,
    }));
  } catch (err) {
    console.error("[BlogPage] DB error", err);
  }

  return (
    <main className="relative overflow-hidden">
      {/* Ambient glows */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: 800, height: 500,
            background: "radial-gradient(circle, rgba(124,31,255,0.07) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute top-1/2 right-0 rounded-full"
          style={{
            width: 500, height: 500,
            background: "radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="container-xl py-16 sm:py-20">
        {/* Page Header */}
        <header className="mb-14 space-y-4 text-center">
          <div className="badge-accent mx-auto w-fit">The Blog</div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-balance">
            Study Tips &amp;{" "}
            <span className="text-gradient-arcane">Insights</span>
          </h1>
          <p
            className="max-w-xl mx-auto text-base sm:text-lg leading-relaxed"
            style={{ color: "var(--foreground-secondary)" }}
          >
            Exam strategies, subject guides, and learning science — curated for
            Sri Lanka&apos;s O/L English Medium achievers.
          </p>
        </header>

        <BlogFeed initialPosts={posts} />
      </div>
    </main>
  );
}
