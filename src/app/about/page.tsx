import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/public/Navigation";
import Footer from "@/components/public/Footer";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { getAboutContent, getSiteSettings } from "@/lib/db";
import { ArrowUpRight, Award, Briefcase, Calendar, CheckCircle2, Compass, Download, Film, GraduationCap, MapPin, Palette } from "lucide-react";

export const metadata: Metadata = {
  title: "About Athul Ollur (Athul Kumar) — Cinematographer & Visual Artist",
  description:
    "Curriculum Vitae, career experience, fine arts education, and cinematography philosophy of Athul Ollur (Athul Kumar).",
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] text-cinematic-gold font-semibold block">
                Curriculum Vitae & Artistic Story
              </span>
              <h1 className="font-cinematic text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase tracking-tight leading-tight">
                {about.heading}
              </h1>
              <p className="text-sm sm:text-base text-cinematic-gold font-medium font-sans leading-relaxed">
                {about.intro}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={about.cv_url || "/athul-ollur-cv.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-xs py-3.5 px-6 tracking-[0.18em] flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download CV (PDF)</span>
              </a>

              <Link
                href="/contact"
                className="btn-outline-gold text-xs py-3.5 px-6 tracking-[0.18em]"
              >
                Book For Production
              </Link>
            </div>
          </div>
        </div>

        {/* Studio Stills & Founding Narrative */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Image */}
            <div className="lg:col-span-5 relative aspect-[4/5] rounded-sm overflow-hidden border border-cinematic-border bg-black shadow-2xl">
              <Image
                src={about.image_url || "/athul-ollur.jpg"}
                alt="Athul Ollur (Athul Kumar) — Cinematographer & Film Director"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            </div>

            {/* Right Story */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.2em] text-cinematic-gold font-semibold block">
                Artistic Foundation
              </span>
              <h2 className="font-cinematic text-2xl sm:text-3xl font-bold text-white uppercase">
                From Fine Art Canvas to the Motion Picture Lens.
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

        {/* CAREER EXPERIENCE TIMELINE */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 border-t border-cinematic-border/60">
          <div className="space-y-3 mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-cinematic-gold font-semibold block">
              Professional Timeline
            </span>
            <h2 className="font-cinematic text-3xl sm:text-4xl font-bold text-white uppercase">
              Career Experience
            </h2>
            <p className="text-xs sm:text-sm text-cinematic-textMuted max-w-2xl font-sans">
              A decade of visual leadership spanning high-tier video production houses, commercial agencies, independent film direction, and fine arts commissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {about.experience && about.experience.length > 0 ? (
              about.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="bg-[#12141A] border border-cinematic-border hover:border-cinematic-gold/60 p-6 sm:p-8 rounded-sm space-y-4 transition-all duration-300 relative group"
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cinematic-gold/10 border border-cinematic-gold/30 text-cinematic-gold uppercase tracking-wider rounded-sm text-[11px]">
                      <Calendar className="w-3 h-3" />
                      {exp.period}
                    </span>
                    {exp.location && (
                      <span className="text-[11px] text-cinematic-textDim font-sans flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cinematic-gold/70" />
                        {exp.location}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-cinematic text-xl sm:text-2xl font-bold text-white group-hover:text-cinematic-gold transition-colors uppercase">
                      {exp.role}
                    </h3>
                    <span className="text-xs uppercase tracking-wider text-cinematic-gold font-semibold block mt-1">
                      {exp.company}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-xs sm:text-sm text-cinematic-textMuted leading-relaxed font-sans">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))
            ) : null}
          </div>
        </div>

        {/* EDUCATION & ACADEMIC CREDENTIALS */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 border-t border-cinematic-border/60">
          <div className="space-y-3 mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-cinematic-gold font-semibold block">
              Academic Background
            </span>
            <h2 className="font-cinematic text-3xl sm:text-4xl font-bold text-white uppercase">
              Education & Fine Arts Pedigree
            </h2>
            <p className="text-xs sm:text-sm text-cinematic-textMuted max-w-2xl font-sans">
              Formally educated at Kerala&apos;s most renowned institution for fine arts, providing a solid theoretical and practical foundation in color, composition, and human anatomy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {about.education && about.education.length > 0 ? (
              about.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-[#12141A] border border-cinematic-border p-6 rounded-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <GraduationCap className="w-5 h-5 text-cinematic-gold" />
                    <span className="text-xs font-mono text-cinematic-gold/80 px-2 py-0.5 bg-cinematic-gold/10 rounded">
                      {edu.year}
                    </span>
                  </div>

                  <h3 className="font-cinematic text-lg font-bold text-white uppercase leading-snug">
                    {edu.degree}
                  </h3>

                  <p className="text-xs text-white/90 font-medium font-sans">
                    {edu.institution}
                  </p>

                  {edu.boardOrUniversity && (
                    <p className="text-[11px] uppercase tracking-wider text-cinematic-gold/80 font-sans">
                      {edu.boardOrUniversity}
                    </p>
                  )}

                  {edu.details && (
                    <p className="text-xs text-cinematic-textMuted pt-2 border-t border-cinematic-border/60 font-sans leading-relaxed">
                      {edu.details}
                    </p>
                  )}
                </div>
              ))
            ) : null}
          </div>
        </div>

        {/* SKILLS & SOFTWARE TOOLS MATRIX */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 border-t border-cinematic-border/60">
          <div className="space-y-3 mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-cinematic-gold font-semibold block">
              Expertise & Tools
            </span>
            <h2 className="font-cinematic text-3xl sm:text-4xl font-bold text-white uppercase">
              Disciplines & Technical Craft
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {about.skills_categories && about.skills_categories.length > 0 ? (
              about.skills_categories.map((cat, idx) => (
                <div
                  key={idx}
                  className="bg-[#12141A] border border-cinematic-border p-6 rounded-sm space-y-4"
                >
                  <span className="text-xs uppercase tracking-wider text-cinematic-gold font-bold block pb-2 border-b border-cinematic-border/60">
                    {cat.title}
                  </span>
                  <ul className="space-y-2">
                    {cat.items.map((skill, sIdx) => (
                      <li
                        key={sIdx}
                        className="text-xs text-cinematic-textMuted flex items-center gap-2 font-sans"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-cinematic-gold shrink-0" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : null}
          </div>
        </div>

        {/* Philosophy & Approach Grid */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 border-t border-cinematic-border/60">
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
              Available for commercials, wedding films, documentaries, and creative visual direction across India and internationally.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="btn-gold text-xs py-3.5 px-8 tracking-[0.2em]"
              >
                Initiate Project Brief
              </Link>

              <a
                href={about.cv_url || "/athul-ollur-cv.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold text-xs py-3.5 px-8 tracking-[0.2em] flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CV</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
