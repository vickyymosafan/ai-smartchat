"use client"

import * as React from "react"

/**
 * useMediaQuery Hook - Hydration-Safe
 * 
 * A performant hook for detecting media query matches that avoids
 * hydration mismatches by always returning false on initial render.
 * 
 * The actual media query value is only used after hydration is complete.
 * 
 * @param query - CSS media query string (e.g., "(max-width: 768px)")
 * @returns boolean indicating if the media query matches (false until hydrated)
 */
export function useMediaQuery(query: string): boolean {
  // Always start with false to match server render and avoid hydration mismatch
  const [matches, setMatches] = React.useState(false)
  
  // Track if component has mounted (hydration complete)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // Mark as mounted after first render (hydration complete)
    setMounted(true)
    
    if (typeof window === "undefined") {
      return
    }

    const mediaQuery = window.matchMedia(query)
    
    // Set actual value now that we're on client
    setMatches(mediaQuery.matches)
    
    // Update state when match changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add listener using the modern API
    mediaQuery.addEventListener("change", handleChange)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [query])

  // Return false until mounted to prevent hydration mismatch
  // After mount, return actual value
  return mounted ? matches : false
}

/**
 * Preset media query hooks for common breakpoints
 * All return false on server/initial render to prevent hydration mismatch
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)")
}

export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 768px) and (max-width: 1023px)")
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)")
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)")
}

/**
 * Hook to check if component has been hydrated
 * Useful for conditional rendering that differs between server and client
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = React.useState(false)
  
  React.useEffect(() => {
    setHydrated(true)
  }, [])
  
  return hydrated
}
