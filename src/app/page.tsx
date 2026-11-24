import React from "react";
import Navigation from "@/components/public/Navigation";
import HeroSection from "@/components/public/HeroSection";
import PortfolioSection from "@/components/public/PortfolioSection";
import ProcessAndPedigree from "@/components/public/ProcessAndPedigree";
import ShowreelSection from "@/components/public/ShowreelSection";
import AboutSection from "@/components/public/AboutSection";
import ContactSection from "@/components/public/ContactSection";
import Footer from "@/components/public/Footer";
import {
  getSiteSettings,
  getHomepageContent,
  getProjects,
  getShowreel,
  getAboutContent,
} from "@/lib/db";

// Ensure dynamic rendering on content updates
export const revalidate = 0;

export default async function HomePage() {
  const [settings, homepage, projects, showreel, about] = await Promise.all([
    getSiteSettings(),
    getHomepageContent(),
    getProjects({ onlyPublished: true }),
    getShowreel(),
    getAboutContent(),
  ]);

  return (
    <div className="min-h-screen bg-[#090A0D] text-white flex flex-col justify-between">
      <Navigation settings={settings} />

      <main className="flex-1">
        {/* Profile-Centric Hero (Inspired by User References) */}
        <HeroSection content={homepage} about={about} settings={settings} />

        {/* Portfolio Showcase */}
        {homepage.show_portfolio && (
          <PortfolioSection projects={projects} showAllLink={true} />
        )}

        {/* Education, Process & Pedigree Matrix (Inspired by Reference 2) */}
        <ProcessAndPedigree about={about} />

        {/* Studio Showreel */}
        {homepage.show_showreel && <ShowreelSection showreel={showreel} />}

        {/* About & Studio Philosophy */}
        {homepage.show_about && <AboutSection about={about} />}

        {/* Contact Inquiry Section ("Let's Work Together") */}
        {homepage.show_contact && (
          <ContactSection settings={settings} />
        )}
      </main>

      <Footer settings={settings} />
    </div>
  );
}
