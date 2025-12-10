"use client"

import { MessageSquare } from "lucide-react"
import { SuggestedQuestions } from "./suggested-questions"

export function WelcomeScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">Smartchat AI Assistant</h1>
          <p className="text-muted-foreground text-lg">
            Mulai percakapan dengan AI untuk bantuan, saran, dan pertanyaan
          </p>
        </div>

        {/* Suggested Questions */}
        <div className="pt-4">
          <SuggestedQuestions />
        </div>
      </div>
    </div>
  )
}
