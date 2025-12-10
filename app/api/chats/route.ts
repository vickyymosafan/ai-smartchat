import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"
import { getSessionUUID } from "@/lib/session-helper"

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServerClient()
  const sessionIdentifier = request.nextUrl.searchParams.get("sessionId")

  if (!sessionIdentifier) {
    return NextResponse.json({ chatHistories: [] })
  }

  try {
    // Get all sessions that belong to this user's session prefix
    // Chat sessions are created with chatId as sessionId (chat_xxx)
    // We need to find all chat_histories where the session's sessionId starts with "chat_"
    // and was created during this user's session
    
    // First, get all sessions that could be chat sessions
    const { data: chatSessions } = await supabase
      .from("sessions")
      .select("id, sessionId")
      .like("sessionId", "chat_%")

    if (!chatSessions || chatSessions.length === 0) {
      return NextResponse.json({ chatHistories: [] })
    }

    // Get the session UUIDs
    const sessionUUIDs = chatSessions.map(s => s.id)

    // Query chat_histories for these sessions
    const { data, error } = await supabase
      .from("chat_histories")
      .select("*")
      .in("sessionId", sessionUUIDs)
      .order("updatedAt", { ascending: false })

    if (error) {
      console.error("Supabase error fetching chat histories:", error)
      return NextResponse.json({ chatHistories: [] })
    }

    return NextResponse.json({ chatHistories: data || [] })
  } catch (error) {
    console.error("Error fetching chat histories:", error)
    return NextResponse.json({ chatHistories: [] })
  }
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseServerClient()

  try {
    const body = await request.json()
    const { sessionId: sessionIdentifier, chatId, title } = body

    if (!sessionIdentifier || !chatId) {
      return NextResponse.json({ error: "Session ID and Chat ID are required" }, { status: 400 })
    }

    // Create a session for this chat using chatId as the session identifier
    // This ensures each chat has its own "session" for storing messages
    const chatSessionUUID = await getSessionUUID(supabase, chatId)
    if (!chatSessionUUID) {
      return NextResponse.json({ error: "Failed to create session for chat" }, { status: 500 })
    }

    // Also ensure the main user session exists
    const userSessionUUID = await getSessionUUID(supabase, sessionIdentifier)
    if (!userSessionUUID) {
      return NextResponse.json({ error: "Failed to create or find user session" }, { status: 500 })
    }

    // Check if chat already exists (avoid duplicate key error)
    const { data: existingChat } = await supabase
      .from("chat_histories")
      .select("id")
      .eq("id", chatId)
      .single()

    if (existingChat) {
      return NextResponse.json({ chat: existingChat })
    }

    // Use chatSessionUUID for the FK - this links chat_histories to the chat's session
    // Messages will also use this same session, keeping them separate per chat
    const newChat = {
      id: chatId,
      sessionId: chatSessionUUID,
      title: title || "Percakapan Baru",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("chat_histories").insert(newChat).select().single()

    if (error) {
      console.error("Supabase error creating chat:", error.message, error.details, error.hint)
      return NextResponse.json({ error: error.message || "Failed to create chat" }, { status: 500 })
    }

    return NextResponse.json({ chat: data })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Create chat error:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = getSupabaseServerClient()

  try {
    const body = await request.json()
    const { chatId, title } = body

    if (!chatId || !title) {
      return NextResponse.json({ error: "Chat ID and title are required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("chat_histories")
      .update({ title, updatedAt: new Date().toISOString() })
      .eq("id", chatId)
      .select()
      .single()

    if (error) {
      console.error("Supabase error renaming chat:", error)
      return NextResponse.json({ error: "Failed to rename chat" }, { status: 500 })
    }

    return NextResponse.json({ chat: data })
  } catch (error) {
    console.error("Rename chat error:", error)
    return NextResponse.json({ error: "Failed to rename chat" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = getSupabaseServerClient()
  const chatId = request.nextUrl.searchParams.get("chatId")

  if (!chatId) {
    return NextResponse.json({ error: "Chat ID is required" }, { status: 400 })
  }

  try {
    // Get the sessionId (sessions.id UUID) from the chat_history first
    const { data: chat } = await supabase
      .from("chat_histories")
      .select("sessionId")
      .eq("id", chatId)
      .single()

    if (chat?.sessionId) {
      // Delete all messages for this session
      // Note: This deletes ALL messages for the session, not just for this chat
      // This is a limitation of the current database schema
      await supabase.from("messages").delete().eq("sessionId", chat.sessionId)
    }

    // Then delete the chat history
    const { error } = await supabase.from("chat_histories").delete().eq("id", chatId)

    if (error) {
      console.error("Supabase error deleting chat:", error)
      return NextResponse.json({ error: "Failed to delete chat" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete chat error:", error)
    return NextResponse.json({ error: "Failed to delete chat" }, { status: 500 })
  }
}
