"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  MapPin,
  Star,
  GraduationCap,
  Clapperboard,
  Globe,
  Film,
  Camera,
  Layers,
  Palette,
  Play,
} from "lucide-react";
import { HomepageContent, AboutContent, SiteSettings } from "@/types";

interface HeroSectionProps {
  content: HomepageContent;
  about?: AboutContent;
  settings?: SiteSettings;
}

const DISCIPLINES = [
  { id: "#01", title: "Cinematography (DOP)", link: "/work?cat=Commercial" },
  { id: "#02", title: "Commercial Brand Films", link: "/work?cat=Commercial" },
  { id: "#03", title: "Luxury Wedding Epics", link: "/work?cat=Wedding" },
  { id: "#04", title: "Fine Art & Sculptures", link: "/work?cat=Fine%20Art" },
];

const TRUSTED_STUDIOS = [
  { name: "Skillmount Education", role: "Director of Photography (2024–2026)" },
  { name: "Greenmedia", role: "Cinematographer (2023–2024)" },
  { name: "RestoreDesign Bangalore", role: "Dimensional Sculptor & Artist" },
  { name: "Raja Ravi Varma Fine Arts", role: "BFA in Painting (2015)" },
];

export default function HeroSection({ content, about, settings }: HeroSectionProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <section className="relative min-h-screen pt-28 pb-16 sm:pb-24 overflow-hidden bg-[#07080B] flex flex-col justify-between select-none">
      {/* 1. Giant Typographic Backdrop (Inspired by Reference 2 & 4) */}
      <div className="absolute top-16 sm:top-20 inset-x-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        <span className="font-cinematic font-black text-[15vw] sm:text-[14vw] tracking-tighter uppercase text-white/[0.035] leading-none whitespace-nowrap">
          ATHUL OLLUR
        </span>
      </div>

      {/* 2. Warm Amber/Gold Ambient Halo Glow (Inspired by Reference 1 & Reference 4) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] lg:w-[750px] h-[350px] sm:h-[600px] lg:h-[750px] bg-gradient-to-tr from-amber-600/20 via-cinematic-gold/15 to-transparent rounded-full blur-[100px] sm:blur-[140px] pointer-events-none z-0" />

      {/* Background Subtle Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,8,11,0.85)_100%)] pointer-events-none z-0" />

      {/* Top Banner Bar (Reference 2 style) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 mb-8 sm:mb-12">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] text-[11px] font-mono uppercase tracking-[0.2em]">
          <span className="text-cinematic-textDim">
            Cinematic Portfolio & Direction
          </span>
          <div className="flex items-center gap-2 text-cinematic-gold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-white/80 font-medium tracking-wider">
              Available For Worldwide Projects
            </span>
          </div>
        </div>
      </div>

      {/* Main Hero Grid: Left Content - Center Portrait - Right Highlights */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* LEFT COLUMN: Profile Introduction (Inspired by Reference 1 & 2) */}
          <div className="lg:col-span-4 space-y-6 text-left order-2 lg:order-1">
            {/* Serif Calligraphic Accent */}
            <div className="space-y-1">
              <span className="font-cinematic italic text-2xl sm:text-3xl text-cinematic-gold/90 font-normal block tracking-wide">
                Hello, I&apos;m
              </span>
              <h1 className="font-cinematic text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[0.95]">
                Athul Ollur
              </h1>
              <span className="font-mono text-[11px] sm:text-xs text-cinematic-gold uppercase tracking-[0.25em] font-semibold block pt-2">
                Director of Photography (DOP)
              </span>
              <span className="text-xs uppercase tracking-wider text-cinematic-textDim block font-sans">
                Cinematographer · Fine Artist
              </span>
            </div>

            {/* Editorial Bio */}
            <p className="text-xs sm:text-sm text-cinematic-textMuted leading-relaxed font-sans max-w-sm">
              Merging classical fine-art discipline (BFA in Painting from Raja Ravi Varma College of Fine Arts) with high-end camera movement to craft unforgettable commercials, luxury wedding films, and visual stories.
            </p>

            {/* Location & Quick Meta */}
            <div className="flex items-center gap-2 text-[11px] text-white/70 font-mono pt-1">
              <MapPin className="w-3.5 h-3.5 text-cinematic-gold shrink-0" />
              <span>Based in Calicut, Kerala · Global Commissions</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/work"
                className="btn-gold text-xs py-3.5 px-6 tracking-[0.18em] shadow-lg shadow-cinematic-gold/20 flex items-center gap-2 group"
              >
                <span>Explore Selected Works</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/contact"
                className="btn-outline-gold text-xs py-3.5 px-6 tracking-[0.18em]"
              >
                Let&apos;s Collaborate
              </Link>
            </div>
          </div>

          {/* CENTER COLUMN: The Star Portrait (Front and Center like Ref 1, 2, 3 & 4) */}
          <div className="lg:col-span-5 relative flex items-center justify-center order-1 lg:order-2">
            {/* Portrait Frame Container */}
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[440px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/60 group">
              {/* Backlight Glow inside container */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080B] via-transparent to-transparent z-10 pointer-events-none" />

              <Image
                src="/athul-ollur.jpg"
                alt="Athul Ollur (Athul Kumar) — Director of Photography & Visual Artist"
                fill
                priority
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 40vw, 440px"
                className="object-cover object-top scale-100 group-hover:scale-105 transition-transform duration-700"
                onLoad={() => setImgLoaded(true)}
              />

              {/* Floating Bottom Card Over Portrait */}
              <div className="absolute bottom-4 inset-x-4 z-20 bg-[#0C0E14]/90 border border-cinematic-gold/40 p-3.5 rounded-xl backdrop-blur-xl shadow-2xl space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-cinematic-gold font-bold">
                  <span>Athul Ollur (Athul Kumar)</span>
                  <span className="text-white/60">BFA Painting (2015)</span>
                </div>
                <p className="text-[11px] text-white/90 font-sans leading-tight">
                  DOP at Skillmount Education (2024–2026) · Former Cinematographer at Greenmedia (2023–2024)
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 4 Key Metric / Highlight Cards (Inspired by Reference 2) */}
          <div className="lg:col-span-3 space-y-3 order-3">
            {/* Card 1: Experience */}
            <div className="p-4 rounded-xl bg-[#0F1117]/80 border border-white/[0.08] hover:border-cinematic-gold/50 transition-all backdrop-blur-sm group space-y-1">
              <div className="flex items-center gap-2.5 text-cinematic-gold">
                <div className="p-1.5 rounded-md bg-cinematic-gold/10">
                  <Star className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-cinematic-textDim group-hover:text-cinematic-gold transition-colors font-bold">
                  Experience
                </span>
              </div>
              <h4 className="font-cinematic text-sm sm:text-base font-bold text-white uppercase pt-1">
                10+ Years Behind Lens
              </h4>
              <p className="text-[11px] text-cinematic-textMuted font-sans">
                DOP at Skillmount Education & Greenmedia
              </p>
            </div>

            {/* Card 2: Fine Arts Pedigree */}
            <div className="p-4 rounded-xl bg-[#0F1117]/80 border border-white/[0.08] hover:border-cinematic-gold/50 transition-all backdrop-blur-sm group space-y-1">
              <div className="flex items-center gap-2.5 text-cinematic-gold">
                <div className="p-1.5 rounded-md bg-cinematic-gold/10">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-cinematic-textDim group-hover:text-cinematic-gold transition-colors font-bold">
                  Fine Art Pedigree
                </span>
              </div>
              <h4 className="font-cinematic text-sm sm:text-base font-bold text-white uppercase pt-1">
                BFA in Painting (2015)
              </h4>
              <p className="text-[11px] text-cinematic-textMuted font-sans">
                Raja Ravi Varma College Of Fine Arts, Mavelikkara
              </p>
            </div>

            {/* Card 3: Specialization */}
            <div className="p-4 rounded-xl bg-[#0F1117]/80 border border-white/[0.08] hover:border-cinematic-gold/50 transition-all backdrop-blur-sm group space-y-1">
              <div className="flex items-center gap-2.5 text-cinematic-gold">
                <div className="p-1.5 rounded-md bg-cinematic-gold/10">
                  <Clapperboard className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-cinematic-textDim group-hover:text-cinematic-gold transition-colors font-bold">
                  Specialized In
                </span>
              </div>
              <h4 className="font-cinematic text-sm sm:text-base font-bold text-white uppercase pt-1">
                DOP & Direction
              </h4>
              <p className="text-[11px] text-cinematic-textMuted font-sans">
                Commercials, Weddings, Documentaries & Sculptures
              </p>
            </div>

            {/* Card 4: Collaboration */}
            <div className="p-4 rounded-xl bg-[#0F1117]/80 border border-white/[0.08] hover:border-cinematic-gold/50 transition-all backdrop-blur-sm group space-y-1">
              <div className="flex items-center gap-2.5 text-cinematic-gold">
                <div className="p-1.5 rounded-md bg-cinematic-gold/10">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-cinematic-textDim group-hover:text-cinematic-gold transition-colors font-bold">
                  Working
                </span>
              </div>
              <h4 className="font-cinematic text-sm sm:text-base font-bold text-white uppercase pt-1">
                Worldwide Commissions
              </h4>
              <p className="text-[11px] text-cinematic-textMuted font-sans">
                Available for Freelance & Studio Directing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Disciplines Pills & Studio Marquee (Inspired by Reference 1) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 mt-12 sm:mt-16 pt-6 border-t border-white/[0.08] space-y-6">
        {/* Disciplines 4-Pill Index */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DISCIPLINES.map((d) => (
            <Link
              key={d.id}
              href={d.link}
              className="p-3.5 rounded-lg bg-[#0F1117] border border-white/[0.06] hover:border-cinematic-gold/50 flex items-center justify-between transition-all group shadow-md"
            >
              <div>
                <span className="font-mono text-[10px] text-cinematic-gold font-bold block">
                  {d.id}
                </span>
                <span className="text-xs font-semibold text-white/90 group-hover:text-cinematic-gold transition-colors">
                  {d.title}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-cinematic-gold group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        {/* Studio / Experience Trust Marquee */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-[11px] font-mono text-cinematic-textDim">
          <span className="uppercase tracking-[0.2em] font-semibold text-cinematic-gold/80">
            Trusted Across Studios & Production Houses:
          </span>
          <div className="flex flex-wrap items-center gap-6 text-white/70">
            {TRUSTED_STUDIOS.map((s, idx) => (
              <span key={idx} className="hover:text-white transition-colors">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
