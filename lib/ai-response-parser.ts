/**
 * AI Response Parser
 * Simplifies extracting response from various AI/webhook formats
 */

// Priority order for extracting response fields
const RESPONSE_FIELDS = ['output', 'response', 'text', 'message', 'result', 'answer', 'content']

/**
 * Extract AI response from various data formats
 * Handles strings, arrays, and objects with different response field names
 * @param data - The raw response data from AI/webhook
 * @returns The extracted response string
 */
export function extractAIResponse(data: unknown): string {
  // Handle string directly
  if (typeof data === 'string') {
    return data
  }
  
  // Handle array - take first element
  if (Array.isArray(data) && data.length > 0) {
    const firstItem = data[0]
    // Try to extract from first array item
    if (typeof firstItem === 'string') {
      return firstItem
    }
    if (typeof firstItem === 'object' && firstItem !== null) {
      for (const field of RESPONSE_FIELDS) {
        if (field in firstItem && firstItem[field]) {
          return String(firstItem[field])
        }
      }
      return JSON.stringify(firstItem)
    }
  }
  
  // Handle object with response fields
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>
    
    // Check top-level fields
    for (const field of RESPONSE_FIELDS) {
      if (field in obj && obj[field]) {
        return String(obj[field])
      }
    }
    
    // Check nested data object
    if ('data' in obj && typeof obj.data === 'object' && obj.data !== null) {
      const nested = obj.data as Record<string, unknown>
      for (const field of RESPONSE_FIELDS) {
        if (field in nested && nested[field]) {
          return String(nested[field])
        }
      }
    }
    
    return JSON.stringify(data)
  }
  
  // Fallback
  return JSON.stringify(data)
}
