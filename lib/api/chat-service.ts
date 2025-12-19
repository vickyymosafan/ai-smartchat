/**
 * Chat Service - API layer for chat operations
 * Separates API calls from React state management (SoC principle)
 */

import type { ChatHistory, Message } from "@/types"

export interface CreateChatResponse {
  chat: ChatHistory | null
  error?: string
}

export interface SendMessageResponse {
  response: string
  error?: string
}

/**
 * Create a new chat session
 */
export async function createChat(
  sessionId: string,
  chatId: string,
  title: string
): Promise<CreateChatResponse> {
  try {
    const response = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, chatId, title }),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return { chat: null, error: errData?.error || response.statusText }
    }

    const data = await response.json()
    return { chat: data.chat }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { chat: null, error: message }
  }
}

/**
 * Get all chat histories for a session
 */
export async function getChats(sessionId: string): Promise<ChatHistory[]> {
  try {
    const response = await fetch(`/api/chats?sessionId=${sessionId}`)
    if (response.ok) {
      const data = await response.json()
      return data.chatHistories || []
    }
    return []
  } catch (error) {
    console.error("Failed to load chat histories:", error)
    return []
  }
}

/**
 * Get messages for a specific chat
 */
export async function getMessages(chatId: string): Promise<Message[]> {
  try {
    const response = await fetch(`/api/messages?chatId=${chatId}`)
    if (response.ok) {
      const data = await response.json()
      return data.messages || []
    }
    return []
  } catch (error) {
    console.error("Failed to load messages:", error)
    return []
  }
}

/**
 * Send a message and get AI response
 */
export async function sendChatMessage(
  message: string,
  sessionId: string,
  chatId: string
): Promise<SendMessageResponse> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId, chatId }),
    })

    if (!response.ok) {
      return {
        response: "Maaf, terjadi kesalahan saat memproses pesan Anda.",
        error: "Failed to send message",
      }
    }

    const data = await response.json()
    return {
      response: data.response || "Maaf, saya tidak dapat memproses permintaan Anda.",
    }
  } catch (error) {
    console.error("Failed to send message:", error)
    return {
      response: "Maaf, terjadi kesalahan saat memproses pesan Anda.",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Delete a chat
 */
export async function deleteChat(chatId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/chats?chatId=${chatId}`, { method: "DELETE" })
    return response.ok
  } catch (error) {
    console.error("Failed to delete chat:", error)
    return false
  }
}

/**
 * Rename a chat
 */
export async function renameChat(chatId: string, newTitle: string): Promise<boolean> {
  try {
    const response = await fetch("/api/chats", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, title: newTitle }),
    })
    return response.ok
  } catch (error) {
    console.error("Failed to rename chat:", error)
    return false
  }
}
