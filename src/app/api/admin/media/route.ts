import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";
import { getMediaAssets, deleteMediaAsset } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const media = await getMediaAssets();
  return NextResponse.json(media);
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Media ID is required" }, { status: 400 });
  }

  // Find asset to remove file if in public/uploads
  const allMedia = await getMediaAssets();
  const asset = allMedia.find((m) => m.id === id);

  if (asset && asset.url.startsWith("/uploads/")) {
    try {
      const filePath = path.join(process.cwd(), "public", asset.url);
      await fs.unlink(filePath).catch(() => {});
    } catch {
      // ignore file unlink failure
    }
  }

  const ok = await deleteMediaAsset(id);
  return NextResponse.json({ success: ok });
}
