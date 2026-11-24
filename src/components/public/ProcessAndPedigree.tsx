"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  CheckCircle2,
  Quote,
  Sparkles,
  ArrowRight,
  Palette,
  Layers,
  Video,
  Sliders,
  Film,
} from "lucide-react";
import { AboutContent } from "@/types";

interface ProcessAndPedigreeProps {
  about: AboutContent;
}

const WORK_PROCESS_STEPS = [
  {
    step: "01",
    title: "DISCOVER & STORY",
    description: "Analyze the narrative arc, emotional core, character intent, and director's overarching vision.",
    icon: Film,
  },
  {
    step: "02",
    title: "SCENOGRAPHY & LIGHT",
    description: "Architect natural and artificial lighting, choose optics (anamorphic vs. spherical), and set color palette.",
    icon: Palette,
  },
  {
    step: "03",
    title: "CINEMATIC CAPTURE",
    description: "Execute camera blocking, fluid movement, optical depth, and high-fidelity sensor capture on set.",
    icon: Video,
  },
  {
    step: "04",
    title: "EDITORIAL RHYTHM",
    description: "Sculpt the narrative cadence, cuts, pacing, and sound synchronization in Final Cut Pro & Premiere Pro.",
    icon: Layers,
  },
  {
    step: "05",
    title: "COLOR TIMING & MASTER",
    description: "Master high dynamic range color grading and filmic texture in DaVinci Resolve for final delivery.",
    icon: Sliders,
  },
];

const SKILL_TAGS = [
  "Director of Photography (DOP)",
  "Visual Storytelling",
  "Natural & Studio Lighting",
  "Camera Movement & Blocking",
  "Anamorphic & Spherical Glass",
  "Final Cut Pro",
  "Adobe Premiere Pro",
  "DaVinci Resolve",
  "Edius",
  "Adobe Photoshop",
  "Canvas Painting (BFA)",
  "Dimensional Sculpting",
  "Event Scenography",
  "Pre-visualization",
];

export default function ProcessAndPedigree({ about }: ProcessAndPedigreeProps) {
  return (
    <section className="py-20 sm:py-32 bg-[#08090C] relative select-none border-t border-cinematic-border/60">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cinematic-gold/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-[1540px] 3xl:max-w-[1760px] mx-auto px-5 sm:px-8 2xl:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4 sm:gap-6">
          <div className="space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cinematic-gold/10 border border-cinematic-gold/30 text-cinematic-gold text-[10px] uppercase tracking-[0.25em] font-semibold">
              <Sparkles className="w-3 h-3 text-cinematic-gold" />
              <span>Pedigree & Methodology</span>
            </div>
            <h2 className="font-cinematic text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl font-bold text-white uppercase tracking-tight">
              Craft, Education & Process.
            </h2>
          </div>
          <p className="text-xs sm:text-sm 2xl:text-base text-cinematic-textMuted max-w-md font-sans leading-relaxed">
            How a fine arts foundation at Raja Ravi Varma College translates into rigorous, five-stage cinematic storytelling on set.
          </p>
        </div>

        {/* 3-Column Editorial Grid (Inspired by Reference 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 2xl:gap-10 items-start">
          {/* Column 1: Education & Skills (4 cols) */}
          <div className="lg:col-span-4 bg-[#101217] border border-cinematic-border p-5 sm:p-8 rounded-sm space-y-6 sm:space-y-8 shadow-xl">
            {/* Education Sub-section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-cinematic-border">
                <GraduationCap className="w-4 h-4 text-cinematic-gold" />
                <h3 className="text-xs uppercase tracking-[0.2em] text-white font-bold">
                  Education & Fine Art
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">
                      BFA in Painting
                    </span>
                    <span className="text-[10px] font-mono text-cinematic-gold px-2 py-0.5 bg-cinematic-gold/10 rounded">
                      2015
                    </span>
                  </div>
                  <p className="text-xs text-cinematic-gold/90 font-medium">
                    Raja Ravi Varma College Of Fine Arts, Mavelikkara
                  </p>
                  <p className="text-[11px] text-cinematic-textDim">
                    University of Kerala · Classical painting, chiaroscuro, anatomy, and visual aesthetics.
                  </p>
                </div>

                <div className="space-y-1 pt-3 border-t border-cinematic-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">
                      Higher Secondary (Commerce)
                    </span>
                    <span className="text-[10px] font-mono text-cinematic-textDim">
                      2011
                    </span>
                  </div>
                  <p className="text-xs text-cinematic-textMuted">
                    Arts College Koyilandy
                  </p>
                </div>

                <div className="space-y-1 pt-3 border-t border-cinematic-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">
                      High School (SSLC)
                    </span>
                    <span className="text-[10px] font-mono text-cinematic-textDim">
                      2009
                    </span>
                  </div>
                  <p className="text-xs text-cinematic-textMuted">
                    Koothali VHSS
                  </p>
                </div>
              </div>
            </div>

            {/* Skills Pills */}
            <div className="space-y-3 pt-4 border-t border-cinematic-border">
              <h4 className="text-[11px] uppercase tracking-[0.2em] text-cinematic-gold font-bold">
                Technical & Software Mastery
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {SKILL_TAGS.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-mono bg-black/60 border border-cinematic-border text-cinematic-textMuted hover:border-cinematic-gold/60 hover:text-white transition-colors rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: 5-Step Work Process (4 cols) */}
          <div className="lg:col-span-4 bg-[#101217] border border-cinematic-border p-5 sm:p-8 rounded-sm space-y-6 shadow-xl">
            <div className="pb-3 border-b border-cinematic-border">
              <span className="text-xs uppercase tracking-[0.2em] text-white font-bold block">
                Work Process
              </span>
              <p className="text-[11px] text-cinematic-textDim font-sans">
                Methodical workflow from script to final cinema master
              </p>
            </div>

            {/* Timeline with dotted line */}
            <div className="relative pl-8 space-y-6 sm:space-y-7 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-cinematic-gold before:via-cinematic-gold/40 before:to-transparent">
              {WORK_PROCESS_STEPS.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="relative group">
                    {/* Number dot positioned safely inside */}
                    <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-[#101217] border border-cinematic-gold flex items-center justify-center text-[10px] font-mono font-bold text-cinematic-gold group-hover:bg-cinematic-gold group-hover:text-black transition-colors shadow-sm">
                      {item.step}
                    </div>

                    <div className="space-y-1 pl-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-3.5 h-3.5 text-cinematic-gold/80 shrink-0" />
                        <h4 className="text-xs font-cinematic font-bold text-white uppercase tracking-wider group-hover:text-cinematic-gold transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-cinematic-textMuted leading-relaxed font-sans">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 3: Director's Quote & Pedigree Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Dark Crimson / Amber Glassmorphic Quote Card (Reference 2 style) */}
            <div className="bg-gradient-to-br from-[#1C1215] via-[#161318] to-[#101217] border border-rose-900/40 p-6 sm:p-8 rounded-sm space-y-5 sm:space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/10 rounded-full blur-2xl pointer-events-none" />

              <div className="text-rose-400/80">
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 rotate-180" />
              </div>

              <blockquote className="font-cinematic text-base sm:text-xl text-white leading-relaxed italic">
                &ldquo;Cinematography is not merely pointing a sensor at a subject — it is an emotional dialogue with light, rhythm, and silence. Every frame must have intent, breath, and truth.&rdquo;
              </blockquote>

              <div className="pt-4 border-t border-rose-900/30 flex items-center justify-between">
                <div>
                  <span className="font-cinematic font-bold text-sm text-white block">
                    Athul Ollur (Athul Kumar)
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-rose-400 font-sans block">
                    Director of Photography & Visual Artist
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full border border-rose-500/30 bg-rose-950/40 flex items-center justify-center text-xs font-bold text-rose-300">
                  AO
                </div>
              </div>
            </div>

            {/* Quick Experience Snapshot */}
            <div className="bg-[#101217] border border-cinematic-border p-5 sm:p-6 rounded-sm space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] text-cinematic-gold font-bold block">
                Current Leadership
              </span>

              <div className="space-y-3">
                <div className="p-3 bg-black/40 border border-cinematic-border/80 rounded-sm">
                  <div className="flex items-center justify-between text-[11px] font-mono text-cinematic-gold">
                    <span>2024 – 2026</span>
                    <span>Kerala, India</span>
                  </div>
                  <h5 className="font-cinematic text-sm font-bold text-white mt-1">
                    Director of Photography (DOP)
                  </h5>
                  <p className="text-xs text-cinematic-textMuted">Skillmount Education</p>
                </div>

                <div className="p-3 bg-black/40 border border-cinematic-border/80 rounded-sm">
                  <div className="flex items-center justify-between text-[11px] font-mono text-cinematic-gold">
                    <span>2023 – 2024</span>
                    <span>Kerala, India</span>
                  </div>
                  <h5 className="font-cinematic text-sm font-bold text-white mt-1">
                    Cinematographer
                  </h5>
                  <p className="text-xs text-cinematic-textMuted">Greenmedia</p>
                </div>
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cinematic-gold hover:text-white transition-colors pt-2 font-semibold min-h-[44px]"
              >
                <span>Read Complete Career Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
