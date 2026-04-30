'use client'

import React, { useState, useEffect } from 'react'
import { Menu, X, ChevronRight } from 'lucide-react'

interface SidebarLayoutProps {
  sidebar: React.ReactNode
  children: React.ReactNode
}

export default function SidebarLayout({ sidebar, children }: SidebarLayoutProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobileOpen && !(e.target as Element).closest('.sidebar-container')) {
        setIsMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobileOpen])

  return (
    <div className="relative min-h-screen w-full flex overflow-x-hidden bg-gray-50 dark:bg-slate-950">
      
      {/* 🟢 TRIGGER AREA: Hover near the left edge to show sidebar */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        className="fixed left-0 top-0 h-full w-4 z-[40] cursor-pointer group"
        aria-hidden="true"
      >
        <div className="h-full w-full bg-transparent group-hover:bg-primary/5 transition-colors" />
      </div>

      {/* 🟢 SIDEBAR CONTAINER */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`sidebar-container fixed left-0 top-0 h-full w-[260px] bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 z-[50] shadow-2xl transition-all duration-300 ease-in-out transform 
          ${(isHovered || isMobileOpen) ? 'translate-x-0' : '-translate-x-full'}
          ${isMobileOpen ? 'translate-x-0' : ''}
        `}
      >
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-primary transition-colors"
        >
          <X size={20} />
        </button>

        {/* Sidebar Content */}
        <div className="h-full w-full flex flex-col">
          {sidebar}
        </div>

        {/* Visual Indicator/Handle when hidden (Desktop) */}
        {!isHovered && !isMobileOpen && (
          <div className="hidden lg:flex absolute top-1/2 -right-10 w-10 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md items-center justify-center rounded-r-2xl border border-l-0 border-gray-100 dark:border-slate-800 shadow-sm cursor-pointer hover:text-primary transition-all group pointer-events-none opacity-0 group-hover:opacity-100">
             <ChevronRight size={20} className="animate-pulse" />
          </div>
        )}
      </aside>

      {/* 🟢 BACKDROP: Shown when sidebar is open (Desktop hover or Mobile toggle) */}
      <div 
        className={`fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-[2px] z-[45] transition-opacity duration-300 pointer-events-none
          ${(isHovered || isMobileOpen) ? 'opacity-100' : 'opacity-0'}
        `}
      />

      {/* 🟢 MAIN CONTENT */}
      <div className="flex-1 flex flex-col w-full min-w-0 relative">
        {/* Mobile Header with Toggle */}
        <header className="lg:hidden h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shrink-0 z-30">
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -ml-2 text-gray-500 hover:text-primary transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary/20">K</div>
             <span className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-wider">Teacher</span>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </header>

        {/* Content Area */}
        <main className="flex-1 w-full h-full relative z-10">
          {children}
        </main>
      </div>

    </div>
  )
}
