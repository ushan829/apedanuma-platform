"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/5 py-12 lg:py-16">
      <div className="container-xl">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          
          {/* ── Brand & Tagline ── */}
          <div className="flex flex-col gap-4 max-w-sm">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-display font-black text-xl tracking-tight">
                <span style={{ color: "var(--foreground)" }}>Ape Danuma</span>
                <span
                  style={{
                    background: "linear-gradient(135deg, #9455ff 0%, #7c1fff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginLeft: "6px"
                  }}
                >
                  EM
                </span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
              Empowering Sri Lankan students with the most comprehensive English Medium study materials and expert guidance.
            </p>
          </div>

          {/* ── Quick Links ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-16">
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-white">Platform</h4>
              <nav className="flex flex-col gap-2.5 text-sm">
                <Link href="/free-resources" className="hover:text-white transition-colors" style={{ color: "var(--foreground-muted)" }}>Free Resources</Link>
                <Link href="/premium-store" className="hover:text-white transition-colors" style={{ color: "var(--foreground-muted)" }}>Premium Store</Link>
                <Link href="/blog" className="hover:text-white transition-colors" style={{ color: "var(--foreground-muted)" }}>The Blog</Link>
              </nav>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-white">Support</h4>
              <nav className="flex flex-col gap-2.5 text-sm">
                <Link href="/contact" className="hover:text-white transition-colors" style={{ color: "var(--foreground-muted)" }}>Contact Us</Link>
                <Link href="/about" className="hover:text-white transition-colors" style={{ color: "var(--foreground-muted)" }}>About Us</Link>
                <Link href="/faq" className="hover:text-white transition-colors" style={{ color: "var(--foreground-muted)" }}>FAQs</Link>
              </nav>
            </div>
            <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
              <h4 className="text-sm font-bold uppercase tracking-widest text-white">Legal</h4>
              <nav className="flex flex-col gap-2.5 text-sm">
                <Link href="/privacy" className="hover:text-white transition-colors" style={{ color: "var(--foreground-muted)" }}>Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors" style={{ color: "var(--foreground-muted)" }}>Terms of Service</Link>
              </nav>
            </div>
          </div>

          {/* ── Social Media ── */}
          <div className="flex flex-col gap-5 lg:items-end">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white lg:text-right">Follow Us</h4>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group" aria-label="WhatsApp">
                <MessageCircle size={20} className="text-gray-400 group-hover:text-green-400 transition-colors" />
              </a>
              <a href="#" className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group" aria-label="YouTube">
                <Youtube size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
              </a>
              <a href="#" className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group" aria-label="Facebook">
                <Facebook size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              </a>
              <a href="#" className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group" aria-label="Instagram">
                <Instagram size={20} className="text-gray-400 group-hover:text-pink-500 transition-colors" />
              </a>
            </div>
            <p className="text-[0.8rem] lg:text-right mt-4" style={{ color: "var(--foreground-disabled)" }}>
              © {currentYear} Ape Danuma EM. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
