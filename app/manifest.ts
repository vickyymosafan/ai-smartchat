import type { MetadataRoute } from "next";
import {
  APP_METADATA,
  PWA_THEME_COLORS,
  PWA_DISPLAY_MODE,
  PWA_ICONS,
  getIconPath,
} from "@/lib/pwa/config";

/**
 * Web App Manifest for PWA
 *
 * Uses centralized config from lib/pwa/config.ts
 * to ensure consistency and prevent duplication.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Manifest
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_METADATA.name,
    short_name: APP_METADATA.shortName,
    description: APP_METADATA.description,
    start_url: "/",
    display: PWA_DISPLAY_MODE,
    // Use dark theme as default for "invisible splash"
    // This matches the predominant dark UI of the app
    background_color: PWA_THEME_COLORS.dark,
    theme_color: PWA_THEME_COLORS.dark,
    orientation: "portrait-primary",
    icons: PWA_ICONS.sizes.map((size) => ({
      src: getIconPath(size),
      sizes: size,
      type: PWA_ICONS.type,
      purpose: "any maskable",
    })),
    // Categories for app stores
    categories: ["productivity", "utilities", "education"],
    // Prefer standalone with no browser UI
    prefer_related_applications: false,
  };
}
