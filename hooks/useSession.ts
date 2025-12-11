"use client"

/**
 * useSession Hook (SRP - Single Responsibility Principle)
 * 
 * Handles ONLY session lifecycle:
 * - Session ID management
 * - Session initialization with retry
 * - Session readiness state
 */

import * as React from "react"
import type { SessionApiAdapter } from "@/types/adapters"
import type { SessionState } from "@/types/segregated-props"
import { generateId } from "@/lib/utils"

// Default adapter implementation
const STORAGE_KEY = "smartchat-session-id"

const defaultSessionApi: SessionApiAdapter = {
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
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        })
        if (response.ok) {
          const data = await response.json()
          if (data.session) {
            return { success: true, sessionId }
          }
        }
      } catch (error) {
        console.error("Session creation error:", error)
      }
      // Generate new ID for retry
      if (attempt < maxRetries - 1) {
        sessionId = generateId("session")
      }
    }
    return { success: false, sessionId }
  },
}

interface UseSessionOptions {
  adapter?: SessionApiAdapter
}

export function useSession(options: UseSessionOptions = {}): SessionState & {
  initSession: () => Promise<void>
} {
  const adapter = options.adapter || defaultSessionApi
  
  const [sessionId, setSessionId] = React.useState<string>("")
  const [isSessionReady, setIsSessionReady] = React.useState(false)

  const initSession = React.useCallback(async () => {
    const storedId = adapter.getStoredSessionId()
    setSessionId(storedId)

    const result = await adapter.createSessionWithRetry(storedId)
    if (result.sessionId !== storedId) {
      adapter.storeSessionId(result.sessionId)
    }
    setSessionId(result.sessionId)
    setIsSessionReady(result.success)
  }, [adapter])

  // Auto-initialize on mount
  React.useEffect(() => {
    initSession()
  }, [initSession])

  return {
    sessionId,
    isSessionReady,
    initSession,
  }
}
