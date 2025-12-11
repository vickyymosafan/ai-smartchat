/**
 * Segregated Props Interfaces (ISP - Interface Segregation Principle)
 * 
 * These interfaces split large prop interfaces into smaller, focused ones.
 * Components only need to implement the interfaces they actually use.
 */

import type { ChatHistory, Message, BackgroundMusic } from "@/types"

// ============================================
// Chat History Item Props (ISP)
// ============================================

/**
 * Core display props - required for basic rendering
 */
export interface ChatItemDisplayProps {
  chat: ChatHistory
  isActive: boolean
  onSelect: () => void
  className?: string
}

/**
 * Edit capability props - for inline editing
 */
export interface ChatItemEditProps {
  isEditing: boolean
  editTitle: string
  onEditTitleChange: (title: string) => void
  onRenameClick: () => void
  onRenameSubmit: () => void
  onRenameCancel: () => void
  inputRef?: React.RefObject<HTMLInputElement | null>
}

/**
 * Action props - for item actions
 */
export interface ChatItemActionProps {
  onDeleteClick: () => void
}

/**
 * Extension props - for customization (OCP)
 */
export interface ChatItemExtensionProps {
  icon?: React.ReactNode
  actions?: ChatItemAction[]
  renderContent?: (chat: ChatHistory) => React.ReactNode
}

export interface ChatItemAction {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'destructive'
}

/**
 * Full ChatHistoryItem props - composition of all interfaces
 */
export type ChatHistoryItemProps = ChatItemDisplayProps &
  Partial<ChatItemEditProps> &
  Partial<ChatItemActionProps> &
  Partial<ChatItemExtensionProps>

// ============================================
// Message Item Props (ISP + OCP)
// ============================================

/**
 * Core message display props
 */
export interface MessageItemDisplayProps {
  message: Message
  className?: string
}

/**
 * Extension props for message customization
 */
export interface MessageItemExtensionProps {
  userAvatar?: React.ReactNode
  assistantAvatar?: React.ReactNode
  renderContent?: (content: string, role: 'user' | 'assistant') => React.ReactNode
}

/**
 * Full MessageItem props
 */
export type MessageItemProps = MessageItemDisplayProps &
  Partial<MessageItemExtensionProps>

// ============================================
// Context State Interfaces (ISP)
// ============================================

/**
 * Session state - read-only session info
 */
export interface SessionState {
  sessionId: string
  isSessionReady: boolean
}

/**
 * Chat history operations
 */
export interface ChatHistoryState {
  chatHistories: ChatHistory[]
  currentChatId: string | null
  createNewChat: () => void
  selectChat: (id: string) => Promise<void>
  deleteChat: (id: string) => Promise<void>
  renameChat: (id: string, title: string) => Promise<void>
  refreshHistories: () => Promise<void>
}

/**
 * Message operations
 */
export interface MessageState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  clearError: () => void
}

/**
 * Full chat context - composition of all states
 */
export type ChatContextState = SessionState & ChatHistoryState & MessageState

// ============================================
// Music Context Interfaces (ISP)
// ============================================

/**
 * Playback state
 */
export interface PlaybackState {
  currentTrack: BackgroundMusic | null
  isPlaying: boolean
  currentTime: number
  duration: number
}

/**
 * Playback controls
 */
export interface PlaybackControls {
  play: () => void
  pause: () => void
  toggle: () => void
  seekTo: (time: number) => void
}

/**
 * Playlist state
 */
export interface PlaylistState {
  playlist: BackgroundMusic[]
  nextTrack: () => void
  prevTrack: () => void
  selectTrack: (track: BackgroundMusic) => void
}

/**
 * Volume control
 */
export interface VolumeState {
  volume: number
  setVolume: (volume: number) => void
}

/**
 * Full music context
 */
export type MusicContextState = PlaybackState & PlaybackControls & PlaylistState & VolumeState

// ============================================
// Editable Item Hook Props (SRP)
// ============================================

export interface EditableItemState<T = string> {
  editingId: T | null
  editValue: string
  inputRef: React.RefObject<HTMLInputElement | null>
  startEdit: (id: T, currentValue: string) => void
  updateValue: (value: string) => void
  submitEdit: () => Promise<void>
  cancelEdit: () => void
  isEditing: (id: T) => boolean
}

// ============================================
// Confirm Dialog Hook Props (SRP)
// ============================================

export interface ConfirmDialogState<T = string> {
  isOpen: boolean
  itemToConfirm: T | null
  openDialog: (item: T) => void
  closeDialog: () => void
  confirm: () => Promise<void>
}
