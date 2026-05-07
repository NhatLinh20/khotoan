'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, LogOut, User as UserIcon, BookOpen, GraduationCap, Home, Settings, Clock } from 'lucide-react'
import { logout } from '@/app/actions/auth'

interface NavbarProps {
 user: any
 profile?: any
}

export default function Navbar({ user, profile }: NavbarProps) {
 const [isMenuOpen, setIsMenuOpen] = useState(false)

 const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
 const isTeacher = profile?.role === 'teacher'
 const isPending = user && !isTeacher && !profile?.is_approved

 // Học sinh chưa duyệt → ẩn link /practice và /courses/[id]
 const navLinks = [
 { href: '/', label: 'Trang chủ', icon: <Home size={18} /> },
 ...(isPending
 ? []
 : [
 { href: '/courses', label: 'Khóa học', icon: <BookOpen size={18} /> },
 { href: '/practice', label: 'Luyện thi', icon: <GraduationCap size={18} /> },
]),
 ...(isTeacher ? [{ href: '/teacher', label: 'Quản lý', icon: <Settings size={18} /> }] : []),
]

 return (
 <nav className="fixed top-0 w-full z-50 bg-primary border-b border-secondary/20 transition-all duration-300">
 <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
 {/* Logo */}
 <Link href="/" className="flex items-center gap-2 group">
 <div className="w-10 h-10 bg-surface rounded-md flex items-center justify-center text-primary font-display font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">K</div>
 <span className="text-2xl font-display font-display font-bold text-surface tracking-tight">Kho Toán</span>
 </Link>

 {/* Desktop Menu */}
 <div className="hidden md:flex items-center gap-8">
 {navLinks.map((link) => (
 <Link 
 key={link.href} 
 href={link.href} 
 className="text-sm font-bold text-neutral/80 hover:text-surface transition-colors flex items-center gap-1.5"
 >
 {link.label}
 </Link>
 ))}
 </div>

 {/* Auth Buttons / User Profile */}
 <div className="hidden md:flex items-center gap-4">
 {user ? (
 <div className="flex items-center gap-4 pl-4 border-l border-secondary/30">
 <div className="flex items-center gap-3">
 {isPending ? (
 /* Tài khoản chờ duyệt */
 <div className="flex items-center gap-2 px-3 py-1.5 bg-tertiary/10 rounded-full border border-tertiary/20">
 <Clock size={14} className="text-tertiary animate-pulse" />
 <span className="text-xs font-bold text-surface whitespace-nowrap">
 Tài khoản chờ kích hoạt
 </span>
 </div>
 ) : (
 <>
 <div className="w-10 h-10 rounded-full bg-surface/10 flex items-center justify-center text-surface border border-surface/20">
 <UserIcon size={20} />
 </div>
 <div className="flex flex-col">
 <span className="text-sm font-bold text-surface leading-tight">
 {user.user_metadata?.full_name || profile?.full_name || 'Học viên'}
 </span>
 <span className="text-[10px] font-display uppercase font-display font-bold text-secondary tracking-widest">
 {isTeacher ? 'Giáo viên' : `Lớp ${user.user_metadata?.grade || profile?.grade || '?'}`}
 </span>
 </div>
 </>
 )}
 </div>
 <button 
 onClick={() => logout()}
 className="p-2 text-neutral/60 hover:text-tertiary transition-colors"
 title="Đăng xuất"
 >
 <LogOut size={20} />
 </button>
 </div>
 ) : (
 <div className="flex items-center gap-4">
 <Link href="/login" className="text-sm font-bold text-neutral hover:text-surface transition-colors px-4">
 Đăng nhập
 </Link>
 <Link 
 href="/register" 
 className="bg-tertiary text-surface px-6 py-2.5 rounded-md font-display font-semibold text-sm hover:bg-tertiary/90 hover:-translate-y-0.5 transition-transform active:scale-95"
 >
 Đăng ký
 </Link>
 </div>
 )}
 </div>

 {/* Mobile Menu Button */}
 <button className="md:hidden p-2 text-surface" onClick={toggleMenu}>
 {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
 </button>
 </div>

 {/* Mobile Menu */}
 {isMenuOpen && (
 <div className="md:hidden absolute top-20 left-0 w-full bg-primary border-b border-secondary/20 animate-in slide-in-from-top-4 duration-300 shadow-xl">
 <div className="px-6 py-8 space-y-6">
 {navLinks.map((link) => (
 <Link 
 key={link.href} 
 href={link.href} 
 className="flex items-center gap-4 text-lg font-bold text-neutral hover:text-surface"
 onClick={() => setIsMenuOpen(false)}
 >
 {link.icon}
 {link.label}
 </Link>
 ))}
 
 <div className="pt-6 border-t border-secondary/30">
 {user ? (
 <div className="space-y-4">
 {isPending ? (
 <div className="flex items-center gap-3 px-4 py-3 bg-tertiary/10 rounded-md border border-tertiary/20">
 <Clock size={20} className="text-tertiary animate-pulse" />
 <div>
 <p className="font-bold text-surface text-sm">Tài khoản chờ kích hoạt</p>
 <p className="text-xs text-neutral/80">Liên hệ giáo viên để được duyệt</p>
 </div>
 </div>
 ) : (
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-full bg-surface/10 flex items-center justify-center text-surface">
 <UserIcon size={24} />
 </div>
 <div>
 <p className="font-bold text-surface">{user.user_metadata?.full_name || profile?.full_name}</p>
 <p className="text-sm text-neutral/80">{isTeacher ? 'Giáo viên' : `Lớp ${user.user_metadata?.grade || profile?.grade}`}</p>
 </div>
 </div>
 )}
 <button 
 onClick={() => logout()}
 className="w-full flex items-center justify-center gap-2 py-4 rounded-md bg-tertiary/10 text-tertiary font-bold"
 >
 <LogOut size={20} />
 Đăng xuất
 </button>
 </div>
 ) : (
 <div className="grid grid-cols-2 gap-4">
 <Link 
 href="/login" 
 className="flex items-center justify-center py-4 rounded-md border border-secondary font-bold text-surface"
 onClick={() => setIsMenuOpen(false)}
 >
 Đăng nhập
 </Link>
 <Link 
 href="/register" 
 className="flex items-center justify-center py-4 rounded-md bg-tertiary text-surface font-display font-semibold"
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
