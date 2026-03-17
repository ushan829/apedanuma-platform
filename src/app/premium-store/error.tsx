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
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 border border-red-500/20">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <h2 className="font-display text-2xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
        Oops! Something went wrong.
      </h2>
      <p className="max-w-md mx-auto mb-8 text-sm sm:text-base" style={{ color: "var(--foreground-secondary)" }}>
        We encountered an error while loading the premium resources. This might be due to a temporary database timeout or connection issue.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => reset()}
          className="btn-primary px-8 py-3"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="btn-ghost px-8 py-3"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
