import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { verifyAdminToken, authError } from "@/lib/admin-auth";
import { getS3Client, getR2Bucket, buildPublicUrl } from "@/lib/s3";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png":  "png",
  "image/webp": "webp",
  "image/gif":  "gif",
};

const MAX_SIZE_MB = 10;

/** POST /api/admin/blog/upload-image — upload a blog image to R2 */
export async function POST(req: NextRequest) {
  try { verifyAdminToken(req); } catch (err) {
    const { message, status } = authError(err);
    return NextResponse.json({ success: false, message }, { status });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ success: false, message: "Could not parse form data." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    return NextResponse.json({ success: false, message: "An image file is required." }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { success: false, message: "Only JPEG, PNG, WebP, and GIF images are accepted." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json(
      { success: false, message: `Image must be smaller than ${MAX_SIZE_MB} MB.` },
      { status: 400 }
    );
  }

  try {
    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const key    = `blog-images/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    await getS3Client().send(
      new PutObjectCommand({
        Bucket:       getR2Bucket(),
        Key:          key,
        Body:         buffer,
        ContentType:  file.type,
        ContentLength: buffer.byteLength,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    const url = buildPublicUrl(key);
    return NextResponse.json({ success: true, url });
  } catch (err) {
    const awsErr = err as { Code?: string; message?: string };
    console.error("[POST /api/admin/blog/upload-image]", err);
    return NextResponse.json(
      { success: false, message: `Upload failed: ${awsErr.Code ?? awsErr.message ?? "unknown error"}` },
      { status: 502 }
    );
  }
}
