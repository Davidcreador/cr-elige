import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useMemo } from 'react'

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const processedContent = useMemo(() => {
    if (!content) return ''

    const lines = content.split('\n')
    const result: string[] = []
    let currentSubheading = ''

    for (const line of lines) {
      const trimmedLine = line.trim()

      if (trimmedLine.startsWith('- **') && trimmedLine.endsWith('**:')) {
        if (currentSubheading) {
          result.push(`### ${currentSubheading}`)
        }
        currentSubheading = trimmedLine.replace(/^- \*\*/, '').replace(/\*\*:$/, '').trim()
      } else if (trimmedLine.startsWith('-') || trimmedLine) {
        if (currentSubheading && trimmedLine.startsWith('-')) {
          result.push(`### ${currentSubheading}`)
          currentSubheading = ''
        }
        result.push(trimmedLine)
      }
    }

    if (currentSubheading) {
      result.push(`### ${currentSubheading}`)
    }

    return result.join('\n')
  }, [content])

  if (!content) {
    return <p className="text-gray-500 italic">No information available</p>
  }

  return (
    <div className={`prose ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3>{children}</h3>
          ),
          h4: ({ children }) => (
            <h4>{children}</h4>
          ),
          p: ({ children }) => (
            <p>{children}</p>
          ),
          ul: ({ children }) => (
            <ul>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol>{children}</ol>
          ),
          li: ({ children }) => (
            <li>{children}</li>
          ),
          strong: ({ children }) => (
            <strong>{children}</strong>
          ),
          em: ({ children }) => (
            <em>{children}</em>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote>{children}</blockquote>
          ),
          hr: () => (
            <hr />
          ),
          code: ({ inline, children }) => (
            <code className={inline ? 'inline-code' : 'block-code'}>
              {children}
            </code>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}
