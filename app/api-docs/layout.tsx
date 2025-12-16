import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Documentation - AI SmartChat',
  description: 'Interactive API documentation for AI SmartChat application',
}

/**
 * Layout for API Documentation
 * 
 * Simple layout - color scheme is set by page.tsx via JavaScript
 */
export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="api-docs-layout" style={{ minHeight: '100vh', overflow: 'auto' }}>
      {children}
    </div>
  )
}
