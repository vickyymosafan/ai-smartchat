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

// Generated API adapter (auto-generated from OpenAPI spec)
export { generatedChatApiAdapter } from './generated-api-adapter'
