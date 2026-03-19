"use client";

import Link from "next/link";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";

interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

interface MobileMenuProps {
  navLinks: NavItem[];
  pathname: string;
  isLoggedIn: boolean;
  userName: string;
  userRole: string;
  isAdmin: boolean;
  initials: string;
  onClose: () => void;
  handleLogout: () => void;
}

function MobileNavLink({
  item,
  isActive,
  index,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  index: number;
  onClick: () => void;
}) {
  return (
    <m.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={item.href}
        className={`flex items-center gap-3 w-full px-5 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/40 group ${
          isActive 
            ? "text-white bg-purple-500/10 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]" 
            : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
        }`}
        onClick={onClick}
      >
        <span
          className={`flex h-1.5 w-1.5 rounded-full shrink-0 transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-br from-purple-400 to-amber-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]"
              : "bg-slate-700"
          }`}
        />
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span
            className="text-[0.6rem] font-black px-2 py-0.5 rounded-full tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30"
          >
            {item.badge}
          </span>
        )}
        <svg
          className={`w-4 h-4 transition-all duration-300 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </m.div>
  );
}

export default function MobileMenu({
  navLinks,
  pathname,
  isLoggedIn,
  userName,
  userRole,
  isAdmin,
  initials,
  onClose,
  handleLogout,
}: MobileMenuProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        <m.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed inset-x-0 top-[68px] bg-slate-950/98 backdrop-blur-3xl border-b border-white/10 shadow-2xl origin-top lg:hidden overflow-hidden"
        >
          <div className="container-xl py-6 pb-8">
            <nav className="flex flex-col gap-1.5 mb-6">
              {navLinks.map((item, i) => (
                <MobileNavLink
                  key={item.href}
                  item={item}
                  isActive={item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)}
                  index={i}
                  onClick={onClose}
                />
              ))}
            </nav>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

            <div className="flex flex-col gap-3 px-1">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-purple-500/10 border border-purple-500/20">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold bg-gradient-to-br from-purple-500 to-purple-800 text-purple-100">
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate text-white">{userName}</p>
                      <p className="text-[0.65rem] font-bold text-purple-400 uppercase tracking-wider">Student</p>
                    </div>
                  </div>
                  <Link
                    href={isAdmin ? "/admin" : "/dashboard"}
                    onClick={onClose}
                    className={`flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold shadow-lg transition-all duration-300 ${
                      isAdmin 
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950" 
                        : "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                    }`}
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-slate-300 bg-white/5 border border-white/10"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={onClose}
                    className="inline-flex items-center justify-center gap-2 font-display font-bold text-sm tracking-wide py-4 rounded-xl text-white bg-gradient-to-br from-purple-500 to-purple-800 border border-purple-500/50 shadow-[0_0_20px_rgba(124,31,255,0.3)] w-full"
                  >
                    Create Free Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  );
}
