"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

type UserInfo = { name: string; email: string; role: string; createdAt: string };

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

export default function ProfilePage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  /* Name form */
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);

  /* Password form */
  const [currentPassword, setCurrentPassword]   = useState("");
  const [newPassword, setNewPassword]           = useState("");
  const [confirmPassword, setConfirmPassword]   = useState("");
  const [savingPassword, setSavingPassword]     = useState(false);
  const [showCurrentPw, setShowCurrentPw]       = useState(false);
  const [showNewPw, setShowNewPw]               = useState(false);
  const [showConfirmPw, setShowConfirmPw]       = useState(false);

  useEffect(() => {
    fetch("/api/user/me")
      .then((r) => r.json())
      .then((data: { success: boolean; user?: UserInfo }) => {
        if (data.success && data.user) {
          setUser(data.user);
          setName(data.user.name);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name cannot be empty."); return; }
    if (name.trim() === user?.name) { toast.error("No changes to save."); return; }
    setSavingName(true);
    try {
      const res = await fetch("/api/auth/me/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setUser((prev) => prev ? { ...prev, name: name.trim() } : prev);
      toast.success("Name updated successfully.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update name.");
    } finally {
      setSavingName(false);
    }
  }

  async function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword) { toast.error("Current password is required."); return; }
    if (newPassword.length < 8) { toast.error("New password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { toast.error("New passwords do not match."); return; }
    setSavingPassword(true);
    try {
      const res = await fetch("/api/auth/me/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
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

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric", day: "numeric" })
    : "—";

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

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded-xl" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="h-40 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="h-56 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-lg">
      {/* Header */}
      <div>
        <span className="text-[0.7rem] font-bold uppercase tracking-widest" style={{ color: "#9455ff" }}>Account</span>
        <h1 className="font-display font-bold text-2xl sm:text-3xl mt-1" style={{ color: "var(--foreground)" }}>Profile Settings</h1>
        <p className="text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>Manage your account details and security.</p>
      </div>

      {/* Read-only info card */}
      <div className="rounded-2xl p-5 flex items-center gap-4"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div
          className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 font-display font-bold text-lg"
          style={{ background: "linear-gradient(135deg, rgba(124,31,255,0.35), rgba(87,0,190,0.5))", border: "1px solid rgba(124,31,255,0.4)", color: "#c4a0ff" }}
        >
          {user ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "…"}
        </div>
        <div className="min-w-0">
          <p className="font-semibold truncate" style={{ color: "var(--foreground)" }}>{user?.name}</p>
          <p className="text-sm truncate mt-0.5" style={{ color: "var(--foreground-muted)" }}>{user?.email}</p>
          <p className="text-xs mt-1" style={{ color: "var(--foreground-muted)" }}>Member since {memberSince}</p>
        </div>
      </div>

      {/* Email notice */}
      <div className="rounded-xl px-4 py-3 flex items-start gap-3"
        style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.18)" }}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="mt-0.5 shrink-0" style={{ color: "#818cf8" }}>
          <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M7.5 4v4M7.5 9.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <p className="text-xs leading-relaxed" style={{ color: "#a5b4fc" }}>
          Email address changes are not supported at this time to protect your account security.
        </p>
      </div>

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
    </div>
  );
}
