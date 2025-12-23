"use client"

/**
 * useMessages Hook (SRP - Single Responsibility Principle)
 * 
 * Handles ONLY message operations:
 * - Load messages for a chat
 * - Send message and receive AI response
 * - Track loading and error states
 */

import * as React from "react"
import type { Message } from "@/types"
import type { ChatApiAdapter } from "@/types/adapters"
import type { ThinkingState } from "@/types/segregated-props"
import { generateId, nowISO } from "@/lib/utils"
import { useThinkingIndicator } from "./useThinkingIndicator"

// Default adapter using existing API service
import {
  getMessages as apiGetMessages,
  sendChatMessage as apiSendMessage,
} from "@/lib/api/chat-service"

const defaultMessageApi: Pick<ChatApiAdapter, 'getMessages' | 'sendMessage'> = {
  getMessages: apiGetMessages,
  sendMessage: apiSendMessage,
}

interface UseMessagesOptions {
  sessionId: string
  currentChatId: string | null
  isSessionReady: boolean
  onChatCreated?: (chatId: string) => Promise<string>
  onHistoryRefresh?: () => Promise<void>
  adapter?: Pick<ChatApiAdapter, 'getMessages' | 'sendMessage'>
}

interface MessageActions {
  messages: Message[]
  isLoading: boolean
  thinkingState: ThinkingState
  error: string | null
  loadMessages: (chatId: string) => Promise<void>
  sendMessage: (content: string) => Promise<void>
  skipThinking: () => void
  clearError: () => void
  clearMessages: () => void
}

export function useMessages(options: UseMessagesOptions): MessageActions {
  const {
    sessionId,
    currentChatId,
    isSessionReady,
    onChatCreated,
    onHistoryRefresh,
    adapter = defaultMessageApi,
  } = options

  const [messages, setMessages] = React.useState<Message[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Thinking indicator state
  const thinkingIndicator = useThinkingIndicator()

  // Load messages for a chat
  const loadMessages = React.useCallback(async (chatId: string) => {
    const msgs = await adapter.getMessages(chatId)
    setMessages(msgs)
  }, [adapter])

  // Send a message
  const sendMessage = React.useCallback(async (content: string) => {
    if (!content.trim() || isLoading || !isSessionReady) return

    setIsLoading(true)
    setError(null)
    thinkingIndicator.start(content)

    let chatId = currentChatId

    // Create new chat if needed
    if (!chatId && onChatCreated) {
      const title = content.slice(0, 50) + (content.length > 50 ? "..." : "")
      chatId = await onChatCreated(title)
    }

    if (!chatId) {
      setError("No chat ID available")
      setIsLoading(false)
      return
    }

    // Add user message (optimistic update)
    const userMessage: Message = {
      id: generateId("msg"),
      sessionId: chatId,
      role: "user",
      content,
      createdAt: nowISO(),
    }
    setMessages((prev) => [...prev, userMessage])

    try {
      // Send to API
      const result = await adapter.sendMessage(content, sessionId, chatId)

      if (result.error) {
        setError(result.error)
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: generateId("msg_assistant"),
        sessionId: chatId,
        role: "assistant",
        content: result.response,
        createdAt: nowISO(),
      }
      setMessages((prev) => [...prev, assistantMessage])

      // Refresh history if callback provided
      if (onHistoryRefresh) {
        await onHistoryRefresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
      thinkingIndicator.stop()
    }
  }, [currentChatId, sessionId, isLoading, isSessionReady, onChatCreated, onHistoryRefresh, adapter])

  // Clear error
  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  // Clear messages
  const clearMessages = React.useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    thinkingState: thinkingIndicator,
    error,
    loadMessages,
    sendMessage,
    skipThinking: thinkingIndicator.skip,
    clearError,
    clearMessages,
  }
}
