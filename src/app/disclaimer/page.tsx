import type { Metadata } from "next";
import Link from "next/link";
import { 
  Scale, 
  BookOpen, 
  Server, 
  AlertCircle, 
  ShieldCheck, 
  ExternalLink 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer | Ape Danuma",
  description: "Official legal disclaimer for Ape Danuma. Ensuring transparency, copyright compliance, and educational integrity.",
};

const LAST_UPDATED = "March 17, 2026";
const LEGAL_VERSION = "1.0.0";

/**
 * Premium Disclaimer Section Card
 */
function DisclaimerCard({ 
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

export default function DisclaimerPage() {
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
          <span style={{ color: "var(--foreground-secondary)" }}>Disclaimer</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          
          {/* ── Header ── */}
          <header className="text-center mb-24 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[0.7rem] font-bold uppercase tracking-[0.2em] mb-8"
              style={{ background: "rgba(139, 92, 246, 0.08)", color: "#a78bfa", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
              Compliance & Transparency
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-10" style={{ color: "var(--foreground)" }}>
              Legal Disclaimer
            </h1>
            
            <div className="w-24 h-1.5 mx-auto bg-gradient-to-r from-arcane-600 to-arcane-400 rounded-full mb-12 shadow-[0_0_15px_rgba(124,31,255,0.4)]" />
            
            <p className="max-w-2xl mx-auto text-xl leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
              Ape Danuma provides these educational resources under a strict legal framework designed to protect the rights of our students, the platform, and our content partners.
            </p>
          </header>

          {/* ── Disclaimer Cards ── */}
          <div className="space-y-10">
            
            {/* 1. Non-Affiliation */}
            <DisclaimerCard icon={Scale} title="1. Official Non-Affiliation" delay="100ms">
              <p>
                <strong>Ape Danuma</strong> is an independent educational platform and is <strong>not affiliated with, endorsed by, or an official partner</strong> of the Department of Examinations, Sri Lanka, or the Ministry of Education. We operate as a third-party service providing supplementary study aids.
              </p>
            </DisclaimerCard>

            {/* 2. Public Domain Resources */}
            <DisclaimerCard icon={BookOpen} title="2. Public Data Usage" delay="200ms">
              <p>
                Government-issued materials, including <strong>Past Examination Papers, Marking Schemes, and Official Syllabuses</strong>, are provided for the convenience of students and are sourced from official public domain outlets.
              </p>
              <p>
                Ape Danuma claims <strong>no copyright or ownership</strong> over these specific documents. They remain the property of the Government of Sri Lanka and are provided on our platform completely free of charge.
              </p>
            </DisclaimerCard>

            {/* 3. Academic & Outcome Liability */}
            <DisclaimerCard icon={AlertCircle} title="3. No Academic Guarantee" delay="300ms">
              <p>
                While our materials are designed to maximize student performance and follow the national O/L syllabus accurately, Ape Danuma makes <strong>no warranties or guarantees</strong> regarding specific examination results or grades.
              </p>
              <p>
                Academic success remains the result of a student's individual dedication, effort, and interpretation of the provided educational materials.
              </p>
            </DisclaimerCard>

            {/* 4. Accuracy & Content Errors */}
            <DisclaimerCard icon={ShieldCheck} title="4. Information Accuracy" delay="400ms">
              <p>
                Educational content is subject to human error and evolving curricula. Ape Danuma shall not be held liable for any <strong>inaccuracies, typographical errors, or misinterpreted data</strong> within our study guides or notes.
              </p>
              <p>
                Content is provided on an "as-is" and "as-available" basis. We encourage students to cross-reference our materials with official textbooks.
              </p>
            </DisclaimerCard>

            {/* 5. Technical Uptime & Access */}
            <DisclaimerCard icon={Server} title="5. Technical Service Disclaimer" delay="500ms">
              <p>
                Access to digital content is subject to server availability and internet infrastructure. We are not liable for any <strong>temporary disruption of service</strong> caused by technical maintenance, power outages, or third-party infrastructure failures beyond our control.
              </p>
            </DisclaimerCard>

            {/* 6. External Linkages */}
            <DisclaimerCard icon={ExternalLink} title="6. Third-Party Links" delay="600ms">
              <p>
                Our platform may contain links to external official government portals or educational websites. We do not exercise control over the content, security policies, or availability of these third-party sites and assume no responsibility for them.
              </p>
            </DisclaimerCard>

          </div>

          {/* ── Metadata Footer ── */}
          <footer className="mt-32 pt-12 border-t border-white/5 text-center animate-fade-in" style={{ animationDelay: "800ms" }}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 text-sm font-medium mb-6" style={{ color: "var(--foreground-muted)" }}>
              <span>Last Updated: <span className="text-white/60">{LAST_UPDATED}</span></span>
              <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/10" />
              <span>Legal Version: <span className="text-white/60">{LEGAL_VERSION}</span></span>
            </div>
            <p className="text-xs max-w-xl mx-auto leading-relaxed" style={{ color: "var(--foreground-disabled)" }}>
              The legal framework of Ape Danuma is designed to comply with the Electronic Transactions Act of Sri Lanka and international intellectual property standards. For formal inquiries, please contact <Link href="/contact" className="text-arcane-400 hover:text-arcane-300 underline underline-offset-4">support@apedanuma.lk</Link>.
            </p>
          </footer>

        </div>
      </div>
    </main>
  );
}
