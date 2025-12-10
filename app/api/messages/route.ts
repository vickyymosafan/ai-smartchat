import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"
import { getSessionUUID } from "@/lib/session-helper"

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServerClient()
  const chatId = request.nextUrl.searchParams.get("chatId")
  const sessionIdentifier = request.nextUrl.searchParams.get("sessionId")

  if (!chatId && !sessionIdentifier) {
    return NextResponse.json({ messages: [] })
  }

  try {
    let sessionUUID: string | null = null

    // Priority: Use chatId to find messages for specific chat
    // Each chat has its own "session" where sessionId = chatId
    if (chatId) {
      const { data: session } = await supabase
        .from("sessions")
        .select("id")
        .eq("sessionId", chatId)
        .single()
      sessionUUID = session?.id || null
    }

    // Fallback: If no chatId, try sessionIdentifier
    if (!sessionUUID && sessionIdentifier) {
      const { data: session } = await supabase
        .from("sessions")
        .select("id")
        .eq("sessionId", sessionIdentifier)
        .single()
      sessionUUID = session?.id || null
    }

    if (!sessionUUID) {
      return NextResponse.json({ messages: [] })
    }

    // Query messages by session UUID
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("sessionId", sessionUUID)
      .order("createdAt", { ascending: true })

    if (error) {
      console.error("Supabase error fetching messages:", error)
      return NextResponse.json({ messages: [] })
    }

    return NextResponse.json({ messages: data || [] })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ messages: [] })
  }
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseServerClient()

  try {
    const body = await request.json()
    const { sessionId: sessionIdentifier, role, content } = body

    if (!role || !content) {
      return NextResponse.json({ error: "Role and content are required" }, { status: 400 })
    }

    // Get session UUID for FK
    let sessionUUID: string | null = null
    if (sessionIdentifier) {
      sessionUUID = await getSessionUUID(supabase, sessionIdentifier)
    }

    if (!sessionUUID) {
      return NextResponse.json({ error: "Valid session is required" }, { status: 400 })
    }

    const newMessage = {
      id: `msg_${Date.now()}_${role}`,
      sessionId: sessionUUID,
      role,
      content,
      createdAt: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("messages").insert(newMessage).select().single()

    if (error) {
      console.error("Supabase error creating message:", error)
      return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
    }

    return NextResponse.json({ message: data })
  } catch (error) {
    console.error("Create message error:", error)
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
  }
}
