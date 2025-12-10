"use client"
import { Button } from "@/components/ui/button"
import { useChat } from "@/components/providers/chat-provider"

const suggestions = [
  {
    title: "Apa saja jalur pendaftaran yang tersedia untuk calon mahasiswa baru Unmuh Jember?",
  },
  {
    title: "Kapan Universitas Muhammadiyah Jember didirikan dan siapa yang mendirikannya?",
  },
  {
    title: "Apa saja jenis beasiswa yang tersedia di Unmuh Jember?",
  },
  {
    title: "Dengan siapa saja Program Studi Pendidikan Olahraga menjalin kerjasama di tingkat lokal?",
  },
]

export function SuggestedQuestions() {
  const { sendMessage, isLoading } = useChat()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-auto p-4 text-left justify-start whitespace-normal text-sm bg-muted/50 hover:bg-muted border-border/50 hover:border-border transition-all"
          onClick={() => sendMessage(suggestion.title)}
          disabled={isLoading}
        >
          {suggestion.title}
        </Button>
      ))}
    </div>
  )
}
