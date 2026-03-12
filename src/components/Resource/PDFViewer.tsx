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
import { Lock, ShoppingCart } from "lucide-react";

interface PDFViewerProps {
  fileUrl: string;
  isPremium?: boolean;
  hasPurchased?: boolean;
  price?: number;
}

export default function PDFViewer({ 
  fileUrl, 
  isPremium = false, 
  hasPurchased = false,
  price = 0,
}: PDFViewerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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
            className="absolute inset-0 z-20 backdrop-blur-xl bg-black/40 flex items-center justify-center p-6 text-center transition-all duration-700"
            style={{ pointerEvents: "auto" }}
          >
            {/* We only show the CTA on the first blurred page (index 3) to avoid redundancy */}
            {props.pageIndex === 3 && (
              <div 
                className="max-w-sm w-full p-8 rounded-3xl border border-white/10 shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-8 duration-700"
                style={{ 
                  background: "rgba(10, 10, 10, 0.9)",
                  backdropFilter: "blur(32px)",
                }}
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 shadow-[0_0_20px_rgba(148,85,255,0.1)]">
                    <Lock className="text-purple-400" size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-display font-black mb-3 text-white tracking-tight">Full Document Locked</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  You are viewing a teaser. Purchase this premium resource to unlock all pages and download the high-quality PDF.
                </p>
                
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      const buyBtn = document.getElementById("buy-button-main");
                      if (buyBtn) buyBtn.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(135deg, #7c1fff 0%, #9455ff 60%, #7c1fff 100%)",
                      boxShadow: "0 0 24px rgba(124,31,255,0.4), 0 4px 12px rgba(0,0,0,0.3)",
                      color: "#fff"
                    }}
                  >
                    <ShoppingCart size={18} />
                    Buy Now — LKR {price.toLocaleString()}
                  </button>
                  <Link
                    href="/premium-store"
                    className="text-xs font-semibold text-slate-500 hover:text-white transition-colors py-2"
                  >
                    View more premium packs
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
    </div>
  );
}
