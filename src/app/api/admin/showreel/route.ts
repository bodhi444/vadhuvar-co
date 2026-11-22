import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getShowreel, updateShowreel } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const showreel = await getShowreel();
  return NextResponse.json(showreel);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const updated = await updateShowreel(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Showreel update error:", error);
    return NextResponse.json({ error: "Failed to update showreel" }, { status: 500 });
  }
}
