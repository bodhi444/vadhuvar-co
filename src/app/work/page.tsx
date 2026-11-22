import React from "react";
import type { Metadata } from "next";
import Navigation from "@/components/public/Navigation";
import PortfolioSection from "@/components/public/PortfolioSection";
import Footer from "@/components/public/Footer";
import { getProjects, getSiteSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "Our Work — Filmography & Portfolio",
  description:
    "Explore our complete cinematic archive of commercial ads, luxury wedding films, music videos, and feature documentaries.",
};

export const revalidate = 0;

export default async function WorkPage() {
  const [projects, settings] = await Promise.all([
    getProjects({ onlyPublished: true }),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-[#090A0D] text-white flex flex-col justify-between">
      <Navigation settings={settings} />

      <main className="flex-1 pt-32">
        {/* Editorial Page Header */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-12 border-b border-cinematic-border/60">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-cinematic-gold font-semibold block">
              Complete Archive
            </span>
            <h1 className="font-cinematic text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase tracking-tight">
              Films & Selected Works.
            </h1>
            <p className="text-sm sm:text-base text-cinematic-textMuted font-sans leading-relaxed">
              Every production is a bespoke study in human truth, optical character, and atmospheric lighting. Filter by discipline or watch individual films below.
            </p>
          </div>
        </div>

        {/* Gallery */}
        <PortfolioSection projects={projects} showAllLink={false} />
      </main>

      <Footer settings={settings} />
    </div>
  );
}
