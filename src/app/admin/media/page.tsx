"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import MediaUploader from "@/components/admin/MediaUploader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/Toast";
import { MediaAsset } from "@/types";
import {
  UploadCloud,
  Search,
  Filter,
  Copy,
  Trash2,
  ExternalLink,
  Film,
  Image as ImageIcon,
  Loader2,
  Check,
  Calendar,
  HardDrive,
  FileText,
} from "lucide-react";

export default function MediaLibraryPage() {
  const { success, error: toastError } = useToast();
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Asset deletion modal
  const [assetToDelete, setAssetToDelete] = useState<MediaAsset | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Asset detail modal / preview
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      } else {
        toastError("Failed to fetch media assets");
      }
    } catch {
      toastError("Network error loading media library");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    success("Asset URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async () => {
    if (!assetToDelete) return;
    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/admin/media?id=${assetToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success(`Asset "${assetToDelete.filename}" deleted.`);
        setAssetToDelete(null);
        if (selectedAsset?.id === assetToDelete.id) {
          setSelectedAsset(null);
        }
        fetchMedia();
      } else {
        toastError(data.error || "Failed to delete asset");
      }
    } catch {
      toastError("Network error while deleting media asset");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredAssets = media.filter((asset) => {
    const matchesSearch =
      asset.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.original_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "all" || asset.file_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex min-h-screen bg-cinematic-bg text-white">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Media Library"
          subtitle="Centralized repository for cinema stills, 8K project posters, and raw video clips"
        />

        <main className="p-8 max-w-7xl space-y-8 flex-1 overflow-y-auto">
          {/* Uploader Box */}
          <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm shadow-xl">
            <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-cinematic-gold" />
              Upload Assets to Studio Library
            </h3>
            <MediaUploader
              label="Drop images (JPG, PNG, WebP, SVG) or videos (MP4, WebM)"
              onUploadSuccess={(url, asset) => {
                success(`Asset "${asset.filename}" uploaded successfully!`);
                fetchMedia();
              }}
            />
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-cinematic-surface border border-cinematic-border p-4 rounded-sm">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-cinematic-textDim absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search file name or format..."
                className="w-full bg-black/60 border border-cinematic-border text-white text-xs pl-9 pr-3 py-2 rounded-sm focus:outline-none focus:border-cinematic-gold"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-cinematic-textDim flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" />
                Filter:
              </span>
              {(["all", "image", "video"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded text-xs uppercase tracking-wider font-medium transition-colors ${
                    filterType === type
                      ? "bg-cinematic-gold text-black font-semibold"
                      : "bg-black/40 text-cinematic-textMuted border border-cinematic-border hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Assets */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-cinematic-textMuted">
              <Loader2 className="w-8 h-8 text-cinematic-gold animate-spin mb-3" />
              <p className="text-sm">Loading media assets...</p>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="p-12 text-center bg-cinematic-surface border border-cinematic-border rounded-sm">
              <ImageIcon className="w-10 h-10 text-cinematic-gold mx-auto mb-3 opacity-60" />
              <h3 className="text-sm font-semibold text-white mb-1">No Assets Found</h3>
              <p className="text-xs text-cinematic-textDim">
                Try clearing your search query or upload a new media file above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group bg-cinematic-surface border border-cinematic-border rounded-sm overflow-hidden flex flex-col justify-between hover:border-cinematic-gold/50 transition-all shadow-md"
                >
                  {/* Thumbnail / Video */}
                  <div
                    onClick={() => setSelectedAsset(asset)}
                    className="relative aspect-video bg-black cursor-pointer overflow-hidden"
                  >
                    {asset.file_type === "video" ? (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-950">
                        <Film className="w-8 h-8 text-cinematic-gold opacity-80 group-hover:scale-110 transition-transform" />
                      </div>
                    ) : (
                      <Image
                        src={asset.url}
                        alt={asset.filename}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}

                    <div className="absolute top-2 left-2">
                      <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider bg-black/80 text-cinematic-gold border border-cinematic-border">
                        {asset.file_type}
                      </span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="p-3 space-y-1">
                    <p className="text-xs font-semibold text-white truncate" title={asset.original_name}>
                      {asset.original_name}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-cinematic-textDim">
                      <span>{formatFileSize(asset.file_size)}</span>
                      <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-2 bg-black/40 border-t border-cinematic-border/60 flex items-center justify-between">
                    <button
                      onClick={() => handleCopyUrl(asset)}
                      className="p-1 text-cinematic-textMuted hover:text-cinematic-gold transition-colors flex items-center gap-1 text-[11px]"
                      title="Copy URL"
                    >
                      {copiedId === asset.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-cinematic-textMuted hover:text-white transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => setAssetToDelete(asset)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Asset Preview Modal */}
          {selectedAsset && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
              <div className="bg-cinematic-surface border border-cinematic-border max-w-2xl w-full p-6 rounded-sm shadow-2xl relative">
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="absolute top-4 right-4 text-white/50 hover:text-white"
                >
                  ✕
                </button>

                <h3 className="text-sm font-cinematic font-bold text-white mb-4 truncate pr-8">
                  {selectedAsset.original_name}
                </h3>

                <div className="relative aspect-video bg-black rounded-sm overflow-hidden mb-4 border border-cinematic-border">
                  {selectedAsset.file_type === "video" ? (
                    <video src={selectedAsset.url} controls className="w-full h-full object-contain" />
                  ) : (
                    <Image src={selectedAsset.url} alt={selectedAsset.filename} fill className="object-contain" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-black/40 p-3 rounded-sm border border-cinematic-border mb-4">
                  <div>
                    <span className="text-cinematic-textDim block">Format / MIME:</span>
                    <span className="font-mono text-white">{selectedAsset.mime_type}</span>
                  </div>
                  <div>
                    <span className="text-cinematic-textDim block">File Size:</span>
                    <span className="font-mono text-white">{formatFileSize(selectedAsset.file_size)}</span>
                  </div>
                  <div>
                    <span className="text-cinematic-textDim block">Upload Date:</span>
                    <span className="text-white">{new Date(selectedAsset.created_at).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-cinematic-textDim block">Relative Path:</span>
                    <span className="font-mono text-cinematic-gold truncate block">{selectedAsset.url}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleCopyUrl(selectedAsset)}
                    className="btn-gold text-xs py-2 px-4 flex items-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5 text-black" />
                    <span>Copy Asset URL</span>
                  </button>

                  <button
                    onClick={() => {
                      setAssetToDelete(selectedAsset);
                      setSelectedAsset(null);
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Delete Asset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <ConfirmModal
            isOpen={Boolean(assetToDelete)}
            title="Delete Media Asset"
            message={`Are you sure you want to delete "${assetToDelete?.original_name}"? If this asset is used in portfolio projects or services, the image link will be broken.`}
            confirmText="Delete Asset"
            isLoading={deleteLoading}
            onConfirm={handleDelete}
            onCancel={() => setAssetToDelete(null)}
          />
        </main>
      </div>
    </div>
  );
}
