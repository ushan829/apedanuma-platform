import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-cookie";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Not authenticated." }, { status: 401 });
  }

  let body: { name?: string; currentPassword?: string; newPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const { name, currentPassword, newPassword } = body;
  const hasNameUpdate     = typeof name === "string" && name.trim().length > 0;
  const hasPasswordUpdate = typeof newPassword === "string" && newPassword.length > 0;

  if (!hasNameUpdate && !hasPasswordUpdate) {
    return NextResponse.json({ success: false, message: "Nothing to update." }, { status: 400 });
  }

  if (hasNameUpdate && name!.trim().length < 2) {
    return NextResponse.json({ success: false, message: "Name must be at least 2 characters." }, { status: 400 });
  }
  if (hasNameUpdate && name!.trim().length > 80) {
    return NextResponse.json({ success: false, message: "Name cannot exceed 80 characters." }, { status: 400 });
  }
  if (hasPasswordUpdate && newPassword!.length < 8) {
    return NextResponse.json({ success: false, message: "New password must be at least 8 characters." }, { status: 400 });
  }

  try {
    await connectToDatabase();

    if (hasPasswordUpdate) {
      if (!currentPassword) {
        return NextResponse.json({ success: false, message: "Current password is required to set a new password." }, { status: 400 });
      }
      // Fetch with password field (select: false by default)
      const userWithPw = await User.findById(session.sub).select("+password");
      if (!userWithPw) {
        return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
      }
      const isMatch = await userWithPw.comparePassword(currentPassword);
      if (!isMatch) {
        return NextResponse.json({ success: false, message: "Current password is incorrect." }, { status: 400 });
      }
      if (hasNameUpdate) userWithPw.name = name!.trim();
      userWithPw.password = newPassword!;  // pre-save hook hashes it
      await userWithPw.save();
    } else {
      // Name-only update
      await User.findByIdAndUpdate(session.sub, { name: name!.trim() });
    }

    return NextResponse.json({ success: true, message: "Profile updated." });
  } catch (err) {
    console.error("[PATCH /api/auth/me/update]", err);
    return NextResponse.json({ success: false, message: "Failed to update profile." }, { status: 500 });
  }
}
