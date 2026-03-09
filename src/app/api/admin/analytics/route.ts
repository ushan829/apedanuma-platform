import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, authError } from "@/lib/admin-auth";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Resource from "@/models/Resource";

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

    /* Start of current month */
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    /* Start of last month */
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    /* 12 months ago (first day) */
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const [
      overallAgg,
      thisMonthAgg,
      lastMonthAgg,
      uniqueBuyersAgg,
      monthlyAgg,
      topProductsAgg,
      bySubjectAgg,
      recentOrders,
      totalPublishedResources,
    ] = await Promise.all([

      /* Total revenue + order count (all time) */
      Order.aggregate([
        { $match: { paymentStatus: "completed" } },
        { $group: { _id: null, revenue: { $sum: "$amount" }, orders: { $sum: 1 } } },
      ]),

      /* This month */
      Order.aggregate([
        { $match: { paymentStatus: "completed", createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, revenue: { $sum: "$amount" }, orders: { $sum: 1 } } },
      ]),

      /* Last month */
      Order.aggregate([
        {
          $match: {
            paymentStatus: "completed",
            createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
          },
        },
        { $group: { _id: null, revenue: { $sum: "$amount" }, orders: { $sum: 1 } } },
      ]),

      /* Unique buyers (distinct users with a completed order) */
      Order.aggregate([
        { $match: { paymentStatus: "completed" } },
        { $group: { _id: "$user" } },
        { $count: "count" },
      ]),

      /* Monthly revenue + order count for last 12 months */
      Order.aggregate([
        { $match: { paymentStatus: "completed", createdAt: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            revenue: { $sum: "$amount" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      /* Top 10 products by revenue */
      Order.aggregate([
        { $match: { paymentStatus: "completed" } },
        {
          $group: {
            _id: "$resource",
            revenue: { $sum: "$amount" },
            sales: { $sum: 1 },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "resources",
            localField: "_id",
            foreignField: "_id",
            as: "info",
          },
        },
        { $unwind: { path: "$info", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            revenue: 1,
            sales: 1,
            title: "$info.title",
            subject: "$info.subject",
            grade: "$info.grade",
            price: "$info.price",
          },
        },
      ]),

      /* Revenue + order count grouped by subject */
      Order.aggregate([
        { $match: { paymentStatus: "completed" } },
        {
          $lookup: {
            from: "resources",
            localField: "resource",
            foreignField: "_id",
            as: "info",
          },
        },
        { $unwind: { path: "$info", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$info.subject",
            revenue: { $sum: "$amount" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { revenue: -1 } },
      ]),

      /* 15 most recent completed orders */
      Order.find({ paymentStatus: "completed" })
        .sort({ createdAt: -1 })
        .limit(15)
        .populate<{ user: { name: string; email: string } }>("user", "name email")
        .populate<{ resource: { title: string; subject: string; grade: number } }>(
          "resource",
          "title subject grade"
        )
        .lean(),

      /* Total published resources (for context) */
      Resource.countDocuments({ isPublished: true }),
    ]);

    /* Fill in all 12 months so the chart has no gaps */
    const monthlyMap = new Map<string, { revenue: number; orders: number }>();
    for (const entry of monthlyAgg) {
      monthlyMap.set(entry._id as string, { revenue: entry.revenue, orders: entry.orders });
    }
    const monthly: { month: string; revenue: number; orders: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const found = monthlyMap.get(key);
      monthly.push({ month: key, revenue: found?.revenue ?? 0, orders: found?.orders ?? 0 });
    }

    const totalRevenue   = (overallAgg[0]?.revenue ?? 0) as number;
    const totalOrders    = (overallAgg[0]?.orders  ?? 0) as number;
    const avgOrderValue  = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const uniqueBuyers   = (uniqueBuyersAgg[0]?.count ?? 0) as number;
    const revenueThisMonth  = (thisMonthAgg[0]?.revenue  ?? 0) as number;
    const ordersThisMonth   = (thisMonthAgg[0]?.orders   ?? 0) as number;
    const revenueLastMonth  = (lastMonthAgg[0]?.revenue  ?? 0) as number;
    const ordersLastMonth   = (lastMonthAgg[0]?.orders   ?? 0) as number;

    return NextResponse.json({
      success: true,
      overview: {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        uniqueBuyers,
        revenueThisMonth,
        ordersThisMonth,
        revenueLastMonth,
        ordersLastMonth,
        totalPublishedResources,
      },
      monthly,
      topProducts: topProductsAgg.map((p) => ({
        _id: String(p._id),
        title:   (p.title   as string | undefined) ?? "Deleted Resource",
        subject: (p.subject as string | undefined) ?? "—",
        grade:   (p.grade   as number | undefined) ?? null,
        price:   (p.price   as number | undefined) ?? 0,
        sales:   p.sales   as number,
        revenue: p.revenue as number,
      })),
      bySubject: bySubjectAgg.map((s) => ({
        subject: (s._id as string | null) ?? "Unknown",
        revenue: s.revenue as number,
        orders:  s.orders  as number,
      })),
      recentOrders: recentOrders.map((o) => {
        const u = o.user     as unknown as { name: string; email: string } | null;
        const r = o.resource as unknown as { title: string; subject: string; grade: number } | null;
        return {
          _id:           String(o._id),
          userName:      u?.name    ?? "Unknown",
          userEmail:     u?.email   ?? "",
          resourceTitle: r?.title   ?? "Deleted Resource",
          subject:       r?.subject ?? "—",
          grade:         r?.grade   ?? null,
          amount:        o.amount,
          paymentMethod: o.paymentMethod ?? "manual",
          createdAt:     (o.createdAt as Date).toISOString(),
        };
      }),
    });
  } catch (err) {
    console.error("[GET /api/admin/analytics]", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch analytics data." },
      { status: 500 }
    );
  }
}
