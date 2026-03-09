import mongoose, { Schema, model, models, type Document } from "mongoose";
import { BLOG_CATEGORY_VALUES, type BlogCategory } from "@/lib/blog-constants";

export { BLOG_CATEGORY_VALUES };
export type { BlogCategory };

/* ─────────────────────────────────────────
   TypeScript interface
   ───────────────────────────────────────── */
export interface IBlogPost extends Document {
  title: string;
  /** URL-friendly identifier, e.g. "how-to-ace-maths-ol". Must be unique. */
  slug: string;
  /** Full article body — stored as HTML or Markdown (decided at the API layer). */
  content: string;
  /** Short summary shown on listing cards (max 300 chars). */
  excerpt?: string;
  /** URL to the cover/hero image. */
  coverImage?: string;
  /** Display name of the post author. */
  author: string;
  /** Optional link to the author's profile or social page. */
  authorUrl?: string;
  category: BlogCategory;
  /** Searchable tags, e.g. ["mathematics", "grade-11", "algebra"]. */
  tags: string[];
  /** Estimated reading time in minutes — computed before save. */
  readingTimeMinutes: number;
  /** Whether the post is visible to the public. */
  isPublished: boolean;
  /** ISO date when the post was first made public. */
  publishedAt?: Date;
  /** View counter — incremented server-side. */
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/* ─────────────────────────────────────────
   Helper — reading time estimator
   ───────────────────────────────────────── */
function estimateReadingTime(content: string): number {
  const WORDS_PER_MINUTE = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

/* ─────────────────────────────────────────
   Schema
   ───────────────────────────────────────── */
const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, "Blog post title is required."],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters."],
    },

    slug: {
      type: String,
      required: [true, "Slug is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be lowercase letters, numbers, and hyphens only (e.g. 'my-post-title').",
      ],
      maxlength: [200, "Slug cannot exceed 200 characters."],
    },

    content: {
      type: String,
      required: [true, "Post content is required."],
    },

    excerpt: {
      type: String,
      trim: true,
      maxlength: [300, "Excerpt cannot exceed 300 characters."],
    },

    coverImage: {
      type: String,
      trim: true,
      default: undefined,
    },

    author: {
      type: String,
      required: [true, "Author name is required."],
      trim: true,
      maxlength: [100, "Author name cannot exceed 100 characters."],
    },

    authorUrl: {
      type: String,
      trim: true,
      default: undefined,
    },

    category: {
      type: String,
      enum: {
        values: BLOG_CATEGORY_VALUES,
        message: "'{VALUE}' is not a recognised blog category.",
      },
      default: "General",
    },

    tags: {
      type: [String],
      default: [],
      set: (tags: string[]) =>
        tags.map((t) => t.toLowerCase().trim()).filter(Boolean),
    },

    readingTimeMinutes: {
      type: Number,
      min: 1,
      default: 1,
    },

    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },

    publishedAt: {
      type: Date,
      default: undefined,
    },

    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

/* ─────────────────────────────────────────
   Pre-save hook — auto-compute reading time
   and set publishedAt on first publish
   ───────────────────────────────────────── */
BlogPostSchema.pre("save", function () {
  // Recompute reading time whenever content changes.
  if (this.isModified("content")) {
    this.readingTimeMinutes = estimateReadingTime(this.content);
  }

  // Stamp publishedAt the first time the post is published.
  if (this.isModified("isPublished") && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

/* ─────────────────────────────────────────
   Indexes
   ───────────────────────────────────────── */
// slug already unique from schema definition.
// Published listing sorted by most-recent first.
BlogPostSchema.index({ isPublished: 1, publishedAt: -1 });
// Category filtering on the blog listing page.
BlogPostSchema.index({ category: 1, isPublished: 1 });
// Full-text search across title, excerpt, and tags.
BlogPostSchema.index({ title: "text", excerpt: "text", tags: "text" });

/* ─────────────────────────────────────────
   Export
   ───────────────────────────────────────── */
const BlogPost =
  (models.BlogPost as mongoose.Model<IBlogPost>) ??
  model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
