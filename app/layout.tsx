import type React from "react";
import type { Metadata, Viewport } from "next";

import { Analytics } from "@vercel/analytics/next";
import { AppProviders } from "@/components/providers/app-providers";
import { OnboardingDialog } from "@/components/onboarding";
import { APP_METADATA, PWA_THEME_COLORS, SERVICE_WORKER, APP_LOGO } from "@/lib/pwa/config";
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

/**
 * Metadata using centralized PWA config
 * @see lib/pwa/config.ts for single source of truth
 */
export const metadata: Metadata = {
  title: APP_METADATA.name,
  description: APP_METADATA.description,
  generator: "v0.app",
  icons: {
    icon: APP_LOGO.path,
    apple: APP_LOGO.path,
  },
  // PWA specific metadata
  applicationName: APP_METADATA.shortName,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_METADATA.shortName,
    // Intentionally NOT setting startupImage for minimal/invisible splash
  },
  formatDetection: {
    telephone: false,
  },
};

/**
 * Viewport with theme colors for "invisible splash" technique
 * Colors match app background for seamless PWA launch transition
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: PWA_THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: PWA_THEME_COLORS.dark },
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
        <link rel="preload" href={APP_LOGO.path} as="image" type={APP_LOGO.type} />
        {/* Service Worker Registration & PWA Install Prompt Capture */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Capture beforeinstallprompt ASAP (before React hydrates)
              // This event fires early in page load and may be missed by React hooks
              window.addEventListener('beforeinstallprompt', function(e) {
                e.preventDefault();
                window.__pwaInstallPrompt = e;
              });

              // Register Service Worker
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('${SERVICE_WORKER.path}', { scope: '${SERVICE_WORKER.scope}' });
                });
              }
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased overflow-hidden touch-manipulation">
        <AppProviders>
          {children}
          <OnboardingDialog />
        </AppProviders>
        <Analytics />
      </body>
    </html>
  );
}

