import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

// This route reads query params at request time — always server-render on demand.
export const dynamic = "force-dynamic";

/**
 * GET /api/blog/posts
 * Returns all published posts for the public blog listing.
 * Optional query param: ?category=Study+Tips
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const query: Record<string, unknown> = { isPublished: true };
    if (category && category !== "All") query.category = category;

    const posts = await BlogPost.find(query)
      .select("title slug excerpt author category tags readingTimeMinutes publishedAt viewCount createdAt")
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      posts: posts.map((p) => ({
        _id: String(p._id),
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt ?? "",
        author: p.author,
        category: p.category,
        tags: p.tags ?? [],
        readingTimeMinutes: p.readingTimeMinutes,
        publishedAt: p.publishedAt ? (p.publishedAt as Date).toISOString() : (p.createdAt as Date).toISOString(),
        viewCount: p.viewCount,
      })),
    });
  } catch (err) {
    console.error("[GET /api/blog/posts]", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch posts." },
      { status: 500 }
    );
  }
}
