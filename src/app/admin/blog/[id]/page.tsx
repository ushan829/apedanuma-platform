"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogEditor, { type PostData } from "../BlogEditor";

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ background: "rgba(255,255,255,0.06)" }}
    />
  );
}

export default function EditBlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Session cookie is sent automatically — middleware already verified auth.
    fetch(`/api/admin/blog/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) throw new Error(json.message ?? "Not found");
        const p = json.post;
        setPost({
          _id: String(p._id),
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt ?? "",
          coverImage: p.coverImage ?? "",
          author: p.author,
          authorUrl: p.authorUrl ?? "",
          category: p.category,
          tags: p.tags ?? [],
          isPublished: p.isPublished,
          content: p.content,
        });
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Failed to load post.");
      });
  }, [id]);

  if (error) {
    return (
      <div
        className="rounded-xl px-4 py-3 text-sm"
        style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}
      >
        {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return <BlogEditor mode="edit" initial={post} />;
}
