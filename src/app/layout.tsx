import type { Metadata, Viewport } from "next";
import Script from "next/script";
import dynamic from "next/dynamic";
import { inter, poppins } from "./fonts";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackgroundClouds from "@/components/layout/BackgroundClouds";
import BackgroundEffects from "@/components/layout/BackgroundEffects";

const BackToTop = dynamic(() => import("@/components/ui/BackToTop"), { 
  ssr: false 
});

const ToastProvider = dynamic(() => import("@/components/layout/ToastProvider"), { 
  ssr: false 
});

export const metadata: Metadata = {
  title: {
    default: "Ape Danuma EM | Premium English Medium Study Materials",
    template: "%s | Ape Danuma EM",
  },
  description:
    "Empowering Sri Lankan students with the most comprehensive O/L and A/L English Medium study materials, past papers, and expert guidance.",
  keywords: [
    "O/L English Medium",
    "Sri Lanka",
    "Past Papers",
    "Short Notes",
    "Ape Danuma",
    "Science",
    "Mathematics",
  ],
  authors: [{ name: "Ape Danuma EM" }],
  creator: "Ape Danuma EM",
  metadataBase: new URL("https://em.apedanuma.lk"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/logo.webp", type: "image/webp" },
    ],
    apple: [
      { url: "/logo.webp", type: "image/webp" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_LK",
    url: "https://em.apedanuma.lk",
    title: "Ape Danuma EM | Premium English Medium Study Materials",
    description:
      "Empowering Sri Lankan students with the most comprehensive O/L and A/L English Medium study materials, past papers, and expert guidance.",
    siteName: "Ape Danuma EM",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ape Danuma EM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ape Danuma EM | Premium English Medium Study Materials",
    description:
      "Empowering Sri Lankan students with the most comprehensive O/L and A/L English Medium study materials, past papers, and expert guidance.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ape Danuma EM",
    url: "https://em.apedanuma.lk",
    logo: "https://em.apedanuma.lk/logo.webp",
    sameAs: [
      "https://whatsapp.com/channel/0029VacAw2rHwXb5SN6oqI0N",
      "https://t.me/ApeDanumaOfficial",
      "https://www.youtube.com/@Ape_Danuma",
      "https://www.tiktok.com/@ape_danuma",
      "https://facebook.com/ApeDanuma",
      "https://www.linkedin.com/company/ape-danuma/",
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="antialiased selection:bg-purple-500/30 selection:text-white font-sans">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          
          <Navbar />
          
          <div className="pt-[68px] min-h-dvh flex flex-col">
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>

          <BackgroundClouds />
          <BackgroundEffects />
          <ToastProvider />
          <BackToTop />

          {/* ──────────────────────────────────────────────────────────────
              3rd-Party Scripts (Performance Optimized)
              All non-critical scripts use strategy="lazyOnload" to bypass
              the initial critical rendering path.
              ────────────────────────────────────────────────────────────── */}

          {gaId && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="lazyOnload"
              />
              <Script id="google-analytics" strategy="lazyOnload">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `}
              </Script>
            </>
          )}

          {/* PayHere Payment Gateway */}
          <Script
            src="https://www.payhere.lk/lib/payhere.js"
            strategy="lazyOnload"
          />

          {/* Cloudflare Web Analytics (Bypass initial payload) */}
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="lazyOnload"
          />
      </body>
    </html>
  );
}
