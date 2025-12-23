"use client"

/**
 * useThinkingIndicator Hook
 * 
 * Manages dynamic thinking indicator state with rotating messages
 * based on user query context and phase progression.
 */

import * as React from "react"
import type { ThinkingPhase, ThinkingState } from "@/types/segregated-props"

// ============================================
// Message Templates
// ============================================

const PHASE_MESSAGES: Record<ThinkingPhase, string[]> = {
  analyzing: [
    "Menganalisis pertanyaan Anda...",
    "Memahami konteks pertanyaan...",
    "Mengidentifikasi kata kunci...",
  ],
  searching: [
    "Mencari informasi di database...",
    "Menelusuri dokumen relevan...",
    "Mengumpulkan data terkait...",
  ],
  comparing: [
    "Membandingkan informasi...",
    "Memverifikasi keakuratan data...",
    "Menyusun perbandingan...",
  ],
  generating: [
    "Menyusun jawaban...",
    "Memformat response...",
    "Hampir selesai...",
  ],
}

const PHASE_ORDER: ThinkingPhase[] = ['analyzing', 'searching', 'comparing', 'generating']
const MESSAGE_ROTATE_INTERVAL = 2500 // ms
const PHASE_DURATION = 3000 // ms per phase

// ============================================
// Helper Functions
// ============================================

function extractKeywords(query: string): string {
  const words = query.split(' ').filter(w => w.length > 3).slice(0, 3)
  return words.join(' ') || query.slice(0, 30)
}

function generateContextualMessages(query: string, phase: ThinkingPhase): string[] {
  const baseMessages = PHASE_MESSAGES[phase]
  
  if (phase === 'searching' && query) {
    const keywords = extractKeywords(query)
    return [
      `Mencari ${keywords}...`,
      `Menelusuri "${query.slice(0, 40)}${query.length > 40 ? '...' : ''}"`,
      ...baseMessages,
    ]
  }
  
  return baseMessages
}

// ============================================
// Hook Implementation
// ============================================

interface UseThinkingIndicatorOptions {
  onPhaseChange?: (phase: ThinkingPhase) => void
}

interface UseThinkingIndicatorReturn extends ThinkingState {
  start: (query: string) => void
  stop: () => void
  skip: () => void
}

export function useThinkingIndicator(
  options: UseThinkingIndicatorOptions = {}
): UseThinkingIndicatorReturn {
  const { onPhaseChange } = options

  const [isThinking, setIsThinking] = React.useState(false)
  const [currentPhase, setCurrentPhase] = React.useState<ThinkingPhase>('analyzing')
  const [currentMessage, setCurrentMessage] = React.useState('')
  const [messages, setMessages] = React.useState<string[]>([])
  const [progress, setProgress] = React.useState(0)
  const [query, setQuery] = React.useState('')

  const messageIndexRef = React.useRef(0)
  const phaseIndexRef = React.useRef(0)
  const startTimeRef = React.useRef<number>(0)

  // Start thinking indicator
  const start = React.useCallback((inputQuery: string) => {
    setQuery(inputQuery)
    setIsThinking(true)
    setCurrentPhase('analyzing')
    setProgress(0)
    phaseIndexRef.current = 0
    messageIndexRef.current = 0
    startTimeRef.current = Date.now()

    const initialMessages = generateContextualMessages(inputQuery, 'analyzing')
    setMessages(initialMessages)
    setCurrentMessage(initialMessages[0] || '')
  }, [])

  // Stop thinking indicator
  const stop = React.useCallback(() => {
    setIsThinking(false)
    setCurrentMessage('')
    setMessages([])
    setProgress(100)
  }, [])

  // Skip to end (for "Jawab sekarang" feature)
  const skip = React.useCallback(() => {
    setCurrentPhase('generating')
    setCurrentMessage('Menyiapkan jawaban...')
    setProgress(90)
  }, [])

  // Message rotation effect
  React.useEffect(() => {
    if (!isThinking || messages.length === 0) return

    const interval = setInterval(() => {
      messageIndexRef.current = (messageIndexRef.current + 1) % messages.length
      setCurrentMessage(messages[messageIndexRef.current])
    }, MESSAGE_ROTATE_INTERVAL)

    return () => clearInterval(interval)
  }, [isThinking, messages])

  // Phase progression effect
  React.useEffect(() => {
    if (!isThinking) return

    const interval = setInterval(() => {
      const nextPhaseIndex = phaseIndexRef.current + 1
      
      if (nextPhaseIndex < PHASE_ORDER.length) {
        phaseIndexRef.current = nextPhaseIndex
        const newPhase = PHASE_ORDER[nextPhaseIndex]
        setCurrentPhase(newPhase)
        
        const newMessages = generateContextualMessages(query, newPhase)
        setMessages(newMessages)
        messageIndexRef.current = 0
        setCurrentMessage(newMessages[0] || '')
        
        // Update progress based on phase
        setProgress(Math.min(((nextPhaseIndex + 1) / PHASE_ORDER.length) * 80, 80))
        
        onPhaseChange?.(newPhase)
      }
    }, PHASE_DURATION)

    return () => clearInterval(interval)
  }, [isThinking, query, onPhaseChange])

  return {
    isThinking,
    currentPhase,
    currentMessage,
    messages,
    progress,
    start,
    stop,
    skip,
  }
}
