/**
 * API Adapter Interfaces (DIP - Dependency Inversion Principle)
 * 
 * These interfaces allow components to depend on abstractions rather than
 * concrete implementations. This enables:
 * - Easy mocking for tests
 * - Swapping implementations (REST → GraphQL)
 * - Offline mode support
 */

import type { ChatHistory, Message } from "@/types"

// ============================================
// Response Types
// ============================================

export interface CreateChatResponse {
  chat: ChatHistory | null
  error?: string
}

export interface SendMessageResponse {
  response: string
  error?: string
}

export interface SessionResult {
  success: boolean
  sessionId: string
}

// ============================================
// Chat API Adapter Interface
// ============================================

export interface ChatApiAdapter {
  /**
   * Create a new chat
   */
  createChat: (
    sessionId: string,
    chatId: string,
    title: string
  ) => Promise<CreateChatResponse>

  /**
   * Get all chats for a session
   */
  getChats: (sessionId: string) => Promise<ChatHistory[]>

  /**
   * Get messages for a specific chat
   */
  getMessages: (chatId: string) => Promise<Message[]>

  /**
   * Send a message and get AI response
   */
  sendMessage: (
    message: string,
    sessionId: string,
    chatId: string
  ) => Promise<SendMessageResponse>

  /**
   * Delete a chat
   */
  deleteChat: (chatId: string) => Promise<boolean>

  /**
   * Rename a chat
   */
  renameChat: (chatId: string, newTitle: string) => Promise<boolean>
}

// ============================================
// Session API Adapter Interface
// ============================================

export interface SessionApiAdapter {
  /**
   * Get stored session ID from storage
   */
  getStoredSessionId: () => string

  /**
   * Store session ID to storage
   */
  storeSessionId: (sessionId: string) => void

  /**
   * Create a session with retry logic
   */
  createSessionWithRetry: (
    sessionId: string,
    maxRetries?: number
  ) => Promise<SessionResult>
}

// ============================================
// Music API Adapter Interface
// ============================================

import type { BackgroundMusic } from "@/types"

export interface MusicApiAdapter {
  /**
   * Get playlist from server
   */
  getPlaylist: () => Promise<BackgroundMusic[]>
}
