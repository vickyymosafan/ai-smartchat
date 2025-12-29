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
 * App Logo configuration
 * Single source of truth for logo/icon path
 */
export const APP_LOGO = {
  path: "/UMJ.webp",
  type: "image/webp",
} as const;

/**
 * PWA Icon configuration
 * Uses single logo file for all PWA icon sizes
 */
export const PWA_ICONS = {
  sizes: ["192x192", "512x512"] as const,
  type: APP_LOGO.type,
} as const;

/**
 * Get icon path for PWA manifest
 * @param _size - Icon size (ignored, uses single logo file)
 * @returns Path to the logo file
 */
export function getIconPath(_size: string): string {
  return APP_LOGO.path;
}

/**
 * Service Worker configuration
 */
export const SERVICE_WORKER = {
  path: "/sw.js",
  scope: "/",
} as const;

/**
 * Cache configuration
 * Set to false for always-fresh data (no offline support)
 *
 * Rationale: AI chat requires real-time server communication,
 * caching would cause stale responses and confusion.
 */
export const PWA_CACHE = {
  enabled: false,
  reason: "AI chat requires real-time server communication",
} as const;

/**
 * Type exports for type safety
 */
export type ThemeMode = keyof typeof PWA_THEME_COLORS;
export type DisplayMode = typeof PWA_DISPLAY_MODE;
