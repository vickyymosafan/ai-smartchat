import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a unique ID with a given prefix
 * @param prefix - The prefix for the ID (e.g., 'session', 'chat', 'msg')
 * @returns A unique ID string like 'prefix_1234567890_abc123def'
 */
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Get the current timestamp in ISO format
 * @returns Current date/time as ISO string
 */
export function nowISO(): string {
  return new Date().toISOString()
}

/**
 * Format seconds into a time string (e.g., "2:34")
 * @param seconds - Number of seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}
