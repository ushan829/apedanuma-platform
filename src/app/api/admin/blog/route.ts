import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, authError } from "@/lib/admin-auth";
import connectToDatabase from "@/lib/mongodb";
import BlogPost, { BLOG_CATEGORY_VALUES } from "@/models/BlogPost";
import Subscriber from "@/models/Subscriber";

/** GET /api/admin/blog — list all posts + subscriber count */
export async function GET(req: NextRequest) {
  try { verifyAdminToken(req); } catch (err) {
    const { message, status } = authError(err);
    return NextResponse.json({ success: false, message }, { status });
  }
  try {
    await connectToDatabase();
    const [posts, subscriberCount, subscribers] = await Promise.all([
      BlogPost.find({})
        .select("title slug author category isPublished viewCount readingTimeMinutes publishedAt createdAt")
        .sort({ createdAt: -1 })
        .lean(),
      Subscriber.countDocuments({ isActive: true }),
      Subscriber.find({ isActive: true })
        .select("email createdAt")
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
    ]);
    return NextResponse.json({
      success: true,
      posts: posts.map((p) => ({
        _id: String(p._id),
        title: p.title,
        slug: p.slug,
        author: p.author,
        category: p.category,
        isPublished: p.isPublished,
        viewCount: p.viewCount,
        readingTimeMinutes: p.readingTimeMinutes,
        publishedAt: p.publishedAt ? (p.publishedAt as Date).toISOString() : null,
        createdAt: (p.createdAt as Date).toISOString(),
      })),
      subscriberCount,
      subscribers: subscribers.map((s) => ({
        _id: String(s._id),
        email: s.email,
        createdAt: (s.createdAt as Date).toISOString(),
      })),
    });
  } catch (err) {
    console.error("[GET /api/admin/blog]", err);
    return NextResponse.json({ success: false, message: "Failed to fetch blog data." }, { status: 500 });
  }
}

/** POST /api/admin/blog — create a new blog post */
export async function POST(req: NextRequest) {
  try { verifyAdminToken(req); } catch (err) {
    const { message, status } = authError(err);
    return NextResponse.json({ success: false, message }, { status });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const { title, slug, content, excerpt, coverImage, author, category, tags, isPublished } = body as {
    title?: string; slug?: string; content?: string; excerpt?: string; coverImage?: string;
    author?: string; category?: string; tags?: string[]; isPublished?: boolean;
  };

  if (!title?.trim()) return NextResponse.json({ success: false, message: "Title is required." }, { status: 400 });
  if (!slug?.trim())  return NextResponse.json({ success: false, message: "Slug is required." }, { status: 400 });
  if (!content?.trim()) return NextResponse.json({ success: false, message: "Content is required." }, { status: 400 });
  if (!author?.trim()) return NextResponse.json({ success: false, message: "Author is required." }, { status: 400 });
  if (!category || !(BLOG_CATEGORY_VALUES as readonly string[]).includes(category)) {
    return NextResponse.json({ success: false, message: "Invalid category." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const post = await BlogPost.create({
      title: title.trim(),
      slug: slug.trim(),
      content: content.trim(),
      excerpt: excerpt?.trim(),
      coverImage: coverImage?.trim() || undefined,
      author: author.trim(),
      category,
      tags: Array.isArray(tags) ? tags : [],
      isPublished: !!isPublished,
    });
    return NextResponse.json({ success: true, post: { _id: String(post._id), slug: post.slug } }, { status: 201 });
  } catch (err) {
    const mongoErr = err as { code?: number; name?: string; errors?: Record<string, { message: string }> };
    if (mongoErr.code === 11000) return NextResponse.json({ success: false, message: "A post with this slug already exists." }, { status: 409 });
    if (mongoErr.name === "ValidationError" && mongoErr.errors) {
      return NextResponse.json({ success: false, message: Object.values(mongoErr.errors)[0].message }, { status: 400 });
    }
    console.error("[POST /api/admin/blog]", err);
    return NextResponse.json({ success: false, message: "Failed to create post." }, { status: 500 });
  }
}
