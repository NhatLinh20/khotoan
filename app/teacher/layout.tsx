import { redirect } from 'next/navigation'
import { getCurrentUserWithProfile } from '@/lib/supabase/roles'
import Link from 'next/link'
import { BookOpen, PenLine, LayoutDashboard, FileText, Users, ChevronRight } from 'lucide-react'
import SidebarLayout from '@/components/SidebarLayout'

const TEACHER_NAV = [
 { href: '/teacher', label: 'Tổng quan', icon: <LayoutDashboard size={18} /> },
 { href: '/teacher/exams', label: 'Quản lý đề thi', icon: <FileText size={18} /> },
 { href: '/teacher/questions', label: 'Ngân hàng câu hỏi', icon: <PenLine size={18} /> },
 { href: '/teacher/students', label: 'Học viên', icon: <Users size={18} /> },
 { href: '/teacher/courses', label: 'Khóa học', icon: <BookOpen size={18} /> },
]

export default async function TeacherLayout({
 children,
}: {
 children: React.ReactNode
}) {
 const { user, profile } = await getCurrentUserWithProfile()

 if (!user) redirect('/login')
 if (!profile || profile.role !== 'teacher') redirect('/dashboard')

 const sidebarContent = (
 <>
 {/* Header */}
 <div className="px-6 py-8 border-b border-secondary/20">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 rounded-md bg-tertiary/10 flex items-center justify-center text-tertiary font-display font-bold text-[1.2rem]">
 GV
 </div>
 <div className="min-w-0">
 <p className="font-display font-bold text-primary text-[0.95rem] truncate">
 {profile.full_name || 'Giáo viên'}
 </p>
 <p className="text-[0.6rem] font-display font-bold text-tertiary uppercase tracking-[0.14em]">Giảng viên</p>
 </div>
 </div>
 </div>

 {/* Nav */}
 <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5">
 {TEACHER_NAV.map((item) => (
 <Link
 key={item.href}
 href={item.href}
 className="flex items-center gap-3 px-4 py-3.5 rounded-md text-[0.95rem] font-display font-bold text-secondary hover:bg-tertiary/10 hover:text-tertiary transition-all group border border-transparent hover:border-tertiary/20"
 >
 <span className="text-secondary group-hover:text-tertiary transition-colors">{item.icon}</span>
 {item.label}
 </Link>
 ))}
 </nav>

 {/* Footer */}
 <div className="px-4 py-6 border-t border-secondary/20">
 <Link
 href="/dashboard"
 className="flex items-center gap-3 px-4 py-3 rounded-md text-[0.95rem] font-display font-bold text-secondary hover:bg-neutral transition-all border border-transparent hover:border-secondary/20"
 >
 <ChevronRight size={16} className="rotate-180" />
 Về trang học sinh
 </Link>
 </div>
 </>
 )

 return (
 <SidebarLayout sidebar={sidebarContent}>
 <main className="p-6 lg:p-10 min-h-screen bg-neutral font-body">
 {children}
 </main>
 </SidebarLayout>
 )
}
