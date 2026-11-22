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
}

const CATEGORIES: ProjectCategory[] = [
  "All",
  "Wedding",
  "Commercial",
  "Music Video",
  "Documentary",
  "Photography",
  "Fine Art",
];

export default function PortfolioSection({
  projects,
  showAllLink = true,
}: PortfolioSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("All");
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const publishedProjects = projects.filter((p) => p.is_published);

  const filteredProjects =
    selectedCategory === "All"
      ? publishedProjects
      : publishedProjects.filter((p) => p.category === selectedCategory);

  return (
    <section id="works" className="py-24 sm:py-32 bg-[#090A0D] relative select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-cinematic-gold font-semibold block">
              Portfolio
            </span>
            <h2 className="font-cinematic text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">
              Selected Works.
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-sm text-xs uppercase tracking-[0.15em] font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-cinematic-gold text-black font-semibold shadow-lg shadow-cinematic-gold/20"
                    : "text-cinematic-textMuted hover:text-white bg-[#12141A] border border-cinematic-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center bg-[#12141A] border border-cinematic-border rounded-sm">
            <Film className="w-10 h-10 text-cinematic-gold/50 mx-auto mb-3" />
            <p className="text-sm text-cinematic-textMuted">
              No films currently published under category "{selectedCategory}".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12141A] via-black/20 to-black/40" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
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
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-cinematic-textDim font-sans">
                      {project.client && <span>Client: {project.client}</span>}
                    </div>

                    <h3
                      onClick={() => setActiveModalProject(project)}
                      className="font-cinematic text-lg sm:text-xl font-bold text-white group-hover:text-cinematic-gold transition-colors cursor-pointer"
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
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-cinematic-gold font-semibold hover:text-cinematic-goldLight transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Watch Film</span>
                    </button>

                    <Link
                      href={`/work/${project.slug}`}
                      className="inline-flex items-center gap-1 text-xs text-cinematic-textDim hover:text-white transition-colors"
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
          <div className="text-center mt-16 pt-8 border-t border-cinematic-border/40">
            <Link
              href="/work"
              className="btn-outline-gold text-xs py-3 px-8 tracking-[0.2em]"
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
