import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Message from "@/models/Message";
import { contactSchema } from "@/lib/validations/user";

/* ─────────────────────────────────────────
   POST /api/contact
   Public endpoint — no auth required.
   ───────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    let jsonBody: unknown;
    try {
      jsonBody = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 }
      );
    }

    const result = contactSchema.safeParse(jsonBody);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: result.error.errors[0].message,
          errors: result.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;

    await connectToDatabase();

    await Message.create({
      name,
      email,
      subject,
      message,
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
