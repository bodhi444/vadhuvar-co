"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, Sparkles } from "lucide-react";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { Showreel } from "@/types";

interface ShowreelSectionProps {
  showreel: Showreel;
}

export default function ShowreelSection({ showreel }: ShowreelSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!showreel.is_active) return null;

  return (
    <section className="py-20 sm:py-32 bg-[#090A0D] relative select-none">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Headline */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-2 sm:space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-cinematic-gold font-semibold block">
            Motion Reel
          </span>
          <h2 className="font-cinematic text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">
            The Studio Showreel.
          </h2>
          <p className="text-xs sm:text-sm text-cinematic-textMuted font-sans max-w-xl mx-auto leading-relaxed">
            A montage of high-speed cinematography, anamorphic lens flares, and emotional human portraits documented worldwide.
          </p>
        </div>

        {/* Cinematic Widescreen Theater Frame - Responsive Aspect Ratio */}
        <div className="relative rounded-sm overflow-hidden border border-cinematic-border shadow-2xl bg-black">
          <VideoPlayer
            title={showreel.title}
            videoUrl={showreel.video_url}
            youtubeUrl={showreel.youtube_url}
            vimeoUrl={showreel.vimeo_url}
            posterUrl={showreel.poster_url || "/works/hero/hero-2.jpg"}
            autoPlay={false}
            className="w-full aspect-video sm:aspect-[21/9] min-h-[220px] sm:min-h-[360px]"
          />
        </div>
      </div>
    </section>
  );
}
