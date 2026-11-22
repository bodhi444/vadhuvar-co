"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Play, Sparkles } from "lucide-react";
import { HomepageContent } from "@/types";

interface HeroSectionProps {
  content: HomepageContent;
}

export default function HeroSection({ content }: HeroSectionProps) {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const scrollToWorks = () => {
    const el = document.getElementById("works") || document.getElementById("services");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-black select-none">
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full">
        {content.hero_video_url && !videoError ? (
          <video
            ref={videoRef}
            src={content.hero_video_url}
            poster={content.hero_image_fallback}
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
        ) : (
          <Image
            src={content.hero_image_fallback || "/works/hero/hero-1.jpg"}
            alt="FRAME / MOTION Cinematic Production"
            fill
            priority
            sizes="100vw"
            className="object-cover scale-105 animate-slow-zoom"
          />
        )}

        {/* Cinematic Multi-Layer Dark Gradient & Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0D] via-black/55 to-black/75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,10,13,0.85)_100%)]" />
      </div>

      {/* Hero Typography & Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center space-y-6 pt-16">
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-cinematic-gold/30 text-cinematic-gold text-[11px] font-medium tracking-[0.25em] uppercase backdrop-blur-md animate-fade-in shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-cinematic-gold" />
          <span>Cinematic Film Studio</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-cinematic text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-[1.05] drop-shadow-2xl">
          {content.hero_heading.split("THROUGH THE LENS")[0]}
          {content.hero_heading.includes("THROUGH THE LENS") && (
            <span className="text-gold-gradient block mt-1">
              THROUGH THE LENS.
            </span>
          )}
        </h1>

        {/* Subheading */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-cinematic-textMuted font-sans font-light leading-relaxed tracking-wide drop-shadow-md">
          {content.hero_subheading}
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link
            href={content.cta_primary_link || "/work"}
            className="btn-gold w-full sm:w-auto text-xs py-3.5 px-8 tracking-[0.2em] shadow-xl shadow-cinematic-gold/20"
          >
            {content.cta_primary_text || "EXPLORE OUR WORK"}
          </Link>

          <Link
            href={content.cta_secondary_link || "/contact"}
            className="btn-outline-gold w-full sm:w-auto text-xs py-3.5 px-8 tracking-[0.2em]"
          >
            {content.cta_secondary_text || "CONTACT US"}
          </Link>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div
        onClick={scrollToWorks}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50 hover:text-cinematic-gold cursor-pointer transition-colors group"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-mono font-medium">
          Scroll
        </span>
        <div className="w-5 h-9 rounded-full border border-white/20 group-hover:border-cinematic-gold flex items-start justify-center p-1 transition-colors">
          <div className="w-1 h-2 rounded-full bg-cinematic-gold animate-bounce" />
        </div>
      </div>
    </section>
  );
}
