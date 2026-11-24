"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/Toast";
import { ContactMessage } from "@/types";
import {
  MessageSquare,
  Mail,
  Phone,
  Trash2,
  CheckCircle,
  Eye,
  Loader2,
  X,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function ContactMessagesPage() {
  const { success, error: toastError } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all");

  // Selected message for detail view
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);

  // Deletion modal
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        toastError("Failed to fetch inquiries");
      }
    } catch {
      toastError("Network error loading messages");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (msg: ContactMessage) => {
    try {
      const newStatus = !msg.is_read;
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg.id, is_read: newStatus }),
      });

      if (res.ok) {
        success(`Message marked as ${newStatus ? "read" : "unread"}.`);
        fetchMessages();
        if (activeMessage?.id === msg.id) {
          setActiveMessage({ ...activeMessage, is_read: newStatus });
        }
      }
    } catch {
      toastError("Failed to update message status");
    }
  };

  const handleDelete = async () => {
    if (!messageToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/messages?id=${messageToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success("Inquiry deleted successfully.");
        setMessageToDelete(null);
        if (activeMessage?.id === messageToDelete.id) {
          setActiveMessage(null);
        }
        fetchMessages();
      } else {
        toastError(data.error || "Failed to delete message");
      }
    } catch {
      toastError("Network error deleting inquiry");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openMessageDetail = async (msg: ContactMessage) => {
    setActiveMessage(msg);
    if (!msg.is_read) {
      handleToggleRead(msg);
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filterRead === "unread") return !m.is_read;
    if (filterRead === "read") return m.is_read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="flex min-h-screen bg-cinematic-bg text-white">
      <AdminSidebar unreadMessages={unreadCount} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Contact Inquiries"
          subtitle="Manage client requests, commercial film briefs, and wedding cinematography leads"
        />

        <main className="p-4 sm:p-8 max-w-7xl 2xl:max-w-[1600px] w-full space-y-8 flex-1 overflow-y-auto">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-cinematic-surface border border-cinematic-border p-4 rounded-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-cinematic-textMuted font-semibold">
                Inquiries Inbox ({messages.length})
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cinematic-gold text-black">
                  {unreadCount} Unread
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {(["all", "unread", "read"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterRead(tab)}
                  className={`px-3 py-1 rounded text-xs uppercase tracking-wider font-medium transition-colors ${
                    filterRead === tab
                      ? "bg-cinematic-gold text-black font-semibold"
                      : "bg-black/40 text-cinematic-textMuted border border-cinematic-border hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* List of Inquiries */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-cinematic-textMuted">
              <Loader2 className="w-8 h-8 text-cinematic-gold animate-spin mb-3" />
              <p className="text-sm">Loading client messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-12 text-center bg-cinematic-surface border border-cinematic-border rounded-sm">
              <MessageSquare className="w-10 h-10 text-cinematic-gold mx-auto mb-3 opacity-60" />
              <h3 className="text-sm font-semibold text-white mb-1">No Inquiries Found</h3>
              <p className="text-xs text-cinematic-textDim">
                {filterRead === "unread"
                  ? "All inquiries have been marked as read."
                  : "No messages in inbox yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => openMessageDetail(msg)}
                  className={`p-5 rounded-sm border cursor-pointer transition-all ${
                    !msg.is_read
                      ? "bg-cinematic-surface border-cinematic-gold/40 shadow-lg"
                      : "bg-cinematic-surface/60 border-cinematic-border hover:border-cinematic-gold/30"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-white">
                        {msg.name}
                      </span>
                      {!msg.is_read && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-cinematic-gold text-black">
                          New
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-[10px] bg-black/60 border border-cinematic-border text-cinematic-gold">
                        {msg.service}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-cinematic-textDim">
                      <span>{new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-cinematic-textMuted mb-3">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cinematic-gold" />
                      {msg.email}
                    </span>
                    {msg.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-cinematic-gold" />
                        {msg.phone}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-cinematic-textMuted leading-relaxed line-clamp-2">
                    {msg.message}
                  </p>

                  <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-cinematic-border/60">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleRead(msg);
                      }}
                      className="text-xs text-cinematic-textMuted hover:text-cinematic-gold transition-colors"
                    >
                      Mark as {msg.is_read ? "Unread" : "Read"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMessageToDelete(msg);
                      }}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Message Detail Modal */}
          {activeMessage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
              <div className="bg-cinematic-surface border border-cinematic-border max-w-xl w-full p-6 sm:p-8 rounded-sm shadow-2xl relative">
                <button
                  onClick={() => setActiveMessage(null)}
                  className="absolute top-5 right-5 text-white/50 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-6 pb-4 border-b border-cinematic-border">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-cinematic-gold text-black">
                      {activeMessage.service}
                    </span>
                    <span className="text-xs text-cinematic-textDim">
                      {new Date(activeMessage.created_at).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-cinematic font-bold text-white">
                    {activeMessage.name}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-4 rounded-sm bg-black/40 border border-cinematic-border text-xs">
                  <div>
                    <span className="text-cinematic-textDim block mb-0.5">Email Contact:</span>
                    <a
                      href={`mailto:${activeMessage.email}`}
                      className="text-cinematic-gold hover:underline flex items-center gap-1 font-mono"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {activeMessage.email}
                    </a>
                  </div>

                  {activeMessage.phone && (
                    <div>
                      <span className="text-cinematic-textDim block mb-0.5">Phone Number:</span>
                      <a
                        href={`tel:${activeMessage.phone}`}
                        className="text-white hover:text-cinematic-gold flex items-center gap-1 font-mono"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {activeMessage.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-2 mb-8">
                  <span className="text-xs uppercase tracking-wider text-cinematic-textDim font-medium">
                    Project Brief & Message:
                  </span>
                  <div className="p-4 rounded-sm bg-black/60 border border-cinematic-border text-xs text-cinematic-textMuted leading-relaxed whitespace-pre-wrap">
                    {activeMessage.message}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-cinematic-border">
                  <a
                    href={`mailto:${activeMessage.email}?subject=FRAME%20%2F%20MOTION%20Cinema%20Inquiry%20-%20${encodeURIComponent(
                      activeMessage.service
                    )}`}
                    className="btn-gold text-xs py-2 px-4 flex items-center gap-2"
                  >
                    <Mail className="w-3.5 h-3.5 text-black" />
                    <span>Reply via Email</span>
                  </a>

                  <button
                    onClick={() => {
                      setMessageToDelete(activeMessage);
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Delete Message
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Delete Modal */}
          <ConfirmModal
            isOpen={Boolean(messageToDelete)}
            title="Delete Inquiry"
            message={`Are you sure you want to permanently delete the inquiry from "${messageToDelete?.name}"?`}
            confirmText="Delete Message"
            isLoading={deleteLoading}
            onConfirm={handleDelete}
            onCancel={() => setMessageToDelete(null)}
          />
        </main>
      </div>
    </div>
  );
}
