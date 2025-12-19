// Database types based on Supabase schema
export interface Session {
  id: string;
  sessionId: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
  lastActivityAt: string;
  messageCount: number;
  createdAt: string;
}

export interface ChatHistory {
  id: string;
  sessionId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface BackgroundMusic {
  id: string;
  title: string;
  artist: string;
  url: string;
  lyrics?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface MusicPlayerState {
  currentTrack: BackgroundMusic | null;
  playlist: BackgroundMusic[];
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
}
