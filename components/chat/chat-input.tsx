"use client"

/**
 * ChatInput Component - Performance Optimized with Voice Input
 * 
 * Optimizations:
 * - Debounced textarea resize to prevent layout thrashing
 * - Memoized callbacks to prevent unnecessary re-renders
 * - Uses mobile-safe backdrop blur
 * - Touch-friendly interaction handling
 * - Voice input support with Web Speech API
 */

import * as React from "react"
import { useDebouncedCallback } from "use-debounce"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useChat } from "@/components/providers/chat-provider"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { VoiceButton } from "./voice-button"
import { Send } from "lucide-react"

export function ChatInput() {
  const { sendMessage, isLoading } = useChat()
  const [input, setInput] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Speech recognition hook
  const {
    transcript,
    isListening,
    isSupported,
    error: speechError,
    toggleListening,
    resetTranscript,
  } = useSpeechRecognition()

  // Sync transcript to input when speech is captured
  React.useEffect(() => {
    if (transcript && transcript.length > 0) {
      setInput((prev) => {
        // If previous input exists, append with space
        const separator = prev.trim().length > 0 ? " " : ""
        return prev.trim() + separator + transcript
      })
    }
  }, [transcript])

  // Reset transcript after it's been synced to input
  React.useEffect(() => {
    if (!isListening && transcript.length > 0) {
      // Delay reset to ensure transcript is synced
      const timer = setTimeout(() => {
        resetTranscript()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isListening, transcript, resetTranscript])

  const handleSubmit = React.useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()
      if (!input.trim() || isLoading) return

      const message = input.trim()
      setInput("")
      resetTranscript()
      
      // Reset textarea height immediately
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
      
      await sendMessage(message)

      // Refocus textarea after sending
      requestAnimationFrame(() => textareaRef.current?.focus())
    },
    [input, isLoading, sendMessage, resetTranscript],
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit],
  )

  // Debounced auto-resize to prevent layout thrashing on every keystroke
  // This significantly improves input performance on mobile devices
  const debouncedResize = useDebouncedCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      // Use requestAnimationFrame for smoother resize
      requestAnimationFrame(() => {
        textarea.style.height = "auto"
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px"
      })
    }
  }, 50) // 50ms debounce - fast enough to feel responsive, slow enough to batch updates

  // Trigger resize when input changes
  React.useEffect(() => {
    debouncedResize()
  }, [input, debouncedResize])

  // Memoized onChange to prevent child re-renders
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value)
    },
    []
  )

  // Handle voice button toggle
  const handleVoiceToggle = React.useCallback(() => {
    toggleListening()
  }, [toggleListening])

  return (
    <div className="border-t bg-background/95 backdrop-blur-mobile-safe">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-3 sm:p-4">
        <div className="relative flex items-end gap-2 touch-manipulation">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Sedang mendengarkan..." : "Tanyakan sesuatu..."}
              className="min-h-[44px] sm:min-h-[52px] max-h-[150px] sm:max-h-[200px] resize-none pr-20 sm:pr-24 py-2.5 sm:py-3 text-sm sm:text-base rounded-2xl bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring touch-manipulation"
              disabled={isLoading}
              rows={1}
              // Improve mobile input performance
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <div className="absolute right-2 bottom-1.5 sm:bottom-2 flex items-center gap-1">
              <VoiceButton
                isListening={isListening}
                isSupported={isSupported}
                isDisabled={isLoading}
                error={speechError}
                onToggle={handleVoiceToggle}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full touch-manipulation"
              >
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="sr-only">Kirim pesan</span>
              </Button>
            </div>
          </div>
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-1.5 sm:mt-2">
          {isListening ? (
            <span className="text-destructive animate-pulse">🎤 Merekam suara...</span>
          ) : (
            "Smartchat AI Assistant siap membantu Anda"
          )}
        </p>
      </form>
    </div>
  )
}

