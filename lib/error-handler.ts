/**
 * Centralized error handling utilities
 */

/**
 * Log an error with context
 * @param context - Description of where the error occurred
 * @param error - The error object
 */
export function logError(context: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[${context}] ${message}`)
}

/**
 * Extract error message from unknown error type
 * @param error - The error object
 * @returns Error message string
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

/**
 * Handle API errors consistently
 * @param context - Description of the API operation
 * @param error - The error object
 * @returns User-friendly error message
 */
export function handleApiError(context: string, error: unknown): string {
  logError(context, error)
  return `Gagal ${context.toLowerCase()}`
}
