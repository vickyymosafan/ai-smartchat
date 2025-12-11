/**
 * Session API Adapter (DIP - Dependency Inversion Principle)
 * 
 * Default implementation for session management.
 * Can be replaced with mock or alternative implementations.
 */

import type { SessionApiAdapter } from "@/types/adapters"
import { generateId } from "@/lib/utils"

const STORAGE_KEY = "smartchat-session-id"

/**
 * Default adapter using sessionStorage and REST API
 */
export const defaultSessionApiAdapter: SessionApiAdapter = {
  getStoredSessionId: () => {
    if (typeof window === "undefined") return generateId("session")
    
    let sessionId = sessionStorage.getItem(STORAGE_KEY)
    if (!sessionId) {
      sessionId = generateId("session")
      sessionStorage.setItem(STORAGE_KEY, sessionId)
    }
    return sessionId
  },

  storeSessionId: (sessionId: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, sessionId)
    }
  },

  createSessionWithRetry: async (sessionId: string, maxRetries = 2) => {
    let currentId = sessionId
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: currentId }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.session) {
            return { success: true, sessionId: currentId }
          }
        }
      } catch (error) {
        console.error("Session creation error:", error)
      }

      // Generate new ID for retry
      if (attempt < maxRetries - 1) {
        currentId = generateId("session")
      }
    }

    return { success: false, sessionId: currentId }
  },
}

/**
 * Mock adapter for testing
 */
export const mockSessionApiAdapter: SessionApiAdapter = {
  getStoredSessionId: () => "mock-session-123",
  storeSessionId: () => {},
  createSessionWithRetry: async (sessionId) => ({
    success: true,
    sessionId,
  }),
}

/**
 * Offline adapter (no server calls)
 */
export const offlineSessionApiAdapter: SessionApiAdapter = {
  getStoredSessionId: () => {
    if (typeof window === "undefined") return generateId("session")
    
    let sessionId = localStorage.getItem("offline-session-id")
    if (!sessionId) {
      sessionId = generateId("session")
      localStorage.setItem("offline-session-id", sessionId)
    }
    return sessionId
  },

  storeSessionId: (sessionId: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("offline-session-id", sessionId)
    }
  },

  createSessionWithRetry: async (sessionId) => ({
    success: true,
    sessionId,
  }),
}
