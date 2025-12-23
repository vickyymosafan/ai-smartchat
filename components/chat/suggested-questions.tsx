"use client"
import { Button } from "@/components/ui/button"
import { useChat } from "@/components/providers/chat-provider"

const suggestions = [
  {
    title: "Apa fokus keunggulan dari Program Studi Teknik Elektro Universitas Muhammadiyah Jember?",
  },
  {
    title: "Berapa SKS bobot Tugas Akhir (Skripsi) di Teknik Informatika?",
  },
  {
    title: "Apa peringkat akreditasi Program Studi Teknik Lingkungan saat ini?",
  },
  {
    title: "Apa dua fokus utama bidang keahlian di Teknik Mesin Unmuh Jember?",
  },
  {
    title: "Sebutkan 4 profil lulusan yang ditargetkan oleh Prodi Teknik Sipil!",
  },
  {
    title: "Sebutkan dua Kelompok Keahlian Dosen dan Keilmuan (KKDK) di Sistem Informasi!",
  },
]

export function SuggestedQuestions() {
  const { sendMessage, isLoading } = useChat()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-2xl mx-auto">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-auto p-3 sm:p-4 text-left justify-start whitespace-normal text-xs sm:text-sm bg-muted/50 hover:bg-muted border-border/50 hover:border-border transition-all"
          onClick={() => sendMessage(suggestion.title)}
          disabled={isLoading}
        >
          {suggestion.title}
        </Button>
      ))}
    </div>
  )
}
