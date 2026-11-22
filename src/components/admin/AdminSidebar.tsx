"use client";

import React from "react";
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
} from "lucide-react";
import ApertureIcon from "@/components/shared/ApertureIcon";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Manage Homepage", href: "/admin/homepage", icon: Home },
  { label: "Manage Services", href: "/admin/services", icon: Sparkles },
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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  return (
    <aside className="w-64 shrink-0 bg-cinematic-surface border-r border-cinematic-border min-h-screen flex flex-col justify-between select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-cinematic-border">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
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
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-medium tracking-wide transition-all ${
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
          className="flex items-center justify-between w-full px-3.5 py-2 rounded-sm text-xs text-cinematic-textMuted hover:text-white hover:bg-white/5 transition-colors"
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
          className="flex items-center gap-2 w-full px-3.5 py-2 rounded-sm text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out Session</span>
        </button>
      </div>
    </aside>
  );
}
