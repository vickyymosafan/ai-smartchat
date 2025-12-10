import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

// Create or get session
export async function POST(request: NextRequest) {
  const supabase = getSupabaseServerClient()

  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Check if session exists
    const { data: existingSession } = await supabase.from("sessions").select("*").eq("sessionId", sessionId).single()

    if (existingSession) {
      // Update last activity
      await supabase.from("sessions").update({ lastActivityAt: new Date().toISOString() }).eq("sessionId", sessionId)

      return NextResponse.json({ session: existingSession })
    }

    // Create new session
    const newSession = {
      id: crypto.randomUUID(),
      sessionId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      lastActivityAt: new Date().toISOString(),
      messageCount: 0,
      createdAt: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("sessions").insert(newSession).select().single()

    if (error) {
      console.error("Error creating session:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ session: data })
  } catch (error) {
    console.error("Session API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
