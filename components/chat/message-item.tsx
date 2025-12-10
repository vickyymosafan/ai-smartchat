"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { MarkdownRenderer } from "./markdown-renderer"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User } from "lucide-react"
import Image from "next/image"
import type { Message } from "@/types"

interface MessageItemProps {
  message: Message
}

export const MessageItem = React.memo(function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3 px-4 py-4 sm:px-6", isUser ? "flex-row-reverse" : "flex-row")}>
      {isUser ? (
        <Avatar className="h-8 w-8 shrink-0 bg-primary">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      ) : (
        <Image src="/UMJ.png" alt="AI" width={32} height={32} className="h-8 w-8 shrink-0 rounded-full" />
      )}

      <div className={cn("flex-1 min-w-0 max-w-[85%] sm:max-w-[75%]", isUser ? "flex flex-col items-end" : "")}>
        {isUser ? (
          <div className="rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5">
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          </div>
        ) : (
          <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
            <MarkdownRenderer content={message.content} />
          </div>
        )}
      </div>
    </div>
  )
})
