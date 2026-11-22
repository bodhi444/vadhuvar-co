"use client";

import React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import ApertureIcon from "@/components/shared/ApertureIcon";
import { SiteSettings } from "@/types";

interface FooterProps {
  settings?: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#060709] border-t border-cinematic-border/80 text-white select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-16 border-b border-cinematic-border/60">
          {/* Column 1: Brand & Aperture */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <ApertureIcon className="w-8 h-8 text-cinematic-gold group-hover:rotate-45 transition-transform duration-700" />
              <div>
                <span className="font-cinematic font-bold tracking-[0.25em] text-base text-white block">
                  {settings?.company_name || "ATHUL OLLUR"}
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-cinematic-gold font-sans block">
                  {settings?.tagline || "Cinematographer & Filmmaker"}
                </span>
              </div>
            </Link>

            <p className="text-xs text-cinematic-textMuted leading-relaxed max-w-sm font-sans pt-2">
              Official portfolio of Athul Ollur — Cinematographer & Director crafting evocative commercial films, luxury wedding epics, and visual stories worldwide.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#12141A] border border-cinematic-border hover:border-cinematic-gold text-cinematic-textMuted hover:text-cinematic-gold flex items-center justify-center transition-colors"
                  aria-label="Instagram Profile"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
              )}
              {settings?.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#12141A] border border-cinematic-border hover:border-cinematic-gold text-cinematic-textMuted hover:text-cinematic-gold flex items-center justify-center transition-colors"
                  aria-label="YouTube Channel"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                    <polygon points="10 15 15 12 10 9 10 15"/>
                  </svg>
                </a>
              )}
              {settings?.vimeo_url && (
                <a
                  href={settings.vimeo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#12141A] border border-cinematic-border hover:border-cinematic-gold text-cinematic-textMuted hover:text-cinematic-gold flex items-center justify-center transition-colors text-xs font-bold font-mono"
                  aria-label="Vimeo Portfolio"
                >
                  V
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-cinematic-gold font-semibold block">
              Studio
            </span>
            <ul className="space-y-2 text-xs font-sans text-cinematic-textMuted">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/work" className="hover:text-white transition-colors">
                  Filmography & Work
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Production Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Studio Manifesto
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Disciplines */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-cinematic-gold font-semibold block">
              Disciplines
            </span>
            <ul className="space-y-2 text-xs font-sans text-cinematic-textMuted">
              <li>
                <Link href="/work?cat=Wedding" className="hover:text-white transition-colors">
                  Wedding Films
                </Link>
              </li>
              <li>
                <Link href="/work?cat=Commercial" className="hover:text-white transition-colors">
                  Commercial Advertising
                </Link>
              </li>
              <li>
                <Link href="/work?cat=Music%20Video" className="hover:text-white transition-colors">
                  Music Videos
                </Link>
              </li>
              <li>
                <Link href="/work?cat=Documentary" className="hover:text-white transition-colors">
                  Documentaries
                </Link>
              </li>
              <li>
                <Link href="/work?cat=Photography" className="hover:text-white transition-colors">
                  Editorial Photography
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Operations */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-cinematic-gold font-semibold block">
              Operations
            </span>
            <div className="space-y-2 text-xs font-sans text-cinematic-textMuted">
              <p>{settings?.address || "Studio 4, Film District, Los Angeles, CA"}</p>
              <p className="font-mono text-white/90">{settings?.email || "contact@framemotion.studio"}</p>
              <p className="font-mono text-white/90">{settings?.phone || "+1 (555) 839-2041"}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cinematic-textDim font-sans">
          <p>© {currentYear} ATHUL OLLUR. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 text-cinematic-textDim hover:text-cinematic-gold transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Studio CMS Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
