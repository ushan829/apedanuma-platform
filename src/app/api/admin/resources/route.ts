import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, authError } from "@/lib/admin-auth";
import connectToDatabase from "@/lib/mongodb";
import Resource from "@/models/Resource";

/**
 * GET /api/admin/resources?page=1&limit=20
 * Returns a paginated page of resources (all, published + drafts) for the admin table.
 * Also returns aggregate stats across ALL resources for the stat cards.
 * Admin-only.
 */
export async function GET(req: NextRequest) {
  try {
    verifyAdminToken(req);
  } catch (err) {
    const { message, status } = authError(err);
    return NextResponse.json({ success: false, message }, { status });
  }

  try {
    await connectToDatabase();

    // ── Pagination params ──────────────────────────────────────────────────────
    const page  = Math.max(1, parseInt(req.nextUrl.searchParams.get("page")  ?? "1",  10));
    const limit = Math.min(100, Math.max(1, parseInt(req.nextUrl.searchParams.get("limit") ?? "20", 10)));
    const skip  = (page - 1) * limit;

    // ── Run paginated query + aggregate stats in parallel ─────────────────────
    const [total, published, premium, resources] = await Promise.all([
      Resource.countDocuments({}),
      Resource.countDocuments({ isPublished: true }),
      Resource.countDocuments({ isPremium: true }),
      Resource.find({})
        .select(
          "title slug description grade subject materialType term year isPremium price pageCount fileSize downloadCount isPublished pdfUrl createdAt"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const serialised = resources.map((r) => ({
      _id:           String(r._id),
      title:         r.title,
      slug:          r.slug || String(r._id),
      description:   r.description,
      grade:         r.grade,
      subject:       r.subject,
      materialType:  r.materialType,
      term:          r.term,
      year:          r.year,
      isPremium:     r.isPremium,
      price:         r.price,
      pageCount:     r.pageCount,
      fileSize:      r.fileSize,
      downloadCount: r.downloadCount,
      isPublished:   r.isPublished,
      pdfUrl:        r.pdfUrl,
      createdAt:     r.createdAt,
    }));

    return NextResponse.json({
      success: true,
      resources: serialised,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
      stats: {
        total,
        published,
        premium,
        free: total - premium,
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/resources]", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch resources." },
      { status: 500 }
    );
  }
}
