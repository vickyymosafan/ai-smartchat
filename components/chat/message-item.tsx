"use client"

/**
 * MessageItem Component (Refactored with SOLID Principles)
 * 
 * ISP: Uses segregated prop interfaces
 * OCP: Extensible via userAvatar, assistantAvatar, renderContent props
 * SRP: Only handles message rendering
 * 
 * Performance: MarkdownRenderer is lazy-loaded to reduce initial bundle
 */

import * as React from "react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User } from "lucide-react"
import Image from "next/image"
import type { MessageItemProps } from "@/types/segregated-props"

// Lazy load MarkdownRenderer (~100KB react-markdown bundle)
// This significantly reduces initial page load time
const MarkdownRenderer = dynamic(
  () => import("./markdown-renderer").then((mod) => mod.MarkdownRenderer),
  {
    loading: () => (
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    ),
    ssr: false, // Client-side only - improves SSR performance
  }
)

// ============================================
// Default Avatars (OCP - can be overridden)
// ============================================

const DefaultUserAvatar = () => (
  <Avatar className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 bg-primary">
    <AvatarFallback className="bg-primary text-primary-foreground">
      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
    </AvatarFallback>
  </Avatar>
)

const DefaultAssistantAvatar = () => (
  <Image 
    src="/UMJ.webp" 
    alt="AI" 
    width={32} 
    height={32} 
    className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 rounded-full" 
  />
)

// ============================================
// Default Content Renderers (OCP - can be overridden)
// ============================================

const DefaultUserContent = ({ content }: { content: string }) => (
  <div className="rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-3 py-2 sm:px-4 sm:py-2.5">
    <p className="text-xs sm:text-sm whitespace-pre-wrap wrap-break-word">{content}</p>
  </div>
)

const DefaultAssistantContent = ({ content }: { content: string }) => (
  <div className="rounded-2xl rounded-tl-sm bg-muted px-3 py-2 sm:px-4 sm:py-3">
    <MarkdownRenderer content={content} />
  </div>
)

// ============================================
// Component Implementation
// ============================================

export const MessageItem = React.memo(function MessageItem({
  // Display props (required)
  message,
  className,
  
  // Extension props (OCP)
  userAvatar,
  assistantAvatar,
  renderContent,
}: MessageItemProps) {
  const isUser = message.role === "user"

  // Resolve avatar (OCP - customizable)
  const avatar = isUser 
    ? (userAvatar ?? <DefaultUserAvatar />)
    : (assistantAvatar ?? <DefaultAssistantAvatar />)

  // Resolve content (OCP - customizable)
  const content = renderContent 
    ? renderContent(message.content, message.role as 'user' | 'assistant')
    : (isUser 
        ? <DefaultUserContent content={message.content} />
        : <DefaultAssistantContent content={message.content} />
      )

  return (
    <div className={cn("w-full py-2.5 sm:py-3 md:py-4", className)}>
      <div 
        className={cn(
          "max-w-4xl mx-auto flex gap-2 sm:gap-3 px-3 sm:px-4",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {avatar}

        <div className={cn(
          "flex-1 min-w-0 max-w-[90%] sm:max-w-[85%] md:max-w-[75%]", 
          isUser ? "flex flex-col items-end" : ""
        )}>
          {content}
        </div>
      </div>
    </div>
  )
})
