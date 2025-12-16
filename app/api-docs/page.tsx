'use client'

import { useEffect, useRef } from 'react'

/**
 * Swagger UI Page
 * 
 * Interactive API documentation at /api-docs
 * Uses Swagger UI from CDN
 * Forces NETRAL color scheme (black & white)
 */
export default function ApiDocsPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Force NETRAL color scheme for this page
    document.documentElement.setAttribute('data-color-scheme', 'netral')
    document.documentElement.classList.remove('dark')
    
    // Enable scrolling
    document.documentElement.style.overflow = 'auto'
    document.body.style.overflow = 'auto'
    
    // Load Swagger UI CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css'
    document.head.appendChild(link)

    // Load Swagger UI Bundle
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js'
    script.onload = () => {
      // Initialize Swagger UI after script loads
      if (containerRef.current && window.SwaggerUIBundle) {
        window.SwaggerUIBundle({
          url: '/api/swagger',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            window.SwaggerUIBundle.presets.apis,
          ],
          docExpansion: 'list',
          filter: true,
          tryItOutEnabled: true,
          displayRequestDuration: true,
          defaultModelsExpandDepth: 1,
          defaultModelExpandDepth: 1,
        })
      }
    }
    document.body.appendChild(script)

    // Cleanup - restore previous color scheme when leaving
    return () => {
      const existingLink = document.querySelector('link[href*="swagger-ui.css"]')
      if (existingLink) existingLink.remove()
      const existingScript = document.querySelector('script[src*="swagger-ui-bundle.js"]')
      if (existingScript) existingScript.remove()
    }
  }, [])

  return (
    <div 
      id="swagger-ui"
      ref={containerRef}
      style={{ 
        minHeight: '100vh', 
        background: '#fafafa',
        overflow: 'visible'
      }}
    />
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SwaggerUIBundle: {
      (config: Record<string, unknown>): void
      presets: {
        apis: unknown
      }
      SwaggerUIStandalonePreset: unknown
      plugins: {
        DownloadUrl: unknown
      }
    }
  }
}
