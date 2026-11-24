"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Play, ArrowUpRight, Calendar, User, Film } from "lucide-react";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { Project } from "@/types";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="bg-[#12141A] border border-cinematic-border max-w-4xl w-full rounded-sm shadow-2xl relative my-auto sm:my-8 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Close button with 44x44px touch target */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 min-w-[44px] min-h-[44px] rounded-full bg-black/70 text-white/80 hover:text-white hover:bg-black transition-colors flex items-center justify-center shadow-lg backdrop-blur-md"
          aria-label="Close project preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video or Big Cover Header */}
        <div className="relative w-full aspect-video bg-black shrink-0">
          {project.video_url || project.youtube_url || project.vimeo_url ? (
            <VideoPlayer
              title={project.title}
              videoUrl={project.video_url}
              youtubeUrl={project.youtube_url}
              vimeoUrl={project.vimeo_url}
              posterUrl={project.thumbnail_url}
              className="w-full h-full"
            />
          ) : (
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* Project Body - Scrollable if content is long */}
        <div className="p-5 sm:p-8 space-y-5 sm:space-y-6 overflow-y-auto">
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cinematic-border">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-widest bg-cinematic-gold text-black">
                {project.category}
              </span>
              <span className="text-xs text-cinematic-textDim font-mono">
                Production Year: {project.year}
              </span>
            </div>

            {project.client && (
              <div className="text-xs text-cinematic-textMuted flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cinematic-gold" />
                <span>Client: {project.client}</span>
              </div>
            )}
          </div>

          {/* Title & Descriptions */}
          <div className="space-y-2.5">
            <h2 className="font-cinematic text-2xl sm:text-3xl font-bold text-white tracking-wide">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-cinematic-gold/90 font-medium leading-relaxed">
              {project.short_description}
            </p>
            <p className="text-xs sm:text-sm text-cinematic-textMuted leading-relaxed whitespace-pre-wrap font-sans">
              {project.full_description}
            </p>
          </div>

          {/* Gallery Stills Sequence */}
          {project.gallery_images && project.gallery_images.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-cinematic-border">
              <span className="text-xs uppercase tracking-widest text-cinematic-gold font-semibold block">
                Cinematic Stills & Lens Frames
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {project.gallery_images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-sm overflow-hidden bg-black border border-cinematic-border group"
                  >
                    <Image
                      src={img}
                      alt={`${project.title} - Still ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5 border-t border-cinematic-border">
            <Link
              href={`/work/${project.slug}`}
              className="btn-gold text-xs py-3 px-5 flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto"
            >
              <span>Dedicated Project Page</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-black" />
            </Link>

            <button
              onClick={onClose}
              className="text-xs text-cinematic-textMuted hover:text-white min-h-[44px] flex items-center justify-center py-2 px-4"
            >
              Close Film
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
