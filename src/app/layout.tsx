import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-primary",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vadhuvar Co. | Premium Cinematic Wedding Photography",
  description: "Stories of love, beautifully remembered. A premium visual storytelling and wedding photography brand based in India.",
  openGraph: {
    title: "Vadhuvar Co. | Premium Cinematic Wedding Photography",
    description: "Stories of love, beautifully remembered.",
    url: "https://vadhuvar.co",
    siteName: "Vadhuvar Co.",
    images: [
      {
        url: "/works/hero/hero-1.jpg",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
