"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Award, Compass, Film, Flame } from "lucide-react";
import { AboutContent } from "@/types";

interface AboutSectionProps {
  about: AboutContent;
}

export default function AboutSection({ about }: AboutSectionProps) {
  return (
    <section id="about" className="py-24 sm:py-32 bg-[#090A0D] relative select-none">
      {/* Background divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cinematic-borderGold/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Main Grid: Visuals on Left, Manifesto on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Stills & Floating Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-cinematic-border bg-black shadow-2xl">
              <Image
                src={about.image_url || "/works/portraits/portrait-3.jpg"}
                alt="FRAME / MOTION Cinematic Vision"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            </div>

            {/* Overlapping Floating Milestone Card */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 bg-[#12141A]/95 border border-cinematic-borderGold/50 p-5 rounded-sm shadow-2xl backdrop-blur-xl max-w-xs">
              <span className="text-[10px] uppercase tracking-[0.2em] text-cinematic-gold font-bold block mb-1">
                Studio Heritage
              </span>
              <p className="text-xs text-white/90 leading-relaxed font-sans">
                Over a decade of independent filmmaking, mastering natural lighting and emotional resonance.
              </p>
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Philosophy */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-cinematic-gold font-semibold block">
                Philosophy & Direction
              </span>
              <h2 className="font-cinematic text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-tight leading-tight">
                {about.heading}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-cinematic-gold font-medium leading-relaxed font-sans">
              {about.intro}
            </p>

            <p className="text-xs sm:text-sm text-cinematic-textMuted leading-relaxed font-sans">
              {about.story}
            </p>

            {/* Two Pillars: Philosophy & Approach */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-cinematic-border">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider font-bold text-white block">
                  Creative Philosophy
                </span>
                <p className="text-xs text-cinematic-textMuted leading-relaxed font-sans">
                  {about.philosophy}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider font-bold text-white block">
                  Production Craft
                </span>
                <p className="text-xs text-cinematic-textMuted leading-relaxed font-sans">
                  {about.approach}
                </p>
              </div>
            </div>

            {/* Key Statistics Grid */}
            {about.stats && about.stats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-cinematic-border">
                {about.stats.map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <span className="font-cinematic text-2xl sm:text-3xl font-bold text-white block">
                      {stat.value}
                      <span className="text-cinematic-gold text-lg sm:text-xl font-normal">
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

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cinematic-gold font-semibold hover:text-white transition-colors"
              >
                <span>Read Full Studio Story</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
