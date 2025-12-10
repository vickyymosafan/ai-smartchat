"use client"

import * as React from "react"
import type { BackgroundMusic, MusicPlayerState } from "@/types"

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

// Default playlist with provided URLs
const defaultPlaylist: BackgroundMusic[] = [
  {
    id: "1",
    title: "Kampus Biru Langkah Baru",
    artist: "Universitas Muhammadiyah Jember",
    url: "https://atddgwpoppuuarddneip.supabase.co/storage/v1/object/public/background-music/Kampus%20Biru%20Langkah%20Baru.mp3",
    lyrics: `[Verse 1]
Kamu melangkah ke Universitas Muhammadiyah Jember.
Kampus biru menyambut dengan suasana yang hidup.

[Verse 2]
Mahasiswa berkumpul membawa ide segar.
Mereka siap belajar dan bergerak.

[Verse 3]
Dosen memberi arahan yang jelas.
Mereka mendorong kamu untuk berpikir dan mencoba.

[Chorus]
Setiap kelas terasa seperti langkah baru menuju masa depan.
Kamu melihat teman-teman yang saling bantu.
Semangat itu menular dan membuat kamu terus maju.

[Bridge]
Kampus biru jadi tempat lahirnya rencana dan karya.
Universitas Muhammadiyah Jember memberi ruang untuk berkembang.

[Chorus]
Kamu merasa yakin berjalan di jalur yang benar.
Hari berlalu tapi semangat di kampus biru tetap kuat.

[Outro]
Kamu terus melangkah.
Membawa harapan dan tujuan yang makin jelas.`,
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Kampus Biru Semangat Baru",
    artist: "Universitas Muhammadiyah Jember",
    url: "https://atddgwpoppuuarddneip.supabase.co/storage/v1/object/public/background-music/Kampus%20Biru%20Semangat%20Baru.mp3",
    lyrics: `[Verse 1]
Kamu melangkah masuk ke kampus biru dan merasakan semangat baru.
Setiap sudut penuh cerita tentang mimpi dan usaha.

[Chorus]
Universitas Muhammadiyah Jember menjadi tempat tumbuh dan belajar.
Teman teman berjalan bersama mengejar tujuan.

[Verse 2]
Dosen memberi arahan yang membuka cara berpikir.
Kamu menulis perjalananmu dari kelas ke kelas.

[Chorus]
Kampus biru menjadi saksi tumbuhnya keberanian dan keyakinan.
Suara diskusi dan tawa membuat hari terasa hidup.

[Bridge]
Kamu percaya masa depanmu mulai terbentuk di sini.

[Outro]
Kampus biru memberi ruang untuk terus maju dan menjadi lebih baik.`,
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [playlist, setPlaylist] = React.useState<BackgroundMusic[]>(defaultPlaylist)
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

  // Load playlist from Supabase (optional enhancement)
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
