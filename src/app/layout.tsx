import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Ape Danuma EM — O/L Study Platform for Sri Lanka",
    template: "%s | Ape Danuma EM",
  },
  description:
    "Sri Lanka's premier O/L English Medium study platform. Exam-ready past papers, premium short notes, and expert study guides for Grade 10 & 11 students.",
  keywords: [
    "O/L study materials",
    "English Medium Sri Lanka",
    "past papers grade 10 11",
    "Ape Danuma EM",
    "O/L short notes",
    "Sri Lanka exam preparation",
  ],
  authors: [{ name: "Ape Danuma EM" }],
  creator: "Ape Danuma EM",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Ape Danuma EM — O/L Study Platform for Sri Lanka",
    description:
      "Sri Lanka's premier O/L English Medium study platform. Exam-ready past papers, premium notes, and expert guides for Grade 10 & 11.",
    siteName: "Ape Danuma EM",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ape Danuma EM — O/L Study Platform for Sri Lanka",
    description:
      "Sri Lanka's premier O/L English Medium study platform. Exam-ready past papers, premium notes, and expert guides for Grade 10 & 11.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased">
        {/* Ghibli Touches: Background Clouds */}
        <div className="ghibli-cloud" style={{ top: '15%', width: '300px', height: '150px', animationDelay: '0s' }} />
        <div className="ghibli-cloud" style={{ top: '45%', width: '450px', height: '200px', animationDelay: '-20s' }} />
        <div className="ghibli-cloud" style={{ top: '75%', width: '250px', height: '120px', animationDelay: '-40s' }} />
        
        <Navbar />
        <div className="pt-[68px] min-h-screen flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </div>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(10,8,18,0.97)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,31,255,0.08)",
              color: "#e8e2f5",
              fontFamily: "var(--font-inter)",
              fontSize: "0.875rem",
              borderRadius: "14px",
              padding: "14px 18px",
            },
          }}
        />
        <Script src="https://www.payhere.lk/lib/payhere.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
