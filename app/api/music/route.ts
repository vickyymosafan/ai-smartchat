import { NextResponse } from "next/server"

// Default playlist with lyrics
const defaultPlaylist = [
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

export async function GET() {
  return NextResponse.json({ playlist: defaultPlaylist })
}
