"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import ApertureIcon from "@/components/shared/ApertureIcon";
import { SiteSettings } from "@/types";

interface NavigationProps {
  settings?: SiteSettings;
}

export default function Navigation({ settings }: NavigationProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when mobile navigation drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Our Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "bg-[#090A0D]/90 backdrop-blur-md py-4 border-b border-cinematic-border/60 shadow-2xl"
            : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <ApertureIcon className="w-7 h-7 text-cinematic-gold group-hover:rotate-45 transition-transform duration-700" />
            <div className="flex flex-col">
              <span className="font-cinematic font-bold tracking-[0.25em] text-sm sm:text-base text-white">
                {settings?.company_name || "ATHUL OLLUR"}
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-cinematic-gold font-sans font-medium">
                {settings?.tagline || "Cinematographer"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.2em] transition-all relative py-1 ${
                    isActive
                      ? "text-cinematic-gold font-semibold"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-cinematic-gold rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Action: Book / Contact */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/contact"
              className="btn-gold text-[11px] py-2.5 px-5 tracking-widest shadow-lg shadow-cinematic-gold/10"
            >
              Get In Touch
            </Link>
          </div>

          {/* Mobile Menu Button (Comfortable 44x44px touch target) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-white hover:text-cinematic-gold transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-[#090A0D]/95 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-8 overflow-y-auto animate-fade-in">
          <div className="flex items-center justify-between border-b border-cinematic-border/60 pb-5">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3"
            >
              <ApertureIcon className="w-7 h-7 text-cinematic-gold" />
              <div className="flex flex-col">
                <span className="font-cinematic font-bold tracking-[0.2em] text-sm text-white">
                  {settings?.company_name || "ATHUL OLLUR"}
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-cinematic-gold font-sans font-medium">
                  {settings?.tagline || "Cinematographer"}
                </span>
              </div>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-white/70 hover:text-white"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col space-y-5 my-auto py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-cinematic text-2xl sm:text-3xl tracking-widest uppercase transition-colors py-1 ${
                  pathname === link.href ? "text-cinematic-gold font-bold" : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-cinematic-border/60 pt-5 space-y-4">
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-gold w-full text-center py-3.5 text-xs tracking-widest flex items-center justify-center"
            >
              Start A Project
            </Link>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cinematic-textDim pt-1 text-center sm:text-left">
              <Link href="/admin/login" className="hover:text-cinematic-gold py-1">
                Studio Admin Portal →
              </Link>
              <span className="font-mono text-white/70">{settings?.phone || "+91 98476 10569"}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
