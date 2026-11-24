"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import MediaUploader from "@/components/admin/MediaUploader";
import { useToast } from "@/components/admin/Toast";
import { HomepageContent } from "@/types";
import { Save, Loader2, RefreshCw, Sliders, Play, Image as ImageIcon } from "lucide-react";

export default function ManageHomepagePage() {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<HomepageContent | null>(null);

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const fetchHomepageData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/homepage");
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      } else {
        toastError("Failed to fetch homepage settings");
      }
    } catch {
      toastError("Network error while loading homepage data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        success("Homepage content updated successfully!");
        setContent(data.data);
      } else {
        toastError(data.error || "Failed to update homepage");
      }
    } catch {
      toastError("Network error saving changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-cinematic-bg text-white">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Manage Homepage"
          subtitle="Configure hero visuals, cinematic headings, call-to-actions, and section visibility"
        />

        <main className="p-4 sm:p-8 max-w-7xl 2xl:max-w-[1600px] w-full space-y-8 flex-1 overflow-y-auto">
          {loading || !content ? (
            <div className="py-20 flex flex-col items-center justify-center text-cinematic-textMuted">
              <Loader2 className="w-8 h-8 text-cinematic-gold animate-spin mb-3" />
              <p className="text-sm">Loading homepage settings...</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-8">
              {/* Top Save Bar */}
              <div className="flex items-center justify-between bg-cinematic-surface border border-cinematic-border p-4 rounded-sm">
                <div>
                  <h2 className="text-sm font-semibold text-white">Homepage Editor</h2>
                  <p className="text-xs text-cinematic-textDim">Changes reflect live on the public site upon save.</p>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-gold text-xs py-2 px-5 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-black" />
                      <span>Save Homepage</span>
                    </>
                  )}
                </button>
              </div>

              {/* Hero Headings */}
              <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm space-y-6">
                <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider pb-3 border-b border-cinematic-border">
                  Hero Typography & Headings
                </h3>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-cinematic-textMuted font-medium mb-2">
                    Main Hero Heading
                  </label>
                  <input
                    type="text"
                    value={content.hero_heading}
                    onChange={(e) => setContent({ ...content, hero_heading: e.target.value })}
                    required
                    className="w-full bg-black/60 border border-cinematic-border text-white text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-cinematic-gold"
                    placeholder="TELL YOUR STORY THROUGH THE LENS."
                  />
                  <p className="text-[11px] text-cinematic-textDim mt-1.5">
                    Rendered with large cinematic editorial display typography.
                  </p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-cinematic-textMuted font-medium mb-2">
                    Hero Subheading
                  </label>
                  <textarea
                    rows={3}
                    value={content.hero_subheading}
                    onChange={(e) => setContent({ ...content, hero_subheading: e.target.value })}
                    required
                    className="w-full bg-black/60 border border-cinematic-border text-white text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-cinematic-gold leading-relaxed"
                    placeholder="Creating powerful visuals, unforgettable films and cinematic experiences..."
                  />
                </div>
              </div>

              {/* Hero Media Backgrounds */}
              <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm space-y-6">
                <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider pb-3 border-b border-cinematic-border flex items-center gap-2">
                  <Play className="w-4 h-4 text-cinematic-gold" />
                  Hero Background Media (Video & Image Fallback)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Video Background */}
                  <div className="space-y-3">
                    <label className="block text-xs uppercase tracking-wider text-cinematic-textMuted font-medium">
                      Hero Video Background (MP4 / WebM URL)
                    </label>
                    <input
                      type="text"
                      value={content.hero_video_url || ""}
                      onChange={(e) => setContent({ ...content, hero_video_url: e.target.value })}
                      placeholder="https://example.com/video.mp4 or /uploads/video.mp4"
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                    />
                    <MediaUploader
                      label="Upload or Replace Hero Video"
                      fileType="video"
                      accept="video/mp4,video/webm"
                      currentValue={content.hero_video_url}
                      onUploadSuccess={(url) => setContent({ ...content, hero_video_url: url })}
                    />
                    <p className="text-[11px] text-cinematic-textDim">
                      Autoplays muted on loop behind the dark cinema overlay.
                    </p>
                  </div>

                  {/* Fallback Image */}
                  <div className="space-y-3">
                    <label className="block text-xs uppercase tracking-wider text-cinematic-textMuted font-medium">
                      Hero Image Fallback (When video is loading or unsupported)
                    </label>
                    <input
                      type="text"
                      value={content.hero_image_fallback}
                      onChange={(e) => setContent({ ...content, hero_image_fallback: e.target.value })}
                      required
                      placeholder="/works/hero/hero-1.jpg"
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                    />
                    <MediaUploader
                      label="Upload or Replace Hero Image"
                      fileType="image"
                      accept="image/*"
                      currentValue={content.hero_image_fallback}
                      onUploadSuccess={(url) => setContent({ ...content, hero_image_fallback: url })}
                    />
                  </div>
                </div>
              </div>

              {/* Call-to-Action Buttons */}
              <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm space-y-6">
                <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider pb-3 border-b border-cinematic-border">
                  Hero Call-To-Action (CTA) Buttons
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Primary CTA */}
                  <div className="space-y-4 p-4 rounded-sm bg-black/40 border border-cinematic-border">
                    <span className="text-xs font-semibold text-cinematic-gold uppercase tracking-wider block">
                      Primary CTA Button
                    </span>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-cinematic-textDim block mb-1">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={content.cta_primary_text}
                        onChange={(e) => setContent({ ...content, cta_primary_text: e.target.value })}
                        required
                        className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-cinematic-textDim block mb-1">
                        Button Link
                      </label>
                      <input
                        type="text"
                        value={content.cta_primary_link}
                        onChange={(e) => setContent({ ...content, cta_primary_link: e.target.value })}
                        required
                        className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                      />
                    </div>
                  </div>

                  {/* Secondary CTA */}
                  <div className="space-y-4 p-4 rounded-sm bg-black/40 border border-cinematic-border">
                    <span className="text-xs font-semibold text-cinematic-gold uppercase tracking-wider block">
                      Secondary CTA Button
                    </span>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-cinematic-textDim block mb-1">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={content.cta_secondary_text}
                        onChange={(e) => setContent({ ...content, cta_secondary_text: e.target.value })}
                        required
                        className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-cinematic-textDim block mb-1">
                        Button Link
                      </label>
                      <input
                        type="text"
                        value={content.cta_secondary_link}
                        onChange={(e) => setContent({ ...content, cta_secondary_link: e.target.value })}
                        required
                        className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Visibility Toggles */}
              <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm space-y-6">
                <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider pb-3 border-b border-cinematic-border flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cinematic-gold" />
                  Homepage Section Visibility Toggles
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: "show_services", label: "Services Section" },
                    { key: "show_portfolio", label: "Portfolio Gallery" },
                    { key: "show_showreel", label: "Studio Showreel" },
                    { key: "show_about", label: "About / Philosophy" },
                    { key: "show_contact", label: "Contact Inquiry Form" },
                  ].map((sec) => (
                    <label
                      key={sec.key}
                      className="flex items-center justify-between p-4 bg-black/40 border border-cinematic-border rounded-sm cursor-pointer hover:border-cinematic-gold/40 transition-colors"
                    >
                      <span className="text-xs font-medium text-white">{sec.label}</span>
                      <input
                        type="checkbox"
                        checked={(content as any)[sec.key]}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            [sec.key]: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-cinematic-border bg-black text-cinematic-gold accent-[#C9A35E]"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
