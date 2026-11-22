"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-cinematic-surface border border-cinematic-border p-6 rounded-sm shadow-2xl">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-full shrink-0 ${
              isDanger
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                : "bg-cinematic-gold/10 text-cinematic-gold border border-cinematic-gold/20"
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-lg font-cinematic font-semibold text-white mb-2">
              {title}
            </h3>
            <p className="text-sm text-cinematic-textMuted leading-relaxed mb-6">
              {message}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="px-4 py-2 border border-cinematic-border bg-black/40 text-sm text-white/80 hover:text-white hover:border-white/30 rounded-sm transition-colors"
              >
                {cancelText}
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-semibold rounded-sm transition-all ${
                  isDanger
                    ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30"
                    : "btn-gold"
                } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Processing..." : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
