import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, authError } from "@/lib/admin-auth";
import connectToDatabase from "@/lib/mongodb";
import BlogPost, { BLOG_CATEGORY_VALUES } from "@/models/BlogPost";

type Ctx = { params: { id: string } };

/** GET /api/admin/blog/[id] — fetch a single post for editing */
export async function GET(req: NextRequest, { params }: Ctx) {
  try { verifyAdminToken(req); } catch (err) {
    const { message, status } = authError(err);
    return NextResponse.json({ success: false, message }, { status });
  }
  try {
    await connectToDatabase();
    const post = await BlogPost.findById(params.id).lean();
    if (!post) return NextResponse.json({ success: false, message: "Post not found." }, { status: 404 });
    return NextResponse.json({ success: true, post: { ...post, _id: String(post._id) } });
  } catch (err) {
    console.error("[GET /api/admin/blog/:id]", err);
    return NextResponse.json({ success: false, message: "Failed to fetch post." }, { status: 500 });
  }
}

/** PATCH /api/admin/blog/[id] — update a post */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  try { verifyAdminToken(req); } catch (err) {
    const { message, status } = authError(err);
    return NextResponse.json({ success: false, message }, { status });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const allowed = ["title", "slug", "content", "excerpt", "coverImage", "author", "authorUrl", "category", "tags", "isPublished"] as const;
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  if (update.category !== undefined && !(BLOG_CATEGORY_VALUES as readonly string[]).includes(String(update.category))) {
    return NextResponse.json({ success: false, message: "Invalid category." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const post = await BlogPost.findByIdAndUpdate(
      params.id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();
    if (!post) return NextResponse.json({ success: false, message: "Post not found." }, { status: 404 });
    return NextResponse.json({ success: true, post: { ...post, _id: String(post._id) } });
  } catch (err) {
    const mongoErr = err as { code?: number; name?: string; errors?: Record<string, { message: string }> };
    if (mongoErr.code === 11000) return NextResponse.json({ success: false, message: "A post with this slug already exists." }, { status: 409 });
    if (mongoErr.name === "ValidationError" && mongoErr.errors) {
      return NextResponse.json({ success: false, message: Object.values(mongoErr.errors)[0].message }, { status: 400 });
    }
    console.error("[PATCH /api/admin/blog/:id]", err);
    return NextResponse.json({ success: false, message: "Failed to update post." }, { status: 500 });
  }
}

/** DELETE /api/admin/blog/[id] — delete a post */
export async function DELETE(req: NextRequest, { params }: Ctx) {
  try { verifyAdminToken(req); } catch (err) {
    const { message, status } = authError(err);
    return NextResponse.json({ success: false, message }, { status });
  }
  try {
    await connectToDatabase();
    const post = await BlogPost.findByIdAndDelete(params.id).lean();
    if (!post) return NextResponse.json({ success: false, message: "Post not found." }, { status: 404 });
    return NextResponse.json({ success: true, message: `"${post.title}" deleted.` });
  } catch (err) {
    console.error("[DELETE /api/admin/blog/:id]", err);
    return NextResponse.json({ success: false, message: "Failed to delete post." }, { status: 500 });
  }
}
