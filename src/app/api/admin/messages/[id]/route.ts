import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, authError } from "@/lib/admin-auth";
import connectToDatabase from "@/lib/mongodb";
import Message from "@/models/Message";

/* ─────────────────────────────────────────
   PATCH /api/admin/messages/[id]
   Toggles the isRead status of a message.
   ───────────────────────────────────────── */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    verifyAdminToken(req);
  } catch (err) {
    const { message, status } = authError(err);
    return NextResponse.json({ success: false, message }, { status });
  }

  try {
    await connectToDatabase();
    const message = await Message.findById(params.id);

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message not found." },
        { status: 404 }
      );
    }

    message.isRead = !message.isRead;
    await message.save();

    return NextResponse.json({ success: true, isRead: message.isRead });
  } catch (error) {
    console.error("[PATCH /api/admin/messages]", error);
    return NextResponse.json(
      { success: false, message: "Failed to update message." },
      { status: 500 }
    );
  }
}

/* ─────────────────────────────────────────
   DELETE /api/admin/messages/[id]
   Permanently deletes a message.
   ───────────────────────────────────────── */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    verifyAdminToken(req);
  } catch (err) {
    const { message, status } = authError(err);
    return NextResponse.json({ success: false, message }, { status });
  }

  try {
    await connectToDatabase();
    const deleted = await Message.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Message not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Message deleted." });
  } catch (error) {
    console.error("[DELETE /api/admin/messages]", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete message." },
      { status: 500 }
    );
  }
}
