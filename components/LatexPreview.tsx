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
    // We also trim leading whitespace from each line to mimic LaTeX's behavior
    // and prevent unintended indentation in whitespace-pre-wrap mode.
    let html = content
      .split('\n')
      .map(line => line.trimStart())
      .join('\n')
      .replace(/\\allowdisplaybreaks/g, '')
      .replace(/\\begin{eqnarray\*?}/g, '\\begin{align*}')
      .replace(/\\end{eqnarray\*?}/g, '\\end{align*}')

    // Clean up excessive newlines around display math blocks to prevent double spacing
    const displayMathRegex = /\\\[|\$\$|\\begin\{(?:equation|align|gather|alignat|CD|eqnarray)\*?\}/g;
    const displayMathEndRegex = /\\\]|\$\$|\\end\{(?:equation|align|gather|alignat|CD|eqnarray)\*?\}/g;
    
    html = html
      .replace(new RegExp(`\\s*\\n\\s*(${displayMathRegex.source})`, 'g'), '$1')
      .replace(new RegExp(`(${displayMathEndRegex.source})\\s*\\n\\s*`, 'g'), '$1');

    // 1. Escape HTML special characters before we add our own tags
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 2. Handle LaTeX List Environments (itemize, enumerate)
    html = html
      .replace(/\\begin\{itemize\}/g, '<ul class="list-disc ml-8 my-2">')
      .replace(/\\end\{itemize\}/g, '</li></ul>')
      .replace(/\\begin\{enumerate\}/g, '<ol class="list-decimal ml-8 my-2">')
      .replace(/\\end\{enumerate\}/g, '</li></ol>')
      .replace(/\\item\s+/g, '</li><li class="mt-1 pl-1">')
      // Fix the leading </li> that appears after \begin{...}
      .replace(/(<(?:ul|ol)[^>]*>)\s*<\/li>/g, '$1');

    // Set the HTML content
    ref.current.innerHTML = html
    
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
    const walkAndReplace = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.nodeValue) {
          node.nodeValue = node.nodeValue
            .replace(/\\\\(?:[ \t\r]*\n)?/g, '\n')
            .replace(/\\,/g, ' ')       
            .replace(/\\ /g, ' ')       
            .replace(/\\quad/g, '    ') 
            .replace(/\\qquad/g, '        '); 
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
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
      // whitespace-pre-wrap ensures newlines in the original text are rendered as line breaks.
      // We add specific utility classes to override KaTeX display margins to make them more compact.
      className={`text-gray-800 dark:text-gray-200 leading-relaxed text-sm whitespace-pre-wrap ${className} [&_.katex-display]:my-2 [&_.katex-display]:py-0`}
    />
  )
}
