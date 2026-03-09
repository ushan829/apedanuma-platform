import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { verifyAdminToken, type AdminJwtPayload } from "@/lib/admin-auth";
import { getS3Client, getR2Bucket, buildPublicUrl, formatFileSize } from "@/lib/s3";
import connectToDatabase from "@/lib/mongodb";
import Resource, { type IResource } from "@/models/Resource";
import { SUBJECT_VALUES, MATERIAL_TYPE_VALUES } from "@/lib/resource-constants";

const LOG = "[POST /api/admin/upload]";

/* ─────────────────────────────────────────
   POST /api/admin/upload
   ───────────────────────────────────────── */
export async function POST(req: NextRequest) {
  console.log(`\n${"─".repeat(60)}`);
  console.log(`${LOG} ► Request received`);

  /* ── Env-var pre-flight (log once so we know what's missing) ── */
  const r2Vars = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME", "R2_PUBLIC_URL"];
  const missing = r2Vars.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`${LOG} ✗ MISSING ENV VARS: ${missing.join(", ")}`);
    console.error(`${LOG}   These must be set in .env.local for uploads to work.`);
  } else {
    console.log(`${LOG} ✓ All R2 env vars present`);
    console.log(`${LOG}   R2_ACCOUNT_ID  : ${process.env.R2_ACCOUNT_ID}`);
    console.log(`${LOG}   R2_BUCKET_NAME : ${process.env.R2_BUCKET_NAME}`);
    console.log(`${LOG}   R2_PUBLIC_URL  : ${process.env.R2_PUBLIC_URL}`);
    console.log(`${LOG}   Endpoint       : https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`);
  }

  /* 1. Authenticate & authorise ──────────────────────────────────────── */
  console.log(`\n${LOG} ── Step 1: Auth`);
  let _admin: AdminJwtPayload;
  try {
    _admin = verifyAdminToken(req);
    console.log(`${LOG} ✓ Admin verified: ${_admin.email} (role=${_admin.role})`);
  } catch (err) {
    const e = err as Error & { status?: number };
    console.error(`${LOG} ✗ Auth failed: ${e.message}`);
    return NextResponse.json({ success: false, message: e.message }, { status: e.status ?? 401 });
  }

  /* 2. Parse FormData ────────────────────────────────────────────────── */
  console.log(`\n${LOG} ── Step 2: Parse FormData`);
  let formData: FormData;
  try {
    formData = await req.formData();
    console.log(`${LOG} ✓ FormData parsed`);
  } catch (err) {
    console.error(`${LOG} ✗ FormData parse failed:`, err);
    return NextResponse.json({ success: false, message: "Could not parse form data." }, { status: 400 });
  }

  const file        = formData.get("file") as File | null;
  const title       = (formData.get("title")       as string | null)?.trim();
  const description = (formData.get("description") as string | null)?.trim();
  const gradeRaw    = formData.get("grade")         as string | null;
  const subject     = formData.get("subject")       as string | null;
  const materialType= formData.get("materialType")  as string | null;
  const isPremiumRaw= formData.get("isPremium")     as string | null;
  const priceRaw    = formData.get("price")         as string | null;
  const termRaw     = formData.get("term")          as string | null;
  const yearRaw     = formData.get("year")          as string | null;

  console.log(`${LOG}   Fields received:`);
  console.log(`${LOG}     title        = "${title}"`);
  console.log(`${LOG}     grade        = "${gradeRaw}"`);
  console.log(`${LOG}     subject      = "${subject}"`);
  console.log(`${LOG}     materialType = "${materialType}"`);
  console.log(`${LOG}     isPremium    = "${isPremiumRaw}"  price="${priceRaw}"`);
  console.log(`${LOG}     term         = "${termRaw}"  year="${yearRaw}"`);
  console.log(`${LOG}     file         = ${file ? `"${file.name}" (${file.size} bytes, type="${file.type}")` : "null"}`);

  /* 3. Validate required fields ──────────────────────────────────────── */
  console.log(`\n${LOG} ── Step 3: Validation`);

  if (!file || file.size === 0) {
    console.warn(`${LOG} ✗ Validation: no file or empty file`);
    return NextResponse.json({ success: false, message: "A PDF file is required." }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    console.warn(`${LOG} ✗ Validation: wrong file type "${file.type}"`);
    return NextResponse.json({ success: false, message: "Only PDF files are accepted." }, { status: 400 });
  }
  const MAX_SIZE_MB = 50;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    console.warn(`${LOG} ✗ Validation: file too large (${(file.size / 1024 / 1024).toFixed(1)} MB)`);
    return NextResponse.json({ success: false, message: `File size must not exceed ${MAX_SIZE_MB} MB.` }, { status: 400 });
  }
  if (!title) {
    console.warn(`${LOG} ✗ Validation: title missing`);
    return NextResponse.json({ success: false, message: "Title is required." }, { status: 400 });
  }
  if (!description) {
    console.warn(`${LOG} ✗ Validation: description missing`);
    return NextResponse.json({ success: false, message: "Description is required." }, { status: 400 });
  }

  const grade = Number(gradeRaw);
  if (grade !== 10 && grade !== 11) {
    console.warn(`${LOG} ✗ Validation: invalid grade "${gradeRaw}"`);
    return NextResponse.json({ success: false, message: "Grade must be 10 or 11." }, { status: 400 });
  }
  if (!subject || !(SUBJECT_VALUES as readonly string[]).includes(subject)) {
    console.warn(`${LOG} ✗ Validation: invalid subject "${subject}"`);
    return NextResponse.json({ success: false, message: "Invalid subject." }, { status: 400 });
  }
  if (!materialType || !(MATERIAL_TYPE_VALUES as readonly string[]).includes(materialType)) {
    console.warn(`${LOG} ✗ Validation: invalid materialType "${materialType}"`);
    return NextResponse.json({ success: false, message: "Invalid material type." }, { status: 400 });
  }

  const isPremium = isPremiumRaw === "true";
  const price     = isPremium ? Number(priceRaw) : undefined;
  if (isPremium && (!price || isNaN(price) || price <= 0)) {
    console.warn(`${LOG} ✗ Validation: premium but invalid price "${priceRaw}"`);
    return NextResponse.json({ success: false, message: "A valid price is required for premium resources." }, { status: 400 });
  }

  const term = termRaw ? Number(termRaw) : undefined;
  if (term !== undefined && ![1, 2, 3].includes(term)) {
    console.warn(`${LOG} ✗ Validation: invalid term "${termRaw}"`);
    return NextResponse.json({ success: false, message: "Term must be 1, 2, or 3." }, { status: 400 });
  }

  const year = yearRaw ? Number(yearRaw) : undefined;
  console.log(`${LOG} ✓ Validation passed — grade=${grade}, isPremium=${isPremium}, term=${term}, year=${year}`);

  /* 4. Upload file to Cloudflare R2 ──────────────────────────────────── */
  console.log(`\n${LOG} ── Step 4: R2 Upload`);
  let pdfUrl: string;
  const fileSize = formatFileSize(file.size);

  try {
    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log(`${LOG}   Buffer ready: ${buffer.byteLength} bytes`);

    const subjectSlug = subject.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const uniqueKey   = `resources/grade-${grade}/${subjectSlug}/${Date.now()}-${crypto.randomUUID()}.pdf`;
    console.log(`${LOG}   Object key  : ${uniqueKey}`);
    console.log(`${LOG}   Bucket      : ${getR2Bucket()}`);
    console.log(`${LOG}   Endpoint    : https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`);

    console.log(`${LOG}   Sending PutObjectCommand…`);
    await getS3Client().send(
      new PutObjectCommand({
        Bucket:             getR2Bucket(),
        Key:                uniqueKey,
        Body:               buffer,
        ContentType:        "application/pdf",
        ContentLength:      buffer.byteLength,
        ContentDisposition: `inline; filename="${encodeURIComponent(file.name)}"`,
        CacheControl:       "public, max-age=31536000, immutable",
        Metadata: {
          title,
          subject,
          grade:        String(grade),
          materialType: materialType,
          uploadedBy:   _admin.email,
        },
      })
    );

    pdfUrl = buildPublicUrl(uniqueKey);
    console.log(`${LOG} ✓ R2 upload succeeded`);
    console.log(`${LOG}   Public URL  : ${pdfUrl}`);
  } catch (err) {
    console.error(`${LOG} ✗ R2 upload FAILED:`);
    console.error(err);
    // Surface the raw AWS error message to help diagnose credential / bucket issues
    const awsErr = err as { Code?: string; message?: string; $metadata?: { httpStatusCode?: number } };
    console.error(`${LOG}   AWS Code    : ${awsErr.Code ?? "n/a"}`);
    console.error(`${LOG}   AWS Message : ${awsErr.message ?? "n/a"}`);
    console.error(`${LOG}   HTTP Status : ${awsErr.$metadata?.httpStatusCode ?? "n/a"}`);
    return NextResponse.json(
      { success: false, message: `R2 upload failed: ${awsErr.Code ?? awsErr.message ?? "unknown error"}` },
      { status: 502 }
    );
  }

  /* 5. Persist resource document in MongoDB ──────────────────────────── */
  console.log(`\n${LOG} ── Step 5: MongoDB Save`);
  try {
    await connectToDatabase();
    console.log(`${LOG}   DB connected`);

    const doc: Partial<IResource> = {
      title,
      description,
      grade,
      subject:      subject     as IResource["subject"],
      materialType: materialType as IResource["materialType"],
      isPremium,
      pdfUrl,
      fileSize,
      isPublished: true,
    };
    if (term !== undefined) doc.term = term as 1 | 2 | 3;
    if (year !== undefined) doc.year = year;
    if (isPremium && price)  doc.price = price;

    console.log(`${LOG}   Creating document…`);
    const resource = (await Resource.create([doc]))[0] as IResource;
    const savedId  = (resource as IResource & { _id: unknown })._id;
    console.log(`${LOG} ✓ MongoDB save succeeded — _id: ${savedId}`);

    return NextResponse.json(
      {
        success:  true,
        message:  "Resource uploaded and published successfully.",
        resource: {
          id:           savedId,
          title:        resource.title,
          subject:      resource.subject,
          grade:        resource.grade,
          materialType: resource.materialType,
          isPremium:    resource.isPremium,
          pdfUrl:       resource.pdfUrl,
          fileSize:     resource.fileSize,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(`${LOG} ✗ MongoDB save FAILED:`);
    console.error(err);

    if (err !== null && typeof err === "object" && (err as { name?: string }).name === "ValidationError") {
      const mongoErr = err as { errors: Record<string, { message: string }> };
      const msg = Object.values(mongoErr.errors)[0]?.message ?? "Validation failed.";
      console.error(`${LOG}   Mongoose validation error: ${msg}`);
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, message: "Failed to save resource to the database." },
      { status: 500 }
    );
  }
}
