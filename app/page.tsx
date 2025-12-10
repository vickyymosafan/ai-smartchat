"use client"

import * as React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ChatContainer } from "@/components/chat/chat-container"
import { AboutDialog } from "@/components/ui/about-dialog"

export default function HomePage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)
  const [isAboutOpen, setIsAboutOpen] = React.useState(false)

  const toggleSidebar = React.useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev)
  }, [])

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} onOpenAbout={() => setIsAboutOpen(true)} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <Header
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          onOpenAbout={() => setIsAboutOpen(true)}
        />
        <main className="flex-1 h-0">
          <ChatContainer />
        </main>
      </div>

      {/* About Dialog */}
      <AboutDialog open={isAboutOpen} onOpenChange={setIsAboutOpen} />
    </div>
  )
}
