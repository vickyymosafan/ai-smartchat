"use client"

/**
 * useChatHistory Hook (SRP - Single Responsibility Principle)
 * 
 * Handles ONLY chat history CRUD operations:
 * - Load chat histories
 * - Create new chat
 * - Delete chat
 * - Rename chat
 * - Select current chat
 */

import * as React from "react"
import type { ChatHistory } from "@/types"
import type { ChatApiAdapter } from "@/types/adapters"
import { generateId, nowISO } from "@/lib/utils"

// Default adapter using existing API service
import {
  createChat as apiCreateChat,
  getChats as apiGetChats,
  deleteChat as apiDeleteChat,
  renameChat as apiRenameChat,
} from "@/lib/api/chat-service"

const defaultChatApi: Pick<ChatApiAdapter, 'createChat' | 'getChats' | 'deleteChat' | 'renameChat'> = {
  createChat: apiCreateChat,
  getChats: apiGetChats,
  deleteChat: apiDeleteChat,
  renameChat: apiRenameChat,
}

interface UseChatHistoryOptions {
  sessionId: string
  isSessionReady: boolean
  adapter?: Pick<ChatApiAdapter, 'createChat' | 'getChats' | 'deleteChat' | 'renameChat'>
}

interface ChatHistoryActions {
  chatHistories: ChatHistory[]
  currentChatId: string | null
  loadHistories: () => Promise<void>
  createChat: (title: string) => Promise<string>
  selectChat: (chatId: string) => void
  deleteChat: (chatId: string) => Promise<void>
  renameChat: (chatId: string, newTitle: string) => Promise<void>
  createNewChat: () => void
  setCurrentChatId: (id: string | null) => void
}

export function useChatHistory(options: UseChatHistoryOptions): ChatHistoryActions {
  const { sessionId, isSessionReady, adapter = defaultChatApi } = options
  
  const [chatHistories, setChatHistories] = React.useState<ChatHistory[]>([])
  const [currentChatId, setCurrentChatId] = React.useState<string | null>(null)

  // Load all chat histories
  const loadHistories = React.useCallback(async () => {
    if (!sessionId || !isSessionReady) return
    const histories = await adapter.getChats(sessionId)
    setChatHistories(histories)
  }, [sessionId, isSessionReady, adapter])

  // Auto-load when session is ready
  React.useEffect(() => {
    if (sessionId && isSessionReady) {
      loadHistories()
    }
  }, [sessionId, isSessionReady, loadHistories])

  // Create a new chat
  const createChat = React.useCallback(async (title: string): Promise<string> => {
    const chatId = generateId("chat")
    
    const newChat: ChatHistory = {
      id: chatId,
      sessionId,
      title,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }

    await adapter.createChat(sessionId, chatId, title)
    setChatHistories((prev) => [newChat, ...prev])
    setCurrentChatId(chatId)
    
    return chatId
  }, [sessionId, adapter])

  // Select a chat
  const selectChat = React.useCallback((chatId: string) => {
    setCurrentChatId(chatId)
  }, [])

  // Delete a chat
  const deleteChat = React.useCallback(async (chatId: string) => {
    const success = await adapter.deleteChat(chatId)
    if (success) {
      setChatHistories((prev) => prev.filter((c) => c.id !== chatId))
      if (currentChatId === chatId) {
        setCurrentChatId(null)
      }
    }
  }, [currentChatId, adapter])

  // Rename a chat
  const renameChat = React.useCallback(async (chatId: string, newTitle: string) => {
    const success = await adapter.renameChat(chatId, newTitle)
    if (success) {
      setChatHistories((prev) =>
        prev.map((c) =>
          c.id === chatId ? { ...c, title: newTitle, updatedAt: nowISO() } : c
        )
      )
    }
  }, [adapter])

  // Create new chat (reset state)
  const createNewChat = React.useCallback(() => {
    setCurrentChatId(null)
  }, [])

  return {
    chatHistories,
    currentChatId,
    loadHistories,
    createChat,
    selectChat,
    deleteChat,
    renameChat,
    createNewChat,
    setCurrentChatId,
  }
}
