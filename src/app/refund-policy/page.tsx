import type { Metadata } from "next";
import Link from "next/link";
import { 
  MonitorSmartphone, 
  ShieldBan, 
  Clock, 
  Gift, 
  FileText, 
  AlertTriangle, 
  FileX, 
  Package, 
  RefreshCw, 
  Mail,
  HelpCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "Refund Policy | Ape Danuma",
  description: "Advanced Refund and Cancellation Policy for Ape Danuma. Fortifying transparency and chargeback protection.",
};

const LAST_UPDATED = "March 17, 2026";
const LEGAL_VERSION = "2.0.0";

/**
 * Premium Refund Section Card
 */
function RefundCard({ 
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

export default function RefundPolicyPage() {
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
          <span style={{ color: "var(--foreground-secondary)" }}>Refund Policy</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          
          {/* ── Header ── */}
          <header className="text-center mb-24 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[0.7rem] font-bold uppercase tracking-[0.2em] mb-8"
              style={{ background: "rgba(139, 92, 246, 0.08)", color: "#a78bfa", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
              Financial Reconciliation
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-10" style={{ color: "var(--foreground)" }}>
              Refund Policy
            </h1>
            
            <div className="w-24 h-1.5 mx-auto bg-gradient-to-r from-arcane-600 to-arcane-400 rounded-full mb-12 shadow-[0_0_15px_rgba(124,31,255,0.4)]" />
            
            <p className="max-w-2xl mx-auto text-xl leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
              At <strong>Ape Danuma</strong> (em.apedanuma.lk), we are committed to providing the highest quality English Medium study materials. Our refund policy is designed to be fair, transparent, and legally compliant.
            </p>
          </header>

          {/* ── Refund Sections Grid ── */}
          <div className="space-y-10">
            
            {/* 1. Digital Products (Existing) */}
            <RefundCard icon={FileText} title="1. Digital Products and Services" delay="100ms">
              <p>
                Most resources on Ape Danuma, including <strong>PDF Study Notes, Video Tutorials, and Past Paper Databases</strong>, are digital products instantly accessible upon purchase.
              </p>
              <p>
                <strong>No-Refund Policy:</strong> Once a digital product has been accessed or a download link generated, we generally <strong>do not offer refunds, returns, or exchanges</strong>. Digital content is non-returnable by nature.
              </p>
            </RefundCard>

            {/* 2. Exceptional Circumstances (Existing) */}
            <RefundCard icon={AlertTriangle} title="2. Exceptional Refund Conditions" delay="200ms">
              <p>Refunds are considered only under the following strictly defined circumstances:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Technical Corruption:</strong> If a file is corrupted and our support team cannot provide a working replacement within 48 hours of your report.</li>
                <li><strong>Duplicate Charges:</strong> If a gateway error results in multiple charges for the same product.</li>
                <li><strong>Incorrect Delivery:</strong> If the product delivered differs significantly from the description provided.</li>
              </ul>
            </RefundCard>

            {/* 3. Corrupted File Definition (Existing) */}
            <RefundCard icon={FileX} title="3. Definition of Technical Corruption" delay="300ms">
              <p>
                A file is considered "corrupted" if it fails to open in industry-standard software (e.g., Adobe Acrobat) or if major sections are unreadable due to generation errors. Refunds are not issued for "change of mind" or failure to read the product description.
              </p>
            </RefundCard>

            {/* 4. Physical Products (Existing) */}
            <RefundCard icon={Package} title="4. Physical Educational Materials" delay="400ms">
              <p>For any physical materials (e.g., printed workbooks) delivered via courier:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Return Window:</strong> Accepted within 7 days of delivery.</li>
                <li><strong>Condition:</strong> Must be unused, pristine, and without any handwriting or marks.</li>
                <li><strong>Shipping:</strong> User is responsible for return costs unless the item was damaged or incorrect.</li>
              </ul>
            </RefundCard>

            {/* 5. The Refund Process (Existing) */}
            <RefundCard icon={RefreshCw} title="5. The Reconciliation Process" delay="500ms">
              <ol className="list-decimal pl-5 space-y-3">
                <li><strong>Request:</strong> Email support@apedanuma.lk within 3 days of purchase with your Order ID.</li>
                <li><strong>Review:</strong> Our team will verify the claim and attempt to rectify technical issues within 2 business days.</li>
                <li><strong>Initiation:</strong> If approved, the refund is initiated via <strong>PayHere</strong> to your original payment method.</li>
                <li><strong>Timeframe:</strong> Allow 5 to 7 business days for the funds to reflect in your account.</li>
              </ol>
            </RefundCard>

            {/* ── NEW ADVANCED CLAUSES ── */}

            {/* 6. User Technical Responsibility (New) */}
            <RefundCard icon={MonitorSmartphone} title="6. User Technical Responsibility and Compatibility" delay="600ms">
              <p>
                It is the sole responsibility of the User to ensure that their device, operating system, and software (e.g., PDF Readers such as Adobe Acrobat, updated web browsers) are compatible with the digital formats provided by Ape Danuma. 
              </p>
              <p>
                Before making a purchase, users must ensure they have a stable internet connection for downloading digital assets. Ape Danuma does not issue refunds, credits, or exchanges for issues arising from user-side hardware limitations, software incompatibility, or lack of technical proficiency.
              </p>
            </RefundCard>

            {/* 7. Chargeback Abuse & Fraud (New) */}
            <RefundCard icon={ShieldBan} title="7. Chargeback Abuse and Fraudulent Disputes" delay="700ms">
              <p>
                Ape Danuma maintains a zero-tolerance policy towards "Friendly Fraud" and fraudulent chargebacks. If a User initiates a payment dispute or chargeback through their bank or credit card provider for a transaction involving digital goods that have already been accessed or downloaded, Ape Danuma reserves the right to: 
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Immediately and permanently terminate the User's account without a refund.</li>
                <li>Provide the payment gateway (PayHere) and the relevant banking institutions with comprehensive logs proving the digital delivery and access of the goods.</li>
                <li>Pursue legal action for the recovery of the disputed amount and associated administrative fees.</li>
              </ul>
            </RefundCard>

            {/* 8. Gateway Delays (New) */}
            <RefundCard icon={Clock} title="8. Payment Gateway Delays and Bank Reconciliation" delay="800ms">
              <p>
                In instances where funds have been deducted from a User's bank account but the transaction status remains "Pending" or "Failed" on our platform, this is typically due to delays in the inter-bank communication network. 
              </p>
              <p>
                Users are required to wait for the standard bank reconciliation period (typically <strong>2 to 3 business days</strong>) before demanding a refund. If the transaction fails, the bank will automatically revert the funds. Ape Danuma cannot manually accelerate bank-side processing times.
              </p>
            </RefundCard>

            {/* 9. Discretionary Refunds (New) */}
            <RefundCard icon={Gift} title="9. Discretionary Exceptional Refunds" delay="900ms">
              <p>
                Any refunds or credits issued by Ape Danuma outside of the strict criteria defined in this policy are granted solely at the absolute discretion of the management. 
              </p>
              <p>
                The granting of an exceptional refund in a specific case does not constitute a waiver of the No-Refund policy, nor does it establish a binding precedent or obligation for Ape Danuma to provide similar refunds in future cases.
              </p>
            </RefundCard>

            {/* 10. Contact (Existing 6) */}
            <RefundCard icon={Mail} title="10. Support Contact" delay="1000ms">
              <p>
                If you experience any issues accessing your study materials or have questions regarding your transaction, please contact our dedicated support team immediately at <a href="mailto:support@apedanuma.lk" className="text-arcane-400 hover:text-arcane-300 transition-colors underline underline-offset-4">support@apedanuma.lk</a>.
              </p>
            </RefundCard>

          </div>

          {/* ── Metadata Footer ── */}
          <footer className="mt-32 pt-12 border-t border-white/5 text-center animate-fade-in" style={{ animationDelay: "1100ms" }}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 text-sm font-medium mb-6" style={{ color: "var(--foreground-muted)" }}>
              <span>Last Updated: <span className="text-white/60">{LAST_UPDATED}</span></span>
              <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/10" />
              <span>Legal Version: <span className="text-white/60">{LEGAL_VERSION}</span></span>
            </div>
            <p className="text-xs max-w-xl mx-auto leading-relaxed" style={{ color: "var(--foreground-disabled)" }}>
              This policy is designed to comply with standard e-commerce practices and the specific requirements of Sri Lankan financial institutions.
            </p>
          </footer>

        </div>
      </div>
    </main>
  );
}
