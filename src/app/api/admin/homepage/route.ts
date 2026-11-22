import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getHomepageContent, updateHomepageContent } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await getHomepageContent();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const updated = await updateHomepageContent(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Homepage update error:", error);
    return NextResponse.json({ error: "Failed to update homepage content" }, { status: 500 });
  }
}
