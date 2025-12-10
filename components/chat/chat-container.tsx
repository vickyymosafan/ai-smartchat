"use client"

import { useChat } from "@/components/providers/chat-provider"
import { MessageList } from "./message-list"
import { ChatInput } from "./chat-input"
import { WelcomeScreen } from "./welcome-screen"

export function ChatContainer() {
  const { messages } = useChat()
  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 min-h-0 overflow-hidden">{hasMessages ? <MessageList /> : <WelcomeScreen />}</div>
      <ChatInput />
    </div>
  )
}
