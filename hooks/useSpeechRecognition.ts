"use client"

/**
 * useSpeechRecognition Hook
 * 
 * Custom hook for Web Speech API integration (SRP - Single Responsibility)
 * Provides voice input functionality with Indonesian language support.
 * 
 * @remarks
 * Uses react-speech-recognition library for cross-browser compatibility.
 * Chrome has the best support for Web Speech API.
 */

import * as React from "react"
import SpeechRecognition, {
  useSpeechRecognition as useBaseSpeechRecognition,
} from "react-speech-recognition"

export interface SpeechRecognitionOptions {
  /** Language code (default: 'id-ID' for Indonesian) */
  language?: string
  /** Enable continuous listening mode */
  continuous?: boolean
  /** Auto-stop after silence (in milliseconds) */
  silenceTimeout?: number
}

export interface SpeechRecognitionState {
  /** Current transcript from speech recognition */
  transcript: string
  /** Whether the microphone is actively listening */
  isListening: boolean
  /** Whether the browser supports speech recognition */
  isSupported: boolean
  /** Current error message, if any */
  error: string | null
}

export interface SpeechRecognitionControls {
  /** Start listening for speech */
  startListening: () => void
  /** Stop listening for speech */
  stopListening: () => void
  /** Reset the transcript */
  resetTranscript: () => void
  /** Toggle listening state */
  toggleListening: () => void
}

export type UseSpeechRecognitionReturn = SpeechRecognitionState & SpeechRecognitionControls

const DEFAULT_OPTIONS: SpeechRecognitionOptions = {
  language: "id-ID",
  continuous: true,
  silenceTimeout: 3000,
}

/**
 * Hook for speech-to-text functionality
 * 
 * @param options - Configuration options for speech recognition
 * @returns State and controls for speech recognition
 * 
 * @example
 * ```tsx
 * const { transcript, isListening, startListening, stopListening } = useSpeechRecognition()
 * ```
 */
export function useSpeechRecognition(
  options: SpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const mergedOptions = React.useMemo(
    () => ({ ...DEFAULT_OPTIONS, ...options }),
    [options]
  )

  const [error, setError] = React.useState<string | null>(null)
  const silenceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const lastTranscriptRef = React.useRef<string>("")

  // Use the base hook from react-speech-recognition
  const {
    transcript,
    listening,
    resetTranscript: baseResetTranscript,
    browserSupportsSpeechRecognition,
  } = useBaseSpeechRecognition()

  // Clear silence timeout
  const clearSilenceTimeout = React.useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
      silenceTimeoutRef.current = null
    }
  }, [])

  // Handle silence detection - auto-stop after no speech
  React.useEffect(() => {
    if (!listening || !mergedOptions.silenceTimeout) return

    // If transcript changed, reset the silence timer
    if (transcript !== lastTranscriptRef.current) {
      lastTranscriptRef.current = transcript
      clearSilenceTimeout()

      if (transcript.length > 0) {
        silenceTimeoutRef.current = setTimeout(() => {
          SpeechRecognition.stopListening()
        }, mergedOptions.silenceTimeout)
      }
    }

    return () => clearSilenceTimeout()
  }, [transcript, listening, mergedOptions.silenceTimeout, clearSilenceTimeout])

  // Start listening with configured options
  const startListening = React.useCallback(() => {
    if (!browserSupportsSpeechRecognition) {
      setError("Browser Anda tidak mendukung input suara")
      return
    }

    setError(null)
    clearSilenceTimeout()

    SpeechRecognition.startListening({
      language: mergedOptions.language,
      continuous: mergedOptions.continuous,
    }).catch((err: Error) => {
      setError(err.message || "Gagal memulai pengenalan suara")
    })
  }, [browserSupportsSpeechRecognition, mergedOptions, clearSilenceTimeout])

  // Stop listening
  const stopListening = React.useCallback(() => {
    clearSilenceTimeout()
    SpeechRecognition.stopListening()
  }, [clearSilenceTimeout])

  // Reset transcript
  const resetTranscript = React.useCallback(() => {
    baseResetTranscript()
    lastTranscriptRef.current = ""
    setError(null)
  }, [baseResetTranscript])

  // Toggle listening state
  const toggleListening = React.useCallback(() => {
    if (listening) {
      stopListening()
    } else {
      startListening()
    }
  }, [listening, startListening, stopListening])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      clearSilenceTimeout()
      SpeechRecognition.abortListening()
    }
  }, [clearSilenceTimeout])

  return {
    transcript,
    isListening: listening,
    isSupported: browserSupportsSpeechRecognition,
    error,
    startListening,
    stopListening,
    resetTranscript,
    toggleListening,
  }
}

export default useSpeechRecognition
