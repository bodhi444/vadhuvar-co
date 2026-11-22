"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";

interface VideoPlayerProps {
  videoUrl?: string;
  youtubeUrl?: string;
  vimeoUrl?: string;
  posterUrl?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
  title?: string;
}

export default function VideoPlayer({
  videoUrl,
  youtubeUrl,
  vimeoUrl,
  posterUrl,
  autoPlay = false,
  loop = true,
  muted = true,
  controls = true,
  className = "w-full aspect-video rounded-sm overflow-hidden",
  title = "Cinematic Film",
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [hasStarted, setHasStarted] = useState(autoPlay);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Extract YouTube Embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : null;
    } catch {
      return null;
    }
  };

  // Extract Vimeo Embed URL
  const getVimeoEmbedUrl = (url: string) => {
    try {
      const match = url.match(/(?:vimeo\.com\/)(\d+)/);
      return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=1` : null;
    } catch {
      return null;
    }
  };

  const ytEmbed = youtubeUrl ? getYouTubeEmbedUrl(youtubeUrl) : null;
  const vimeoEmbed = vimeoUrl ? getVimeoEmbedUrl(vimeoUrl) : null;

  // If user clicked play on YouTube/Vimeo
  if (hasStarted) {
    if (ytEmbed) {
      return (
        <div className={`relative bg-black ${className}`}>
          <iframe
            src={ytEmbed}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    if (vimeoEmbed) {
      return (
        <div className={`relative bg-black ${className}`}>
          <iframe
            src={vimeoEmbed}
            title={title}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
  }

  // Direct MP4 / WebM video player
  if (videoUrl) {
    const togglePlay = () => {
      if (!videoRef.current) return;
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        setHasStarted(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    const toggleMute = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!videoRef.current) return;
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    };

    const toggleFullscreen = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!videoRef.current) return;
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    };

    return (
      <div
        className={`relative group bg-black cursor-pointer overflow-hidden ${className}`}
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          className="w-full h-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Cinematic Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Center Play Button Overlay when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full border border-cinematic-gold/40 bg-black/60 backdrop-blur-md flex items-center justify-center text-cinematic-gold group-hover:scale-110 group-hover:border-cinematic-gold group-hover:bg-cinematic-gold group-hover:text-black transition-all duration-500 shadow-2xl">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Video Controls Bar */}
        {controls && (
          <div
            className="absolute bottom-0 inset-x-0 p-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto bg-gradient-to-t from-black/90 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-2 text-white/80 hover:text-cinematic-gold transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleMute}
                className="p-2 text-white/80 hover:text-cinematic-gold transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <span className="text-xs uppercase tracking-widest text-white/60 font-medium">
                {title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="p-2 text-white/80 hover:text-cinematic-gold transition-colors"
                aria-label="Fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If only YouTube or Vimeo URL exists with poster: Show custom cinematic poster with play trigger
  if (posterUrl || ytEmbed || vimeoEmbed) {
    return (
      <div
        className={`relative group bg-black cursor-pointer overflow-hidden ${className}`}
        onClick={() => setHasStarted(true)}
      >
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
          />
        ) : (
          <div className="w-full h-full bg-cinematic-surface flex items-center justify-center text-white/40">
            No Poster
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border border-cinematic-gold/40 bg-black/60 backdrop-blur-md flex items-center justify-center text-cinematic-gold group-hover:scale-110 group-hover:border-cinematic-gold group-hover:bg-cinematic-gold group-hover:text-black transition-all duration-500 shadow-2xl">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
        </div>

        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs tracking-widest uppercase text-white/70">
          <span>{title}</span>
          <span className="text-cinematic-gold font-medium">Click to Play Film</span>
        </div>
      </div>
    );
  }

  // Fallback placeholder
  return (
    <div className={`bg-cinematic-surface border border-cinematic-border flex items-center justify-center text-white/40 text-sm ${className}`}>
      Cinematic video unavailable
    </div>
  );
}
