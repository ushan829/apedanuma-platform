import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-cookie";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { updateProfileSchema } from "@/lib/validations/user";

export async function PATCH(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Not authenticated." }, { status: 401 });
  }

  let jsonBody: unknown;
  try {
    jsonBody = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const result = updateProfileSchema.safeParse(jsonBody);

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

  const { name, currentPassword, newPassword } = result.data;
  const hasNameUpdate     = !!name;
  const hasPasswordUpdate = !!newPassword;

  if (!hasNameUpdate && !hasPasswordUpdate) {
    return NextResponse.json({ success: false, message: "Nothing to update." }, { status: 400 });
  }

  try {
    await connectToDatabase();

    if (hasPasswordUpdate) {
      // Fetch with password field (select: false by default)
      const userWithPw = await User.findById(session.sub).select("+password");
      if (!userWithPw) {
        return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
      }
      const isMatch = await userWithPw.comparePassword(currentPassword!);
      if (!isMatch) {
        return NextResponse.json({ success: false, message: "Current password is incorrect." }, { status: 400 });
      }
      if (hasNameUpdate) userWithPw.name = name!;
      userWithPw.password = newPassword!;  // pre-save hook hashes it
      await userWithPw.save();
    } else {
      // Name-only update
      await User.findByIdAndUpdate(session.sub, { name });
    }

    return NextResponse.json({ success: true, message: "Profile updated." });
  } catch (err) {
    console.error("[PATCH /api/auth/me/update]", err);
    return NextResponse.json({ success: false, message: "Failed to update profile." }, { status: 500 });
  }
}
