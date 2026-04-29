import { redirect } from 'next/navigation'
import { getCurrentUserWithProfile } from '@/lib/supabase/roles'
import Link from 'next/link'
import { BookOpen, PenLine, LayoutDashboard, FileText, Users, Settings, ChevronRight } from 'lucide-react'

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

  // Chưa đăng nhập
  if (!user) {
    redirect('/login')
  }

  // Không phải teacher
  if (!profile || profile.role !== 'teacher') {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
              GV
            </div>
            <div className="min-w-0">
              <p className="font-black text-gray-900 dark:text-white text-sm truncate">
                {profile.full_name || 'Giáo viên'}
              </p>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Giáo viên</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {TEACHER_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-primary/5 hover:text-primary transition-all group"
            >
              <span className="text-gray-400 group-hover:text-primary transition-colors">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-100 dark:border-slate-800">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
          >
            <ChevronRight size={16} className="rotate-180" />
            Về trang học sinh
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-4 px-6 py-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xs">K</div>
            <span className="font-black text-gray-900 dark:text-white">Teacher Panel</span>
          </div>
          <div className="ml-auto flex gap-2">
            {TEACHER_NAV.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="p-2 rounded-xl text-gray-500 hover:text-primary hover:bg-primary/5 transition-all"
                title={item.label}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>

        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  )
}
