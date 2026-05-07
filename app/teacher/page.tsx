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
 { label: 'Đề thi đã tạo', value: examCount ?? 0, icon: <FileText size={18} />, color: 'text-primary bg-primary/10' },
 { label: 'Ngân hàng câu hỏi', value: questionCount ?? 0, icon: <PenLine size={18} />, color: 'text-secondary bg-secondary/10' },
 { label: 'Học viên', value: '—', icon: <Users size={18} />, color: 'text-emerald-600 bg-emerald-50' },
 { label: 'Tỉ lệ hoàn thành', value: '—', icon: <TrendingUp size={18} />, color: 'text-tertiary bg-tertiary/10' },
]

 const quickLinks = [
 { href: '/teacher/exams/new', label: 'Tạo đề thi mới', icon: <FileText size={18} />, desc: 'Soạn đề kiểm tra từ ngân hàng câu hỏi' },
 { href: '/teacher/questions', label: 'Thêm câu hỏi', icon: <PenLine size={18} />, desc: 'Bổ sung câu hỏi vào ngân hàng' },
 { href: '/teacher/courses', label: 'Quản lý khóa học', icon: <BookOpen size={18} />, desc: 'Tạo và chỉnh sửa các khóa học' },
 { href: '/teacher/students', label: 'Xem học viên', icon: <Users size={18} />, desc: 'Theo dõi tiến độ học sinh' },
]

 return (
 <div className="flex flex-col gap-8 font-body max-w-6xl mx-auto">
 {/* Welcome */}
 <div>
 <p className="text-[0.78rem] font-display font-bold text-secondary uppercase tracking-[0.14em] mb-1">Bảng điều khiển</p>
 <h1 className="text-[1.8rem] font-display font-bold text-primary">
 Xin chào, {profile?.full_name?.split(' ').pop() || 'Giáo viên'} 👋
 </h1>
 <p className="text-[0.95rem] text-secondary mt-1 font-medium">Quản lý đề thi, khóa học và học viên của bạn.</p>
 </div>

 {/* Stats */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 {stats.map((stat, i) => (
 <div
 key={i}
 className="bg-surface rounded-lg border border-secondary/20 p-5 flex flex-col gap-3 shadow-sm hover:border-secondary/40 transition-colors"
 >
 <div className={`w-10 h-10 rounded-md flex items-center justify-center ${stat.color}`}>
 {stat.icon}
 </div>
 <div>
 <div className="text-[1.8rem] font-display font-bold text-primary leading-none mb-1">{stat.value}</div>
 <div className="text-[0.6rem] font-display font-bold text-secondary uppercase tracking-[0.14em]">{stat.label}</div>
 </div>
 </div>
 ))}
 </div>

 {/* Quick links */}
 <div>
 <h2 className="text-[1.2rem] font-display font-bold text-primary mb-4">Thao tác nhanh</h2>
 <div className="grid sm:grid-cols-2 gap-3">
 {quickLinks.map((link) => (
 <Link
 key={link.href}
 href={link.href}
 className="group bg-surface border border-secondary/20 hover:border-tertiary/40 rounded-lg p-4 flex items-center gap-4 transition-all shadow-sm hover:bg-neutral"
 >
 <div className="w-10 h-10 rounded-md bg-neutral flex items-center justify-center text-secondary group-hover:bg-tertiary group-hover:text-surface transition-all shrink-0 border border-secondary/20 group-hover:border-tertiary">
 {link.icon}
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-[0.95rem] font-display font-bold text-primary group-hover:text-tertiary transition-colors">{link.label}</p>
 <p className="text-[0.78rem] text-secondary font-medium truncate">{link.desc}</p>
 </div>
 <ArrowRight size={16} className="text-secondary opacity-50 group-hover:text-tertiary group-hover:translate-x-1 group-hover:opacity-100 transition-all shrink-0" />
 </Link>
 ))}
 </div>
 </div>

 {/* Recent activity placeholder */}
 <div className="bg-surface rounded-lg border border-secondary/20 p-8 shadow-sm">
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-[1.2rem] font-display font-bold text-primary">Hoạt động gần đây</h2>
 <Link href="/teacher/exams" className="text-[0.78rem] text-tertiary font-display font-bold hover:underline flex items-center gap-1 uppercase tracking-[0.14em]">
 Xem tất cả <ArrowRight size={14} />
 </Link>
 </div>
 <div className="flex flex-col items-center justify-center py-12 text-center">
 <Clock className="text-secondary opacity-40 mb-4" size={48} strokeWidth={1.5} />
 <p className="text-[0.95rem] text-primary font-bold">Chưa có hoạt động nào</p>
 <p className="text-[0.95rem] text-secondary mt-1 font-medium">Tạo đề thi đầu tiên để bắt đầu!</p>
 <Link
 href="/teacher/exams/new"
 className="mt-6 bg-tertiary text-surface px-6 py-3 rounded-md font-display font-bold text-[0.95rem] hover:bg-tertiary/90 transition-all shadow-sm"
 >
 Tạo đề thi ngay
 </Link>
 </div>
 </div>
 </div>
 )
}
