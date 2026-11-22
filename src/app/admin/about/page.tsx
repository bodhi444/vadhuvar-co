"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import MediaUploader from "@/components/admin/MediaUploader";
import { useToast } from "@/components/admin/Toast";
import { AboutContent, StatItem, ExperienceItem, EducationItem } from "@/types";
import { Save, Loader2, Plus, Trash2, FileText, BarChart3, Briefcase, GraduationCap } from "lucide-react";

export default function ManageAboutPage() {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [about, setAbout] = useState<AboutContent | null>(null);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/about");
      if (res.ok) {
        const data = await res.json();
        setAbout(data);
      } else {
        toastError("Failed to load about content");
      }
    } catch {
      toastError("Network error loading about data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatChange = (index: number, field: keyof StatItem, value: string) => {
    if (!about) return;
    const newStats = [...about.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setAbout({ ...about, stats: newStats });
  };

  const addStat = () => {
    if (!about) return;
    setAbout({
      ...about,
      stats: [...about.stats, { label: "New Metric", value: "100", suffix: "+" }],
    });
  };

  const removeStat = (index: number) => {
    if (!about) return;
    setAbout({
      ...about,
      stats: about.stats.filter((_, i) => i !== index),
    });
  };

  const handleExpChange = (index: number, field: keyof ExperienceItem, value: string) => {
    if (!about) return;
    const expList = [...(about.experience || [])];
    expList[index] = { ...expList[index], [field]: value };
    setAbout({ ...about, experience: expList });
  };

  const addExp = () => {
    if (!about) return;
    setAbout({
      ...about,
      experience: [
        ...(about.experience || []),
        { period: "2024 – Present", role: "Role Title", company: "Company Name", location: "Location", description: "Responsibilities" },
      ],
    });
  };

  const removeExp = (index: number) => {
    if (!about) return;
    setAbout({
      ...about,
      experience: (about.experience || []).filter((_, i) => i !== index),
    });
  };

  const handleEduChange = (index: number, field: keyof EducationItem, value: string) => {
    if (!about) return;
    const eduList = [...(about.education || [])];
    eduList[index] = { ...eduList[index], [field]: value };
    setAbout({ ...about, education: eduList });
  };

  const addEdu = () => {
    if (!about) return;
    setAbout({
      ...about,
      education: [
        ...(about.education || []),
        { degree: "Degree / Course", institution: "Institution Name", year: "2024", boardOrUniversity: "University" },
      ],
    });
  };

  const removeEdu = (index: number) => {
    if (!about) return;
    setAbout({
      ...about,
      education: (about.education || []).filter((_, i) => i !== index),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        success("About section content updated successfully!");
        setAbout(data.data);
      } else {
        toastError(data.error || "Failed to update about content");
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
          title="Manage About Section"
          subtitle="Refine studio manifesto, creative philosophy, cinematic approach, and verified studio metrics"
        />

        <main className="p-8 max-w-5xl space-y-8 flex-1 overflow-y-auto">
          {loading || !about ? (
            <div className="py-20 flex flex-col items-center justify-center text-cinematic-textMuted">
              <Loader2 className="w-8 h-8 text-cinematic-gold animate-spin mb-3" />
              <p className="text-sm">Loading about content...</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-8">
              {/* Header Save Bar */}
              <div className="flex items-center justify-between bg-cinematic-surface border border-cinematic-border p-4 rounded-sm">
                <div>
                  <h2 className="text-sm font-semibold text-white">About & Studio Story</h2>
                  <p className="text-xs text-cinematic-textDim">
                    Live editable content for both the homepage about section and dedicated /about page.
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
                      <span>Save About Content</span>
                    </>
                  )}
                </button>
              </div>

              {/* Headings & Intro */}
              <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm space-y-6">
                <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider pb-3 border-b border-cinematic-border flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cinematic-gold" />
                  Headings & Studio Introduction
                </h3>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-cinematic-textMuted font-medium mb-1">
                    Main About Heading
                  </label>
                  <input
                    type="text"
                    value={about.heading}
                    onChange={(e) => setAbout({ ...about, heading: e.target.value })}
                    required
                    className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-cinematic-textMuted font-medium mb-1">
                    Introduction Lead Paragraph
                  </label>
                  <textarea
                    rows={3}
                    value={about.intro}
                    onChange={(e) => setAbout({ ...about, intro: e.target.value })}
                    required
                    className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold leading-relaxed"
                  />
                </div>
              </div>

              {/* Company Story & Philosophy */}
              <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm space-y-6">
                <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider pb-3 border-b border-cinematic-border">
                  Origin Story, Creative Philosophy & Production Approach
                </h3>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-cinematic-textMuted font-medium mb-1">
                    Company Story (Founding & Journey)
                  </label>
                  <textarea
                    rows={4}
                    value={about.story}
                    onChange={(e) => setAbout({ ...about, story: e.target.value })}
                    required
                    className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-cinematic-textMuted font-medium mb-1">
                      Creative Philosophy
                    </label>
                    <textarea
                      rows={5}
                      value={about.philosophy}
                      onChange={(e) => setAbout({ ...about, philosophy: e.target.value })}
                      required
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-cinematic-textMuted font-medium mb-1">
                      Production Approach & Craftsmanship
                    </label>
                    <textarea
                      rows={5}
                      value={about.approach}
                      onChange={(e) => setAbout({ ...about, approach: e.target.value })}
                      required
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Studio Key Statistics */}
              <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-cinematic-border">
                  <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-cinematic-gold" />
                    Key Statistics & Milestones
                  </h3>
                  <button
                    type="button"
                    onClick={addStat}
                    className="text-xs text-cinematic-gold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Metric</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {about.stats.map((stat, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-sm bg-black/40 border border-cinematic-border space-y-3 relative group"
                    >
                      <button
                        type="button"
                        onClick={() => removeStat(i)}
                        className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Metric"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-cinematic-textDim block mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => handleStatChange(i, "label", e.target.value)}
                          className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-2.5 py-1.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-cinematic-textDim block mb-1">
                            Value
                          </label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => handleStatChange(i, "value", e.target.value)}
                            className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-2.5 py-1.5 rounded-sm focus:outline-none focus:border-cinematic-gold font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-cinematic-textDim block mb-1">
                            Suffix (e.g. +, %)
                          </label>
                          <input
                            type="text"
                            value={stat.suffix || ""}
                            onChange={(e) => handleStatChange(i, "suffix", e.target.value)}
                            className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-2.5 py-1.5 rounded-sm focus:outline-none focus:border-cinematic-gold font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Experience Timeline */}
              <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-cinematic-border">
                  <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-cinematic-gold" />
                    Career Experience (Timeline)
                  </h3>
                  <button
                    type="button"
                    onClick={addExp}
                    className="text-xs text-cinematic-gold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Role</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(about.experience || []).map((exp, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-sm bg-black/40 border border-cinematic-border space-y-3 relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeExp(i)}
                        className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Role"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-cinematic-textDim block mb-1">
                            Time Period (e.g. 2024 – 2026)
                          </label>
                          <input
                            type="text"
                            value={exp.period}
                            onChange={(e) => handleExpChange(i, "period", e.target.value)}
                            className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-2.5 py-1.5 rounded-sm focus:outline-none focus:border-cinematic-gold font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-cinematic-textDim block mb-1">
                            Role / Job Title
                          </label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => handleExpChange(i, "role", e.target.value)}
                            className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-2.5 py-1.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-cinematic-textDim block mb-1">
                            Company / Studio
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleExpChange(i, "company", e.target.value)}
                            className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-2.5 py-1.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-cinematic-textDim block mb-1">
                          Role Scope & Key Contributions
                        </label>
                        <textarea
                          rows={2}
                          value={exp.description || ""}
                          onChange={(e) => handleExpChange(i, "description", e.target.value)}
                          className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-2.5 py-1.5 rounded-sm focus:outline-none focus:border-cinematic-gold leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Credentials */}
              <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-cinematic-border">
                  <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-cinematic-gold" />
                    Education & Fine Art Qualifications
                  </h3>
                  <button
                    type="button"
                    onClick={addEdu}
                    className="text-xs text-cinematic-gold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Qualification</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(about.education || []).map((edu, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-sm bg-black/40 border border-cinematic-border space-y-3 relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeEdu(i)}
                        className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Qualification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-cinematic-textDim block mb-1">
                            Degree / Course
                          </label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleEduChange(i, "degree", e.target.value)}
                            className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-2.5 py-1.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-cinematic-textDim block mb-1">
                            Institution / College
                          </label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleEduChange(i, "institution", e.target.value)}
                            className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-2.5 py-1.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-cinematic-textDim block mb-1">
                            Passing Year
                          </label>
                          <input
                            type="text"
                            value={edu.year || ""}
                            onChange={(e) => handleEduChange(i, "year", e.target.value)}
                            className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-2.5 py-1.5 rounded-sm focus:outline-none focus:border-cinematic-gold font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Media Visuals */}
              <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm space-y-6">
                <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider pb-3 border-b border-cinematic-border">
                  About Section Visual Media
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      Featured Company Image
                    </label>
                    <input
                      type="text"
                      value={about.image_url}
                      onChange={(e) => setAbout({ ...about, image_url: e.target.value })}
                      required
                      placeholder="/works/portraits/portrait-3.jpg"
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-cinematic-gold mb-2 font-mono"
                    />
                    <MediaUploader
                      label="Upload or Replace About Portrait"
                      fileType="image"
                      accept="image/*"
                      currentValue={about.image_url}
                      onUploadSuccess={(url) => setAbout({ ...about, image_url: url })}
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted block mb-1">
                      Optional Behind-the-Scenes Video (MP4)
                    </label>
                    <input
                      type="text"
                      value={about.video_url || ""}
                      onChange={(e) => setAbout({ ...about, video_url: e.target.value })}
                      placeholder="https://.../video.mp4"
                      className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-cinematic-gold mb-2 font-mono"
                    />
                    <MediaUploader
                      label="Upload BTS Video (MP4/WebM)"
                      fileType="video"
                      accept="video/mp4,video/webm"
                      currentValue={about.video_url}
                      onUploadSuccess={(url) => setAbout({ ...about, video_url: url })}
                    />
                  </div>
                </div>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
