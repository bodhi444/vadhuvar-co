"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import MediaUploader from "@/components/admin/MediaUploader";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { useToast } from "@/components/admin/Toast";
import { Showreel } from "@/types";
import { Save, Loader2, PlaySquare } from "lucide-react";

export default function ManageShowreelPage() {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showreel, setShowreel] = useState<Showreel | null>(null);

  useEffect(() => {
    fetchShowreel();
  }, []);

  const fetchShowreel = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/showreel");
      if (res.ok) {
        const data = await res.json();
        setShowreel(data);
      } else {
        toastError("Failed to load showreel settings");
      }
    } catch {
      toastError("Network error loading showreel");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showreel) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/showreel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(showreel),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        success("Showreel updated successfully!");
        setShowreel(data.data);
      } else {
        toastError(data.error || "Failed to update showreel");
      }
    } catch {
      toastError("Network error saving showreel");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-cinematic-bg text-white">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Manage Showreel"
          subtitle="Configure the full-width studio flagship showreel, YouTube/Vimeo embeds, and custom poster artwork"
        />

        <main className="p-4 sm:p-8 max-w-7xl 2xl:max-w-[1600px] w-full space-y-8 flex-1 overflow-y-auto">
          {loading || !showreel ? (
            <div className="py-20 flex flex-col items-center justify-center text-cinematic-textMuted">
              <Loader2 className="w-8 h-8 text-cinematic-gold animate-spin mb-3" />
              <p className="text-sm">Loading showreel settings...</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-8">
              {/* Header Bar */}
              <div className="flex items-center justify-between bg-cinematic-surface border border-cinematic-border p-4 rounded-sm">
                <div>
                  <h2 className="text-sm font-semibold text-white">Showreel Controls</h2>
                  <p className="text-xs text-cinematic-textDim">
                    Changes reflect immediately in the public studio showreel section.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-gold text-xs py-2 px-5 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-black" />
                      <span>Save Showreel</span>
                    </>
                  )}
                </button>
              </div>

              {/* Live Preview */}
              <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm space-y-4">
                <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <PlaySquare className="w-4 h-4 text-cinematic-gold" />
                  Live Showreel Preview
                </h3>

                <VideoPlayer
                  title={showreel.title}
                  videoUrl={showreel.video_url}
                  youtubeUrl={showreel.youtube_url}
                  vimeoUrl={showreel.vimeo_url}
                  posterUrl={showreel.poster_url}
                  className="w-full aspect-[21/9] rounded-sm overflow-hidden border border-cinematic-border"
                />
              </div>

              {/* Title & Section Active */}
              <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm space-y-5">
                <div>
                  <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                    Showreel Section Title
                  </label>
                  <input
                    type="text"
                    value={showreel.title}
                    onChange={(e) => setShowreel({ ...showreel, title: e.target.value })}
                    required
                    className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showreel.is_active}
                    onChange={(e) => setShowreel({ ...showreel, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-cinematic-border bg-black text-cinematic-gold accent-[#C9A35E]"
                  />
                  <span className="text-xs text-white font-medium">
                    Enable Showreel section on homepage
                  </span>
                </label>
              </div>

              {/* Video Sources */}
              <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm space-y-6">
                <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider pb-3 border-b border-cinematic-border">
                  Video Source (Upload MP4 or Embed YouTube / Vimeo)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* YouTube Embed */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      YouTube URL
                    </label>
                    <input
                      type="text"
                      value={showreel.youtube_url || ""}
                      onChange={(e) => setShowreel({ ...showreel, youtube_url: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                    />
                  </div>

                  {/* Vimeo Embed */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      Vimeo URL
                    </label>
                    <input
                      type="text"
                      value={showreel.vimeo_url || ""}
                      onChange={(e) => setShowreel({ ...showreel, vimeo_url: e.target.value })}
                      placeholder="https://vimeo.com/..."
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                    />
                  </div>
                </div>

                {/* Direct Video Upload */}
                <div className="pt-2">
                  <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                    Direct MP4 / WebM Video URL
                  </label>
                  <input
                    type="text"
                    value={showreel.video_url || ""}
                    onChange={(e) => setShowreel({ ...showreel, video_url: e.target.value })}
                    placeholder="/uploads/... or https://..."
                    className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-cinematic-gold mb-2 font-mono"
                  />
                  <MediaUploader
                    label="Upload or Replace Showreel Video (MP4/WebM)"
                    fileType="video"
                    accept="video/mp4,video/webm"
                    currentValue={showreel.video_url}
                    onUploadSuccess={(url) => setShowreel({ ...showreel, video_url: url })}
                  />
                </div>
              </div>

              {/* Poster Image */}
              <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm space-y-4">
                <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider pb-3 border-b border-cinematic-border">
                  Custom Poster Artwork
                </h3>

                <input
                  type="text"
                  value={showreel.poster_url}
                  onChange={(e) => setShowreel({ ...showreel, poster_url: e.target.value })}
                  required
                  placeholder="/works/hero/hero-2.jpg"
                  className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-cinematic-gold mb-2 font-mono"
                />
                <MediaUploader
                  label="Upload or Replace Showreel Poster Stills"
                  fileType="image"
                  accept="image/*"
                  currentValue={showreel.poster_url}
                  onUploadSuccess={(url) => setShowreel({ ...showreel, poster_url: url })}
                />
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
