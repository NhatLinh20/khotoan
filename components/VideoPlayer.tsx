'use client'

import { useRef, useState, useEffect } from 'react'
import { Maximize, Minimize } from 'lucide-react'

export default function VideoPlayer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement || !!(document as any).webkitFullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('webkitfullscreenchange', onFullscreenChange)
    
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
    }
  }, [])

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    
    if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen()
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        await (containerRef.current as any).webkitRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen()
      }
    }
  }

  return (
    <div ref={containerRef} className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-900 shadow-xl border border-secondary/20 flex flex-col">
      {/* Nút Toàn màn hình hiển thị nổi ở góc phải trên */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-2 right-2 z-10 flex items-center justify-center bg-black/70 hover:bg-black/90 text-white p-2.5 rounded-lg backdrop-blur-sm transition-all"
        title="Toàn màn hình"
      >
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>

      <iframe
        src={url}
        className="w-full h-full border-0 flex-1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
      />
    </div>
  )
}
