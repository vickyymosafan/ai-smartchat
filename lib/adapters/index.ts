/**
 * Adapters Export
 * 
 * Centralized export for all API adapters following DIP principle.
 */

export {
  defaultChatApiAdapter,
  mockChatApiAdapter,
  offlineChatApiAdapter,
} from './chat-api-adapter'

export {
  defaultSessionApiAdapter,
  mockSessionApiAdapter,
  offlineSessionApiAdapter,
} from './session-api-adapter'
