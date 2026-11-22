import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/public/Navigation";
import Footer from "@/components/public/Footer";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { getAboutContent, getSiteSettings } from "@/lib/db";
import { ArrowUpRight, Award, Compass, Film, Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — Studio Manifesto & Filmmakers",
  description:
    "Discover the creative philosophy, cinematic craftsmanship, and founding story of FRAME / MOTION.",
};

export const revalidate = 0;

export default async function AboutPage() {
  const [about, settings] = await Promise.all([
    getAboutContent(),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-[#090A0D] text-white flex flex-col justify-between">
      <Navigation settings={settings} />

      <main className="flex-1 pt-32 pb-24">
        {/* Editorial Manifesto Header */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-16 border-b border-cinematic-border/60">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-cinematic-gold font-semibold block">
              Studio Manifesto
            </span>
            <h1 className="font-cinematic text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase tracking-tight leading-tight">
              {about.heading}
            </h1>
            <p className="text-sm sm:text-base text-cinematic-gold font-medium font-sans leading-relaxed">
              {about.intro}
            </p>
          </div>
        </div>

        {/* Studio Stills & Founding Narrative */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Image */}
            <div className="lg:col-span-5 relative aspect-[4/5] rounded-sm overflow-hidden border border-cinematic-border bg-black shadow-2xl">
              <Image
                src={about.image_url || "/works/portraits/portrait-3.jpg"}
                alt="FRAME / MOTION Cinematographer"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            </div>

            {/* Right Story */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.2em] text-cinematic-gold font-semibold block">
                Our Genesis
              </span>
              <h2 className="font-cinematic text-2xl sm:text-3xl font-bold text-white uppercase">
                Obsessed with Light, Shadow, and Human Truth.
              </h2>
              <p className="text-xs sm:text-sm text-cinematic-textMuted leading-relaxed font-sans whitespace-pre-wrap">
                {about.story}
              </p>

              {/* Statistics Grid */}
              {about.stats && about.stats.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-cinematic-border">
                  {about.stats.map((stat, i) => (
                    <div key={i} className="space-y-1">
                      <span className="font-cinematic text-3xl font-bold text-white block">
                        {stat.value}
                        <span className="text-cinematic-gold text-lg font-normal">
                          {stat.suffix}
                        </span>
                      </span>
                      <span className="text-[11px] uppercase tracking-wider text-cinematic-textDim block font-sans">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Philosophy & Approach Grid */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#12141A] border border-cinematic-border p-8 rounded-sm space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] text-cinematic-gold font-semibold block">
                Pillar 01
              </span>
              <h3 className="font-cinematic text-2xl font-bold text-white uppercase">
                Creative Philosophy
              </h3>
              <p className="text-xs sm:text-sm text-cinematic-textMuted leading-relaxed font-sans whitespace-pre-wrap">
                {about.philosophy}
              </p>
            </div>

            <div className="bg-[#12141A] border border-cinematic-border p-8 rounded-sm space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] text-cinematic-gold font-semibold block">
                Pillar 02
              </span>
              <h3 className="font-cinematic text-2xl font-bold text-white uppercase">
                Production Approach
              </h3>
              <p className="text-xs sm:text-sm text-cinematic-textMuted leading-relaxed font-sans whitespace-pre-wrap">
                {about.approach}
              </p>
            </div>
          </div>
        </div>

        {/* Optional Behind The Scenes Film */}
        {about.video_url && (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
            <div className="mb-6">
              <span className="text-xs uppercase tracking-[0.25em] text-cinematic-gold font-semibold block mb-1">
                Behind The Glass
              </span>
              <h3 className="font-cinematic text-2xl sm:text-3xl font-bold text-white uppercase">
                On Location: Production Process
              </h3>
            </div>

            <div className="relative rounded-sm overflow-hidden border border-cinematic-border bg-black shadow-2xl">
              <VideoPlayer
                title="Behind The Scenes"
                videoUrl={about.video_url}
                posterUrl={about.image_url}
                className="w-full aspect-[21/9]"
              />
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center pt-16 border-t border-cinematic-border/60">
          <div className="max-w-xl mx-auto space-y-4">
            <h3 className="font-cinematic text-2xl font-bold text-white">
              Ready To Collaborate?
            </h3>
            <p className="text-xs sm:text-sm text-cinematic-textMuted font-sans leading-relaxed">
              We accept a limited number of commercial commissions and wedding films annually.
            </p>
            <div className="pt-4">
              <Link
                href="/contact"
                className="btn-gold text-xs py-3.5 px-8 tracking-[0.2em]"
              >
                Initiate Project Brief
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
