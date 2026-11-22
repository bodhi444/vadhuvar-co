"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Film, Image as ImageIcon, Loader2, Check, AlertCircle } from "lucide-react";
import { MediaAsset } from "@/types";

interface MediaUploaderProps {
  onUploadSuccess: (url: string, asset: MediaAsset) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  currentValue?: string;
  fileType?: "all" | "image" | "video";
}

export default function MediaUploader({
  onUploadSuccess,
  accept = "image/*,video/mp4,video/webm",
  maxSizeMB = 100,
  label = "Upload Image or Video",
  currentValue,
  fileType = "all",
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentValue || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = (file: File) => {
    setErrorMsg(null);

    // Validate type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (fileType === "image" && !isImage) {
      setErrorMsg("Please select an image file (JPG, PNG, WebP, SVG).");
      return;
    }

    if (fileType === "video" && !isVideo) {
      setErrorMsg("Please select a video file (MP4, WebM).");
      return;
    }

    // Validate size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMsg(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds limit of ${maxSizeMB}MB.`);
      return;
    }

    setIsUploading(true);
    setProgress(10);

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 90);
        setProgress(pct);
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      setProgress(100);

      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status === 200 && res.success) {
          setPreviewUrl(res.url);
          onUploadSuccess(res.url, res.asset);
        } else {
          setErrorMsg(res.error || "Upload failed");
        }
      } catch {
        setErrorMsg("Failed to parse server response");
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setErrorMsg("Network error occurred during upload");
    };

    xhr.send(formData);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs uppercase tracking-wider text-cinematic-textMuted font-medium">
          {label}
        </label>
        {currentValue && (
          <span className="text-[11px] text-cinematic-gold truncate max-w-xs">
            {currentValue}
          </span>
        )}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-sm p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-cinematic-gold bg-cinematic-gold/10"
            : "border-cinematic-border hover:border-cinematic-gold/60 bg-black/40 hover:bg-cinematic-surface"
        } ${isUploading ? "pointer-events-none opacity-80" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Current Preview */}
        {previewUrl && !isUploading && (
          <div className="mb-4 relative w-full h-36 rounded-sm overflow-hidden border border-cinematic-border bg-black group/preview">
            {previewUrl.match(/\.(mp4|webm)$/i) ? (
              <video src={previewUrl} className="w-full h-full object-cover" muted autoPlay loop />
            ) : (
              <Image src={previewUrl} alt="Uploaded preview" fill className="object-cover" />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center transition-opacity text-xs font-medium text-white tracking-wider uppercase">
              Click to Replace Asset
            </div>
          </div>
        )}

        {isUploading ? (
          <div className="w-full max-w-xs flex flex-col items-center py-4">
            <Loader2 className="w-8 h-8 text-cinematic-gold animate-spin mb-3" />
            <div className="w-full bg-cinematic-border h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-cinematic-gold h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-cinematic-textMuted font-mono">
              Uploading {progress}%
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-cinematic-surface border border-cinematic-border flex items-center justify-center text-cinematic-gold mb-3">
              {fileType === "video" ? (
                <Film className="w-6 h-6" />
              ) : fileType === "image" ? (
                <ImageIcon className="w-6 h-6" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>
            <p className="text-sm font-medium text-white mb-1">
              Drag & drop or <span className="text-cinematic-gold underline">browse file</span>
            </p>
            <p className="text-xs text-cinematic-textDim">
              {fileType === "video"
                ? "MP4 or WebM (Max 100MB)"
                : fileType === "image"
                ? "JPG, PNG, WebP or SVG (Max 25MB)"
                : "Images (25MB) or Videos (100MB)"}
            </p>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="mt-2 flex items-center gap-2 text-xs text-red-400 bg-red-950/30 border border-red-900/50 p-2 rounded-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
