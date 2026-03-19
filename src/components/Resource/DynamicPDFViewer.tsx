"use client";

import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("./PDFViewer"), {
  ssr: false,
  loading: () => (
    <div 
      className="w-full rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse flex items-center justify-center" 
      style={{ height: "850px" }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        <span className="text-xs text-slate-500 font-medium">Loading document viewer...</span>
      </div>
    </div>
  ),
});

export default PDFViewer;
