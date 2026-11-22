import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090A0D",
        foreground: "#FFFFFF",
        cinematic: {
          bg: "#090A0D",
          surface: "#12141A",
          surfaceHover: "#181C26",
          card: "#111319",
          border: "#222736",
          borderGold: "rgba(201, 163, 94, 0.25)",
          gold: "#C9A35E",
          goldLight: "#DFC283",
          goldDark: "#9E7B3B",
          goldMuted: "rgba(201, 163, 94, 0.15)",
          textMuted: "#9CA3AF",
          textDim: "#6B7280",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-display)", "Playfair Display", "Cinzel", "serif"],
      },
      letterSpacing: {
        widest: "0.25em",
        cinematic: "0.15em",
      },
      animation: {
        "fade-in": "fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(15px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
