/**
 * PWA Configuration - Single Source of Truth
 *
 * This file contains all PWA-related constants used across:
 * - app/manifest.ts (Web App Manifest)
 * - app/layout.tsx (Meta tags)
 *
 * @description Centralized PWA configuration to prevent duplication
 * and ensure consistency across the application.
 */

/**
 * Core application metadata
 * Reused in manifest.ts and layout.tsx
 */
export const APP_METADATA = {
  name: "Smartchat AI Assistant",
  shortName: "Smartchat",
  description: "Mulai percakapan dengan AI untuk bantuan, saran, dan pertanyaan",
} as const;

/**
 * Theme colors for PWA "invisible splash" technique
 * Uses Netral color scheme as default (most neutral/universal)
 *
 * These colors are chosen to match the app's background color,
 * creating a seamless transition when the PWA launches (no visible splash).
 */
export const PWA_THEME_COLORS = {
  /** Light theme background - Netral light (#fcfcfc) */
  light: "#fcfcfc",
  /** Dark theme background - Netral dark (#000000) */
  dark: "#000000",
} as const;

/**
 * PWA Display mode configuration
 * "standalone" provides app-like experience without browser UI
 */
export const PWA_DISPLAY_MODE = "standalone" as const;

/**
 * PWA Icon configuration
 * Defines required icon sizes for manifest
 */
export const PWA_ICONS = {
  sizes: ["192x192", "512x512"] as const,
  basePath: "/icons",
  type: "image/png",
} as const;

/**
 * Get icon path for a specific size
 * @param size - Icon size (e.g., "192x192")
 * @returns Full path to the icon
 */
export function getIconPath(size: string): string {
  return `${PWA_ICONS.basePath}/icon-${size.split("x")[0]}.png`;
}

/**
 * Service Worker configuration
 */
export const SERVICE_WORKER = {
  path: "/sw.js",
  scope: "/",
} as const;

/**
 * Type exports for type safety
 */
export type ThemeMode = keyof typeof PWA_THEME_COLORS;
export type DisplayMode = typeof PWA_DISPLAY_MODE;
