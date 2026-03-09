import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, authError } from "@/lib/admin-auth";
import connectToDatabase from "@/lib/mongodb";
import Resource from "@/models/Resource";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    verifyAdminToken(req);
  } catch (err) {
    const { message, status } = authError(err);
    return NextResponse.json({ success: false, message }, { status });
  }

  try {
    await connectToDatabase();

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalStudents,
      premiumResources,
      revenueAgg,
      downloadsAgg,
      weeklyAgg,
      topSubjectsAgg,
      recentUsers,
      recentOrders,
    ] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Resource.countDocuments({ isPremium: true, isPublished: true }),

      // Total revenue from completed orders
      Order.aggregate([
        { $match: { paymentStatus: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      // Total downloads across all resources
      Resource.aggregate([
        { $group: { _id: null, total: { $sum: "$downloadCount" } } },
      ]),

      // Revenue per day for the last 7 days
      Order.aggregate([
        {
          $match: {
            paymentStatus: "completed",
            createdAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            amount: { $sum: "$amount" },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Top 5 subjects by total download count
      Resource.aggregate([
        { $group: { _id: "$subject", downloads: { $sum: "$downloadCount" } } },
        { $sort: { downloads: -1 } },
        { $limit: 5 },
      ]),

      // Most recent student registrations
      User.find({ role: "student" })
        .sort({ createdAt: -1 })
        .limit(6)
        .select("name email createdAt")
        .lean(),

      // Most recent completed orders
      Order.find({ paymentStatus: "completed" })
        .sort({ createdAt: -1 })
        .limit(6)
        .populate<{ user: { name: string; email: string } }>("user", "name email")
        .populate<{ resource: { title: string } }>("resource", "title")
        .lean(),
    ]);

    /* Build a 7-day array (oldest → newest) filling gaps with 0 */
    const weeklyMap = new Map<string, number>();
    for (const entry of weeklyAgg) {
      weeklyMap.set(entry._id as string, entry.amount as number);
    }
    const weeklyRevenue: { date: string; amount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      weeklyRevenue.push({ date: key, amount: weeklyMap.get(key) ?? 0 });
    }

    /* Merge registrations + purchases into one activity feed */
    type ActivityEvent = {
      type: "register" | "purchase";
      user: string;
      email: string;
      item: string;
      time: string;
    };

    const registerEvents: ActivityEvent[] = recentUsers.map((u) => ({
      type: "register",
      user: u.name,
      email: u.email,
      item: "New Account",
      time: (u.createdAt as Date).toISOString(),
    }));

    const purchaseEvents: ActivityEvent[] = recentOrders.map((o) => {
      const u = o.user as unknown as { name: string; email: string };
      const r = o.resource as unknown as { title: string };
      return {
        type: "purchase",
        user: u?.name ?? "Unknown",
        email: u?.email ?? "",
        item: r?.title ?? "Unknown Resource",
        time: (o.createdAt as Date).toISOString(),
      };
    });

    const recentActivity = [...registerEvents, ...purchaseEvents]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 8);

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents,
        totalRevenue: (revenueAgg[0]?.total ?? 0) as number,
        premiumResources,
        totalDownloads: (downloadsAgg[0]?.total ?? 0) as number,
      },
      weeklyRevenue,
      topSubjects: topSubjectsAgg.map((s) => ({
        subject: s._id as string,
        downloads: s.downloads as number,
      })),
      recentActivity,
    });
  } catch (err) {
    console.error("[GET /api/admin/overview]", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch overview data." },
      { status: 500 }
    );
  }
}
