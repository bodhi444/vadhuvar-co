"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Sparkles,
  Film,
  PlaySquare,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import ApertureIcon from "@/components/shared/ApertureIcon";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Manage Homepage", href: "/admin/homepage", icon: Home },
  { label: "Manage Portfolio", href: "/admin/portfolio", icon: Film },
  { label: "Manage Showreel", href: "/admin/showreel", icon: PlaySquare },
  { label: "Manage About", href: "/admin/about", icon: FileText },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { label: "Contact Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Website Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ unreadMessages = 0 }: { unreadMessages?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Close drawer on path navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  const SidebarContent = () => (
    <>
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-cinematic-border flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 group"
          >
            <ApertureIcon className="w-7 h-7 text-cinematic-gold group-hover:rotate-45 transition-transform duration-500" />
            <div>
              <span className="font-cinematic font-bold tracking-widest text-sm text-white block">
                ATHUL OLLUR
              </span>
              <span className="text-[10px] uppercase tracking-wider text-cinematic-gold/80 block">
                Portfolio CMS
              </span>
            </div>
          </Link>

          {/* Close button visible only inside mobile drawer */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1.5 text-white/60 hover:text-white rounded"
            aria-label="Close Admin Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-medium tracking-wide transition-all min-h-[44px] ${
                  isActive
                    ? "bg-cinematic-gold text-cinematic-bg font-semibold shadow-lg shadow-cinematic-gold/20"
                    : "text-cinematic-textMuted hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-cinematic-bg" : "text-cinematic-gold"}`} />
                  <span>{item.label}</span>
                </div>

                {item.href === "/admin/messages" && unreadMessages > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isActive ? "bg-black text-cinematic-gold" : "bg-cinematic-gold text-black"
                    }`}
                  >
                    {unreadMessages}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-cinematic-border space-y-2">
        <Link
          href="/"
          target="_blank"
          onClick={() => setIsOpen(false)}
          className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-sm text-xs text-cinematic-textMuted hover:text-white hover:bg-white/5 transition-colors min-h-[44px]"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-cinematic-gold" />
            View Live Studio
          </span>
          <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-mono">
            Online
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3.5 py-2.5 rounded-sm text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors min-h-[44px]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out Session</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-3 left-3 z-40 p-2 rounded bg-[#12141A] border border-cinematic-gold/40 text-cinematic-gold shadow-xl min-w-[40px] min-h-[40px] flex items-center justify-center hover:bg-cinematic-surface transition-colors"
        aria-label="Open Admin Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Off-canvas Drawer */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`md:hidden fixed inset-y-0 left-0 w-72 z-50 bg-[#0C0E14] border-r border-cinematic-border flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out select-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-cinematic-surface border-r border-cinematic-border min-h-screen flex-col justify-between select-none">
        <SidebarContent />
      </aside>
    </>
  );
}
