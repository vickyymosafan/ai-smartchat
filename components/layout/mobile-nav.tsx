"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@/components/providers/chat-provider"
import { MusicPlayer } from "@/components/music/music-player"
import { Menu, Plus, MessageSquare, Trash2, MoreHorizontal, Info } from "lucide-react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  onOpenAbout: () => void
}

export function MobileNav({ onOpenAbout }: MobileNavProps) {
  const { chatHistories, currentChatId, createNewChat, selectChat, deleteChat } = useChat()
  const [open, setOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [chatToDelete, setChatToDelete] = React.useState<string | null>(null)

  const handleDeleteClick = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setChatToDelete(chatId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (chatToDelete) {
      deleteChat(chatToDelete)
      setChatToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId)
    setOpen(false)
  }

  const handleNewChat = () => {
    createNewChat()
    setOpen(false)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Buka menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 flex flex-col">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Image src="/UMJ.png" alt="Logo" width={32} height={32} className="rounded-lg" />
              Smartchat Assistant
            </SheetTitle>
          </SheetHeader>

          {/* New Chat Button */}
          <div className="p-3">
            <Button
              onClick={handleNewChat}
              variant="outline"
              className="w-full justify-start gap-2 border-dashed bg-transparent"
            >
              <Plus className="h-4 w-4" />
              Percakapan Baru
            </Button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Riwayat</h3>
            </div>
            <ScrollArea className="flex-1 px-3">
              <div className="space-y-1 pb-4">
                {chatHistories.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">Belum ada percakapan</p>
                ) : (
                  chatHistories.map((chat) => (
                    <div
                      key={chat.id}
                      className={cn(
                        "group flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors",
                        currentChatId === chat.id
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground hover:bg-accent/50",
                      )}
                      onClick={() => handleSelectChat(chat.id)}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0 opacity-70" />
                      <span className="flex-1 truncate text-sm">{chat.title}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => handleDeleteClick(chat.id, e as unknown as React.MouseEvent)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Music Player */}
          <MusicPlayer />

          {/* About Button */}
          <div className="p-3 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => {
                onOpenAbout()
                setOpen(false)
              }}
            >
              <Info className="h-4 w-4" />
              Tentang
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Percakapan?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Percakapan ini akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
