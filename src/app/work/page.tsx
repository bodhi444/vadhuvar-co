import React from "react";
import type { Metadata } from "next";
import Navigation from "@/components/public/Navigation";
import PortfolioSection from "@/components/public/PortfolioSection";
import Footer from "@/components/public/Footer";
import { getProjects, getSiteSettings } from "@/lib/db";
import { ProjectCategory } from "@/types";

export const metadata: Metadata = {
  title: "Selected Films & Works",
  description:
    "Explore the cinematic archive of Athul Ollur — commercial campaigns, concert videos, executive podcasts, and fine art installations.",
};

export const revalidate = 0;

export default async function WorkPage({
  searchParams,
}: {
  searchParams?: Promise<{ cat?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  let initialCategory: string = "All";
  if (resolvedSearchParams?.cat) {
    const rawCat = resolvedSearchParams.cat;
    if (rawCat.toLowerCase() === "music video") {
      initialCategory = "Concert Video";
    } else if (rawCat.toLowerCase() === "documentary" || rawCat.toLowerCase() === "portcast") {
      initialCategory = "Podcast";
    } else {
      initialCategory = rawCat;
    }
  }

  const [projects, settings] = await Promise.all([
    getProjects({ onlyPublished: true }),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-[#090A0D] text-white flex flex-col justify-between">
      <Navigation settings={settings} />

      <main className="flex-1 pt-28 sm:pt-32">
        {/* Editorial Page Header */}
        <div className="max-w-7xl 2xl:max-w-[1540px] 3xl:max-w-[1760px] mx-auto px-5 sm:px-8 2xl:px-12 pb-10 sm:pb-12 border-b border-cinematic-border/60">
          <div className="max-w-3xl 2xl:max-w-4xl space-y-3 sm:space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-cinematic-gold font-semibold block">
              Complete Archive
            </span>
            <h1 className="font-cinematic text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-bold text-white uppercase tracking-tight">
              Films & Selected Works.
            </h1>
            <p className="text-xs sm:text-base 2xl:text-lg text-cinematic-textMuted font-sans leading-relaxed">
              Every production is a bespoke study in human truth, optical character, and atmospheric lighting. Filter by discipline or watch individual films below.
            </p>
          </div>
        </div>

        {/* Gallery */}
        <PortfolioSection projects={projects} showAllLink={false} initialCategory={initialCategory} />
      </main>

      <Footer settings={settings} />
    </div>
  );
}
