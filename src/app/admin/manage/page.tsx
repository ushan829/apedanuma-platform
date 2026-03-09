"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { SUBJECT_VALUES, MATERIAL_TYPE_VALUES } from "@/lib/resource-constants";
import { getSubjectStyle } from "@/lib/free-resources";

/* ─────────────────────────────────────────
   Types
   ───────────────────────────────────────── */
interface ApiStats {
  total: number;
  published: number;
  premium: number;
  free: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AdminResource {
  _id: string;
  title: string;
  description: string;
  grade: 10 | 11;
  subject: string;
  materialType: string;
  term?: 1 | 2 | 3;
  year?: number;
  isPremium: boolean;
  price?: number;
  pageCount?: number;
  fileSize?: string;
  downloadCount: number;
  isPublished: boolean;
  pdfUrl: string;
  createdAt: string;
}

/* ─────────────────────────────────────────
   Shared style helpers
   ───────────────────────────────────────── */
const TYPE_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  "Past Paper":     { color: "#fda4af", bg: "rgba(244,63,94,0.12)",   border: "rgba(244,63,94,0.26)"   },
  "Term Test Paper":{ color: "#93c5fd", bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.28)"  },
  "Marking Scheme": { color: "#fdba74", bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.26)"  },
  "Short Note":     { color: "#6ee7b7", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.28)"  },
  "Model Paper":    { color: "#fcd34d", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.28)"  },
  "Revision Paper": { color: "#2dd4bf", bg: "rgba(20,184,166,0.12)",  border: "rgba(20,184,166,0.28)"  },
  "MCQ Paper":      { color: "#818cf8", bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.26)"  },
  "Essay Guide":    { color: "#f472b6", bg: "rgba(236,72,153,0.12)",  border: "rgba(236,72,153,0.26)"  },
};
function getTypeMeta(mt: string) {
  return TYPE_COLORS[mt] ?? { color: "var(--foreground-muted)", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.09)" };
}

/* ─────────────────────────────────────────
   Toast
   ───────────────────────────────────────── */
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold shadow-2xl animate-in"
      style={{
        background: type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
        border: `1px solid ${type === "success" ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
        color: type === "success" ? "#34d399" : "#f87171",
        backdropFilter: "blur(16px)",
        boxShadow: `0 8px 32px ${type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)"}`,
      }}
    >
      {type === "success" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
          <path d="M5 8l2.5 2.5L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
          <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   Delete Confirmation Modal
   ───────────────────────────────────────── */
function DeleteModal({
  resource,
  onCancel,
  onConfirm,
  loading,
}: {
  resource: AdminResource;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
      <div
        className="relative w-full max-w-md rounded-2xl p-6"
        style={{
          background: "rgba(12,6,20,0.98)",
          border: "1px solid rgba(239,68,68,0.25)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(239,68,68,0.08)",
        }}
      >
        {/* Icon */}
        <div
          className="flex items-center justify-center w-12 h-12 rounded-2xl mx-auto mb-4"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ color: "#f87171" }}>
            <path d="M3 6h16M8 6V4h6v2M19 6l-1.5 13.5A1.5 1.5 0 0116 21H6a1.5 1.5 0 01-1.5-1.5L3 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 11v5M13 11v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <h3 className="font-display font-bold text-lg text-center mb-2" style={{ color: "var(--foreground)" }}>
          Delete Resource?
        </h3>
        <p className="text-sm text-center mb-1" style={{ color: "var(--foreground-secondary)" }}>
          This will permanently delete:
        </p>
        <p className="text-sm font-semibold text-center mb-2" style={{ color: "#f87171" }}>
          &ldquo;{resource.title}&rdquo;
        </p>
        <p className="text-xs text-center mb-6" style={{ color: "var(--foreground-muted)" }}>
          The PDF file will be removed from Cloudflare R2 and the record deleted from the database. This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--foreground-secondary)" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: loading ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.2)",
              border: "1px solid rgba(239,68,68,0.4)",
              color: "#f87171",
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
                </svg>
                Deleting…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 4h10M5 4V3h4v1M12 4l-1 8.5A1 1 0 0110 13.5H4A1 1 0 013 12.5L2 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Yes, Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Edit Modal
   ───────────────────────────────────────── */
function EditModal({
  resource,
  onClose,
  onSave,
  loading,
}: {
  resource: AdminResource;
  onClose: () => void;
  onSave: (data: Partial<AdminResource>) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState({
    title:        resource.title,
    description:  resource.description,
    grade:        resource.grade,
    subject:      resource.subject,
    materialType: resource.materialType,
    term:         resource.term ?? ("" as string | number),
    year:         resource.year ?? ("" as string | number),
    isPremium:    resource.isPremium,
    price:        resource.price ?? ("" as string | number),
    isPublished:  resource.isPublished,
  });

  const set = (key: string, val: unknown) => setForm((prev) => ({ ...prev, [key]: val }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: Partial<AdminResource> = {
      title:        form.title.trim(),
      description:  form.description.trim(),
      grade:        Number(form.grade) as 10 | 11,
      subject:      form.subject,
      materialType: form.materialType,
      isPremium:    form.isPremium,
      isPublished:  form.isPublished,
    };
    if (form.term !== "") payload.term = Number(form.term) as 1 | 2 | 3;
    else payload.term = undefined;
    if (form.year !== "") payload.year = Number(form.year);
    if (form.isPremium && form.price !== "") payload.price = Number(form.price);
    onSave(payload);
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "0.6rem",
    color: "var(--foreground)",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    width: "100%",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.72rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--foreground-muted)",
    marginBottom: "0.375rem",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl"
        style={{
          background: "rgba(10,6,20,0.98)",
          border: "1px solid rgba(245,158,11,0.2)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(124,31,255,0.08)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <h3 className="font-display font-bold text-base" style={{ color: "var(--foreground)" }}>
              Edit Resource
            </h3>
            <p className="text-xs mt-0.5 truncate max-w-[260px]" style={{ color: "var(--foreground-muted)" }}>
              {resource.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-150 hover:bg-white/[0.08]"
            style={{ color: "var(--foreground-muted)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

          {/* Title */}
          <div>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description *</label>
            <textarea
              style={{ ...inputStyle, resize: "none", lineHeight: "1.55" }}
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
            />
          </div>

          {/* Grade + Subject */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Grade *</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.grade} onChange={(e) => set("grade", Number(e.target.value))}>
                <option value={10}>Grade 10</option>
                <option value={11}>Grade 11</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Subject *</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.subject} onChange={(e) => set("subject", e.target.value)}>
                {(SUBJECT_VALUES as readonly string[]).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Material Type */}
          <div>
            <label style={labelStyle}>Material Type *</label>
            <select
              style={{ ...inputStyle, cursor: "pointer" }}
              value={form.materialType}
              onChange={(e) => { set("materialType", e.target.value); if (e.target.value !== "Term Test Paper") set("term", ""); }}
            >
              {(MATERIAL_TYPE_VALUES as readonly string[]).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Term + Year */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Term {form.materialType !== "Term Test Paper" && <span style={{ color: "var(--foreground-muted)" }}>(N/A)</span>}</label>
              <select
                style={{ ...inputStyle, cursor: "pointer", opacity: form.materialType !== "Term Test Paper" ? 0.4 : 1 }}
                value={String(form.term)}
                disabled={form.materialType !== "Term Test Paper"}
                onChange={(e) => set("term", e.target.value)}
              >
                <option value="">— None —</option>
                <option value="1">Term 1</option>
                <option value="2">Term 2</option>
                <option value="3">Term 3</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Year</label>
              <input
                style={inputStyle}
                type="number"
                min={2000}
                max={2030}
                placeholder="e.g. 2024"
                value={String(form.year)}
                onChange={(e) => set("year", e.target.value)}
              />
            </div>
          </div>

          {/* Premium toggle + Price */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 flex-1">
              <button
                type="button"
                onClick={() => set("isPremium", !form.isPremium)}
                className="relative w-10 h-5.5 rounded-full transition-colors duration-200 shrink-0"
                style={{
                  background: form.isPremium ? "linear-gradient(135deg, #f59e0b, #d97706)" : "rgba(255,255,255,0.12)",
                  border: form.isPremium ? "1px solid rgba(245,158,11,0.5)" : "1px solid rgba(255,255,255,0.15)",
                  width: 40, height: 22,
                }}
              >
                <span
                  className="absolute top-0.5 transition-transform duration-200 rounded-full"
                  style={{
                    width: 17, height: 17,
                    background: "#fff",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    transform: form.isPremium ? "translateX(20px)" : "translateX(2px)",
                  }}
                />
              </button>
              <span className="text-sm font-medium" style={{ color: form.isPremium ? "#fbbf24" : "var(--foreground-muted)" }}>
                {form.isPremium ? "Premium" : "Free"}
              </span>
            </div>
            {form.isPremium && (
              <div className="flex-1">
                <label style={labelStyle}>Price (LKR) *</label>
                <input
                  style={inputStyle}
                  type="number"
                  min={1}
                  placeholder="e.g. 350"
                  value={String(form.price)}
                  onChange={(e) => set("price", e.target.value)}
                  required={form.isPremium}
                />
              </div>
            )}
          </div>

          {/* Published toggle */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => set("isPublished", !form.isPublished)}
              style={{
                background: form.isPublished ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.08)",
                border: `1px solid ${form.isPublished ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.12)"}`,
                color: form.isPublished ? "#34d399" : "var(--foreground-muted)",
                borderRadius: "0.5rem",
                padding: "0.3rem 0.8rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {form.isPublished ? "● Published" : "○ Draft"}
            </button>
            <span className="text-xs" style={{ color: "var(--foreground-muted)" }}>
              {form.isPublished ? "Visible to students" : "Hidden from public"}
            </span>
          </div>

          {/* Actions */}
          <div
            className="flex gap-3 pt-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--foreground-secondary)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                background: loading
                  ? "rgba(245,158,11,0.12)"
                  : "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(124,31,255,0.2))",
                border: "1px solid rgba(245,158,11,0.35)",
                color: "#fbbf24",
                boxShadow: loading ? "none" : "0 0 16px rgba(245,158,11,0.1)",
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 8l3.5 3.5L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Stat Card
   ───────────────────────────────────────── */
function StatCard({ label, value, color, icon }: { label: string; value: number | string; color: string; icon: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl px-5 py-4"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div
        className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}33`, color }}
      >
        {icon}
      </div>
      <div>
        <p className="font-display font-bold text-xl leading-none" style={{ color: "var(--foreground)" }}>{value}</p>
        <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: "var(--foreground-muted)" }}>{label}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Page
   ───────────────────────────────────────── */
export default function ManageContentPage() {
  /* Data */
  const [resources, setResources]   = useState<AdminResource[]>([]);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [apiStats, setApiStats]     = useState<ApiStats>({ total: 0, published: 0, premium: 0, free: 0 });
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 20, total: 0, totalPages: 1 });

  const fetchResources = useCallback(async (page = 1) => {
    setLoading(true);
    setFetchError(null);
    try {
      // Session cookie is sent automatically — middleware already verified auth.
      const res  = await fetch(`/api/admin/resources?page=${page}&limit=20`);
      const data = await res.json() as {
        success: boolean;
        resources?: AdminResource[];
        pagination?: PaginationInfo;
        stats?: ApiStats;
        message?: string;
      };
      if (!res.ok || !data.success) throw new Error(data.message ?? "Failed to load resources.");
      setResources(data.resources ?? []);
      if (data.pagination) setPagination(data.pagination);
      if (data.stats)      setApiStats(data.stats);
    } catch (e) {
      setFetchError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  /* Search + filters */
  const [search, setSearch]       = useState("");
  const [filterGrade, setGrade]   = useState<"" | "10" | "11">("");
  const [filterType, setType]     = useState("");
  const [filterStatus, setStatus] = useState<"" | "published" | "draft">("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return resources.filter((r) => {
      if (q && !r.title.toLowerCase().includes(q) && !r.subject.toLowerCase().includes(q)) return false;
      if (filterGrade && String(r.grade) !== filterGrade) return false;
      if (filterType  && r.materialType !== filterType)   return false;
      if (filterStatus === "published" && !r.isPublished) return false;
      if (filterStatus === "draft"     &&  r.isPublished) return false;
      return true;
    });
  }, [resources, search, filterGrade, filterType, filterStatus]);

  /* Stats are returned by the API (aggregate across ALL resources, not just this page) */

  /* Edit */
  const [editTarget, setEditTarget]   = useState<AdminResource | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  async function handleSaveEdit(data: Partial<AdminResource>) {
    if (!editTarget) return;
    setEditLoading(true);
    try {
      const res = await fetch(`/api/admin/resources/${editTarget._id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = await res.json() as { success: boolean; message?: string };
      if (!res.ok || !json.success) throw new Error(json.message ?? "Update failed.");
      setToast({ message: "Resource updated successfully.", type: "success" });
      setEditTarget(null);
      await fetchResources(pagination.page);
    } catch (e) {
      setToast({ message: (e as Error).message, type: "error" });
    } finally {
      setEditLoading(false);
    }
  }

  /* Delete */
  const [deleteTarget, setDeleteTarget]   = useState<AdminResource | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res  = await fetch(`/api/admin/resources/${deleteTarget._id}`, {
        method: "DELETE",
      });
      const json = await res.json() as { success: boolean; message?: string };
      if (!res.ok || !json.success) throw new Error(json.message ?? "Delete failed.");
      setToast({ message: json.message ?? "Resource deleted.", type: "success" });
      setDeleteTarget(null);
      await fetchResources(pagination.page);
    } catch (e) {
      setToast({ message: (e as Error).message, type: "error" });
    } finally {
      setDeleteLoading(false);
    }
  }

  /* Toast */
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);


  /* ─────────────────────────────────────────────────────────────────────
     RENDER
  ──────────────────────────────────────────────────────────────────────── */
  return (
    <>
      {/* Modals */}
      {deleteTarget && (
        <DeleteModal
          resource={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          loading={deleteLoading}
        />
      )}
      {editTarget && (
        <EditModal
          resource={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleSaveEdit}
          loading={editLoading}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: "var(--foreground)" }}>
            Manage{" "}
            <span style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Resources
            </span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>
            Edit, publish, or delete uploaded study materials.
          </p>
        </div>
        <Link
          href="/admin/upload"
          className="shrink-0 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-px"
          style={{
            background: "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(180,100,0,0.22))",
            border: "1px solid rgba(245,158,11,0.35)",
            color: "#fbbf24",
            boxShadow: "0 0 16px rgba(245,158,11,0.08)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 10V3m0 0L4.5 5.5M7 3l2.5 2.5M1.5 11h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Upload New
        </Link>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        <StatCard label="Total" value={apiStats.total} color="#9455ff"
          icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.4"/><path d="M5 9h8M5 6h5M5 12h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>}
        />
        <StatCard label="Published" value={apiStats.published} color="#34d399"
          icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4"/><path d="M6 9l2.5 2.5L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        />
        <StatCard label="Premium" value={apiStats.premium} color="#f59e0b"
          icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5l2 5h5l-4 3 1.5 5L9 12 4.5 14.5 6 9.5l-4-3h5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>}
        />
        <StatCard label="Free" value={apiStats.free} color="#93c5fd"
          icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v10M5 8l4 4 4-4M2 15h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        />
      </div>

      {/* ── Search + Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ color: "var(--foreground-muted)" }}>
            <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or subject…"
            className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-1"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "var(--foreground)",
            }}
          />
        </div>

        {/* Grade filter */}
        <select
          value={filterGrade}
          onChange={(e) => setGrade(e.target.value as "" | "10" | "11")}
          className="rounded-xl px-3 py-2.5 text-sm cursor-pointer outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "var(--foreground)", minWidth: 110 }}
        >
          <option value="">All Grades</option>
          <option value="10">Grade 10</option>
          <option value="11">Grade 11</option>
        </select>

        {/* Type filter */}
        <select
          value={filterType}
          onChange={(e) => setType(e.target.value)}
          className="rounded-xl px-3 py-2.5 text-sm cursor-pointer outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "var(--foreground)", minWidth: 160 }}
        >
          <option value="">All Types</option>
          {(MATERIAL_TYPE_VALUES as readonly string[]).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={(e) => setStatus(e.target.value as "" | "published" | "draft")}
          className="rounded-xl px-3 py-2.5 text-sm cursor-pointer outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "var(--foreground)", minWidth: 130 }}
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Results count + pagination info */}
      <p className="text-xs mb-4" style={{ color: "var(--foreground-muted)" }}>
        Showing{" "}
        <span style={{ color: "var(--foreground-secondary)", fontWeight: 600 }}>{filtered.length}</span>{" "}
        {filtered.length !== resources.length ? `of ${resources.length} on this page · ` : "on this page · "}
        <span style={{ color: "var(--foreground-secondary)", fontWeight: 600 }}>{apiStats.total}</span> total
        {pagination.totalPages > 1 && (
          <> · page <span style={{ color: "var(--foreground-secondary)", fontWeight: 600 }}>{pagination.page}</span> of{" "}
          <span style={{ color: "var(--foreground-secondary)" }}>{pagination.totalPages}</span></>
        )}
      </p>

      {/* ── Table ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <svg className="animate-spin" width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ color: "#f59e0b" }}>
              <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="2" strokeDasharray="18 18" />
            </svg>
            <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>Loading resources…</p>
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-sm font-medium" style={{ color: "#f87171" }}>{fetchError}</p>
            <button
              type="button"
              onClick={() => fetchResources()}
              className="btn-outline-accent text-sm px-5 py-2"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ color: "rgba(255,255,255,0.15)" }}>
              <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M25 25l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M12 16h8M16 12v8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
              {resources.length === 0 ? "No resources uploaded yet." : "No results match your filters."}
            </p>
            {resources.length === 0 && (
              <Link href="/admin/upload" className="btn-outline-accent text-sm px-5 py-2">Upload First Resource</Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 720 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
                  {["Title & Subject", "Grade", "Type", "Status", "Price", "↓ DLs", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[0.65rem] font-bold uppercase tracking-widest"
                      style={{ color: "rgba(245,158,11,0.7)", whiteSpace: "nowrap" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, idx) => {
                  const subStyle  = getSubjectStyle(r.subject);
                  const typeStyle = getTypeMeta(r.materialType);
                  return (
                    <tr
                      key={r._id}
                      style={{
                        borderBottom: idx < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        transition: "background 150ms",
                      }}
                      className="hover:bg-white/[0.02]"
                    >
                      {/* Title + subject */}
                      <td className="px-4 py-3.5" style={{ maxWidth: 240 }}>
                        <p className="font-medium text-sm truncate" style={{ color: "var(--foreground)" }}>{r.title}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: subStyle.color }} />
                          <span className="text-[0.68rem] truncate" style={{ color: "var(--foreground-muted)" }}>
                            {r.subject}{r.year ? ` · ${r.year}` : ""}
                          </span>
                        </div>
                      </td>

                      {/* Grade */}
                      <td className="px-4 py-3.5">
                        <span
                          className="text-[0.62rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
                          style={{ background: "rgba(255,255,255,0.06)", color: "var(--foreground-muted)", border: "1px solid rgba(255,255,255,0.09)" }}
                        >
                          Gr {r.grade}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3.5">
                        <span
                          className="text-[0.62rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
                          style={{ background: typeStyle.bg, color: typeStyle.color, border: `1px solid ${typeStyle.border}` }}
                        >
                          {r.materialType}{r.term ? ` T${r.term}` : ""}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                          style={{
                            background: r.isPublished ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.06)",
                            color: r.isPublished ? "#34d399" : "var(--foreground-muted)",
                            border: `1px solid ${r.isPublished ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.1)"}`,
                          }}
                        >
                          {r.isPublished ? "● Live" : "○ Draft"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {r.isPremium ? (
                          <span className="text-sm font-semibold" style={{ color: "#fbbf24" }}>
                            LKR {(r.price ?? 0).toLocaleString()}
                          </span>
                        ) : (
                          <span
                            className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(16,185,129,0.1)", color: "#34d399", border: "1px solid rgba(16,185,129,0.22)" }}
                          >
                            Free
                          </span>
                        )}
                      </td>

                      {/* Downloads */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm tabular-nums" style={{ color: "var(--foreground-secondary)" }}>
                          {r.downloadCount}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => setEditTarget(r)}
                            title="Edit"
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 hover:-translate-y-px"
                            style={{
                              background: "rgba(245,158,11,0.08)",
                              border: "1px solid rgba(245,158,11,0.2)",
                              color: "#fbbf24",
                            }}
                          >
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                              <path d="M7.5 1.5l2 2-6 6H1.5v-2l6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                            </svg>
                            Edit
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(r)}
                            title="Delete"
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 hover:-translate-y-px"
                            style={{
                              background: "rgba(239,68,68,0.07)",
                              border: "1px solid rgba(239,68,68,0.18)",
                              color: "#f87171",
                            }}
                          >
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                              <path d="M1.5 3h8M4 3V2h3v1M9 3l-.75 6.5A.75.75 0 017.5 10h-4a.75.75 0 01-.75-.5L2 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination controls ── */}
      {!loading && !fetchError && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-5 gap-4">
          <button
            type="button"
            onClick={() => fetchResources(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-px"
            style={{
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.2)",
              color: "#fbbf24",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M8 2L3 6.5l5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Previous
          </button>

          <span className="text-xs" style={{ color: "var(--foreground-muted)" }}>
            Page{" "}
            <span style={{ color: "var(--foreground)", fontWeight: 600 }}>{pagination.page}</span>
            {" "}of{" "}
            <span style={{ color: "var(--foreground)" }}>{pagination.totalPages}</span>
            {" "}·{" "}
            <span style={{ color: "var(--foreground-secondary)" }}>{pagination.total}</span> resources
          </span>

          <button
            type="button"
            onClick={() => fetchResources(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-px"
            style={{
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.2)",
              color: "#fbbf24",
            }}
          >
            Next
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M5 2l5 4.5L5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
