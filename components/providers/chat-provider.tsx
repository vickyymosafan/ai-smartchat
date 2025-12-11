"use client"

/**
 * Chat Provider (Refactored with SOLID Principles)
 * 
 * SRP: Only orchestrates hooks, no direct logic
 * DIP: Accepts optional adapters for dependency injection
 * ISP: Provides segregated context consumers
 */

import * as React from "react"
import type { ChatContextState } from "@/types/segregated-props"
import type { ChatApiAdapter, SessionApiAdapter } from "@/types/adapters"

// Import hooks (SRP - each hook has single responsibility)
import { useSession } from "@/hooks/useSession"
import { useChatHistory } from "@/hooks/useChatHistory"
import { useMessages } from "@/hooks/useMessages"

// Import default adapters (DIP)
import { defaultChatApiAdapter } from "@/lib/adapters/chat-api-adapter"
import { defaultSessionApiAdapter } from "@/lib/adapters/session-api-adapter"

// ============================================
// Context Creation
// ============================================

const ChatContext = React.createContext<ChatContextState | undefined>(undefined)

// ============================================
// Provider Props (DIP - Injectable Adapters)
// ============================================

interface ChatProviderProps {
  children: React.ReactNode
  chatApiAdapter?: ChatApiAdapter
  sessionApiAdapter?: SessionApiAdapter
}

// ============================================
// Provider Implementation
// ============================================

export function ChatProvider({
  children,
  chatApiAdapter = defaultChatApiAdapter,
  sessionApiAdapter = defaultSessionApiAdapter,
}: ChatProviderProps) {
  // Session hook (SRP: only manages session)
  const session = useSession({
    adapter: sessionApiAdapter,
  })

  // Chat history hook (SRP: only manages chat CRUD)
  const chatHistory = useChatHistory({
    sessionId: session.sessionId,
    isSessionReady: session.isSessionReady,
    adapter: chatApiAdapter,
  })

  // Messages hook (SRP: only manages messages)
  const messages = useMessages({
    sessionId: session.sessionId,
    currentChatId: chatHistory.currentChatId,
    isSessionReady: session.isSessionReady,
    onChatCreated: chatHistory.createChat,
    onHistoryRefresh: chatHistory.loadHistories,
    adapter: chatApiAdapter,
  })

  // Compose context value from segregated hooks
  const value = React.useMemo<ChatContextState>(
    () => ({
      // Session state
      sessionId: session.sessionId,
      isSessionReady: session.isSessionReady,

      // Chat history state & actions
      chatHistories: chatHistory.chatHistories,
      currentChatId: chatHistory.currentChatId,
      createNewChat: () => {
        chatHistory.createNewChat()
        messages.clearMessages()
        messages.clearError()
      },
      selectChat: async (chatId: string) => {
        chatHistory.selectChat(chatId)
        messages.clearError()
        await messages.loadMessages(chatId)
      },
      deleteChat: async (chatId: string) => {
        await chatHistory.deleteChat(chatId)
        if (chatHistory.currentChatId === chatId) {
          messages.clearMessages()
        }
      },
      renameChat: chatHistory.renameChat,
      refreshHistories: chatHistory.loadHistories,

      // Message state & actions
      messages: messages.messages,
      isLoading: messages.isLoading,
      error: messages.error,
      sendMessage: messages.sendMessage,
      clearError: messages.clearError,
    }),
    [session, chatHistory, messages]
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

// ============================================
// Context Hook
// ============================================

export function useChat(): ChatContextState {
  const context = React.useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

// ============================================
// Segregated Context Hooks (ISP)
// ============================================

/**
 * Use only session state
 */
export function useChatSession() {
  const { sessionId, isSessionReady } = useChat()
  return { sessionId, isSessionReady }
}

/**
 * Use only chat history operations
 */
export function useChatHistories() {
  const {
    chatHistories,
    currentChatId,
    createNewChat,
    selectChat,
    deleteChat,
    renameChat,
    refreshHistories,
  } = useChat()
  return {
    chatHistories,
    currentChatId,
    createNewChat,
    selectChat,
    deleteChat,
    renameChat,
    refreshHistories,
  }
}

/**
 * Use only message operations
 */
export function useChatMessages() {
  const { messages, isLoading, error, sendMessage, clearError } = useChat()
  return { messages, isLoading, error, sendMessage, clearError }
}
