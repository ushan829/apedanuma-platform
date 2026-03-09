import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Message from "@/models/Message";

/* ─────────────────────────────────────────
   POST /api/contact
   Public endpoint — no auth required.
   ───────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = body as Record<string, unknown>;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ success: false, message: "Name is required." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ success: false, message: "A valid email address is required." }, { status: 400 });
    }
    if (!subject || typeof subject !== "string" || !subject.trim()) {
      return NextResponse.json({ success: false, message: "Subject is required." }, { status: 400 });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ success: false, message: "Message is required." }, { status: 400 });
    }

    await connectToDatabase();

    await Message.create({
      name: (name as string).trim(),
      email: (email as string).trim().toLowerCase(),
      subject: (subject as string).trim(),
      message: (message as string).trim(),
    });

    return NextResponse.json(
      { success: true, message: "Message sent successfully." },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[POST /api/contact]", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
