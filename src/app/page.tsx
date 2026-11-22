import React from "react";
import Navigation from "@/components/public/Navigation";
import HeroSection from "@/components/public/HeroSection";
import ServicesSection from "@/components/public/ServicesSection";
import PortfolioSection from "@/components/public/PortfolioSection";
import ShowreelSection from "@/components/public/ShowreelSection";
import AboutSection from "@/components/public/AboutSection";
import ContactSection from "@/components/public/ContactSection";
import Footer from "@/components/public/Footer";
import {
  getSiteSettings,
  getHomepageContent,
  getServices,
  getProjects,
  getShowreel,
  getAboutContent,
} from "@/lib/db";

// Ensure dynamic rendering on content updates
export const revalidate = 0;

export default async function HomePage() {
  const [settings, homepage, services, projects, showreel, about] = await Promise.all([
    getSiteSettings(),
    getHomepageContent(),
    getServices(true),
    getProjects({ onlyPublished: true }),
    getShowreel(),
    getAboutContent(),
  ]);

  return (
    <div className="min-h-screen bg-[#090A0D] text-white flex flex-col justify-between">
      <Navigation settings={settings} />

      <main className="flex-1">
        {/* Cinematic Hero */}
        <HeroSection content={homepage} />

        {/* Services Section */}
        {homepage.show_services && <ServicesSection services={services} />}

        {/* Portfolio Showcase */}
        {homepage.show_portfolio && (
          <PortfolioSection projects={projects} showAllLink={true} />
        )}

        {/* Studio Showreel */}
        {homepage.show_showreel && <ShowreelSection showreel={showreel} />}

        {/* About & Studio Philosophy */}
        {homepage.show_about && <AboutSection about={about} />}

        {/* Contact Inquiry Section */}
        {homepage.show_contact && (
          <ContactSection settings={settings} services={services} />
        )}
      </main>

      <Footer settings={settings} />
    </div>
  );
}
