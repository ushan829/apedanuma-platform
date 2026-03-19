"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

/* ─────────────────────────────────────────
   Types
   ───────────────────────────────────────── */
interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

const NAV_LINKS: NavItem[] = [
  { label: "Home",            href: "/" },
  { label: "About",           href: "/about" },
  { label: "Free Resources",  href: "/free-resources" },
  { label: "Premium Store",   href: "/premium-store", badge: "New" },
  { label: "The Blog",        href: "/blog" },
];

/* ─────────────────────────────────────────
   Logo mark
   ───────────────────────────────────────── */
function Logo() {
  return (
    <Link 
      href="/" 
      className="flex items-center gap-3 group shrink-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-[#020617]" 
      aria-label="Ape Danuma EM home"
    >
      <div className="relative transition-all duration-300 group-hover:scale-105 shrink-0">
        <Image 
          src="/logo.webp" 
          alt="Ape Danuma Logo" 
          width={40} 
          height={40} 
          className="rounded-xl object-contain shadow-sm"
          priority
          loading="eager"
        />
      </div>

      <span className="flex flex-col leading-none select-none">
        <span className="flex items-baseline gap-0 leading-none">
          <span
            className="font-display font-extrabold tracking-tight transition-colors duration-300 text-slate-50"
            style={{ fontSize: "0.9375rem" }}
          >
            Ape Danuma
          </span>
          <span
            className="font-display font-extrabold tracking-tight ml-1.5 transition-colors duration-300 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-amber-500"
            style={{ fontSize: "0.9375rem" }}
          >
            EM
          </span>
        </span>
        <span
          className="font-medium uppercase tracking-[0.14em] mt-[3px] transition-colors duration-300 text-slate-500"
          style={{ fontSize: "0.575rem" }}
        >
          O/L · English Medium · Sri Lanka
        </span>
      </span>
    </Link>
  );
}

/* ─────────────────────────────────────────
   Desktop nav link
   ───────────────────────────────────────── */
function DesktopNavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={`relative text-sm font-bold tracking-wide pb-0.5 transition-colors duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-4 focus:ring-offset-[#020617] group ${
        isActive ? "text-white" : "text-slate-400 hover:text-white"
      }`}
    >
      {item.label}
      <span 
        className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-gradient-to-r from-purple-500 to-amber-500 transition-all duration-300 ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`} 
      />
      {item.badge && (
        <span
          className="ml-1.5 inline-flex items-center text-[0.6rem] font-black px-1.5 py-0.5 rounded-full tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

/* ─────────────────────────────────────────
   Mobile nav link
   ───────────────────────────────────────── */
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
    <Link
      href={item.href}
      className={`flex items-center gap-3 w-full px-5 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/40 group ${
        isActive 
          ? "text-white bg-purple-500/10 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]" 
          : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
      }`}
      onClick={onClick}
      style={{ animationDelay: `${index * 45}ms`, animation: "navLinkFadeIn 280ms ease forwards" }}
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
  );
}

/* ─────────────────────────────────────────
   Hamburger / Close icon
   ───────────────────────────────────────── */
function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="relative w-5 h-4 flex flex-col justify-between" aria-hidden="true">
      <span
        className="block h-px rounded-full transition-all duration-300 origin-center bg-white"
        style={{
          transform: isOpen ? "translateY(7.5px) rotate(45deg)" : "none",
        }}
      />
      <span
        className="block h-px rounded-full transition-all duration-200 bg-white"
        style={{
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? "scaleX(0)" : "scaleX(1)",
          width: "75%",
        }}
      />
      <span
        className="block h-px rounded-full transition-all duration-300 origin-center bg-white"
        style={{
          transform: isOpen ? "translateY(-7.5px) rotate(-45deg)" : "none",
          width: isOpen ? "100%" : "88%",
        }}
      />
    </div>
  );
}

export default function NavbarClient({ initialUser }: { initialUser: { name: string; role: string } | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(!!initialUser);
  const [userName, setUserName] = useState(initialUser?.name || "");
  const [userRole, setUserRole] = useState<string>(initialUser?.role || "");

  useEffect(() => {
    if (!initialUser) return;
    setIsLoggedIn(true);
    setUserName(initialUser.name);
    setUserRole(initialUser.role);
  }, [initialUser]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch { /* ignore */ }
    setIsLoggedIn(false);
    setUserName("");
    setUserRole("");
    closeMenu();
    router.push("/");
    router.refresh();
  }

  const isAdmin = userRole === "admin";
  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { closeMenu(); }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && !toggleRef.current?.contains(e.target as Node)) {
        closeMenu();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeMenu();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    if (!isOpen) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  }, [isOpen]);

  const toggleMenu = useCallback(() => {
    if (isOpen) {
      closeMenu();
    } else {
      setIsOpen(true);
    }
  }, [isOpen, closeMenu]);

  return (
    <header
      className={`fixed w-full top-0 z-[100] transition-all duration-300 border-b ${
        isScrolled 
          ? "bg-slate-950/80 backdrop-blur-xl border-white/10 shadow-2xl py-1" 
          : "bg-transparent border-transparent py-2"
      }`}
      role="banner"
    >
      <div className="container-xl">
        <div className="flex items-center justify-between h-[68px] gap-4">
          <Logo />

          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 flex-nowrap shrink-0" aria-label="Main navigation">
            {NAV_LINKS.map((item) => (
              <DesktopNavLink
                key={item.href}
                item={item}
                isActive={item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)}
              />
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  {isAdmin ? (
                    <Link
                      href="/admin"
                      className="relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                      style={{
                        background: "linear-gradient(135deg, #d97706 0%, #f59e0b 55%, #d97706 100%)",
                        boxShadow: "0 0 20px rgba(245,158,11,0.35)",
                        color: "#0a0a0a",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                      <span className="relative z-10">Admin Dashboard</span>
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 transition-all duration-200 bg-white/5 border border-white/10 hover:bg-white/10"
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-lg text-[0.6rem] font-bold bg-gradient-to-br from-purple-500 to-purple-800 text-purple-100 border border-purple-400/30">
                        {initials}
                      </span>
                      <span className="text-sm font-bold text-slate-200">Dashboard</span>
                    </Link>
                  )}
                  <span className="h-4 w-px bg-white/10" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 bg-white/5 border border-white/10 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path d="M5.5 1H2.5A1.5 1.5 0 001 2.5v10A1.5 1.5 0 002.5 14h3M10 10.5l3.5-3L10 4M5 7.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Sign In</Link>
                  <span className="h-4 w-px bg-white/10" />
                  <Link 
                    href="/register" 
                    className="relative inline-flex items-center justify-center gap-2 font-display font-bold text-[0.8125rem] tracking-wider px-5 py-2.5 rounded-xl text-white bg-gradient-to-br from-purple-500 to-purple-800 border border-purple-500/50 shadow-[0_0_16px_rgba(124,31,255,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] group"
                  >
                    <span>Register</span>
                    <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
                    </svg>
                  </Link>
                </>
              )}
            </div>

            <button
              ref={toggleRef}
              onClick={toggleMenu}
              className={`flex lg:hidden items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 border ${
                isOpen ? "bg-purple-500/20 border-purple-500/40" : "bg-white/5 border-white/10"
              }`}
            >
              <HamburgerIcon isOpen={isOpen} />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className={`fixed inset-x-0 top-full bg-slate-950/98 backdrop-blur-3xl border-b border-white/10 shadow-2xl origin-top lg:hidden ${
            isClosing ? "animate-mobileMenuClose" : "animate-mobileMenuOpen"
          }`}
        >
          <div className="container-xl py-6 pb-8">
            <nav className="flex flex-col gap-1.5 mb-6">
              {NAV_LINKS.map((item, i) => (
                <MobileNavLink
                  key={item.href}
                  item={item}
                  isActive={item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)}
                  index={i}
                  onClick={closeMenu}
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
                    onClick={closeMenu}
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
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-slate-300 bg-white/5 border border-white/10"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="inline-flex items-center justify-center gap-2 font-display font-bold text-sm tracking-wide py-4 rounded-xl text-white bg-gradient-to-br from-purple-500 to-purple-800 border border-purple-500/50 shadow-[0_0_20px_rgba(124,31,255,0.3)] w-full"
                  >
                    Create Free Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
