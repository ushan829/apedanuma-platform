"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Plus, 
  Minus, 
  MessageCircle, 
  ChevronRight, 
  HelpCircle,
  CreditCard,
  BookOpen,
  Zap
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   FAQ Data
   ───────────────────────────────────────────────────────────── */
interface FAQItem {
  question: string;
  answer: string;
  category: "General" | "Payments" | "Study Material" | "AI Study Buddy";
}

const FAQ_DATA: FAQItem[] = [
  {
    category: "General",
    question: "How do I create an account on Ape Danuma EM?",
    answer: "Creating an account is simple and free. Just click the 'Register' button in the top navigation bar, enter your name, email, and choose a password. Once registered, you can immediately access our library of free resources."
  },
  {
    category: "General",
    question: "Is Ape Danuma EM only for English Medium students?",
    answer: "Yes, our platform is specifically designed and curated for Sri Lankan G.C.E. O/L students studying in the English Medium. All our notes, past papers, and study guides follow the local English Medium syllabus."
  },
  {
    category: "Study Material",
    question: "How do I access my purchased PDFs?",
    answer: "After completing a purchase, your materials are instantly added to your personal Dashboard. Simply log in, go to 'My Materials' or 'Downloads', and you'll find all your premium PDFs ready for viewing or downloading."
  },
  {
    category: "Study Material",
    question: "Can I download the materials on multiple devices?",
    answer: "Absolutely. Once you've purchased a study pack or downloaded a free resource, you can access it on your laptop, tablet, or smartphone. Just log in with your account on any device to view your library."
  },
  {
    category: "Payments",
    question: "Is my payment secure with PayHere?",
    answer: "Yes, we use PayHere, Sri Lanka's leading and most secure payment gateway. Your payment details are encrypted and processed through their secure servers. We never store your credit card or bank information on our platform."
  },
  {
    category: "Payments",
    question: "What payment methods do you accept?",
    answer: "Through PayHere, we accept a wide range of payment methods including all major Credit/Debit cards (Visa, Mastercard), Mobile Wallets (Frimi, Genie), and even Internet Banking transfers."
  },
  {
    category: "AI Study Buddy",
    question: "How does the BrainUs AI Study Buddy help me?",
    answer: "BrainUs is your 24/7 AI tutor. It's trained on the Sri Lankan O/L curriculum and can help you explain complex concepts, solve mathematics problems step-by-step, and even provide summaries of long history lessons in seconds."
  },
  {
    category: "AI Study Buddy",
    question: "Is the AI Study Buddy included in the free plan?",
    answer: "We offer a limited number of free daily queries to the BrainUs AI Study Buddy for all registered users. For unlimited access and advanced features, you can upgrade to our Premium Study Packs."
  }
];

/* ─────────────────────────────────────────────────────────────
   Components
   ───────────────────────────────────────────────────────────── */

function AccordionItem({ item, isOpen, toggle }: { item: FAQItem; isOpen: boolean; toggle: () => void }) {
  return (
    <div 
      className={`group rounded-2xl border transition-all duration-300 ${
        isOpen ? "bg-white/[0.04] border-white/20" : "bg-white/[0.02] border-white/5 hover:border-white/10"
      }`}
    >
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between p-5 text-left focus:outline-none"
      >
        <span className={`text-base font-medium transition-colors ${isOpen ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
          {item.question}
        </span>
        <span className={`ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${isOpen ? "bg-[#9455ff] text-white rotate-180" : "bg-white/5 text-slate-400 group-hover:bg-white/10"}`}>
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-5 pb-5">
              <div className="h-px w-full bg-white/5 mb-4" />
              <p className="text-[0.9375rem] leading-relaxed text-slate-400">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_DATA;
    const lowerQuery = searchQuery.toLowerCase();
    return FAQ_DATA.filter(
      (item) => 
        item.question.toLowerCase().includes(lowerQuery) || 
        item.answer.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const categories = ["General", "Study Material", "Payments", "AI Study Buddy"] as const;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "General": return <HelpCircle size={18} />;
      case "Payments": return <CreditCard size={18} />;
      case "Study Material": return <BookOpen size={18} />;
      case "AI Study Buddy": return <Zap size={18} />;
      default: return <ChevronRight size={18} />;
    }
  };

  return (
    <main className="relative min-h-screen pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
      
      {/* ── Background Decorative ── */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* Glows */}
        <div className="absolute top-1/4 -left-20 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 h-[500px] w-[500px] rounded-full bg-amber-500/5 blur-[100px]" />
        
        {/* Dot grid */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="faq-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#faq-dots)" />
        </svg>
      </div>

      <div className="container-xl relative z-10">
        
        {/* ── Header ── */}
        <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="badge-accent mx-auto w-fit mb-6"
          >
            Support Center
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-8"
          >
            Frequently Asked <span className="text-gradient-premium">Questions</span>
          </motion.h1>
          
          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="relative max-w-xl mx-auto"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-slate-500" size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search for answers (e.g., payments, PDFs, BrainUs...)"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#9455ff]/40 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>

        {/* ── FAQ Content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-16 items-start">
          
          {/* Sidebar Navigation (Desktop) */}
          <aside className="hidden lg:flex flex-col gap-2 sticky top-32">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 px-4">Categories</p>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  const el = document.getElementById(`category-${cat}`);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/5 text-slate-400 hover:text-white"
              >
                <span className="text-[#9455ff]">{getCategoryIcon(cat)}</span>
                {cat}
              </button>
            ))}
          </aside>

          {/* Questions List */}
          <div className="flex flex-col gap-16">
            {filteredData.length === 0 ? (
              <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-white/5 border-dashed">
                <HelpCircle size={48} className="mx-auto text-slate-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                <p className="text-slate-400">Try adjusting your search terms or contact us for help.</p>
              </div>
            ) : (
              categories.map((category) => {
                const categoryItems = filteredData.filter(item => item.category === category);
                if (categoryItems.length === 0) return null;

                return (
                  <section key={category} id={`category-${category}`} className="scroll-mt-32">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#9455ff]/10 border border-[#9455ff]/20 text-[#9455ff]">
                        {getCategoryIcon(category)}
                      </div>
                      <h2 className="text-2xl font-bold font-display">{category}</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                      {categoryItems.map((item, idx) => {
                        const globalIdx = FAQ_DATA.findIndex(i => i.question === item.question);
                        return (
                          <AccordionItem 
                            key={globalIdx} 
                            item={item} 
                            isOpen={openIndex === globalIdx}
                            toggle={() => setOpenIndex(openIndex === globalIdx ? null : globalIdx)}
                          />
                        );
                      })}
                    </div>
                  </section>
                );
              })
            )}
          </div>
        </div>

        {/* ── Still Have Questions Section ── */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 lg:mt-32 rounded-[2rem] p-8 lg:p-12 text-center relative overflow-hidden group"
          style={{
            background: "linear-gradient(145deg, rgba(124,31,255,0.08), rgba(10,10,10,0.8))",
            border: "1px solid rgba(124,31,255,0.2)"
          }}
        >
          {/* Subtle glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] bg-[#9455ff]/10 blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-black mb-4">Still have questions?</h2>
            <p className="text-slate-400 mb-10 text-lg">
              Can't find the answer you're looking for? Reach out to our dedicated support team 
              and we'll get back to you within 24 hours.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/contact" 
                className="btn-primary w-full sm:w-auto px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 group"
              >
                Contact Support
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#" 
                className="btn-outline-accent w-full sm:w-auto px-8 py-3.5 rounded-xl flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                WhatsApp Support
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
