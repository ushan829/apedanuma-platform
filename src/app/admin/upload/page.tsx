"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SUBJECT_VALUES, MATERIAL_TYPE_VALUES } from "@/lib/resource-constants";

/* ─────────────────────────────────────────
   Constants
   ───────────────────────────────────────── */
const GRADES = [10, 11] as const;

/* ─────────────────────────────────────────
   Small re-usable pieces
   ───────────────────────────────────────── */
function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium mb-2"
      style={{ color: "var(--foreground-secondary)" }}
    >
      {children}
      {required && <span className="ml-1" style={{ color: "#f87171" }}>*</span>}
    </label>
  );
}

function InputField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`input ${props.className ?? ""}`} />;
}

function SelectField({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="input appearance-none cursor-pointer"
      style={{ backgroundImage: "none" }}
    >
      {children}
    </select>
  );
}

function TextAreaField(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="input resize-none" style={{ lineHeight: "1.6" }} />;
}

/* ─────────────────────────────────────────
   File drop zone
   ───────────────────────────────────────── */
function FileDropZone({
  file,
  onChange,
  disabled,
}: {
  file: File | null;
  onChange: (f: File | null) => void;
  disabled: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      const dropped = e.dataTransfer.files[0];
      if (dropped?.type === "application/pdf") onChange(dropped);
    },
    [disabled, onChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files?.[0] ?? null);
  };

  return (
    <div
      className="relative rounded-xl transition-all duration-200 cursor-pointer"
      style={{
        background: dragging
          ? "rgba(245,158,11,0.08)"
          : file
          ? "rgba(52,211,153,0.06)"
          : "rgba(255,255,255,0.02)",
        border: `2px dashed ${dragging ? "#f59e0b" : file ? "#34d399" : "rgba(255,255,255,0.12)"}`,
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
      />

      <div className="flex flex-col items-center justify-center gap-3 py-8 px-4 text-center">
        {file ? (
          <>
            {/* File selected state */}
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl"
              style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)" }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ color: "#34d399" }}>
                <path d="M13 2H5a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M13 2v7h7" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M8 13l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#34d399" }}>{file.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                {(file.size / (1024 * 1024)).toFixed(2)} MB · Click or drag to replace
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Empty state */}
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl"
              style={{
                background: dragging ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${dragging ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.1)"}`,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
                style={{ color: dragging ? "#f59e0b" : "var(--foreground-muted)" }}>
                <path d="M11 14V4m0 0L7 8m4-4l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 16v1.5A1.5 1.5 0 005.5 19h11a1.5 1.5 0 001.5-1.5V16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: dragging ? "#f59e0b" : "var(--foreground-secondary)" }}>
                {dragging ? "Drop the PDF here" : "Drag & drop PDF here"}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                or click to browse · PDF only · max 50 MB
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Success toast
   ───────────────────────────────────────── */
function SuccessToast({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-start gap-3 rounded-2xl px-5 py-4 shadow-2xl"
      style={{
        background: "rgba(6,24,12,0.95)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(52,211,153,0.35)",
        boxShadow: "0 0 40px rgba(52,211,153,0.15), 0 8px 32px rgba(0,0,0,0.5)",
        maxWidth: 380,
        animation: "heroFadeUp 0.4s ease forwards",
      }}
    >
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
        style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)" }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "#34d399" }}>
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3" />
          <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold" style={{ color: "#34d399" }}>{title}</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>{subtitle}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Upload Progress Overlay
   ───────────────────────────────────────── */
function UploadOverlay() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="flex flex-col items-center gap-5 rounded-2xl px-10 py-8"
        style={{
          background: "rgba(10,10,10,0.9)",
          border: "1px solid rgba(245,158,11,0.25)",
          boxShadow: "0 0 60px rgba(245,158,11,0.1)",
        }}
      >
        {/* Gold conic spinner */}
        <div className="relative w-14 h-14">
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              background: "conic-gradient(from 0deg, transparent 70%, #f59e0b 100%)",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
              WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            }}
          />
          <div className="absolute inset-[3px] rounded-full" style={{ background: "rgba(10,10,10,0.95)" }} />
          <svg className="absolute inset-0 m-auto" width="18" height="18" viewBox="0 0 13 13" fill="none" style={{ color: "#f59e0b" }}>
            <path d="M6.5 1l1.2 3.2H11L8.4 6.3l1 3.2L6.5 8 4 9.5l1-3.2L2.5 4.2H5.3z" fill="currentColor" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-display font-bold text-base" style={{ color: "var(--foreground)" }}>
            Uploading to Cloudflare R2…
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--foreground-muted)" }}>
            Please don&apos;t close this tab
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Page
   ───────────────────────────────────────── */
export default function AdminUploadPage() {
  const router = useRouter();

  /* ── Form state ── */
  const [title,        setTitle]        = useState("");
  const [description,  setDescription]  = useState("");
  const [grade,        setGrade]        = useState<10 | 11>(10);
  const [subject,      setSubject]      = useState<string>(SUBJECT_VALUES[0]);
  const [materialType, setMaterialType] = useState<string>(MATERIAL_TYPE_VALUES[0]);
  const [isPremium,    setIsPremium]    = useState(false);
  const [price,        setPrice]        = useState("");
  const [term,         setTerm]         = useState<string>("");
  const [year,         setYear]         = useState<string>("");
  const [file,         setFile]         = useState<File | null>(null);

  /* ── UI state ── */
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [showSuccess,  setShowSuccess]  = useState(false);

  // Route protection handled server-side by src/middleware.ts.

  /* ── Submit ── */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!file)         { setError("Please select a PDF file to upload."); return; }
    if (!title.trim()) { setError("Title is required."); return; }
    if (!description.trim()) { setError("Description is required."); return; }
    if (isPremium && (!price || Number(price) <= 0)) {
      setError("Please enter a valid price for this premium resource."); return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("file",         file);
      fd.append("title",        title.trim());
      fd.append("description",  description.trim());
      fd.append("grade",        String(grade));
      fd.append("subject",      subject);
      fd.append("materialType", materialType);
      fd.append("isPremium",    String(isPremium));
      if (isPremium && price) fd.append("price", price);
      if (term)  fd.append("term",  term);
      if (year)  fd.append("year",  year);

      // Session cookie is sent automatically — no Authorization header needed.
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });

      const data: { success: boolean; message: string } = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Upload failed. Please try again.");
        return;
      }

      // Show success toast then redirect back to admin overview
      setShowSuccess(true);
      setTimeout(() => router.push("/admin"), 2000);
    } catch {
      setError("Network error — could not reach the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading    && <UploadOverlay />}
      {showSuccess && <SuccessToast title="Resource published!" subtitle="Redirecting to the Admin Dashboard…" />}

      <div className="max-w-3xl">

        {/* ── Page header ── */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-5" aria-label="Breadcrumb">
            <Link href="/admin" className="transition-colors hover:text-white" style={{ color: "var(--foreground-muted)" }}>
              Admin
            </Link>
            <span style={{ color: "var(--foreground-disabled)" }}>/</span>
            <span style={{ color: "var(--foreground-secondary)" }}>Upload Resource</span>
          </nav>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#f59e0b", boxShadow: "0 0 6px #f59e0b" }} />
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em]" style={{ color: "#f59e0b99" }}>
              Admin — Content Management
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl" style={{ color: "var(--foreground)" }}>
            Upload{" "}
            <span style={{
              background: "linear-gradient(135deg, #f59e0b 20%, #fcd34d 60%, #f59e0b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              New Resource
            </span>
          </h1>
          <p className="text-sm mt-1.5" style={{ color: "var(--foreground-muted)" }}>
            Upload a PDF study material to Cloudflare R2 and publish it to the platform.
          </p>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div
            className="flex items-start gap-3 rounded-xl px-4 py-3.5 mb-6 text-sm"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.28)",
              color: "#f87171",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 mt-0.5">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Glassmorphism form card ── */}
        <div
          className="relative rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.025)",
            backdropFilter: "blur(24px) saturate(140%)",
            WebkitBackdropFilter: "blur(24px) saturate(140%)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 0 0 1px rgba(245,158,11,0.04) inset, 0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Top-edge gold highlight */}
          <div
            className="absolute top-0 left-0 right-0 h-px rounded-t-2xl pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.5) 35%, rgba(253,211,77,0.25) 65%, transparent)",
            }}
          />

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>

            {/* ── File drop zone ── */}
            <div>
              <FieldLabel htmlFor="file" required>PDF File</FieldLabel>
              <FileDropZone file={file} onChange={setFile} disabled={loading} />
            </div>

            {/* ── Title ── */}
            <div>
              <FieldLabel htmlFor="title" required>Title</FieldLabel>
              <InputField
                id="title"
                type="text"
                placeholder="e.g. 2023 G.C.E. O/L Mathematics Past Paper"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                maxLength={200}
                required
              />
            </div>

            {/* ── Description ── */}
            <div>
              <FieldLabel htmlFor="description" required>Description</FieldLabel>
              <TextAreaField
                id="description"
                rows={3}
                placeholder="A brief description shown to students on the resource card and preview page…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                maxLength={1000}
                required
              />
              <p className="text-[0.7rem] mt-1.5" style={{ color: "var(--foreground-disabled)" }}>
                {description.length} / 1000
              </p>
            </div>

            {/* ── Grade + Subject row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel htmlFor="grade" required>Grade</FieldLabel>
                <SelectField
                  id="grade"
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value) as 10 | 11)}
                  disabled={loading}
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>Grade {g}</option>
                  ))}
                </SelectField>
              </div>

              <div>
                <FieldLabel htmlFor="subject" required>Subject</FieldLabel>
                <SelectField
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={loading}
                >
                  {SUBJECT_VALUES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </SelectField>
              </div>
            </div>

            {/* ── Material Type + Term row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel htmlFor="materialType" required>Material Type</FieldLabel>
                <SelectField
                  id="materialType"
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  disabled={loading}
                >
                  {MATERIAL_TYPE_VALUES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </SelectField>
              </div>

              {/* Term — only relevant for Term Test Papers */}
              <div>
                <FieldLabel htmlFor="term">
                  Term{" "}
                  <span className="font-normal" style={{ color: "var(--foreground-disabled)" }}>
                    (Term Test Papers only)
                  </span>
                </FieldLabel>
                <SelectField
                  id="term"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  disabled={loading || materialType !== "Term Test Paper"}
                >
                  <option value="">— Not applicable —</option>
                  <option value="1">Term 1</option>
                  <option value="2">Term 2</option>
                  <option value="3">Term 3</option>
                </SelectField>
              </div>
            </div>

            {/* ── Year ── */}
            <div className="max-w-[200px]">
              <FieldLabel htmlFor="year">Academic Year</FieldLabel>
              <InputField
                id="year"
                type="number"
                placeholder="e.g. 2023"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={loading}
                min={2000}
                max={new Date().getFullYear() + 1}
              />
            </div>

            {/* ── Premium toggle ── */}
            <div
              className="rounded-xl p-5"
              style={{
                background: isPremium ? "rgba(245,158,11,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${isPremium ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.07)"}`,
                transition: "all 0.2s",
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Premium Resource</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                    Students must purchase this resource to access it.
                  </p>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isPremium}
                  onClick={() => setIsPremium(!isPremium)}
                  disabled={loading}
                  className="relative shrink-0 w-11 h-6 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b]"
                  style={{
                    background: isPremium
                      ? "linear-gradient(135deg, #d97706, #f59e0b)"
                      : "rgba(255,255,255,0.1)",
                    boxShadow: isPremium ? "0 0 12px rgba(245,158,11,0.4)" : "none",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <span
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-300 shadow-sm"
                    style={{
                      background: "#fff",
                      transform: isPremium ? "translateX(20px)" : "translateX(0)",
                    }}
                  />
                </button>
              </div>

              {/* Price field — slides in when premium is toggled */}
              {isPremium && (
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(245,158,11,0.15)" }}>
                  <FieldLabel htmlFor="price" required>Price (LKR)</FieldLabel>
                  <div className="relative max-w-[200px]">
                    <span
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold pointer-events-none"
                      style={{ color: "#f59e0b" }}
                    >
                      LKR
                    </span>
                    <InputField
                      id="price"
                      type="number"
                      placeholder="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      disabled={loading}
                      min={1}
                      style={{ paddingLeft: "3.25rem" }}
                      required={isPremium}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── Submit row ── */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <Link
                href="/admin"
                className="text-sm font-medium transition-colors hover:text-white"
                style={{ color: "var(--foreground-muted)" }}
              >
                ← Cancel
              </Link>

              <button
                type="submit"
                disabled={loading || showSuccess}
                className="relative inline-flex items-center gap-2.5 rounded-xl px-7 py-3 font-bold text-sm overflow-hidden transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, #d97706 0%, #f59e0b 55%, #d97706 100%)",
                  backgroundSize: "200% auto",
                  boxShadow: "0 0 28px rgba(245,158,11,0.4), 0 4px 16px rgba(0,0,0,0.35)",
                  color: "#0a0a0a",
                }}
              >
                {/* Shimmer */}
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)",
                    backgroundSize: "200% 100%",
                    animation: loading || showSuccess ? "none" : "shimmer 3s linear infinite",
                  }}
                />
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" className="relative z-10">
                  <path d="M7.5 1v13M1 7.5h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span className="relative z-10">
                  {showSuccess ? "Published!" : "Upload & Publish"}
                </span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
