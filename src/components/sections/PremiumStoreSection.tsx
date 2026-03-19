import { PACKS, type Pack } from "@/lib/premium-packs";

function FeatureCheck() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="shrink-0 mt-[1px]"
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
      className="shrink-0 mt-[1px]"
    >
      <circle cx="7" cy="7" r="6.5" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
      <path d="M4.5 7l1.8 1.8L9.5 5.2" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PackCard({ pack }: { pack: Pack }) {
  const isGold = pack.featured;

  return (
    <div className={`relative flex flex-col h-full rounded-[1.5rem] overflow-hidden bg-white/5 backdrop-blur-2xl border ${isGold ? "border-amber-500/40 shadow-[0_20px_64px_rgba(0,0,0,0.5),0_0_30px_rgba(245,158,11,0.15)]" : "border-white/10 shadow-2xl"} transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] group`}>
      {/* Most Popular banner */}
      {pack.badge && (
        <div className="flex items-center justify-center py-2.5 font-display text-[0.65rem] font-black uppercase tracking-[0.2em] text-amber-400 bg-amber-500/10 border-b border-amber-500/20">
          {pack.badge}
        </div>
      )}

      {/* Card body */}
      <div className="relative z-10 flex flex-col h-full p-8">

        {/* Icon + subject */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-xl text-xl font-bold font-display border transition-transform duration-500 group-hover:scale-110 ${
              isGold
                ? "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                : "bg-purple-500/10 border-purple-500/30 text-purple-500"
            }`}
          >
            {pack.icon}
          </div>
          <div>
            <div
              className={`text-[0.65rem] font-bold uppercase tracking-[0.15em] ${
                isGold ? "text-amber-500/80" : "text-purple-400/80"
              }`}
            >
              {pack.subject}
            </div>
            <div className="text-xs mt-0.5 text-slate-400">
              {pack.tagline}
            </div>
          </div>
        </div>

        {/* Pack name */}
        <h3 className="font-display font-bold text-xl leading-snug mb-5 text-white">
          {pack.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-end gap-3 mb-6">
          <div className="flex items-start gap-1">
            <span
              className={`text-sm font-semibold mt-1 ${
                isGold ? "text-amber-500" : "text-purple-400"
              }`}
            >
              LKR
            </span>
            <span className="text-4xl font-bold font-display leading-none text-white">
              {pack.price.toLocaleString()}
            </span>
          </div>
          {pack.originalPrice && (
            <div className="mb-1">
              <span className="text-sm line-through text-slate-500">
                LKR {pack.originalPrice.toLocaleString()}
              </span>
              <div
                className={`text-[0.65rem] font-black uppercase tracking-wider ${
                  isGold ? "text-amber-500" : "text-purple-400"
                }`}
              >
                {Math.round((1 - pack.price / pack.originalPrice!) * 100)}% off
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          className={`mb-6 h-px w-full ${
            isGold
              ? "bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"
              : "bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
          }`}
        />

        {/* Features list */}
        <ul className="flex flex-col gap-3 mb-8 flex-1">
          {pack.features.map((f) => (
            <li key={f.text} className="flex items-start gap-2.5 text-sm text-slate-300">
              {isGold ? <FeatureCheckGold /> : <FeatureCheck />}
              <span>{f.text}</span>
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 mt-auto">
          <a 
            href="#" 
            className="flex items-center justify-center gap-2 font-display font-bold text-xs uppercase tracking-wider py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all duration-300 hover:text-white hover:bg-white/10 hover:border-white/20"
          >
            Preview Notes
          </a>
          <a 
            href="#" 
            className={`flex items-center justify-center gap-2 font-display font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all duration-300 shadow-lg ${
              isGold 
                ? "bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5" 
                : "bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5"
            }`}
          >
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
          className="absolute left-1/4 top-0 rounded-full w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(124,31,255,0.07)_0%,transparent_70%)] blur-[80px] -translate-x-1/2"
        />
        <div
          className="absolute right-1/4 bottom-0 rounded-full w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(245,158,11,0.06)_0%,transparent_70%)] blur-[80px] translate-x-1/2"
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
          <p className="max-w-xl mx-auto text-base text-foreground-secondary">
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
        <div className="mt-14 flex flex-wrap justify-center items-center gap-8 text-sm text-foreground-muted">
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
