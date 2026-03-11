import Link from "next/link";
import { getServerSession } from "@/lib/auth-cookie";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { redirect } from "next/navigation";
import SidebarNav from "./SidebarNav";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = getServerSession();
  if (!session) {
    redirect("/login");
  }

  await connectToDatabase();
  const user = await User.findById(session.sub).select("name role").lean();

  if (!user) {
    redirect("/login");
  }

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="relative min-h-[calc(100vh-68px)] flex overflow-hidden">
      {/* Ambient glows */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-0 left-1/4 rounded-full"
          style={{
            width: 700, height: 600,
            background: "radial-gradient(circle, rgba(124,31,255,0.07) 0%, transparent 65%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 rounded-full"
          style={{
            width: 500, height: 500,
            background: "radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* ── Sidebar (desktop) ── */}
      <aside
        className="hidden lg:flex flex-col shrink-0 sticky top-0 h-[calc(100vh-68px)]"
        style={{
          width: 228,
          borderRight: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(10,10,10,0.6)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Avatar + name */}
        <div className="px-5 pt-7 pb-5">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 font-display font-bold text-sm"
              style={{
                background: "linear-gradient(135deg, rgba(124,31,255,0.35), rgba(87,0,190,0.5))",
                border: "1px solid rgba(124,31,255,0.4)",
                color: "#c4a0ff",
              }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>
                {user.name}
              </p>
              <p className="text-[0.65rem] capitalize" style={{ color: "var(--foreground-muted)" }}>
                {user.role ?? "student"}
              </p>
            </div>
          </div>
        </div>

        <div className="mx-5 h-px mb-4" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* Nav Client Component */}
        <SidebarNav type="desktop" />

        {/* Back to site */}
        <div className="p-4 mt-auto">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium w-full transition-all duration-200 hover:bg-white/[0.04]"
            style={{ color: "var(--foreground-muted)", border: "1px solid rgba(255,255,255,0.06)", textDecoration: "none" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M8 2L3 7l5 5M3 7h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Site
          </Link>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile tab bar Client Component */}
        <SidebarNav type="mobile" />

        <div className="px-6 lg:px-12 py-8 xl:py-10 max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
