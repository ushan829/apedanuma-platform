import Link from "next/link";
import { Facebook, Youtube, MessageCircle, Send, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/5 pt-16 pb-12 lg:pt-20 lg:pb-16" role="contentinfo">
      <div className="container-xl">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between mb-16 lg:mb-20">
          
          {/* ── Brand & Tagline ── */}
          <div className="flex flex-col items-center lg:items-start gap-5 max-w-sm mx-auto lg:mx-0 text-center lg:text-left">
            <Link href="/" className="flex items-center gap-2 group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50" aria-label="Ape Danuma EM Home">
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
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Platform</h3>
              <nav className="flex flex-col gap-3 text-[0.9375rem]" aria-label="Platform links">
                <Link href="/free-resources" className="hover:text-white transition-colors whitespace-nowrap rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50" style={{ color: "var(--foreground-muted)" }}>Free Resources</Link>
                <Link href="/premium-store" className="hover:text-white transition-colors whitespace-nowrap rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50" style={{ color: "var(--foreground-muted)" }}>Premium Store</Link>
                <Link href="/blog" className="hover:text-white transition-colors whitespace-nowrap rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50" style={{ color: "var(--foreground-muted)" }}>The Blog</Link>
              </nav>
            </div>
            <div className="flex flex-col gap-5">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Support</h3>
              <nav className="flex flex-col gap-3 text-[0.9375rem]" aria-label="Support links">
                <Link href="/contact" className="hover:text-white transition-colors whitespace-nowrap rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50" style={{ color: "var(--foreground-muted)" }}>Contact Us</Link>
                <Link href="/about" className="hover:text-white transition-colors whitespace-nowrap rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50" style={{ color: "var(--foreground-muted)" }}>About Us</Link>
                <Link href="/faq" className="hover:text-white transition-colors whitespace-nowrap rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50" style={{ color: "var(--foreground-muted)" }}>FAQs</Link>
              </nav>
            </div>
            <div className="flex flex-col gap-5">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Legal</h3>
              <nav className="flex flex-col gap-3 text-[0.9375rem]" aria-label="Legal links">
                <Link href="/privacy-policy" className="hover:text-white transition-colors whitespace-nowrap rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50" style={{ color: "var(--foreground-muted)" }}>Privacy Policy</Link>
                <Link href="/terms-and-conditions" className="hover:text-white transition-colors whitespace-nowrap rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50" style={{ color: "var(--foreground-muted)" }}>Terms & Conditions</Link>
                <Link href="/refund-policy" className="hover:text-white transition-colors whitespace-nowrap rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50" style={{ color: "var(--foreground-muted)" }}>Refund Policy</Link>
                <Link href="/disclaimer" className="hover:text-white transition-colors whitespace-nowrap rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50" style={{ color: "var(--foreground-muted)" }}>Disclaimer</Link>
              </nav>
            </div>
          </div>

          {/* ── Social Media ── */}
          <div className="flex flex-col gap-6 items-center lg:items-end lg:text-right">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Follow Us</h3>
            <ul className="grid grid-cols-3 gap-3.5" role="list">
              <li>
                <a href="https://whatsapp.com/channel/0029VacAw2rHwXb5SN6oqI0N" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50" aria-label="Follow us on WhatsApp">
                  <MessageCircle size={18} className="text-gray-400 group-hover:text-green-400 transition-colors mx-auto" />
                </a>
              </li>
              <li>
                <a href="https://t.me/ApeDanumaOfficial" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50" aria-label="Join our Telegram channel">
                  <Send size={18} className="text-gray-400 group-hover:text-blue-400 transition-colors mx-auto" />
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@Ape_Danuma" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50" aria-label="Subscribe to our YouTube channel">
                  <Youtube size={18} className="text-gray-400 group-hover:text-red-500 transition-colors mx-auto" />
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@ape_danuma" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50" aria-label="Follow us on TikTok">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="text-gray-400 group-hover:text-white transition-colors">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13 3.23-.2 6.45-.42 9.67-.22 2.14-1.12 4.31-2.9 5.61-2.01 1.54-4.88 1.83-7.15 1.05-2.18-.74-3.99-2.61-4.48-4.89-.59-2.31-.05-4.99 1.54-6.83 1.62-1.92 4.23-2.73 6.64-2.19v4.11c-1.32-.42-2.87-.21-3.95.73-1.07.91-1.39 2.52-1 3.86.35 1.34 1.63 2.37 3.01 2.39 1.55.03 2.94-1.01 3.21-2.52.27-1.47.16-2.96.16-4.44V.02z"/>
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://facebook.com/ApeDanuma" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/50" aria-label="Follow our Facebook page">
                  <Facebook size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors mx-auto" />
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/ape-danuma/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50" aria-label="Connect with us on LinkedIn">
                  <Linkedin size={18} className="text-gray-400 group-hover:text-blue-400 transition-colors mx-auto" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
          <p className="text-[0.8125rem] whitespace-nowrap" style={{ color: "var(--foreground-disabled)" }}>
            © {currentYear} Ape Danuma EM. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[0.8125rem]" style={{ color: "var(--foreground-disabled)" }}>
            <span className="flex items-center justify-center sm:justify-start gap-1.5">
              <span className="w-1 h-1 rounded-full bg-green-500/50" aria-hidden="true"></span>
              Platform Status: Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
