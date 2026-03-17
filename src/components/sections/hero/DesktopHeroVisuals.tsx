"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { LazyMotion, domAnimation } from "framer-motion";

// Dynamically import the heavy animated components
const RotatingStats = dynamic(() => import("./RotatingStats"), { ssr: false });
const UltraPremiumDashboard = dynamic(() => import("./UltraPremiumDashboard"), { ssr: false });

export default function DesktopHeroVisuals({ type }: { type: "stats" | "dashboard" }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  if (!isDesktop) return null;

  return (
    <LazyMotion features={domAnimation} strict>
      {type === "stats" ? <RotatingStats /> : <UltraPremiumDashboard />}
    </LazyMotion>
  );
}
