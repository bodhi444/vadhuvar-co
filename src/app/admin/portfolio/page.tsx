"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import MediaUploader from "@/components/admin/MediaUploader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/Toast";
import { Project, ProjectCategory } from "@/types";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Film,
  Sparkles,
  MoveUp,
  MoveDown,
  Loader2,
  X,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  Clock,
  Star,
  Video,
} from "lucide-react";

const CATEGORIES: ProjectCategory[] = [
  "All",
  "Commercial",
  "Concert Video",
  "Podcast",
  "Photography",
  "Fine Art",
  "Wedding",
];

export default function ManagePortfolioPage() {
  const { success, error: toastError } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<ProjectCategory>("All");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Delete modal state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<Project["category"]>("Wedding");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryInput, setNewGalleryInput] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [vimeoUrl, setVimeoUrl] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [client, setClient] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/portfolio");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else {
        toastError("Failed to fetch portfolio projects");
      }
    } catch {
      toastError("Network error loading projects");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setTitle("");
    setSlug("");
    setCategory("Commercial");
    setShortDesc("");
    setFullDesc("");
    setThumbnailUrl("/works/hero/hero-1.jpg");
    setGalleryImages([]);
    setNewGalleryInput("");
    setVideoUrl("");
    setYoutubeUrl("");
    setVimeoUrl("");
    setYear(new Date().getFullYear().toString());
    setClient("");
    setIsFeatured(false);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setTitle(p.title);
    setSlug(p.slug);
    setCategory(p.category);
    setShortDesc(p.short_description);
    setFullDesc(p.full_description);
    setThumbnailUrl(p.thumbnail_url);
    setGalleryImages(Array.isArray(p.gallery_images) ? [...p.gallery_images] : []);
    setNewGalleryInput("");
    setVideoUrl(p.video_url || "");
    setYoutubeUrl(p.youtube_url || "");
    setVimeoUrl(p.vimeo_url || "");
    setYear(p.year);
    setClient(p.client || "");
    setIsFeatured(p.is_featured);
    setIsPublished(p.is_published);
    setIsModalOpen(true);
  };

  const addGalleryImage = (url: string) => {
    if (!url) return;
    if (!galleryImages.includes(url)) {
      setGalleryImages([...galleryImages, url]);
    }
    setNewGalleryInput("");
  };

  const removeGalleryImage = (idx: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !thumbnailUrl || !category) {
      toastError("Title, category, and thumbnail URL are required.");
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        title,
        slug,
        category,
        short_description: shortDesc,
        full_description: fullDesc,
        thumbnail_url: thumbnailUrl,
        gallery_images: galleryImages,
        video_url: videoUrl,
        youtube_url: youtubeUrl,
        vimeo_url: vimeoUrl,
        year,
        client,
        is_featured: isFeatured,
        is_published: isPublished,
      };

      if (editingProject) {
        // Update
        const res = await fetch("/api/admin/portfolio", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProject.id, ...payload }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          success("Project updated successfully!");
          setIsModalOpen(false);
          fetchProjects();
        } else {
          toastError(data.error || "Failed to update project");
        }
      } else {
        // Create
        const res = await fetch("/api/admin/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, display_order: projects.length + 1 }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          success("New project created successfully!");
          setIsModalOpen(false);
          fetchProjects();
        } else {
          toastError(data.error || "Failed to create project");
        }
      }
    } catch {
      toastError("Error saving project");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/portfolio?id=${projectToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success(`Project "${projectToDelete.title}" removed.`);
        setProjectToDelete(null);
        fetchProjects();
      } else {
        toastError(data.error || "Failed to delete project");
      }
    } catch {
      toastError("Network error deleting project");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleTogglePublish = async (p: Project) => {
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, is_published: !p.is_published }),
      });
      if (res.ok) {
        success(`Project ${!p.is_published ? "published live" : "moved to drafts"}.`);
        fetchProjects();
      }
    } catch {
      toastError("Failed to update status");
    }
  };

  const handleToggleFeatured = async (p: Project) => {
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, is_featured: !p.is_featured }),
      });
      if (res.ok) {
        success(`Project featured toggle updated.`);
        fetchProjects();
      }
    } catch {
      toastError("Failed to update featured toggle");
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === projects.length - 1)
    ) {
      return;
    }

    const newOrder = [...projects];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;

    setProjects(newOrder);

    try {
      const orderedIds = newOrder.map((p) => p.id);
      await fetch("/api/admin/portfolio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      success("Project sequence updated.");
    } catch {
      toastError("Failed to save reordered list");
    }
  };

  const filteredProjects =
    selectedCategoryFilter === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategoryFilter);

  return (
    <div className="flex min-h-screen bg-cinematic-bg text-white">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Manage Portfolio"
          subtitle="Add films, upload high-fidelity 4K thumbnails & galleries, configure video embeds, and organize order"
        />

        <main className="p-8 max-w-7xl space-y-8 flex-1 overflow-y-auto">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cinematic-surface border border-cinematic-border p-4 rounded-sm">
            <div>
              <h2 className="text-sm font-semibold text-white">Films & Works Portfolio</h2>
              <p className="text-xs text-cinematic-textDim">
                Published projects appear dynamically in the public /work gallery and homepage portfolio.
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="btn-gold text-xs py-2 px-4 flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Add New Project</span>
            </button>
          </div>

          {/* Category Filters Bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-cinematic-border pb-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-medium transition-all ${
                  selectedCategoryFilter === cat
                    ? "bg-cinematic-gold text-black font-semibold"
                    : "text-cinematic-textMuted hover:text-white bg-black/40 border border-cinematic-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-cinematic-textMuted">
              <Loader2 className="w-8 h-8 text-cinematic-gold animate-spin mb-3" />
              <p className="text-sm">Loading portfolio projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-12 text-center bg-cinematic-surface border border-cinematic-border rounded-sm">
              <Film className="w-10 h-10 text-cinematic-gold mx-auto mb-3 opacity-60" />
              <h3 className="text-sm font-semibold text-white mb-1">No Projects Found</h3>
              <p className="text-xs text-cinematic-textMuted mb-4">
                No films in category "{selectedCategoryFilter}". Add your first project now.
              </p>
              <button onClick={openCreateModal} className="btn-gold text-xs py-2 px-4">
                Add New Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`bg-cinematic-surface border rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                    project.is_published
                      ? "border-cinematic-border hover:border-cinematic-gold/40"
                      : "border-cinematic-border/40 opacity-75"
                  }`}
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative w-full h-52 bg-black">
                      {project.thumbnail_url ? (
                        <Image
                          src={project.thumbnail_url}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-white/30">
                          No thumbnail
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 border border-cinematic-border text-cinematic-gold">
                            #{index + 1}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/80 text-white border border-cinematic-border">
                            {project.category}
                          </span>
                          {project.is_featured && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-cinematic-gold text-black font-bold flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              Featured
                            </span>
                          )}
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase ${
                            project.is_published
                              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                              : "bg-amber-950/80 text-amber-400 border border-amber-800/60"
                          }`}
                        >
                          {project.is_published ? "Published" : "Draft"}
                        </span>
                      </div>

                      {/* Video indicator */}
                      {(project.video_url || project.youtube_url || project.vimeo_url) && (
                        <div className="absolute bottom-3 right-3 p-1.5 rounded-full bg-black/70 border border-cinematic-gold/40 text-cinematic-gold">
                          <Video className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-cinematic-textDim">
                        <span>{project.year}</span>
                        {project.client && <span className="truncate max-w-[150px]">Client: {project.client}</span>}
                      </div>

                      <h3 className="text-sm font-cinematic font-bold text-white line-clamp-1">
                        {project.title}
                      </h3>

                      <p className="text-xs text-cinematic-textDim font-mono truncate">
                        /work/{project.slug}
                      </p>

                      <p className="text-xs text-cinematic-textMuted line-clamp-2 leading-relaxed">
                        {project.short_description}
                      </p>

                      {project.gallery_images && project.gallery_images.length > 0 && (
                        <div className="text-[11px] text-cinematic-gold pt-1">
                          + {project.gallery_images.length} gallery images
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-3.5 bg-black/40 border-t border-cinematic-border/60 flex items-center justify-between">
                    {/* Ordering buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveOrder(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 text-cinematic-textMuted hover:text-cinematic-gold disabled:opacity-20 transition-colors"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveOrder(index, "down")}
                        disabled={index === projects.length - 1}
                        className="p-1.5 text-cinematic-textMuted hover:text-cinematic-gold disabled:opacity-20 transition-colors"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className={`p-1.5 rounded transition-colors ${
                          project.is_featured
                            ? "text-cinematic-gold bg-cinematic-gold/10"
                            : "text-cinematic-textDim hover:text-white"
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleTogglePublish(project)}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                          project.is_published
                            ? "text-amber-400 hover:bg-amber-500/10"
                            : "text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                      >
                        {project.is_published ? "Unpublish" : "Publish"}
                      </button>

                      <Link
                        href={`/work/${project.slug}`}
                        target="_blank"
                        className="p-1.5 text-cinematic-textMuted hover:text-white hover:bg-white/5 rounded transition-colors"
                        title="Preview Public Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => openEditModal(project)}
                        className="p-1.5 text-cinematic-textMuted hover:text-cinematic-gold hover:bg-white/5 rounded transition-colors"
                        title="Edit Project"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setProjectToDelete(project)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add / Edit Project Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
              <div className="bg-cinematic-surface border border-cinematic-border w-full max-w-3xl p-6 sm:p-8 rounded-sm shadow-2xl relative my-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-5 right-5 text-white/50 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-base font-cinematic font-bold text-white mb-6 pb-3 border-b border-cinematic-border">
                  {editingProject ? `Edit Film: ${editingProject.title}` : "Add New Cinematic Film"}
                </h3>

                <form onSubmit={handleSave} className="space-y-6">
                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="e.g. Elysian Vows — Florence & Michael"
                        className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="Leave blank to auto-generate"
                        className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold font-mono"
                      />
                    </div>
                  </div>

                  {/* Category, Year, Client */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                        Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                      >
                        <option value="Commercial">Commercial</option>
                        <option value="Concert Video">Concert Video</option>
                        <option value="Podcast">Podcast</option>
                        <option value="Photography">Photography</option>
                        <option value="Fine Art">Fine Art & Sculptures</option>
                        <option value="Wedding">Wedding</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                        Production Year
                      </label>
                      <input
                        type="text"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="2025"
                        className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                        Client / Brand Name
                      </label>
                      <input
                        type="text"
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                        placeholder="e.g. Porsche or Florence Sterling"
                        className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                      />
                    </div>
                  </div>

                  {/* Short & Full Descriptions */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                        Short Summary (Card Preview)
                      </label>
                      <input
                        type="text"
                        value={shortDesc}
                        onChange={(e) => setShortDesc(e.target.value)}
                        placeholder="One evocative sentence about the cinematic shoot..."
                        className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                        Full Story & Technical Narrative (Project Page)
                      </label>
                      <textarea
                        rows={4}
                        value={fullDesc}
                        onChange={(e) => setFullDesc(e.target.value)}
                        placeholder="Detailed narrative about the camera packages used, lighting setups, location storytelling..."
                        className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Thumbnail Image */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      Main Thumbnail Image (4K / 1080p Poster) *
                    </label>
                    <input
                      type="text"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      required
                      placeholder="/works/hero/hero-1.jpg"
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-cinematic-gold mb-2 font-mono"
                    />
                    <MediaUploader
                      label="Upload or Replace Thumbnail"
                      fileType="image"
                      accept="image/*"
                      currentValue={thumbnailUrl}
                      onUploadSuccess={(url) => setThumbnailUrl(url)}
                    />
                  </div>

                  {/* Gallery Images */}
                  <div className="space-y-3 p-4 bg-black/40 border border-cinematic-border rounded-sm">
                    <label className="text-xs uppercase tracking-wider text-cinematic-gold font-semibold block">
                      Additional Gallery Stills
                    </label>

                    {/* Gallery Thumbnails List */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {galleryImages.map((img, i) => (
                        <div key={i} className="relative aspect-video rounded-sm overflow-hidden border border-cinematic-border group/gal">
                          <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(i)}
                            className="absolute top-1 right-1 bg-red-600/90 text-white p-1 rounded hover:bg-red-500 opacity-0 group-hover/gal:opacity-100 transition-opacity"
                            title="Remove Still"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Image to Gallery */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={newGalleryInput}
                        onChange={(e) => setNewGalleryInput(e.target.value)}
                        placeholder="Add image URL or use uploader below..."
                        className="flex-1 bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-cinematic-gold font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => addGalleryImage(newGalleryInput)}
                        className="px-3 py-2 bg-cinematic-surface border border-cinematic-border hover:border-cinematic-gold text-xs text-white rounded-sm"
                      >
                        Add URL
                      </button>
                    </div>

                    <MediaUploader
                      label="Upload New Gallery Still"
                      fileType="image"
                      accept="image/*"
                      onUploadSuccess={(url) => addGalleryImage(url)}
                    />
                  </div>

                  {/* Video Links & Uploads */}
                  <div className="space-y-4 p-4 bg-black/40 border border-cinematic-border rounded-sm">
                    <label className="text-xs uppercase tracking-wider text-cinematic-gold font-semibold block">
                      Video Playback Configuration (Uploaded MP4 / YouTube / Vimeo)
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-cinematic-textMuted block mb-1">
                          YouTube Video URL
                        </label>
                        <input
                          type="text"
                          value={youtubeUrl}
                          onChange={(e) => setYoutubeUrl(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-cinematic-gold"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-cinematic-textMuted block mb-1">
                          Vimeo Video URL
                        </label>
                        <input
                          type="text"
                          value={vimeoUrl}
                          onChange={(e) => setVimeoUrl(e.target.value)}
                          placeholder="https://vimeo.com/..."
                          className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-cinematic-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-cinematic-textMuted block mb-1">
                        Direct Video File URL (MP4 / WebM)
                      </label>
                      <input
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://.../video.mp4"
                        className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-cinematic-gold mb-2 font-mono"
                      />
                      <MediaUploader
                        label="Upload or Replace Project MP4 Video"
                        fileType="video"
                        accept="video/mp4,video/webm"
                        currentValue={videoUrl}
                        onUploadSuccess={(url) => setVideoUrl(url)}
                      />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="w-4 h-4 rounded border-cinematic-border bg-black text-cinematic-gold accent-[#C9A35E]"
                      />
                      <span className="text-xs text-white font-medium">
                        Publish live to website
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 rounded border-cinematic-border bg-black text-cinematic-gold accent-[#C9A35E]"
                      />
                      <span className="text-xs text-white font-medium">
                        Feature in homepage showcase
                      </span>
                    </label>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-cinematic-border">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-xs text-cinematic-textMuted hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="btn-gold text-xs py-2 px-5 flex items-center gap-2"
                    >
                      {formLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                          <span>Saving Project...</span>
                        </>
                      ) : (
                        <span>{editingProject ? "Update Project" : "Publish Project"}</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <ConfirmModal
            isOpen={Boolean(projectToDelete)}
            title="Delete Film Project"
            message={`Are you sure you want to delete "${projectToDelete?.title}"? All associated gallery references will be removed.`}
            confirmText="Delete Project"
            isLoading={deleteLoading}
            onConfirm={handleDelete}
            onCancel={() => setProjectToDelete(null)}
          />
        </main>
      </div>
    </div>
  );
}
