"use client";

import React, { useState } from "react";
import { Loader2, Download } from "lucide-react";

interface DownloadButtonProps {
  resourceId: string;
  resourceTitle: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ resourceId, resourceTitle }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);

    try {
      // Direct Download approach - better for mobile RAM and reliability
      const downloadUrl = `/api/download/${resourceId}`;
      
      // Detection: mobile or specifically iOS/Safari
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      if (isMobile || isSafari) {
        // MOBILE STRATEGY: 
        // Use window.open for iOS/Safari to avoid async download blocks.
        // This opens the PDF in a new tab where native mobile PDF viewers take over.
        const newWindow = window.open(downloadUrl, "_blank");
        
        // Fallback if window.open is blocked by popup blocker
        if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
          window.location.href = downloadUrl;
        }
      } else {
        // PC STRATEGY:
        // Use a temporary hidden anchor tag for a seamless download experience.
        const link = document.createElement("a");
        link.href = downloadUrl;
        
        // Generate a clean filename
        const filename = `${resourceTitle.replace(/[^a-z0-9\s-]/gi, "").replace(/\s+/g, "-")}.pdf`;
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
        }, 100);
      }

      // LOADING STATE TIMING:
      // Ensure the loading state remains active long enough (2s) to cover 
      // the browser's internal processing and file handover.
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Download error:", error);
      // Absolute fallback if the above fails
      window.location.href = `/api/download/${resourceId}`;
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 font-bold text-sm transition-all duration-300 ${
        isDownloading ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-1 active:scale-[0.98]"
      }`}
      style={{
        background: "linear-gradient(135deg, #7c1fff 0%, #9455ff 60%, #7c1fff 100%)",
        backgroundSize: "200% auto",
        boxShadow: isDownloading 
          ? "0 4px 12px rgba(0,0,0,0.2)" 
          : "0 0 28px rgba(124,31,255,0.45), 0 4px 16px rgba(0,0,0,0.35)",
        color: "#fff",
        border: "none",
        cursor: isDownloading ? "not-allowed" : "pointer",
      }}
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Preparing Download...
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 2v8M5 7l3 4 3-4M2 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Download PDF — Free
        </>
      )}
    </button>
  );
};

export default DownloadButton;
