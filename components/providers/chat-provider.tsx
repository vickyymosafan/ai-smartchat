"use client"

import * as React from "react"
import type { Message, ChatHistory } from "@/types"

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

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

function generateChatId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [chatHistories, setChatHistories] = React.useState<ChatHistory[]>([])
  const [currentChatId, setCurrentChatId] = React.useState<string | null>(null)
  const [sessionId, setSessionId] = React.useState<string>("")
  const [isSessionReady, setIsSessionReady] = React.useState(false)

  React.useEffect(() => {
    const initSession = async () => {
      let sid = sessionStorage.getItem("smartchat-session-id")

      if (!sid) {
        sid = generateSessionId()
        sessionStorage.setItem("smartchat-session-id", sid)
      }

      setSessionId(sid)

      // Create session in Supabase if it doesn't exist
      try {
        const response = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sid }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.session) {
            setIsSessionReady(true)
          } else {
            // Session creation failed, generate new session ID
            console.warn("Session not found, creating new session")
            const newSid = generateSessionId()
            sessionStorage.setItem("smartchat-session-id", newSid)
            setSessionId(newSid)
            
            // Retry with new session ID
            const retryResponse = await fetch("/api/sessions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId: newSid }),
            })
            
            if (retryResponse.ok) {
              setIsSessionReady(true)
            } else {
              console.error("Failed to create new session")
            }
          }
        } else {
          // If session creation fails, try with a fresh session ID
          console.warn("Session API failed, trying with new session ID")
          const newSid = generateSessionId()
          sessionStorage.setItem("smartchat-session-id", newSid)
          setSessionId(newSid)
          
          const retryResponse = await fetch("/api/sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: newSid }),
          })
          
          if (retryResponse.ok) {
            setIsSessionReady(true)
          } else {
            console.error("Failed to create session after retry")
          }
        }
      } catch (err) {
        console.error("Error initializing session:", err)
      }
    }

    initSession()
  }, [])

  const loadChatHistories = React.useCallback(async () => {
    if (!sessionId || !isSessionReady) return

    try {
      const response = await fetch(`/api/chats?sessionId=${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setChatHistories(data.chatHistories || [])
      }
    } catch (err) {
      console.error("Failed to load chat histories:", err)
    }
  }, [sessionId, isSessionReady])

  React.useEffect(() => {
    if (sessionId && isSessionReady) {
      loadChatHistories()
    }
  }, [sessionId, isSessionReady, loadChatHistories])

  const loadMessages = React.useCallback(async (chatId: string) => {
    try {
      const response = await fetch(`/api/messages?chatId=${chatId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (err) {
      console.error("Failed to load messages:", err)
    }
  }, [])

  const sendMessage = React.useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading || !isSessionReady) return

      setIsLoading(true)
      setError(null)

      let chatId = currentChatId

      if (!chatId) {
        chatId = generateChatId()
        setCurrentChatId(chatId)

        const newChat: ChatHistory = {
          id: chatId,
          sessionId,
          title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        // Create chat in Supabase
        try {
          const response = await fetch("/api/chats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              chatId,
              title: newChat.title,
            }),
          })

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}))
            console.error("Failed to create chat:", errData?.error || response.statusText)
          }
        } catch (err) {
          console.error("Failed to create chat:", err instanceof Error ? err.message : String(err))
        }

        setChatHistories((prev) => [newChat, ...prev])
      }

      // Add user message to UI immediately
      const userMessage: Message = {
        id: `msg_${Date.now()}`,
        sessionId: chatId,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMessage])

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            sessionId,
            chatId,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to send message")
        }

        const data = await response.json()

        const assistantMessage: Message = {
          id: `msg_${Date.now()}_assistant`,
          sessionId: chatId,
          role: "assistant",
          content: data.response || "Maaf, saya tidak dapat memproses permintaan Anda.",
          createdAt: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, assistantMessage])

        // Refresh chat histories to get updated data
        loadChatHistories()
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    },
    [currentChatId, sessionId, isLoading, isSessionReady, loadChatHistories],
  )

  const createNewChat = React.useCallback(() => {
    setCurrentChatId(null)
    setMessages([])
    setError(null)
  }, [])

  const selectChat = React.useCallback(
    async (chatId: string) => {
      setCurrentChatId(chatId)
      setError(null)
      await loadMessages(chatId)
    },
    [loadMessages],
  )

  const deleteChat = React.useCallback(
    async (chatId: string) => {
      try {
        const response = await fetch(`/api/chats?chatId=${chatId}`, { method: "DELETE" })
        if (response.ok) {
          setChatHistories((prev) => prev.filter((c) => c.id !== chatId))
          if (currentChatId === chatId) {
            createNewChat()
          }
        }
      } catch (err) {
        console.error("Failed to delete chat:", err)
      }
    },
    [currentChatId, createNewChat],
  )

  const renameChat = React.useCallback(async (chatId: string, newTitle: string) => {
    try {
      const response = await fetch("/api/chats", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, title: newTitle }),
      })

      if (response.ok) {
        setChatHistories((prev) =>
          prev.map((c) => (c.id === chatId ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c)),
        )
      }
    } catch (err) {
      console.error("Failed to rename chat:", err)
    }
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

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
