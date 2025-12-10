import { getSupabaseServerClient } from "@/lib/supabase"

// Cache expiration time: 7 days
const CACHE_EXPIRATION_DAYS = 7

/**
 * Generate a simple hash from a string
 * Normalizes the question before hashing (lowercase, trim, remove extra spaces)
 */
export function generateQuestionHash(question: string): string {
  const normalized = question.toLowerCase().trim().replace(/\s+/g, " ")
  
  // Simple hash function
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  
  return `hash_${Math.abs(hash).toString(16)}_${normalized.length}`
}

/**
 * Check if a cached response exists and is not expired
 * Returns the cached answer if found, null otherwise
 */
export async function getCachedResponse(
  supabase: ReturnType<typeof getSupabaseServerClient>,
  question: string
): Promise<string | null> {
  const questionHash = generateQuestionHash(question)
  
  const { data: cached } = await supabase
    .from("cached_responses")
    .select("id, answer, expiresAt")
    .eq("questionHash", questionHash)
    .single()
  
  if (!cached) {
    return null
  }
  
  // Check if cache is expired
  const now = new Date()
  const expiresAt = new Date(cached.expiresAt)
  
  if (now > expiresAt) {
    // Cache expired, delete it
    await supabase.from("cached_responses").delete().eq("id", cached.id)
    return null
  }
  
  // Get current hitCount and increment it
  const { data: currentData } = await supabase
    .from("cached_responses")
    .select("hitCount")
    .eq("id", cached.id)
    .single()
  
  const newHitCount = (currentData?.hitCount || 0) + 1
  
  // Update hit count and last accessed time
  await supabase
    .from("cached_responses")
    .update({
      hitCount: newHitCount,
      lastAccessedAt: new Date().toISOString(),
    })
    .eq("id", cached.id)
  
  return cached.answer
}

/**
 * Save a response to cache
 */
export async function saveCachedResponse(
  supabase: ReturnType<typeof getSupabaseServerClient>,
  question: string,
  answer: string
): Promise<void> {
  const questionHash = generateQuestionHash(question)
  const now = new Date()
  const expiresAt = new Date(now.getTime() + CACHE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000)
  
  const cacheEntry = {
    id: `cache_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    questionHash,
    question: question.trim(),
    answer,
    hitCount: 0,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    lastAccessedAt: now.toISOString(),
  }
  
  // Use upsert to handle duplicate questionHash
  const { error } = await supabase
    .from("cached_responses")
    .upsert(cacheEntry, { onConflict: "questionHash" })
  
  if (error) {
    console.error("Failed to save cache:", error.message)
  }
}
