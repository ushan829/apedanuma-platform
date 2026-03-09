import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-cookie";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  /* 1. Verify session cookie ───────────────────────────────────────────── */
  const session = getSession(req);
  if (!session) {
    // Not authenticated — cannot have purchased anything
    return NextResponse.json({ hasPurchased: false }, { status: 200 });
  }

  /* 2. Check User.purchasedResources ───────────────────────────────────── */
  try {
    await connectToDatabase();
    const user = await User.findById(session.sub)
      .select("purchasedResources")
      .lean();

    if (!user) return NextResponse.json({ hasPurchased: false });

    const purchased = (user.purchasedResources as unknown[]) ?? [];
    const hasPurchased = purchased.some(
      (id) => String(id) === params.id
    );

    return NextResponse.json({ hasPurchased });
  } catch {
    return NextResponse.json({ hasPurchased: false });
  }
}
