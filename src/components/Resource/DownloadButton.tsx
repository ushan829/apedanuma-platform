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
      const response = await fetch(`/api/download/${resourceId}`);
      
      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      // Extract filename from Content-Disposition header if available
      const contentDisposition = response.headers.get("content-disposition");
      let filename = `${resourceTitle.replace(/[^a-z0-9\s-]/gi, "").replace(/\s+/g, "-")}.pdf`;
      
      if (contentDisposition && contentDisposition.includes("filename=")) {
        const match = contentDisposition.match(/filename="?(.+?)"?$/);
        if (match && match[1]) {
          filename = decodeURIComponent(match[1]);
        }
      }

      // Convert response to blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      // Fallback: if fetch fails, try direct link as last resort
      const link = document.createElement("a");
      link.href = `/api/download/${resourceId}`;
      link.download = "";
      link.click();
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
