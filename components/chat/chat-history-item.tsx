"use client"

/**
 * ChatHistoryItem Component (Refactored with SOLID Principles)
 * 
 * ISP: Uses segregated prop interfaces
 * OCP: Extensible via icon, actions, and renderContent props
 * SRP: Only handles item rendering, edit state comes from parent
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Trash2, Pencil, Check, X, MessageSquare } from "lucide-react"
import type { ChatHistoryItemProps, ChatItemAction } from "@/types/segregated-props"

// ============================================
// Default Actions (OCP - can be overridden)
// ============================================

const createDefaultActions = (
  onRenameClick?: () => void,
  onDeleteClick?: () => void
): ChatItemAction[] => {
  const actions: ChatItemAction[] = []
  
  if (onRenameClick) {
    actions.push({
      label: "Ubah Nama",
      icon: <Pencil className="h-4 w-4 mr-2" />,
      onClick: onRenameClick,
    })
  }
  
  if (onDeleteClick) {
    actions.push({
      label: "Hapus",
      icon: <Trash2 className="h-4 w-4 mr-2" />,
      onClick: onDeleteClick,
      variant: "destructive",
    })
  }
  
  return actions
}

// ============================================
// Dynamic Title Sizing (based on character length)
// ============================================

function getTitleSizeClass(title: string): string {
  const len = title.length
  
  if (len <= 25) return "text-sm"           // Short: 14px
  if (len <= 40) return "text-xs"           // Medium: 12px  
  if (len <= 60) return "text-[11px]"       // Long: 11px
  return "text-[10px]"                      // Very long: 10px (minimum)
}
// ============================================
// Component Implementation
// ============================================

export function ChatHistoryItem({
  // Display props (required)
  chat,
  isActive,
  onSelect,
  className,
  
  // Edit props (optional)
  isEditing = false,
  editTitle = "",
  onEditTitleChange,
  onRenameClick,
  onRenameSubmit,
  onRenameCancel,
  inputRef,
  
  // Action props (optional)
  onDeleteClick,
  
  // Extension props (OCP)
  icon,
  actions,
  renderContent,
}: ChatHistoryItemProps) {
  // Keyboard handler for edit mode
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onRenameSubmit) onRenameSubmit()
    if (e.key === "Escape" && onRenameCancel) onRenameCancel()
  }

  // Resolve icon (OCP - customizable)
  const itemIcon = icon ?? <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 opacity-70" />

  // Resolve actions (OCP - customizable)
  const menuActions = actions ?? createDefaultActions(onRenameClick, onDeleteClick)

  // Render content (OCP - customizable)
  const content = renderContent ? renderContent(chat) : (
    <span className={cn(
      "flex-1 line-clamp-2 wrap-break-word leading-tight",
      getTitleSizeClass(chat.title)
    )}>
      {chat.title}
    </span>
  )

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={cn(
            "group flex items-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 cursor-pointer transition-colors no-select-touch",
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50",
            className
          )}
          onClick={() => !isEditing && onSelect()}
        >
          {itemIcon}

          {isEditing ? (
            <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <Input
                ref={inputRef}
                value={editTitle}
                onChange={(e) => onEditTitleChange?.(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-5 sm:h-6 text-xs sm:text-sm py-0 px-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 sm:h-5 sm:w-5"
                onClick={onRenameSubmit}
              >
                <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 sm:h-5 sm:w-5" 
                onClick={onRenameCancel}
              >
                <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </Button>
            </div>
          ) : (
            <>
              {content}
              
              {/* Action buttons - visible on mobile, shown on hover for desktop */}
              {(onRenameClick || onDeleteClick) && (
                <div
                  className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  {onRenameClick && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground hover:text-foreground"
                      onClick={onRenameClick}
                    >
                      <Pencil className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="sr-only">Ubah nama</span>
                    </Button>
                  )}
                  {onDeleteClick && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground hover:text-destructive"
                      onClick={onDeleteClick}
                    >
                      <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="sr-only">Hapus</span>
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </ContextMenuTrigger>
      
      {/* Context Menu - uses actions array (OCP) */}
      {menuActions.length > 0 && (
        <ContextMenuContent className="w-40">
          {menuActions.map((action, index) => (
            <ContextMenuItem
              key={index}
              className={action.variant === "destructive" ? "text-destructive focus:text-destructive" : ""}
              onClick={action.onClick}
            >
              {action.icon}
              {action.label}
            </ContextMenuItem>
          ))}
        </ContextMenuContent>
      )}
    </ContextMenu>
  )
}
