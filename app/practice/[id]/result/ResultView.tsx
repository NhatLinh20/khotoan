'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
 CheckCircle2, XCircle, Clock, BookOpen, RotateCcw,
 Home, ChevronRight, Trophy, HelpCircle,
} from 'lucide-react'

// ──────────────────────────────────
// Types
// ──────────────────────────────────
type TfAnswer = { label: string; is_correct: boolean }

type Question = {
 id: string
 order_index: number
 type: string
 correct_answer?: string | null
 correct_number?: number | null
 max_score?: number | null
 tf_answers?: TfAnswer[] | null
 questions?: { content: string } | null
}

type StudentAnswer = {
 mc?: string
 tf?: Record<string, boolean>
 short?: string
 essay?: string
}

type Exam = {
 id: string
 title: string
 grade: number
 subject: string
 duration_min: number
 exam_type: 'bank' | 'pdf'
}

const TF_SCORE_MAP = [0, 0.1, 0.25, 0.5, 1]
const SUBJECT_MAP: Record<string, string> = { D: 'Đại số', H: 'Hình học', C: 'Chuyên đề' }

// ──────────────────────────────────
// Scoring logic
// ──────────────────────────────────
function scoreQuestion(q: Question, a: StudentAnswer): { score: number; status: 'correct' | 'wrong' | 'partial' | 'pending'; tfText?: string } {
 const max = q.max_score ?? 1
 if (q.type === 'mc') {
 if (!a.mc) return { score: 0, status: 'wrong' }
 return a.mc === q.correct_answer
 ? { score: max, status: 'correct' }
 : { score: 0, status: 'wrong' }
 }
 if (q.type === 'tf') {
 const key = q.tf_answers ?? []
 const tfMap = a.tf ?? {}
 const correctCount = key.filter(k => tfMap[k.label] === k.is_correct).length
 const s = TF_SCORE_MAP[correctCount] ?? 0
 const status = correctCount === key.length ? 'correct' : correctCount > 0 ? 'partial' : 'wrong'
 return { score: s, status, tfText:`${correctCount}/${key.length} ý` }
 }
 if (q.type === 'short') {
 const studentNum = parseFloat(a.short ?? '')
 if (isNaN(studentNum)) return { score: 0, status: 'wrong' }
 const correct = Math.abs(studentNum - (q.correct_number ?? 0)) <= 0.01
 return { score: correct ? max : 0, status: correct ? 'correct' : 'wrong' }
 }
 if (q.type === 'essay') {
 return { score: 0, status: 'pending' }
 }
 return { score: 0, status: 'wrong' }
}

function formatAnswer(q: Question, a: StudentAnswer): string {
 if (!a) return '—'
 if (q.type === 'mc') return a.mc ?? '—'
 if (q.type === 'tf') {
 const labels = ['a', 'b', 'c', 'd']
 return labels.map(l =>`${l.toUpperCase()}:${a.tf?.[l] === true ? 'Đ' : a.tf?.[l] === false ? 'S' : '?'}`).join(' ')
 }
 if (q.type === 'short') return a.short ?? '—'
 if (q.type === 'essay') return (a.essay ?? '').slice(0, 40) || '—'
 return '—'
}

function formatCorrect(q: Question): string {
 if (q.type === 'mc') return q.correct_answer ?? '—'
 if (q.type === 'tf') {
 const answers = q.tf_answers ?? []
 return answers.map(t =>`${t.label.toUpperCase()}:${t.is_correct ? 'Đ' : 'S'}`).join(' ')
 }
 if (q.type === 'short') return String(q.correct_number ?? '—')
 if (q.type === 'essay') return '(GV chấm)'
 return '—'
}

function formatTime(seconds: number): string {
 const m = Math.floor(seconds / 60)
 const s = seconds % 60
 return`${m} phút ${s} giây`
}

// ──────────────────────────────────
// Main Component
// ──────────────────────────────────
export default function ResultView({
 exam, questions, userId,
}: {
 exam: Exam
 questions: Question[]
 userId: string
}) {
 const router = useRouter()
 const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({})
 const [timeSpent, setTimeSpent] = useState(0)
 const [saved, setSaved] = useState(false)
 const [error, setError] = useState<string | null>(null)

 // Load from localStorage
 useEffect(() => {
 const storageKey =`practice_${exam.id}_${userId}`
 const resultKey =`result_${exam.id}_${userId}`
 try {
 const resultData = localStorage.getItem(resultKey)
 if (resultData) {
 const parsed = JSON.parse(resultData)
 setAnswers(parsed.answers ?? {})
 setTimeSpent(parsed.timeSpent ?? 0)
 } else {
 const answerData = localStorage.getItem(storageKey)
 if (answerData) setAnswers(JSON.parse(answerData))
 }
 } catch {}
 }, [exam.id, userId])

 // Compute scores
 const results = questions.map(q => ({
 question: q,
 answer: answers[q.id] ?? {},
 ...scoreQuestion(q, answers[q.id] ?? {}),
 }))

 const totalScore = results.reduce((s, r) => s + r.score, 0)
 const maxTotal = questions.reduce((s, q) => s + (q.max_score ?? 1), 0)
 const correctCount = results.filter(r => r.status === 'correct').length
 const wrongCount = results.filter(r => r.status === 'wrong').length
 const pendingCount = results.filter(r => r.status === 'pending').length
 const pct = maxTotal > 0 ? Math.round((totalScore / maxTotal) * 100) : 0

 // Save to DB once
 useEffect(() => {
 if (saved || questions.length === 0) return
 const supabase = createClient()
 supabase.from('exam_results').insert({
 user_id: userId,
 exam_id: exam.id,
 score: totalScore,
 total_questions: questions.length,
 time_spent_seconds: timeSpent,
 }).then(({ error: e }) => {
 if (e) setError(e.message)
 setSaved(true)
 })

 // Clean localStorage after save
 try {
 localStorage.removeItem(`practice_${exam.id}_${userId}`)
 localStorage.removeItem(`result_${exam.id}_${userId}`)
 } catch {}
 }, [saved, questions.length])

 const grade = pct >= 90 ? 'Xuất sắc' : pct >= 70 ? 'Khá' : pct >= 50 ? 'Trung bình' : 'Cần cố gắng'
 const gradeColor = pct >= 90 ? 'text-emerald-500' : pct >= 70 ? 'text-blue-500' : pct >= 50 ? 'text-amber-500' : 'text-tertiary'

 return (
 <div className="min-h-screen bg-neutral font-body">
 <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-6">

 {/* Score Card */}
 <div className="bg-surface rounded-lg border border-secondary/20 shadow-sm overflow-hidden">
 <div className="bg-neutral px-6 py-8 text-center border-b border-secondary/20">
 <div className="inline-flex items-center justify-center w-20 h-20 rounded-md bg-surface border border-secondary/20 shadow-sm mb-4">
 <Trophy className={`${gradeColor}`} size={36} />
 </div>
 <h1 className="text-[1.2rem] font-display font-bold text-primary mb-1">{exam.title}</h1>
 <p className="text-[0.95rem] text-secondary mb-4">Lớp {exam.grade} · {SUBJECT_MAP[exam.subject] ?? exam.subject}</p>
 <div className={`text-5xl font-display font-bold tabular-nums ${gradeColor} mb-1`}>
 {totalScore.toFixed(2)}
 <span className="text-2xl text-secondary">/{maxTotal.toFixed(0)}</span>
 </div>
 <p className={`text-lg font-display font-bold ${gradeColor}`}>{grade} — {pct}%</p>
 </div>

 {/* Stats */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y md:divide-y-0 divide-secondary/20">
 <div className="px-4 py-5 text-center">
 <CheckCircle2 className="mx-auto mb-1.5 text-emerald-500" size={20} />
 <p className="text-[1.2rem] font-display font-bold text-primary">{correctCount}</p>
 <p className="text-[0.78rem] text-secondary font-display font-bold uppercase tracking-[0.14em]">Câu đúng</p>
 </div>
 <div className="px-4 py-5 text-center">
 <XCircle className="mx-auto mb-1.5 text-tertiary" size={20} />
 <p className="text-[1.2rem] font-display font-bold text-primary">{wrongCount}</p>
 <p className="text-[0.78rem] text-secondary font-display font-bold uppercase tracking-[0.14em]">Câu sai</p>
 </div>
 <div className="px-4 py-5 text-center">
 <HelpCircle className="mx-auto mb-1.5 text-secondary" size={20} />
 <p className="text-[1.2rem] font-display font-bold text-primary">{pendingCount}</p>
 <p className="text-[0.78rem] text-secondary font-display font-bold uppercase tracking-[0.14em]">Chờ chấm</p>
 </div>
 <div className="px-4 py-5 text-center">
 <Clock className="mx-auto mb-1.5 text-blue-500" size={20} />
 <p className="text-[0.95rem] font-display font-bold text-primary">{formatTime(timeSpent)}</p>
 <p className="text-[0.78rem] text-secondary font-display font-bold uppercase tracking-[0.14em]">Thời gian</p>
 </div>
 </div>
 </div>

 {error && <p className="text-[0.78rem] text-tertiary text-center font-display font-bold uppercase tracking-[0.14em]">Lưu kết quả thất bại: {error}</p>}

 {/* Review Table */}
 <div className="bg-surface rounded-lg border border-secondary/20 overflow-hidden shadow-sm">
 <div className="px-5 py-4 border-b border-secondary/20">
 <h2 className="text-[0.95rem] font-display font-bold text-primary flex items-center gap-2">
 <BookOpen size={16} className="text-primary" /> Xem lại chi tiết
 </h2>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-[0.95rem]">
 <thead>
 <tr className="bg-neutral border-b border-secondary/20">
 <th className="px-3 py-2.5 text-left text-[0.78rem] font-display font-bold text-secondary uppercase tracking-[0.14em] w-10">STT</th>
 <th className="px-3 py-2.5 text-center text-[0.78rem] font-display font-bold text-secondary uppercase tracking-[0.14em] w-32">Đáp án của bạn</th>
 <th className="px-3 py-2.5 text-center text-[0.78rem] font-display font-bold text-secondary uppercase tracking-[0.14em] w-32">Đáp án đúng</th>
 <th className="px-3 py-2.5 text-center text-[0.78rem] font-display font-bold text-secondary uppercase tracking-[0.14em] w-20">Điểm</th>
 <th className="px-3 py-2.5 text-center text-[0.78rem] font-display font-bold text-secondary uppercase tracking-[0.14em] w-24">Kết quả</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-secondary/20">
 {results.map(({ question: q, answer: a, score, status, tfText }) => (
 <tr key={q.id} className="hover:bg-neutral/50">
 <td className="px-3 py-3 text-center text-[0.78rem] font-display font-bold text-secondary">{q.order_index}</td>
 <td className="px-3 py-3 text-center">
 <span className="text-[0.95rem] font-bold text-secondary font-mono">
 {formatAnswer(q, a)}
 </span>
 </td>
 <td className="px-3 py-3 text-center">
 <span className="text-[0.95rem] font-bold text-emerald-600 font-mono">
 {formatCorrect(q)}
 </span>
 </td>
 <td className="px-3 py-3 text-center">
 <span className="text-[0.95rem] font-display font-bold text-primary">{score.toFixed(2)}</span>
 <span className="text-[0.78rem] text-secondary">/{q.max_score ?? 1}</span>
 </td>
 <td className="px-3 py-3 text-center">
 {status === 'correct' && q.type !== 'tf' && (
 <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-display font-bold bg-emerald-100 text-emerald-700">
 <CheckCircle2 size={10} /> Đúng
 </span>
 )}
 {q.type === 'tf' && (
 <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-display font-bold ${
 status === 'correct' ? 'bg-emerald-100 text-emerald-700' :
 status === 'partial' ? 'bg-amber-100 text-amber-700' :
 'bg-red-100 text-red-700'
 }`}>
 {status === 'wrong' ? <XCircle size={10} /> : <CheckCircle2 size={10} />} {tfText}
 </span>
 )}
 {status === 'wrong' && q.type !== 'tf' && (
 <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-display font-bold bg-red-100 text-red-700">
 <XCircle size={10} /> Sai
 </span>
 )}
 {status === 'pending' && (
 <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-display font-bold bg-secondary/10 text-secondary">
 <HelpCircle size={10} /> Chờ chấm
 </span>
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Actions */}
 <div className="flex flex-col sm:flex-row gap-3 justify-center">
 <Link href="/practice"
 className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-secondary/20 text-[0.95rem] font-display font-bold text-secondary hover:bg-neutral transition-all shadow-sm">
 <Home size={16} /> Về trang luyện thi
 </Link>
 <Link href={`/practice/${exam.id}`}
 className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-tertiary text-surface text-[0.95rem] font-display font-bold hover:bg-tertiary/90 transition-all shadow-sm">
 <RotateCcw size={16} /> Làm lại
 </Link>
 </div>
 </div>
 </div>
 )
}
