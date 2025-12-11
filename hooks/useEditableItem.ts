"use client"

/**
 * useEditableItem Hook (SRP - Single Responsibility Principle)
 * 
 * Handles ONLY inline editing state:
 * - Track which item is being edited
 * - Manage edit value
 * - Handle submit/cancel
 */

import * as React from "react"

interface UseEditableItemOptions<T = string> {
  onSubmit: (id: T, value: string) => Promise<void>
}

interface EditableItemState<T = string> {
  editingId: T | null
  editValue: string
  inputRef: React.RefObject<HTMLInputElement | null>
  startEdit: (id: T, currentValue: string) => void
  updateValue: (value: string) => void
  submitEdit: () => Promise<void>
  cancelEdit: () => void
  isEditing: (id: T) => boolean
}

export function useEditableItem<T = string>(
  options: UseEditableItemOptions<T>
): EditableItemState<T> {
  const { onSubmit } = options
  
  const [editingId, setEditingId] = React.useState<T | null>(null)
  const [editValue, setEditValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const startEdit = React.useCallback((id: T, currentValue: string) => {
    setEditingId(id)
    setEditValue(currentValue)
    // Focus input after render
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [])

  const updateValue = React.useCallback((value: string) => {
    setEditValue(value)
  }, [])

  const submitEdit = React.useCallback(async () => {
    if (editingId !== null && editValue.trim()) {
      await onSubmit(editingId, editValue.trim())
    }
    setEditingId(null)
    setEditValue("")
  }, [editingId, editValue, onSubmit])

  const cancelEdit = React.useCallback(() => {
    setEditingId(null)
    setEditValue("")
  }, [])

  const isEditing = React.useCallback((id: T): boolean => {
    return editingId === id
  }, [editingId])

  return {
    editingId,
    editValue,
    inputRef,
    startEdit,
    updateValue,
    submitEdit,
    cancelEdit,
    isEditing,
  }
}
