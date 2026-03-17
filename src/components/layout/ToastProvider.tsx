"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      theme="dark"
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "rgba(10,8,18,0.97)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,31,255,0.08)",
          color: "#e8e2f5",
          fontFamily: "var(--font-inter)",
          fontSize: "0.875rem",
          borderRadius: "14px",
          padding: "14px 18px",
        },
      }}
    />
  );
}
