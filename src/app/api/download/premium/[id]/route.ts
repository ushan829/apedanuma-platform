import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSession } from "@/lib/auth-cookie";
import { getS3Client, getR2Bucket } from "@/lib/s3";
import connectToDatabase from "@/lib/mongodb";
import Resource from "@/models/Resource";
import User from "@/models/User";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  /* 1. Verify session cookie ───────────────────────────────────────────── */
  const session = getSession(req);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Authentication required." },
      { status: 401 }
    );
  }

  /* 2. Connect to DB and fetch resource ────────────────────────────────── */
  try {
    await connectToDatabase();
  } catch {
    return NextResponse.json(
      { success: false, message: "Database connection failed." },
      { status: 500 }
    );
  }

  const resource = await Resource.findById(id).select(
    "pdfUrl title isPremium isPublished"
  );

  if (!resource || !resource.isPublished) {
    return NextResponse.json(
      { success: false, message: "Resource not found." },
      { status: 404 }
    );
  }

  if (!resource.isPremium) {
    return NextResponse.json(
      { success: false, message: "This resource is free. Use the standard download endpoint." },
      { status: 400 }
    );
  }

  /* 3. Authorisation check ─────────────────────────────────────────────── */
  const isAdmin = session.role === "admin";

  if (!isAdmin) {
    const user = await User.findById(session.sub)
      .select("purchasedResources")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User account not found." },
        { status: 401 }
      );
    }

    const hasPurchased = user.purchasedResources.some(
      (purchasedId) => String(purchasedId) === id
    );

    if (!hasPurchased) {
      return NextResponse.json(
        { success: false, message: "You have not purchased this resource." },
        { status: 403 }
      );
    }
  }

  /* 4. Derive the R2 object key from the stored public URL ─────────────── */
  let objectKey: string;
  try {
    const url = new URL(resource.pdfUrl as string);
    // decodeURIComponent is crucial to convert '%20' back to spaces, otherwise R2 throws NoSuchKey
    const rawPath = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
    objectKey = decodeURIComponent(rawPath);
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid resource URL." },
      { status: 500 }
    );
  }

  /* 5. Fetch the PDF from Cloudflare R2 ────────────────────────────────── */
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

    Resource.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } }).catch(() => {});

    const safeFileName = (resource.title as string)
      .replace(/[^a-z0-9\s-]/gi, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    // Use transformToWebStream() and cast to any as Next.js 14 requires it for BodyInit
    const stream = s3Response.Body.transformToWebStream() as any;

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(safeFileName)}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("🟢 PREMIUM DOWNLOAD ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch file from storage." },
      { status: 502 }
    );
  }
}
