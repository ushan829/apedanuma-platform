import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import { subscribeSchema } from "@/lib/validations/user";

/** POST /api/subscribe — add an email to the newsletter list */
export async function POST(req: NextRequest) {
  let jsonBody: unknown;
  try {
    jsonBody = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const result = subscribeSchema.safeParse(jsonBody);

  if (!result.success) {
    return NextResponse.json(
      { 
        success: false, 
        message: result.error.issues[0].message,
        errors: result.error.flatten().fieldErrors 
      },
      { status: 400 }
    );
  }

  const { email } = result.data;

  try {
    await connectToDatabase();
    await Subscriber.create({ email });
    return NextResponse.json({ success: true, message: "Subscribed successfully!" }, { status: 201 });
  } catch (err) {
    const mongoErr = err as { code?: number };
    if (mongoErr.code === 11000) {
      // Already subscribed — treat as success so we don't leak info
      return NextResponse.json({ success: true, message: "You're already subscribed!" });
    }
    console.error("[POST /api/subscribe]", err);
    return NextResponse.json({ success: false, message: "Could not subscribe. Try again." }, { status: 500 });
  }
}
