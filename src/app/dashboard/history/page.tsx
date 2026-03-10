import Link from "next/link";
import { getSubjectStyle } from "@/lib/free-resources";
import { getServerSession } from "@/lib/auth-cookie";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import "@/models/Resource"; // Ensure Resource model is registered for populate
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type PurchasedResource = {
  _id: string;
  title: string;
  subject: string;
  grade: number;
  materialType: string;
  description: string;
  pageCount: number | null;
  fileSize: string | null;
};

function ResourceCard({ resource }: { resource: PurchasedResource }) {
  const s = getSubjectStyle(resource.subject);
  return (
    <div
      className="relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
    >
      <div
        className="relative h-[64px] flex items-end justify-between px-4 pb-3 shrink-0"
        style={{ background: `linear-gradient(135deg, ${s.bg.replace(/[\d.]+\)$/, "0.35)")} 0%, rgba(10,10,10,0.9) 100%)`, borderBottom: `1px solid ${s.border}` }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
        <span className="relative z-10 text-[0.62rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
          style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
          {resource.subject}
        </span>
        <span className="relative z-10 text-[0.58rem] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
          Grade {resource.grade}
        </span>
      </div>
      <div className="flex flex-col gap-3 p-4 flex-1">
        <div>
          <h3 className="font-display font-semibold text-sm leading-snug" style={{ color: "var(--foreground)" }}>{resource.title}</h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[0.6rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
              style={{ background: "rgba(255,255,255,0.06)", color: "var(--foreground-muted)", border: "1px solid rgba(255,255,255,0.09)" }}>
              {resource.materialType}
            </span>
            {resource.pageCount && <span className="text-[0.62rem]" style={{ color: "var(--foreground-muted)" }}>{resource.pageCount} pages</span>}
            {resource.fileSize && <span className="text-[0.62rem]" style={{ color: "var(--foreground-muted)" }}>{resource.fileSize}</span>}
          </div>
        </div>
        {resource.description && (
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--foreground-muted)" }}>
            {resource.description}
          </p>
        )}
        <a
          href={`/api/download/premium/${resource._id}`}
          download
          className="relative mt-auto flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-sm font-bold overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #7c1fff 0%, #9455ff 55%, #7c1fff 100%)",
            backgroundSize: "200% auto",
            boxShadow: "0 0 20px rgba(124,31,255,0.3), 0 4px 12px rgba(0,0,0,0.3)",
            color: "#fff", textDecoration: "none",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M6.5 1v8M4 6.5l2.5 3 2.5-3M1 11h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Download PDF
        </a>
      </div>
    </div>
  );
}

export default async function HistoryPage() {
  const session = getServerSession();
  if (!session) {
    redirect("/login");
  }

  await connectToDatabase();
  const user = await User.findById(session.sub)
    .populate({
      path: "purchasedResources",
      match: { isPublished: true },
    })
    .lean();

  if (!user) {
    redirect("/login");
  }

  const completedOrders = await Order.find({
    user: session.sub,
    paymentStatus: "completed"
  }).populate({
    path: "resource",
    match: { isPublished: true },
  }).lean();

  const orderResources = completedOrders
    .map(o => o.resource)
    .filter(Boolean) as unknown as PurchasedResource[];

  const userResources = (user.purchasedResources as unknown as PurchasedResource[] || [])
    .filter(Boolean);

  const allResourcesMap = new Map();
  [...userResources, ...orderResources].forEach((r) => {
    if (r && r._id) allResourcesMap.set(String(r._id), r);
  });

  const purchased = Array.from(allResourcesMap.values());

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[0.7rem] font-bold uppercase tracking-widest" style={{ color: "#9455ff" }}>Library</span>
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: "var(--foreground)" }}>My Library</h1>
        <p className="text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>
          {purchased.length > 0
            ? `${purchased.length} purchased PDF${purchased.length !== 1 ? "s" : ""} — download any time, on any device.`
            : "Your purchased premium PDFs will appear here."}
        </p>
      </div>

      {purchased.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
            style={{ background: "rgba(124,31,255,0.07)", border: "1px solid rgba(124,31,255,0.16)" }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ color: "#9455ff" }}>
              <path d="M8 4h13l7 7v21H8V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M21 4v7h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 16h10M13 21h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="font-display font-bold text-xl mb-2" style={{ color: "var(--foreground)" }}>Your Library is Empty</h3>
          <p className="text-sm max-w-xs leading-relaxed mb-6" style={{ color: "var(--foreground-muted)" }}>
            Purchase premium study packs to unlock them here. Download any time, anywhere.
          </p>
          <Link href="/premium-store"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #7c1fff 0%, #9455ff 55%, #7c1fff 100%)", boxShadow: "0 0 20px rgba(124,31,255,0.35)", color: "#fff", textDecoration: "none" }}>
            Browse Premium Store
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {purchased.map((r) => <ResourceCard key={r._id} resource={r} />)}
          </div>
          <div className="rounded-2xl p-6 text-center"
            style={{ background: "rgba(124,31,255,0.06)", border: "1px dashed rgba(124,31,255,0.2)" }}>
            <p className="text-sm mb-3" style={{ color: "var(--foreground-muted)" }}>Want to unlock more subjects?</p>
            <Link href="/premium-store"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[#b890ff]"
              style={{ color: "#9455ff", textDecoration: "none" }}>
              Browse the Premium Store →
            </Link>
          </div>
        </>
      )}

      {/* Free resources note */}
      <div className="rounded-2xl p-5 flex items-start gap-4"
        style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.12)" }}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
          style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "#fbbf24" }}>
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3" />
            <path d="M7 4v4M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--foreground)" }}>Free Resources</p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
            Free resource downloads are available directly on the{" "}
            <Link href="/free-resources" className="font-semibold hover:text-[#fde68a]" style={{ color: "#fbbf24", textDecoration: "none" }}>
              Free Resources page
            </Link>{" "}
            — no account required.
          </p>
        </div>
      </div>
    </div>
  );
}
