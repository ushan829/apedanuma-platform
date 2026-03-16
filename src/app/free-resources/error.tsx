"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

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
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
        <AlertCircle size={40} />
      </div>
      
      <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3 text-white">
        Oops! Something went wrong
      </h2>
      <p className="text-slate-400 max-w-md mb-10 leading-relaxed">
        We encountered an error while loading the resources. This could be a temporary connection issue with our database.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-white text-black font-bold transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <RotateCcw size={18} />
          Try Again
        </button>
        
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold transition-colors hover:bg-white/10"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </div>
      
      {error.digest && (
        <p className="mt-8 text-[0.65rem] text-slate-600 font-mono">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
