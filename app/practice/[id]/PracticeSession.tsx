'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, ChevronLeft, ChevronRight, Send, AlertTriangle, CheckCircle2 } from 'lucide-react'
import LatexPreview from '@/components/LatexPreview'

// ──────────────────────────────────
// Types
// ──────────────────────────────────
type TfAnswer = { label: string; is_correct: boolean }

type Question = {
 id: string
 order_index: number
 type: 'mc' | 'tf' | 'short' | 'essay'
 correct_answer?: string | null
 correct_number?: number | null
 max_score?: number | null
 tf_answers?: TfAnswer[] | null
 questions?: {
 content: string
 image_url?: string | null
 option_a?: string | null
 option_b?: string | null
 option_c?: string | null
 option_d?: string | null
 question_tf_items?: { label: string; content: string; is_correct: boolean }[]
 } | null
}

type Exam = {
 id: string
 title: string
 grade: number
 subject: string
 duration_min: number
 exam_type: 'bank' | 'pdf'
 pdf_url?: string | null
 description?: string | null
}

type StudentAnswer = {
 mc?: string
 tf?: Record<string, boolean> // label → true/false
 short?: string
 essay?: string
}

// ──────────────────────────────────
// Countdown Hook
// ──────────────────────────────────
function useCountdown(totalSeconds: number, onExpire: () => void) {
 const [remaining, setRemaining] = useState(totalSeconds)
 const expiredRef = useRef(false)

 useEffect(() => {
 if (remaining <= 0) {
 if (!expiredRef.current) { expiredRef.current = true; onExpire() }
 return
 }
 const t = setTimeout(() => setRemaining(r => r - 1), 1000)
 return () => clearTimeout(t)
 }, [remaining, onExpire])

 const mm = Math.floor(remaining / 60).toString().padStart(2, '0')
 const ss = (remaining % 60).toString().padStart(2, '0')
 return { display:`${mm}:${ss}`, remaining, isWarning: remaining <= 300 }
}

// ──────────────────────────────────
// Single Question Answer UI
// ──────────────────────────────────
function AnswerInput({
 question, answer, onChange, compact = false,
}: {
 question: Question
 answer: StudentAnswer
 onChange: (a: StudentAnswer) => void
 compact?: boolean
}) {
 const { type } = question
 const opts = question.questions

 if (type === 'mc') {
 const choices = [
 { key: 'A', text: opts?.option_a ?? 'A' },
 { key: 'B', text: opts?.option_b ?? 'B' },
 { key: 'C', text: opts?.option_c ?? 'C' },
 { key: 'D', text: opts?.option_d ?? 'D' },
]
 return (
 <div className={`flex ${compact ? 'flex-row gap-1' : 'flex-col gap-2'}`}>
 {choices.map(c => (
 <button key={c.key} type="button"
 onClick={() => onChange({ ...answer, mc: c.key })}
 className={`flex items-center gap-2 px-3 py-2 border font-bold transition-all text-left ${answer.mc === c.key
 ? 'bg-tertiary border-tertiary text-surface shadow-sm'
 : 'bg-surface border-secondary/20 text-primary hover:border-tertiary/50'
 } ${compact ? 'flex-col items-center justify-center w-9 h-8 rounded-md text-[11px] px-1' : 'rounded-md text-[0.95rem]'}`}>
 {compact ? c.key : (
 <>
 <span className={`w-6 h-6 rounded-sm flex items-center justify-center text-[0.78rem] font-display font-bold shrink-0 ${answer.mc === c.key ? 'bg-surface/20' : 'bg-neutral'}`}>{c.key}</span>
 <LatexPreview content={c.text} />
 </>
 )}
 </button>
 ))}
 </div>
 )
 }

 if (type === 'tf') {
 const labels = ['a', 'b', 'c', 'd']
 const tfMap = answer.tf ?? {}
 return (
 <div className={`${compact ? 'flex items-center justify-around w-full px-2' : 'space-y-2'}`}>
 {labels.map(label => {
 const item = opts?.question_tf_items?.find(i => i.label === label)
 const val = tfMap[label]
 
 if (compact) {
 return (
 <div key={label} className="flex flex-col items-center gap-1.5">
 <span className="text-[12px] font-display font-bold text-secondary uppercase">{label}</span>
 <button type="button" 
 onClick={() => {
 const newVal = val === undefined ? true : val === true ? false : true
 onChange({ ...answer, tf: { ...tfMap, [label]: newVal } })
 }}
 className={`w-10 h-8 rounded-md text-xs font-bold transition-all border ${
 val === true ? 'bg-emerald-500 text-surface border-emerald-500 shadow-sm' : 
 val === false ? 'bg-red-50 text-red-500 border-red-200' : 
 'bg-surface border-secondary/20 text-secondary hover:border-secondary'
 }`}>
 {val === true ? 'Đ' : val === false ? 'S' : '-'}
 </button>
 </div>
 )
 }

 return (
 <div key={label} className={`flex items-center gap-2 p-2 rounded-md bg-neutral`}>
 <span className={`text-[0.78rem] font-display font-bold uppercase text-secondary shrink-0 w-4`}>{label}.</span>
 {item && (
 <div className="flex-1 text-[0.95rem] font-medium text-primary overflow-hidden"><LatexPreview content={item.content} /></div>
 )}
 <div className={`flex items-center gap-1`}>
 <button type="button" onClick={() => onChange({ ...answer, tf: { ...tfMap, [label]: true } })}
 className={`px-3 py-1.5 rounded-md text-[0.78rem] font-display font-bold border transition-all shrink-0 ${tfMap[label] === true ? 'bg-emerald-500 text-surface border-emerald-500' : 'bg-surface border-secondary/20 text-secondary hover:border-emerald-400'}`}>
 Đúng
 </button>
 <button type="button" onClick={() => onChange({ ...answer, tf: { ...tfMap, [label]: false } })}
 className={`px-3 py-1.5 rounded-md text-[0.78rem] font-display font-bold border transition-all shrink-0 ${tfMap[label] === false ? 'bg-red-500 text-surface border-red-500' : 'bg-surface border-secondary/20 text-secondary hover:border-red-400'}`}>
 Sai
 </button>
 </div>
 </div>
 )})}
 </div>
 )
 }

 if (type === 'short') {
 return (
 <input type="number" step="any" value={answer.short ?? ''}
 onChange={e => onChange({ ...answer, short: e.target.value })}
 placeholder="Nhập đáp số..."
 className={`px-3 py-2 bg-neutral border border-secondary/20 rounded-md text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-tertiary/20 text-primary ${compact ? 'w-28' : 'w-48'}`} />
 )
 }

 if (type === 'essay') {
 return (
 <textarea value={answer.essay ?? ''}
 onChange={e => onChange({ ...answer, essay: e.target.value })}
 placeholder="Nhập bài làm..."
 rows={compact ? 2 : 4}
 className="w-full px-3 py-2 bg-neutral border border-secondary/20 rounded-md text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-tertiary/20 resize-none text-primary" />
 )
 }

 return null
}

// ──────────────────────────────────
// Main Component
// ──────────────────────────────────
export default function PracticeSession({
 exam, questions, userId,
}: {
 exam: Exam
 questions: Question[]
 userId: string
}) {
 const router = useRouter()
 const totalSec = exam.duration_min * 60
 const storageKey =`practice_${exam.id}_${userId}`
 const startTimeRef = useRef(Date.now())

 // Load answers from localStorage
 const [answers, setAnswers] = useState<Record<string, StudentAnswer>>(() => {
 if (typeof window === 'undefined') return {}
 try {
 const saved = localStorage.getItem(storageKey)
 return saved ? JSON.parse(saved) : {}
 } catch { return {} }
 })

 const [currentIdx, setCurrentIdx] = useState(0)
 const [showConfirm, setShowConfirm] = useState(false)
 const [submitting, setSubmitting] = useState(false)
 const [mobileTab, setMobileTab] = useState<'pdf' | 'answers'>('pdf')

 // Persist answers
 useEffect(() => {
 try { localStorage.setItem(storageKey, JSON.stringify(answers)) } catch {}
 }, [answers, storageKey])

 const updateAnswer = useCallback((qid: string, a: StudentAnswer) => {
 setAnswers(prev => ({ ...prev, [qid]: a }))
 }, [])

 // Submit
 const handleSubmit = useCallback(async () => {
 setSubmitting(true)
 const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000)
 const payload = { examId: exam.id, answers, timeSpent }
 try {
 localStorage.setItem(`result_${exam.id}_${userId}`, JSON.stringify(payload))
 } catch {}
 router.push(`/practice/${exam.id}/result`)
 }, [exam.id, answers, userId, router])

 const { display: timeDisplay, isWarning } = useCountdown(totalSec, handleSubmit)

 const answeredCount = questions.filter(q => {
 const a = answers[q.id]
 if (!a) return false
 if (q.type === 'mc') return !!a.mc
 if (q.type === 'tf') return Object.keys(a.tf ?? {}).length > 0
 if (q.type === 'short') return (a.short ?? '').trim() !== ''
 if (q.type === 'essay') return (a.essay ?? '').trim() !== ''
 return false
 }).length

 const currentQ = questions[currentIdx]

 // Auto-scroll to top when question changes in bank mode
 useEffect(() => {
 if (exam.exam_type === 'bank') {
 window.scrollTo({ top: 0, behavior: 'smooth' })
 }
 }, [currentIdx, exam.exam_type])

 // ── PDF Layout ──
 if (exam.exam_type === 'pdf') {
 return (
 <div className="fixed inset-0 top-16 md:top-20 z-40 flex flex-col md:flex-row overflow-hidden bg-surface font-body">
 {/* Mobile Tabs Header */}
 <div className="md:hidden flex items-center bg-surface border-b border-secondary/20 shrink-0">
 <button onClick={() => setMobileTab('pdf')} className={`flex-1 py-3 text-[0.95rem] font-bold border-b-2 transition-colors ${mobileTab === 'pdf' ? 'border-tertiary text-tertiary bg-tertiary/5' : 'border-transparent text-secondary'}`}>Đề thi</button>
 <button onClick={() => setMobileTab('answers')} className={`flex-1 py-3 text-[0.95rem] font-bold border-b-2 transition-colors flex justify-center items-center gap-2 ${mobileTab === 'answers' ? 'border-tertiary text-tertiary bg-tertiary/5' : 'border-transparent text-secondary'}`}>
 Phiếu trả lời 
 <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${mobileTab === 'answers' ? 'bg-tertiary/10 text-tertiary' : 'bg-neutral text-secondary'}`}>
 {answeredCount}/{questions.length}
 </span>
 </button>
 </div>

 <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
 {/* Top/Left: PDF */}
 <div className={`flex-1 overflow-hidden bg-neutral ${mobileTab === 'pdf' ? 'block' : 'hidden md:block'}`}>
 <iframe
 src={exam.pdf_url ?? ''}
 className="w-full h-full border-0"
 title="Đề thi PDF"
 />
 </div>

 {/* Bottom/Right: Answer Panel */}
 <div className={`w-full md:w-[400px] shrink-0 md:border-l border-secondary/20 bg-surface flex-col overflow-hidden ${mobileTab === 'answers' ? 'flex h-full' : 'hidden md:flex h-full'}`}>
 {/* Header */}
 <div className="px-3 py-3 border-b border-secondary/20 shrink-0">
 <div className="flex items-center justify-between mb-2">
 <h1 className="text-[1.2rem] font-display font-bold text-primary line-clamp-1 flex-1 pr-2">{exam.title}</h1>
 <span className={`flex items-center gap-1 text-[0.95rem] font-display font-bold tabular-nums shrink-0 ${isWarning ? 'text-red-500' : 'text-tertiary'}`}>
 <Clock size={14} /> {timeDisplay}
 </span>
 </div>

 {/* Question Navigator Grid */}
 <div className="grid grid-cols-11 gap-1">
 {questions.map((q, i) => {
 const a = answers[q.id]
 const answered = q.type === 'mc' ? !!a?.mc
 : q.type === 'tf' ? Object.keys(a?.tf ?? {}).length > 0
 : q.type === 'short' ? (a?.short ?? '').trim() !== ''
 : (a?.essay ?? '').trim() !== ''
 return (
 <button key={`nav-${q.id}`} type="button" onClick={() => {
 document.getElementById(`q-${q.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
 }}
 className={`w-full aspect-square flex items-center justify-center rounded-sm text-[10px] font-display font-bold transition-all border ${
 answered 
 ? 'bg-tertiary border-tertiary text-surface shadow-sm' 
 : 'bg-surface border-secondary/20 text-secondary hover:border-tertiary/50 hover:text-tertiary'
 }`}>
 {i + 1}
 </button>
 )
 })}
 </div>

 {isWarning && (
 <div className="flex items-center gap-1.5 mt-2 px-2.5 py-1.5 bg-red-50 rounded-md">
 <AlertTriangle size={12} className="text-red-500 shrink-0" />
 <span className="text-[10px] font-bold text-red-600">Còn dưới 5 phút!</span>
 </div>
 )}
 </div>

 {/* Questions list */}
 <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
 {questions.map((q, i) => {
 const a = answers[q.id] ?? {}
 const answered = q.type === 'mc' ? !!a.mc
 : q.type === 'tf' ? Object.keys(a.tf ?? {}).length > 0
 : q.type === 'short' ? (a.short ?? '').trim() !== ''
 : (a.essay ?? '').trim() !== ''
 return (
 <div id={`q-${q.id}`} key={q.id} className={`p-3 rounded-md border transition-all ${answered ? 'border-tertiary/30 bg-tertiary/5' : 'border-secondary/20 bg-surface'} ${q.type === 'mc' ? 'flex items-center' : ''}`}>
 {q.type === 'mc' ? (
 <div className="flex w-full items-center justify-between">
 <div className="flex items-center gap-2 shrink-0 min-w-0">
 <span className={`w-7 h-7 rounded-sm flex items-center justify-center text-[11px] font-display font-bold shrink-0 ${answered ? 'bg-tertiary text-surface shadow-sm' : 'bg-neutral text-secondary'}`}>
 {i + 1}
 </span>
 <span className="uppercase tracking-[0.14em] text-[0.6rem] font-display font-bold text-secondary truncate">Trắc nghiệm</span>
 </div>
 <div className="flex items-center gap-1.5 shrink-0 ml-1">
 <AnswerInput question={q} answer={a} onChange={na => updateAnswer(q.id, na)} compact />
 {answered && <CheckCircle2 size={14} className="text-tertiary shrink-0" />}
 </div>
 </div>
 ) : (
 <>
 <p className="text-[0.78rem] font-display font-bold text-secondary mb-3 flex items-center gap-2">
 <span className={`w-6 h-6 rounded-sm flex items-center justify-center text-[10px] font-display font-bold ${answered ? 'bg-tertiary text-surface shadow-sm' : 'bg-neutral text-secondary'}`}>
 {i + 1}
 </span>
 <span className="uppercase tracking-[0.14em] text-[0.6rem]">{q.type === 'tf' ? 'Đúng/Sai' : q.type === 'short' ? 'Trả lời ngắn' : 'Tự luận'}</span>
 {answered && <CheckCircle2 size={14} className="text-tertiary ml-auto" />}
 </p>
 <AnswerInput question={q} answer={a} onChange={na => updateAnswer(q.id, na)} compact />
 </>
 )}
 </div>
 )
 })}
 </div>

 {/* Submit */}
 <div className="px-4 py-3 border-t border-secondary/20 shrink-0">
 <button onClick={() => setShowConfirm(true)} disabled={submitting}
 className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-tertiary text-surface rounded-md font-display font-bold text-[0.95rem] hover:bg-tertiary/90 transition-all shadow-sm disabled:opacity-50">
 <Send size={15} /> Nộp bài
 </button>
 </div>
 </div>
 </div>

 {/* Confirm Dialog */}
 {showConfirm && (
 <div className="fixed inset-0 bg-primary/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-surface rounded-lg p-6 max-w-sm w-full shadow-lg">
 <h3 className="text-[1.2rem] font-display font-bold text-primary mb-2">Xác nhận nộp bài?</h3>
 <p className="text-[0.95rem] text-secondary mb-1">Đã trả lời: <b className="text-primary">{answeredCount}/{questions.length}</b> câu</p>
 {answeredCount < questions.length && <p className="text-[0.78rem] font-display font-bold text-amber-600 mb-4 uppercase tracking-[0.14em]">⚠ Còn {questions.length - answeredCount} câu chưa trả lời</p>}
 <div className="flex gap-3 mt-4">
 <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 rounded-md border border-secondary/20 text-[0.95rem] font-display font-bold text-secondary hover:bg-neutral transition-all">Tiếp tục làm</button>
 <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-2 rounded-md bg-tertiary text-surface text-[0.95rem] font-display font-bold hover:bg-tertiary/90 transition-all disabled:opacity-50">
 {submitting ? 'Đang nộp...' : 'Nộp bài ngay'}
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 )
 }

 // ── Bank Layout ──
 return (
 <div className="min-h-screen bg-neutral font-body">
 {/* Fixed Header */}
 <div className="fixed top-20 left-0 right-0 z-40 bg-surface border-b border-secondary/20 shadow-sm">
 <div className="max-w-6xl mx-auto px-3 py-2 flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-4">
 <div className="flex items-center justify-between xl:w-64 shrink-0 min-w-0">
 <div className="flex-1 min-w-0 pr-2">
 <h1 className="text-[0.95rem] xl:text-[1.2rem] font-display font-bold text-primary truncate">{exam.title}</h1>
 <p className="text-[0.6rem] xl:text-[0.78rem] text-secondary font-display font-bold uppercase tracking-[0.14em] mt-0.5">Đang làm bài</p>
 </div>
 
 {/* Timer on Mobile */}
 <div className="xl:hidden flex items-center gap-2 shrink-0">
 <span className="text-[10px] text-secondary font-medium">{answeredCount}/{questions.length}</span>
 <span className={`flex items-center gap-1 text-[0.78rem] font-display font-bold tabular-nums px-2 py-1 rounded-sm ${isWarning ? 'text-red-600 bg-red-50' : 'text-tertiary bg-tertiary/10'}`}>
 <Clock size={12} /> {timeDisplay}
 </span>
 </div>
 </div>
 
 <div className="flex-1 w-full flex justify-center">
 <div className="grid grid-cols-[repeat(11,minmax(0,1fr))] lg:grid-cols-[repeat(22,minmax(0,1fr))] gap-0.5 md:gap-1 w-full max-w-3xl">
 {questions.map((q, i) => {
 const a = answers[q.id]
 const answered = q.type === 'mc' ? !!a?.mc
 : q.type === 'tf' ? Object.keys(a?.tf ?? {}).length > 0
 : q.type === 'short' ? (a?.short ?? '').trim() !== ''
 : (a?.essay ?? '').trim() !== ''
 return (
 <button key={`top-${q.id}`} onClick={() => setCurrentIdx(i)}
 className={`w-full aspect-square max-h-7 md:max-h-8 flex items-center justify-center rounded-sm text-[9px] md:text-[10px] font-display font-bold transition-all border ${i === currentIdx
 ? 'border-tertiary bg-tertiary text-surface'
 : answered
 ? 'bg-tertiary/10 text-tertiary border-tertiary/20'
 : 'bg-surface border-secondary/20 text-secondary hover:bg-neutral'
 }`}>
 {i + 1}
 </button>
 )
 })}
 </div>
 </div>

 {/* Timer on Desktop */}
 <div className="hidden xl:flex items-center justify-end gap-3 shrink-0">
 <span className="text-[0.95rem] text-secondary font-bold font-display tracking-[0.14em] uppercase">{answeredCount}/{questions.length} câu</span>
 <span className={`flex items-center gap-1.5 text-[1.2rem] font-display font-bold tabular-nums px-3 py-1.5 rounded-md ${isWarning ? 'text-red-600 bg-red-50' : 'text-tertiary bg-tertiary/10'}`}>
 <Clock size={15} /> {timeDisplay}
 </span>
 </div>
 </div>
 {/* Progress */}
 <div className="h-1 bg-neutral">
 <div className="h-full bg-tertiary transition-all duration-300" style={{ width:`${(answeredCount / Math.max(questions.length, 1)) * 100}%` }} />
 </div>
 {isWarning && (
 <div className="bg-red-50 px-4 py-2 flex items-center gap-2">
 <AlertTriangle size={14} className="text-red-500" />
 <span className="text-[0.78rem] font-display font-bold text-red-600 uppercase tracking-[0.14em]">Còn dưới 5 phút — hãy kiểm tra lại bài!</span>
 </div>
 )}
 </div>

 {/* Body */}
 <div className="max-w-4xl mx-auto px-4 pt-32 md:pt-28 pb-8 space-y-6">

 {/* Current Question */}
 {currentQ && (
 <div className="bg-surface rounded-lg border border-secondary/20 overflow-hidden shadow-sm">
 <div className="px-5 py-4 border-b border-secondary/20 flex items-center gap-3">
 <span className="w-8 h-8 rounded-md bg-tertiary/10 flex items-center justify-center text-tertiary text-[0.95rem] font-display font-bold shrink-0">
 {currentIdx + 1}
 </span>
 <div>
 <span className={`text-[0.6rem] font-display font-bold px-2 py-0.5 rounded-sm uppercase tracking-[0.14em] ${
 currentQ.type === 'mc' ? 'bg-primary text-surface'
 : currentQ.type === 'tf' ? 'bg-secondary text-surface'
 : currentQ.type === 'short' ? 'bg-tertiary text-surface'
 : 'bg-primary/80 text-surface'
 }`}>
 {currentQ.type === 'mc' ? 'Trắc nghiệm' : currentQ.type === 'tf' ? 'Đúng/Sai' : currentQ.type === 'short' ? 'Trả lời ngắn' : 'Tự luận'}
 </span>
 <span className="text-[0.78rem] font-display font-bold text-secondary ml-2">{currentQ.max_score ?? 1}đ</span>
 </div>
 </div>

 <div className="p-5 space-y-5">
 {/* Question Content */}
 {currentQ.questions?.content && (
 <div className="text-[0.95rem] md:text-base text-primary leading-[1.55] font-medium">
 <LatexPreview content={currentQ.questions.content} />
 </div>
 )}
 {currentQ.questions?.image_url && (
 <img src={currentQ.questions.image_url} alt="Hình minh họa"
 className="max-w-full rounded-md border border-secondary/20 object-contain max-h-64" />
 )}

 {/* Answer */}
 <AnswerInput
 question={currentQ}
 answer={answers[currentQ.id] ?? {}}
 onChange={a => updateAnswer(currentQ.id, a)}
 />
 </div>

 {/* Nav */}
 <div className="px-5 py-4 border-t border-secondary/20 flex items-center justify-between">
 <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}
 className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-secondary/20 text-[0.95rem] font-display font-bold text-secondary hover:bg-neutral transition-all disabled:opacity-30 disabled:cursor-default">
 <ChevronLeft size={15} /> Câu trước
 </button>
 <button onClick={() => setShowConfirm(true)}
 className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-tertiary text-surface text-[0.95rem] font-display font-bold hover:bg-tertiary/90 transition-all shadow-sm">
 <Send size={14} /> Nộp bài
 </button>
 <button onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))} disabled={currentIdx === questions.length - 1}
 className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-secondary/20 text-[0.95rem] font-display font-bold text-secondary hover:bg-neutral transition-all disabled:opacity-30 disabled:cursor-default">
 Câu tiếp <ChevronRight size={15} />
 </button>
 </div>
 </div>
 )}
 </div>

 {/* Confirm Dialog */}
 {showConfirm && (
 <div className="fixed inset-0 bg-primary/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-surface rounded-lg p-6 max-w-sm w-full shadow-lg">
 <h3 className="text-[1.2rem] font-display font-bold text-primary mb-2">Xác nhận nộp bài?</h3>
 <p className="text-[0.95rem] text-secondary mb-1">Đã trả lời: <b className="text-primary">{answeredCount}/{questions.length}</b> câu</p>
 {answeredCount < questions.length && (
 <p className="text-[0.78rem] font-display font-bold text-amber-600 uppercase tracking-[0.14em]">⚠ Còn {questions.length - answeredCount} câu chưa trả lời</p>
 )}
 <div className="flex gap-3 mt-5">
 <button onClick={() => setShowConfirm(false)} className="flex-1 py-2.5 rounded-md border border-secondary/20 text-[0.95rem] font-display font-bold text-secondary hover:bg-neutral transition-all">
 Tiếp tục làm
 </button>
 <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-2.5 rounded-md bg-tertiary text-surface text-[0.95rem] font-display font-bold hover:bg-tertiary/90 transition-all disabled:opacity-50">
 {submitting ? 'Đang nộp...' : 'Nộp bài'}
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 )
}
