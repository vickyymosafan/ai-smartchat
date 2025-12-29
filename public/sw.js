/**
 * Minimal Service Worker for PWA Installability
 *
 * This SW does NOT cache anything - all requests go directly to network.
 * Required for Chrome PWA installability without adding caching overhead.
 *
 * Benefits:
 * - Data always fresh from server
 * - No stale cache issues
 * - Simpler debugging
 * - No storage usage
 *
 * Trade-off:
 * - No offline support (acceptable for AI chat app)
 *
 * @see https://developer.chrome.com/docs/workbox/service-worker-overview
 */

// Skip waiting and activate immediately
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());

// No fetch handler = all requests pass through to network
// This is intentional for real-time AI chat functionality
