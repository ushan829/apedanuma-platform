"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BuySectionProps {
  resourceId: string;
  price: number;
}

type PurchaseState = "loading" | "not-purchased" | "purchased";
type DownloadState = "idle" | "downloading" | "error";

interface PayHerePayment {
  sandbox: boolean;
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  order_id: string;
  items: string;
  amount: string;
  currency: string;
  hash: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

declare global {
  interface Window {
    payhere: {
      onCompleted: (orderId: string) => void;
      onDismissed: () => void;
      onError: (error: string) => void;
      startPayment: (payment: PayHerePayment) => void;
    };
  }
}

export default function BuySection({ resourceId, price }: BuySectionProps) {
  const [state, setState] = useState<PurchaseState>("loading");
  const [downloadState, setDownloadState] = useState<DownloadState>("idle");
  const router = useRouter();

  async function handlePurchase() {
    setState("loading");
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error("Checkout Failed", { description: data.message || "Could not initiate payment." });
        setState("not-purchased");
        return;
      }

      const { 
        orderId, 
        hash, 
        amount, 
        merchantId, 
        currency, 
        environment, 
        return_url,
        cancel_url,
        notify_url,
        user, 
        itemTitle 
      } = await res.json();

      const payment: PayHerePayment = {
        sandbox: environment === "sandbox",
        merchant_id: merchantId,
        return_url: return_url,
        cancel_url: cancel_url,
        notify_url: notify_url,
        order_id: orderId,
        items: itemTitle || "Premium Resource",
        amount: amount,
        currency: currency,
        hash: hash,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        address: "Sri Lanka",
        city: "Colombo",
        country: "Sri Lanka",
      };

      if (!window.payhere) {
        toast.error("Payment Gateway Error", { description: "PayHere SDK not loaded." });
        setState("not-purchased");
        return;
      }

      window.payhere.onCompleted = function onCompleted() {
        toast.success("Payment Successful!", { description: "Your resource is now unlocked." });
        setState("purchased");
        router.refresh();
      };

      window.payhere.onDismissed = function onDismissed() {
        toast.error("Payment Cancelled", { description: "You closed the payment window." });
        setState("not-purchased");
      };

      window.payhere.onError = function onError(error: string) {
        toast.error("Payment Error", { description: error });
        setState("not-purchased");
      };

      window.payhere.startPayment(payment);
    } catch (err: unknown) {
      console.error("[Purchase] Network error:", err);
      toast.error("Network Error", { description: "Failed to connect to the server." });
      setState("not-purchased");
    }
  }

  async function handleDownload() {
    setDownloadState("downloading");
    try {
      // The session cookie is sent automatically by the browser.
      const res = await fetch(`/api/download/premium/${resourceId}`);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("[Download] Failed:", data.message ?? res.statusText);
        setDownloadState("error");
        setTimeout(() => setDownloadState("idle"), 4000);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resource-${resourceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadState("idle");
    } catch (err) {
      console.error("[Download] Network error:", err);
      setDownloadState("error");
      setTimeout(() => setDownloadState("idle"), 4000);
    }
  }

  useEffect(() => {
    // Session cookie is sent automatically — no manual token needed.
    fetch(`/api/user/has-purchased/${resourceId}`)
      .then((r) => r.json())
      .then((data: { hasPurchased: boolean }) => {
        setState(data.hasPurchased ? "purchased" : "not-purchased");
      })
      .catch(() => setState("not-purchased"));
  }, [resourceId]);

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-5 p-6 rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Price column */}
      <div className="flex-1">
        {state === "purchased" ? (
          <>
            <p className="text-xs mb-1 flex items-center gap-1.5" style={{ color: "#34d399" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <circle cx="6" cy="6" r="5" stroke="#34d399" strokeWidth="1.2" />
                <path d="M3.5 6l2 2 3-3" stroke="#34d399" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Already purchased · Ready to download
            </p>
            <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
              PDF will be downloaded to your device.
            </p>
          </>
        ) : (
          <>
            <p className="text-xs mb-1" style={{ color: "var(--foreground-muted)" }}>
              One-time purchase · Instant download
            </p>
            <div className="flex items-end gap-1.5">
              <span className="text-sm font-semibold" style={{ color: "var(--foreground-muted)" }}>LKR</span>
              <span className="font-display font-bold text-4xl leading-none" style={{ color: "var(--foreground)" }}>
                {price.toLocaleString()}
              </span>
            </div>
          </>
        )}
      </div>

      {/* CTA column */}
      <div className="flex flex-col sm:flex-row gap-3 sm:shrink-0">
        <Link
          href="/premium-store"
          className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-px"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "var(--foreground-secondary)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 3L4 7l5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Store
        </Link>

        {state === "loading" && (
          <div
            className="flex items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-bold"
            style={{
              background: "rgba(124,31,255,0.15)",
              border: "1px solid rgba(124,31,255,0.25)",
              color: "#9455ff",
              minWidth: 180,
            }}
          >
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
            </svg>
            Checking…
          </div>
        )}

        {state === "not-purchased" && (
          <button
            type="button"
            onClick={handlePurchase}
            className="flex items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-bold transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, #7c1fff 0%, #9455ff 60%, #7c1fff 100%)",
              backgroundSize: "200% auto",
              boxShadow: "0 0 24px rgba(124,31,255,0.45), 0 4px 12px rgba(0,0,0,0.3)",
              color: "#fff",
            }}
          >
            Purchase &amp; Download
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2v8M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {state === "purchased" && (
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloadState === "downloading"}
            className="flex items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-bold transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            style={{
              background: downloadState === "error"
                ? "linear-gradient(135deg, #dc2626 0%, #ef4444 60%, #dc2626 100%)"
                : "linear-gradient(135deg, #059669 0%, #34d399 60%, #059669 100%)",
              backgroundSize: "200% auto",
              boxShadow: downloadState === "error"
                ? "0 0 24px rgba(220,38,38,0.4), 0 4px 12px rgba(0,0,0,0.3)"
                : "0 0 24px rgba(16,185,129,0.4), 0 4px 12px rgba(0,0,0,0.3)",
              color: "#fff",
            }}
          >
            {downloadState === "downloading" ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.6" strokeDasharray="10 10" />
                </svg>
                Fetching securely…
              </>
            ) : downloadState === "error" ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 5v4M8 11h.01M3 13h10l-5-9-5 9z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download Failed — Retry
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 2v8M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download PDF
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
