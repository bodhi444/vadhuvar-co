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
  FileText,
  Tag,
} from "lucide-react";

const DEFAULT_CATEGORIES: string[] = [
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
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");

  // Dynamic Categories state
  const [categoriesList, setCategoriesList] = useState<string[]>(DEFAULT_CATEGORIES);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategoryLoading, setAddingCategoryLoading] = useState(false);

  // In modal: custom category input toggle
  const [isCustomCategoryInput, setIsCustomCategoryInput] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Delete modal state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Quick Edit Title & Description Modal State
  const [quickEditProject, setQuickEditProject] = useState<Project | null>(null);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickCategory, setQuickCategory] = useState<string>("");
  const [quickShortDesc, setQuickShortDesc] = useState("");
  const [quickFullDesc, setQuickFullDesc] = useState("");
  const [quickLoading, setQuickLoading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<string>("Commercial");
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
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data && Array.isArray(data.categories)) {
          setCategoriesList((prev) => {
            const merged = [...DEFAULT_CATEGORIES];
            data.categories.forEach((cat: string) => {
              if (cat && !merged.includes(cat) && cat !== "Wedding") {
                merged.splice(merged.length - 1, 0, cat);
              }
            });
            return merged;
          });
        }
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    if (projects.length > 0) {
      setCategoriesList((prev) => {
        const merged = [...prev];
        projects.forEach((p) => {
          if (p.category && !merged.includes(p.category) && p.category !== "Wedding") {
            const wIdx = merged.indexOf("Wedding");
            if (wIdx !== -1) merged.splice(wIdx, 0, p.category);
            else merged.push(p.category);
          }
        });
        return merged;
      });
    }
  }, [projects]);

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

  const handleAddNewCategory = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      toastError("Please enter a category name");
      return;
    }
    if (categoriesList.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      toastError(`Category "${trimmed}" already exists.`);
      return;
    }

    setAddingCategoryLoading(true);
    try {
      const updated = [...categoriesList];
      const wIdx = updated.indexOf("Wedding");
      if (wIdx !== -1) {
        updated.splice(wIdx, 0, trimmed);
      } else {
        updated.push(trimmed);
      }
      setCategoriesList(updated);
      setSelectedCategoryFilter(trimmed);
      setNewCategoryName("");
      setIsAddCategoryOpen(false);

      // Persist to site settings
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: updated }),
      });

      success(`Category "${trimmed}" added successfully!`);
    } catch {
      toastError("Network error saving category");
    } finally {
      setAddingCategoryLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setTitle("");
    setSlug("");
    setCategory(categoriesList[0] || "Commercial");
    setIsCustomCategoryInput(false);
    setCustomCategoryName("");
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
    setIsCustomCategoryInput(false);
    setCustomCategoryName("");
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

  const openQuickEdit = (p: Project) => {
    setQuickEditProject(p);
    setQuickTitle(p.title || "");
    setQuickCategory(p.category || "Commercial");
    setQuickShortDesc(p.short_description || "");
    setQuickFullDesc(p.full_description || p.short_description || "");
  };

  const handleSaveQuickEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEditProject) return;
    if (!quickTitle.trim()) {
      toastError("Project title cannot be empty.");
      return;
    }

    setQuickLoading(true);
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: quickEditProject.id,
          title: quickTitle.trim(),
          category: quickCategory || quickEditProject.category,
          short_description: quickShortDesc.trim(),
          full_description: quickFullDesc.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && (data.success || data.data)) {
        success(`Updated title & details for "${quickTitle.trim()}"!`);
        setProjects((prev) =>
          prev.map((proj) =>
            proj.id === quickEditProject.id
              ? {
                  ...proj,
                  title: quickTitle.trim(),
                  category: quickCategory || quickEditProject.category,
                  short_description: quickShortDesc.trim(),
                  full_description: quickFullDesc.trim(),
                }
              : proj
          )
        );
        setQuickEditProject(null);
      } else {
        toastError(data.error || "Failed to update title and description");
      }
    } catch {
      toastError("Network error saving title and description");
    } finally {
      setQuickLoading(false);
    }
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
      : projects.filter(
          (p) => p.category?.toLowerCase() === selectedCategoryFilter.toLowerCase()
        );

  return (
    <div className="flex min-h-screen bg-cinematic-bg text-white">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Manage Portfolio"
          subtitle="Add films, upload high-fidelity 4K thumbnails & galleries, configure video embeds, and organize order"
        />

        <main className="p-4 sm:p-8 max-w-7xl 2xl:max-w-[1600px] w-full space-y-8 flex-1 overflow-y-auto">
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
            {["All", ...categoriesList].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-medium transition-all ${
                  selectedCategoryFilter === cat
                    ? "bg-cinematic-gold text-black font-semibold shadow-md shadow-cinematic-gold/20"
                    : "text-cinematic-textMuted hover:text-white bg-black/40 border border-cinematic-border hover:border-cinematic-gold/40"
                }`}
              >
                {cat}
              </button>
            ))}

            {/* Inline Add Category Trigger */}
            {isAddCategoryOpen ? (
              <div className="flex items-center gap-1.5 p-1 bg-black/90 border border-cinematic-gold/60 rounded-sm animate-fade-in">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New Category..."
                  className="bg-transparent text-white text-xs px-2 py-1 focus:outline-none w-32 sm:w-44 font-medium"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddNewCategory(newCategoryName);
                    } else if (e.key === "Escape") {
                      setIsAddCategoryOpen(false);
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={addingCategoryLoading}
                  onClick={() => handleAddNewCategory(newCategoryName)}
                  className="px-2.5 py-1 bg-cinematic-gold text-black text-xs font-semibold rounded-sm hover:bg-cinematic-gold/90 transition-colors flex items-center gap-1"
                >
                  {addingCategoryLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin text-black" />
                  ) : (
                    <span>Add</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddCategoryOpen(false);
                    setNewCategoryName("");
                  }}
                  className="p-1 text-cinematic-textDim hover:text-white"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddCategoryOpen(true)}
                className="px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-semibold text-cinematic-gold hover:text-black hover:bg-cinematic-gold bg-cinematic-gold/10 border border-cinematic-gold/40 flex items-center gap-1.5 transition-all"
                title="Create New Project Category"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            )}
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
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] text-cinematic-textDim">
                        <span className="font-mono">{project.year}</span>
                        {project.client && <span className="truncate max-w-[150px]">Client: {project.client}</span>}
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-cinematic font-bold text-white line-clamp-1 flex-1">
                          {project.title}
                        </h3>
                        <button
                          type="button"
                          onClick={() => openQuickEdit(project)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium text-cinematic-gold bg-cinematic-gold/10 hover:bg-cinematic-gold/25 border border-cinematic-gold/30 transition-all flex-shrink-0"
                          title="Quick Edit Title & Description"
                        >
                          <Pencil className="w-2.5 h-2.5" />
                          <span>Edit Text</span>
                        </button>
                      </div>

                      <p className="text-xs text-cinematic-textDim font-mono truncate">
                        /work/{project.slug}
                      </p>

                      <p className="text-xs text-cinematic-textMuted line-clamp-2 leading-relaxed">
                        {project.short_description || <span className="italic text-white/30">No short description set</span>}
                      </p>

                      {project.gallery_images && project.gallery_images.length > 0 && (
                        <div className="text-[11px] text-cinematic-gold pt-1">
                          + {project.gallery_images.length} gallery images
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-3.5 bg-black/40 border-t border-cinematic-border/60 flex items-center justify-between gap-2 flex-wrap">
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
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      <button
                        type="button"
                        onClick={() => openQuickEdit(project)}
                        className="px-2 py-1 rounded text-[11px] font-medium text-cinematic-gold hover:text-black hover:bg-cinematic-gold bg-cinematic-gold/10 border border-cinematic-gold/30 flex items-center gap-1 transition-all"
                        title="Edit Title & Description"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Title & Desc</span>
                      </button>

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
                        title="Edit Full Project"
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

          {/* Quick Edit Title & Description Modal — Dynamically Responsive */}
          {quickEditProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-fade-in overflow-hidden">
              <div className="bg-[#0C0E12] border border-cinematic-gold/40 w-full max-w-full sm:max-w-lg md:max-w-xl 2xl:max-w-2xl max-h-[100dvh] sm:max-h-[90vh] rounded-sm shadow-2xl flex flex-col overflow-hidden relative">
                
                {/* Sticky Header */}
                <div className="p-4 sm:p-5 border-b border-cinematic-border/80 bg-[#11131A]/95 backdrop-blur-md flex items-center justify-between shrink-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-cinematic-gold animate-pulse shrink-0" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-cinematic-gold font-bold">
                        Quick Edit Mode
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 border border-cinematic-border text-cinematic-textMuted font-mono">
                        {quickCategory || quickEditProject.category}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-cinematic font-bold text-white truncate max-w-[260px] sm:max-w-md">
                      Edit Film Details
                    </h3>
                  </div>
                  <button
                    onClick={() => setQuickEditProject(null)}
                    className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-sm transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    type="button"
                    title="Close Dialog"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Form Body */}
                <form id="quick-edit-form" onSubmit={handleSaveQuickEdit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
                  {/* Title */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-gold font-semibold block mb-1.5 flex items-center justify-between">
                      <span>Project / Video Title *</span>
                      <span className="text-[10px] text-cinematic-textDim font-normal font-mono">
                        {quickTitle.length} chars
                      </span>
                    </label>
                    <input
                      type="text"
                      value={quickTitle}
                      onChange={(e) => setQuickTitle(e.target.value)}
                      required
                      placeholder="e.g. Elysian Vows — Florence & Michael"
                      className="w-full bg-black/70 border border-cinematic-border text-white text-sm px-3.5 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold transition-colors font-medium"
                    />
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-gold font-semibold block mb-1.5">
                      Category *
                    </label>
                    <select
                      value={quickCategory}
                      onChange={(e) => setQuickCategory(e.target.value)}
                      className="w-full bg-black/70 border border-cinematic-border text-white text-xs px-3.5 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold transition-colors"
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-gold font-semibold block mb-1.5 flex items-center justify-between">
                      <span>Short Summary / Description (Card & Gallery Preview)</span>
                      <span className="text-[10px] text-cinematic-textDim font-normal font-mono">
                        {quickShortDesc.length} chars
                      </span>
                    </label>
                    <input
                      type="text"
                      value={quickShortDesc}
                      onChange={(e) => setQuickShortDesc(e.target.value)}
                      placeholder="One or two evocative sentences describing the shoot..."
                      className="w-full bg-black/70 border border-cinematic-border text-white text-xs px-3.5 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold transition-colors"
                    />
                    <p className="text-[10px] text-cinematic-textDim mt-1">
                      Displayed on homepage selected works grid and card previews.
                    </p>
                  </div>

                  {/* Full Description */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-gold font-semibold block mb-1.5 flex items-center justify-between">
                      <span>Full Storyline & Technical Narrative (Project Page)</span>
                      <span className="text-[10px] text-cinematic-textDim font-normal font-mono">
                        {quickFullDesc.length} chars
                      </span>
                    </label>
                    <textarea
                      rows={5}
                      value={quickFullDesc}
                      onChange={(e) => setQuickFullDesc(e.target.value)}
                      placeholder="Detailed narrative about the film, camera packages, lighting setups, location storytelling, or director notes..."
                      className="w-full bg-black/70 border border-cinematic-border text-white text-xs px-3.5 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold leading-relaxed transition-colors min-h-[100px]"
                    />
                    <p className="text-[10px] text-cinematic-textDim mt-1">
                      Displayed on the dedicated project page (/work/{quickEditProject.slug}).
                    </p>
                  </div>
                </form>

                {/* Sticky Footer */}
                <div className="p-3.5 sm:p-4 border-t border-cinematic-border/80 bg-[#11131A]/95 backdrop-blur-md flex items-center justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuickEditProject(null)}
                    className="px-4 py-2.5 text-xs text-cinematic-textMuted hover:text-white rounded-sm min-h-[44px] flex items-center"
                  >
                    Cancel
                  </button>
                  <button
                    form="quick-edit-form"
                    type="submit"
                    disabled={quickLoading}
                    className="btn-gold text-xs py-2.5 px-5 flex items-center gap-2 min-h-[44px]"
                  >
                    {quickLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <span>Save Title & Details</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add / Edit Project Modal — Dynamically Responsive across all Screen Resolutions */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-fade-in overflow-hidden">
              <div className="bg-[#0C0E12] border border-cinematic-border/80 w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl h-full sm:h-auto max-h-[100dvh] sm:max-h-[92vh] rounded-sm shadow-2xl flex flex-col overflow-hidden relative">
                
                {/* 1. STICKY DYNAMIC HEADER */}
                <div className="p-4 sm:p-5 border-b border-cinematic-border/80 bg-[#11131A]/95 backdrop-blur-md flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded bg-cinematic-gold/10 text-cinematic-gold border border-cinematic-gold/20 shrink-0">
                      <Film className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-cinematic-gold font-semibold">
                          {editingProject ? "Editing Film Project" : "New Production Setup"}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 border border-cinematic-border text-cinematic-textMuted font-mono">
                          {category}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-cinematic font-bold text-white truncate max-w-[240px] sm:max-w-md lg:max-w-xl">
                        {editingProject ? editingProject.title : "Add New Cinematic Film"}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-sm transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Close Dialog"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 2. SCROLLABLE FORM BODY WITH RESPONSIVE GRIDS */}
                <form id="project-form" onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 custom-scrollbar">
                  
                  {/* SECTION 1: CORE INFORMATION & CATEGORY */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-cinematic-border/60 pb-2">
                      <span className="text-xs uppercase tracking-wider text-cinematic-gold font-semibold flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Core Identity & Production Details</span>
                      </span>
                      <span className="text-[10px] text-cinematic-textDim font-mono">Required *</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      {/* Title (spans 8 on lg+) */}
                      <div className="lg:col-span-8">
                        <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          placeholder="e.g. Elysian Vows — Florence & Michael"
                          className="w-full bg-black/60 border border-cinematic-border text-white text-sm px-3.5 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold transition-colors font-medium"
                        />
                      </div>

                      {/* Slug (spans 4 on lg+) */}
                      <div className="lg:col-span-4">
                        <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                          URL Slug
                        </label>
                        <input
                          type="text"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder="Leave blank to auto-generate"
                          className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3.5 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold font-mono transition-colors"
                        />
                      </div>
                    </div>

                    {/* Category, Year, Client (Responsive 3-col on sm+, 1-col on mobile) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Category Selection with Custom Category Adder */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs uppercase tracking-wider text-cinematic-textMuted font-medium">
                            Category *
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsCustomCategoryInput(!isCustomCategoryInput)}
                            className="text-[10px] text-cinematic-gold hover:underline font-mono"
                          >
                            {isCustomCategoryInput ? "Choose Existing" : "+ New"}
                          </button>
                        </div>

                        {isCustomCategoryInput ? (
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={customCategoryName}
                              onChange={(e) => setCustomCategoryName(e.target.value)}
                              placeholder="New Category..."
                              className="flex-1 bg-black/70 border border-cinematic-gold/60 text-white text-xs px-2.5 py-2 rounded-sm focus:outline-none focus:border-cinematic-gold"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newCat = customCategoryName.trim();
                                if (!newCat) return;
                                if (!categoriesList.includes(newCat)) {
                                  const updated = [...categoriesList];
                                  const wIdx = updated.indexOf("Wedding");
                                  if (wIdx !== -1) updated.splice(wIdx, 0, newCat);
                                  else updated.push(newCat);
                                  setCategoriesList(updated);
                                }
                                setCategory(newCat);
                                setIsCustomCategoryInput(false);
                                setCustomCategoryName("");
                                success(`Category "${newCat}" applied!`);
                              }}
                              className="px-2.5 py-2 bg-cinematic-gold text-black text-xs font-semibold rounded-sm hover:bg-cinematic-gold/90 transition-colors"
                            >
                              Set
                            </button>
                          </div>
                        ) : (
                          <select
                            value={category}
                            onChange={(e) => {
                              if (e.target.value === "__NEW__") {
                                setIsCustomCategoryInput(true);
                              } else {
                                setCategory(e.target.value);
                              }
                            }}
                            className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold transition-colors"
                          >
                            {categoriesList.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                            <option value="__NEW__">+ Add Custom Category...</option>
                          </select>
                        )}
                      </div>

                      {/* Year */}
                      <div>
                        <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                          Production Year
                        </label>
                        <input
                          type="text"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          placeholder="2025"
                          className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold font-mono transition-colors"
                        />
                      </div>

                      {/* Client */}
                      <div>
                        <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                          Client / Brand Name
                        </label>
                        <input
                          type="text"
                          value={client}
                          onChange={(e) => setClient(e.target.value)}
                          placeholder="e.g. Porsche or Century"
                          className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: DESCRIPTIONS & CREATIVE VISION */}
                  <div className="space-y-4 p-4 sm:p-5 bg-black/40 border border-cinematic-border/80 rounded-sm">
                    <div className="flex items-center justify-between border-b border-cinematic-border/60 pb-2">
                      <span className="text-xs uppercase tracking-wider text-cinematic-gold font-semibold flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Project Story & Descriptions</span>
                      </span>
                      <span className="text-[10px] text-cinematic-textDim font-mono">
                        Short Preview & Full Narrative
                      </span>
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                        Short Summary / Description (Card & Gallery Preview)
                      </label>
                      <input
                        type="text"
                        value={shortDesc}
                        onChange={(e) => setShortDesc(e.target.value)}
                        placeholder="One evocative sentence about the cinematic shoot..."
                        className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3.5 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold transition-colors"
                      />
                      <p className="text-[10px] text-cinematic-textDim mt-1">
                        Shown on homepage highlight cards and gallery preview cards.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                        Full Story & Technical Narrative (Dedicated Project Page)
                      </label>
                      <textarea
                        rows={4}
                        value={fullDesc}
                        onChange={(e) => setFullDesc(e.target.value)}
                        placeholder="Detailed narrative about camera packages, lighting setups, location storytelling, lens optics, and director notes..."
                        className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3.5 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold leading-relaxed transition-colors min-h-[90px] 2xl:min-h-[140px]"
                      />
                      <p className="text-[10px] text-cinematic-textDim mt-1">
                        Shown on the film's dedicated story page (/work/[slug]).
                      </p>
                    </div>
                  </div>

                  {/* SECTION 3: PRIMARY POSTER / THUMBNAIL */}
                  <div className="space-y-3 p-4 sm:p-5 bg-black/40 border border-cinematic-border/80 rounded-sm">
                    <div className="flex items-center justify-between border-b border-cinematic-border/60 pb-2">
                      <span className="text-xs uppercase tracking-wider text-cinematic-gold font-semibold">
                        Primary 4K / 1080p Poster Thumbnail *
                      </span>
                      <span className="text-[10px] text-cinematic-textDim font-mono">Cover Artwork</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-8 space-y-2">
                        <input
                          type="text"
                          value={thumbnailUrl}
                          onChange={(e) => setThumbnailUrl(e.target.value)}
                          required
                          placeholder="/works/hero/hero-1.jpg"
                          className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-cinematic-gold font-mono"
                        />
                        <MediaUploader
                          label="Upload or Replace Thumbnail"
                          fileType="image"
                          accept="image/*"
                          currentValue={thumbnailUrl}
                          onUploadSuccess={(url) => setThumbnailUrl(url)}
                        />
                      </div>

                      {/* Live Thumbnail Preview */}
                      <div className="md:col-span-4 flex justify-center">
                        <div className="relative w-full aspect-video max-w-[220px] rounded-sm overflow-hidden border border-cinematic-border bg-black shadow-md">
                          {thumbnailUrl ? (
                            <Image src={thumbnailUrl} alt="Thumbnail preview" fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-white/30">
                              Preview Frame
                            </div>
                          )}
                          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-mono bg-black/80 text-cinematic-gold border border-cinematic-border">
                            POSTER
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: STILL FRAMES GALLERY */}
                  <div className="space-y-3 p-4 sm:p-5 bg-black/40 border border-cinematic-border/80 rounded-sm">
                    <div className="flex items-center justify-between border-b border-cinematic-border/60 pb-2">
                      <span className="text-xs uppercase tracking-wider text-cinematic-gold font-semibold">
                        High-Fidelity Still Frames Gallery
                      </span>
                      <span className="text-[10px] text-cinematic-textDim font-mono">
                        {galleryImages.length} still frames added
                      </span>
                    </div>

                    {/* Responsive Stills Grid */}
                    {galleryImages.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3">
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
                    )}

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
                        className="px-3.5 py-2 bg-cinematic-surface border border-cinematic-border hover:border-cinematic-gold text-xs text-white rounded-sm transition-colors"
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

                  {/* SECTION 5: VIDEO PLAYBACK STREAMS */}
                  <div className="space-y-4 p-4 sm:p-5 bg-black/40 border border-cinematic-border/80 rounded-sm">
                    <div className="flex items-center justify-between border-b border-cinematic-border/60 pb-2">
                      <span className="text-xs uppercase tracking-wider text-cinematic-gold font-semibold">
                        Video Playback Streams (Uploaded MP4 / YouTube / Vimeo)
                      </span>
                      <span className="text-[10px] text-cinematic-textDim font-mono">Stream Integration</span>
                    </div>

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

                  {/* SECTION 6: PUBLISHING FLAGS */}
                  <div className="flex flex-wrap items-center gap-6 p-3 bg-black/30 border border-cinematic-border/60 rounded-sm">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
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

                    <label className="flex items-center gap-2 cursor-pointer select-none">
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
                </form>

                {/* 3. STICKY DYNAMIC FOOTER */}
                <div className="p-3.5 sm:p-4 border-t border-cinematic-border/80 bg-[#11131A]/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
                  <div className="text-[11px] text-cinematic-textDim font-mono truncate hidden sm:block max-w-[240px] md:max-w-md">
                    Permalink: <span className="text-white/60">/work/{slug || "project-slug"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 text-xs text-cinematic-textMuted hover:text-white rounded-sm min-h-[44px] flex items-center"
                    >
                      Cancel
                    </button>
                    <button
                      form="project-form"
                      type="submit"
                      disabled={formLoading}
                      className="btn-gold text-xs py-2.5 px-6 flex items-center gap-2 min-h-[44px]"
                    >
                      {formLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                          <span>Saving Project...</span>
                        </>
                      ) : (
                        <span>{editingProject ? "Update Film" : "Publish Film Project"}</span>
                      )}
                    </button>
                  </div>
                </div>

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
