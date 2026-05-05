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
  tf?: Record<string, boolean>  // label → true/false
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
  return { display: `${mm}:${ss}`, remaining, isWarning: remaining <= 300 }
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
      <div className={`flex ${compact ? 'flex-row gap-2' : 'flex-col gap-2'}`}>
        {choices.map(c => (
          <button key={c.key} type="button"
            onClick={() => onChange({ ...answer, mc: c.key })}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm font-bold transition-all text-left ${answer.mc === c.key
              ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
              : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:border-primary/50'
            } ${compact ? 'flex-col items-center justify-center w-12 h-10 p-1 text-xs' : ''}`}>
            {compact ? c.key : (
              <>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${answer.mc === c.key ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-700'}`}>{c.key}</span>
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
      <div className={`${compact ? 'flex gap-2 items-center' : 'space-y-2'}`}>
        {labels.map(label => {
          const item = opts?.question_tf_items?.find(i => i.label === label)
          return (
          <div key={label} className={`flex items-center gap-2 ${compact ? '' : 'p-2 rounded-xl bg-gray-50 dark:bg-slate-800'}`}>
            {!compact && <span className="text-xs font-black text-gray-500 w-4 shrink-0">{label.toUpperCase()}.</span>}
            {!compact && item && (
              <div className="flex-1 text-sm font-bold overflow-hidden"><LatexPreview content={item.content} /></div>
            )}
            <button type="button" onClick={() => onChange({ ...answer, tf: { ...tfMap, [label]: true } })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all shrink-0 ${tfMap[label] === true ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-600 hover:border-emerald-400'}`}>
              {compact ? label.toUpperCase() : 'Đúng'}
            </button>
            {!compact && (
              <button type="button" onClick={() => onChange({ ...answer, tf: { ...tfMap, [label]: false } })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${tfMap[label] === false ? 'bg-red-500 text-white border-red-500' : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-600 hover:border-red-400'}`}>
                Sai
              </button>
            )}
            {compact && (
              <button type="button" onClick={() => onChange({ ...answer, tf: { ...tfMap, [label]: false } })}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold border-2 transition-all ${tfMap[label] === false ? 'bg-red-500 text-white border-red-500' : 'bg-white dark:bg-slate-700 border-gray-200 text-gray-600'}`}>
                S
              </button>
            )}
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
        className={`px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${compact ? 'w-28' : 'w-48'}`} />
    )
  }

  if (type === 'essay') {
    return (
      <textarea value={answer.essay ?? ''}
        onChange={e => onChange({ ...answer, essay: e.target.value })}
        placeholder="Nhập bài làm..."
        rows={compact ? 2 : 4}
        className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
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
  const storageKey = `practice_${exam.id}_${userId}`
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

  // ── PDF Layout ──
  if (exam.exam_type === 'pdf') {
    return (
      <div className="flex h-[calc(100vh-80px)] overflow-hidden">
        {/* Left: PDF */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src={exam.pdf_url ?? ''}
            className="w-full h-full border-0"
            title="Đề thi PDF"
          />
        </div>

        {/* Right: Answer Panel */}
        <div className="w-96 shrink-0 border-l border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 shrink-0">
            <h1 className="text-sm font-black text-gray-900 dark:text-white line-clamp-1">{exam.title}</h1>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-500">{answeredCount}/{questions.length} câu đã trả lời</span>
              <span className={`flex items-center gap-1 text-sm font-black tabular-nums ${isWarning ? 'text-red-500' : 'text-primary'}`}>
                <Clock size={14} /> {timeDisplay}
              </span>
            </div>
            {isWarning && (
              <div className="flex items-center gap-1.5 mt-2 px-2.5 py-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle size={12} className="text-red-500 shrink-0" />
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400">Còn dưới 5 phút!</span>
              </div>
            )}
            {/* Progress bar */}
            <div className="mt-2 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(answeredCount / Math.max(questions.length, 1)) * 100}%` }} />
            </div>
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
                <div key={q.id} className={`p-3 rounded-xl border-2 transition-all ${answered ? 'border-primary/30 bg-primary/5' : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
                  <p className="text-xs font-black text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${answered ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}>
                      {i + 1}
                    </span>
                    <span className="uppercase tracking-wider text-[9px]">{q.type === 'mc' ? 'Trắc nghiệm' : q.type === 'tf' ? 'Đúng/Sai' : q.type === 'short' ? 'Trả lời ngắn' : 'Tự luận'}</span>
                    {answered && <CheckCircle2 size={12} className="text-primary ml-auto" />}
                  </p>
                  <AnswerInput question={q} answer={a} onChange={na => updateAnswer(q.id, na)} compact />
                </div>
              )
            })}
          </div>

          {/* Submit */}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-800 shrink-0">
            <button onClick={() => setShowConfirm(true)} disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
              <Send size={15} /> Nộp bài
            </button>
          </div>
        </div>

        {/* Confirm Dialog */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Xác nhận nộp bài?</h3>
              <p className="text-sm text-gray-500 mb-1">Đã trả lời: <b className="text-gray-900 dark:text-white">{answeredCount}/{questions.length}</b> câu</p>
              {answeredCount < questions.length && <p className="text-xs text-amber-600 dark:text-amber-400 mb-4">⚠ Còn {questions.length - answeredCount} câu chưa trả lời</p>}
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-bold text-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">Tiếp tục làm</button>
                <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50">
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Fixed Header */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Đang làm bài</p>
            <h1 className="text-sm font-black text-gray-900 dark:text-white truncate">{exam.title}</h1>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-gray-500 font-medium">{answeredCount}/{questions.length} câu</span>
            <span className={`flex items-center gap-1.5 text-base font-black tabular-nums px-3 py-1.5 rounded-xl ${isWarning ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 'text-primary bg-primary/10'}`}>
              <Clock size={15} /> {timeDisplay}
            </span>
          </div>
        </div>
        {/* Progress */}
        <div className="h-1 bg-gray-100 dark:bg-slate-800">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(answeredCount / Math.max(questions.length, 1)) * 100}%` }} />
        </div>
        {isWarning && (
          <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-500" />
            <span className="text-xs font-bold text-red-600 dark:text-red-400">Còn dưới 5 phút — hãy kiểm tra lại bài!</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 pt-36 pb-8 space-y-6">
        {/* Question Number Navigator */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">Danh sách câu hỏi</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, i) => {
              const a = answers[q.id]
              const answered = q.type === 'mc' ? !!a?.mc
                : q.type === 'tf' ? Object.keys(a?.tf ?? {}).length > 0
                : q.type === 'short' ? (a?.short ?? '').trim() !== ''
                : (a?.essay ?? '').trim() !== ''
              return (
                <button key={q.id} onClick={() => setCurrentIdx(i)}
                  className={`w-9 h-9 rounded-lg text-xs font-black transition-all ${i === currentIdx
                    ? 'ring-2 ring-primary ring-offset-2 bg-primary text-white'
                    : answered
                    ? 'bg-primary/15 text-primary'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}>
                  {i + 1}
                </button>
              )
            })}
          </div>
        </div>

        {/* Current Question */}
        {currentQ && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 dark:border-slate-800 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm font-black shrink-0">
                {currentIdx + 1}
              </span>
              <div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  currentQ.type === 'mc' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : currentQ.type === 'tf' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
                  : currentQ.type === 'short' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                  : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                }`}>
                  {currentQ.type === 'mc' ? 'Trắc nghiệm' : currentQ.type === 'tf' ? 'Đúng/Sai' : currentQ.type === 'short' ? 'Trả lời ngắn' : 'Tự luận'}
                </span>
                <span className="text-xs text-gray-400 ml-2">{currentQ.max_score ?? 1}đ</span>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Question Content */}
              {currentQ.questions?.content && (
                <div className="text-sm md:text-base text-gray-900 dark:text-white leading-relaxed font-medium">
                  <LatexPreview content={currentQ.questions.content} />
                </div>
              )}
              {currentQ.questions?.image_url && (
                <img src={currentQ.questions.image_url} alt="Hình minh họa"
                  className="max-w-full rounded-xl border border-gray-200 dark:border-slate-700 object-contain max-h-64" />
              )}

              {/* Answer */}
              <AnswerInput
                question={currentQ}
                answer={answers[currentQ.id] ?? {}}
                onChange={a => updateAnswer(currentQ.id, a)}
              />
            </div>

            {/* Nav */}
            <div className="px-5 py-4 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between">
              <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-default">
                <ChevronLeft size={15} /> Câu trước
              </button>
              <button onClick={() => setShowConfirm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all shadow-md">
                <Send size={14} /> Nộp bài
              </button>
              <button onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))} disabled={currentIdx === questions.length - 1}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-default">
                Câu tiếp <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Xác nhận nộp bài?</h3>
            <p className="text-sm text-gray-500 mb-1">Đã trả lời: <b className="text-gray-900 dark:text-white">{answeredCount}/{questions.length}</b> câu</p>
            {answeredCount < questions.length && (
              <p className="text-xs text-amber-600 dark:text-amber-400">⚠ Còn {questions.length - answeredCount} câu chưa trả lời</p>
            )}
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-bold text-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
                Tiếp tục làm
              </button>
              <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50">
                {submitting ? 'Đang nộp...' : 'Nộp bài'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
