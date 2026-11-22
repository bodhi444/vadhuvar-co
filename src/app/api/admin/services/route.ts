import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getServices,
  createService,
  updateService,
  deleteService,
  reorderServices,
} from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const services = await getServices(false);
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.title || !body.description || !body.image_url) {
      return NextResponse.json(
        { error: "Title, description, and image URL are required" },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const newService = await createService({
      title: body.title,
      slug,
      description: body.description,
      full_description: body.full_description || body.description,
      image_url: body.image_url,
      icon: body.icon || "Film",
      display_order: body.display_order ?? 99,
      is_active: body.is_active ?? true,
    });

    return NextResponse.json({ success: true, data: newService });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    const updated = await updateService(body.id, body);
    if (!updated) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
  }

  const ok = await deleteService(id);
  return NextResponse.json({ success: ok });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { orderedIds } = await request.json();
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "orderedIds array is required" }, { status: 400 });
    }

    const reordered = await reorderServices(orderedIds);
    return NextResponse.json({ success: true, data: reordered });
  } catch (error) {
    console.error("Reorder services error:", error);
    return NextResponse.json({ error: "Failed to reorder services" }, { status: 500 });
  }
}
