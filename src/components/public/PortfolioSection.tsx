"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play, Film, Video, Eye } from "lucide-react";
import ProjectModal from "./ProjectModal";
import { Project, ProjectCategory } from "@/types";

interface PortfolioSectionProps {
  projects: Project[];
  showAllLink?: boolean;
  initialCategory?: ProjectCategory;
}

const CATEGORIES: ProjectCategory[] = [
  "All",
  "Commercial",
  "Concert Video",
  "Podcast",
  "Photography",
  "Fine Art",
  "Wedding",
];

export default function PortfolioSection({
  projects,
  showAllLink = true,
  initialCategory = "All",
}: PortfolioSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>(initialCategory);
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const publishedProjects = projects.filter((p) => p.is_published);

  const filteredProjects =
    selectedCategory === "All"
      ? publishedProjects
      : publishedProjects.filter((p) => {
          if (selectedCategory === "Concert Video") {
            return p.category === "Concert Video" || p.category === "Music Video";
          }
          if (selectedCategory === "Podcast") {
            return (
              p.category === "Podcast" ||
              p.category === "Documentary" ||
              p.category?.toLowerCase() === "portcast" ||
              p.category?.toLowerCase() === "podcast"
            );
          }
          return p.category === selectedCategory;
        });

  return (
    <section id="works" className="py-20 sm:py-32 bg-[#090A0D] relative select-none">
      <div className="max-w-7xl 2xl:max-w-[1540px] 3xl:max-w-[1760px] mx-auto px-5 sm:px-8 2xl:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div className="flex items-end justify-between">
            <div className="space-y-2 sm:space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-cinematic-gold font-semibold block">
                Curated Filmography & Art
              </span>
              <h2 className="font-cinematic text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">
                Selected Projects.
              </h2>
            </div>

            {showAllLink && (
              <Link
                href="/work"
                className="inline-flex md:hidden items-center gap-1 text-xs uppercase tracking-[0.15em] text-cinematic-gold hover:text-white font-semibold transition-colors shrink-0 pl-3 py-1"
              >
                <span>Archive</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Category Filter Pills (Smooth Touch Horizontal Scroll on Mobile) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1.5 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-sm text-xs uppercase tracking-[0.15em] font-medium transition-all shrink-0 min-h-[38px] flex items-center justify-center ${
                    selectedCategory === cat
                      ? "bg-cinematic-gold text-black font-semibold shadow-lg shadow-cinematic-gold/20"
                      : "text-cinematic-textMuted hover:text-white bg-[#12141A] border border-cinematic-border"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {showAllLink && (
              <Link
                href="/work"
                className="hidden md:inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-cinematic-gold hover:text-white font-semibold transition-colors pl-4 border-l border-cinematic-border whitespace-nowrap"
              >
                <span>View Archive</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center bg-[#12141A] border border-cinematic-border rounded-sm">
            <Film className="w-10 h-10 text-cinematic-gold/50 mx-auto mb-3" />
            <p className="text-sm text-cinematic-textMuted">
              No films currently published under category &quot;{selectedCategory}&quot;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-6 sm:gap-8 2xl:gap-10">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group relative bg-[#12141A] border border-cinematic-border hover:border-cinematic-gold/50 rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-cinematic-gold/5"
              >
                {/* Visual Thumbnail & Play Trigger */}
                <div
                  onClick={() => setActiveModalProject(project)}
                  className="relative aspect-[16/10] overflow-hidden bg-black cursor-pointer"
                >
                  <Image
                    src={project.thumbnail_url}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (max-width: 1920px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12141A] via-black/20 to-black/40" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider bg-black/80 text-cinematic-gold border border-cinematic-borderGold/30 backdrop-blur-md uppercase">
                      {project.category}
                    </span>
                    <span className="text-[11px] font-mono text-white/80 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                      {project.year}
                    </span>
                  </div>

                  {/* Center Play Icon Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 rounded-full bg-cinematic-gold/90 text-black flex items-center justify-center shadow-xl scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 2xl:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-cinematic-textDim font-sans">
                      <span className="font-mono text-xs font-bold text-cinematic-gold px-2 py-0.5 rounded bg-cinematic-gold/10 border border-cinematic-gold/30">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {project.client && <span>Client: {project.client}</span>}
                    </div>

                    <h3
                      onClick={() => setActiveModalProject(project)}
                      className="font-cinematic text-lg sm:text-xl 2xl:text-2xl font-bold text-white group-hover:text-cinematic-gold transition-colors cursor-pointer"
                    >
                      {project.title}
                    </h3>

                    <p className="text-xs text-cinematic-textMuted leading-relaxed font-sans line-clamp-2">
                      {project.short_description}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="flex items-center justify-between pt-4 border-t border-cinematic-border/60">
                    <button
                      onClick={() => setActiveModalProject(project)}
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-cinematic-gold font-semibold hover:text-cinematic-goldLight transition-colors min-h-[44px] py-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Watch Film</span>
                    </button>

                    <Link
                      href={`/work/${project.slug}`}
                      className="inline-flex items-center gap-1 text-xs text-cinematic-textDim hover:text-white transition-colors min-h-[44px] py-1"
                    >
                      <span>Story Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Archive CTA */}
        {showAllLink && (
          <div className="text-center mt-12 sm:mt-16 pt-8 border-t border-cinematic-border/40">
            <Link
              href="/work"
              className="btn-outline-gold text-xs py-3.5 px-6 sm:px-8 tracking-[0.18em] sm:tracking-[0.2em] inline-flex items-center justify-center min-h-[44px] w-full sm:w-auto"
            >
              Explore Complete Filmography Archive ({publishedProjects.length})
            </Link>
          </div>
        )}
      </div>

      {/* Project Quick View Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
}
