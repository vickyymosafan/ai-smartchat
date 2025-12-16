/**
 * Generated API Adapter
 * 
 * This adapter uses the auto-generated API client from OpenAPI spec.
 * It conforms to the existing ChatApiAdapter interface for seamless integration.
 * 
 * Benefits:
 * - Type-safe API calls (generated from OpenAPI spec)
 * - Auto-generated when spec changes
 * - Consistent with adapter pattern already in use
 */

import type { ChatApiAdapter, CreateChatResponse, SendMessageResponse } from '@/types/adapters';
import type { ChatHistory, Message } from '@/types';
import { api } from '@/lib/generated';

/**
 * Adapter using auto-generated API client
 * 
 * This is a drop-in replacement for defaultChatApiAdapter that uses
 * the type-safe generated client instead of manual fetch calls.
 */
export const generatedChatApiAdapter: ChatApiAdapter = {
  createChat: async (
    sessionId: string,
    chatId: string,
    title: string
  ): Promise<CreateChatResponse> => {
    try {
      const response = await api.chats.createChat({
        sessionId,
        chatId,
        title,
      });
      
      return {
        chat: response.data.chat as ChatHistory | null,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { chat: null, error: message };
    }
  },

  getChats: async (sessionId: string): Promise<ChatHistory[]> => {
    try {
      const response = await api.chats.getChats({ sessionId });
      return (response.data.chatHistories as ChatHistory[]) || [];
    } catch (error) {
      console.error('Failed to load chat histories:', error);
      return [];
    }
  },

  getMessages: async (chatId: string): Promise<Message[]> => {
    try {
      const response = await api.messages.getMessages({ chatId });
      return (response.data.messages as Message[]) || [];
    } catch (error) {
      console.error('Failed to load messages:', error);
      return [];
    }
  },

  sendMessage: async (
    message: string,
    sessionId: string,
    chatId: string
  ): Promise<SendMessageResponse> => {
    try {
      const response = await api.chat.sendMessage({
        message,
        sessionId,
        chatId,
      });

      return {
        response: response.data.response || 'Maaf, saya tidak dapat memproses permintaan Anda.',
        cached: response.data.cached || false,
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      return {
        response: 'Maaf, terjadi kesalahan saat memproses pesan Anda.',
        cached: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },

  deleteChat: async (chatId: string): Promise<boolean> => {
    try {
      const response = await api.chats.deleteChat({ chatId });
      return response.data.success || false;
    } catch (error) {
      console.error('Failed to delete chat:', error);
      return false;
    }
  },

  renameChat: async (chatId: string, newTitle: string): Promise<boolean> => {
    try {
      await api.chats.renameChat({ chatId, title: newTitle });
      return true;
    } catch (error) {
      console.error('Failed to rename chat:', error);
      return false;
    }
  },
};
