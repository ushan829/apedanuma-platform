"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";

interface BuySectionProps {
  resourceId: string;
  price: number;
}

type PurchaseState = "loading" | "not-purchased" | "pending" | "completed" | "failed";
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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  async function handlePurchase() {
    setState("loading");
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setShowAuthModal(true);
          setState("not-purchased");
          return;
        }

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
        notify_url,
        user, 
        itemTitle 
      } = await res.json();

      const currentOrigin = window.location.origin.replace(/\/$/, "");

      const payment: PayHerePayment = {
        sandbox: environment === "sandbox",
        merchant_id: merchantId,
        return_url: `${currentOrigin}/dashboard`,
        cancel_url: `${currentOrigin}/premium-store`,
        notify_url: notify_url, // Keep from API as it must be a public URL
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
        toast.info("Payment received! Verifying...", { description: "Please wait a moment while we confirm the transaction." });
        setState("pending");
        
        // Poll backend to verify webhook completion
        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          try {
            const r = await fetch(`/api/user/has-purchased/${resourceId}`);
            const data = await r.json();
            
            if (data.status === "completed") {
              clearInterval(interval);
              setState("completed");
              toast.success("Payment Verified!", { description: "Your resource is now unlocked." });
              router.refresh();
            } else if (data.status === "failed" || attempts >= 10) {
              clearInterval(interval);
              setState(data.status === "failed" ? "failed" : "pending");
              if (data.status === "failed") {
                toast.error("Payment Failed", { description: "The transaction was declined by the gateway." });
              } else {
                toast.info("Verification taking longer than usual.", { description: "Please refresh the page in a minute." });
              }
            }
          } catch {
            // keep polling
          }
        }, 3000);
      };

      window.payhere.onDismissed = function onDismissed() {
        setState("not-purchased");
      };

      window.payhere.onError = function onError(error: string) {
        toast.error("Payment Error", { description: error });
        setState("failed");
      };

      // Set state back to not-purchased before opening the modal
      // so if the user closes the modal without onDismissed firing, it isn't stuck.
      setState("not-purchased");
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
      .then((data: { status: string }) => {
        // Treat "pending" database status as "not-purchased" in the UI 
        // to allow users to click the purchase button again if they previously abandoned a checkout.
        if (data.status === "completed") setState("completed");
        else if (data.status === "failed") setState("failed");
        else setState("not-purchased");
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
        {state === "completed" ? (
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

        {(state === "not-purchased" || state === "failed") && (
          <button
            id="buy-button-main"
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
            {state === "failed" ? "Retry Purchase" : "Purchase & Download"}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2v8M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {state === "pending" && (
          <button
            type="button"
            disabled
            className="flex items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-bold transition-all duration-300 disabled:opacity-80"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 60%, #f59e0b 100%)",
              backgroundSize: "200% auto",
              boxShadow: "0 0 24px rgba(245,158,11,0.3), 0 4px 12px rgba(0,0,0,0.2)",
              color: "#fff",
            }}
          >
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.6" strokeDasharray="10 10" />
            </svg>
            Verifying Payment...
          </button>
        )}

        {state === "completed" && (
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

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
          <div
            className="relative w-full max-w-md p-8 overflow-hidden rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(24px) saturate(150%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 0 1px rgba(124,31,255,0.05) inset, 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Top-edge highlight */}
            <div
              className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(124,31,255,0.45) 35%, rgba(148,85,255,0.25) 65%, transparent)",
              }}
            />
            
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-white/5"
              style={{ color: "var(--foreground-muted)" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div 
                className="flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
                style={{
                  background: "linear-gradient(135deg, rgba(124,31,255,0.2), rgba(87,0,190,0.3))",
                  border: "1px solid rgba(124,31,255,0.3)",
                  color: "#c4a0ff",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" fill="currentColor" opacity="0.8" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl mb-2" style={{ color: "var(--foreground)" }}>Join Ape Danuma to Continue</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                Please create a free account to purchase this resource and access it anytime from your library.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href={`/register?from=${encodeURIComponent(pathname)}`}
                className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #7c1fff 0%, #9455ff 60%, #7c1fff 100%)",
                  backgroundSize: "200% auto",
                  boxShadow: "0 0 20px rgba(124,31,255,0.3), 0 4px 12px rgba(0,0,0,0.3)",
                  color: "#fff",
                }}
              >
                Sign Up Now
              </Link>
              <Link
                href={`/login?from=${encodeURIComponent(pathname)}`}
                className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--foreground)",
                }}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
