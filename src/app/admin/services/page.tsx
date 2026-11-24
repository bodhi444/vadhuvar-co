"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import MediaUploader from "@/components/admin/MediaUploader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/Toast";
import { Service } from "@/types";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Check,
  X,
  Sparkles,
  ArrowUpDown,
  MoveUp,
  MoveDown,
} from "lucide-react";

export default function ManageServicesPage() {
  const { success, error: toastError } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Delete modal state
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [icon, setIcon] = useState("Film");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      } else {
        toastError("Failed to fetch services");
      }
    } catch {
      toastError("Network error loading services");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingService(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setFullDescription("");
    setImageUrl("/works/weddings/wedding-1.jpg");
    setIcon("Film");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService(s);
    setTitle(s.title);
    setSlug(s.slug);
    setDescription(s.description);
    setFullDescription(s.full_description || s.description);
    setImageUrl(s.image_url);
    setIcon(s.icon || "Film");
    setIsActive(s.is_active);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !imageUrl) {
      toastError("Title, description, and image URL are required.");
      return;
    }

    setFormLoading(true);
    try {
      if (editingService) {
        // Update
        const res = await fetch("/api/admin/services", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingService.id,
            title,
            slug,
            description,
            full_description: fullDescription,
            image_url: imageUrl,
            icon,
            is_active: isActive,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          success("Service updated successfully!");
          setIsModalOpen(false);
          fetchServices();
        } else {
          toastError(data.error || "Failed to update service");
        }
      } else {
        // Create
        const res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            slug,
            description,
            full_description: fullDescription,
            image_url: imageUrl,
            icon,
            is_active: isActive,
            display_order: services.length + 1,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          success("New service created successfully!");
          setIsModalOpen(false);
          fetchServices();
        } else {
          toastError(data.error || "Failed to create service");
        }
      }
    } catch {
      toastError("Error saving service");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/services?id=${serviceToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success(`Service "${serviceToDelete.title}" removed successfully.`);
        setServiceToDelete(null);
        fetchServices();
      } else {
        toastError(data.error || "Failed to delete service");
      }
    } catch {
      toastError("Network error while deleting service");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleActive = async (s: Service) => {
    try {
      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id, is_active: !s.is_active }),
      });
      if (res.ok) {
        success(`Service ${!s.is_active ? "activated" : "deactivated"}.`);
        fetchServices();
      }
    } catch {
      toastError("Failed to update status");
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === services.length - 1)
    ) {
      return;
    }

    const newOrder = [...services];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;

    setServices(newOrder);

    try {
      const orderedIds = newOrder.map((s) => s.id);
      await fetch("/api/admin/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      success("Services reordered successfully.");
    } catch {
      toastError("Failed to save new order");
    }
  };

  return (
    <div className="flex min-h-screen bg-cinematic-bg text-white">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Manage Services"
          subtitle="Configure film studio offerings, visual cards, descriptions, and display priority"
        />

        <main className="p-4 sm:p-8 max-w-7xl 2xl:max-w-[1600px] w-full space-y-8 flex-1 overflow-y-auto">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cinematic-surface border border-cinematic-border p-4 rounded-sm">
            <div>
              <h2 className="text-sm font-semibold text-white">Studio Service Catalog</h2>
              <p className="text-xs text-cinematic-textDim">
                Published services appear on the public homepage and services directory.
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="btn-gold text-xs py-2 px-4 flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Add Service</span>
            </button>
          </div>

          {/* Service Cards / List */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-cinematic-textMuted">
              <Loader2 className="w-8 h-8 text-cinematic-gold animate-spin mb-3" />
              <p className="text-sm">Loading services...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className={`bg-cinematic-surface border rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                    service.is_active
                      ? "border-cinematic-border hover:border-cinematic-gold/40"
                      : "border-cinematic-border/40 opacity-70"
                  }`}
                >
                  <div>
                    {/* Image Preview */}
                    <div className="relative w-full h-48 bg-black">
                      {service.image_url ? (
                        <Image
                          src={service.image_url}
                          alt={service.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-cinematic-textDim text-xs">
                          No image set
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 border border-cinematic-border text-cinematic-gold">
                          #{index + 1}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase ${
                            service.is_active
                              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                              : "bg-red-950/80 text-red-400 border border-red-800/60"
                          }`}
                        >
                          {service.is_active ? "Active" : "Disabled"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2">
                      <h3 className="text-base font-cinematic font-bold text-white">
                        {service.title}
                      </h3>
                      <p className="text-xs text-cinematic-textDim font-mono">
                        Slug: /{service.slug}
                      </p>
                      <p className="text-xs text-cinematic-textMuted leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 bg-black/40 border-t border-cinematic-border/60 flex items-center justify-between">
                    {/* Reordering */}
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
                        disabled={index === services.length - 1}
                        className="p-1.5 text-cinematic-textMuted hover:text-cinematic-gold disabled:opacity-20 transition-colors"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Toggle Active / Edit / Delete */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(service)}
                        className={`px-2.5 py-1 rounded text-xs transition-colors ${
                          service.is_active
                            ? "text-red-400 hover:bg-red-500/10"
                            : "text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                      >
                        {service.is_active ? "Disable" : "Enable"}
                      </button>

                      <button
                        onClick={() => openEditModal(service)}
                        className="p-1.5 text-cinematic-textMuted hover:text-cinematic-gold hover:bg-white/5 rounded transition-colors"
                        title="Edit Service"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setServiceToDelete(service)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create / Edit Service Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
              <div className="bg-cinematic-surface border border-cinematic-border w-full max-w-xl p-6 rounded-sm shadow-2xl relative my-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-white/50 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-base font-cinematic font-bold text-white mb-4">
                  {editingService ? `Edit Service: ${editingService.title}` : "Add New Cinematic Service"}
                </h3>

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      Service Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="e.g. Wedding Films"
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
                      placeholder="e.g. wedding-films"
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      Short Description (Card Summary)
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      placeholder="A short punchy cinematic summary..."
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-cinematic-gold"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      Full Description (Service Detail Page)
                    </label>
                    <textarea
                      rows={4}
                      value={fullDescription}
                      onChange={(e) => setFullDescription(e.target.value)}
                      placeholder="Comprehensive overview of camera packages, turnaround, and philosophy..."
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-cinematic-gold"
                    />
                  </div>

                  {/* Image Uploader */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      Cover Image
                    </label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      required
                      placeholder="/works/weddings/wedding-1.jpg"
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-cinematic-gold mb-2 font-mono"
                    />
                    <MediaUploader
                      label="Upload or Replace Service Card Image"
                      fileType="image"
                      accept="image/*"
                      currentValue={imageUrl}
                      onUploadSuccess={(url) => setImageUrl(url)}
                    />
                  </div>

                  {/* Active Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded border-cinematic-border bg-black text-cinematic-gold accent-[#C9A35E]"
                    />
                    <span className="text-xs text-white">Active and visible to public</span>
                  </label>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-cinematic-border">
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
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>{editingService ? "Update Service" : "Create Service"}</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <ConfirmModal
            isOpen={Boolean(serviceToDelete)}
            title="Delete Service"
            message={`Are you sure you want to remove "${serviceToDelete?.title}"? This will remove it from the public website.`}
            confirmText="Delete Service"
            isLoading={deleteLoading}
            onConfirm={handleDelete}
            onCancel={() => setServiceToDelete(null)}
          />
        </main>
      </div>
    </div>
  );
}
