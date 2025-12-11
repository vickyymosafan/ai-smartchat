"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { BackgroundMusic } from "@/types"

interface LyricsModalProps {
  open: boolean
  onClose: () => void
  track: BackgroundMusic | null
}

export function LyricsModal({ open, onClose, track }: LyricsModalProps) {
  if (!open || !track?.lyrics) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-lg shadow-xl w-full max-w-sm sm:max-w-md max-h-[85vh] sm:max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
          <div className="min-w-0 flex-1 mr-2">
            <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{track.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{track.artist}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
            onClick={onClose}
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* Lyrics Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="whitespace-pre-line text-xs sm:text-sm text-foreground leading-relaxed pb-4">
            {track.lyrics}
          </div>
        </div>
      </div>
    </div>
  )
}
