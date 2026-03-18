/**
 * resource-constants.ts
 *
 * Pure data — no Mongoose, no Node.js APIs.
 * Safe to import in both Server Components/Routes AND Client Components.
 *
 * The Mongoose model (src/models/Resource.ts) re-exports from here so
 * server-only code keeps a single import path, while client components
 * import directly from this file to avoid bundling mongoose → mongodb → net.
 */

/** O/L grade levels supported by the platform. */
export type Grade = 10 | 11;

/** Broad subject areas matching the Sri Lankan G.C.E. O/L curriculum.
 *  Must mirror the subjects used in SUBJECT_CATEGORIES (free-resources.ts).
 */
export const SUBJECT_VALUES = [
  // ── Main Subjects ──────────────────────────────────────────────────
  "Science",
  "Mathematics",
  "English",
  "History",

  // ── Religion ───────────────────────────────────────────────────────
  "Buddhism",
  "Hinduism",
  "Catholicism",
  "Christianity",
  "Islam",

  // ── Language & Literature ──────────────────────────────────────────
  "Sinhala Language & Literature",
  "Tamil Language & Literature",

  // ── Category 1 ─────────────────────────────────────────────────────
  "Business & Accounting Studies",
  "Geography",
  "Civics",
  "Entrepreneurship",
  "Second Language (Sinhala)",
  "Second Language (Tamil)",
  "Pali",
  "Sanskrit",
  "French",
  "German",
  "Hindi",
  "Japanese",
  "Arabic",
  "Korean",
  "Chinese",
  "Russian",

  // ── Category 2 ─────────────────────────────────────────────────────
  "Music (Oriental)",
  "Music (Western)",
  "Music (Carnatic)",
  "Art",
  "Dancing (National)",
  "Dancing (Bharata)",
  "English Literature Appreciation",
  "Sinhala Literature Appreciation",
  "Tamil Literature Appreciation",
  "Arabic Literature Appreciation",
  "Drama & Theatre (English)",

  // ── Category 3 ─────────────────────────────────────────────────────
  "ICT",
  "Agriculture & Food Technology",
  "Aquatic Resources Technology",
  "Design & Arts",
  "Home Economics",
  "Health & PE",
  "Communication & Media",
  "Design & Construction",
  "Design & Mechanical",
  "E-type & Short Hand (English)",
] as const;

export type Subject = (typeof SUBJECT_VALUES)[number];

/** Material types available in the resource library. */
export const MATERIAL_TYPE_VALUES = [
  "Past Paper",
  "Term Test Paper",
  "Marking Scheme",
  "Short Note",
  "Model Paper",
  "Revision Paper",
  "MCQ Paper",
  "Essay Guide",
] as const;

export type MaterialType = (typeof MATERIAL_TYPE_VALUES)[number];

/**
 * Plain-object shape of a Resource document fetched from MongoDB.
 * No Mongoose types — safe to pass from Server Components to Client Components.
 * Used for both free and premium resources (price is populated only for premium).
 */
export interface LiveResource {
  _id: string;
  title: string;
  slug: string;
  description: string;
  grade: 10 | 11;
  subject: string;
  materialType: string;
  term?: 1 | 2 | 3;
  year?: number;
  pageCount?: number;
  fileSize?: string;
  downloadCount: number;
  /** Populated only for isPremium resources (LKR). */
  price?: number;
  /** URL for a cover/thumbnail image shown in listing cards. */
  previewImageUrl?: string;
  /** Publicly accessible URL to the full PDF (stored in cloud storage). */
  pdfUrl: string;
}
