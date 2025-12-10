import { getSupabaseServerClient } from "@/lib/supabase"

/**
 * Get the UUID (sessions.id) from a text session identifier (sessions.sessionId)
 * Creates the session if it doesn't exist
 */
export async function getSessionUUID(
  supabase: ReturnType<typeof getSupabaseServerClient>,
  sessionIdentifier: string
): Promise<string | null> {
  // First check if session exists and get its UUID id
  const { data: existingSession } = await supabase
    .from("sessions")
    .select("id")
    .eq("sessionId", sessionIdentifier)
    .single()

  if (existingSession) {
    return existingSession.id
  }

  // Create session if it doesn't exist
  const newSessionId = crypto.randomUUID()
  const newSession = {
    id: newSessionId,
    sessionId: sessionIdentifier,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: "unknown",
    userAgent: "unknown",
    lastActivityAt: new Date().toISOString(),
    messageCount: 0,
    createdAt: new Date().toISOString(),
  }

  const { error: insertError } = await supabase.from("sessions").insert(newSession)

  if (insertError) {
    if (insertError.code === "23505") {
      // Duplicate key - session was created by another request, get its id
      const { data: existingAfterConflict } = await supabase
        .from("sessions")
        .select("id")
        .eq("sessionId", sessionIdentifier)
        .single()
      return existingAfterConflict?.id || null
    }
    console.error("Failed to create session:", insertError.message, insertError.code)
    return null
  }

  return newSessionId
}
