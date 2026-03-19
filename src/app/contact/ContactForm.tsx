"use client";

import { useState } from "react";
import { toast } from "sonner";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium mb-2" style={{ color: "var(--foreground-secondary)" }}>
      {children}
    </label>
  );
}

import { contactSchema } from "@/lib/validations/user";

export default function ContactForm() {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = contactSchema.safeParse({ name, email, subject, message });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const data = await res.json() as { success: boolean; message: string };

      if (!res.ok) {
        toast.error(data.message ?? "Failed to send. Please try again.");
        return;
      }

      toast.success("Message sent! We'll get back to you within 24 hours.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      toast.error("Could not connect to the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="relative rounded-2xl p-7 sm:p-9"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(24px) saturate(150%)",
        WebkitBackdropFilter: "blur(24px) saturate(150%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 0 0 1px rgba(124,31,255,0.04) inset, 0 8px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Top-edge highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-px rounded-t-2xl pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(124,31,255,0.45) 35%, rgba(148,85,255,0.25) 65%, transparent)",
        }}
      />

      <h2 className="font-display font-bold text-xl mb-1" style={{ color: "var(--foreground)" }}>
        Send us a message
      </h2>
      <p className="text-sm mb-7" style={{ color: "var(--foreground-muted)" }}>
        Fill in the form below and we&apos;ll get back to you as soon as possible.
      </p>

      <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit}>

        {/* Row: Full Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <FieldLabel htmlFor="full-name">Full Name</FieldLabel>
            <input
              id="full-name"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Kavindu Perera"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:bg-white/10 transition-all"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:bg-white/10 transition-all"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <FieldLabel htmlFor="subject">Subject</FieldLabel>
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="e.g. Missing resource, Technical issue, Feedback…"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:bg-white/10 transition-all"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Message */}
        <div>
          <FieldLabel htmlFor="message">Message</FieldLabel>
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Describe your question or issue in detail…"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:bg-white/10 transition-all resize-none"
            required
            style={{ lineHeight: "1.6" }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Privacy note */}
        <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>
          By submitting this form you agree to our{" "}
          <a href="/privacy-policy" className="underline underline-offset-2 hover:text-[#b890ff] transition-colors">
            Privacy Policy
          </a>
          . We never share your data with third parties.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="relative flex items-center justify-center gap-2.5 w-full rounded-xl py-4 font-bold text-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9455ff] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={{
            background: "linear-gradient(135deg, #7c1fff 0%, #9455ff 55%, #7c1fff 100%)",
            backgroundSize: "200% auto",
            boxShadow: "0 0 28px rgba(124,31,255,0.45), 0 4px 16px rgba(0,0,0,0.35)",
            color: "#fff",
          }}
        >
          {/* Shimmer sweep */}
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
              backgroundSize: "200% 100%",
              animation: loading ? "none" : "shimmer 3.5s linear infinite",
            }}
          />
          {loading ? (
            <>
              <svg className="relative z-10 animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="relative z-10">Sending…</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="relative z-10">
                <path d="M2 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="relative z-10">Send Message</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}
