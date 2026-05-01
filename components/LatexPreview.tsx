'use client'

import { useEffect, useRef } from 'react'
import renderMathInElement from 'katex/dist/contrib/auto-render'
import 'katex/dist/katex.min.css'

interface LatexPreviewProps {
  content: string
  className?: string
}

export default function LatexPreview({ content, className = '' }: LatexPreviewProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    
    // Fix common unsupported LaTeX environments before rendering
    // KaTeX does not support eqnarray/eqnarray*, so we convert it to align*
    const processedContent = content
      .replace(/\\begin{eqnarray\*?}/g, '\\begin{align*}')
      .replace(/\\end{eqnarray\*?}/g, '\\end{align*}')

    // Safely set text content. We avoid innerHTML to prevent XSS and to keep 
    // the text nodes intact for auto-render to process.
    ref.current.textContent = processedContent
    
    renderMathInElement(ref.current, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
        { left: '$', right: '$', display: false },
        { left: '\\begin{equation}', right: '\\end{equation}', display: true },
        { left: '\\begin{equation*}', right: '\\end{equation*}', display: true },
        { left: '\\begin{align}', right: '\\end{align}', display: true },
        { left: '\\begin{align*}', right: '\\end{align*}', display: true },
        { left: '\\begin{alignat}', right: '\\end{alignat}', display: true },
        { left: '\\begin{alignat*}', right: '\\end{alignat*}', display: true },
        { left: '\\begin{gather}', right: '\\end{gather}', display: true },
        { left: '\\begin{gather*}', right: '\\end{gather*}', display: true },
        { left: '\\begin{CD}', right: '\\end{CD}', display: true },
        { left: '\\begin{cases}', right: '\\end{cases}', display: true },
      ],
      preProcess: (math) => {
        // Fix common typos that break KaTeX
        let processed = math.replace(/\\limits\\limits/g, '\\limits');

        // Helper to replace custom Vietnamese macros (\hoac, \dongthoi, \hept) 
        // that use balanced braces which KaTeX macros cannot handle when they contain `&` or `\\`
        const replaceMacro = (text: string, macroName: string, startT: string, endT: string) => {
          let result = text;
          let index = 0;
          while ((index = result.indexOf(macroName + '{', index)) !== -1) {
            let braceCount = 0;
            let startIndex = index + macroName.length; // index of '{'
            let endIndex = -1;
            for (let i = startIndex; i < result.length; i++) {
              if (result[i] === '{') braceCount++;
              if (result[i] === '}') {
                braceCount--;
                if (braceCount === 0) {
                  endIndex = i;
                  break;
                }
              }
            }
            if (endIndex !== -1) {
              const innerContent = result.substring(startIndex + 1, endIndex);
              const replaced = startT + innerContent + endT;
              result = result.substring(0, index) + replaced + result.substring(endIndex + 1);
              index = index + startT.length;
            } else {
              index += macroName.length;
            }
          }
          return result;
        };

        processed = replaceMacro(processed, '\\hoac', '\\left[\\begin{aligned}', '\\end{aligned}\\right.');
        processed = replaceMacro(processed, '\\dongthoi', '\\left\\{\\begin{aligned}', '\\end{aligned}\\right.');
        processed = replaceMacro(processed, '\\hept', '\\left\\{\\begin{aligned}', '\\end{aligned}\\right.');
        processed = replaceMacro(processed, '\\heva', '\\left\\{\\begin{aligned}', '\\end{aligned}\\right.');

        return processed;
      },
      throwOnError: false,
      errorColor: '#ef4444'
    })

    // Post-processing: Handle LaTeX text-mode line breaks `\\`
    // We do this AFTER KaTeX rendering to ensure we don't accidentally modify `\\` inside math blocks.
    const walkAndReplace = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.nodeValue) {
          // Replace `\\` (optionally followed by spaces/tabs/carriage returns and a newline) with a single newline.
          // This prevents double spacing when Windows `\r\n` is used in the source text.
          node.nodeValue = node.nodeValue
            .replace(/\\\\(?:[ \t\r]*\n)?/g, '\n')
            .replace(/\\,/g, ' ')       // thin space
            .replace(/\\ /g, ' ')       // control space
            .replace(/\\quad/g, '    ') // quad space
            .replace(/\\qquad/g, '        '); // double quad space
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        // Do not traverse into rendered KaTeX elements
        if (!el.classList.contains('katex')) {
          Array.from(node.childNodes).forEach(walkAndReplace);
        }
      }
    };
    walkAndReplace(ref.current);

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
      // whitespace-pre-wrap ensures newlines in the original text are rendered as line breaks,
      // without needing to insert <br/> which would break the katex parser for multi-line math.
      className={`text-gray-800 dark:text-gray-200 leading-relaxed text-sm whitespace-pre-wrap ${className}`}
    />
  )
}
