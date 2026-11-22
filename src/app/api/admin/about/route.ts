import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAboutContent, updateAboutContent } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const about = await getAboutContent();
  return NextResponse.json(about);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const updated = await updateAboutContent(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("About update error:", error);
    return NextResponse.json({ error: "Failed to update about content" }, { status: 500 });
  }
}
