import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "FRAME / MOTION — Cinematic Video Production & Film Studio",
    template: "%s | FRAME / MOTION",
  },
  description:
    "Award-winning cinematic video production studio specializing in commercial advertising, wedding films, music videos, and feature documentaries. Tell your story through the lens.",
  keywords: [
    "video production",
    "cinematography",
    "commercials",
    "wedding films",
    "music videos",
    "documentary",
    "FRAME MOTION",
    "filmmaking",
  ],
  authors: [{ name: "FRAME / MOTION Studio" }],
  openGraph: {
    title: "FRAME / MOTION — Cinematic Video Production & Film Studio",
    description:
      "Creating powerful visuals, unforgettable films, and cinematic experiences for brands, people, and businesses.",
    url: "https://framemotion.studio",
    siteName: "FRAME / MOTION",
    images: [
      {
        url: "/works/hero/hero-1.jpg",
        width: 1920,
        height: 1080,
        alt: "FRAME / MOTION Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FRAME / MOTION — Cinematic Video Production",
    description: "Creating powerful visuals, unforgettable films and cinematic experiences.",
    images: ["/works/hero/hero-1.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable} dark scroll-smooth`}>
      <body className="bg-cinematic-bg text-white font-sans antialiased selection:bg-cinematic-gold selection:text-cinematic-bg min-h-screen">
        {children}
      </body>
    </html>
  );
}
