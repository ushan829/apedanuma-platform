"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center max-w-md">
        <div 
          className="flex items-center justify-center w-20 h-20 rounded-2xl mb-8"
          style={{ 
            background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(185,28,28,0.2))",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#f87171"
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="font-display font-bold text-3xl mb-3" style={{ color: "var(--foreground)" }}>
          Something went wrong
        </h1>
        
        <p className="text-base mb-8 leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
          An unexpected error occurred while loading this page. We have been notified and are looking into it.
        </p>
        
        <div className="flex gap-4">
          <button 
            onClick={() => reset()} 
            className="btn-primary"
            style={{ background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)", boxShadow: "0 0 20px rgba(239,68,68,0.3)" }}
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}