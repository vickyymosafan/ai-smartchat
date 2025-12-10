import { NextResponse } from "next/server"

// Default playlist
const defaultPlaylist = [
  {
    id: "1",
    title: "Kampus Biru Langkah Baru",
    artist: "Universitas Muhammadiyah Jember",
    url: "https://atddgwpoppuuarddneip.supabase.co/storage/v1/object/public/background-music/Kampus%20Biru%20Langkah%20Baru.mp3",
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
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET() {
  return NextResponse.json({ playlist: defaultPlaylist })
}
