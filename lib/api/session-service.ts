/**
 * Session Service - API layer for session operations
 * Separates API calls from React state management (SoC principle)
 */

import { generateId } from "@/lib/utils"

const STORAGE_KEY = "smartchat-session-id"

/**
 * Get or create a session ID from sessionStorage
 */
export function getStoredSessionId(): string {
  if (typeof window === "undefined") return generateId("session")
  
  let sessionId = sessionStorage.getItem(STORAGE_KEY)
  if (!sessionId) {
    sessionId = generateId("session")
    sessionStorage.setItem(STORAGE_KEY, sessionId)
  }
  return sessionId
}

/**
 * Store a new session ID in sessionStorage
 */
export function storeSessionId(sessionId: string): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, sessionId)
  }
}

/**
 * Create a session on the server
 */
export async function createSession(sessionId: string): Promise<boolean> {
  try {
    const response = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })

    if (response.ok) {
      const data = await response.json()
      return !!data.session
    }
    return false
  } catch (error) {
    console.error("Error creating session:", error)
    return false
  }
}

/**
 * Create a session with automatic retry on failure
 * If the initial session fails, generates a new session ID and retries
 */
export async function createSessionWithRetry(
  initialSessionId: string,
  maxRetries = 2
): Promise<{ success: boolean; sessionId: string }> {
  let sessionId = initialSessionId
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const success = await createSession(sessionId)
    
    if (success) {
      storeSessionId(sessionId)
      return { success: true, sessionId }
    }
    
    // Generate new session ID for retry
    if (attempt < maxRetries - 1) {
      console.warn("Session creation failed, retrying with new session ID")
      sessionId = generateId("session")
    }
  }
  
  console.error("Failed to create session after retries")
  return { success: false, sessionId }
}
