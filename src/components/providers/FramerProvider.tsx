"use client";

import { LazyMotion } from "framer-motion";

// Technical SEO & Performance: Framer Motion Optimization
// By using dynamic import for domAnimation, we prevent the heavy 
// physics and animation logic from evaluating synchronously on initial load.
const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export default function FramerProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}

