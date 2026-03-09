import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-cookie";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  /* 1. Verify session cookie ───────────────────────────────────────────── */
  const session = getSession(req);
  if (!session) {
    // Not authenticated
    return NextResponse.json({ status: "not-purchased" }, { status: 200 });
  }

  /* 2. Check Order paymentStatus ───────────────────────────────────────── */
  try {
    await connectToDatabase();
    
    // Find the most recent order for this user and resource
    const order = await Order.findOne({
      user: session.sub,
      resource: params.id,
    }).sort({ createdAt: -1 }).select("paymentStatus").lean();

    if (!order) {
      return NextResponse.json({ status: "not-purchased" });
    }

    return NextResponse.json({ status: order.paymentStatus });
  } catch {
    return NextResponse.json({ status: "not-purchased" });
  }
}
