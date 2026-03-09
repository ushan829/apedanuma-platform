import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { verifyAdminToken, authError } from "@/lib/admin-auth";
import { getS3Client, getR2Bucket } from "@/lib/s3";
import connectToDatabase from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { SUBJECT_VALUES, MATERIAL_TYPE_VALUES } from "@/lib/resource-constants";

type Ctx = { params: { id: string } };

/* ─────────────────────────────────────────
   GET /api/admin/resources/[id]
   Returns a single resource's full details.
   ───────────────────────────────────────── */
export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    verifyAdminToken(req);
  } catch (err) {
    const { message, status } = authError(err);
    return NextResponse.json({ success: false, message }, { status });
  }

  try {
    await connectToDatabase();
    const resource = await Resource.findById(params.id).lean();
    if (!resource) {
      return NextResponse.json({ success: false, message: "Resource not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, resource: { ...resource, _id: String(resource._id) } });
  } catch (err) {
    console.error("[GET /api/admin/resources/:id]", err);
    return NextResponse.json({ success: false, message: "Failed to fetch resource." }, { status: 500 });
  }
}

/* ─────────────────────────────────────────
   PATCH /api/admin/resources/[id]
   Edits metadata fields on a resource.
   The PDF file itself is never replaced here.
   ───────────────────────────────────────── */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    verifyAdminToken(req);
  } catch (err) {
    const { message, status } = authError(err);
    return NextResponse.json({ success: false, message }, { status });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body." }, { status: 400 });
  }

  /* Build the update object — only allow known editable fields */
  const allowed = [
    "title", "description", "grade", "subject", "materialType",
    "term", "year", "isPremium", "price", "isPublished",
  ] as const;

  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  /* Lightweight server-side validation */
  if (update.title !== undefined && typeof update.title !== "string") {
    return NextResponse.json({ success: false, message: "Title must be a string." }, { status: 400 });
  }
  if (update.grade !== undefined && update.grade !== 10 && update.grade !== 11) {
    return NextResponse.json({ success: false, message: "Grade must be 10 or 11." }, { status: 400 });
  }
  if (update.subject !== undefined && !(SUBJECT_VALUES as readonly string[]).includes(String(update.subject))) {
    return NextResponse.json({ success: false, message: "Invalid subject." }, { status: 400 });
  }
  if (update.materialType !== undefined && !(MATERIAL_TYPE_VALUES as readonly string[]).includes(String(update.materialType))) {
    return NextResponse.json({ success: false, message: "Invalid material type." }, { status: 400 });
  }
  if (update.term !== undefined && update.term !== null && ![1, 2, 3].includes(Number(update.term))) {
    return NextResponse.json({ success: false, message: "Term must be 1, 2, or 3." }, { status: 400 });
  }
  if (update.isPremium === true && (update.price === undefined || Number(update.price) <= 0)) {
    // Only enforce if price is being simultaneously updated — otherwise keep existing price
    if ("price" in update) {
      return NextResponse.json({ success: false, message: "A valid price is required for premium resources." }, { status: 400 });
    }
  }

  /* Clear term if materialType is changing away from Term Test Paper */
  if (update.materialType && update.materialType !== "Term Test Paper") {
    update.term = undefined;
  }

  try {
    await connectToDatabase();
    const resource = await Resource.findByIdAndUpdate(
      params.id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!resource) {
      return NextResponse.json({ success: false, message: "Resource not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Resource updated successfully.",
      resource: { ...resource, _id: String(resource._id) },
    });
  } catch (err) {
    console.error("[PATCH /api/admin/resources/:id]", err);
    const mongoErr = err as { name?: string; errors?: Record<string, { message: string }> };
    if (mongoErr.name === "ValidationError" && mongoErr.errors) {
      const msg = Object.values(mongoErr.errors)[0]?.message ?? "Validation failed.";
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Failed to update resource." }, { status: 500 });
  }
}

/* ─────────────────────────────────────────
   DELETE /api/admin/resources/[id]
   1. Find resource → get pdfUrl → extract R2 key
   2. Delete file from Cloudflare R2
   3. Delete record from MongoDB
   ───────────────────────────────────────── */
export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    verifyAdminToken(req);
  } catch (err) {
    const { message, status } = authError(err);
    return NextResponse.json({ success: false, message }, { status });
  }

  try {
    await connectToDatabase();

    /* Step A — find the resource */
    const resource = await Resource.findById(params.id).select("pdfUrl title").lean();
    if (!resource) {
      return NextResponse.json({ success: false, message: "Resource not found." }, { status: 404 });
    }

    /* Step B — extract R2 object key from the stored public URL */
    let objectKey: string | null = null;
    try {
      const url = new URL(resource.pdfUrl as string);
      objectKey = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
    } catch {
      // If the URL is malformed, log but don't block the DB delete
      console.warn("[DELETE /api/admin/resources/:id] Could not parse pdfUrl:", resource.pdfUrl);
    }

    /* Step C — delete from R2 (best-effort; don't fail if R2 is unreachable) */
    if (objectKey) {
      try {
        await getS3Client().send(
          new DeleteObjectCommand({ Bucket: getR2Bucket(), Key: objectKey })
        );
        console.log("[DELETE /api/admin/resources/:id] R2 object deleted:", objectKey);
      } catch (r2Err) {
        console.error("[DELETE /api/admin/resources/:id] R2 delete failed (proceeding with DB delete):", r2Err);
      }
    }

    /* Step D — delete from MongoDB */
    await Resource.findByIdAndDelete(params.id);
    console.log("[DELETE /api/admin/resources/:id] MongoDB record deleted:", params.id);

    return NextResponse.json({ success: true, message: `"${resource.title}" deleted successfully.` });
  } catch (err) {
    console.error("[DELETE /api/admin/resources/:id]", err);
    return NextResponse.json({ success: false, message: "Failed to delete resource." }, { status: 500 });
  }
}
