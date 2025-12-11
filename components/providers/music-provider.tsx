"use client"

import * as React from "react"
import type { BackgroundMusic, MusicPlayerState } from "@/types"
import { DEFAULT_PLAYLIST } from "@/data/default-playlist"

interface MusicContextState extends MusicPlayerState {
  play: () => void
  pause: () => void
  toggle: () => void
  nextTrack: () => void
  prevTrack: () => void
  setVolume: (volume: number) => void
  seekTo: (time: number) => void
  selectTrack: (track: BackgroundMusic) => void
}

const MusicContext = React.createContext<MusicContextState | undefined>(undefined)

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [playlist, setPlaylist] = React.useState<BackgroundMusic[]>(DEFAULT_PLAYLIST)
  const [currentTrack, setCurrentTrack] = React.useState<BackgroundMusic | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [volume, setVolumeState] = React.useState(0.5)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)

  // Initialize audio element
  React.useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.volume = volume

    const audio = audioRef.current

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => setDuration(audio.duration || 0)
    const handleEnded = () => nextTrack()
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("durationchange", handleDurationChange)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("durationchange", handleDurationChange)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.pause()
    }
  }, [])

  // Load playlist from API (optional enhancement)
  React.useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const response = await fetch("/api/music")
        if (response.ok) {
          const data = await response.json()
          if (data.playlist?.length > 0) {
            setPlaylist(data.playlist)
          }
        }
      } catch (err) {
        // Use default playlist on error
        console.error("Using default playlist:", err)
      }
    }
    loadPlaylist()
  }, [])

  const play = React.useCallback(() => {
    if (!audioRef.current) return

    if (!currentTrack && playlist.length > 0) {
      setCurrentTrack(playlist[0])
      audioRef.current.src = playlist[0].url
    }
    audioRef.current.play().catch(console.error)
  }, [currentTrack, playlist])

  const pause = React.useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const toggle = React.useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, play, pause])

  const nextTrack = React.useCallback(() => {
    if (playlist.length === 0) return

    const currentIndex = currentTrack ? playlist.findIndex((t) => t.id === currentTrack.id) : -1
    const nextIndex = (currentIndex + 1) % playlist.length
    const next = playlist[nextIndex]

    setCurrentTrack(next)
    if (audioRef.current) {
      audioRef.current.src = next.url
      if (isPlaying) {
        audioRef.current.play().catch(console.error)
      }
    }
  }, [currentTrack, playlist, isPlaying])

  const prevTrack = React.useCallback(() => {
    if (playlist.length === 0) return

    const currentIndex = currentTrack ? playlist.findIndex((t) => t.id === currentTrack.id) : 0
    const prevIndex = currentIndex <= 0 ? playlist.length - 1 : currentIndex - 1
    const prev = playlist[prevIndex]

    setCurrentTrack(prev)
    if (audioRef.current) {
      audioRef.current.src = prev.url
      if (isPlaying) {
        audioRef.current.play().catch(console.error)
      }
    }
  }, [currentTrack, playlist, isPlaying])

  const setVolume = React.useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolumeState(clampedVolume)
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume
    }
  }, [])

  const seekTo = React.useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }, [])

  const selectTrack = React.useCallback((track: BackgroundMusic) => {
    setCurrentTrack(track)
    if (audioRef.current) {
      audioRef.current.src = track.url
      audioRef.current.play().catch(console.error)
    }
  }, [])

  const value = React.useMemo(
    () => ({
      currentTrack,
      playlist,
      isPlaying,
      volume,
      currentTime,
      duration,
      play,
      pause,
      toggle,
      nextTrack,
      prevTrack,
      setVolume,
      seekTo,
      selectTrack,
    }),
    [
      currentTrack,
      playlist,
      isPlaying,
      volume,
      currentTime,
      duration,
      play,
      pause,
      toggle,
      nextTrack,
      prevTrack,
      setVolume,
      seekTo,
      selectTrack,
    ],
  )

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
}

export function useMusic() {
  const context = React.useContext(MusicContext)
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider")
  }
  return context
}
