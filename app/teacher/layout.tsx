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
      <div className="px-6 py-8 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
            GV
          </div>
          <div className="min-w-0">
            <p className="font-black text-gray-900 dark:text-white text-base truncate">
              {profile.full_name || 'Giáo viên'}
            </p>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Giảng viên</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5">
        {TEACHER_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-all group shadow-sm hover:shadow-lg hover:shadow-primary/20"
          >
            <span className="text-gray-400 group-hover:text-white transition-colors">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-6 border-t border-gray-100 dark:border-slate-800">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
        >
          <ChevronRight size={16} className="rotate-180" />
          Về trang học sinh
        </Link>
      </div>
    </>
  )

  return (
    <SidebarLayout sidebar={sidebarContent}>
      <main className="p-6 lg:p-10 min-h-screen">
        {children}
      </main>
    </SidebarLayout>
  )
}
