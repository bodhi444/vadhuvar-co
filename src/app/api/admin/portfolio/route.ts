import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await getProjects({ onlyPublished: false });
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    if (!body.title || !body.category || !body.thumbnail_url) {
      return NextResponse.json(
        { error: "Title, category, and thumbnail URL are required" },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const newProject = await createProject({
      title: body.title,
      slug,
      category: body.category,
      short_description: body.short_description || "",
      full_description: body.full_description || body.short_description || "",
      thumbnail_url: body.thumbnail_url,
      gallery_images: Array.isArray(body.gallery_images) ? body.gallery_images : [],
      video_url: body.video_url || "",
      youtube_url: body.youtube_url || "",
      vimeo_url: body.vimeo_url || "",
      year: body.year || new Date().getFullYear().toString(),
      client: body.client || "",
      is_featured: Boolean(body.is_featured),
      is_published: body.is_published !== undefined ? Boolean(body.is_published) : true,
      display_order: body.display_order ?? 99,
    });

    return NextResponse.json({ success: true, data: newProject });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const updated = await updateProject(body.id, body);
    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  const ok = await deleteProject(id);
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

    const reordered = await reorderProjects(orderedIds);
    return NextResponse.json({ success: true, data: reordered });
  } catch (error) {
    console.error("Reorder projects error:", error);
    return NextResponse.json({ error: "Failed to reorder projects" }, { status: 500 });
  }
}
