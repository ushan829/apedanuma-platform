import React from "react";
import Link from "next/link";

interface PolicyPageLayoutProps {
  title: string;
  badge: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function PolicyPageLayout({
  title,
  badge,
  lastUpdated,
  children,
}: PolicyPageLayoutProps) {
  return (
    <main className="relative overflow-hidden min-h-screen">
      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: 800,
            height: 600,
            background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="container-xl py-14 sm:py-20">
        {/* ── Breadcrumb ── */}
        <nav
          className="flex items-center gap-2 text-xs mb-10 animate-fade-in"
          aria-label="Breadcrumb"
          style={{ color: "var(--foreground-muted)" }}
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <span style={{ color: "var(--foreground-secondary)" }}>{title}</span>
        </nav>

        <div className="max-w-3xl mx-auto">
          {/* ── Page header ── */}
          <header className="mb-12 animate-fade-up">
            <div className="badge-accent w-fit mb-4">{badge}</div>
            <h1
              className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-6"
              style={{ color: "var(--foreground)" }}
            >
              {title}
            </h1>
            <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
              Last updated:{" "}
              <span style={{ color: "var(--foreground-secondary)" }}>{lastUpdated}</span>
            </p>
          </header>

          {/* ── Content ── */}
          <article className="prose prose-invert prose-purple max-w-none animate-fade-up [animation-delay:100ms]">
            <div className="rich-text-content">
              {children}
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
