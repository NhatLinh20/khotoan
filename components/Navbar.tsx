'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, LogOut, User as UserIcon, BookOpen, GraduationCap, Home, Settings } from 'lucide-react'
import { logout } from '@/app/actions/auth'

interface NavbarProps {
  user: any
  profile?: any
}

export default function Navbar({ user, profile }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const isTeacher = profile?.role === 'teacher'

  const navLinks = [
    { href: '/', label: 'Trang chủ', icon: <Home size={18} /> },
    { href: '/courses', label: 'Khóa học', icon: <BookOpen size={18} /> },
    { href: '/practice', label: 'Luyện thi', icon: <GraduationCap size={18} /> },
    ...(isTeacher ? [{ href: '/teacher', label: 'Quản lý', icon: <Settings size={18} /> }] : []),
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">K</div>
          <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Kho Toán</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons / User Profile */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary border border-primary/20">
                  <UserIcon size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                    {user.user_metadata?.full_name || 'Học viên'}
                  </span>
                  <span className="text-[10px] uppercase font-black text-secondary tracking-widest">
                    Lớp {user.user_metadata?.grade || '?'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => logout()}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-primary transition-colors px-4">
                Đăng nhập
              </Link>
              <Link 
                href="/register" 
                className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary-dark hover:scale-105 transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-gray-600 dark:text-gray-400" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 animate-in slide-in-from-top-4 duration-300">
          <div className="px-6 py-8 space-y-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="flex items-center gap-4 text-lg font-bold text-gray-700 dark:text-gray-300 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            
            <div className="pt-6 border-t border-gray-100 dark:border-slate-800">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                      <UserIcon size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.user_metadata?.full_name}</p>
                      <p className="text-sm text-gray-500">Lớp {user.user_metadata?.grade}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => logout()}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-50 text-red-600 font-bold"
                  >
                    <LogOut size={20} />
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href="/login" 
                    className="flex items-center justify-center py-4 rounded-2xl border border-gray-200 dark:border-slate-800 font-bold text-gray-700 dark:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link 
                    href="/register" 
                    className="flex items-center justify-center py-4 rounded-2xl bg-primary text-white font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
