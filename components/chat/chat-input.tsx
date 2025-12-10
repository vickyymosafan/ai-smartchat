"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useChat } from "@/components/providers/chat-provider"
import { Send } from "lucide-react"

export function ChatInput() {
  const { sendMessage, isLoading } = useChat()
  const [input, setInput] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSubmit = React.useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()
      if (!input.trim() || isLoading) return

      const message = input.trim()
      setInput("")
      await sendMessage(message)

      // Refocus textarea after sending
      setTimeout(() => textareaRef.current?.focus(), 0)
    },
    [input, isLoading, sendMessage],
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit],
  )

  // Auto-resize textarea
  React.useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px"
    }
  }, [input])

  return (
    <div className="border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-3 sm:p-4">
        <div className="relative flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanyakan sesuatu..."
              className="min-h-[44px] sm:min-h-[52px] max-h-[150px] sm:max-h-[200px] resize-none pr-11 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base rounded-2xl bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring"
              disabled={isLoading}
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-1.5 sm:bottom-2 h-7 w-7 sm:h-8 sm:w-8 rounded-full"
            >
              <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sr-only">Kirim pesan</span>
            </Button>
          </div>
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-1.5 sm:mt-2">Smartchat AI Assistant siap membantu Anda</p>
      </form>
    </div>
  )
}
