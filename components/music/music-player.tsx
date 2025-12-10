"use client"

import * as React from "react"
import { useMusic } from "@/components/providers/music-provider"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, FileText, X } from "lucide-react"

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

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
  const previousVolume = React.useRef(volume)

  const handleVolumeToggle = () => {
    if (volume > 0) {
      previousVolume.current = volume
      setVolume(0)
    } else {
      setVolume(previousVolume.current || 0.5)
    }
  }

  return (
    <>
      <div className="p-2 sm:p-3 border-t border-sidebar-border">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Music className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Musik Latar</span>
          </div>
          {(currentTrack?.lyrics || playlist.some(t => t.lyrics)) && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 sm:h-6 sm:w-6"
              onClick={() => setShowLyrics(true)}
              title="Lihat Lirik"
            >
              <FileText className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </Button>
          )}
        </div>

        {/* Track Info - Clickable to show lyrics */}
        <div 
          className={`mb-2 sm:mb-3 ${currentTrack?.lyrics ? 'cursor-pointer hover:opacity-80' : ''}`}
          onClick={() => currentTrack?.lyrics && setShowLyrics(true)}
        >
          <p className="text-xs sm:text-sm font-medium truncate text-sidebar-foreground">
            {currentTrack?.title || "Tidak ada lagu"}
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
            {currentTrack?.artist || "Pilih lagu untuk diputar"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-2 sm:mb-3">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={([value]) => seekTo(value)}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={prevTrack}>
            <SkipBack className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="sr-only">Sebelumnya</span>
          </Button>

          <Button variant="default" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" onClick={toggle}>
            {isPlaying ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4 ml-0.5" />}
            <span className="sr-only">{isPlaying ? "Jeda" : "Putar"}</span>
          </Button>

          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={nextTrack}>
            <SkipForward className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="sr-only">Selanjutnya</span>
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
          <Button variant="ghost" size="icon" className="h-5 w-5 sm:h-6 sm:w-6" onClick={handleVolumeToggle}>
            {volume === 0 ? <VolumeX className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <Volume2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
          </Button>
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={([value]) => setVolume(value / 100)}
            className="flex-1"
          />
        </div>

        {/* Playlist Count */}
        <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-1.5 sm:mt-2">{playlist.length} lagu dalam playlist</p>
      </div>

      {/* Lyrics Popup */}
      {showLyrics && (currentTrack?.lyrics || playlist[0]?.lyrics) && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowLyrics(false)}
        >
          <div 
            className="bg-card border border-border rounded-lg shadow-xl w-full max-w-sm sm:max-w-md max-h-[85vh] sm:max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
              <div className="min-w-0 flex-1 mr-2">
                <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{currentTrack?.title || playlist[0]?.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{currentTrack?.artist || playlist[0]?.artist}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
                onClick={() => setShowLyrics(false)}
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>

            {/* Lyrics Content */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              <div className="whitespace-pre-line text-xs sm:text-sm text-foreground leading-relaxed pb-4">
                {currentTrack?.lyrics || playlist[0]?.lyrics}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
