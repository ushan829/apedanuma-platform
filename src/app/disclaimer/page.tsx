import { Metadata } from "next";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  Copyright, 
  Scale, 
  Mail, 
  ChevronRight,
  ExternalLink,
  BookOpen,
  FileText
} from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer & Copyright Policy",
  description: "Official legal disclosure and intellectual property rights for Ape Danuma EM educational platform.",
};

export default function DisclaimerPage() {
  return (
    <main className="relative overflow-hidden min-h-screen">
      {/* ── Background Elements ── */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      
      <section className="section-lg relative z-10">
        <div className="container-lg">
          {/* ── Header ── */}
          <div className="text-center mb-16 space-y-4">
            <div className="badge-accent mx-auto w-fit">Legal & Compliance</div>
            <h1 className="text-balance leading-tight">
              Disclaimer & <span className="text-gradient-premium">Copyright Policy</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg" style={{ color: "var(--foreground-secondary)" }}>
              Understanding our commitment to intellectual property rights, educational fair use, 
              and the terms of using our educational materials.
            </p>
            <div className="divider-glow max-w-md mx-auto mt-8 opacity-20" />
          </div>

          <div className="space-y-12">
            {/* ── Section 1: Third-Party Copyrights ── */}
            <div className="card-accent group relative overflow-hidden">
              <div 
                className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10 blur-3xl transition-opacity group-hover:opacity-20"
                style={{ background: "var(--accent-primary)" }}
              />
              
              <div className="flex flex-col md:flex-row gap-8 relative z-10">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Copyright size={28} />
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <h3 className="text-2xl sm:text-3xl font-display font-bold">
                      Acknowledgment of Third-Party Copyrights
                    </h3>
                    <span className="badge bg-white/5 border-white/10 text-white/40 font-normal w-fit shrink-0">
                      Free Resources
                    </span>
                  </div>
                  
                  <div className="prose prose-invert max-w-none space-y-4 text-slate-300">
                    <p>
                      At <strong>Ape Danuma EM</strong>, we respect the intellectual property of others and are committed to legal transparency. Our platform hosts a repository of official educational materials categorized under "Free Resources."
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-white font-medium">
                          <BookOpen size={16} className="text-purple-400" />
                          Official Materials
                        </div>
                        <p className="text-sm">
                          Government Past Papers, Marking Schemes, and Zonal/Provincial Office Term Test Papers.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-white font-medium">
                          <ShieldCheck size={16} className="text-purple-400" />
                          Ownership Disclosure
                        </div>
                        <p className="text-sm">
                          These materials belong exclusively to the <strong>Department of Examinations</strong>, <strong>Ministry of Education</strong>, and respective Schools.
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-3 pt-4 list-none pl-0">
                      {[
                        "Ape Danuma does NOT claim any copyright or ownership over these official government materials.",
                        "Materials are provided for non-commercial, educational purposes strictly under the 'Fair Use' doctrine to assist Sri Lankan students.",
                        "We act as a secondary host and aggregator to ensure easy access to these public educational assets for students nationwide.",
                        "All official logos, seals, and identifying marks of government entities remain the property of their respective departments."
                      ].map((item, idx) => (
                        <li key={idx} className="flex gap-3 items-start">
                          <ChevronRight size={18} className="text-purple-500 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 2: Ape Danuma Exclusive IP ── */}
            <div className="card group relative overflow-hidden" style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
              <div 
                className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-5 blur-3xl transition-opacity group-hover:opacity-10"
                style={{ background: "var(--accent-secondary)" }}
              />
              
              <div className="flex flex-col md:flex-row gap-8 relative z-10">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Lock size={28} />
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <h3 className="text-2xl sm:text-3xl font-display font-bold">
                      Exclusive Intellectual Property
                    </h3>
                    <span className="badge bg-amber-500/10 border-amber-500/20 text-amber-400 font-normal w-fit shrink-0">
                      Premium Store
                    </span>
                  </div>
                  
                  <div className="prose prose-invert max-w-none space-y-4 text-slate-300">
                    <p>
                      All original content, designs, and curated materials available for purchase in our <Link href="/premium-store" className="text-amber-400 hover:underline">Premium Store</Link> are the exclusive property of <strong>Ape Danuma EM</strong>.
                    </p>

                    <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl border-dashed">
                      <p className="text-amber-200/90 font-medium mb-3">The following are protected under Intellectual Property Laws:</p>
                      <div className="flex flex-wrap gap-2">
                        {["Custom Short Notes", "Proprietary Tutorials", "Ape Danuma Study Guides", "Original Illustrations", "Site Interface Design"].map((tag) => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500/80 text-xs border border-amber-500/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-red-400/80 font-medium italic pt-2">
                      Unauthorized reproduction, distribution, digital sharing, resale, or translation of these premium materials into any other language is strictly prohibited and constitutes a violation of copyright law.
                    </p>
                    
                    <p>
                      By purchasing or accessing premium materials, you are granted a single-user, non-transferable license for personal study only. We actively monitor for unauthorized distribution and reserve the right to pursue legal action against copyright infringement.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 3: General Liability Disclaimer ── */}
            <div className="card group relative overflow-hidden">
              <div className="flex flex-col md:flex-row gap-8 relative z-10">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                    <AlertCircle size={28} />
                  </div>
                </div>
                
                <div className="space-y-5">
                  <h3 className="text-2xl sm:text-3xl font-display font-bold">General Liability Disclaimer</h3>
                  
                  <div className="prose prose-invert max-w-none space-y-4 text-slate-400 text-sm leading-relaxed">
                    <p>
                      The information and materials provided on <strong>Ape Danuma EM</strong> are intended for general educational assistance only. While we strive for accuracy, all free materials are provided <span className="text-white">"as is"</span> without any warranties, express or implied.
                    </p>
                    
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4">
                      <Scale size={24} className="text-slate-500 flex-shrink-0 mt-1" />
                      <p>
                        Students and users are strongly advised to verify exam structures, marking guidelines, and syllabus changes with official school teachers, government circulars, or the official website of the Department of Examinations, Sri Lanka.
                      </p>
                    </div>
                    
                    <p>
                      <strong>Ape Danuma EM</strong>, its team members, and creators shall not be held liable for any discrepancies, errors in materials, or any consequences resulting from the use of the information hosted on this platform. Education is an evolving field; always prioritize the latest official government directives.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Contact Section ── */}
            <div className="pt-8">
              <div 
                className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(124,31,255,0.08) 0%, rgba(10,10,10,0.5) 100%)",
                  border: "1px solid rgba(124,31,255,0.15)",
                }}
              >
                <div className="relative z-10 space-y-6">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="text-purple-400" size={32} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold">Copyright Concerns or Removal Requests?</h3>
                  <p className="max-w-lg mx-auto text-slate-400">
                    If you are a copyright owner or an official representative and believe any material 
                    hosted here infringes your rights, please contact us for immediate review.
                  </p>
                  <div className="flex justify-center pt-4">
                    <a 
                      href="mailto:contact@apedanuma.lk" 
                      className="btn-primary px-8 py-3 flex items-center gap-2"
                    >
                      <Mail size={18} />
                      contact@apedanuma.lk
                    </a>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-6 pt-6 text-xs text-slate-500">
                    <div className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                      <ExternalLink size={14} />
                      <a href="https://www.doenets.lk" target="_blank" rel="noopener noreferrer">Department of Examinations</a>
                    </div>
                    <div className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                      <ExternalLink size={14} />
                      <a href="https://www.moe.gov.lk" target="_blank" rel="noopener noreferrer">Ministry of Education</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Ape Danuma EM. All Rights Reserved. Supporting English Medium students across Sri Lanka.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
