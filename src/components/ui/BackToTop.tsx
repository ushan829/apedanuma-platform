"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down 400px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-void-950/80 backdrop-blur-md border border-arcane-500/30 text-arcane-400 shadow-arcane-sm hover:shadow-arcane-md hover:border-arcane-400 hover:text-white transition-colors group"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-arcane-600/10 to-luminary-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <ArrowUp className="w-6 h-6 relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
