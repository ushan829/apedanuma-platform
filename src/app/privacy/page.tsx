import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Ape Danuma collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "1 March 2026";

/* ─────────────────────────────────────────
   Shared prose components
   ───────────────────────────────────────── */
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2
        className="font-display font-bold text-xl sm:text-2xl mb-4 pb-3"
        style={{
          color: "var(--foreground)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.9375rem] leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
      {children}
    </p>
  );
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-1">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
          <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#9455ff" }} />
          {item}
        </li>
      ))}
    </ul>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl px-5 py-4 text-sm leading-relaxed"
      style={{
        background: "rgba(124,31,255,0.07)",
        border: "1px solid rgba(124,31,255,0.18)",
        color: "var(--foreground-secondary)",
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   Table of contents
   ───────────────────────────────────────── */
const TOC_ITEMS = [
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use-your-data",   label: "How We Use Your Data" },
  { id: "data-sharing",           label: "Data Sharing & Third Parties" },
  { id: "data-security",          label: "Data Security" },
  { id: "cookies",                label: "Cookies & Tracking" },
  { id: "your-rights",            label: "Your Rights" },
  { id: "childrens-privacy",      label: "Children's Privacy" },
  { id: "changes",                label: "Changes to This Policy" },
  { id: "contact",                label: "Contact Us" },
];

/* ─────────────────────────────────────────
   Page
   ───────────────────────────────────────── */
export default function PrivacyPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: 600, height: 500,
            background: "radial-gradient(circle, rgba(124,31,255,0.07) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      <div className="container-xl py-14 sm:py-20">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs mb-10" aria-label="Breadcrumb" style={{ color: "var(--foreground-muted)" }}>
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span style={{ color: "var(--foreground-secondary)" }}>Privacy Policy</span>
        </nav>

        <div className="max-w-4xl mx-auto">

          {/* ── Page header ── */}
          <header className="mb-12">
            <div className="badge-accent w-fit mb-4">Legal</div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-4" style={{ color: "var(--foreground)" }}>
              Privacy Policy
            </h1>
            <p className="text-base leading-relaxed mb-3" style={{ color: "var(--foreground-secondary)" }}>
              At <strong style={{ color: "var(--foreground)" }}>Ape Danuma</strong>, we are committed to protecting your privacy and handling your personal data with transparency and care. This policy explains what we collect, why we collect it, and how we keep it safe.
            </p>
            <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
              Last updated: <span style={{ color: "var(--foreground-secondary)" }}>{LAST_UPDATED}</span>
            </p>
          </header>

          {/* ── Layout: ToC + Content ── */}
          <div className="flex gap-10 items-start">

            {/* Sticky ToC — desktop only */}
            <nav
              aria-label="Table of contents"
              className="hidden xl:flex flex-col gap-1 shrink-0 sticky top-24"
              style={{ width: 200 }}
            >
              <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--foreground-muted)" }}>
                On this page
              </p>
              {TOC_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-xs py-1 leading-snug transition-colors duration-150 hover:text-white"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Main prose */}
            <article className="flex-1 min-w-0 space-y-10">

              {/* 1 */}
              <Section id="information-we-collect" title="1. Information We Collect">
                <P>
                  We collect information that you provide directly to us, information we collect automatically when you use our platform, and information from third-party services where you have given permission to share it.
                </P>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>Information you provide directly:</p>
                  <Ul items={[
                    "Account registration details: full name, email address, and password (stored in hashed form).",
                    "Profile information you choose to add, such as your school name or grade level.",
                    "Payment information when purchasing premium content — we use a PCI-compliant payment processor and never store your raw card details on our servers.",
                    "Messages and communications sent via our contact form or support channels.",
                    "Feedback, ratings, or reviews you submit about study materials.",
                  ]} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>Information collected automatically:</p>
                  <Ul items={[
                    "Log data: IP address, browser type, operating system, referring URLs, and pages visited.",
                    "Device identifiers and approximate geographic location (country/region level only).",
                    "Usage data: which resources you view, download, or purchase, and how long you spend on each page.",
                    "Cookie and similar tracking technology data (see the Cookies section below).",
                  ]} />
                </div>
                <Note>
                  <strong>We do not collect sensitive personal data</strong> such as national identity numbers, ethnic origin, or medical information. We collect only what is necessary to provide and improve our educational services.
                </Note>
              </Section>

              {/* 2 */}
              <Section id="how-we-use-your-data" title="2. How We Use Your Data">
                <P>
                  We use the information we collect for the following purposes, always based on a lawful basis under applicable data protection law:
                </P>
                <Ul items={[
                  "To create and manage your account and provide access to our platform features.",
                  "To process transactions for premium content purchases and send payment receipts.",
                  "To personalise your experience — for example, remembering your grade selection and subject preferences.",
                  "To send you important service communications, such as account confirmations, password resets, and security alerts. These cannot be opted out of while you hold an account.",
                  "To send you optional promotional emails about new study materials, platform updates, or special offers — you may unsubscribe at any time.",
                  "To analyse usage patterns so we can improve the quality, relevance, and performance of our study materials and platform.",
                  "To detect, prevent, and respond to fraud, abuse, or security incidents.",
                  "To comply with legal obligations under Sri Lankan law and other applicable regulations.",
                ]} />
                <P>
                  We will never sell your personal data to third parties or use it for purposes incompatible with those stated above without first obtaining your explicit consent.
                </P>
              </Section>

              {/* 3 */}
              <Section id="data-sharing" title="3. Data Sharing & Third Parties">
                <P>
                  We do not sell, trade, or rent your personal information. We may share your data only in the following limited circumstances:
                </P>
                <Ul items={[
                  "Service providers: We work with trusted third-party vendors (e.g., cloud hosting, payment processors, email delivery services) who process data on our behalf under strict data processing agreements.",
                  "Analytics: We use privacy-respecting analytics tools to understand aggregate platform usage. Where possible, we anonymise data before sharing it with analytics providers.",
                  "Legal requirements: We may disclose your information if required to do so by law or in response to valid legal processes, such as a court order.",
                  "Business transfers: In the event of a merger, acquisition, or sale of assets, your data may be transferred. We will notify you before your data becomes subject to a different privacy policy.",
                ]} />
                <Note>
                  Any third-party service providers we engage are contractually required to handle your data in accordance with this Privacy Policy and applicable data protection law.
                </Note>
              </Section>

              {/* 4 */}
              <Section id="data-security" title="4. Data Security">
                <P>
                  Protecting your data is one of our highest priorities. We implement a range of technical and organisational security measures to safeguard your personal information against unauthorised access, alteration, disclosure, or destruction.
                </P>
                <Ul items={[
                  "All data transmitted between your browser and our servers is encrypted using industry-standard TLS (HTTPS).",
                  "Passwords are stored using strong, salted cryptographic hashing algorithms — we cannot view or recover your password.",
                  "Access to personal data within our team is restricted on a strict need-to-know basis, with role-based access controls.",
                  "Our infrastructure undergoes regular security reviews, and we apply software updates and security patches promptly.",
                  "Payment transactions are processed by a PCI-DSS compliant payment gateway; we do not store payment card details.",
                ]} />
                <P>
                  While we take every reasonable precaution, no system is completely immune to risk. In the unlikely event of a data breach that may affect your rights or freedoms, we will notify you and the relevant authorities in accordance with our legal obligations, without undue delay.
                </P>
                <Note>
                  You also play a role in keeping your account secure. Please use a strong, unique password and do not share your login credentials with anyone.
                </Note>
              </Section>

              {/* 5 */}
              <Section id="cookies" title="5. Cookies & Tracking">
                <P>
                  We use cookies and similar technologies to make our platform work correctly, to improve your experience, and to understand how our services are used. A cookie is a small text file stored on your device by your browser.
                </P>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>Types of cookies we use:</p>
                  <Ul items={[
                    "Essential cookies: Required for core platform functionality such as keeping you logged in and remembering your session. These cannot be disabled.",
                    "Preference cookies: Remember your settings such as selected grade, subject filters, and display preferences.",
                    "Analytics cookies: Help us understand how visitors interact with our platform — which pages are most visited, where users drop off, and how performance can be improved. Data is collected in aggregate and is anonymised where possible.",
                    "Marketing cookies (optional): Used only if you have consented, to show relevant advertisements on third-party platforms. You can withdraw this consent at any time.",
                  ]} />
                </div>
                <P>
                  You can manage or delete cookies through your browser settings at any time. Please note that disabling essential cookies may prevent some features of the platform from working correctly. For more information on managing cookies, visit{" "}
                  <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 transition-colors hover:text-[#b890ff]" style={{ color: "#9455ff" }}>
                    allaboutcookies.org
                  </a>
                  .
                </P>
              </Section>

              {/* 6 */}
              <Section id="your-rights" title="6. Your Rights">
                <P>
                  Depending on your location and applicable law, you may have the following rights regarding your personal data:
                </P>
                <Ul items={[
                  "Right of access: You may request a copy of the personal data we hold about you.",
                  "Right to rectification: You may ask us to correct inaccurate or incomplete data.",
                  "Right to erasure: You may request that we delete your personal data, subject to certain legal exceptions.",
                  "Right to restriction: You may ask us to limit how we process your data in certain circumstances.",
                  "Right to data portability: You may request your data in a structured, machine-readable format.",
                  "Right to object: You may object to our processing of your data for direct marketing purposes at any time.",
                  "Right to withdraw consent: Where processing is based on your consent, you may withdraw it at any time without affecting the lawfulness of prior processing.",
                ]} />
                <P>
                  To exercise any of these rights, please contact us at{" "}
                  <a href="mailto:privacy@apedanuma.lk" className="underline underline-offset-2 transition-colors hover:text-[#b890ff]" style={{ color: "#9455ff" }}>
                    privacy@apedanuma.lk
                  </a>
                  . We will respond to your request within 30 days.
                </P>
              </Section>

              {/* 7 */}
              <Section id="childrens-privacy" title="7. Children's Privacy">
                <P>
                  Our platform is designed for students preparing for the G.C.E. O/L examination, which typically includes students aged 14–16. We do not knowingly collect personal data from children under the age of 13 without verifiable parental consent. If you are a parent or guardian and believe your child under 13 has provided us with personal information without your consent, please contact us immediately and we will take steps to remove that data.
                </P>
                <P>
                  For users aged 13–17, we encourage parents and guardians to be involved in their child&apos;s use of the platform and to review this Privacy Policy together.
                </P>
              </Section>

              {/* 8 */}
              <Section id="changes" title="8. Changes to This Policy">
                <P>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make significant changes, we will notify you by email (if you have an account) and by posting a prominent notice on our platform for a reasonable period before the changes take effect.
                </P>
                <P>
                  We encourage you to review this page periodically. The &ldquo;Last updated&rdquo; date at the top of this policy indicates when it was most recently revised. Your continued use of the platform after changes become effective constitutes your acceptance of the revised policy.
                </P>
              </Section>

              {/* 9 */}
              <Section id="contact" title="9. Contact Us">
                <P>
                  If you have any questions, concerns, or requests regarding this Privacy Policy or the way we handle your personal data, please do not hesitate to get in touch.
                </P>
                <div
                  className="rounded-xl p-5 space-y-1.5 text-sm"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "var(--foreground-secondary)",
                  }}
                >
                  <p><strong style={{ color: "var(--foreground)" }}>Ape Danuma Education Platform</strong></p>
                  <p>Email: <a href="mailto:privacy@apedanuma.lk" className="underline underline-offset-2 hover:text-[#b890ff] transition-colors" style={{ color: "#9455ff" }}>privacy@apedanuma.lk</a></p>
                  <p>Contact form: <Link href="/contact" className="underline underline-offset-2 hover:text-[#b890ff] transition-colors" style={{ color: "#9455ff" }}>/contact</Link></p>
                </div>
              </Section>

              {/* Footer divider */}
              <div
                className="pt-4 border-t text-xs"
                style={{ borderColor: "rgba(255,255,255,0.07)", color: "var(--foreground-muted)" }}
              >
                <p>This document was last updated on <span style={{ color: "var(--foreground-secondary)" }}>{LAST_UPDATED}</span>. &copy; {new Date().getFullYear()} Ape Danuma. All rights reserved.</p>
                <div className="flex gap-4 mt-2">
                  <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                  <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
                </div>
              </div>

            </article>
          </div>
        </div>
      </div>
    </main>
  );
}
