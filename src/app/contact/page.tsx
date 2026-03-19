import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Ape Danuma team. We're here to help with any questions about our study materials or platform.",
};

/* ─────────────────────────────────────────
   Contact info card
   ───────────────────────────────────────── */
function InfoCard({
  icon,
  title,
  lines,
  accentColor,
  accentBg,
  accentBorder,
}: {
  icon: React.ReactNode;
  title: string;
  lines: { label?: string; value: string }[];
  accentColor: string;
  accentBg: string;
  accentBorder: string;
}) {
  return (
    <div
      className="relative flex items-start gap-4 rounded-2xl p-5 transition-all duration-300 bg-white/[0.03] border border-white/[0.07] shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
    >
      {/* Top-edge highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-px rounded-t-2xl pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}44 40%, ${accentColor}22 60%, transparent)`,
        }}
      />

      {/* Icon */}
      <div
        className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
        style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p className="text-sm font-semibold mb-1.5 text-foreground">
          {title}
        </p>
        {lines.map((line, i) => (
          <div key={i}>
            {line.label && (
              <p className="text-[0.65rem] uppercase tracking-widest font-semibold mb-0.5 text-foreground-muted">
                {line.label}
              </p>
            )}
            <p className="text-sm text-foreground-secondary">
              {line.value}
            </p>
          </div>
        ))}
      </div>

      {/* Corner glow */}
      <div
        className="absolute top-0 right-0 rounded-full pointer-events-none w-20 h-20 blur-2xl"
        style={{
          background: `radial-gradient(circle, ${accentColor}10 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   Page
   ───────────────────────────────────────── */
export default function ContactPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Ambient glows */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 rounded-full w-[700px] h-[600px] bg-[radial-gradient(circle,rgba(124,31,255,0.08)_0%,transparent_70%)] blur-[90px]"
        />
        <div
          className="absolute bottom-0 right-1/4 rounded-full w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(245,158,11,0.05)_0%,transparent_70%)] blur-[100px]"
        />
      </div>

      <div className="container-xl py-16 sm:py-20">

        {/* ── Page header ── */}
        <header className="mb-14 space-y-4 text-center">
          <div className="badge-accent mx-auto w-fit">Contact</div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-balance">
            Get in{" "}
            <span className="text-gradient-arcane">Touch</span>
          </h1>
          <p
            className="max-w-lg mx-auto text-base sm:text-lg leading-relaxed text-foreground-secondary"
          >
            Have a question about our study materials, a technical issue, or feedback?
            We&apos;d love to hear from you — our team responds within 24 hours.
          </p>
        </header>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 xl:gap-12 items-start">

          {/* ── Left — Contact info ── */}
          <div className="flex flex-col gap-5">

            {/* Email */}
            <InfoCard
              title="Email Us"
              accentColor="#9455ff"
              accentBg="rgba(124,31,255,0.12)"
              accentBorder="rgba(124,31,255,0.28)"
              lines={[
                { label: "General enquiries", value: "support@apedanuma.lk" },
                { label: "Content & resources", value: "content@apedanuma.lk" },
              ]}
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="text-arcane-400">
                  <rect x="2" y="4" width="16" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M2 7l7.47 4.67a1 1 0 001.06 0L18 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              }
            />

            {/* WhatsApp */}
            <InfoCard
              title="WhatsApp"
              accentColor="#34d399"
              accentBg="rgba(16,185,129,0.1)"
              accentBorder="rgba(16,185,129,0.26)"
              lines={[
                { label: "Support line", value: "+94 77 000 0000" },
                { value: "Available during working hours for quick queries." },
              ]}
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="text-emerald-400">
                  <path d="M10 2a8 8 0 00-6.93 12.02L2 18l4.12-1.05A8 8 0 1010 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M7.5 8.5c.5 1 1.5 2.5 3 3l1-.8c.3-.24.7-.22.97.06l.9.9a.75.75 0 010 1.06C12.5 13.6 11 14 9.5 13c-1.5-1-3-3.5-3-5 0-1 .9-1.8 1.5-2 .3-.1.6.05.72.34l.28.66a.75.75 0 01-.17.82L7.5 8.5z" fill="currentColor" opacity="0.7" />
                </svg>
              }
            />

            {/* Working Hours */}
            <InfoCard
              title="Working Hours"
              accentColor="#fbbf24"
              accentBg="rgba(245,158,11,0.1)"
              accentBorder="rgba(245,158,11,0.26)"
              lines={[
                { label: "Monday – Friday", value: "8:00 AM – 6:00 PM (IST)" },
                { label: "Saturday", value: "9:00 AM – 1:00 PM (IST)" },
                { label: "Sunday & Public Holidays", value: "Closed" },
              ]}
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="text-luminary-400">
                  <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />

            {/* Social / quick note */}
            <div
              className="rounded-2xl p-5 bg-gradient-to-br from-arcane-500/5 to-void-900/60 border border-arcane-500/15"
            >
              <p className="text-sm font-semibold mb-2 text-foreground">
                Before you write to us
              </p>
              <p className="text-sm leading-relaxed text-foreground-secondary">
                Check our{" "}
                <a href="/free-resources" className="font-medium underline underline-offset-2 transition-colors hover:text-arcane-300 text-arcane-400">
                  Free Resources
                </a>{" "}
                page — your question may already be answered there. For technical issues, please include your browser name and device type in your message.
              </p>
            </div>
          </div>

          {/* ── Right — Interactive contact form (client component) ── */}
          <ContactForm />

        </div>
      </div>
    </main>
  );
}
