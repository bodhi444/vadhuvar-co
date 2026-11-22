import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/public/Navigation";
import Footer from "@/components/public/Footer";
import { getServices, getSiteSettings } from "@/lib/db";
import {
  ArrowRight,
  CheckCircle2,
  Film,
  Camera,
  Layers,
  Sparkles,
  HeartHandshake,
  Clapperboard,
  Music,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services — Cinematic Production Disciplines",
  description:
    "Explore our specialized video production services: luxury wedding films, commercial brand ads, music videos, and documentaries.",
};

export const revalidate = 0;

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([
    getServices(true),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-[#090A0D] text-white flex flex-col justify-between">
      <Navigation settings={settings} />

      <main className="flex-1 pt-32 pb-24">
        {/* Editorial Header */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-16 border-b border-cinematic-border/60">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-cinematic-gold font-semibold block">
              Studio Offerings
            </span>
            <h1 className="font-cinematic text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase tracking-tight">
              Production Disciplines.
            </h1>
            <p className="text-sm sm:text-base text-cinematic-textMuted font-sans leading-relaxed">
              We operate across diverse storytelling mediums, tailoring camera packages, anamorphic lens optics, and sound design to each distinct vision.
            </p>
          </div>
        </div>

        {/* Detailed Service Cards */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 space-y-24">
          {services.map((service, idx) => {
            const isReversed = idx % 2 === 1;

            return (
              <div
                key={service.id}
                id={service.slug}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center ${
                  isReversed ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Media Column */}
                <div
                  className={`lg:col-span-6 relative aspect-[16/10] rounded-sm overflow-hidden border border-cinematic-border bg-black shadow-2xl group ${
                    isReversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <Image
                    src={service.image_url}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded text-xs font-mono font-bold tracking-widest bg-black/80 text-cinematic-gold border border-cinematic-borderGold/40 backdrop-blur-md">
                      Discipline 0{idx + 1}
                    </span>
                  </div>
                </div>

                {/* Content Column */}
                <div
                  className={`lg:col-span-6 space-y-6 ${
                    isReversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-widest text-cinematic-gold font-semibold">
                      Production Offering
                    </span>
                    <h2 className="font-cinematic text-3xl sm:text-4xl font-bold text-white uppercase tracking-tight">
                      {service.title}
                    </h2>
                  </div>

                  <p className="text-sm sm:text-base text-cinematic-gold/90 font-medium leading-relaxed font-sans">
                    {service.description}
                  </p>

                  <p className="text-xs sm:text-sm text-cinematic-textMuted leading-relaxed font-sans whitespace-pre-wrap">
                    {service.full_description || service.description}
                  </p>

                  {/* Standard Inclusions */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs uppercase tracking-wider text-white font-semibold block mb-2">
                      What Every Production Includes:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-cinematic-textMuted font-sans">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cinematic-gold shrink-0" />
                        <span>Large Format / Anamorphic Glass</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cinematic-gold shrink-0" />
                        <span>DaVinci Resolve 35mm Color Master</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cinematic-gold shrink-0" />
                        <span>Bespoke Original Audio Design</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cinematic-gold shrink-0" />
                        <span>Licensed 4K/8K Deliverables</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link
                      href={`/contact?service=${encodeURIComponent(service.title)}`}
                      className="btn-gold text-xs py-3.5 px-6 tracking-[0.2em] inline-flex items-center gap-2"
                    >
                      <span>Inquire for {service.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-black" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Production Workflow Callout */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-16 pt-16 border-t border-cinematic-border/60">
          <div className="bg-[#12141A] border border-cinematic-border p-8 sm:p-12 rounded-sm text-center max-w-4xl mx-auto space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-cinematic-gold font-semibold block">
              Global Availability
            </span>
            <h3 className="font-cinematic text-3xl font-bold text-white uppercase">
              International Travel & Production Crews
            </h3>
            <p className="text-xs sm:text-sm text-cinematic-textMuted leading-relaxed max-w-2xl mx-auto font-sans">
              Based in Los Angeles with secondary crews deployed in Tokyo, Paris, and Lake Como. We manage all carnets, customs, drone permissions, and overseas logistics.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="btn-outline-gold text-xs py-3 px-8 tracking-[0.2em]"
              >
                Connect With Production Manager
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
