"use client"

import * as React from "react"
import { MessageItem } from "./message-item"
import { useChat } from "@/components/providers/chat-provider"
import { Loader2 } from "lucide-react"

export function MessageList() {
  const { messages, isLoading } = useChat()
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const bottomRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto overscroll-contain">
      <div className="py-4">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 px-4 py-4 sm:px-6">
            <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Loader2 className="h-4 w-4 text-white animate-spin" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 max-w-[85%] sm:max-w-[75%]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                  </div>
                  <span className="text-sm text-muted-foreground">Sedang mengetik...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
