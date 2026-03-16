import mongoose, { Schema, model, models, type Document } from "mongoose";

/* ─────────────────────────────────────────
   Enums / union types
   Re-exported from the constants file so server code can keep using
   @/models/Resource as a single import, while client components import
   from @/lib/resource-constants to avoid bundling mongoose → mongodb → net.
   ───────────────────────────────────────── */
// Import for use within this file
import {
  SUBJECT_VALUES,
  MATERIAL_TYPE_VALUES,
  type Grade,
  type Subject,
  type MaterialType,
} from "@/lib/resource-constants";

// Re-export so server code can still do: import { SUBJECT_VALUES } from "@/models/Resource"
export type { Grade, Subject, MaterialType } from "@/lib/resource-constants";
export { SUBJECT_VALUES, MATERIAL_TYPE_VALUES } from "@/lib/resource-constants";

/* ─────────────────────────────────────────
   TypeScript interface
   ───────────────────────────────────────── */
export interface IResource extends Document {
  title: string;
  /** URL-friendly identifier, e.g. "grade-10-science-2023-term-1". Must be unique. */
  slug: string;
  description: string;
  grade: Grade;
  subject: Subject;
  /** Term number — applicable to Term Test Papers (1, 2, or 3). */
  term?: 1 | 2 | 3;
  materialType: MaterialType;
  isPremium: boolean;
  /** Price in LKR. Required when isPremium is true. */
  price?: number;
  /** Publicly accessible URL to the full PDF (stored in cloud storage). */
  pdfUrl: string;
  /** URL for a cover/thumbnail image shown in listing cards. */
  previewImageUrl?: string;
  /** Number of PDF pages. */
  pageCount?: number;
  /** Approximate file size label shown to users, e.g. "2.4 MB". */
  fileSize?: string;
  /** Academic year the paper is from, e.g. 2023. */
  year?: number;
  /** Download count — incremented server-side on each download. */
  downloadCount: number;
  /** Whether the resource is visible/published on the platform. */
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/* ─────────────────────────────────────────
   Schema
   ───────────────────────────────────────── */
const ResourceSchema = new Schema<IResource>(
  {
    title: {
      type: String,
      required: [true, "Resource title is required."],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters."],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be lowercase letters, numbers, and hyphens only.",
      ],
      maxlength: [250, "Slug cannot exceed 250 characters."],
    },

    description: {
      type: String,
      required: [true, "A short description is required."],
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters."],
    },

    grade: {
      type: Number,
      required: [true, "Grade is required."],
      enum: {
        values: [10, 11],
        message: "Grade must be 10 or 11.",
      },
    },

    subject: {
      type: String,
      required: [true, "Subject is required."],
      enum: {
        values: SUBJECT_VALUES,
        message: "'{VALUE}' is not a recognised O/L subject.",
      },
    },

    term: {
      type: Number,
      enum: {
        values: [1, 2, 3],
        message: "Term must be 1, 2, or 3.",
      },
      default: undefined,
    },

    materialType: {
      type: String,
      required: [true, "Material type is required."],
      enum: {
        values: MATERIAL_TYPE_VALUES,
        message: "'{VALUE}' is not a recognised material type.",
      },
    },

    isPremium: {
      type: Boolean,
      required: true,
      default: false,
    },

    price: {
      type: Number,
      min: [0, "Price cannot be negative."],
      validate: {
        validator(this: IResource, value: number | undefined) {
          // Price is mandatory for premium resources.
          if (this.isPremium && (value === undefined || value === null)) {
            return false;
          }
          return true;
        },
        message: "Price is required for premium resources.",
      },
    },

    pdfUrl: {
      type: String,
      required: [true, "PDF URL is required."],
      trim: true,
    },

    previewImageUrl: {
      type: String,
      trim: true,
      default: undefined,
    },

    pageCount: {
      type: Number,
      min: [1, "Page count must be at least 1."],
    },

    fileSize: {
      type: String,
      trim: true,
    },

    year: {
      type: Number,
      min: [2000, "Year seems too early."],
      max: [new Date().getFullYear() + 1, "Year cannot be in the far future."],
    },

    downloadCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/* ─────────────────────────────────────────
   Indexes
   ───────────────────────────────────────── */
// Primary listing query: grade + subject + materialType
ResourceSchema.index({ grade: 1, subject: 1, materialType: 1 });
// Free vs. premium filtering
ResourceSchema.index({ isPremium: 1, isPublished: 1 });
// Text search across title and description
ResourceSchema.index({ title: "text", description: "text" });

/* ─────────────────────────────────────────
   Export
   ───────────────────────────────────────── */
const Resource =
  (models.Resource as mongoose.Model<IResource>) ??
  model<IResource>("Resource", ResourceSchema);

export default Resource;
