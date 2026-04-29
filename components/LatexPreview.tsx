'use client'

import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface LatexPreviewProps {
  content: string
  className?: string
}

export default function LatexPreview({ content, className = '' }: LatexPreviewProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    // Replace $...$ with rendered KaTeX
    const html = content.replace(/\$([^$]+)\$/g, (_, math) => {
      try {
        return katex.renderToString(math, { throwOnError: false, displayMode: false })
      } catch {
        return `<span class="text-red-500">${math}</span>`
      }
    }).replace(/\$\$([^$]+)\$\$/g, (_, math) => {
      try {
        return katex.renderToString(math, { throwOnError: false, displayMode: true })
      } catch {
        return `<span class="text-red-500">${math}</span>`
      }
    })
    // Keep newlines as <br>
    ref.current.innerHTML = html.replace(/\n/g, '<br/>')
  }, [content])

  if (!content.trim()) {
    return (
      <div className={`text-gray-400 italic text-sm ${className}`}>
        Nhập nội dung để xem preview...
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={`text-gray-800 dark:text-gray-200 leading-relaxed text-sm ${className}`}
    />
  )
}
