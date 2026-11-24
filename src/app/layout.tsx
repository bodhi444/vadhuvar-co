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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://athul-ollur.vercel.app"),
  title: {
    default: "ATHUL OLLUR — Creative Director & Film Director",
    template: "%s | ATHUL OLLUR",
  },
  description:
    "Official cinematic portfolio of Athul Ollur — Creative Director, Director of Photography, filmmaker, and visual storyteller specializing in commercial advertising, luxury wedding films, music videos, and documentaries.",
  keywords: [
    "Athul Ollur",
    "creative director",
    "cinematographer",
    "filmmaker",
    "director of photography",
    "cinematography",
    "commercials",
    "wedding films",
    "music videos",
    "documentary",
    "video production",
  ],
  authors: [{ name: "Athul Ollur" }],
  openGraph: {
    title: "ATHUL OLLUR — Creative Director & Film Director",
    description:
      "Creating powerful visuals, unforgettable films, and cinematic experiences for brands, people, and businesses worldwide.",
    url: "https://athul-ollur.vercel.app",
    siteName: "ATHUL OLLUR",
    images: [
      {
        url: "/athul-ollur.jpg",
        width: 1200,
        height: 800,
        alt: "Athul Ollur — Creative Director & Director",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATHUL OLLUR — Creative Director & Filmmaker",
    description: "Creating powerful visuals, unforgettable films, and cinematic experiences.",
    images: ["/athul-ollur.jpg"],
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
