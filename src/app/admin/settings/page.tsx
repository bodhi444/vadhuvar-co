"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import MediaUploader from "@/components/admin/MediaUploader";
import { useToast } from "@/components/admin/Toast";
import { SiteSettings } from "@/types";
import {
  Save,
  Loader2,
  Building,
  Mail,
  Phone,
  MapPin,
  Share2,
  Search,
} from "lucide-react";

export default function WebsiteSettingsPage() {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      } else {
        toastError("Failed to fetch settings");
      }
    } catch {
      toastError("Network error loading settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        success("Website settings updated successfully!");
        setSettings(data.data);
      } else {
        toastError(data.error || "Failed to update settings");
      }
    } catch {
      toastError("Network error saving settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-cinematic-bg text-white">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Website Settings"
          subtitle="Global company metadata, brand contact channels, social networks, and search engine optimization"
        />

        <main className="p-8 max-w-5xl space-y-8 flex-1 overflow-y-auto">
          {loading || !settings ? (
            <div className="py-20 flex flex-col items-center justify-center text-cinematic-textMuted">
              <Loader2 className="w-8 h-8 text-cinematic-gold animate-spin mb-3" />
              <p className="text-sm">Loading studio settings...</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-8">
              {/* Header Save Bar */}
              <div className="flex items-center justify-between bg-cinematic-surface border border-cinematic-border p-4 rounded-sm">
                <div>
                  <h2 className="text-sm font-semibold text-white">Global Configuration</h2>
                  <p className="text-xs text-cinematic-textDim">
                    Updates company branding, contact routing, social profiles, and SEO tags.
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
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-black" />
                      <span>Save Settings</span>
                    </>
                  )}
                </button>
              </div>

              {/* Company Branding */}
              <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm space-y-6">
                <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider pb-3 border-b border-cinematic-border flex items-center gap-2">
                  <Building className="w-4 h-4 text-cinematic-gold" />
                  Studio Branding
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={settings.company_name}
                      onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                      required
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      Tagline / Descriptor
                    </label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      Custom Logo Image (Optional)
                    </label>
                    <input
                      type="text"
                      value={settings.logo_url || ""}
                      onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                      placeholder="Leave blank to use cinematic aperture vector logo"
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-cinematic-gold mb-2 font-mono"
                    />
                    <MediaUploader
                      label="Upload Custom Logo"
                      fileType="image"
                      accept="image/*"
                      currentValue={settings.logo_url}
                      onUploadSuccess={(url) => setSettings({ ...settings, logo_url: url })}
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      Favicon URL
                    </label>
                    <input
                      type="text"
                      value={settings.favicon_url || ""}
                      onChange={(e) => setSettings({ ...settings, favicon_url: e.target.value })}
                      placeholder="/favicon.ico"
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-cinematic-gold mb-2 font-mono"
                    />
                    <MediaUploader
                      label="Upload Custom Favicon"
                      fileType="image"
                      accept="image/*"
                      currentValue={settings.favicon_url}
                      onUploadSuccess={(url) => setSettings({ ...settings, favicon_url: url })}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm space-y-6">
                <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider pb-3 border-b border-cinematic-border flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cinematic-gold" />
                  Contact & Communication Channels
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      Studio Email
                    </label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      required
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      Studio Phone
                    </label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      required
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      WhatsApp Direct Link / Number
                    </label>
                    <input
                      type="text"
                      value={settings.whatsapp}
                      onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                      placeholder="+15552345678"
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                    Studio Physical Address / Headquarters
                  </label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    required
                    className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                  />
                </div>
              </div>

              {/* Social Channels */}
              <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm space-y-6">
                <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider pb-3 border-b border-cinematic-border flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-cinematic-gold" />
                  Social Media Links
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      Instagram Profile URL
                    </label>
                    <input
                      type="url"
                      value={settings.instagram_url}
                      onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                      placeholder="https://instagram.com/framemotion"
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      YouTube Channel URL
                    </label>
                    <input
                      type="url"
                      value={settings.youtube_url}
                      onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                      placeholder="https://youtube.com/@framemotion"
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      Vimeo Channel URL
                    </label>
                    <input
                      type="url"
                      value={settings.vimeo_url}
                      onChange={(e) => setSettings({ ...settings, vimeo_url: e.target.value })}
                      placeholder="https://vimeo.com/framemotion"
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      Facebook Page URL
                    </label>
                    <input
                      type="url"
                      value={settings.facebook_url}
                      onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                      placeholder="https://facebook.com/framemotion"
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                    />
                  </div>
                </div>
              </div>

              {/* SEO Settings */}
              <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm space-y-6">
                <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider pb-3 border-b border-cinematic-border flex items-center gap-2">
                  <Search className="w-4 h-4 text-cinematic-gold" />
                  Search Engine Optimization (SEO Metadata)
                </h3>

                <div>
                  <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                    Meta Title Tag
                  </label>
                  <input
                    type="text"
                    value={settings.seo_title}
                    onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
                    required
                    className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                    Meta Description Tag
                  </label>
                  <textarea
                    rows={3}
                    value={settings.seo_description}
                    onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
                    required
                    className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold leading-relaxed"
                  />
                </div>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
