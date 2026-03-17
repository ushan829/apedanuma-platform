import type { Metadata } from "next";
import Link from "next/link";
import { 
  Database, 
  Activity, 
  Share2, 
  Lock, 
  Cookie, 
  Users, 
  BarChart3, 
  Trash2, 
  Scale, 
  ShieldAlert,
  Mail,
  RefreshCw
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Ape Danuma",
  description: "Advanced Privacy Policy for Ape Danuma. Ensuring the highest standards of data protection and PDPA compliance.",
};

const LAST_UPDATED = "March 17, 2026";
const LEGAL_VERSION = "2.0.0";

/**
 * Premium Privacy Section Card
 */
function PrivacyCard({ 
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

export default function PrivacyPolicyPage() {
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
          <span style={{ color: "var(--foreground-secondary)" }}>Privacy Policy</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          
          {/* ── Header ── */}
          <header className="text-center mb-24 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[0.7rem] font-bold uppercase tracking-[0.2em] mb-8"
              style={{ background: "rgba(139, 92, 246, 0.08)", color: "#a78bfa", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
              Data Protection Protocol
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-10" style={{ color: "var(--foreground)" }}>
              Privacy Policy
            </h1>
            
            <div className="w-24 h-1.5 mx-auto bg-gradient-to-r from-arcane-600 to-arcane-400 rounded-full mb-12 shadow-[0_0_15px_rgba(124,31,255,0.4)]" />
            
            <p className="max-w-2xl mx-auto text-xl leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
              At <strong>Ape Danuma</strong> (em.apedanuma.lk), we are committed to protecting the privacy of our students and parents. This policy outlines how we handle your personal data when you use our educational platform.
            </p>
          </header>

          {/* ── Privacy Sections Grid ── */}
          <div className="space-y-10">
            
            {/* 1. Information We Collect (Existing) */}
            <PrivacyCard icon={Database} title="1. Information We Collect" delay="100ms">
              <p>When you visit our website, we may collect certain information about you, including:</p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full mt-2.5 shrink-0 bg-arcane-500" />
                  <span><strong>Account Information:</strong> Name, email address, phone number, and grade/subject preferences when you register.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full mt-2.5 shrink-0 bg-arcane-500" />
                  <span><strong>Payment Information:</strong> All transactions are securely handled by <strong>PayHere</strong>. We do not store your credit card or bank details on our servers.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full mt-2.5 shrink-0 bg-arcane-500" />
                  <span><strong>Browsing Data:</strong> Anonymized usage patterns, browser type, and device information to improve our services.</span>
                </li>
              </ul>
            </PrivacyCard>

            {/* 2. Use of Information (Existing) */}
            <PrivacyCard icon={Activity} title="2. Use of Information" delay="200ms">
              <p>We use the collected information for the following specific purposes:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>To grant and manage access to premium study materials and courses.</li>
                <li>To communicate regarding purchases, platform updates, and upcoming exams.</li>
                <li>To personalize your learning experience and recommend relevant content.</li>
                <li>To analyze overall student performance trends for content improvement.</li>
                <li>To detect and prevent unauthorized account sharing or intellectual property abuse.</li>
              </ul>
            </PrivacyCard>

            {/* 3. Information Sharing (Existing) */}
            <PrivacyCard icon={Share2} title="3. Information Sharing" delay="300ms">
              <p>
                We respect your privacy and do not sell or rent your personal information. Data is shared only with trusted third parties strictly for providing our services:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Trusted service providers:</strong> Partners like <strong>PayHere</strong> who assist us in processing secure payments.</li>
                <li><strong>Legal Requirements:</strong> If required by Sri Lankan law or in response to valid legal requests.</li>
              </ul>
            </PrivacyCard>

            {/* 4. Data Security (Existing) */}
            <PrivacyCard icon={Lock} title="4. Data Security" delay="400ms">
              <p>
                We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure. However, please be aware that no method of transmission over the internet is 100% secure. You are responsible for keeping your login credentials safe.
              </p>
            </PrivacyCard>

            {/* 5. Cookies (Existing) */}
            <PrivacyCard icon={Cookie} title="5. Cookies and Tracking" delay="500ms">
              <p>
                We use cookies and similar technologies to enhance your browsing experience and analyze website traffic. You have the option to disable cookies through your browser settings, though some platform features may not function correctly.
              </p>
            </PrivacyCard>

            {/* ── NEW ADVANCED CLAUSES ── */}

            {/* 6. Children's Privacy (New) */}
            <PrivacyCard icon={Users} title="6. Children’s Privacy and Parental Consent" delay="600ms">
              <p>
                Our services are primarily intended for students preparing for G.C.E. O/L examinations. If you are under the age of 18, you must obtain the explicit consent of a parent or legal guardian before registering an account, providing any personal information, or making any purchase on em.apedanuma.lk.
              </p>
              <p>
                Ape Danuma does not knowingly collect personal data from children under 13. If we discover that we have inadvertently collected such data, we will take immediate steps to delete it from our servers.
              </p>
            </PrivacyCard>

            {/* 7. Third-Party Analytics (New) */}
            <PrivacyCard icon={BarChart3} title="7. Third-Party Tracking and Analytics" delay="700ms">
              <p>
                We utilize <strong>Google Analytics</strong> to analyze platform traffic and student engagement with our study materials. Google Analytics uses "cookies" to collect standard internet log information and visitor behavior in an anonymous form.
              </p>
              <p>
                This information (including your IP address) is transmitted to Google to help us evaluate how students use our website and to compile statistical reports on platform activity. This data is used solely to improve our educational content and user experience.
              </p>
            </PrivacyCard>

            {/* 8. Data Retention (New) */}
            <PrivacyCard icon={Trash2} title="8. Data Retention and Your Right to be Forgotten" delay="800ms">
              <p>
                We retain your personal data only for as long as is necessary to provide you with access to our educational resources or to comply with our legal obligations.
              </p>
              <p>
                You have the right to request the permanent deletion of your account and all associated personal data at any time. To exercise this <strong>"Right to be Forgotten,"</strong> please email your request to <a href="mailto:support@apedanuma.lk" className="text-arcane-400 hover:text-arcane-300 transition-colors underline underline-offset-4">support@apedanuma.lk</a>. Upon verification, we will purge your data from our active databases within 30 days.
              </p>
            </PrivacyCard>

            {/* 9. PDPA Compliance (New) */}
            <PrivacyCard icon={Scale} title="9. Compliance with Sri Lankan Data Protection Laws" delay="900ms">
              <p>
                Ape Danuma operates in strict alignment with the principles of the <strong>Personal Data Protection Act, No. 9 of 2022 (Sri Lanka)</strong>. We serve as the "Data Controller" for the information you provide and are committed to ensuring that your data is processed lawfully, transparently, and only for the specific educational purposes for which it was collected.
              </p>
            </PrivacyCard>

            {/* 10. Data Breach Protocol (New) */}
            <PrivacyCard icon={ShieldAlert} title="10. Data Breach Notification Protocol" delay="1000ms">
              <p>
                While we implement robust security measures, no system is impenetrable. In the unlikely event of a security breach that compromises your personal data, Ape Danuma is committed to transparency.
              </p>
              <p>
                We will notify affected users via their registered email address within <strong>72 hours</strong> of the breach being confirmed, providing clear information on the nature of the breach and the steps being taken to mitigate any risks.
              </p>
            </PrivacyCard>

            {/* 11. Changes (Existing) */}
            <PrivacyCard icon={RefreshCw} title="11. Changes to the Privacy Policy" delay="1100ms">
              <p>
                We reserve the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page with a revised "last updated" date. We encourage you to review this policy periodically.
              </p>
            </PrivacyCard>

            {/* 12. Contact (Existing) */}
            <PrivacyCard icon={Mail} title="12. Contact Us" delay="1200ms">
              <p>
                If you have any questions or concerns regarding this Privacy Policy or our data handling practices, please contact our Data Protection Officer at <a href="mailto:support@apedanuma.lk" className="text-arcane-400 hover:text-arcane-300 transition-colors underline underline-offset-4">support@apedanuma.lk</a>.
              </p>
            </PrivacyCard>

          </div>

          {/* ── Metadata Footer ── */}
          <footer className="mt-32 pt-12 border-t border-white/5 text-center animate-fade-in" style={{ animationDelay: "1300ms" }}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 text-sm font-medium mb-6" style={{ color: "var(--foreground-muted)" }}>
              <span>Last Updated: <span className="text-white/60">{LAST_UPDATED}</span></span>
              <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/10" />
              <span>Legal Version: <span className="text-white/60">{LEGAL_VERSION}</span></span>
            </div>
            <p className="text-xs max-w-xl mx-auto leading-relaxed" style={{ color: "var(--foreground-disabled)" }}>
              The privacy framework of Ape Danuma is designed to comply with the Personal Data Protection Act of Sri Lanka and global best practices for EdTech data security.
            </p>
          </footer>

        </div>
      </div>
    </main>
  );
}
