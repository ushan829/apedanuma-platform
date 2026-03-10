import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-cookie";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

/**
 * GET /api/user/me
 * Returns the authenticated user's full profile including populated purchasedResources.
 * Used by the dashboard to display real purchased content.
 */
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Not authenticated." }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const user = await User.findById(session.sub)
      .select("name email role createdAt purchasedResources emailVerified")
      .populate({
        path: "purchasedResources",
        select: "title subject grade materialType description pageCount fileSize isPublished",
        match: { isPublished: true },
      })
      .lean();

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    const purchasedResources = (user.purchasedResources as unknown as Record<string, unknown>[])
      .filter(Boolean)
      .map((r) => ({
        _id:          String(r._id),
        title:        r.title as string,
        subject:      r.subject as string,
        grade:        r.grade as number,
        materialType: r.materialType as string,
        description:  (r.description as string) ?? "",
        pageCount:    (r.pageCount as number | null) ?? null,
        fileSize:     (r.fileSize as string | null) ?? null,
      }));

    return NextResponse.json({
      success: true,
      user: {
        name:               user.name,
        email:              user.email,
        role:               user.role,
        emailVerified:      user.emailVerified,
        createdAt:          user.createdAt ? (user.createdAt as Date).toISOString() : new Date().toISOString(),
        purchasedResources,
      },
    });
  } catch (err) {
    console.error("[GET /api/user/me]", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user data." },
      { status: 500 }
    );
  }
}
