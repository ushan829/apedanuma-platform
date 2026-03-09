/* ─────────────────────────────────────────
   PremiumStoreSection — Server Component
   ───────────────────────────────────────── */

interface Feature {
  text: string;
}

interface Pack {
  id: string;
  name: string;
  subject: string;
  price: number;
  originalPrice?: number;
  featured: boolean;
  badge?: string;
  tagline: string;
  features: Feature[];
  icon: string;
  accentColor: string;
}

const PACKS: Pack[] = [
  {
    id: "math",
    name: "O/L Mathematics Masterclass",
    subject: "Mathematics",
    price: 1490,
    originalPrice: 2200,
    featured: false,
    tagline: "From foundations to full marks",
    icon: "∑",
    accentColor: "arcane",
    features: [
      { text: "Complete 2025 Syllabus Coverage" },
      { text: "300+ Worked Examples" },
      { text: "Model Paper Answers (2018–2024)" },
      { text: "Chapter Summary Sheets" },
      { text: "Instant PDF Download" },
      { text: "Free Updates Included" },
    ],
  },
  {
    id: "bundle",
    name: "Complete O/L Bundle",
    subject: "All 9 Core Subjects",
    price: 3990,
    originalPrice: 7800,
    featured: true,
    badge: "Most Popular",
    tagline: "Everything you need — one bundle",
    icon: "◈",
    accentColor: "gold",
    features: [
      { text: "All 9 Core Subject Packs" },
      { text: "1,200+ Pages of Premium Notes" },
      { text: "Model Answers & Marking Schemes" },
      { text: "24/7 Discord Study Community" },
      { text: "Monthly Q&A with Educators" },
      { text: "Lifetime Access & Free Updates" },
      { text: "Certificate of Completion" },
    ],
  },
  {
    id: "science",
    name: "O/L Science Elite Pack",
    subject: "Combined Science",
    price: 1490,
    originalPrice: 2200,
    featured: false,
    tagline: "Biology, Chemistry & Physics unified",
    icon: "⬡",
    accentColor: "arcane",
    features: [
      { text: "Full Biology, Chemistry & Physics" },
      { text: "Diagram-Rich Illustrated Notes" },
      { text: "Practical Lab Notes & Tips" },
      { text: "MCQ Bank (500+ Questions)" },
      { text: "Essay Answer Templates" },
      { text: "Instant PDF Download" },
    ],
  },
];

function FeatureCheck() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, marginTop: "1px" }}
    >
      <circle cx="7" cy="7" r="6.5" fill="rgba(124,31,255,0.15)" stroke="rgba(124,31,255,0.35)" strokeWidth="1" />
      <path d="M4.5 7l1.8 1.8L9.5 5.2" stroke="#9455ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeatureCheckGold() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, marginTop: "1px" }}
    >
      <circle cx="7" cy="7" r="6.5" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
      <path d="M4.5 7l1.8 1.8L9.5 5.2" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PackCard({ pack }: { pack: Pack }) {
  const isGold = pack.featured;

  return (
    <div className={`premium-card ${isGold ? "premium-card-featured" : ""} h-full`}>
      {/* Most Popular banner */}
      {pack.badge && (
        <div className="premium-banner">{pack.badge}</div>
      )}

      {/* Card body */}
      <div className="relative z-10 flex flex-col h-full p-8">

        {/* Icon + subject */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl text-xl font-bold font-display"
            style={{
              background: isGold
                ? "rgba(245,158,11,0.12)"
                : "rgba(124,31,255,0.12)",
              border: `1px solid ${isGold ? "rgba(245,158,11,0.28)" : "rgba(124,31,255,0.28)"}`,
              color: isGold ? "#f59e0b" : "#9455ff",
            }}
          >
            {pack.icon}
          </div>
          <div>
            <div
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: isGold ? "rgba(245,158,11,0.75)" : "rgba(148,85,255,0.75)" }}
            >
              {pack.subject}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>
              {pack.tagline}
            </div>
          </div>
        </div>

        {/* Pack name */}
        <h3
          className="font-display font-bold text-xl leading-snug mb-5"
          style={{ color: "var(--foreground)" }}
        >
          {pack.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-end gap-3 mb-6">
          <div className="flex items-start gap-1">
            <span
              className="text-sm font-semibold mt-1"
              style={{ color: isGold ? "#f59e0b" : "#9455ff" }}
            >
              LKR
            </span>
            <span
              className="text-4xl font-bold font-display leading-none"
              style={{ color: "var(--foreground)" }}
            >
              {pack.price.toLocaleString()}
            </span>
          </div>
          {pack.originalPrice && (
            <div className="mb-1">
              <span
                className="text-sm line-through"
                style={{ color: "var(--foreground-muted)" }}
              >
                LKR {pack.originalPrice.toLocaleString()}
              </span>
              <div
                className="text-xs font-semibold"
                style={{ color: isGold ? "#f59e0b" : "#9455ff" }}
              >
                {Math.round((1 - pack.price / pack.originalPrice!) * 100)}% off
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          className="mb-6 h-px w-full"
          style={{
            background: isGold
              ? "linear-gradient(90deg, transparent, rgba(245,158,11,0.25), transparent)"
              : "linear-gradient(90deg, transparent, rgba(124,31,255,0.2), transparent)",
          }}
        />

        {/* Features list */}
        <ul className="flex flex-col gap-3 mb-8 flex-1">
          {pack.features.map((f) => (
            <li key={f.text} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--foreground-secondary)" }}>
              {isGold ? <FeatureCheckGold /> : <FeatureCheck />}
              <span>{f.text}</span>
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 mt-auto">
          <a href="#" className="btn-preview w-full text-center">
            Preview Notes
          </a>
          <a href="#" className={`${isGold ? "btn-buy-now-gold" : "btn-buy-now"} w-full text-center`}>
            Buy Now
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PremiumStoreSection() {
  return (
    <section className="section-lg z-10 relative" id="premium-store">
      {/* Ambient background glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/4 top-0 rounded-full"
          style={{
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(124,31,255,0.07) 0%, transparent 70%)",
            filter: "blur(80px)",
            transform: "translateX(-50%)",
          }}
        />
        <div
          className="absolute right-1/4 bottom-0 rounded-full"
          style={{
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
            filter: "blur(80px)",
            transform: "translateX(50%)",
          }}
        />
      </div>

      <div className="container-xl relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <div className="badge-gold mx-auto w-fit">Premium Collection</div>
          <h2 className="text-balance">
            Invest in your{" "}
            <span className="text-gradient-luminary">O/L success</span>
          </h2>
          <p className="max-w-xl mx-auto text-base" style={{ color: "var(--foreground-secondary)" }}>
            Handcrafted study packs built for Sri Lanka&apos;s O/L English Medium curriculum —
            complete, precise, and worth every rupee.
          </p>
        </div>

        {/* Pack grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PACKS.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>

        {/* Trust strip */}
        <div
          className="mt-14 flex flex-wrap justify-center items-center gap-8 text-sm"
          style={{ color: "var(--foreground-muted)" }}
        >
          {[
            { icon: "🔒", label: "Secure Checkout" },
            { icon: "📥", label: "Instant Download" },
            { icon: "♻️", label: "Free Lifetime Updates" },
            { icon: "💬", label: "24/7 Support" },
          ].map((t) => (
            <div key={t.label} className="flex items-center gap-2">
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
