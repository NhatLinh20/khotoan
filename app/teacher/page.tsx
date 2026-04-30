import React from 'react'
import Link from 'next/link'
import {
  Users, FileText, BookOpen, PenLine,
  TrendingUp, Clock, CheckCircle, ArrowRight
} from 'lucide-react'
import { getCurrentUserWithProfile } from '@/lib/supabase/roles'
import { createClient } from '@/lib/supabase/server'

export default async function TeacherDashboardPage() {
  const { profile } = await getCurrentUserWithProfile()
  const supabase = await createClient()

  // Fetch stats
  const [{ count: examCount }, { count: questionCount }] = await Promise.all([
    supabase.from('exams').select('*', { count: 'exact', head: true }),
    supabase.from('questions').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Đề thi đã tạo', value: examCount ?? 0, icon: <FileText size={22} />, color: 'text-primary bg-primary/10' },
    { label: 'Ngân hàng câu hỏi', value: questionCount ?? 0, icon: <PenLine size={22} />, color: 'text-secondary bg-secondary/10' },
    { label: 'Học viên', value: '—', icon: <Users size={22} />, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Tỉ lệ hoàn thành', value: '—', icon: <TrendingUp size={22} />, color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20' },
  ]

  const quickLinks = [
    { href: '/teacher/exams/new', label: 'Tạo đề thi mới', icon: <FileText size={18} />, desc: 'Soạn đề kiểm tra từ ngân hàng câu hỏi' },
    { href: '/teacher/questions', label: 'Thêm câu hỏi', icon: <PenLine size={18} />, desc: 'Bổ sung câu hỏi vào ngân hàng' },
    { href: '/teacher/courses', label: 'Quản lý khóa học', icon: <BookOpen size={18} />, desc: 'Tạo và chỉnh sửa các khóa học' },
    { href: '/teacher/students', label: 'Xem học viên', icon: <Users size={18} />, desc: 'Theo dõi tiến độ học sinh' },
  ]

  return (
    <div className="flex flex-col gap-10">
      {/* Welcome */}
      <div>
        <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Bảng điều khiển</p>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Xin chào, {profile?.full_name?.split(' ').pop() || 'Giáo viên'} 👋
        </h1>
        <p className="text-gray-500 mt-1 font-medium">Quản lý đề thi, khóa học và học viên của bạn.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-4 flex flex-col gap-3"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              {React.cloneElement(stat.icon as React.ReactElement, { size: 18 })}
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-base font-black text-gray-900 dark:text-white mb-4">Thao tác nhanh</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:border-primary/40 rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">{link.label}</p>
                <p className="text-xs text-gray-400 font-medium truncate">{link.desc}</p>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">Hoạt động gần đây</h2>
          <Link href="/teacher/exams" className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
            Xem tất cả <ArrowRight size={14} />
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="text-gray-200 dark:text-slate-700 mb-4" size={48} />
          <p className="text-gray-400 font-bold">Chưa có hoạt động nào</p>
          <p className="text-gray-300 dark:text-slate-600 text-sm font-medium mt-1">Tạo đề thi đầu tiên để bắt đầu!</p>
          <Link
            href="/teacher/exams/new"
            className="mt-6 bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-primary-dark transition-all hover:scale-105 shadow-lg shadow-primary/20"
          >
            Tạo đề thi ngay
          </Link>
        </div>
      </div>
    </div>
  )
}
