import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"
import { getSessionUUID } from "@/lib/session-helper"
import { getCachedResponse, saveCachedResponse } from "@/lib/cache-helper"
import { extractAIResponse } from "@/lib/ai-response-parser"
import { generateId, nowISO } from "@/lib/utils"

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL

export async function POST(request: NextRequest) {
  if (!N8N_WEBHOOK_URL) {
    return NextResponse.json({ error: "N8N webhook not configured" }, { status: 500 })
  }
  const supabase = getSupabaseServerClient()

  try {
    const body = await request.json()
    const { message, sessionId, chatId } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Get session UUID for FK references
    // Use chatId as the session identifier so each chat has its own messages
    let sessionUUID: string | null = null
    if (chatId) {
      // Each chat gets its own "session" for storing messages
      sessionUUID = await getSessionUUID(supabase, chatId)
    } else if (sessionId) {
      sessionUUID = await getSessionUUID(supabase, sessionId)
    }

    // Save user message to database
    if (chatId && sessionUUID) {
      await supabase.from("messages").insert({
        id: `msg_${Date.now()}_user`,
        sessionId: sessionUUID,
        role: "user",
        content: message,
        createdAt: new Date().toISOString(),
      })

      // Update chat history title if it's the first message
      const { data: existingMessages } = await supabase
        .from("messages")
        .select("id")
        .eq("sessionId", sessionUUID)
        .limit(2)

      if (existingMessages && existingMessages.length <= 1) {
        const title = message.slice(0, 50) + (message.length > 50 ? "..." : "")
        await supabase.from("chat_histories").update({ title, updatedAt: new Date().toISOString() }).eq("id", chatId)
      }
    }

    // ========== CACHE CHECK ==========
    // Step 1: Check if response is cached
    const cachedAnswer = await getCachedResponse(supabase, message)
    
    if (cachedAnswer) {
      // CACHE HIT - Return cached response
      console.log("CACHE HIT - Returning cached response")
      
      // Save assistant message to database
      if (chatId && sessionUUID) {
        await supabase.from("messages").insert({
          id: `msg_${Date.now()}_assistant`,
          sessionId: sessionUUID,
          role: "assistant",
          content: cachedAnswer,
          createdAt: new Date().toISOString(),
        })

        await supabase.from("chat_histories").update({ updatedAt: new Date().toISOString() }).eq("id", chatId)
      }

      return NextResponse.json({
        response: cachedAnswer,
        sessionId,
        chatId,
        cached: true,
      })
    }

    // ========== CACHE MISS - Call n8n ==========
    console.log("CACHE MISS - Calling n8n RAG Neural")

    // n8n chat webhooks typically expect these fields
    const payload = {
      action: "sendMessage",
      sessionId: sessionId || chatId,
      chatInput: message,
      message,
      query: message,
      input: message,
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Webhook error response:", errorText)
      throw new Error(`Webhook responded with status: ${response.status}`)
    }

    const rawResponse = await response.text()

    let data: unknown
    try {
      data = JSON.parse(rawResponse)
    } catch {
      data = { output: rawResponse }
    }

    // Extract the actual response using simplified parser
    const aiResponse = extractAIResponse(data)

    // ========== SAVE TO CACHE ==========
    // Save the new response to cache for future use
    await saveCachedResponse(supabase, message, aiResponse)

    // Save assistant message to database
    if (chatId && sessionUUID) {
      await supabase.from("messages").insert({
        id: `msg_${Date.now()}_assistant`,
        sessionId: sessionUUID,
        role: "assistant",
        content: aiResponse,
        createdAt: new Date().toISOString(),
      })

      // Update chat history timestamp
      await supabase.from("chat_histories").update({ updatedAt: new Date().toISOString() }).eq("id", chatId)
    }

    return NextResponse.json({
      response: aiResponse,
      sessionId,
      chatId,
      cached: false,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        error: "Failed to process message",
        response: "Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.",
      },
      { status: 500 },
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
