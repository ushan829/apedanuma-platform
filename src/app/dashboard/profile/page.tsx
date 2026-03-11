import { getServerSession } from "@/lib/auth-cookie";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { redirect } from "next/navigation";
import ProfileForms from "./ProfileForms";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = getServerSession();
  if (!session) {
    redirect("/login");
  }

  await connectToDatabase();
  const user = await User.findById(session.sub).select("name email role createdAt").lean();

  if (!user) {
    redirect("/login");
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt as Date).toLocaleDateString("en-US", { month: "long", year: "numeric", day: "numeric" })
    : "—";

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <span className="text-[0.7rem] font-bold uppercase tracking-widest" style={{ color: "#9455ff" }}>Account</span>
        <h1 className="font-display font-bold text-2xl sm:text-3xl mt-1" style={{ color: "var(--foreground)" }}>Profile Settings</h1>
        <p className="text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>Manage your account details and security.</p>
      </div>

      {/* Read-only info card */}
      <div className="rounded-2xl p-5 flex items-center gap-4"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div
          className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 font-display font-bold text-lg"
          style={{ background: "linear-gradient(135deg, rgba(124,31,255,0.35), rgba(87,0,190,0.5))", border: "1px solid rgba(124,31,255,0.4)", color: "#c4a0ff" }}
        >
          {user.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "…"}
        </div>
        <div className="min-w-0">
          <p className="font-semibold truncate" style={{ color: "var(--foreground)" }}>{user.name}</p>
          <p className="text-sm truncate mt-0.5" style={{ color: "var(--foreground-muted)" }}>{user.email}</p>
          <p className="text-xs mt-1" style={{ color: "var(--foreground-muted)" }}>Member since {memberSince}</p>
        </div>
      </div>

      {/* Email notice */}
      <div className="rounded-xl px-4 py-3 flex items-start gap-3"
        style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.18)" }}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="mt-0.5 shrink-0" style={{ color: "#818cf8" }}>
          <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M7.5 4v4M7.5 9.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <p className="text-xs leading-relaxed" style={{ color: "#a5b4fc" }}>
          Email address changes are not supported at this time to protect your account security.
        </p>
      </div>

      <ProfileForms initialName={user.name as string} />
    </div>
  );
}
