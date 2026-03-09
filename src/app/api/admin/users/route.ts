import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, authError } from "@/lib/admin-auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

/**
 * GET /api/admin/users?page=1&limit=50
 * Returns paginated users for the admin users page.
 * Also returns overall stats (total counts) independent of the current page.
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

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)));
    const skip = (page - 1) * limit;

    const [users, total, studentCount, adminCount, purchaseAgg] = await Promise.all([
      User.find({})
        .select("name email role purchasedResources createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments({}),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "admin" }),
      User.aggregate([
        { $project: { count: { $size: { $ifNull: ["$purchasedResources", []] } } } },
        { $group: { _id: null, total: { $sum: "$count" } } },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      users: users.map((u) => ({
        _id: String(u._id),
        name: u.name,
        email: u.email,
        role: u.role,
        purchasedCount: (u.purchasedResources ?? []).length,
        createdAt: (u.createdAt as Date).toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalStudents: studentCount,
        totalAdmins: adminCount,
        totalPurchases: purchaseAgg[0]?.total ?? 0,
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/users]", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users." },
      { status: 500 }
    );
  }
}
