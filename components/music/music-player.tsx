"use client"

/**
 * MusicPlayer Component - Performance Optimized
 * 
 * Split into isolated memoized sub-components to prevent
 * the entire player from re-rendering every second when currentTime updates.
 * 
 * Components:
 * - TrackInfo: Only re-renders when track changes
 * - ProgressBar: Isolated for time updates
 * - PlaybackControls: Only re-renders on play state change
 * - VolumeControl: Isolated from other state
 */

import * as React from "react"
import dynamic from "next/dynamic"
import { useMusic } from "@/components/providers/music-provider"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { formatTime } from "@/lib/utils"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, FileText } from "lucide-react"
import type { BackgroundMusic } from "@/types"

// Lazy load LyricsModal - only loads when user opens lyrics
const LyricsModal = dynamic(
  () => import("@/components/dialogs/lyrics-modal").then((mod) => mod.LyricsModal),
  { ssr: false }
)

// ============================================
// Track Info Component (Memoized)
// Only re-renders when track changes
// ============================================
interface TrackInfoProps {
  track: BackgroundMusic | null
  onLyricsClick?: () => void
}

const TrackInfo = React.memo(function TrackInfo({ track, onLyricsClick }: TrackInfoProps) {
  return (
    <div
      className={`mb-2 sm:mb-3 ${track?.lyrics ? "cursor-pointer hover:opacity-80" : ""}`}
      onClick={() => track?.lyrics && onLyricsClick?.()}
    >
      <p className="text-xs sm:text-sm font-medium truncate text-sidebar-foreground">
        {track?.title || "Tidak ada lagu"}
      </p>
      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
        {track?.artist || "Pilih lagu untuk diputar"}
      </p>
    </div>
  )
})

// ============================================
// Progress Bar Component (Memoized)
// Isolated for frequent time updates
// ============================================
interface ProgressBarProps {
  currentTime: number
  duration: number
  onSeek: (value: number) => void
}

const ProgressBar = React.memo(function ProgressBar({ 
  currentTime, 
  duration, 
  onSeek 
}: ProgressBarProps) {
  const handleValueChange = React.useCallback(
    ([value]: number[]) => onSeek(value),
    [onSeek]
  )

  return (
    <div className="mb-2 sm:mb-3">
      <Slider
        value={[currentTime]}
        max={duration || 100}
        step={1}
        onValueChange={handleValueChange}
        className="cursor-pointer"
      />
      <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
})

// ============================================
// Playback Controls Component (Memoized)
// Only re-renders on play state change
// ============================================
interface PlaybackControlsProps {
  isPlaying: boolean
  onToggle: () => void
  onPrev: () => void
  onNext: () => void
}

const PlaybackControls = React.memo(function PlaybackControls({
  isPlaying,
  onToggle,
  onPrev,
  onNext,
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={onPrev}>
        <SkipBack className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="sr-only">Sebelumnya</span>
      </Button>

      <Button variant="default" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" onClick={onToggle}>
        {isPlaying ? (
          <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
        ) : (
          <Play className="h-3 w-3 sm:h-4 sm:w-4 ml-0.5" />
        )}
        <span className="sr-only">{isPlaying ? "Jeda" : "Putar"}</span>
      </Button>

      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={onNext}>
        <SkipForward className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="sr-only">Selanjutnya</span>
      </Button>
    </div>
  )
})

// ============================================
// Volume Control Component (Memoized)
// Isolated from other state
// ============================================
interface VolumeControlProps {
  volume: number
  onVolumeChange: (value: number) => void
}

const VolumeControl = React.memo(function VolumeControl({ 
  volume, 
  onVolumeChange 
}: VolumeControlProps) {
  const previousVolume = React.useRef(volume)

  const handleVolumeToggle = React.useCallback(() => {
    if (volume > 0) {
      previousVolume.current = volume
      onVolumeChange(0)
    } else {
      onVolumeChange(previousVolume.current || 0.5)
    }
  }, [volume, onVolumeChange])

  const handleSliderChange = React.useCallback(
    ([value]: number[]) => onVolumeChange(value / 100),
    [onVolumeChange]
  )

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
      <Button variant="ghost" size="icon" className="h-5 w-5 sm:h-6 sm:w-6" onClick={handleVolumeToggle}>
        {volume === 0 ? (
          <VolumeX className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        ) : (
          <Volume2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        )}
      </Button>
      <Slider
        value={[volume * 100]}
        max={100}
        step={1}
        onValueChange={handleSliderChange}
        className="flex-1"
      />
    </div>
  )
})

// ============================================
// Header Component (Memoized)
// ============================================
interface PlayerHeaderProps {
  hasLyrics: boolean
  onLyricsClick: () => void
}

const PlayerHeader = React.memo(function PlayerHeader({ 
  hasLyrics, 
  onLyricsClick 
}: PlayerHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Music className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Musik Latar</span>
      </div>
      {hasLyrics && (
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 sm:h-6 sm:w-6"
          onClick={onLyricsClick}
          title="Lihat Lirik"
        >
          <FileText className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        </Button>
      )}
    </div>
  )
})

// ============================================
// Main MusicPlayer Component
// ============================================
export function MusicPlayer() {
  const {
    currentTrack,
    playlist,
    isPlaying,
    volume,
    currentTime,
    duration,
    toggle,
    nextTrack,
    prevTrack,
    setVolume,
    seekTo,
  } = useMusic()

  const [showLyrics, setShowLyrics] = React.useState(false)

  // Memoize callbacks to prevent child re-renders
  const handleOpenLyrics = React.useCallback(() => setShowLyrics(true), [])
  const handleCloseLyrics = React.useCallback(() => setShowLyrics(false), [])
  const handleSeek = React.useCallback((value: number) => seekTo(value), [seekTo])

  // Derive values
  const hasLyrics = Boolean(currentTrack?.lyrics || playlist.some((t) => t.lyrics))
  const lyricsTrack = currentTrack?.lyrics ? currentTrack : playlist.find((t) => t.lyrics) || null

  return (
    <>
      <div className="p-2 sm:p-3 border-t border-sidebar-border">
        <PlayerHeader hasLyrics={hasLyrics} onLyricsClick={handleOpenLyrics} />
        
        <TrackInfo track={currentTrack} onLyricsClick={handleOpenLyrics} />
        
        <ProgressBar 
          currentTime={currentTime} 
          duration={duration} 
          onSeek={handleSeek} 
        />
        
        <PlaybackControls
          isPlaying={isPlaying}
          onToggle={toggle}
          onPrev={prevTrack}
          onNext={nextTrack}
        />
        
        <VolumeControl volume={volume} onVolumeChange={setVolume} />

        {/* Playlist Count */}
        <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-1.5 sm:mt-2">
          {playlist.length} lagu dalam playlist
        </p>
      </div>

      {/* Conditionally render LyricsModal - only loads when needed */}
      {showLyrics && (
        <LyricsModal open={showLyrics} onClose={handleCloseLyrics} track={lyricsTrack} />
      )}
    </>
  )
}
