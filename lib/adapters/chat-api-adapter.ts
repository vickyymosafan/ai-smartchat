/**
 * Chat API Adapter (DIP - Dependency Inversion Principle)
 * 
 * Default implementation using fetch API.
 * Can be replaced with mock or alternative implementations (e.g., GraphQL).
 */

import type { ChatApiAdapter } from "@/types/adapters"
import {
  createChat,
  getChats,
  getMessages,
  sendChatMessage,
  deleteChat,
  renameChat,
} from "@/lib/api/chat-service"

/**
 * Default adapter using existing REST API services
 */
export const defaultChatApiAdapter: ChatApiAdapter = {
  createChat,
  getChats,
  getMessages,
  sendMessage: sendChatMessage,
  deleteChat,
  renameChat,
}

/**
 * Mock adapter for testing
 */
export const mockChatApiAdapter: ChatApiAdapter = {
  createChat: async (sessionId, chatId, title) => ({
    chat: {
      id: chatId,
      sessionId,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }),
  getChats: async () => [],
  getMessages: async () => [],
  sendMessage: async (message) => ({
    response: `Mock response to: ${message}`,
  }),
  deleteChat: async () => true,
  renameChat: async () => true,
}

/**
 * Offline adapter (stores in localStorage)
 */
export const offlineChatApiAdapter: ChatApiAdapter = {
  createChat: async (sessionId, chatId, title) => {
    const chats = JSON.parse(localStorage.getItem('offline-chats') || '[]')
    const chat = {
      id: chatId,
      sessionId,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    chats.unshift(chat)
    localStorage.setItem('offline-chats', JSON.stringify(chats))
    return { chat }
  },
  getChats: async (sessionId) => {
    const chats = JSON.parse(localStorage.getItem('offline-chats') || '[]')
    return chats.filter((c: { sessionId: string }) => c.sessionId === sessionId)
  },
  getMessages: async (chatId) => {
    const messages = JSON.parse(localStorage.getItem(`offline-messages-${chatId}`) || '[]')
    return messages
  },
  sendMessage: async (message, sessionId, chatId) => {
    const messages = JSON.parse(localStorage.getItem(`offline-messages-${chatId}`) || '[]')
    messages.push({
      id: `msg_${Date.now()}`,
      sessionId: chatId,
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    })
    messages.push({
      id: `msg_${Date.now()}_ai`,
      sessionId: chatId,
      role: 'assistant',
      content: 'Offline mode: AI responses are not available.',
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem(`offline-messages-${chatId}`, JSON.stringify(messages))
    return { response: 'Offline mode: AI responses are not available.' }
  },
  deleteChat: async (chatId) => {
    const chats = JSON.parse(localStorage.getItem('offline-chats') || '[]')
    const filtered = chats.filter((c: { id: string }) => c.id !== chatId)
    localStorage.setItem('offline-chats', JSON.stringify(filtered))
    localStorage.removeItem(`offline-messages-${chatId}`)
    return true
  },
  renameChat: async (chatId, newTitle) => {
    const chats = JSON.parse(localStorage.getItem('offline-chats') || '[]')
    const updated = chats.map((c: { id: string; title: string }) =>
      c.id === chatId ? { ...c, title: newTitle } : c
    )
    localStorage.setItem('offline-chats', JSON.stringify(updated))
    return true
  },
}
