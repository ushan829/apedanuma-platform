import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, authError } from "@/lib/admin-auth";
import connectToDatabase from "@/lib/mongodb";
import Message from "@/models/Message";

/* ─────────────────────────────────────────
   GET /api/admin/messages
   Returns all messages sorted newest first.
   ───────────────────────────────────────── */
export async function GET(req: NextRequest) {
  try {
    verifyAdminToken(req);
  } catch (err) {
    const { message, status } = authError(err);
    return NextResponse.json({ success: false, message }, { status });
  }

  try {
    await connectToDatabase();
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("[GET /api/admin/messages]", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch messages." },
      { status: 500 }
    );
  }
}
