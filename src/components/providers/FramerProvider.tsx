"use client";

import { LazyMotion, domAnimation } from "framer-motion";

/**
 * Technical SEO & Performance: Framer Motion Optimization
 * 
 * By using LazyMotion and domAnimation, we reduce the initial 
 * JavaScript bundle size significantly. Framer Motion features 
 * are loaded only when needed.
 */
export default function FramerProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
