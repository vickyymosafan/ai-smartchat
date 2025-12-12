"use client"

import * as React from "react"

/**
 * useMediaQuery Hook
 * 
 * A performant hook for detecting media query matches.
 * Uses matchMedia API for efficient event-based detection.
 * 
 * @param query - CSS media query string (e.g., "(max-width: 768px)")
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState<boolean>(() => {
    // Check if window is defined (SSR safety)
    if (typeof window === "undefined") {
      return false
    }
    return window.matchMedia(query).matches
  })

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const mediaQuery = window.matchMedia(query)
    
    // Update state when match changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Set initial value
    setMatches(mediaQuery.matches)

    // Add listener using the modern API
    mediaQuery.addEventListener("change", handleChange)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [query])

  return matches
}

/**
 * Preset media query hooks for common breakpoints
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
