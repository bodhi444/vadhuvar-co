"use client";

import React from "react";
import Link from "next/link";
import { User, ExternalLink, Bell } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  adminName?: string;
  adminEmail?: string;
}

export default function AdminHeader({
  title,
  subtitle,
  adminName = "Athul Ollur",
  adminEmail = "athul@athulollur.com",
}: AdminHeaderProps) {
  return (
    <header className="h-16 bg-cinematic-surface/90 backdrop-blur-md border-b border-cinematic-border px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-base font-cinematic font-bold text-white tracking-wide">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-cinematic-textDim">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-6">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-2 text-xs text-cinematic-textMuted hover:text-cinematic-gold transition-colors font-medium"
        >
          <span>Preview Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="h-4 w-px bg-cinematic-border hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cinematic-gold/20 border border-cinematic-gold/40 flex items-center justify-center text-cinematic-gold">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-semibold text-white block leading-none">
              {adminName}
            </span>
            <span className="text-[10px] text-cinematic-textDim block mt-0.5">
              {adminEmail}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
