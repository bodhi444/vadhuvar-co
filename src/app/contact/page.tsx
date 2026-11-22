import React from "react";
import type { Metadata } from "next";
import Navigation from "@/components/public/Navigation";
import ContactSection from "@/components/public/ContactSection";
import Footer from "@/components/public/Footer";
import { getSiteSettings, getServices } from "@/lib/db";

export const metadata: Metadata = {
  title: "Contact — Initiate Production Brief",
  description:
    "Get in touch with FRAME / MOTION to commission a cinematic commercial, luxury wedding film, music video, or documentary.",
};

export const revalidate = 0;

export default async function ContactPage() {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getServices(true),
  ]);

  return (
    <div className="min-h-screen bg-[#090A0D] text-white flex flex-col justify-between">
      <Navigation settings={settings} />

      <main className="flex-1 pt-32 pb-16">
        {/* Editorial Header */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-12 border-b border-cinematic-border/60">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-cinematic-gold font-semibold block">
              Direct Contact
            </span>
            <h1 className="font-cinematic text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase tracking-tight">
              Initiate Production.
            </h1>
            <p className="text-sm sm:text-base text-cinematic-textMuted font-sans leading-relaxed">
              We collaborate with visionary agencies, brands, record labels, and couples across the globe. Let us know what you are creating.
            </p>
          </div>
        </div>

        {/* Contact Form & Direct Channels */}
        <ContactSection settings={settings} services={services} />
      </main>

      <Footer settings={settings} />
    </div>
  );
}
