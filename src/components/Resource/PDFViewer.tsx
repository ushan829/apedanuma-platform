"use client";

import React, { useState, useEffect } from "react";
import { 
  Worker, 
  Viewer, 
  ScrollMode, 
  SpecialZoomLevel, 
  RenderPageProps,
  RenderPage 
} from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import required styles in the correct order
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import Link from "next/link";
import { Lock, ShoppingCart, AlertCircle, RefreshCcw } from "lucide-react";

interface PDFViewerProps {
  fileUrl: string;
  isPremium?: boolean;
  hasPurchased?: boolean;
  price?: number;
  resourceId?: string;
}

export default function PDFViewer({ 
  fileUrl, 
  isPremium = false, 
  hasPurchased = false,
}: PDFViewerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize plugins
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [], // Hide sidebar to keep it clean
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    setIsLoaded(true);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Teaser logic: Only show first 3 pages if premium and not purchased
  const isTeaser = isPremium && !hasPurchased;

  const renderPage: RenderPage = (props: RenderPageProps) => {
    const showBlur = isTeaser && props.pageIndex >= 3;

    return (
      <div 
        className="rpv-core__page-layer"
        style={{ 
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden"
        }}
      >
        {props.canvasLayer.children}
        {props.textLayer.children}
        {props.annotationLayer.children}
        
        {showBlur && (
          <div 
            className="absolute inset-0 z-20 backdrop-blur-[40px] bg-black/60 flex items-center justify-center p-6 text-center transition-all duration-700"
            style={{ pointerEvents: "auto" }}
          >
            {/* We only show the CTA on the first blurred page (index 3) to avoid redundancy */}
            {props.pageIndex === 3 && (
              <div 
                className="max-w-sm w-full p-10 rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in slide-in-from-bottom-12 duration-1000"
                style={{ 
                  background: "rgba(10, 10, 10, 0.95)",
                  backdropFilter: "blur(24px)",
                }}
              >
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full" />
                    <div className="relative p-5 rounded-3xl bg-purple-500/10 border border-purple-500/20 shadow-[0_0_20px_rgba(148,85,255,0.15)]">
                      <Lock className="text-purple-400" size={40} />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-display font-black mb-4 text-white tracking-tight">Document Locked</h3>
                <p className="text-slate-400 text-[0.95rem] mb-10 leading-relaxed">
                  You are viewing a limited teaser. Purchase this premium resource to unlock all <span className="text-white font-bold">pages</span> and download the high-quality PDF.
                </p>
                
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => {
                      const buyBtn = document.getElementById("buy-button-main");
                      if (buyBtn) buyBtn.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-base font-display font-black transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(135deg, #7c1fff 0%, #9455ff 60%, #7c1fff 100%)",
                      boxShadow: "0 0 30px rgba(124,31,255,0.45), 0 8px 24px rgba(0,0,0,0.3)",
                      color: "#fff"
                    }}
                  >
                    <ShoppingCart size={20} />
                    Unlock Full Access
                  </button>
                  <Link
                    href="/premium-store"
                    className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors py-2"
                  >
                    Explore Premium Store
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!isLoaded) return (
    <div className="w-full rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse" style={{ height: "850px" }} />
  );

  return (
    <div 
      className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.6)] flex flex-col relative"
      style={{ 
        height: isMobile ? "600px" : "850px",
        background: "#0a0a0c",
      }}
    >
      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center gap-4">
          <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertCircle size={32} />
          </div>
          <div className="max-w-xs">
            <h3 className="text-lg font-bold text-white mb-1">Unable to load PDF</h3>
            <p className="text-sm text-slate-400 mb-6">
              There was an issue fetching the document securely from our storage.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <RefreshCcw width={16} height={16} />
              Retry Loading
            </button>
          </div>
        </div>
      ) : (
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
          <div className="flex-1 overflow-hidden relative pdf-viewer-container">
            <Viewer
              fileUrl={fileUrl}
              plugins={isTeaser ? [] : [defaultLayoutPluginInstance]}
              renderPage={renderPage}
              scrollMode={ScrollMode.Vertical}
              defaultScale={SpecialZoomLevel.PageFit}
            />
            
            <style jsx global>{`
              /* Root adjustments to prevent clipping */
              .pdf-viewer-container .rpv-core__viewer {
                background-color: transparent !important;
              }
              .pdf-viewer-container .rpv-core__inner-pages {
                background-color: transparent !important;
                padding: 20px 0 !important;
              }
              /* Style for document pages */
              .pdf-viewer-container .rpv-core__page-container {
                background-color: #fff !important;
                margin: 0 auto 32px auto !important;
                box-shadow: 0 20px 50px rgba(0,0,0,0.5) !important;
                border-radius: 4px !important;
                border: 1px solid rgba(255,255,255,0.05) !important;
              }
              /* Remove default focus borders */
              .rpv-core__page-container:focus {
                outline: none !important;
              }
              /* Scrollbar styling */
              .rpv-core__viewer::-webkit-scrollbar {
                width: 8px;
              }
              .rpv-core__viewer::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.02);
              }
              .rpv-core__viewer::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
              }
              .rpv-core__viewer::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.2);
              }
              /* Prevent scrolling in teaser mode beyond the blur */
              ${isTeaser ? `
                .pdf-viewer-container .rpv-core__viewer {
                  overflow-y: scroll !important;
                }
              ` : ""}
            `}</style>
          </div>
        </Worker>
      )}
    </div>
  );
}
