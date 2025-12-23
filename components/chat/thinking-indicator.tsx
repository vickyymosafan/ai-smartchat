"use client"

/**
 * ThinkingIndicator Component
 * 
 * Displays dynamic thinking status with rotating messages
 * similar to ChatGPT/Claude thinking indicators.
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2, ChevronDown, ChevronUp, Sparkles } from "lucide-react"
import type { ThinkingPhase, ThinkingState } from "@/types/segregated-props"

// ============================================
// Phase Icons & Colors
// ============================================

const PHASE_CONFIG: Record<ThinkingPhase, { icon: React.ReactNode; color: string }> = {
  analyzing: {
    icon: <Sparkles className="h-3.5 w-3.5" />,
    color: "text-blue-400",
  },
  searching: {
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
    color: "text-purple-400",
  },
  comparing: {
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
    color: "text-amber-400",
  },
  generating: {
    icon: <Sparkles className="h-3.5 w-3.5" />,
    color: "text-green-400",
  },
}

// ============================================
// Props Interface
// ============================================

interface ThinkingIndicatorProps {
  thinkingState: ThinkingState
  onSkip?: () => void
  className?: string
  isCollapsible?: boolean
}

// ============================================
// Component Implementation
// ============================================

export const ThinkingIndicator = React.memo(function ThinkingIndicator({
  thinkingState,
  onSkip,
  className,
  isCollapsible = true,
}: ThinkingIndicatorProps) {
  const [isExpanded, setIsExpanded] = React.useState(true)
  const { isThinking, currentPhase, currentMessage, progress } = thinkingState

  if (!isThinking) return null

  const phaseConfig = PHASE_CONFIG[currentPhase]

  return (
    <div className={cn("w-full pb-4 mb-3", className)}>
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <div className="bg-muted/50 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
          {/* Header - Clickable to collapse/expand */}
          <button
            type="button"
            onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3",
              "hover:bg-muted/70 transition-colors",
              isCollapsible && "cursor-pointer"
            )}
          >
            <div className="flex items-center gap-3">
              {/* Animated dots */}
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce" />
              </div>
              
              {/* Phase indicator */}
              <div className={cn("flex items-center gap-2", phaseConfig.color)}>
                {phaseConfig.icon}
                <span className="text-sm font-medium capitalize">
                  {currentPhase === 'analyzing' && 'Menganalisis'}
                  {currentPhase === 'searching' && 'Mencari'}
                  {currentPhase === 'comparing' && 'Membandingkan'}
                  {currentPhase === 'generating' && 'Menyusun'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Skip button */}
              {onSkip && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSkip()
                  }}
                  className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                >
                  Jawab sekarang
                </button>
              )}
              
              {/* Collapse toggle */}
              {isCollapsible && (
                <div className="text-muted-foreground">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              )}
            </div>
          </button>

          {/* Expanded content - Current message */}
          {isExpanded && (
            <div className="px-4 pb-3 animate-in slide-in-from-top-2 duration-200">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentMessage}
              </p>
              
              {/* Progress bar */}
              <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
