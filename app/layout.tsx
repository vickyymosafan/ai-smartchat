import type React from "react";
import type { Metadata, Viewport } from "next";

import { Analytics } from "@vercel/analytics/next";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

// Initialize fonts with optimized weights only (400, 500, 600, 700)
// This reduces font bundle from ~500KB to ~120KB
const geistSans = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap", // Show text immediately with fallback font
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Smartchat AI Assistant",
  description:
    "Mulai percakapan dengan AI untuk bantuan, saran, dan pertanyaan",
  generator: "v0.app",
  icons: {
    icon: "/UMJ.png",
    apple: "/UMJ.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Preload critical above-the-fold images */}
        <link rel="preload" href="/UMJ.png" as="image" type="image/png" />
      </head>
      <body className="font-sans antialiased overflow-hidden touch-manipulation">
        <AppProviders>{children}</AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
