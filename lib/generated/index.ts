/**
 * Generated API Client - Main Export
 * 
 * This file provides a pre-configured instance of the generated API client.
 * The client is auto-generated from the OpenAPI spec using swagger-typescript-api.
 * 
 * Usage:
 * ```typescript
 * import { api } from '@/lib/generated';
 * 
 * // Send a message to AI
 * const response = await api.chat.sendMessage({ message: 'Hello!' });
 * 
 * // Get all chats
 * const chats = await api.chats.getChats({ sessionId: 'my-session' });
 * 
 * // Get playlist
 * const playlist = await api.music.getPlaylist();
 * ```
 * 
 * To regenerate after API changes:
 * ```bash
 * npm run generate:api
 * ```
 */

import { Api, HttpClient } from './Api';

// Export all types for external use
export * from './Api';

// Create and export a pre-configured API client instance
const httpClient = new HttpClient({
  baseUrl: '/api',
});

export const api = new Api(httpClient);

// Export individual API modules for convenience
export const chatApi = api.chat;
export const chatsApi = api.chats;
export const messagesApi = api.messages;
export const musicApi = api.music;
export const sessionsApi = api.sessions;
