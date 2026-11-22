import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";
import { createMediaAsset } from "@/lib/db";

// Max sizes: 25MB for images, 100MB for videos
const MAX_IMAGE_SIZE = 25 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];

export async function POST(request: Request) {
  try {
    // 1. Authorize admin
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const mimeType = file.type;
    const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          error: `Unsupported file format (${mimeType}). Allowed formats: JPG, PNG, WebP, SVG, MP4, WebM.`,
        },
        { status: 400 }
      );
    }

    // 3. Validate size
    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: `Image exceeds maximum permitted size of 25MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).` },
        { status: 400 }
      );
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: `Video exceeds maximum permitted size of 100MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).` },
        { status: 400 }
      );
    }

    // 4. Sanitize and create unique file path
    const originalName = file.name || "upload";
    const ext = path.extname(originalName) || (isImage ? ".jpg" : ".mp4");
    const sanitizedBase = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "_")
      .slice(0, 40);
    const uniqueFilename = `${sanitizedBase}-${Date.now()}${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, uniqueFilename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;

    // 5. Index into Media Library database
    const asset = await createMediaAsset({
      filename: uniqueFilename,
      original_name: originalName,
      url: publicUrl,
      file_type: isImage ? "image" : "video",
      mime_type: mimeType,
      file_size: file.size,
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      asset,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error during file upload" },
      { status: 500 }
    );
  }
}
