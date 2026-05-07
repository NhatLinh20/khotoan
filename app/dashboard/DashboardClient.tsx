'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
 LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
 PieChart, Pie, Cell, Legend
} from 'recharts'
import {
 BookOpen, Clock, Target, TrendingUp, TrendingDown, Award,
 ChevronRight, Bell, Zap, Trophy, Star, Play, BarChart2,
 GraduationCap, Calendar, CheckCircle, XCircle, ArrowRight
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Props {
 profile: any
 user: any
 totalExams: number
 avgScore: number
 totalCorrect: number
 totalSeconds: number
 recentChart: { date: string; score: number; topic: string }[]
 pieData: { name: string; value: number; color: string }[]
 enrollments: any[]
 recentExams: any[]
 leaderboard: any[]
}

// ── Count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200) {
 const [value, setValue] = useState(0)
 useEffect(() => {
 if (target === 0) return
 const steps = 40
 const increment = target / steps
 let current = 0
 const timer = setInterval(() => {
 current += increment
 if (current >= target) { setValue(target); clearInterval(timer) }
 else setValue(Math.round(current))
 }, duration / steps)
 return () => clearInterval(timer)
 }, [target, duration])
 return value
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(seconds: number) {
 const h = Math.floor(seconds / 3600)
 const m = Math.floor((seconds % 3600) / 60)
 if (h > 0) return`${h}h ${m}m`
 return`${m} phút`
}

function scoreBadge(score: number, total: number) {
 const pct = total > 0 ? (score / total) * 100 : 0
 if (pct >= 80) return { label: 'Xuất sắc', cls: 'bg-emerald-100 text-emerald-700 border border-emerald-200' }
 if (pct >= 60) return { label: 'Tốt', cls: 'bg-blue-100 text-blue-700 border border-blue-200' }
 return { label: 'Cần cố gắng', cls: 'bg-tertiary/10 text-tertiary border border-tertiary/20' }
}

// ── Mock notifications ────────────────────────────────────────────────────────
const NOTIFS = [
 { id: 1, type: 'exam', icon: <Zap size={16} />, iconCls: 'bg-blue-100 text-blue-600', title: 'Đề thi mới: Toán 12 - Chương 2', body: 'Giáo viên vừa đăng đề thi mới cho lớp 12', time: '5 phút trước' },
 { id: 2, type: 'result', icon: <Star size={16} />, iconCls: 'bg-amber-100 text-amber-600', title: 'Kết quả đã được cập nhật', body: 'Bài thi Lượng giác của bạn đã được chấm điểm', time: '2 giờ trước' },
 { id: 3, type: 'system', icon: <Bell size={16} />, iconCls: 'bg-secondary/10 text-secondary', title: 'Cập nhật hệ thống', body: 'Kho Toán vừa thêm 50 câu hỏi mới vào ngân hàng đề', time: '1 ngày trước' },
]

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function DashboardClient({
 profile, user, totalExams, avgScore, totalCorrect, totalSeconds,
 recentChart, pieData, enrollments, recentExams, leaderboard,
}: Props) {
 const animExams = useCountUp(totalExams)
 const animScore = useCountUp(avgScore)
 const animCorrect = useCountUp(totalCorrect)

 const avatarLetter = (profile?.full_name || user?.email || 'U')[0].toUpperCase()
 const joinDate = new Date(profile?.created_at || Date.now()).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })

 // Mock leaderboard if empty
 const board = leaderboard.length > 0 ? leaderboard : [
 { id: user?.id, full_name: profile?.full_name || 'Bạn', grade: profile?.grade, avg_score: avgScore, exam_count: totalExams },
]

 const medals = ['🥇', '🥈', '🥉']

 return (
 <div className="min-h-screen bg-neutral font-body pb-12">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

 {/* ── HEADER ── */}
 <div className="relative overflow-hidden rounded-lg bg-surface border border-secondary/20 p-8 shadow-sm">
 <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
 {/* Avatar */}
 <div className="relative flex-shrink-0">
 <div className="w-20 h-20 rounded-md bg-neutral border border-secondary/20 flex items-center justify-center text-3xl font-display font-bold text-primary shadow-sm">
 {avatarLetter}
 </div>
 <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-sm bg-emerald-500 border-2 border-surface" />
 </div>

 {/* Info */}
 <div className="flex-1 min-w-0">
 <div className="flex flex-wrap items-center gap-3 mb-1">
 <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary truncate">
 Xin chào, {profile?.full_name || 'Học viên'}! 👋
 </h1>
 <span className="px-3 py-1 rounded-sm bg-emerald-100 text-emerald-700 text-[0.78rem] font-display font-bold uppercase tracking-[0.14em]">
 ✓ Đã kích hoạt
 </span>
 </div>
 <div className="flex flex-wrap gap-4 text-secondary text-[0.95rem] mt-2 font-medium">
 <span className="flex items-center gap-1.5">
 <GraduationCap size={16} />
 Lớp {profile?.grade || '?'}
 </span>
 <span className="flex items-center gap-1.5">
 <Calendar size={16} />
 Tham gia {joinDate}
 </span>
 <span className="flex items-center gap-1.5">
 <Trophy size={16} />
 {totalExams} bài đã thi
 </span>
 </div>
 </div>

 {/* Quick action */}
 <Link href="/practice" className="flex-shrink-0 flex items-center gap-2 bg-tertiary text-surface px-6 py-3 rounded-md font-display font-bold text-[0.95rem] hover:bg-tertiary/90 transition-all shadow-sm">
 <Play size={16} fill="currentColor" />
 Luyện thi ngay
 </Link>
 </div>
 </div>

 {/* ── SECTION 1: STATS CARDS ── */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 {[
 {
 icon: <BarChart2 size={20} />, color: 'blue',
 value: animExams, label: 'Bài đã thi', unit: 'bài',
 trend: totalExams > 0 ? '+3 tuần này' : 'Chưa có',
 up: true,
 },
 {
 icon: <Target size={20} />, color: 'green',
 value: animScore, label: 'Điểm trung bình', unit: '%',
 trend: avgScore >= 70 ? 'Tốt' : 'Cần cải thiện',
 up: avgScore >= 70,
 },
 {
 icon: <CheckCircle size={20} />, color: 'purple',
 value: animCorrect, label: 'Câu trả lời đúng', unit: 'câu',
 trend: totalCorrect > 0 ?`/${totalExams > 0 ? Math.round((pieData[0]?.value || 0) + (pieData[1]?.value || 0)) : 0} tổng` : 'Chưa có',
 up: true,
 },
 {
 icon: <Clock size={20} />, color: 'amber',
 value: null, label: 'Thời gian học', unit: '',
 display: totalSeconds > 0 ? formatTime(totalSeconds) : '0m',
 trend: 'Tích lũy',
 up: true,
 },
].map(({ icon, color, value, label, unit, display, trend, up }) => {
 const colors: Record<string, string> = {
 blue: 'bg-blue-50 text-blue-600',
 green: 'bg-emerald-50 text-emerald-600',
 purple: 'bg-purple-50 text-purple-600',
 amber: 'bg-amber-50 text-amber-600',
 }
 return (
 <div key={label} className="relative overflow-hidden rounded-lg bg-surface border border-secondary/20 p-5 shadow-sm hover:border-secondary/40 transition-colors">
 <div className={`w-10 h-10 rounded-md flex items-center justify-center mb-4 ${colors[color]}`}>
 {icon}
 </div>
 <div className="text-[1.8rem] font-display font-bold text-primary mb-1 leading-none">
 {display ||`${value}${unit}`}
 </div>
 <div className="text-[0.78rem] text-secondary font-display font-bold uppercase tracking-[0.14em]">{label}</div>
 <div className={`flex items-center gap-1 mt-3 text-xs font-bold ${up ? 'text-emerald-600' : 'text-tertiary'}`}>
 {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
 {trend}
 </div>
 </div>
 )
 })}
 </div>

 {/* ── SECTION 2: CHARTS ── */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Line chart */}
 <div className="lg:col-span-2 rounded-lg bg-surface border border-secondary/20 p-6 shadow-sm">
 <div className="flex items-center justify-between mb-6">
 <div>
 <h2 className="font-display font-bold text-[1.2rem] text-primary">Tiến độ điểm số</h2>
 <p className="text-[0.95rem] text-secondary mt-0.5">7 bài thi gần nhất</p>
 </div>
 <TrendingUp size={20} className="text-primary" />
 </div>
 {recentChart.length > 0 ? (
 <ResponsiveContainer width="100%" height={220}>
 <LineChart data={recentChart}>
 <CartesianGrid strokeDasharray="3 3" stroke="#F0F5FA" />
 <XAxis dataKey="date" tick={{ fill: '#5E7386', fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
 <YAxis domain={[0, 10]} tick={{ fill: '#5E7386', fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
 <Tooltip
 contentStyle={{ background: '#FFFFFF', border: '1px solid #5E738633', borderRadius: 6, color: '#0F2436', fontFamily: 'Inter', fontSize: 12, fontWeight: 500, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
 formatter={(v: any) => [`${v} điểm`, 'Điểm']}
 />
 <Line
 type="monotone" dataKey="score" stroke="#0F2436" strokeWidth={3}
 dot={{ fill: '#0F2436', r: 5, strokeWidth: 2, stroke: '#FFFFFF' }}
 activeDot={{ r: 7, fill: '#E63946' }}
 />
 </LineChart>
 </ResponsiveContainer>
 ) : (
 <div className="h-[220px] flex flex-col items-center justify-center text-secondary">
 <BarChart2 size={40} strokeWidth={1.5} className="mb-3 opacity-40" />
 <p className="text-[0.95rem]">Chưa có dữ liệu — hãy làm bài thi đầu tiên!</p>
 <Link href="/practice" className="mt-3 text-tertiary font-display font-bold text-[0.95rem] hover:underline uppercase tracking-[0.14em]">Luyện thi ngay →</Link>
 </div>
 )}
 </div>

 {/* Pie chart */}
 <div className="rounded-lg bg-surface border border-secondary/20 p-6 shadow-sm">
 <div className="flex items-center justify-between mb-6">
 <div>
 <h2 className="font-display font-bold text-[1.2rem] text-primary">Phân bố kết quả</h2>
 <p className="text-[0.95rem] text-secondary mt-0.5">Đúng / Sai</p>
 </div>
 <Target size={20} className="text-primary" />
 </div>
 {pieData[0].value + pieData[1].value > 0 ? (
 <>
 <ResponsiveContainer width="100%" height={160}>
 <PieChart>
 <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
 <Cell fill="#10b981" />
 <Cell fill="#E63946" />
 </Pie>
 <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #5E738633', borderRadius: 6, color: '#0F2436', fontFamily: 'Inter', fontSize: 12, fontWeight: 500, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
 </PieChart>
 </ResponsiveContainer>
 <div className="space-y-2 mt-2">
 {pieData.map((d, i) => {
 const total = pieData.reduce((s, x) => s + x.value, 0)
 const pct = total > 0 ? Math.round((d.value / total) * 100) : 0
 return (
 <div key={d.name} className="flex items-center justify-between text-[0.95rem]">
 <div className="flex items-center gap-2">
 <div className="w-3 h-3 rounded-sm" style={{ background: i === 0 ? '#10b981' : '#E63946' }} />
 <span className="text-secondary font-medium">{d.name}</span>
 </div>
 <span className="font-display font-bold text-primary">{d.value} ({pct}%)</span>
 </div>
 )
 })}
 </div>
 </>
 ) : (
 <div className="h-[200px] flex flex-col items-center justify-center text-secondary">
 <Target size={40} strokeWidth={1.5} className="mb-3 opacity-40" />
 <p className="text-[0.95rem] text-center">Chưa có dữ liệu</p>
 </div>
 )}
 </div>
 </div>

 {/* ── SECTION 3: ENROLLED COURSES ── */}
 <div>
 <div className="flex items-center justify-between mb-4">
 <div>
 <h2 className="font-display font-bold text-[1.2rem] text-primary">Khóa học đang học</h2>
 <p className="text-secondary text-[0.95rem] mt-0.5">{enrollments.length} khóa đã đăng ký</p>
 </div>
 <Link href="/courses" className="flex items-center gap-1 text-tertiary text-[0.78rem] font-display font-bold hover:text-tertiary/80 transition-colors uppercase tracking-[0.14em]">
 Khám phá thêm <ChevronRight size={16} />
 </Link>
 </div>

 {enrollments.length > 0 ? (
 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
 {enrollments.map((e) => {
 const course = e.courses
 const mockProgress = Math.floor(Math.random() * 60) + 20
 return (
 <div key={e.id} className="group rounded-lg bg-surface border border-secondary/20 overflow-hidden hover:border-secondary/40 transition-all shadow-sm">
 <div className="h-28 bg-neutral relative overflow-hidden">
 {course?.thumbnail_url && (
 <img src={course.thumbnail_url} alt={course?.title} className="w-full h-full object-cover" />
 )}
 <div className="absolute top-3 left-3">
 <span className="px-2 py-1 rounded-sm bg-surface border border-secondary/20 text-[0.78rem] font-display font-bold text-primary uppercase tracking-[0.14em]">
 Lớp {course?.grade || '?'}
 </span>
 </div>
 </div>
 <div className="p-4">
 <h3 className="font-display font-bold text-[1.2rem] leading-snug mb-2 group-hover:text-tertiary transition-colors line-clamp-2 text-primary">
 {course?.title || 'Khóa học'}
 </h3>
 <p className="text-secondary text-[0.95rem] mb-3 flex items-center gap-1 font-medium">
 <GraduationCap size={16} /> {course?.teacher_name || 'Giáo viên'}
 </p>
 {/* Progress bar */}
 <div className="mb-4">
 <div className="flex justify-between text-[0.78rem] font-display font-bold uppercase tracking-[0.14em] text-secondary mb-1">
 <span>Tiến độ</span>
 <span className="text-primary">{mockProgress}%</span>
 </div>
 <div className="h-1.5 bg-neutral rounded-sm overflow-hidden">
 <div className="h-full bg-primary rounded-sm transition-all duration-1000" style={{ width:`${mockProgress}%` }} />
 </div>
 </div>
 <Link href={`/courses/${course?.id}`} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-neutral text-primary text-[0.95rem] font-display font-bold hover:bg-secondary/10 transition-colors border border-secondary/20">
 <Play size={14} fill="currentColor" /> Tiếp tục học
 </Link>
 </div>
 </div>
 )
 })}
 </div>
 ) : (
 <div className="rounded-lg bg-neutral border border-secondary/20 border-dashed p-12 text-center">
 <BookOpen size={40} className="mx-auto mb-4 text-secondary opacity-60" strokeWidth={1.5} />
 <p className="text-primary mb-4 font-medium text-[0.95rem]">Bạn chưa đăng ký khóa học nào</p>
 <Link href="/courses" className="inline-flex items-center gap-2 bg-tertiary text-surface px-6 py-3 rounded-md font-display font-bold text-[0.95rem] hover:bg-tertiary/90 transition-colors shadow-sm">
 Khám phá khóa học <ArrowRight size={16} />
 </Link>
 </div>
 )}
 </div>

 {/* ── SECTION 4 + 5 side by side ── */}
 <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

 {/* SECTION 4: HISTORY */}
 <div className="xl:col-span-2 rounded-lg bg-surface border border-secondary/20 p-6 shadow-sm">
 <div className="flex items-center justify-between mb-5">
 <div>
 <h2 className="font-display font-bold text-[1.2rem] text-primary">Lịch sử thi gần đây</h2>
 <p className="text-secondary text-[0.95rem] mt-0.5">5 bài thi mới nhất</p>
 </div>
 <Link href="/practice" className="text-tertiary text-[0.78rem] font-display font-bold hover:text-tertiary/80 flex items-center gap-1 uppercase tracking-[0.14em]">
 Xem tất cả <ChevronRight size={14} />
 </Link>
 </div>

 {recentExams.length > 0 ? (
 <div className="space-y-3">
 {recentExams.map((r) => {
 const badge = scoreBadge(r.score, r.total_questions)
 const scorePct = r.total_questions > 0 ? Math.round((r.score / r.total_questions) * 100) : 0
 return (
 <div key={r.id} className="flex items-center gap-4 p-3 rounded-md bg-neutral hover:bg-secondary/10 transition-colors group border border-transparent hover:border-secondary/20">
 <div className="w-10 h-10 rounded-md bg-surface border border-secondary/20 flex items-center justify-center text-primary flex-shrink-0">
 <Trophy size={18} />
 </div>
 <div className="flex-1 min-w-0">
 <p className="font-display font-bold text-[0.95rem] text-primary truncate">{r.topic || 'Bài luyện thi'}</p>
 <p className="text-secondary text-[0.78rem] font-display font-bold uppercase tracking-[0.14em] mt-1 flex items-center gap-2">
 <span className="flex items-center gap-1"><Clock size={12} /> {formatTime(r.time_spent_seconds || 0)}</span>
 <span>·</span>
 <span>{new Date(r.created_at).toLocaleDateString('vi-VN')}</span>
 </p>
 </div>
 <div className="text-right flex-shrink-0">
 <p className="font-display font-bold text-[1.2rem] text-primary">{scorePct}<span className="text-[0.78rem] text-secondary">%</span></p>
 <span className={`text-[0.6rem] font-display font-bold px-2 py-0.5 rounded-sm uppercase tracking-[0.14em] ${badge.cls}`}>{badge.label}</span>
 </div>
 </div>
 )
 })}
 </div>
 ) : (
 <div className="py-12 text-center text-secondary">
 <Trophy size={36} strokeWidth={1.5} className="mx-auto mb-3 opacity-40" />
 <p className="text-[0.95rem] mb-3">Chưa có lịch sử thi</p>
 <Link href="/practice" className="text-tertiary text-[0.78rem] font-display font-bold hover:underline uppercase tracking-[0.14em]">Bắt đầu luyện thi →</Link>
 </div>
 )}
 </div>

 {/* SECTION 5: LEADERBOARD */}
 <div className="rounded-lg bg-surface border border-secondary/20 p-6 shadow-sm">
 <div className="flex items-center gap-2 mb-5">
 <Trophy size={20} className="text-primary" />
 <div>
 <h2 className="font-display font-bold text-[1.2rem] text-primary">Bảng xếp hạng</h2>
 <p className="text-secondary text-[0.95rem]">Lớp {profile?.grade || '?'}</p>
 </div>
 </div>

 <div className="space-y-2">
 {board.slice(0, 5).map((s, i) => {
 const isMe = s.id === user?.id
 return (
 <div key={s.id || i} className={`flex items-center gap-3 p-3 rounded-md transition-colors border ${isMe ? 'bg-primary/5 border-primary/20' : 'bg-neutral border-transparent hover:border-secondary/20'}`}>
 <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-lg font-display font-bold">
 {i < 3 ? medals[i] : <span className="text-secondary text-[0.95rem]">#{i + 1}</span>}
 </div>
 <div className="flex-1 min-w-0">
 <p className={`font-bold text-[0.95rem] truncate ${isMe ? 'text-primary' : 'text-primary'}`}>
 {s.full_name || 'Học sinh'} {isMe && <span className="text-[0.78rem] text-tertiary ml-1 font-display uppercase tracking-[0.14em]">(Bạn)</span>}
 </p>
 <p className="text-secondary text-[0.78rem] font-display font-bold uppercase tracking-[0.14em] mt-0.5">{s.exam_count || 0} bài thi</p>
 </div>
 <div className="text-right flex-shrink-0">
 <p className="font-display font-bold text-[0.95rem] text-primary">{s.avg_score || 0}<span className="text-[0.78rem] text-secondary">%</span></p>
 </div>
 </div>
 )
 })}

 {board.length === 0 && (
 <div className="py-8 text-center text-secondary text-[0.95rem]">
 <Award size={32} strokeWidth={1.5} className="mx-auto mb-2 opacity-40" />
 Chưa có dữ liệu xếp hạng
 </div>
 )}
 </div>
 </div>
 </div>

 {/* ── SECTION 6: NOTIFICATIONS ── */}
 <div className="rounded-lg bg-surface border border-secondary/20 p-6 shadow-sm">
 <div className="flex items-center justify-between mb-5">
 <div className="flex items-center gap-2">
 <Bell size={20} className="text-primary" />
 <h2 className="font-display font-bold text-[1.2rem] text-primary">Thông báo</h2>
 <span className="px-2 py-0.5 rounded-sm bg-tertiary/10 text-tertiary text-[0.78rem] font-display font-bold border border-tertiary/20">3</span>
 </div>
 <button className="text-secondary text-[0.78rem] font-display font-bold hover:text-primary transition-colors uppercase tracking-[0.14em]">Xem tất cả</button>
 </div>

 <div className="space-y-3">
 {NOTIFS.map((n) => (
 <div key={n.id} className="flex items-start gap-4 p-4 rounded-md bg-neutral hover:bg-secondary/10 transition-colors cursor-pointer group border border-transparent hover:border-secondary/20">
 <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 border border-secondary/10 ${n.iconCls}`}>
 {n.icon}
 </div>
 <div className="flex-1 min-w-0 pt-0.5">
 <p className="font-bold text-[0.95rem] text-primary group-hover:text-tertiary transition-colors">{n.title}</p>
 <p className="text-secondary text-[0.95rem] mt-1 leading-relaxed">{n.body}</p>
 </div>
 <span className="text-secondary text-[0.78rem] font-display font-bold uppercase tracking-[0.14em] flex-shrink-0 mt-1">{n.time}</span>
 </div>
 ))}
 </div>
 </div>

 </div>
 </div>
 )
}
