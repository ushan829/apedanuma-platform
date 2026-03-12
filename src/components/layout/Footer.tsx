"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/5 pt-16 pb-12 lg:pt-20 lg:pb-16">
      <div className="container-xl">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between mb-16 lg:mb-20">
          
          {/* ── Brand & Tagline ── */}
          <div className="flex flex-col items-center lg:items-start gap-5 max-w-sm mx-auto lg:mx-0 text-center lg:text-left">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-display font-black text-2xl tracking-tight">
                <span style={{ color: "var(--foreground)" }}>Ape Danuma</span>
                <span
                  style={{
                    background: "linear-gradient(135deg, #9455ff 0%, #7c1fff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginLeft: "8px"
                  }}
                >
                  EM
                </span>
              </span>
            </Link>
            <p className="text-[0.9375rem] leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
              Empowering Sri Lankan students with the most comprehensive English Medium study materials and expert guidance.
            </p>
          </div>

          {/* ── Quick Links ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-10 lg:gap-x-16 items-start text-center sm:text-left">
            <div className="flex flex-col gap-5">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Platform</h4>
              <nav className="flex flex-col gap-3 text-[0.9375rem]">
                <Link href="/free-resources" className="hover:text-white transition-colors whitespace-nowrap" style={{ color: "var(--foreground-muted)" }}>Free Resources</Link>
                <Link href="/premium-store" className="hover:text-white transition-colors whitespace-nowrap" style={{ color: "var(--foreground-muted)" }}>Premium Store</Link>
                <Link href="/blog" className="hover:text-white transition-colors whitespace-nowrap" style={{ color: "var(--foreground-muted)" }}>The Blog</Link>
              </nav>
            </div>
            <div className="flex flex-col gap-5">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Support</h4>
              <nav className="flex flex-col gap-3 text-[0.9375rem]">
                <Link href="/contact" className="hover:text-white transition-colors whitespace-nowrap" style={{ color: "var(--foreground-muted)" }}>Contact Us</Link>
                <Link href="/about" className="hover:text-white transition-colors whitespace-nowrap" style={{ color: "var(--foreground-muted)" }}>About Us</Link>
                <Link href="/faq" className="hover:text-white transition-colors whitespace-nowrap" style={{ color: "var(--foreground-muted)" }}>FAQs</Link>
              </nav>
            </div>
            <div className="flex flex-col gap-5">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Legal</h4>
              <nav className="flex flex-col gap-3 text-[0.9375rem]">
                <Link href="/privacy" className="hover:text-white transition-colors whitespace-nowrap" style={{ color: "var(--foreground-muted)" }}>Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors whitespace-nowrap" style={{ color: "var(--foreground-muted)" }}>Terms of Service</Link>
              </nav>
            </div>
          </div>

          {/* ── Social Media ── */}
          <div className="flex flex-col gap-6 items-center lg:items-end lg:text-right">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Follow Us</h4>
            <div className="flex items-center justify-center lg:justify-end gap-3.5">
              <a href="#" className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group" aria-label="WhatsApp">
                <MessageCircle size={18} className="text-gray-400 group-hover:text-green-400 transition-colors" />
              </a>
              <a href="#" className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group" aria-label="YouTube">
                <Youtube size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
              </a>
              <a href="#" className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group" aria-label="Facebook">
                <Facebook size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              </a>
              <a href="#" className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group" aria-label="Instagram">
                <Instagram size={18} className="text-gray-400 group-hover:text-pink-500 transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
          <p className="text-[0.8125rem] whitespace-nowrap" style={{ color: "var(--foreground-disabled)" }}>
            © {currentYear} Ape Danuma EM. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[0.8125rem]" style={{ color: "var(--foreground-disabled)" }}>
            <span className="flex items-center justify-center sm:justify-start gap-1.5">
              <span className="w-1 h-1 rounded-full bg-green-500/50"></span>
              Platform Status: Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
