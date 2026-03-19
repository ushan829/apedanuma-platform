"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { 
  Check, 
  Download, 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  Zap,
  CreditCard
} from "lucide-react";

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
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  async function handlePurchase() {
    if (state === "loading" || state === "pending") return;
    
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
        toast.error("Payment Gateway Error", { description: "Payment system is still loading. Please try again in a few seconds." });
        setState("not-purchased");
        return;
      }

      window.payhere.onCompleted = function onCompleted() {
        toast.info("Payment received! Verifying...", { description: "Please wait while we unlock your material." });
        setState("pending");
        
        let attempts = 0;
        pollingIntervalRef.current = setInterval(async () => {
          attempts++;
          try {
            const r = await fetch(`/api/user/has-purchased/${resourceId}`);
            const data = await r.json();
            
            if (data.status === "completed") {
              if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
              setState("completed");
              toast.success("Payment Verified!", { description: "Your resource is now unlocked." });
              router.refresh();
            } else if (data.status === "failed" || attempts >= 15) {
              if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
              setState(data.status === "failed" ? "failed" : "not-purchased");
              if (data.status === "failed") {
                toast.error("Payment Failed", { description: "The transaction was declined." });
              } else {
                toast.error("Verification Timeout", { description: "We couldn't verify the payment immediately. Please check your dashboard in a few minutes." });
              }
            }
          } catch {
            // keep polling until timeout
          }
        }, 3000);
      };

      window.payhere.onDismissed = () => setState("not-purchased");
      window.payhere.onError = (error: string) => {
        toast.error("Payment Error", { description: error });
        setState("failed");
      };

      // Set to not-purchased so button isn't stuck in "loading" while PayHere popup is open
      setState("not-purchased");
      window.payhere.startPayment(payment);
    } catch (err: unknown) {
      console.error("[Purchase] Network error:", err);
      toast.error("Network Error", { description: "Failed to connect to the server. Please check your connection." });
      setState("not-purchased");
    }
  }

  async function handleDownload() {
    if (downloadState === "downloading") return;
    setDownloadState("downloading");
    try {
      const res = await fetch(`/api/download/premium/${resourceId}`);
      if (!res.ok) {
        throw new Error("Download failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `apedanuma-premium-${resourceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadState("idle");
    } catch (err) {
      console.error("[Download Error]", err);
      toast.error("Download Failed", { description: "Something went wrong while preparing your download." });
      setDownloadState("error");
      setTimeout(() => setDownloadState("idle"), 4000);
    }
  }

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/user/has-purchased/${resourceId}`)
      .then((r) => r.json())
      .then((data: { status: string }) => {
        if (!isMounted) return;
        if (data.status === "completed") setState("completed");
        else if (data.status === "failed") setState("failed");
        else setState("not-purchased");
      })
      .catch(() => {
        if (isMounted) setState("not-purchased");
      });
    return () => { isMounted = false; };
  }, [resourceId]);

  return (
    <div
      className="relative overflow-hidden rounded-[2.5rem] p-8 lg:p-10 border border-white/10 shadow-2xl transition-all"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Accessibility Status Region */}
      <div className="sr-only" aria-live="polite">
        {state === "loading" && "Initializing checkout..."}
        {state === "pending" && "Verifying payment, please wait..."}
        {state === "completed" && "Resource successfully unlocked."}
      </div>

      <div aria-hidden="true" className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 blur-[80px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-8">
        
        {/* ── Price Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--foreground-muted)" }}>
              {state === "completed" ? "Order Status" : "One-Time Purchase"}
            </p>
            {state === "completed" ? (
              <div className="flex items-center gap-2 text-[#34d399]">
                <ShieldCheck size={24} aria-hidden="true" />
                <span className="font-display font-black text-2xl tracking-tight">Unlocked</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-slate-400">LKR</span>
                <span className="font-display font-black text-5xl leading-none text-white tracking-tighter">
                  {price.toLocaleString()}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
            <Zap size={12} className="text-amber-400" aria-hidden="true" />
            Instant Delivery
          </div>
        </div>

        {/* ── Feature List ── */}
        <ul className="space-y-3.5" aria-label="Purchase features">
          {[
            "Full PDF Access (Lifetime)",
            "Expert-Crafted Study Notes",
            "Secure Checkout via PayHere"
          ].map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-[0.9rem] text-slate-300">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Check size={12} className="text-green-400" aria-hidden="true" />
              </div>
              {feature}
            </li>
          ))}
        </ul>

        {/* ── CTA Buttons ── */}
        <div className="flex flex-col gap-4">
          {state === "loading" ? (
            <button 
              disabled
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-slate-400 font-bold cursor-wait"
              aria-busy="true"
            >
              <RefreshCcw width={18} height={18} className="animate-spin" />
              Initializing...
            </button>
          ) : state === "completed" ? (
            <button
              onClick={handleDownload}
              disabled={downloadState === "downloading"}
              aria-busy={downloadState === "downloading"}
              className="w-full group relative py-4 rounded-2xl flex items-center justify-center gap-3 font-display font-black text-lg transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
              style={{
                background: "linear-gradient(135deg, #059669 0%, #34d399 60%, #059669 100%)",
                boxShadow: "0 0 30px rgba(16,185,129,0.3)",
                color: "#fff"
              }}
            >
              {downloadState === "downloading" ? (
                <>
                  <RefreshCcw width={20} height={20} className="animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download size={20} className="group-hover:bounce" aria-hidden="true" />
                  Download PDF
                </>
              )}
            </button>
          ) : (
            <button
              id="buy-button-main"
              onClick={handlePurchase}
              disabled={state === "pending"}
              aria-busy={state === "pending"}
              className="w-full group relative py-4 rounded-2xl flex items-center justify-center gap-3 font-display font-black text-lg transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-purple-500 outline-none"
              style={{
                background: "linear-gradient(135deg, #7c1fff 0%, #9455ff 60%, #7c1fff 100%)",
                boxShadow: "0 0 35px rgba(124,31,255,0.4), 0 8px 24px rgba(0,0,0,0.3)",
                color: "#fff"
              }}
            >
              {state === "pending" ? (
                <>
                  <RefreshCcw width={20} height={20} className="animate-spin" />
                  Verifying Payment...
                </>
              ) : (
                <>
                  <CreditCard size={20} aria-hidden="true" />
                  Purchase & Unlock
                </>
              )}
              {/* Glow Overlay */}
              <div aria-hidden="true" className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>
          )}

          <Link
            href="/premium-store"
            className="flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all duration-200 text-slate-500 hover:text-white rounded-lg focus-visible:ring-2 focus-visible:ring-white/20 outline-none"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Explore Other Packs
          </Link>
        </div>

        {/* ── Security Trust Note ── */}
        <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1.5 text-[0.7rem] font-medium text-slate-500">
            <ShieldCheck size={14} className="text-[#34d399]" aria-hidden="true" />
            Secure Payment
          </div>
          <div aria-hidden="true" className="w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-1.5 text-[0.7rem] font-medium text-slate-500">
            <Download size={14} className="text-blue-400" aria-hidden="true" />
            Instant Download
          </div>
        </div>

      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
        >
          <div className="relative w-full max-w-md p-10 rounded-[2.5rem] border border-white/10 bg-[#0a0a0c] shadow-2xl">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors rounded-full focus-visible:ring-2 focus-visible:ring-white/20 outline-none"
              aria-label="Close modal"
            >
              <ArrowLeft size={20} className="rotate-90" aria-hidden="true" />
            </button>
            <div className="text-center space-y-4 mb-10">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Lock size={28} className="text-purple-400" aria-hidden="true" />
              </div>
              <h3 id="auth-modal-title" className="text-2xl font-display font-black text-white">Join Ape Danuma</h3>
              <p className="text-slate-400 text-[0.95rem] leading-relaxed">
                Create a free account to purchase materials and access them permanently in your library.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Link 
                href={`/register?from=${encodeURIComponent(pathname)}`} 
                className="w-full py-4 rounded-2xl bg-white text-black font-black text-center transition-transform hover:-translate-y-1 shadow-xl focus-visible:ring-2 focus-visible:ring-purple-500 outline-none"
              >
                Get Started — It&apos;s Free
              </Link>

              <Link 
                href={`/login?from=${encodeURIComponent(pathname)}`}
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-center transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/20 outline-none"
              >
                Login to Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RefreshCcw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}
