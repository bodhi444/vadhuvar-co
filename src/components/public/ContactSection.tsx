"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { SiteSettings, Service } from "@/types";

interface ContactSectionProps {
  settings: SiteSettings;
  services: Service[];
}

export default function ContactSection({ settings, services }: ContactSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(
    services[0]?.title || "Commercial Ads"
  );
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name || !email || !message) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          service,
          message,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(
          data.message ||
            "Thank you! Your cinematic inquiry has been received. Our team will connect with you within 24 hours."
        );
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        setErrorMsg(data.error || "Failed to submit inquiry. Please try again.");
      }
    } catch {
      setErrorMsg("Unable to connect to transmission service. Please try again or reach out via WhatsApp.");
    } finally {
      setIsLoading(false);
    }
  };

  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        "Hello Athul, I would like to inquire about a cinematic film production / project collaboration."
      )}`
    : "#";

  return (
    <section id="contact" className="py-20 sm:py-32 bg-[#090A0D] relative select-none">
      {/* Background divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cinematic-borderGold/40 to-transparent" />

      <div className="max-w-7xl 2xl:max-w-[1540px] 3xl:max-w-[1760px] mx-auto px-5 sm:px-8 2xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 2xl:gap-20 items-start">
          {/* Left Column: Headlines & Contact Channels */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div className="space-y-2 sm:space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-cinematic-gold font-semibold block">
                Initiate Production
              </span>
              <h2 className="font-cinematic text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-tight leading-tight">
                Have A Story To Tell?
              </h2>
            </div>

            <p className="text-xs sm:text-base text-cinematic-textMuted font-sans leading-relaxed">
              Let&apos;s turn your vision into a cinematic experience. Whether you&apos;re commissioning a worldwide brand commercial, an intimate destination wedding film, or a feature documentary, we are ready to roll.
            </p>

            {/* Direct Channels */}
            <div className="space-y-3 sm:space-y-4 pt-4 border-t border-cinematic-border">
              {/* WhatsApp Button */}
              {settings.whatsapp && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 rounded-sm bg-[#12141A] border border-emerald-500/30 hover:border-emerald-400 text-white transition-all group shadow-md min-h-[48px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-emerald-500/10 text-emerald-400">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Direct WhatsApp Chat
                      </span>
                      <span className="text-[11px] text-cinematic-textDim font-mono">
                        {settings.whatsapp}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </a>
              )}

              {/* Email Channel */}
              <div className="flex items-start gap-4 p-4 rounded-sm bg-[#12141A] border border-cinematic-border min-h-[48px]">
                <div className="p-2.5 rounded-full bg-cinematic-gold/10 text-cinematic-gold shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-cinematic-textDim block mb-0.5">
                    Production Inquiry Email
                  </span>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-xs sm:text-sm font-mono text-white hover:text-cinematic-gold transition-colors font-medium break-all"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              {/* Phone Channel */}
              <div className="flex items-start gap-4 p-4 rounded-sm bg-[#12141A] border border-cinematic-border min-h-[48px]">
                <div className="p-2.5 rounded-full bg-cinematic-gold/10 text-cinematic-gold shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-cinematic-textDim block mb-0.5">
                    Studio Line
                  </span>
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-xs sm:text-sm font-mono text-white hover:text-cinematic-gold transition-colors font-medium"
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>

              {/* Physical Location */}
              <div className="flex items-start gap-4 p-4 rounded-sm bg-[#12141A] border border-cinematic-border min-h-[48px]">
                <div className="p-2.5 rounded-full bg-cinematic-gold/10 text-cinematic-gold shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-cinematic-textDim block mb-0.5">
                    Studio Headquarters
                  </span>
                  <span className="text-xs text-cinematic-textMuted block">
                    {settings.address}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-[#12141A] border border-cinematic-border p-5 sm:p-10 rounded-sm shadow-2xl relative">
            <h3 className="font-cinematic text-xl sm:text-2xl font-bold text-white mb-2">
              Start The Conversation
            </h3>
            <p className="text-xs text-cinematic-textMuted mb-6 font-sans">
              Provide project details below. Our directors review inquiries within 24 hours.
            </p>

            {successMsg ? (
              <div className="p-6 bg-emerald-950/40 border border-emerald-800/60 rounded-sm text-center space-y-3 animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-cinematic font-bold text-white">
                  Inquiry Dispatched Successfully
                </h4>
                <p className="text-xs text-emerald-300 leading-relaxed max-w-md mx-auto">
                  {successMsg}
                </p>
                <button
                  type="button"
                  onClick={() => setSuccessMsg(null)}
                  className="btn-gold text-xs py-2 px-4 mt-2 min-h-[44px]"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {errorMsg && (
                  <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-sm text-xs text-red-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted font-medium block mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Julian Vance"
                      className="w-full bg-black/60 border border-cinematic-border text-white text-base sm:text-xs px-3.5 py-3 rounded-sm focus:outline-none focus:border-cinematic-gold transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted font-medium block mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="julian@example.com"
                      className="w-full bg-black/60 border border-cinematic-border text-white text-base sm:text-xs px-3.5 py-3 rounded-sm focus:outline-none focus:border-cinematic-gold transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted font-medium block mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-black/60 border border-cinematic-border text-white text-base sm:text-xs px-3.5 py-3 rounded-sm focus:outline-none focus:border-cinematic-gold transition-colors font-mono"
                    />
                  </div>

                  {/* Service Interested In */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cinematic-textMuted font-medium block mb-1.5">
                      Production Discipline *
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full bg-black/60 border border-cinematic-border text-white text-base sm:text-xs px-3.5 py-3 rounded-sm focus:outline-none focus:border-cinematic-gold transition-colors"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                      <option value="Feature Film / Documentary">Feature Film / Documentary</option>
                      <option value="Editorial Photography">Editorial Photography</option>
                      <option value="General Studio Inquiry">General Studio Inquiry</option>
                    </select>
                  </div>
                </div>

                {/* Message / Project Details */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-cinematic-textMuted font-medium block mb-1.5">
                    Project Details & Creative Vision *
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder="Tell us about the project scope, timeline, shooting locations, or deliverables..."
                    className="w-full bg-black/60 border border-cinematic-border text-white text-base sm:text-xs px-3.5 py-3 rounded-sm focus:outline-none focus:border-cinematic-gold transition-colors leading-relaxed"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-gold w-full py-4 text-xs tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-cinematic-gold/20 min-h-[48px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Transmitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-black" />
                      <span>Transmit Project Brief</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
