import type { Metadata } from "next";
import Link from "next/link";
import { 
  FileText, 
  UserCheck, 
  ShieldCheck, 
  CreditCard, 
  AlertCircle, 
  Scale, 
  Gavel, 
  Globe, 
  Shield, 
  Link as LinkIcon, 
  Edit, 
  RefreshCw,
  Info
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions | Ape Danuma",
  description: "Advanced Terms and Conditions for Ape Danuma. Establishing a legally binding framework for our educational platform.",
};

const LAST_UPDATED = "March 17, 2026";
const LEGAL_VERSION = "2.0.0";

/**
 * Premium Terms Section Card
 */
function TermsCard({ 
  icon: Icon, 
  title, 
  children, 
  delay = "0ms" 
}: { 
  icon: any; 
  title: string; 
  children: React.ReactNode;
  delay?: string;
}) {
  return (
    <div 
      className="group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:translate-y-[-2px] animate-fade-up"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        backdropFilter: "blur(16px)",
        animationDelay: delay
      }}
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 20% 0%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)"
        }}
      />

      <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
        <div className="shrink-0 p-3.5 rounded-2xl bg-arcane-500/10 border border-arcane-500/20 text-arcane-400 group-hover:scale-110 transition-transform duration-500">
          <Icon size={26} strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-display font-bold mb-4 tracking-tight" style={{ color: "var(--foreground)" }}>
            {title}
          </h2>
          <div className="text-[1.0625rem] leading-relaxed space-y-4" style={{ color: "var(--foreground-secondary)" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TermsAndConditionsPage() {
  return (
    <main className="relative min-h-screen">
      {/* ── Background: Texture & Ambient Glow ── */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[-1]">
        {/* SVG Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.02]" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} 
        />
        {/* Large Purple Glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120%] h-[60%] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", filter: "blur(120px)" }}
        />
      </div>

      <div className="container-xl pt-20 pb-32 px-6 sm:px-12 md:px-16">
        
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center justify-center gap-2 text-xs mb-16 animate-fade-in" style={{ color: "var(--foreground-muted)" }}>
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="opacity-30">/</span>
          <span style={{ color: "var(--foreground-secondary)" }}>Terms & Conditions</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          
          {/* ── Header ── */}
          <header className="text-center mb-24 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[0.7rem] font-bold uppercase tracking-[0.2em] mb-8"
              style={{ background: "rgba(139, 92, 246, 0.08)", color: "#a78bfa", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
              Service Level Agreement
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-10" style={{ color: "var(--foreground)" }}>
              Terms & Conditions
            </h1>
            
            <div className="w-24 h-1.5 mx-auto bg-gradient-to-r from-arcane-600 to-arcane-400 rounded-full mb-12 shadow-[0_0_15px_rgba(124,31,255,0.4)]" />
            
            <p className="max-w-2xl mx-auto text-xl leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
              Welcome to <strong>Ape Danuma</strong> (em.apedanuma.lk). These Terms and Conditions constitute a legally binding agreement between you and Ape Danuma regarding your use of our platform.
            </p>
          </header>

          {/* ── Terms Sections Grid ── */}
          <div className="space-y-10">
            
            {/* 1. Acceptance of Terms */}
            <TermsCard icon={FileText} title="1. Acceptance of Terms" delay="100ms">
              <p>
                By accessing our platform or purchasing any study materials, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, you must immediately cease use of the website.
              </p>
            </TermsCard>

            {/* 2. Eligibility and Account Security */}
            <TermsCard icon={UserCheck} title="2. Eligibility and Account Security" delay="200ms">
              <ul className="list-disc pl-5 space-y-3">
                <li><strong>Age Requirement:</strong> Our platform is designed for O/L students. If you are under 18, you must have the explicit permission and supervision of a parent or guardian to create an account and make purchases.</li>
                <li><strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your login credentials. Any activity occurring under your account is your responsibility.</li>
                <li><strong>No-Sharing Policy:</strong> You are strictly prohibited from sharing your account login details with any other individual. Our system monitors concurrent logins and IP patterns. Accounts found to be shared will be temporarily or permanently suspended without a refund.</li>
              </ul>
            </TermsCard>

            {/* 3. Intellectual Property */}
            <TermsCard icon={ShieldCheck} title="3. Intellectual Property and Copyright" delay="300ms">
              <p>
                All educational materials, including but not limited to <strong>PDF Notes, Exam Papers, Tutorials, Diagrams, and Video Content</strong>, are the exclusive intellectual property of Ape Danuma and are protected by the Intellectual Property Act of Sri Lanka.
              </p>
              <p>
                <strong>Public Domain Resources:</strong> Certain materials provided in our "Free Resources" section (such as official past papers) are property of the Government of Sri Lanka. Ape Danuma claims no ownership over these specific documents, as outlined in our <Link href="/disclaimer" className="text-arcane-400 underline underline-offset-4">Disclaimer</Link>.
              </p>
              <p><strong>Strict Usage Restrictions for Premium Content:</strong></p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Content is licensed for individual, non-commercial, personal educational use only.</li>
                <li>You may NOT copy, reproduce, distribute, or resell any premium content.</li>
                <li>Sharing premium files on social media or WhatsApp is strictly prohibited and will result in immediate permanent account termination without refund.</li>
              </ul>
            </TermsCard>

            {/* 4. Purchases and Payments */}
            <TermsCard icon={CreditCard} title="4. Purchases, Payments, and Pricing" delay="400ms">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Payment Processing:</strong> All payments are processed securely via <strong>PayHere</strong>. By making a purchase, you agree to PayHere's terms of service.</li>
                <li><strong>Accuracy:</strong> You agree to provide valid and accurate payment information.</li>
                <li><strong>Pricing:</strong> We reserve the right to modify prices at any time. Once a purchase is completed, the price is locked for that transaction.</li>
              </ul>
            </TermsCard>

            {/* 5. Disclaimer of Warranties */}
            <TermsCard icon={AlertCircle} title="5. Disclaimer of Warranties" delay="500ms">
              <p>
                Ape Danuma provides educational resources to assist students in their studies. However:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>We do not guarantee specific exam results, grades, or academic outcomes.</li>
                <li>Study materials are provided "as is" without any express or implied warranties regarding their completeness or total accuracy.</li>
              </ul>
            </TermsCard>

            {/* 6. Limitation of Liability */}
            <TermsCard icon={Scale} title="6. Limitation of Liability" delay="600ms">
              <p>
                To the maximum extent permitted by law, Ape Danuma shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our platform or educational content.
              </p>
            </TermsCard>

            {/* ── NEW ADVANCED CORPORATE CLAUSES ── */}

            {/* 7. User Conduct & Termination (Verbatim) */}
            <TermsCard icon={Gavel} title="7. User Conduct and Account Termination" delay="700ms">
              <p>
                Ape Danuma reserves the right, in its sole discretion, to suspend or terminate your account and access to the platform immediately, without prior notice and without any obligation for a refund, if you engage in prohibited conduct. 
              </p>
              <p>
                Prohibited conduct includes, but is not limited to: (a) attempting to circumvent security measures or hack the platform; (b) using automated systems, including "bots," "spiders," or "scrapers," to extract data or content; (c) distributing malicious software or viruses; (d) engaging in abusive or harassing behavior towards other users or staff; and (e) any violation of our Intellectual Property and No-Sharing policies. Termination of an account due to a breach of these terms results in the immediate forfeiture of all purchased access.
              </p>
            </TermsCard>

            {/* 8. Governing Law (Verbatim) */}
            <TermsCard icon={Globe} title="8. Governing Law and Jurisdiction" delay="800ms">
              <p>
                These Terms and Conditions shall be governed by, and construed in accordance with, the laws of the <strong>Democratic Socialist Republic of Sri Lanka</strong>. Any dispute, controversy, or claim arising out of or relating to these terms, including the validity, invalidity, breach, or termination thereof, shall be settled exclusively by the competent courts of Sri Lanka.
              </p>
            </TermsCard>

            {/* 9. Indemnification (Verbatim) */}
            <TermsCard icon={Shield} title="9. Indemnification" delay="900ms">
              <p>
                You agree to indemnify, defend, and hold harmless Ape Danuma, its directors, officers, employees, and authorized partners from and against any and all claims, liabilities, damages, losses, or expenses, including reasonable legal fees and costs, arising out of or in any way connected with your misuse of the platform, your violation of these Terms and Conditions, or your infringement of any intellectual property or other rights of any third party.
              </p>
            </TermsCard>

            {/* 10. Third-Party Links (Verbatim) */}
            <TermsCard icon={LinkIcon} title="10. Third-Party Links and Services" delay="1000ms">
              <p>
                Our platform may contain links to third-party websites or services (including official government educational portals and the PayHere payment gateway) that are not owned or controlled by Ape Danuma. 
              </p>
              <p>
                We have no control over, and assume no responsibility for, the content, privacy policies, or security practices of any third-party websites. You acknowledge and agree that Ape Danuma shall not be liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such external content or services.
              </p>
            </TermsCard>

            {/* 11. Modifications (Verbatim) */}
            <TermsCard icon={Edit} title="11. Modifications to Service and Pricing" delay="1100ms">
              <p>
                Ape Danuma reserves the right at any time to modify, update, or discontinue the platform (or any part or content thereof) without prior notice. 
              </p>
              <p>
                Prices for our study materials, premium notes, and access packages are subject to change at our sole discretion. We shall not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of the service.
              </p>
            </TermsCard>

            {/* 12. Amendments */}
            <TermsCard icon={RefreshCw} title="12. Amendments to Terms" delay="1200ms">
              <p>
                We reserve the right to update these Terms and Conditions at any time. Significant changes will be notified to users via the platform or email. Continued use of the platform after such changes implies your acceptance of the new terms.
              </p>
            </TermsCard>

          </div>

          {/* ── Metadata Footer ── */}
          <footer className="mt-32 pt-12 border-t border-white/5 text-center animate-fade-in" style={{ animationDelay: "1300ms" }}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 text-sm font-medium mb-6" style={{ color: "var(--foreground-muted)" }}>
              <span>Last Updated: <span className="text-white/60">{LAST_UPDATED}</span></span>
              <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/10" />
              <span>Legal Version: <span className="text-white/60">{LEGAL_VERSION}</span></span>
            </div>
            <p className="text-xs max-w-xl mx-auto leading-relaxed" style={{ color: "var(--foreground-disabled)" }}>
              The legal framework of Ape Danuma is designed to ensure a secure and fair educational environment for all students. For formal inquiries, contact <Link href="/contact" className="text-arcane-400 hover:text-arcane-300 underline underline-offset-4">support@apedanuma.lk</Link>.
            </p>
          </footer>

        </div>
      </div>
    </main>
  );
}
