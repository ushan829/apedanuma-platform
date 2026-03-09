import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the Terms of Service governing your use of the Ape Danuma educational platform.",
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

function Note({ children, variant = "purple" }: { children: React.ReactNode; variant?: "purple" | "gold" | "red" }) {
  const styles = {
    purple: { background: "rgba(124,31,255,0.07)", border: "rgba(124,31,255,0.18)" },
    gold:   { background: "rgba(245,158,11,0.07)", border: "rgba(245,158,11,0.2)"  },
    red:    { background: "rgba(239,68,68,0.07)",  border: "rgba(239,68,68,0.2)"   },
  }[variant];

  return (
    <div
      className="rounded-xl px-5 py-4 text-sm leading-relaxed"
      style={{
        background: styles.background,
        border: `1px solid ${styles.border}`,
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
  { id: "agreement",          label: "Agreement to Terms" },
  { id: "user-accounts",      label: "User Accounts" },
  { id: "premium-content",    label: "Premium Content Licensing & Downloads" },
  { id: "acceptable-use",     label: "Acceptable Use" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "refund-policy",      label: "Refund Policy" },
  { id: "disclaimers",        label: "Disclaimers & Limitation of Liability" },
  { id: "termination",        label: "Termination" },
  { id: "governing-law",      label: "Governing Law" },
  { id: "changes",            label: "Changes to These Terms" },
  { id: "contact",            label: "Contact Us" },
];

/* ─────────────────────────────────────────
   Page
   ───────────────────────────────────────── */
export default function TermsPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: 600, height: 500,
            background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 rounded-full"
          style={{
            width: 500, height: 500,
            background: "radial-gradient(circle, rgba(124,31,255,0.05) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      <div className="container-xl py-14 sm:py-20">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs mb-10" aria-label="Breadcrumb" style={{ color: "var(--foreground-muted)" }}>
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span style={{ color: "var(--foreground-secondary)" }}>Terms of Service</span>
        </nav>

        <div className="max-w-4xl mx-auto">

          {/* ── Page header ── */}
          <header className="mb-12">
            <div className="badge-gold w-fit mb-4">Legal</div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-4" style={{ color: "var(--foreground)" }}>
              Terms of Service
            </h1>
            <p className="text-base leading-relaxed mb-3" style={{ color: "var(--foreground-secondary)" }}>
              Please read these Terms of Service carefully before using the <strong style={{ color: "var(--foreground)" }}>Ape Danuma</strong> platform. By accessing or using our website, you agree to be bound by these terms. If you do not agree with any part of these terms, please do not use our platform.
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
              <Section id="agreement" title="1. Agreement to Terms">
                <P>
                  By creating an account, accessing, or using the Ape Danuma platform (the &ldquo;Service&rdquo;), you confirm that you are at least 13 years of age, have read and understood these Terms of Service, and agree to be bound by them. If you are under 18, you confirm that your parent or legal guardian has reviewed and consented to these terms on your behalf.
                </P>
                <P>
                  These Terms of Service, together with our{" "}
                  <Link href="/privacy" className="underline underline-offset-2 transition-colors hover:text-[#b890ff]" style={{ color: "#9455ff" }}>
                    Privacy Policy
                  </Link>
                  , constitute the entire legal agreement between you and Ape Danuma regarding your use of the Service.
                </P>
              </Section>

              {/* 2 */}
              <Section id="user-accounts" title="2. User Accounts">
                <P>
                  To access certain features of our platform — including downloading free resources, purchasing premium content, or tracking your progress — you will need to create an account.
                </P>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>When creating and maintaining your account, you agree to:</p>
                  <Ul items={[
                    "Provide accurate, current, and complete information during registration and keep it up to date.",
                    "Choose a strong, unique password and keep it confidential. You are responsible for all activity that occurs under your account.",
                    "Notify us immediately at support@apedanuma.lk if you suspect any unauthorised access to or use of your account.",
                    "Not create more than one account per person, or create an account on behalf of another person without their explicit permission.",
                    "Not share your account credentials with any other person.",
                  ]} />
                </div>
                <P>
                  We reserve the right to suspend or terminate accounts that contain false information, are involved in abuse, or violate any of these terms. We may also reclaim usernames that are inactive, offensive, or in violation of third-party rights.
                </P>
                <Note variant="gold">
                  <strong style={{ color: "#fbbf24" }}>Account security is your responsibility.</strong> We will never ask for your password via email or phone. If you receive any such request, please report it to us immediately.
                </Note>
              </Section>

              {/* 3 */}
              <Section id="premium-content" title="3. Premium Content Licensing & Downloads">
                <P>
                  Ape Danuma offers both free and premium study materials. When you purchase premium content, you are purchasing a limited, personal, non-transferable licence to access and use that content for your own private educational purposes.
                </P>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>Your licence grants you the right to:</p>
                  <Ul items={[
                    "Download the purchased PDF document to your personal devices for private study use.",
                    "Print one physical copy of the document for your own personal use.",
                    "Access the document for the lifetime of your account or until the document is removed from the platform, whichever comes first.",
                  ]} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>Your licence explicitly does not permit you to:</p>
                  <Ul items={[
                    "Share, distribute, upload, or re-publish any premium content — whether digitally or in print — without our prior written consent.",
                    "Sell, sub-license, or otherwise commercially exploit any content purchased from the platform.",
                    "Remove or alter any copyright notices, watermarks, or attribution statements within the documents.",
                    "Use the content to create derivative works intended for commercial distribution.",
                    "Share your account login to allow others to access content they have not paid for.",
                  ]} />
                </div>
                <Note variant="red">
                  <strong style={{ color: "#fca5a5" }}>Copyright violation is taken seriously.</strong> Unauthorised distribution of our premium materials constitutes copyright infringement and may result in immediate account termination, legal action, and financial liability.
                </Note>
              </Section>

              {/* 4 */}
              <Section id="acceptable-use" title="4. Acceptable Use">
                <P>
                  You agree to use the Ape Danuma platform only for lawful educational purposes and in a manner that does not infringe the rights of others or restrict their use and enjoyment of the platform.
                </P>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>You must not use our platform to:</p>
                  <Ul items={[
                    "Violate any applicable local, national, or international law or regulation.",
                    "Transmit any unsolicited or unauthorised advertising or promotional material (spam).",
                    "Impersonate any person or entity, or falsely claim an affiliation with a person or organisation.",
                    "Upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, defamatory, or otherwise objectionable.",
                    "Attempt to gain unauthorised access to any part of the platform, its servers, or any connected systems.",
                    "Use automated scripts, bots, scrapers, or crawlers to access, collect, or copy content from the platform without our express written permission.",
                    "Introduce viruses, malware, or any other malicious code that could disrupt the platform's operation.",
                    "Engage in any conduct that could damage, disable, overburden, or impair the platform's infrastructure.",
                    "Use the platform in any way that could bring Ape Danuma into disrepute or undermine trust in the platform.",
                  ]} />
                </div>
                <P>
                  We reserve the right to investigate suspected violations and take any action we deem appropriate, including removing content, suspending access, or reporting activity to law enforcement authorities.
                </P>
              </Section>

              {/* 5 */}
              <Section id="intellectual-property" title="5. Intellectual Property">
                <P>
                  All content on the Ape Danuma platform — including but not limited to study notes, past papers, model answers, text, graphics, logos, icons, images, and software — is the property of Ape Danuma or its content licensors and is protected by applicable copyright, trademark, and intellectual property laws.
                </P>
                <P>
                  The Ape Danuma name, logo, and all related marks are trademarks of Ape Danuma. Nothing on this platform grants you any right or licence to use our trademarks without our prior written consent.
                </P>
                <P>
                  Where our platform contains links to third-party websites or content provided by third parties, we are not responsible for the accuracy, completeness, or legality of that content. Links do not constitute endorsement of the linked websites.
                </P>
              </Section>

              {/* 6 */}
              <Section id="refund-policy" title="6. Refund Policy">
                <P>
                  We want you to be completely satisfied with your purchase. Our refund policy is designed to be fair to both you and our content creators.
                </P>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>You are eligible for a full refund if:</p>
                  <Ul items={[
                    "You request a refund within 7 days of purchase and have not downloaded or accessed the content.",
                    "The purchased file is technically defective (e.g., corrupted, unreadable, or the content is substantially different from its description), and we are unable to provide a corrected version within 5 business days.",
                    "You were accidentally charged twice for the same product (duplicate purchase).",
                  ]} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>Refunds will not be issued in the following circumstances:</p>
                  <Ul items={[
                    "You have already downloaded the purchased PDF document.",
                    "You claim the content does not meet your personal expectations after having accessed it, provided the content matches its description.",
                    "More than 7 days have passed since the date of purchase.",
                    "The purchase was made using promotional credit or a discount code, unless the content is demonstrably defective.",
                    "Your account has been suspended or terminated for violating these Terms of Service.",
                  ]} />
                </div>
                <P>
                  To request a refund, please contact us at{" "}
                  <a href="mailto:support@apedanuma.lk" className="underline underline-offset-2 transition-colors hover:text-[#b890ff]" style={{ color: "#9455ff" }}>
                    support@apedanuma.lk
                  </a>{" "}
                  with your order number and reason for the request. Approved refunds are processed within 5–10 business days and returned to the original payment method.
                </P>
                <Note variant="gold">
                  We reserve the right to decline refund requests that we reasonably believe are made in bad faith or that involve abuse of our refund policy.
                </Note>
              </Section>

              {/* 7 */}
              <Section id="disclaimers" title="7. Disclaimers & Limitation of Liability">
                <P>
                  The study materials and content provided on Ape Danuma are intended solely for educational and revision purposes. While we strive for accuracy and alignment with the Sri Lankan G.C.E. O/L syllabus, <strong style={{ color: "var(--foreground)" }}>we make no guarantee that use of our materials will result in specific examination grades or outcomes.</strong>
                </P>
                <P>
                  The platform is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. To the fullest extent permitted by law, Ape Danuma disclaims all warranties, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                </P>
                <P>
                  To the maximum extent permitted by applicable law, Ape Danuma shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of data, profits, or goodwill — arising out of or in connection with your use of, or inability to use, the platform or its content.
                </P>
                <Note variant="red">
                  Our total cumulative liability to you for any claims arising under these terms shall not exceed the total amount you paid to Ape Danuma in the 12 months preceding the event giving rise to the claim.
                </Note>
              </Section>

              {/* 8 */}
              <Section id="termination" title="8. Termination">
                <P>
                  You may close your account at any time by contacting us at support@apedanuma.lk. Upon closure, your account data will be deleted in accordance with our Privacy Policy, subject to any legal retention obligations.
                </P>
                <P>
                  We reserve the right to suspend or permanently terminate your access to the platform, with or without notice, if we determine that you have violated these Terms of Service, engaged in fraudulent activity, or if continued access poses a risk to the platform or other users.
                </P>
                <P>
                  Upon termination, your licence to use any downloaded content is revoked. However, refunds will not automatically be issued upon termination for cause. Clauses relating to intellectual property, disclaimers, and limitation of liability shall survive termination.
                </P>
              </Section>

              {/* 9 */}
              <Section id="governing-law" title="9. Governing Law">
                <P>
                  These Terms of Service are governed by and construed in accordance with the laws of the Democratic Socialist Republic of Sri Lanka, without regard to its conflict of law principles. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the competent courts of Sri Lanka.
                </P>
                <P>
                  If any provision of these terms is found to be invalid or unenforceable by a court of competent jurisdiction, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will continue in full force and effect.
                </P>
              </Section>

              {/* 10 */}
              <Section id="changes" title="10. Changes to These Terms">
                <P>
                  We may revise these Terms of Service at any time. When we make material changes, we will provide at least 14 days&apos; notice before the new terms take effect, either by email (for registered users) or by a prominent notice on our platform. The updated date at the top of this document will always reflect the most recent revision.
                </P>
                <P>
                  Your continued use of the platform after revised terms have come into effect constitutes your acceptance of the updated terms. If you do not agree to the revised terms, you must stop using the platform before they take effect.
                </P>
              </Section>

              {/* 11 */}
              <Section id="contact" title="11. Contact Us">
                <P>
                  If you have any questions, concerns, or require clarification about these Terms of Service, please reach out to us through any of the following channels:
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
                  <p>Email: <a href="mailto:legal@apedanuma.lk" className="underline underline-offset-2 hover:text-[#b890ff] transition-colors" style={{ color: "#9455ff" }}>legal@apedanuma.lk</a></p>
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
                  <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
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
