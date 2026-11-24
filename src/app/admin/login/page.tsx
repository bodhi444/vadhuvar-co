"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import ApertureIcon from "@/components/shared/ApertureIcon";
import { useToast } from "@/components/admin/Toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState("admin@framemotion.com");
  const [password, setPassword] = useState("cinematic2025!");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        success("Authentication successful. Opening Studio CMS...");
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setErrorMessage(data.error || "Authentication failed. Invalid credentials.");
        toastError(data.error || "Authentication failed");
      }
    } catch {
      setErrorMessage("Unable to connect to authentication service.");
      toastError("Network connection error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setForgotLoading(true);
    setForgotSuccessMsg(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      setForgotSuccessMsg(data.message || "Password recovery instructions logged.");
    } catch {
      toastError("Failed to request password reset.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cinematic-bg flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none">
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cinematic-gold/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-950/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-cinematic-surface border border-cinematic-borderGold/40 mb-4 shadow-xl">
            <ApertureIcon className="w-8 h-8 text-cinematic-gold" />
          </div>
          <h1 className="font-cinematic text-2xl font-bold tracking-widest text-white">
            ATHUL OLLUR
          </h1>
          <p className="text-xs uppercase tracking-widest text-cinematic-gold mt-1">
            Portfolio CMS Administration
          </p>
          <p className="text-xs text-cinematic-textDim mt-2">
            Secure editorial portal for films, photography, inquiries & content
          </p>
        </div>

        {/* Card */}
        <div className="bg-cinematic-surface border border-cinematic-border p-6 sm:p-8 rounded-sm shadow-2xl backdrop-blur-xl">
          {errorMessage && (
            <div className="mb-6 p-3 rounded-sm bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-cinematic-textMuted mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@framemotion.com"
                  className="w-full bg-black/60 border border-cinematic-border text-white text-base sm:text-sm px-4 py-3 pl-11 rounded-sm focus:outline-none focus:border-cinematic-gold transition-colors font-sans"
                />
                <Mail className="w-4 h-4 text-cinematic-textDim absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wider font-medium text-cinematic-textMuted">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-cinematic-gold hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-black/60 border border-cinematic-border text-white text-base sm:text-sm px-4 py-3 pl-11 pr-11 rounded-sm focus:outline-none focus:border-cinematic-gold transition-colors font-sans"
                />
                <Lock className="w-4 h-4 text-cinematic-textDim absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cinematic-textDim hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Session */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-cinematic-border bg-black/60 text-cinematic-gold focus:ring-0 focus:ring-offset-0 accent-[#C9A35E]"
                />
                <span className="text-xs text-cinematic-textMuted">Remember this device (30 days)</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gold py-3.5 mt-2 flex items-center justify-center gap-2 shadow-lg shadow-cinematic-gold/10"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Authorizing Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Studio CMS</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </form>

          {/* Quick Setup Hint */}
          <div className="mt-8 pt-6 border-t border-cinematic-border/60 text-center">
            <p className="text-[11px] text-cinematic-textDim">
              Default administrator access:
            </p>
            <p className="text-[11px] font-mono text-cinematic-gold mt-1 bg-black/40 py-1 px-2 rounded border border-cinematic-border/40 inline-block">
              athul@athulollur.com or admin@framemotion.com / cinematic2025!
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="text-xs text-cinematic-textMuted hover:text-cinematic-gold transition-colors"
          >
            ← Return to Athul Ollur Portfolio
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-cinematic-surface border border-cinematic-border max-w-sm w-full p-6 rounded-sm shadow-2xl relative">
            <h3 className="text-base font-cinematic font-bold text-white mb-1 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cinematic-gold" />
              Password Recovery
            </h3>
            <p className="text-xs text-cinematic-textMuted mb-4">
              Enter your registered administrator email to verify studio identity.
            </p>

            {forgotSuccessMsg ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-sm text-xs text-emerald-300 flex items-start gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>{forgotSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-cinematic-textMuted block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="admin@framemotion.com"
                    className="w-full bg-black/60 border border-cinematic-border text-white text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-cinematic-gold"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotSuccessMsg(null);
                    }}
                    className="px-3 py-1.5 text-xs text-cinematic-textMuted hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="btn-gold text-xs py-2 px-4"
                  >
                    {forgotLoading ? "Processing..." : "Send Reset"}
                  </button>
                </div>
              </form>
            )}

            {forgotSuccessMsg && (
              <div className="text-right mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSuccessMsg(null);
                  }}
                  className="btn-gold text-xs py-1.5 px-4"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
