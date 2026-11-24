import React from "react";
import Link from "next/link";
import Image from "next/image";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { getStatsSummary, getSiteSettings } from "@/lib/db";
import {
  Film,
  Sparkles,
  Image as ImageIcon,
  MessageSquare,
  PlusCircle,
  UploadCloud,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Eye,
  Sliders,
  ShieldCheck,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [stats, settings] = await Promise.all([
    getStatsSummary(),
    getSiteSettings(),
  ]);

  return (
    <div className="flex min-h-screen bg-cinematic-bg text-white">
      <AdminSidebar unreadMessages={stats.unreadMessages} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Studio Overview"
          subtitle="Real-time control center for films, media, and client inquiries"
        />

        <main className="p-4 sm:p-8 space-y-6 sm:space-y-8 flex-1 overflow-y-auto">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-sm border border-cinematic-border bg-gradient-to-r from-cinematic-surface via-cinematic-surfaceHover to-cinematic-surface p-5 sm:p-8 shadow-xl">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cinematic-gold/10 border border-cinematic-gold/20 text-cinematic-gold text-[11px] font-semibold tracking-widest uppercase mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                Production Engine Active
              </span>
              <h2 className="text-2xl font-cinematic font-bold text-white mb-2">
                Welcome back to {settings.company_name} CMS
              </h2>
              <p className="text-sm text-cinematic-textMuted leading-relaxed">
                Manage your public portfolio, update client showreels, upload high-fidelity cinema assets, and respond to incoming creative production inquiries.
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-6">
                <Link
                  href="/admin/portfolio"
                  className="btn-gold text-xs py-2.5 px-4 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-black" />
                  <span>Add New Project</span>
                </Link>
                <Link
                  href="/admin/media"
                  className="btn-outline-gold text-xs py-2.5 px-4 flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4 text-cinematic-gold" />
                  <span>Upload Assets</span>
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  className="px-4 py-2.5 text-xs text-cinematic-textMuted hover:text-white border border-cinematic-border hover:border-white/20 rounded-sm transition-colors flex items-center gap-2"
                >
                  <span>Preview Live Website</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cinematic-gold/5 to-transparent pointer-events-none" />
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Projects */}
            <div className="bg-cinematic-surface border border-cinematic-border p-5 rounded-sm shadow-md hover:border-cinematic-gold/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider font-medium text-cinematic-textMuted">
                  Portfolio Films
                </span>
                <div className="p-2 rounded bg-cinematic-gold/10 text-cinematic-gold">
                  <Film className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-cinematic font-bold text-white">
                  {stats.totalProjects}
                </span>
                <span className="text-xs text-emerald-400 font-medium">
                  {stats.publishedProjects} Published
                </span>
              </div>
              <Link
                href="/admin/portfolio"
                className="mt-3 text-[11px] text-cinematic-gold hover:underline flex items-center gap-1 block"
              >
                Manage projects →
              </Link>
            </div>

            {/* Total Services */}
            <div className="bg-cinematic-surface border border-cinematic-border p-5 rounded-sm shadow-md hover:border-cinematic-gold/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider font-medium text-cinematic-textMuted">
                  Services
                </span>
                <div className="p-2 rounded bg-blue-500/10 text-blue-400">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-cinematic font-bold text-white">
                  {stats.totalServices}
                </span>
                <span className="text-xs text-cinematic-textDim">Active Offerings</span>
              </div>
              <Link
                href="/admin/services"
                className="mt-3 text-[11px] text-cinematic-gold hover:underline flex items-center gap-1 block"
              >
                Edit services →
              </Link>
            </div>

            {/* Total Media Files */}
            <div className="bg-cinematic-surface border border-cinematic-border p-5 rounded-sm shadow-md hover:border-cinematic-gold/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider font-medium text-cinematic-textMuted">
                  Media Library
                </span>
                <div className="p-2 rounded bg-purple-500/10 text-purple-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-cinematic font-bold text-white">
                  {stats.totalMedia}
                </span>
                <span className="text-xs text-cinematic-textDim">Images & Videos</span>
              </div>
              <Link
                href="/admin/media"
                className="mt-3 text-[11px] text-cinematic-gold hover:underline flex items-center gap-1 block"
              >
                Open media assets →
              </Link>
            </div>

            {/* Inquiries */}
            <div className="bg-cinematic-surface border border-cinematic-border p-5 rounded-sm shadow-md hover:border-cinematic-gold/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider font-medium text-cinematic-textMuted">
                  Client Inquiries
                </span>
                <div className="p-2 rounded bg-amber-500/10 text-amber-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-cinematic font-bold text-white">
                  {stats.totalMessages}
                </span>
                {stats.unreadMessages > 0 ? (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cinematic-gold text-black">
                    {stats.unreadMessages} Unread
                  </span>
                ) : (
                  <span className="text-xs text-emerald-400">All caught up</span>
                )}
              </div>
              <Link
                href="/admin/messages"
                className="mt-3 text-[11px] text-cinematic-gold hover:underline flex items-center gap-1 block"
              >
                View inbox →
              </Link>
            </div>
          </div>

          {/* Two-Column Layout: Recent Projects & Recent Inquiries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Projects */}
            <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm shadow-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-cinematic-border">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-cinematic-gold" />
                  <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider">
                    Recent Portfolio Projects
                  </h3>
                </div>
                <Link
                  href="/admin/portfolio"
                  className="text-xs text-cinematic-gold hover:underline"
                >
                  View All ({stats.totalProjects})
                </Link>
              </div>

              <div className="space-y-4">
                {stats.recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-sm bg-black/40 border border-cinematic-border/60 hover:border-cinematic-gold/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-sm overflow-hidden shrink-0 border border-cinematic-border bg-black">
                        {project.thumbnail_url && (
                          <Image
                            src={project.thumbnail_url}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate max-w-xs">
                          {project.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-cinematic-textDim">
                          <span className="text-cinematic-gold">{project.category}</span>
                          <span>•</span>
                          <span>{project.year}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase ${
                          project.is_published
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                            : "bg-amber-950/60 text-amber-400 border border-amber-800/40"
                        }`}
                      >
                        {project.is_published ? "Published" : "Draft"}
                      </span>
                      <Link
                        href={`/work/${project.slug}`}
                        target="_blank"
                        className="p-1.5 text-cinematic-textMuted hover:text-cinematic-gold transition-colors"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Inquiries */}
            <div className="bg-cinematic-surface border border-cinematic-border p-6 rounded-sm shadow-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-cinematic-border">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cinematic-gold" />
                  <h3 className="text-sm font-cinematic font-bold text-white uppercase tracking-wider">
                    Recent Inquiries
                  </h3>
                </div>
                <Link
                  href="/admin/messages"
                  className="text-xs text-cinematic-gold hover:underline"
                >
                  View All ({stats.totalMessages})
                </Link>
              </div>

              <div className="space-y-4">
                {stats.recentMessages.length === 0 ? (
                  <p className="text-xs text-cinematic-textDim py-6 text-center">
                    No client inquiries received yet.
                  </p>
                ) : (
                  stats.recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-sm border transition-colors ${
                        !msg.is_read
                          ? "bg-cinematic-gold/5 border-cinematic-gold/30"
                          : "bg-black/40 border-cinematic-border/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">
                            {msg.name}
                          </span>
                          {!msg.is_read && (
                            <span className="w-2 h-2 rounded-full bg-cinematic-gold animate-pulse" />
                          )}
                        </div>
                        <span className="text-[10px] text-cinematic-textDim font-mono">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-cinematic-gold mb-1">
                        Service: {msg.service}
                      </div>
                      <p className="text-xs text-cinematic-textMuted line-clamp-2 leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
