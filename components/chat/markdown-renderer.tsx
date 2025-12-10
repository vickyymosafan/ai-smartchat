"use client"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("prose prose-sm dark:prose-invert max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        // Headings - Responsive sizes for mobile
        h1: ({ children }) => (
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold mt-4 sm:mt-6 mb-3 sm:mb-4 pb-2 border-b border-border first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base sm:text-lg md:text-xl font-semibold mt-3 sm:mt-5 mb-2 sm:mb-3 pb-1 border-b border-border/50">{children}</h2>
        ),
        h3: ({ children }) => <h3 className="text-sm sm:text-base md:text-lg font-semibold mt-3 sm:mt-4 mb-1.5 sm:mb-2">{children}</h3>,
        h4: ({ children }) => <h4 className="text-sm sm:text-base font-semibold mt-2 sm:mt-3 mb-1 sm:mb-2">{children}</h4>,
        h5: ({ children }) => <h5 className="text-xs sm:text-sm font-semibold mt-2 mb-1">{children}</h5>,
        h6: ({ children }) => <h6 className="text-xs sm:text-sm font-medium mt-2 mb-1 text-muted-foreground">{children}</h6>,

        // Paragraphs - Tighter line height on mobile
        p: ({ children }) => <p className="my-2 sm:my-3 leading-6 sm:leading-7 text-sm sm:text-base first:mt-0 last:mb-0">{children}</p>,

        // Lists - Smaller indent on mobile
        ul: ({ children }) => <ul className="my-2 sm:my-3 ml-4 sm:ml-6 list-disc space-y-0.5 sm:space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="my-2 sm:my-3 ml-4 sm:ml-6 list-decimal space-y-0.5 sm:space-y-1">{children}</ol>,
        li: ({ children }) => <li className="leading-6 sm:leading-7 text-sm sm:text-base">{children}</li>,

        // Blockquote
        blockquote: ({ children }) => (
          <blockquote className="my-4 border-l-4 border-primary/30 pl-4 italic text-muted-foreground">
            {children}
          </blockquote>
        ),

        // Code - Responsive padding
        code: ({ className, children, ...props }) => {
          const isInline = !className
          if (isInline) {
            return (
              <code className="relative rounded bg-muted px-1 sm:px-[0.3rem] py-[0.1rem] sm:py-[0.2rem] font-mono text-xs sm:text-sm" {...props}>
                {children}
              </code>
            )
          }
          const language = className?.replace("language-", "") || "text"
          return (
            <div className="my-3 sm:my-4 overflow-hidden rounded-lg border bg-muted/50">
              <div className="flex items-center justify-between bg-muted px-3 sm:px-4 py-1.5 sm:py-2 text-xs text-muted-foreground">
                <span>{language}</span>
              </div>
              <pre className="overflow-x-auto p-3 sm:p-4">
                <code className={cn("font-mono text-xs sm:text-sm", className)} {...props}>
                  {children}
                </code>
              </pre>
            </div>
          )
        },
        pre: ({ children }) => <>{children}</>,

        // Table - Responsive padding
        table: ({ children }) => (
          <div className="my-3 sm:my-4 overflow-x-auto rounded-lg border">
            <table className="w-full border-collapse text-xs sm:text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
        tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
        tr: ({ children }) => <tr className="border-b border-border last:border-0">{children}</tr>,
        th: ({ children }) => <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold">{children}</th>,
        td: ({ children }) => <td className="px-2 sm:px-4 py-2 sm:py-3">{children}</td>,

        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            {children}
          </a>
        ),

        // Images
        img: ({ src, alt }) => (
          <span className="block my-4">
            <img src={src || ""} alt={alt || ""} className="rounded-lg max-w-full h-auto border" loading="lazy" />
          </span>
        ),

        // Horizontal rule
        hr: () => <hr className="my-6 border-border" />,

        // Strong and emphasis
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,

        // Strikethrough
        del: ({ children }) => <del className="line-through text-muted-foreground">{children}</del>,

        // Task lists
        input: ({ checked, ...props }) => (
          <input type="checkbox" checked={checked} readOnly className="mr-2 h-4 w-4 rounded border-border" {...props} />
        ),
      }}
    >
        {content}
      </ReactMarkdown>
    </div>
  )
}
