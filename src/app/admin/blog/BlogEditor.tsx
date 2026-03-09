"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BLOG_CATEGORY_VALUES } from "@/lib/blog-constants";

/* ── Types ── */
export type BlockType = "h2" | "h3" | "paragraph" | "quote" | "divider" | "image";

export interface Block {
  id: string;
  type: BlockType;
  content: string;  // URL for image blocks, text for all others
  caption?: string; // image blocks only
}

export interface PostData {
  _id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  authorUrl?: string;
  category?: string;
  tags?: string[];
  isPublished?: boolean;
  content?: string; // JSON blocks string
}

/* ── Helpers ── */
function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 200);
}

function parseBlocks(raw?: string): Block[] {
  if (!raw) return [{ id: uid(), type: "paragraph", content: "" }];
  try {
    const arr = JSON.parse(raw) as Omit<Block, "id">[];
    if (Array.isArray(arr) && arr.length > 0) {
      return arr.map((b) => ({ ...b, id: uid() }));
    }
  } catch { /* fallback */ }
  return [{ id: uid(), type: "paragraph", content: raw }];
}

function serializeBlocks(blocks: Block[]): string {
  return JSON.stringify(
    blocks.map(({ type, content, caption }) => ({
      type,
      content,
      ...(caption !== undefined ? { caption } : {}),
    }))
  );
}

/* ── Image upload helper ── */
async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  // Session cookie is sent automatically by the browser.
  const res = await fetch("/api/admin/blog/upload-image", {
    method: "POST",
    body: fd,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message ?? "Upload failed");
  return json.url as string;
}

/* ── Block type labels ── */
const BLOCK_TYPES: { value: BlockType; label: string }[] = [
  { value: "paragraph", label: "Paragraph" },
  { value: "h2",        label: "Heading 2" },
  { value: "h3",        label: "Heading 3" },
  { value: "quote",     label: "Quote" },
  { value: "image",     label: "Image" },
  { value: "divider",   label: "Divider" },
];

/* ── Inline image picker (URL + R2 upload) ── */
function ImagePicker({
  url,
  caption,
  onUrlChange,
  onCaptionChange,
}: {
  url: string;
  caption: string;
  onUrlChange: (url: string) => void;
  onCaptionChange: (caption: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadErr("");
    try {
      const uploaded = await uploadImage(file);
      onUrlChange(uploaded);
    } catch (err: unknown) {
      setUploadErr(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const inputBase = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "var(--foreground)",
    borderRadius: 10,
    outline: "none",
    padding: "8px 12px",
    fontSize: 13,
    width: "100%",
  };

  return (
    <div className="space-y-3">
      {/* URL row */}
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="Paste image URL, or upload below…"
          style={inputBase}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #7c1fff, #5700be)",
            color: "#fff",
            whiteSpace: "nowrap",
          }}
        >
          {uploading ? "Uploading…" : "Upload to R2"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={handleFile}
        />
      </div>

      {uploadErr && (
        <p className="text-xs" style={{ color: "#f87171" }}>{uploadErr}</p>
      )}

      {/* Preview */}
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt="preview"
          className="w-full rounded-xl object-cover"
          style={{ maxHeight: 280, border: "1px solid rgba(255,255,255,0.08)" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}

      {/* Caption */}
      <input
        value={caption}
        onChange={(e) => onCaptionChange(e.target.value)}
        placeholder="Caption (optional)…"
        style={{ ...inputBase, fontSize: 12, fontStyle: "italic" }}
      />
    </div>
  );
}

/* ── Single block editor row ── */
function BlockRow({
  block,
  index,
  total,
  onUpdate,
  onAdd,
  onRemove,
  onMove,
}: {
  block: Block;
  index: number;
  total: number;
  onUpdate: (id: string, updates: Partial<Omit<Block, "id">>) => void;
  onAdd: (afterIndex: number) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, dir: "up" | "down") => void;
}) {
  const isDivider = block.type === "divider";
  const isImage   = block.type === "image";

  const textareaStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: block.type === "quote" ? "#c4a0ff" : "var(--foreground)",
    borderRadius: 10,
    resize: "none" as const,
    outline: "none",
    padding: "10px 12px",
    fontSize: block.type === "h2" ? 18 : block.type === "h3" ? 15 : 14,
    fontWeight: block.type === "h2" || block.type === "h3" ? 700 : 400,
    fontStyle: block.type === "quote" ? "italic" : "normal",
    lineHeight: 1.7,
    width: "100%",
  };

  return (
    <div
      className="group relative rounded-xl p-3 transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Type selector + move/add/remove controls */}
      <div className="flex items-center gap-2 mb-2">
        <select
          value={block.type}
          onChange={(e) =>
            onUpdate(block.id, {
              type: e.target.value as BlockType,
              content: e.target.value === "divider" ? "" : block.content,
            })
          }
          className="text-xs rounded-lg px-2 py-1 font-medium"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "var(--foreground-muted)",
            outline: "none",
          }}
        >
          {BLOCK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => onMove(block.id, "up")}
            disabled={index === 0}
            className="p-1 rounded-lg disabled:opacity-30 hover:bg-white/[0.06] transition-colors"
            title="Move up"
            style={{ color: "var(--foreground-muted)" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => onMove(block.id, "down")}
            disabled={index === total - 1}
            className="p-1 rounded-lg disabled:opacity-30 hover:bg-white/[0.06] transition-colors"
            title="Move down"
            style={{ color: "var(--foreground-muted)" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => onAdd(index)}
            className="p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
            title="Add block after"
            style={{ color: "#9455ff" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={() => onRemove(block.id)}
            disabled={total === 1}
            className="p-1 rounded-lg disabled:opacity-30 hover:bg-red-500/10 transition-colors"
            title="Remove block"
            style={{ color: "#f87171" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Block content */}
      {isDivider ? (
        <div
          className="h-px mx-2 my-2"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(124,31,255,0.3) 40%, rgba(255,255,255,0.08) 60%, transparent)",
          }}
        />
      ) : isImage ? (
        <ImagePicker
          url={block.content}
          caption={block.caption ?? ""}
          onUrlChange={(url) => onUpdate(block.id, { content: url })}
          onCaptionChange={(caption) => onUpdate(block.id, { caption })}
        />
      ) : (
        <textarea
          value={block.content}
          onChange={(e) => onUpdate(block.id, { content: e.target.value })}
          placeholder={
            block.type === "h2"    ? "Heading 2…"
            : block.type === "h3" ? "Heading 3…"
            : block.type === "quote" ? "Quote text…"
            : "Write paragraph…"
          }
          rows={block.type === "paragraph" ? 4 : 2}
          style={textareaStyle}
        />
      )}
    </div>
  );
}

/* ── Cover image picker (sidebar) ── */
function CoverImagePicker({
  url,
  onChange,
}: {
  url: string;
  onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr("");
    try {
      onChange(await uploadImage(file));
    } catch (ex: unknown) {
      setErr(ex instanceof Error ? ex.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "var(--foreground)",
    borderRadius: 10,
    outline: "none",
    padding: "8px 12px",
    fontSize: 13,
    width: "100%",
  };

  return (
    <div className="space-y-2">
      <input
        value={url}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://… or upload →"
        style={inputStyle}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="w-full py-2 rounded-xl text-xs font-semibold transition-all duration-200 disabled:opacity-60"
        style={{
          background: "rgba(124,31,255,0.12)",
          color: "#9455ff",
          border: "1px solid rgba(124,31,255,0.22)",
        }}
      >
        {uploading ? "Uploading…" : "Upload to R2"}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={handleFile}
      />
      {err && <p className="text-xs" style={{ color: "#f87171" }}>{err}</p>}
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt="Cover preview"
          className="w-full rounded-xl object-cover"
          style={{ maxHeight: 120, border: "1px solid rgba(255,255,255,0.08)" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}
    </div>
  );
}

/* ── Main BlogEditor ── */
interface BlogEditorProps {
  initial?: PostData;
  mode: "create" | "edit";
}

export default function BlogEditor({ initial, mode }: BlogEditorProps) {
  const router = useRouter();

  const [title,      setTitle]      = useState(initial?.title ?? "");
  const [slug,       setSlug]       = useState(initial?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!initial?.slug);
  const [excerpt,    setExcerpt]    = useState(initial?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [author,     setAuthor]     = useState(initial?.author ?? "");
  const [authorUrl,  setAuthorUrl]  = useState(initial?.authorUrl ?? "");
  const [category,   setCategory]   = useState(initial?.category ?? "General");
  const [tagsRaw,    setTagsRaw]    = useState(initial?.tags?.join(", ") ?? "");
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false);
  const [blocks, setBlocks] = useState<Block[]>(() => parseBlocks(initial?.content));

  const [saving, setSaving] = useState(false);

  /* ── Title → auto-slug ── */
  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugManual) setSlug(slugify(val));
  }

  /* ── Block mutations ── */
  const updateBlock = useCallback(
    (id: string, updates: Partial<Omit<Block, "id">>) =>
      setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b))),
    []
  );

  const addBlock = useCallback((afterIndex: number) => {
    setBlocks((prev) => {
      const next = [...prev];
      next.splice(afterIndex + 1, 0, { id: uid(), type: "paragraph", content: "" });
      return next;
    });
  }, []);

  const removeBlock = useCallback(
    (id: string) =>
      setBlocks((prev) => (prev.length > 1 ? prev.filter((b) => b.id !== id) : prev)),
    []
  );

  const moveBlock = useCallback((id: string, dir: "up" | "down") => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      const swap = dir === "up" ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }, []);

  /* ── Save ── */
  async function handleSave(publish?: boolean) {
    const finalPublished = publish !== undefined ? publish : isPublished;
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const body = {
      title:       title.trim(),
      slug:        slug.trim(),
      content:     serializeBlocks(blocks),
      excerpt:     excerpt.trim(),
      coverImage:  coverImage.trim() || undefined,
      author:      author.trim(),
      authorUrl:   authorUrl.trim(),
      category,
      tags,
      isPublished: finalPublished,
    };

    if (!body.title)  { toast.error("Title is required.");  return; }
    if (!body.slug)   { toast.error("Slug is required.");   return; }
    if (!body.author) { toast.error("Author is required."); return; }

    setSaving(true);
    try {
      // Session cookie is sent automatically — no Authorization header needed.
      const res =
        mode === "create"
          ? await fetch("/api/admin/blog", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            })
          : await fetch(`/api/admin/blog/${initial?._id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast.success(finalPublished ? "Post published!" : "Draft saved.");
      router.push("/admin/blog");
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  /* ── Shared styles ── */
  const fieldStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "var(--foreground)",
    outline: "none",
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 14,
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--foreground-muted)",
    marginBottom: 6,
  };

  return (
    <div className="space-y-8 pb-24 lg:pb-0">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: "var(--foreground)" }}>
            {mode === "create" ? "New Blog Post" : "Edit Post"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>
            {mode === "create" ? "Write and publish a new article." : `Editing: ${initial?.title ?? "…"}`}
          </p>
        </div>
        <a
          href="/admin/blog"
          className="text-sm font-medium hover:text-[#9455ff] transition-colors"
          style={{ color: "var(--foreground-muted)", textDecoration: "none" }}
        >
          ← Back
        </a>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">

        {/* ── Left: content editor ── */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label style={labelStyle}>Title *</label>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="The Ultimate Guide to…"
              style={{ ...fieldStyle, fontSize: 18, fontWeight: 700 }}
            />
          </div>

          {/* Slug */}
          <div>
            <label style={labelStyle}>Slug *</label>
            <input
              value={slug}
              onChange={(e) => { setSlug(slugify(e.target.value)); setSlugManual(true); }}
              placeholder="auto-generated-from-title"
              style={{ ...fieldStyle, fontFamily: "monospace", fontSize: 13 }}
            />
            <p className="mt-1.5 text-xs" style={{ color: "var(--foreground-muted)" }}>
              URL: /blog/{slug || "your-slug"}
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label style={labelStyle}>Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              maxLength={300}
              placeholder="Short summary shown on listing cards (max 300 chars)…"
              style={{ ...fieldStyle, resize: "none", lineHeight: 1.7 }}
            />
            <p className="mt-1 text-xs" style={{ color: "var(--foreground-muted)" }}>{excerpt.length}/300</p>
          </div>

          {/* Block editor */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label style={{ ...labelStyle, marginBottom: 0 }}>Content Blocks *</label>
              <button
                onClick={() => addBlock(blocks.length - 1)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
                style={{
                  background: "rgba(124,31,255,0.1)",
                  color: "#9455ff",
                  border: "1px solid rgba(124,31,255,0.22)",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Add Block
              </button>
            </div>
            <div className="space-y-2">
              {blocks.map((block, i) => (
                <BlockRow
                  key={block.id}
                  block={block}
                  index={i}
                  total={blocks.length}
                  onUpdate={updateBlock}
                  onAdd={addBlock}
                  onRemove={removeBlock}
                  onMove={moveBlock}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: metadata sidebar ── */}
        <div
          className="rounded-2xl p-5 space-y-5 sticky top-24"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground-muted)" }}>
            Post Settings
          </p>

          {/* Publish toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Published</span>
            <button
              onClick={() => setIsPublished(!isPublished)}
              className="relative w-11 h-6 rounded-full transition-all duration-200"
              style={{
                background: isPublished
                  ? "linear-gradient(135deg, #7c1fff, #5700be)"
                  : "rgba(255,255,255,0.1)",
              }}
              role="switch"
              aria-checked={isPublished}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200"
                style={{
                  background: "#fff",
                  transform: isPublished ? "translateX(20px)" : "translateX(0)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }}
              />
            </button>
          </div>

          {/* Author */}
          <div>
            <label style={labelStyle}>Author *</label>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Mr. Kavindu Perera" style={fieldStyle} />
          </div>

          {/* Author URL */}
          <div>
            <label style={labelStyle}>Author URL</label>
            <input value={authorUrl} onChange={(e) => setAuthorUrl(e.target.value)} placeholder="https://…" style={fieldStyle} />
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...fieldStyle, cursor: "pointer" }}>
              {BLOG_CATEGORY_VALUES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags</label>
            <input
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              placeholder="maths, algebra, grade-11"
              style={fieldStyle}
            />
            <p className="mt-1.5 text-xs" style={{ color: "var(--foreground-muted)" }}>Comma-separated</p>
          </div>

          {/* Cover image */}
          <div>
            <label style={labelStyle}>Cover Image</label>
            <CoverImagePicker
              url={coverImage}
              onChange={setCoverImage}
            />
          </div>

          {/* Actions — desktop only; mobile uses sticky bar below */}
          <div className="hidden lg:block space-y-2 pt-2">
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #7c1fff, #5700be)",
                color: "#fff",
                boxShadow: "0 0 16px rgba(124,31,255,0.3)",
              }}
            >
              {saving ? "Saving…" : mode === "create" ? "Publish Now" : "Save & Publish"}
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-60 hover:bg-white/[0.04]"
              style={{ color: "var(--foreground-muted)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Save as Draft
            </button>
          </div>
        </div>
      </div>

      {/* Sticky mobile action bar */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex gap-3 px-4 py-3"
        style={{
          background: "rgba(10,8,18,0.96)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-60"
          style={{ color: "var(--foreground-muted)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          Save Draft
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #7c1fff, #5700be)",
            color: "#fff",
            boxShadow: "0 0 14px rgba(124,31,255,0.3)",
          }}
        >
          {saving ? "Saving…" : mode === "create" ? "Publish Now" : "Save & Publish"}
        </button>
      </div>
    </div>
  );
}
