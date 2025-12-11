"use client"

/**
 * Sidebar Component (Refactored with SOLID Principles)
 * 
 * SRP: Uses hooks for edit and dialog state management
 * DIP: Depends on useChat abstraction, not implementation
 * OCP: Can be extended via slots (header, footer, etc.)
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@/components/providers/chat-provider"
import { Plus, ChevronLeft, Info } from "lucide-react"
import Image from "next/image"
import { MusicPlayer } from "@/components/music/music-player"
import { ChatHistoryItem } from "@/components/chat/chat-history-item"
import { ConfirmDeleteDialog } from "@/components/dialogs/confirm-delete-dialog"

// Import hooks (SRP)
import { useEditableItem } from "@/hooks/useEditableItem"
import { useConfirmDialog } from "@/hooks/useConfirmDialog"

// ============================================
// Props Interface (OCP - Slot-based Extension)
// ============================================

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  onOpenAbout: () => void
  
  // Extension slots (OCP)
  headerSlot?: React.ReactNode
  footerSlot?: React.ReactNode
  beforeHistorySlot?: React.ReactNode
  afterHistorySlot?: React.ReactNode
}

// ============================================
// Component Implementation
// ============================================

export function Sidebar({
  isCollapsed,
  onToggle,
  onOpenAbout,
  headerSlot,
  footerSlot,
  beforeHistorySlot,
  afterHistorySlot,
}: SidebarProps) {
  // DIP: Depend on abstraction (useChat hook)
  const { chatHistories, currentChatId, createNewChat, selectChat, deleteChat, renameChat } = useChat()

  // SRP: Edit state managed by hook
  const editState = useEditableItem<string>({
    onSubmit: async (chatId, newTitle) => {
      await renameChat(chatId, newTitle)
    },
  })

  // SRP: Delete dialog state managed by hook
  const deleteDialog = useConfirmDialog<string>({
    onConfirm: async (chatId) => {
      await deleteChat(chatId)
    },
  })

  return (
    <>
      <aside
        className={cn(
          "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
          isCollapsed ? "w-0 overflow-hidden" : "w-64 lg:w-72",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-2 sm:p-3 border-b border-sidebar-border">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <Image src="/UMJ.png" alt="Logo" width={32} height={32} className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg" />
            <span className="font-semibold text-sidebar-foreground truncate text-sm sm:text-base">Smartchat</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="sr-only">Tutup sidebar</span>
          </Button>
        </div>

        {/* Header Slot (OCP) */}
        {headerSlot}

        {/* New Chat Button */}
        <div className="p-2 sm:p-3">
          <Button
            onClick={createNewChat}
            variant="outline"
            className="w-full justify-start gap-1.5 sm:gap-2 border-dashed bg-transparent text-xs sm:text-sm h-8 sm:h-9"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Percakapan Baru
          </Button>
        </div>

        {/* Before History Slot (OCP) */}
        {beforeHistorySlot}

        {/* Chat History */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="px-2 sm:px-3 py-1.5 sm:py-2">
            <h3 className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Riwayat</h3>
          </div>
          <ScrollArea className="flex-1 px-2 sm:px-3">
            <div className="space-y-0.5 sm:space-y-1 pb-4">
              {chatHistories.length === 0 ? (
                <p className="text-xs sm:text-sm text-muted-foreground py-4 text-center">Belum ada percakapan</p>
              ) : (
                chatHistories.map((chat) => (
                  <ChatHistoryItem
                    key={chat.id}
                    chat={chat}
                    isActive={currentChatId === chat.id}
                    onSelect={() => selectChat(chat.id)}
                    
                    // Edit props (from hook - SRP)
                    isEditing={editState.isEditing(chat.id)}
                    editTitle={editState.editValue}
                    onEditTitleChange={editState.updateValue}
                    onRenameClick={() => editState.startEdit(chat.id, chat.title)}
                    onRenameSubmit={editState.submitEdit}
                    onRenameCancel={editState.cancelEdit}
                    inputRef={editState.inputRef}
                    
                    // Delete action (from hook - SRP)
                    onDeleteClick={() => deleteDialog.openDialog(chat.id)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* After History Slot (OCP) */}
        {afterHistorySlot}

        {/* Music Player */}
        <MusicPlayer />

        {/* Footer Slot (OCP) */}
        {footerSlot}

        {/* About Button */}
        <div className="p-2 sm:p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-1.5 sm:gap-2 text-sidebar-foreground hover:bg-sidebar-accent text-xs sm:text-sm h-8 sm:h-9"
            onClick={onOpenAbout}
          >
            <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Tentang
          </Button>
        </div>
      </aside>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => !open && deleteDialog.closeDialog()}
        onConfirm={deleteDialog.confirm}
        title="Hapus Percakapan?"
        description="Tindakan ini tidak dapat dibatalkan. Percakapan ini akan dihapus secara permanen."
      />
    </>
  )
}
