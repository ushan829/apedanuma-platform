import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client, getR2Bucket } from "@/lib/s3";
import connectToDatabase from "@/lib/mongodb";
import Resource from "@/models/Resource";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  /* 1. Look up the resource in MongoDB ─────────────────────────────────── */
  let pdfUrl: string;
  let fileName: string;

  try {
    await connectToDatabase();
    const resource = await Resource.findById(id).select(
      "pdfUrl title isPremium isPublished"
    );

    if (!resource || !resource.isPublished) {
      return NextResponse.json(
        { success: false, message: "Resource not found." },
        { status: 404 }
      );
    }

    if (resource.isPremium) {
      return NextResponse.json(
        { success: false, message: "This is a premium resource." },
        { status: 403 }
      );
    }

    pdfUrl = resource.pdfUrl as string;
    fileName = `${resource.title.replace(/[^a-z0-9\s-]/gi, "").replace(/\s+/g, "-")}.pdf`;
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to retrieve resource." },
      { status: 500 }
    );
  }

  /* 2. Derive the R2 object key from the stored public URL ─────────────── */
  //  pdfUrl looks like: https://<domain>/resources/grade-10/science/timestamp-uuid.pdf
  //  We need just the path after the domain.
  let objectKey: string;
  try {
    const url = new URL(pdfUrl);
    objectKey = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid resource URL." },
      { status: 500 }
    );
  }

  /* 3. Fetch the PDF from Cloudflare R2 ───────────────────────────────── */
  try {
    const command = new GetObjectCommand({
      Bucket: getR2Bucket(),
      Key: objectKey,
    });

    const s3Response = await getS3Client().send(command);

    if (!s3Response.Body) {
      return NextResponse.json(
        { success: false, message: "File not found in storage." },
        { status: 404 }
      );
    }

    /* 4. Increment download count (fire-and-forget, don't block) ──────── */
    Resource.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } }).catch(
      () => {} // silent fail — not critical
    );

    /* 5. Stream back with force-download headers ───────────────────────── */
    // Use the Web Stream directly — no buffering in memory.
    // Content-Length is omitted because the length is unknown until the
    // stream is consumed; browsers handle chunked transfers fine.
    const stream = s3Response.Body.transformToWebStream();

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[GET /api/download] R2 fetch error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch file from storage." },
      { status: 502 }
    );
  }
}
