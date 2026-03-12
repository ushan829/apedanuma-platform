import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/* ─────────────────────────────────────────
   Lazy initialisation — only runs on first API call at runtime,
   not during Next.js build-time module evaluation.
   ───────────────────────────────────────── */
let _client: S3Client | null = null;
let _bucket = "";
let _publicUrl = "";

function ensureInit() {
  if (_client) return;

  const required = [
    "R2_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
    "R2_PUBLIC_URL",
  ] as const;

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }

  _client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID?.trim()}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId:     process.env.R2_ACCESS_KEY_ID?.trim()     as string,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY?.trim() as string,
    },
  });

  _bucket    = process.env.R2_BUCKET_NAME?.trim() as string;
  _publicUrl = (process.env.R2_PUBLIC_URL?.trim() as string).replace(/\/$/, "");
}

/** Returns the lazily-initialised S3 client. Throws if env vars are missing. */
export function getS3Client(): S3Client {
  ensureInit();
  return _client!;
}

/** Returns the R2 bucket name. Throws if env vars are missing. */
export function getR2Bucket(): string {
  ensureInit();
  return _bucket;
}

/**
 * Generates a presigned URL for secure document viewing.
 * Defaults to 1 hour (3600 seconds) expiry.
 */
export async function getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
  ensureInit();
  const command = new GetObjectCommand({
    Bucket: _bucket,
    Key: key,
  });
  return getSignedUrl(_client!, command, { expiresIn });
}

/**
 * Build a public URL from an object key.
 * e.g. buildPublicUrl("resources/grade-10/science/file.pdf") → "https://…/resources/…"
 */
export function buildPublicUrl(key: string): string {
  ensureInit();
  return `${_publicUrl}/${key}`;
}

/**
 * Format raw byte count into a human-readable label.
 * e.g. 2_456_789 → "2.3 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
