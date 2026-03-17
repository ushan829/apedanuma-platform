"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Corrected relative paths: this file is already in the 'hero' folder
const RotatingStats = dynamic(() => import("./RotatingStats"), { 
  ssr: false,
});

const UltraPremiumDashboard = dynamic(() => import("./UltraPremiumDashboard"), { 
  ssr: false,
});

/**
 * DesktopAnimationWrapper: ONLY renders children if window width >= 1024px (lg).
 * This ensures the Framer Motion bundle is NOT parsed/executed on mobile.
 */
export default function DesktopAnimationWrapper({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check initial size
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024);
    checkSize();
    
    // Add event listener
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  if (!isDesktop) return null;
  return <>{children}</>;
}
