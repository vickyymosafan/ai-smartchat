"use client"

/**
 * useConfirmDialog Hook (SRP - Single Responsibility Principle)
 * 
 * Handles ONLY confirmation dialog state:
 * - Track open/close state
 * - Track item to confirm
 * - Handle confirm action
 */

import * as React from "react"

interface UseConfirmDialogOptions<T = string> {
  onConfirm: (item: T) => Promise<void>
  delay?: number  // Delay before opening (for context menu transition)
}

interface ConfirmDialogState<T = string> {
  isOpen: boolean
  itemToConfirm: T | null
  openDialog: (item: T) => void
  closeDialog: () => void
  confirm: () => Promise<void>
}

export function useConfirmDialog<T = string>(
  options: UseConfirmDialogOptions<T>
): ConfirmDialogState<T> {
  const { onConfirm, delay = 100 } = options
  
  const [isOpen, setIsOpen] = React.useState(false)
  const [itemToConfirm, setItemToConfirm] = React.useState<T | null>(null)

  const openDialog = React.useCallback((item: T) => {
    setItemToConfirm(item)
    // Delay opening to let context menu close first
    setTimeout(() => {
      setIsOpen(true)
    }, delay)
  }, [delay])

  const closeDialog = React.useCallback(() => {
    setIsOpen(false)
    setItemToConfirm(null)
  }, [])

  const confirm = React.useCallback(async () => {
    if (itemToConfirm !== null) {
      await onConfirm(itemToConfirm)
    }
    closeDialog()
  }, [itemToConfirm, onConfirm, closeDialog])

  return {
    isOpen,
    itemToConfirm,
    openDialog,
    closeDialog,
    confirm,
  }
}
