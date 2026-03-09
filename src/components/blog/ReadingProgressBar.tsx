"use client";

import { useState, useEffect } from "react";

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      if (scrollHeight <= 0) { setProgress(100); return; }
      setProgress(Math.min(100, (scrollTop / scrollHeight) * 100));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none"
      style={{ background: "rgba(255,255,255,0.05)" }}
    >
      <div
        className="h-full"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #7c1fff 0%, #9455ff 55%, #f59e0b 100%)",
          boxShadow: "0 0 10px rgba(148,85,255,0.7), 0 0 3px rgba(245,158,11,0.4)",
          transition: "width 80ms linear",
        }}
      />
    </div>
  );
}
