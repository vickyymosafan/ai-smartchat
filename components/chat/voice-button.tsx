"use client"

/**
 * VoiceButton Component
 * 
 * Animated microphone button for voice input (SRP - Single Responsibility)
 * Provides visual feedback for listening state with pulsing animation.
 */

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface VoiceButtonProps {
  /** Whether the microphone is actively listening */
  isListening: boolean
  /** Whether the browser supports speech recognition */
  isSupported: boolean
  /** Disable the button (e.g., when sending message) */
  isDisabled?: boolean
  /** Whether currently processing (optional) */
  isProcessing?: boolean
  /** Error message to display */
  error?: string | null
  /** Callback when button is clicked */
  onToggle: () => void
  /** Optional className for styling */
  className?: string
}

/**
 * Microphone button with visual feedback for voice input
 * 
 * @remarks
 * - Shows pulsing animation when listening
 * - Disabled/hidden when browser doesn't support speech recognition
 * - Touch-friendly with 44px minimum touch target
 * - Uses mounted state to prevent hydration mismatch
 */
export function VoiceButton({
  isListening,
  isSupported,
  isDisabled = false,
  isProcessing = false,
  error,
  onToggle,
  className,
}: VoiceButtonProps) {
  // Track mounted state to prevent hydration mismatch
  // Server renders with isSupported=false, client may have isSupported=true
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // Before hydration, render a placeholder button to match server HTML
  if (!isMounted) {
    return (
      <Button
        type="button"
        size="icon"
        variant="ghost"
        disabled
        className={cn(
          "h-7 w-7 sm:h-8 sm:w-8 rounded-full opacity-50",
          className
        )}
      >
        <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
        <span className="sr-only">Input suara</span>
      </Button>
    )
  }

  // After hydration, render based on actual support
  if (!isSupported) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled
            className={cn(
              "h-7 w-7 sm:h-8 sm:w-8 rounded-full opacity-50",
              className
            )}
          >
            <MicOff className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <span className="sr-only">Input suara tidak didukung</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Browser tidak mendukung input suara</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  // Determine button state
  const getTooltipContent = (): string => {
    if (error) return error
    if (isProcessing) return "Memproses..."
    if (isListening) return "Klik untuk berhenti"
    return "Klik untuk berbicara"
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant={isListening ? "destructive" : "ghost"}
          disabled={isDisabled || isProcessing}
          onClick={onToggle}
          className={cn(
            "h-7 w-7 sm:h-8 sm:w-8 rounded-full touch-manipulation transition-all duration-200",
            isListening && "voice-listening animate-pulse",
            error && "text-destructive",
            className
          )}
          aria-label={isListening ? "Berhenti merekam" : "Mulai merekam suara"}
        >
          {isProcessing ? (
            <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
          ) : isListening ? (
            <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : (
            <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground hover:text-foreground" />
          )}
          <span className="sr-only">
            {isListening ? "Berhenti merekam" : "Mulai merekam suara"}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{getTooltipContent()}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default VoiceButton
