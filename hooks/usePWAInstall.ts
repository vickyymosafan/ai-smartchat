"use client";

/**
 * usePWAInstall Hook
 *
 * Handles PWA installation prompt and device detection.
 * Provides cross-platform support with appropriate fallbacks.
 *
 * @remarks
 * - Chrome/Edge: Uses beforeinstallprompt event
 * - Safari iOS: Detects platform for manual instructions
 * - Firefox: Not supported, shows disabled state
 */

import * as React from "react";

export type Platform = "ios" | "android" | "desktop" | "unknown";
export type Browser = "chrome" | "safari" | "firefox" | "edge" | "samsung" | "other";
export type InstallResult = "accepted" | "dismissed" | "unavailable";

export interface PWAInstallState {
  /** Whether app is running in standalone mode (installed) */
  isInstalled: boolean;
  /** Whether beforeinstallprompt event has fired */
  isInstallable: boolean;
  /** Detected platform */
  platform: Platform;
  /** Detected browser */
  browser: Browser;
  /** Whether browser supports PWA install at all */
  isSupported: boolean;
  /** Whether we're still detecting */
  isLoading: boolean;
}

export interface PWAInstallReturn extends PWAInstallState {
  /** Trigger the install prompt (Chrome/Edge only) */
  promptInstall: () => Promise<InstallResult>;
  /** Whether to show iOS manual instructions */
  showIOSInstructions: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  prompt(): Promise<void>;
}

/**
 * Detect current platform
 */
function detectPlatform(): Platform {
  if (typeof window === "undefined") return "unknown";

  const ua = navigator.userAgent;

  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  if (/Windows|Macintosh|Linux/.test(ua)) return "desktop";

  return "unknown";
}

/**
 * Detect current browser
 */
function detectBrowser(): Browser {
  if (typeof window === "undefined") return "other";

  const ua = navigator.userAgent;

  // Order matters - check more specific browsers first
  if (/SamsungBrowser/.test(ua)) return "samsung";
  if (/Edg/.test(ua)) return "edge";
  if (/Chrome/.test(ua) && !/Edg/.test(ua)) return "chrome";
  if (/Safari/.test(ua) && !/Chrome/.test(ua)) return "safari";
  if (/Firefox/.test(ua)) return "firefox";

  return "other";
}

/**
 * Check if app is running in standalone mode (installed)
 */
function checkIsInstalled(): boolean {
  if (typeof window === "undefined") return false;

  // Check display-mode media query
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

  // Check iOS Safari standalone property
  const isIOSStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;

  // Check if launched from TWA (Trusted Web Activity)
  const isTWA = document.referrer.includes("android-app://");

  return isStandalone || isIOSStandalone || isTWA;
}

/**
 * Hook for PWA installation
 */
export function usePWAInstall(): PWAInstallReturn {
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [isInstallable, setIsInstallable] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [platform, setPlatform] = React.useState<Platform>("unknown");
  const [browser, setBrowser] = React.useState<Browser>("other");

  const deferredPrompt = React.useRef<BeforeInstallPromptEvent | null>(null);

  // Initial detection
  React.useEffect(() => {
    setPlatform(detectPlatform());
    setBrowser(detectBrowser());
    setIsInstalled(checkIsInstalled());
    setIsLoading(false);
  }, []);

  // Listen for beforeinstallprompt event
  React.useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Listen for successful install
    const installHandler = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      deferredPrompt.current = null;
    };

    window.addEventListener("appinstalled", installHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installHandler);
    };
  }, []);

  // Listen for display-mode changes (in case user installs externally)
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(display-mode: standalone)");

    const handler = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Determine if browser supports PWA install
  const isSupported = React.useMemo(() => {
    // Firefox doesn't support PWA install
    if (browser === "firefox") return false;

    // iOS Safari requires manual install
    if (platform === "ios" && browser === "safari") return true; // Supported via manual

    // Chrome/Edge/Samsung support beforeinstallprompt
    if (["chrome", "edge", "samsung"].includes(browser)) return true;

    return false;
  }, [browser, platform]);

  // Whether to show iOS instructions
  const showIOSInstructions = platform === "ios" && browser === "safari" && !isInstalled;

  // Prompt install function
  const promptInstall = React.useCallback(async (): Promise<InstallResult> => {
    if (!deferredPrompt.current) {
      return "unavailable";
    }

    try {
      await deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;

      if (outcome === "accepted") {
        deferredPrompt.current = null;
        setIsInstallable(false);
      }

      return outcome;
    } catch {
      return "unavailable";
    }
  }, []);

  return {
    isInstalled,
    isInstallable,
    platform,
    browser,
    isSupported,
    isLoading,
    promptInstall,
    showIOSInstructions,
  };
}

export default usePWAInstall;
