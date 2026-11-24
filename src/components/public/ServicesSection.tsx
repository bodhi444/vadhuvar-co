"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clapperboard, HeartHandshake, Music, Camera, Film } from "lucide-react";
import { Service } from "@/types";

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const activeServices = services.filter((s) => s.is_active);

  const getServiceIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case "hearthandshake":
      case "wedding":
        return HeartHandshake;
      case "clapperboard":
      case "commercial":
        return Clapperboard;
      case "music":
        return Music;
      case "camera":
      case "documentary":
        return Camera;
      default:
        return Film;
    }
  };

  return (
    <section id="services" className="py-20 sm:py-32 bg-[#090A0D] relative select-none">
      {/* Background accents */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cinematic-borderGold/40 to-transparent" />

      <div className="max-w-7xl 2xl:max-w-[1540px] 3xl:max-w-[1760px] mx-auto px-5 sm:px-8 2xl:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4 sm:gap-6">
          <div className="space-y-2 sm:space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-cinematic-gold font-semibold block">
              What We Create
            </span>
            <h2 className="font-cinematic text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl font-bold text-white uppercase tracking-tight">
              Cinematic Disciplines.
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm 2xl:text-base text-cinematic-textMuted font-sans leading-relaxed">
            Every genre demands bespoke visual pacing, intentional optical characteristics, and master audio design. Explore our primary production offerings.
          </p>
        </div>

        {/* 4 Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 2xl:gap-8">
          {activeServices.map((service, index) => {
            const Icon = getServiceIcon(service.icon || service.title);

            return (
              <div
                key={service.id}
                className="group relative bg-[#12141A] border border-cinematic-border hover:border-cinematic-gold/60 rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cinematic-gold/10"
              >
                {/* Image Container with Cinematic Zoom */}
                <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-black">
                  {service.image_url ? (
                    <Image
                      src={service.image_url}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white/30 text-xs">
                      No Media
                    </div>
                  )}

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12141A] via-black/30 to-black/40" />

                  {/* Index / Category Pill */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider bg-black/80 text-cinematic-gold border border-cinematic-borderGold/40 backdrop-blur-md">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 p-2 rounded-full bg-black/60 border border-white/10 text-white/80 group-hover:text-cinematic-gold group-hover:border-cinematic-gold/50 transition-colors backdrop-blur-md">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Text Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-cinematic text-lg sm:text-xl font-bold text-white group-hover:text-cinematic-gold transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-cinematic-textMuted leading-relaxed font-sans line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  {/* Service Detail Link with 44px min-touch height */}
                  <Link
                    href={`/services#${service.slug}`}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-cinematic-gold font-semibold pt-3 border-t border-cinematic-border/60 group-hover:border-cinematic-gold/30 transition-colors min-h-[44px]"
                  >
                    <span>Explore Craft</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
