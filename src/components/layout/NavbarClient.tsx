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
    <Link href="/" className="flex items-center gap-3 group shrink-0" aria-label="Ape Danuma EM home">
      {/* Icon — Actual brand logo image */}
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

      {/* Wordmark */}
      <span className="flex flex-col leading-none select-none">
        {/* Primary name */}
        <span className="flex items-baseline gap-0 leading-none">
          <span
            className="font-display font-extrabold tracking-tight transition-colors duration-300"
            style={{ fontSize: "0.9375rem", color: "var(--foreground)" }}
          >
            Ape Danuma
          </span>
          <span
            className="font-display font-extrabold tracking-tight ml-1.5 transition-colors duration-300"
            style={{
              fontSize: "0.9375rem",
              background: "linear-gradient(135deg, #9455ff 0%, #7c1fff 60%, #b890ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            EM
          </span>
        </span>
        {/* Sub-tagline */}
        <span
          className="font-medium uppercase tracking-[0.14em] mt-[3px] transition-colors duration-300"
          style={{ fontSize: "0.575rem", color: "var(--foreground-disabled)", letterSpacing: "0.14em" }}
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
      className={`nav-link ${isActive ? "nav-link-active" : ""} flex items-center gap-1.5`}
    >
      {item.label}
      {item.badge && (
        <span
          className="inline-flex items-center text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full tracking-wide uppercase"
          style={{
            background: "linear-gradient(135deg, rgba(124,31,255,0.3), rgba(87,0,190,0.4))",
            color: "#b890ff",
            border: "1px solid rgba(124,31,255,0.35)",
          }}
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
      className={`nav-link-mobile ${isActive ? "nav-link-mobile-active" : ""}`}
      onClick={onClick}
      style={{ animationDelay: `${index * 45}ms`, animation: "navLinkFadeIn 280ms ease forwards" }}
    >
      {/* Dot indicator */}
      <span
        className="flex h-1.5 w-1.5 rounded-full shrink-0 transition-all duration-200"
        style={{
          background: isActive
            ? "linear-gradient(135deg, #9455ff, #f59e0b)"
            : "rgba(255,255,255,0.2)",
          boxShadow: isActive ? "0 0 6px rgba(124,31,255,0.6)" : "none",
        }}
      />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span
          className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase"
          style={{
            background: "rgba(124,31,255,0.2)",
            color: "#b890ff",
            border: "1px solid rgba(124,31,255,0.3)",
          }}
        >
          {item.badge}
        </span>
      )}
      {/* Arrow */}
      <svg
        className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        style={{ color: "var(--foreground-muted)" }}
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
        className="block h-px rounded-full transition-all duration-300 origin-center"
        style={{
          background: "var(--foreground)",
          transform: isOpen ? "translateY(7.5px) rotate(45deg)" : "none",
          width: isOpen ? "100%" : "100%",
        }}
      />
      <span
        className="block h-px rounded-full transition-all duration-200"
        style={{
          background: "var(--foreground)",
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? "scaleX(0)" : "scaleX(1)",
          width: "75%",
        }}
      />
      <span
        className="block h-px rounded-full transition-all duration-300 origin-center"
        style={{
          background: "var(--foreground)",
          transform: isOpen ? "translateY(-7.5px) rotate(-45deg)" : "none",
          width: isOpen ? "100%" : "88%",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Navbar Client
   ───────────────────────────────────────── */
export default function NavbarClient({ initialUser }: { initialUser: { name: string; role: string } | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* ── Auth state ── */
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialUser);
  const [userName, setUserName] = useState(initialUser?.name || "");
  const [userRole, setUserRole] = useState<string>(initialUser?.role || "");

  // Still sync on mount just in case of stale cache, but initial render is now instant
  useEffect(() => {
    if (!initialUser) return;
    setIsLoggedIn(true);
    setUserName(initialUser.name);
    setUserRole(initialUser.role);
  }, [initialUser]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch { /* ignore — still redirect */ }
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

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close on route change */
  useEffect(() => {
    closeMenu();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !toggleRef.current?.contains(e.target as Node)
      ) {
        closeMenu();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeMenu();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Prevent body scroll when mobile menu is open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
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
      className={`nav-glass fixed w-full top-0 z-[100] transition-all duration-300 ${isScrolled ? "nav-scrolled" : ""}`}
      role="banner"
    >
      <div className="container-xl">
        <div className="flex items-center justify-between h-[68px] gap-4">

          {/* ── Logo ── */}
          <Logo />

          {/* ── Desktop center links ── */}
          <nav
            className="hidden lg:flex items-center gap-7 xl:gap-9"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((item) => (
              <DesktopNavLink
                key={item.href}
                item={item}
                isActive={
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)
                }
              />
            ))}
          </nav>

          {/* ── Desktop right actions ── */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {isAdmin ? (
                  /* ── Admin: glowing gold "Admin Dashboard" button ── */
                  <Link
                    href="/admin"
                    className="relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold overflow-hidden transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b]"
                    style={{
                      background: "linear-gradient(135deg, #d97706 0%, #f59e0b 55%, #d97706 100%)",
                      backgroundSize: "200% auto",
                      boxShadow: "0 0 20px rgba(245,158,11,0.35), 0 4px 12px rgba(0,0,0,0.3)",
                      color: "#0a0a0a",
                    }}
                    aria-label="Go to Admin Dashboard"
                  >
                    {/* Shimmer */}
                    <span
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 3s linear infinite",
                      }}
                    />
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true" className="relative z-10">
                      <path d="M6.5 1l1.2 3.2H11L8.4 6.3l1 3.2L6.5 8 4 9.5l1-3.2L2.5 4.2H5.3z" fill="currentColor" />
                    </svg>
                    <span className="relative z-10">Admin Dashboard</span>
                  </Link>
                ) : (
                  /* ── Student: subtle avatar + "Dashboard" link ── */
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 transition-all duration-200 hover:bg-white/[0.06]"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    aria-label="Go to Dashboard"
                  >
                    <span
                      className="flex items-center justify-center w-6 h-6 rounded-lg text-[0.6rem] font-bold"
                      style={{
                        background: "linear-gradient(135deg, rgba(124,31,255,0.35), rgba(87,0,190,0.5))",
                        border: "1px solid rgba(124,31,255,0.4)",
                        color: "#c4a0ff",
                      }}
                    >
                      {initials}
                    </span>
                    <span className="text-sm font-medium" style={{ color: "var(--foreground-secondary)" }}>
                      Dashboard
                    </span>
                  </Link>
                )}

                {/* Divider */}
                <span className="h-4 w-px" style={{ background: "var(--border-strong)" }} aria-hidden="true" />

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  aria-label="Logout"
                  title="Logout"
                  className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 hover:bg-red-500/10 hover:border-red-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
                  style={{ border: "1px solid rgba(255,255,255,0.08)", color: "var(--foreground-muted)" }}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                    <path d="M5.5 1H2.5A1.5 1.5 0 001 2.5v10A1.5 1.5 0 002.5 14h3M10 10.5l3.5-3L10 4M5 7.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                {/* Sign In */}
                <Link href="/login" className="nav-signin">
                  Sign In
                </Link>

                {/* Divider */}
                <span className="h-4 w-px" style={{ background: "var(--border-strong)" }} aria-hidden="true" />

                {/* Register */}
                <Link href="/register" className="btn-register group">
                  <span>Register</span>
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
                  </svg>
                </Link>
              </>
            )}
          </div>

          {/* ── Tablet: just sign-in + register, no links ── */}
          <div className="hidden md:flex lg:hidden items-center gap-3">
            {isLoggedIn ? (
              <>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="relative inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-bold overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background: "linear-gradient(135deg, #d97706 0%, #f59e0b 55%, #d97706 100%)",
                      boxShadow: "0 0 16px rgba(245,158,11,0.3)",
                      color: "#0a0a0a",
                    }}
                    aria-label="Go to Admin Dashboard"
                  >
                    <span
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 3s linear infinite",
                      }}
                    />
                    <svg width="12" height="12" viewBox="0 0 13 13" fill="none" aria-hidden="true" className="relative z-10">
                      <path d="M6.5 1l1.2 3.2H11L8.4 6.3l1 3.2L6.5 8 4 9.5l1-3.2L2.5 4.2H5.3z" fill="currentColor" />
                    </svg>
                    <span className="relative z-10">Admin</span>
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:bg-white/[0.06]"
                    style={{ border: "1px solid rgba(255,255,255,0.08)", color: "var(--foreground-secondary)" }}
                  >
                    <span
                      className="flex items-center justify-center w-6 h-6 rounded-lg text-[0.6rem] font-bold"
                      style={{
                        background: "linear-gradient(135deg, rgba(124,31,255,0.35), rgba(87,0,190,0.5))",
                        border: "1px solid rgba(124,31,255,0.4)",
                        color: "#c4a0ff",
                      }}
                    >
                      {initials}
                    </span>
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 hover:bg-red-500/10"
                  style={{ border: "1px solid rgba(255,255,255,0.08)", color: "var(--foreground-muted)" }}
                  aria-label="Logout"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                    <path d="M5.5 1H2.5A1.5 1.5 0 001 2.5v10A1.5 1.5 0 002.5 14h3M10 10.5l3.5-3L10 4M5 7.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-signin">Sign In</Link>
                <Link href="/register" className="btn-register group">
                  <span>Register</span>
                  <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
                  </svg>
                </Link>
              </>
            )}
          </div>

          {/* ── Hamburger (mobile + tablet nav) ── */}
          <button
            ref={toggleRef}
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane-500"
            style={{
              background: isOpen ? "rgba(124,31,255,0.12)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${isOpen ? "rgba(124,31,255,0.3)" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            <HamburgerIcon isOpen={isOpen} />
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Panel ── */}
      {isOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className={`mobile-menu lg:hidden ${isClosing ? "mobile-menu-close" : "mobile-menu-open"}`}
          aria-label="Mobile navigation"
        >
          <div className="container-xl py-4 pb-6">

            {/* Nav links */}
            <nav className="flex flex-col gap-1 mb-5">
              {NAV_LINKS.map((item, i) => (
                <MobileNavLink
                  key={item.href}
                  item={item}
                  isActive={
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href)
                  }
                  index={i}
                  onClick={closeMenu}
                />
              ))}
            </nav>

            {/* Divider */}
            <div
              className="w-full h-px mb-5"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 40%, rgba(124,31,255,0.2) 60%, transparent)",
              }}
            />

            {/* Auth actions */}
            <div className="flex flex-col gap-3 px-1">
              {isLoggedIn ? (
                <>
                  {/* User info strip */}
                  <div
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ background: "rgba(124,31,255,0.08)", border: "1px solid rgba(124,31,255,0.18)" }}
                  >
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold shrink-0"
                      style={{
                        background: "linear-gradient(135deg, rgba(124,31,255,0.4), rgba(87,0,190,0.55))",
                        border: "1px solid rgba(124,31,255,0.4)",
                        color: "#c4a0ff",
                      }}
                    >
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>{userName}</p>
                      <p className="text-[0.65rem]" style={{ color: "#9455ff" }}>Student</p>
                    </div>
                  </div>

                  {/* Dashboard / Admin link — role-aware */}
                  {isAdmin ? (
                    <Link
                      href="/admin"
                      onClick={closeMenu}
                      className="relative flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold overflow-hidden transition-all duration-200"
                      style={{
                        background: "linear-gradient(135deg, #d97706 0%, #f59e0b 55%, #d97706 100%)",
                        boxShadow: "0 0 22px rgba(245,158,11,0.35)",
                        color: "#0a0a0a",
                      }}
                    >
                      <span
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 3s linear infinite",
                        }}
                      />
                      <svg className="w-4 h-4 relative z-10" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                        <path d="M6.5 1l1.2 3.2H11L8.4 6.3l1 3.2L6.5 8 4 9.5l1-3.2L2.5 4.2H5.3z" fill="currentColor" />
                      </svg>
                      <span className="relative z-10">Go to Admin Dashboard</span>
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      onClick={closeMenu}
                      className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-200"
                      style={{
                        background: "linear-gradient(135deg, #7c1fff 0%, #9455ff 55%, #7c1fff 100%)",
                        boxShadow: "0 0 20px rgba(124,31,255,0.35)",
                        color: "#fff",
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
                        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" />
                        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" />
                        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" />
                        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" />
                      </svg>
                      Go to Dashboard
                    </Link>
                  )}

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all duration-200"
                    style={{
                      color: "#f87171",
                      background: "rgba(239,68,68,0.06)",
                      border: "1px solid rgba(239,68,68,0.18)",
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 15 15" stroke="currentColor" strokeWidth={1.4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 1H2.5A1.5 1.5 0 001 2.5v10A1.5 1.5 0 002.5 14h3M10 10.5l3.5-3L10 4M5 7.5h9" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all duration-200"
                    style={{
                      color: "var(--foreground-secondary)",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="btn-register justify-center py-3.5 rounded-xl text-sm"
                    style={{ width: "100%" }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Create Free Account
                  </Link>
                </>
              )}
            </div>

            {/* Bottom tagline */}
            <p
              className="text-center text-xs mt-5"
              style={{ color: "var(--foreground-disabled)" }}
            >
              {isLoggedIn
                ? <>Signed in as <span style={{ color: "#b890ff" }}>{userName.split(" ")[0]}</span></>
                : <>Join <span style={{ color: "#b890ff" }}>40,000+</span> learners mastering English</>
              }
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
