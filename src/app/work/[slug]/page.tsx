import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/public/Navigation";
import Footer from "@/components/public/Footer";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { getProjectBySlug, getProjects, getSiteSettings } from "@/lib/db";
import { ArrowLeft, ArrowUpRight, Calendar, User, Film, Camera } from "lucide-react";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} — ${project.category}`,
    description: project.short_description,
    openGraph: {
      title: `${project.title} | ATHUL OLLUR`,
      description: project.short_description,
      images: [{ url: project.thumbnail_url }],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([
    getProjectBySlug(slug),
    getSiteSettings(),
  ]);

  if (!project || !project.is_published) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#090A0D] text-white flex flex-col justify-between">
      <Navigation settings={settings} />

      <main className="flex-1 pt-24 sm:pt-32 pb-16 sm:pb-24">
        {/* Breadcrumb / Back Link */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-6 sm:mb-8">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cinematic-textMuted hover:text-cinematic-gold transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Works</span>
          </Link>
        </div>

        {/* Project Header Info */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-8 sm:mb-10">
          <div className="max-w-4xl space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <span className="px-2.5 py-1 rounded text-xs uppercase font-bold tracking-widest bg-cinematic-gold text-black">
                {project.category}
              </span>
              <span className="text-xs text-cinematic-textDim font-mono">
                {project.year}
              </span>
              {project.client && (
                <>
                  <span className="text-cinematic-border">•</span>
                  <span className="text-xs text-cinematic-textMuted font-sans">
                    Client: {project.client}
                  </span>
                </>
              )}
            </div>

            <h1 className="font-cinematic text-3xl sm:text-5xl md:text-6xl font-bold text-white uppercase tracking-tight leading-tight">
              {project.title}
            </h1>

            <p className="text-sm sm:text-lg text-cinematic-gold/90 font-sans leading-relaxed font-light">
              {project.short_description}
            </p>
          </div>
        </div>

        {/* Cinema Video Theater */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-12 sm:mb-16">
          <div className="relative rounded-sm overflow-hidden border border-cinematic-border bg-black shadow-2xl">
            <VideoPlayer
              title={project.title}
              videoUrl={project.video_url}
              youtubeUrl={project.youtube_url}
              vimeoUrl={project.vimeo_url}
              posterUrl={project.thumbnail_url}
              autoPlay={false}
              className="w-full aspect-video"
            />
          </div>
        </div>

        {/* Full Narrative & Technical Synopsis */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-16 sm:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 border-t border-cinematic-border">
            <div className="lg:col-span-4 space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] text-cinematic-gold font-semibold block">
                Production Notes
              </span>
              <div className="space-y-3 text-xs text-cinematic-textMuted font-sans">
                <div className="pb-3 border-b border-cinematic-border/60">
                  <span className="text-cinematic-textDim block mb-1">Discipline:</span>
                  <span className="text-white font-medium">{project.category} Production</span>
                </div>
                {project.client && (
                  <div className="pb-3 border-b border-cinematic-border/60">
                    <span className="text-cinematic-textDim block mb-1">Commissioned By:</span>
                    <span className="text-white font-medium">{project.client}</span>
                  </div>
                )}
                <div className="pb-3 border-b border-cinematic-border/60">
                  <span className="text-cinematic-textDim block mb-1">Release Year:</span>
                  <span className="text-white font-medium">{project.year}</span>
                </div>
                <div>
                  <span className="text-cinematic-textDim block mb-1">Studio Color Timing:</span>
                  <span className="text-white font-medium">DaVinci Resolve 35mm Emulation</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-5 sm:space-y-6">
              <span className="text-xs uppercase tracking-[0.2em] text-cinematic-gold font-semibold block">
                Creative Story & Execution
              </span>
              <p className="text-xs sm:text-base text-cinematic-textMuted font-sans leading-relaxed whitespace-pre-wrap">
                {project.full_description}
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Stills Wall */}
        {project.gallery_images && project.gallery_images.length > 0 && (
          <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-16 sm:mb-20">
            <div className="mb-6 sm:mb-8">
              <span className="text-xs uppercase tracking-[0.25em] text-cinematic-gold font-semibold block mb-2">
                Optics & Framing
              </span>
              <h2 className="font-cinematic text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
                Cinematography Stills.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {project.gallery_images.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-video rounded-sm overflow-hidden bg-black border border-cinematic-border"
                >
                  <Image
                    src={imgSrc}
                    alt={`${project.title} - Lens Frame ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-cinematic-gold">
                      Still Frame 0{idx + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center pt-12 sm:pt-16 border-t border-cinematic-border/60">
          <div className="max-w-xl mx-auto space-y-4">
            <h3 className="font-cinematic text-2xl font-bold text-white">
              Inspired By This Film?
            </h3>
            <p className="text-xs sm:text-sm text-cinematic-textMuted font-sans leading-relaxed">
              Let's create a bespoke film for your brand, milestone, or commercial campaign.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/contact"
                className="btn-gold text-xs py-3.5 px-8 tracking-[0.2em] w-full sm:w-auto"
              >
                Inquire For Production
              </Link>
              <Link
                href="/work"
                className="btn-outline-gold text-xs py-3.5 px-8 tracking-[0.2em] w-full sm:w-auto"
              >
                Browse All Films
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
