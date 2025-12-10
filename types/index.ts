// Database types based on Supabase schema
export interface Session {
  id: string
  sessionId: string
  expiresAt: string
  ipAddress?: string
  userAgent?: string
  lastActivityAt: string
  messageCount: number
  createdAt: string
}

export interface ChatHistory {
  id: string
  sessionId: string
  title: string
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  sessionId: string
  role: "user" | "assistant"
  content: string
  createdAt: string
}

export interface CachedResponse {
  id: string
  questionHash: string
  question: string
  answer: string
  hitCount: number
  createdAt: string
  expiresAt: string
  lastAccessedAt: string
}

export interface BackgroundMusic {
  id: string
  title: string
  artist: string
  url: string
  lyrics?: string
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

// Chat state types
export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
}

export interface MusicPlayerState {
  currentTrack: BackgroundMusic | null
  playlist: BackgroundMusic[]
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number
}
