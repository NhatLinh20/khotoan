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
  if (h > 0) return `${h}h ${m}m`
  return `${m} phút`
}

function scoreBadge(score: number, total: number) {
  const pct = total > 0 ? (score / total) * 100 : 0
  if (pct >= 80) return { label: 'Xuất sắc', cls: 'bg-green-500/20 text-green-400 border border-green-500/30' }
  if (pct >= 60) return { label: 'Tốt', cls: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' }
  return { label: 'Cần cố gắng', cls: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' }
}

// ── Mock notifications ────────────────────────────────────────────────────────
const NOTIFS = [
  { id: 1, type: 'exam', icon: <Zap size={16} />, iconCls: 'bg-blue-500/20 text-blue-400', title: 'Đề thi mới: Toán 12 - Chương 2', body: 'Giáo viên vừa đăng đề thi mới cho lớp 12', time: '5 phút trước' },
  { id: 2, type: 'result', icon: <Star size={16} />, iconCls: 'bg-amber-500/20 text-amber-400', title: 'Kết quả đã được cập nhật', body: 'Bài thi Lượng giác của bạn đã được chấm điểm', time: '2 giờ trước' },
  { id: 3, type: 'system', icon: <Bell size={16} />, iconCls: 'bg-slate-500/20 text-slate-400', title: 'Cập nhật hệ thống', body: 'Kho Toán vừa thêm 50 câu hỏi mới vào ngân hàng đề', time: '1 ngày trước' },
]

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function DashboardClient({
  profile, user, totalExams, avgScore, totalCorrect, totalSeconds,
  recentChart, pieData, enrollments, recentExams, leaderboard,
}: Props) {
  const animExams    = useCountUp(totalExams)
  const animScore    = useCountUp(avgScore)
  const animCorrect  = useCountUp(totalCorrect)

  const avatarLetter = (profile?.full_name || user?.email || 'U')[0].toUpperCase()
  const joinDate = new Date(profile?.created_at || Date.now()).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })

  // Mock leaderboard if empty
  const board = leaderboard.length > 0 ? leaderboard : [
    { id: user?.id, full_name: profile?.full_name || 'Bạn', grade: profile?.grade, avg_score: avgScore, exam_count: totalExams },
  ]

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── HEADER ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#185FA5] via-[#1a4f8a] to-[#0d2b50] p-8 shadow-2xl">
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-black shadow-xl border border-white/20">
                {avatarLetter}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-[#0a0f1e]" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black truncate">
                  Xin chào, {profile?.full_name || 'Học viên'}! 👋
                </h1>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold border border-green-500/30">
                  ✓ Đã kích hoạt
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-blue-200 text-sm mt-2">
                <span className="flex items-center gap-1.5">
                  <GraduationCap size={14} />
                  Lớp {profile?.grade || '?'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  Tham gia {joinDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Trophy size={14} />
                  {totalExams} bài đã thi
                </span>
              </div>
            </div>

            {/* Quick action */}
            <Link href="/practice" className="flex-shrink-0 flex items-center gap-2 bg-white text-[#185FA5] px-5 py-3 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all shadow-lg hover:scale-105 active:scale-95">
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
              trend: totalCorrect > 0 ? `/${totalExams > 0 ? Math.round((pieData[0]?.value || 0) + (pieData[1]?.value || 0)) : 0} tổng` : 'Chưa có',
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
              blue: 'from-blue-600/20 to-blue-600/5 border-blue-500/20 text-blue-400',
              green: 'from-green-600/20 to-green-600/5 border-green-500/20 text-green-400',
              purple: 'from-purple-600/20 to-purple-600/5 border-purple-500/20 text-purple-400',
              amber: 'from-amber-600/20 to-amber-600/5 border-amber-500/20 text-amber-400',
            }
            return (
              <div key={label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors[color]} border p-5 hover:scale-[1.02] transition-transform`}>
                <div className={`w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center mb-4 ${colors[color].split(' ')[3]}`}>
                  {icon}
                </div>
                <div className="text-3xl font-black text-white mb-1">
                  {display || `${value}${unit}`}
                </div>
                <div className="text-sm text-slate-400 font-medium">{label}</div>
                <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${up ? 'text-green-400' : 'text-orange-400'}`}>
                  {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {trend}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── SECTION 2: CHARTS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line chart */}
          <div className="lg:col-span-2 rounded-2xl bg-[#111827] border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-black text-lg">Tiến độ điểm số</h2>
                <p className="text-slate-400 text-sm mt-0.5">7 bài thi gần nhất</p>
              </div>
              <TrendingUp size={20} className="text-blue-400" />
            </div>
            {recentChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={recentChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 12, color: '#fff' }}
                    formatter={(v: any) => [`${v} điểm`, 'Điểm']}
                  />
                  <Line
                    type="monotone" dataKey="score" stroke="#185FA5" strokeWidth={3}
                    dot={{ fill: '#185FA5', r: 5, strokeWidth: 2, stroke: '#0a0f1e' }}
                    activeDot={{ r: 7, fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex flex-col items-center justify-center text-slate-500">
                <BarChart2 size={40} strokeWidth={1} className="mb-3 opacity-40" />
                <p className="text-sm">Chưa có dữ liệu — hãy làm bài thi đầu tiên!</p>
                <Link href="/practice" className="mt-3 text-blue-400 text-sm font-bold hover:underline">Luyện thi ngay →</Link>
              </div>
            )}
          </div>

          {/* Pie chart */}
          <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-black text-lg">Phân bố kết quả</h2>
                <p className="text-slate-400 text-sm mt-0.5">Đúng / Sai</p>
              </div>
              <Target size={20} className="text-green-400" />
            </div>
            {pieData[0].value + pieData[1].value > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                      {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 12, color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {pieData.map((d) => {
                    const total = pieData.reduce((s, x) => s + x.value, 0)
                    const pct = total > 0 ? Math.round((d.value / total) * 100) : 0
                    return (
                      <div key={d.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                          <span className="text-slate-300">{d.name}</span>
                        </div>
                        <span className="font-bold text-white">{d.value} ({pct}%)</span>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="h-[200px] flex flex-col items-center justify-center text-slate-500">
                <Target size={40} strokeWidth={1} className="mb-3 opacity-40" />
                <p className="text-sm text-center">Chưa có dữ liệu</p>
              </div>
            )}
          </div>
        </div>

        {/* ── SECTION 3: ENROLLED COURSES ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-black text-xl">Khóa học đang học</h2>
              <p className="text-slate-400 text-sm mt-0.5">{enrollments.length} khóa đã đăng ký</p>
            </div>
            <Link href="/courses" className="flex items-center gap-1 text-blue-400 text-sm font-bold hover:text-blue-300 transition-colors">
              Khám phá thêm <ChevronRight size={16} />
            </Link>
          </div>

          {enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {enrollments.map((e) => {
                const course = e.courses
                const mockProgress = Math.floor(Math.random() * 60) + 20
                return (
                  <div key={e.id} className="group rounded-2xl bg-[#111827] border border-slate-800 overflow-hidden hover:border-blue-500/40 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                    <div className="h-28 bg-gradient-to-br from-blue-900/40 to-purple-900/40 relative overflow-hidden">
                      {course?.thumbnail_url && (
                        <img src={course.thumbnail_url} alt={course?.title} className="w-full h-full object-cover opacity-60" />
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 rounded-lg bg-black/40 backdrop-blur text-xs font-bold text-blue-300">
                          Lớp {course?.grade || '?'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm leading-snug mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
                        {course?.title || 'Khóa học'}
                      </h3>
                      <p className="text-slate-400 text-xs mb-3 flex items-center gap-1">
                        <GraduationCap size={11} /> {course?.teacher_name || 'Giáo viên'}
                      </p>
                      {/* Progress bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Tiến độ</span>
                          <span className="text-blue-400 font-bold">{mockProgress}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000" style={{ width: `${mockProgress}%` }} />
                        </div>
                      </div>
                      <Link href={`/courses/${course?.id}`} className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-blue-600/20 text-blue-400 text-xs font-bold hover:bg-blue-600/30 transition-colors border border-blue-500/20">
                        <Play size={12} fill="currentColor" /> Tiếp tục học
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-[#111827] border border-slate-800 border-dashed p-12 text-center">
              <BookOpen size={40} className="mx-auto mb-4 text-slate-600" strokeWidth={1} />
              <p className="text-slate-400 mb-4 font-medium">Bạn chưa đăng ký khóa học nào</p>
              <Link href="/courses" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                Khám phá khóa học <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* ── SECTION 4 + 5 side by side ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* SECTION 4: HISTORY */}
          <div className="xl:col-span-2 rounded-2xl bg-[#111827] border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-black text-lg">Lịch sử thi gần đây</h2>
                <p className="text-slate-400 text-sm">5 bài thi mới nhất</p>
              </div>
              <Link href="/practice" className="text-blue-400 text-sm font-bold hover:text-blue-300 flex items-center gap-1">
                Xem tất cả <ChevronRight size={14} />
              </Link>
            </div>

            {recentExams.length > 0 ? (
              <div className="space-y-3">
                {recentExams.map((r) => {
                  const badge = scoreBadge(r.score, r.total_questions)
                  const scorePct = r.total_questions > 0 ? Math.round((r.score / r.total_questions) * 100) : 0
                  return (
                    <div key={r.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                        <Trophy size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{r.topic || 'Bài luyện thi'}</p>
                        <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-2">
                          <span className="flex items-center gap-1"><Clock size={10} /> {formatTime(r.time_spent_seconds || 0)}</span>
                          <span>·</span>
                          <span>{new Date(r.created_at).toLocaleDateString('vi-VN')}</span>
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-black text-lg text-white">{scorePct}<span className="text-xs text-slate-400">%</span></p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500">
                <Trophy size={36} strokeWidth={1} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm mb-3">Chưa có lịch sử thi</p>
                <Link href="/practice" className="text-blue-400 text-sm font-bold hover:underline">Bắt đầu luyện thi →</Link>
              </div>
            )}
          </div>

          {/* SECTION 5: LEADERBOARD */}
          <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Trophy size={18} className="text-amber-400" />
              <div>
                <h2 className="font-black text-lg">Bảng xếp hạng</h2>
                <p className="text-slate-400 text-sm">Lớp {profile?.grade || '?'}</p>
              </div>
            </div>

            <div className="space-y-2">
              {board.slice(0, 5).map((s, i) => {
                const isMe = s.id === user?.id
                return (
                  <div key={s.id || i} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isMe ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-slate-800/40 hover:bg-slate-800/70'}`}>
                    <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 text-lg font-black">
                      {i < 3 ? medals[i] : <span className="text-slate-500 text-sm">#{i + 1}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm truncate ${isMe ? 'text-blue-300' : 'text-white'}`}>
                        {s.full_name || 'Học sinh'} {isMe && <span className="text-[10px] text-blue-400">(Bạn)</span>}
                      </p>
                      <p className="text-slate-400 text-xs">{s.exam_count || 0} bài thi</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-black text-sm text-white">{s.avg_score || 0}<span className="text-xs text-slate-400">%</span></p>
                    </div>
                  </div>
                )
              })}

              {board.length === 0 && (
                <div className="py-8 text-center text-slate-500 text-sm">
                  <Award size={32} strokeWidth={1} className="mx-auto mb-2 opacity-40" />
                  Chưa có dữ liệu xếp hạng
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── SECTION 6: NOTIFICATIONS ── */}
        <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-slate-400" />
              <h2 className="font-black text-lg">Thông báo</h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">3</span>
            </div>
            <button className="text-slate-400 text-sm hover:text-white transition-colors">Xem tất cả</button>
          </div>

          <div className="space-y-3">
            {NOTIFS.map((n) => (
              <div key={n.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 transition-colors cursor-pointer group">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${n.iconCls}`}>
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm group-hover:text-blue-300 transition-colors">{n.title}</p>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">{n.body}</p>
                </div>
                <span className="text-slate-500 text-xs flex-shrink-0 mt-0.5">{n.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
