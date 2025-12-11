"use client"

import * as React from "react"
import type { Message, ChatHistory } from "@/types"
import { generateId, nowISO } from "@/lib/utils"
import {
  getStoredSessionId,
  createSessionWithRetry,
} from "@/lib/api/session-service"
import {
  createChat,
  getChats,
  getMessages,
  sendChatMessage,
  deleteChat as deleteChatApi,
  renameChat as renameChatApi,
} from "@/lib/api/chat-service"

interface ChatContextState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  chatHistories: ChatHistory[]
  currentChatId: string | null
  sessionId: string
  isSessionReady: boolean
  sendMessage: (content: string) => Promise<void>
  createNewChat: () => void
  selectChat: (chatId: string) => Promise<void>
  deleteChat: (chatId: string) => Promise<void>
  renameChat: (chatId: string, newTitle: string) => Promise<void>
  clearError: () => void
  refreshHistories: () => Promise<void>
}

const ChatContext = React.createContext<ChatContextState | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [chatHistories, setChatHistories] = React.useState<ChatHistory[]>([])
  const [currentChatId, setCurrentChatId] = React.useState<string | null>(null)
  const [sessionId, setSessionId] = React.useState<string>("")
  const [isSessionReady, setIsSessionReady] = React.useState(false)

  // Initialize session on mount
  React.useEffect(() => {
    const initSession = async () => {
      const storedSessionId = getStoredSessionId()
      setSessionId(storedSessionId)

      const result = await createSessionWithRetry(storedSessionId)
      setSessionId(result.sessionId)
      setIsSessionReady(result.success)
    }

    initSession()
  }, [])

  // Load chat histories when session is ready
  const loadChatHistories = React.useCallback(async () => {
    if (!sessionId || !isSessionReady) return
    const histories = await getChats(sessionId)
    setChatHistories(histories)
  }, [sessionId, isSessionReady])

  React.useEffect(() => {
    if (sessionId && isSessionReady) {
      loadChatHistories()
    }
  }, [sessionId, isSessionReady, loadChatHistories])

  // Load messages for a chat
  const loadMessages = React.useCallback(async (chatId: string) => {
    const msgs = await getMessages(chatId)
    setMessages(msgs)
  }, [])

  // Send message handler
  const sendMessage = React.useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading || !isSessionReady) return

      setIsLoading(true)
      setError(null)

      let chatId = currentChatId

      // Create new chat if needed
      if (!chatId) {
        chatId = generateId("chat")
        setCurrentChatId(chatId)

        const title = content.slice(0, 50) + (content.length > 50 ? "..." : "")
        const newChat: ChatHistory = {
          id: chatId,
          sessionId,
          title,
          createdAt: nowISO(),
          updatedAt: nowISO(),
        }

        // Create chat in backend
        await createChat(sessionId, chatId, title)
        setChatHistories((prev) => [newChat, ...prev])
      }

      // Add user message to UI immediately (optimistic update)
      const userMessage: Message = {
        id: generateId("msg"),
        sessionId: chatId,
        role: "user",
        content,
        createdAt: nowISO(),
      }
      setMessages((prev) => [...prev, userMessage])

      try {
        // Send message to API
        const result = await sendChatMessage(content, sessionId, chatId)

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

        // Refresh histories
        loadChatHistories()
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    },
    [currentChatId, sessionId, isLoading, isSessionReady, loadChatHistories],
  )

  // Create new chat
  const createNewChat = React.useCallback(() => {
    setCurrentChatId(null)
    setMessages([])
    setError(null)
  }, [])

  // Select a chat
  const selectChat = React.useCallback(
    async (chatId: string) => {
      setCurrentChatId(chatId)
      setError(null)
      await loadMessages(chatId)
    },
    [loadMessages],
  )

  // Delete a chat
  const deleteChat = React.useCallback(
    async (chatId: string) => {
      const success = await deleteChatApi(chatId)
      if (success) {
        setChatHistories((prev) => prev.filter((c) => c.id !== chatId))
        if (currentChatId === chatId) {
          createNewChat()
        }
      }
    },
    [currentChatId, createNewChat],
  )

  // Rename a chat
  const renameChat = React.useCallback(async (chatId: string, newTitle: string) => {
    const success = await renameChatApi(chatId, newTitle)
    if (success) {
      setChatHistories((prev) =>
        prev.map((c) =>
          c.id === chatId ? { ...c, title: newTitle, updatedAt: nowISO() } : c
        ),
      )
    }
  }, [])

  // Clear error
  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  // Memoized context value
  const value = React.useMemo(
    () => ({
      messages,
      isLoading,
      error,
      chatHistories,
      currentChatId,
      sessionId,
      isSessionReady,
      sendMessage,
      createNewChat,
      selectChat,
      deleteChat,
      renameChat,
      clearError,
      refreshHistories: loadChatHistories,
    }),
    [
      messages,
      isLoading,
      error,
      chatHistories,
      currentChatId,
      sessionId,
      isSessionReady,
      sendMessage,
      createNewChat,
      selectChat,
      deleteChat,
      renameChat,
      clearError,
      loadChatHistories,
    ],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
  const context = React.useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
