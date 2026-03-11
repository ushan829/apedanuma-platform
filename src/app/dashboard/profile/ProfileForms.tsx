"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function FieldWrapper({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block text-xs font-bold uppercase tracking-widest mb-2"
        style={{ color: "var(--foreground-muted)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "var(--foreground)",
  outline: "none",
  borderRadius: 12,
  padding: "10px 14px",
  fontSize: 14,
  width: "100%",
  transition: "border-color 200ms",
};

function PasswordInput({ value, onChange, placeholder, show, onToggle }: {
  value: string; onChange: (v: string) => void; placeholder: string;
  show: boolean; onToggle: () => void;
}) {
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="new-password"
        style={{ ...inputStyle, paddingRight: 44 }}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100"
        style={{ color: "var(--foreground-muted)", opacity: 0.6 }}
        tabIndex={-1}
      >
        {show ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        )}
      </button>
    </div>
  );
}

import { updateProfileSchema } from "@/lib/validations/user";

export default function ProfileForms({ initialName }: { initialName: string }) {
  const router = useRouter();

  /* Name form */
  const [name, setName] = useState(initialName);
  const [savingName, setSavingName] = useState(false);

  /* Password form */
  const [currentPassword, setCurrentPassword]   = useState("");
  const [newPassword, setNewPassword]           = useState("");
  const [confirmPassword, setConfirmPassword]   = useState("");
  const [savingPassword, setSavingPassword]     = useState(false);
  const [showCurrentPw, setShowCurrentPw]       = useState(false);
  const [showNewPw, setShowNewPw]               = useState(false);
  const [showConfirmPw, setShowConfirmPw]       = useState(false);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    
    const result = updateProfileSchema.safeParse({ name });
    
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    if (name.trim() === initialName) { toast.error("No changes to save."); return; }
    
    setSavingName(true);
    try {
      const res = await fetch("/api/auth/me/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast.success("Name updated successfully.");
      router.refresh(); // Refresh Server Component to sync layout
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update name.");
    } finally {
      setSavingName(false);
    }
  }

  async function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();

    const result = updateProfileSchema.safeParse({ currentPassword, newPassword });

    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    if (newPassword !== confirmPassword) { toast.error("New passwords do not match."); return; }
    
    setSavingPassword(true);
    try {
      const res = await fetch("/api/auth/me/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <>
      {/* Update Name */}
      <form onSubmit={handleSaveName} className="rounded-2xl p-6 space-y-5"
        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h2 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Update Display Name</h2>
        <FieldWrapper label="Full Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            maxLength={80}
            style={inputStyle}
          />
        </FieldWrapper>
        <button
          type="submit"
          disabled={savingName}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-60 hover:-translate-y-px"
          style={{ background: "linear-gradient(135deg, #7c1fff, #5700be)", color: "#fff", boxShadow: "0 0 14px rgba(124,31,255,0.3)" }}
        >
          {savingName ? "Saving…" : "Save Name"}
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={handleSavePassword} className="rounded-2xl p-6 space-y-5"
        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h2 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Change Password</h2>
        <FieldWrapper label="Current Password">
          <PasswordInput value={currentPassword} onChange={setCurrentPassword} placeholder="Your current password"
            show={showCurrentPw} onToggle={() => setShowCurrentPw((v) => !v)} />
        </FieldWrapper>
        <FieldWrapper label="New Password">
          <PasswordInput value={newPassword} onChange={setNewPassword} placeholder="At least 8 characters"
            show={showNewPw} onToggle={() => setShowNewPw((v) => !v)} />
        </FieldWrapper>
        <FieldWrapper label="Confirm New Password">
          <PasswordInput value={confirmPassword} onChange={setConfirmPassword} placeholder="Repeat new password"
            show={showConfirmPw} onToggle={() => setShowConfirmPw((v) => !v)} />
        </FieldWrapper>
        {/* Strength hint */}
        {newPassword.length > 0 && (
          <div className="flex items-center gap-2">
            {[1,2,3,4].map((level) => {
              const strength = newPassword.length >= 16 ? 4 : newPassword.length >= 12 ? 3 : newPassword.length >= 8 ? 2 : 1;
              const colors = ["", "#ef4444", "#f59e0b", "#34d399", "#10b981"];
              return (
                <div key={level} className="flex-1 h-1 rounded-full transition-all duration-300"
                  style={{ background: level <= strength ? colors[strength] : "rgba(255,255,255,0.08)" }} />
              );
            })}
            <span className="text-[0.65rem] font-medium shrink-0" style={{ color: "var(--foreground-muted)" }}>
              {newPassword.length >= 16 ? "Strong" : newPassword.length >= 12 ? "Good" : newPassword.length >= 8 ? "Fair" : "Weak"}
            </span>
          </div>
        )}
        <button
          type="submit"
          disabled={savingPassword}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-60 hover:-translate-y-px"
          style={{ background: "linear-gradient(135deg, #7c1fff, #5700be)", color: "#fff", boxShadow: "0 0 14px rgba(124,31,255,0.3)" }}
        >
          {savingPassword ? "Saving…" : "Change Password"}
        </button>
      </form>
    </>
  );
}