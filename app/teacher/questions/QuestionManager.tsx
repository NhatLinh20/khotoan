'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Pencil, BookOpen, Clock, CheckCircle2, XCircle,
  ChevronRight, ChevronLeft,
  Lightbulb, Search, Filter, X, RotateCcw
} from 'lucide-react'
import dynamic from 'next/dynamic'
import DeleteQuestionButton from './DeleteButton'
import { getChapters, getLessons, getForms } from '@/lib/math-taxonomy'

const LatexPreview = dynamic(() => import('@/components/LatexPreview'), { ssr: false })

// ─── Labels ──────────────────────────────────────────────────────────
const GRADE_LABELS: Record<string, string> = { '0': 'Lớp 10', '1': 'Lớp 11', '2': 'Lớp 12' }
const SUBJECT_LABELS: Record<string, string> = { D: 'Đại số/XS/TK', H: 'Hình học', C: 'Chuyên đề' }
const DIFFICULTY_LABELS: Record<string, string> = { N: 'Nhận biết', H: 'Thông hiểu', V: 'Vận dụng', C: 'VD Cao' }
const TYPE_LABELS: Record<string, string> = { mc: 'Trắc nghiệm', tf: 'Đúng/Sai', short: 'Trả lời ngắn', essay: 'Tự luận' }
const DIFFICULTY_COLORS: Record<string, string> = {
  N: 'bg-emerald-500 text-white', H: 'bg-blue-500 text-white',
  V: 'bg-orange-500 text-white',  C: 'bg-red-500 text-white',
}

interface Question {
  id: string; question_code: string; content: string; type: string
  grade_code: string | null; subject_type: string | null; difficulty: string | null
  chapter: number | null; lesson: number | null; form: number | null
  image_url: string | null; option_a: string | null; option_b: string | null
  option_c: string | null; option_d: string | null; correct_answer: string | null
  correct_number: number | null; solution_guide: string | null; max_score: number | null
  question_tf_items?: { label: string; content: string; is_correct: boolean }[]
}

// ─── Shared select style (matches QuestionForm) ──────────────────────
const selectCls = 'w-full px-2 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-[12px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer'
const labelCls = 'block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1'

function SelectField({ label, value, onChange, disabled, children }: {
  label: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`${selectCls} pr-8 ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

// ─── Compact Question Card ────────────────────────────────────────────
function QuestionCard({ q, active, onClick }: { q: Question; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all ${
        active
          ? 'bg-primary/5 border-primary/30 shadow-sm'
          : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:border-primary/20'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={`font-black text-xs tracking-wider ${active ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
          {q.question_code}
        </span>
        <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
          {TYPE_LABELS[q.type]}
        </span>
        {q.difficulty && (
          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${DIFFICULTY_COLORS[q.difficulty]}`}>
            {DIFFICULTY_LABELS[q.difficulty]}
          </span>
        )}
      </div>
      <p className="text-[10px] text-gray-400 line-clamp-1 font-mono">{q.content}</p>
    </button>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────
export default function QuestionManager({
  questions,
  initialParams,
}: {
  questions: Question[]
  initialParams: Record<string, string | undefined>
}) {
  const router = useRouter()

  // Active filters from URL
  const [grade, setGrade] = useState(initialParams.grade ?? '')
  const [subject, setSubject] = useState(initialParams.subject ?? '')
  const [chapter, setChapter] = useState(initialParams.chapter ?? '')
  const [lesson, setLesson] = useState(initialParams.lesson ?? '')
  const [difficulty, setDifficulty] = useState(initialParams.difficulty ?? '')
  const [form, setForm] = useState(initialParams.form ?? '')
  const [qType, setQType] = useState(initialParams.type ?? '')
  const [codeSearch, setCodeSearch] = useState(initialParams.code ?? '')
  const [currentIndex, setCurrentIndex] = useState(0)

  // Derived taxonomy
  const chapters = useMemo(() => grade && subject ? getChapters(grade, subject) : [], [grade, subject])
  const lessons = useMemo(() => grade && subject && chapter ? getLessons(grade, subject, parseInt(chapter)) : [], [grade, subject, chapter])
  const forms = useMemo(() => grade && subject && chapter && lesson ? getForms(grade, subject, parseInt(chapter), parseInt(lesson)) : [], [grade, subject, chapter, lesson])

  // Reset cascades
  useEffect(() => { setChapter(''); setLesson(''); setForm('') }, [grade, subject])
  useEffect(() => { setLesson(''); setForm('') }, [chapter])
  useEffect(() => { setForm('') }, [lesson])

  // Sync to URL
  useEffect(() => {
    const p = new URLSearchParams()
    if (codeSearch) { p.set('code', codeSearch) }
    else {
      if (grade)      p.set('grade', grade)
      if (subject)    p.set('subject', subject)
      if (chapter)    p.set('chapter', chapter)
      if (lesson)     p.set('lesson', lesson)
      if (difficulty) p.set('difficulty', difficulty)
      if (form)       p.set('form', form)
      if (qType)      p.set('type', qType)
    }
    const timer = setTimeout(() => {
      router.push(`/teacher/questions?${p.toString()}`, { scroll: false })
      setCurrentIndex(0)
    }, 300)
    return () => clearTimeout(timer)
  }, [grade, subject, chapter, lesson, difficulty, form, qType, codeSearch])

  useEffect(() => { setCurrentIndex(0) }, [questions])

  const selectedQ = questions[currentIndex]
  const total = questions.length
  const hasFilters = !!(grade || subject || chapter || lesson || difficulty || form || qType || codeSearch)

  const resetAll = () => {
    setGrade(''); setSubject(''); setChapter(''); setLesson('')
    setDifficulty(''); setForm(''); setQType(''); setCodeSearch('')
  }

  return (
    <div className="flex gap-4 items-start">

      {/* ── LEFT: SIDEBAR FILTER ── */}
      <div className="w-[220px] shrink-0 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden sticky top-4">

        {/* Search by code */}
        <div className="p-2 border-b border-gray-100 dark:border-slate-800">
          <div className="relative">
            <input
              type="text"
              value={codeSearch}
              onChange={(e) => setCodeSearch(e.target.value.toUpperCase())}
              placeholder="Tìm theo mã ID..."
              className="w-full pl-8 pr-8 py-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-[11px] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-300 placeholder:font-sans"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" size={12} />
            {codeSearch && (
              <button onClick={() => setCodeSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                <X size={12} />
              </button>
            )}
          </div>
          {codeSearch && (
            <p className="text-[9px] text-primary font-bold mt-1.5 px-1 truncate">
              {[
                GRADE_LABELS[codeSearch[0]],
                SUBJECT_LABELS[codeSearch[1]],
                codeSearch[2] ? `Ch.${codeSearch[2]}` : null,
                DIFFICULTY_LABELS[codeSearch[3]],
                codeSearch[4] ? `Bài ${codeSearch[4]}` : null,
                codeSearch.split('-')[1] ? `D.${codeSearch.split('-')[1]}` : null,
              ].filter(Boolean).join(' › ')}
            </p>
          )}
        </div>

        {/* Cascading dropdowns */}
        <div className={`p-2 flex flex-col gap-2 ${codeSearch ? 'opacity-30 pointer-events-none' : ''}`}>
          <SelectField label="① Lớp" value={grade} onChange={setGrade}>
            <option value="">— Tất cả khối —</option>
            <option value="0">Lớp 10</option>
            <option value="1">Lớp 11</option>
            <option value="2">Lớp 12</option>
          </SelectField>

          <SelectField label="② Môn học" value={subject} onChange={setSubject}>
            <option value="">— Tất cả môn —</option>
            <option value="D">D — Đại số / XS / TK</option>
            <option value="H">H — Hình học</option>
            <option value="C">C — Chuyên đề</option>
          </SelectField>

          <SelectField label="③ Chương" value={chapter} onChange={setChapter} disabled={chapters.length === 0}>
            <option value="">— Tất cả chương —</option>
            {chapters.map((c) => (
              <option key={c.value} value={String(c.value)}>{c.label}</option>
            ))}
          </SelectField>

          <SelectField label="④ Bài học" value={lesson} onChange={setLesson} disabled={lessons.length === 0}>
            <option value="">— Tất cả bài —</option>
            {lessons.map((l) => (
              <option key={l.value} value={String(l.value)}>{l.label}</option>
            ))}
          </SelectField>

          <SelectField label="⑤ Dạng bài" value={form} onChange={setForm} disabled={forms.length === 0}>
            <option value="">— Tất cả dạng —</option>
            {forms.map((f) => (
              <option key={f.value} value={String(f.value)}>{f.label}</option>
            ))}
          </SelectField>

          <SelectField label="⑥ Mức độ" value={difficulty} onChange={setDifficulty}>
            <option value="">— Tất cả mức độ —</option>
            <option value="N">N — Nhận biết</option>
            <option value="H">H — Thông hiểu</option>
            <option value="V">V — Vận dụng</option>
            <option value="C">C — Vận dụng cao</option>
          </SelectField>

          <SelectField label="⑦ Loại câu hỏi" value={qType} onChange={setQType}>
            <option value="">— Tất cả loại —</option>
            <option value="mc">Trắc nghiệm (MC)</option>
            <option value="tf">Đúng / Sai (TF)</option>
            <option value="short">Trả lời ngắn</option>
            <option value="essay">Tự luận</option>
          </SelectField>
        </div>

        {/* Reset */}
        {hasFilters && (
          <div className="p-2 border-t border-gray-100 dark:border-slate-800">
            <button
              onClick={resetAll}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-[9px] font-black text-red-500 uppercase tracking-widest border border-dashed border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <RotateCcw size={10} /> Xoá bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* ── RIGHT: CONTENT ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">

        {/* Stats + Navigation bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 px-4 py-2">
            <Filter size={12} className="text-primary" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kết quả</span>
            <span className="text-base font-black text-gray-900 dark:text-white leading-none">{total}</span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0 || total === 0}
              className="p-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-lg min-w-[70px] text-center">
              <span className="text-[9px] font-black text-primary uppercase tracking-widest block">Câu hỏi</span>
              <span className="text-xs font-black text-primary">{total > 0 ? currentIndex + 1 : 0}/{total}</span>
            </div>
            <button
              onClick={() => setCurrentIndex(Math.min(total - 1, currentIndex + 1))}
              disabled={currentIndex === total - 1 || total === 0}
              className="p-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Question list (compact cards) + Preview */}
        <div className="flex gap-3 items-start">
          {/* Preview */}
          <div className="flex-1 min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden min-h-[500px] flex flex-col">
            {selectedQ ? (
              <>
                {/* Preview header */}
                <div className="px-3 py-1.5 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/20">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs tracking-wider text-gray-900 dark:text-white">
                      {selectedQ.question_code}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                      {TYPE_LABELS[selectedQ.type]}
                    </span>
                    {selectedQ.difficulty && (
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${DIFFICULTY_COLORS[selectedQ.difficulty]}`}>
                        {DIFFICULTY_LABELS[selectedQ.difficulty]}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/teacher/questions/${selectedQ.id}/edit`}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-[9px] font-black hover:bg-blue-700 transition-all shadow-sm"
                    >
                      <Pencil size={10} /> Sửa
                    </Link>
                    <DeleteQuestionButton id={selectedQ.id} />
                  </div>
                </div>

                {/* Preview body */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[650px]">
                  {/* Content */}
                  <div>
                    <div className="flex items-center gap-1.5 text-primary mb-2">
                      <BookOpen size={12} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Nội dung câu hỏi</span>
                    </div>
                    <div className="text-sm leading-relaxed text-gray-900 dark:text-gray-100 bg-gray-50/50 dark:bg-slate-800/30 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                      <LatexPreview content={selectedQ.content} />
                    </div>
                    {selectedQ.image_url && (
                      <div className="mt-2 relative aspect-video max-h-[300px] rounded-xl overflow-hidden border border-gray-100">
                        <img src={selectedQ.image_url} alt="Question" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-gray-100 dark:bg-slate-800" />

                  {/* Answers */}
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-500 mb-2">
                      <CheckCircle2 size={12} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Đáp án</span>
                    </div>

                    {selectedQ.type === 'mc' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                          const val = selectedQ[`option_${letter.toLowerCase()}` as keyof Question] as string
                          const isCorrect = selectedQ.correct_answer === letter
                          return (
                            <div key={letter} className={`flex items-start gap-3 p-2.5 rounded-xl border-2 ${
                              isCorrect ? 'bg-emerald-50/50 border-emerald-400 text-emerald-900' : 'bg-white border-gray-100 dark:bg-slate-800 dark:border-slate-700'
                            }`}>
                              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-500'}`}>{letter}</span>
                              <div className="text-sm font-bold flex-1"><LatexPreview content={val || '...'} /></div>
                              {isCorrect && <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />}
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {selectedQ.type === 'tf' && (
                      <div className="flex flex-col gap-2">
                        {selectedQ.question_tf_items?.map((item) => (
                          <div key={item.label} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                            <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 flex items-center justify-center text-[9px] font-black text-gray-400">{item.label.toUpperCase()}</span>
                            <div className="flex-1 text-sm font-bold"><LatexPreview content={item.content} /></div>
                            <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black flex items-center gap-1 ${item.is_correct ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                              {item.is_correct ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                              {item.is_correct ? 'ĐÚNG' : 'SAI'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedQ.type === 'short' && (
                      <div className="p-5 rounded-xl bg-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center gap-1">
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">Đáp số chính xác</span>
                        <span className="text-3xl font-black text-primary">{selectedQ.correct_number}</span>
                      </div>
                    )}

                    {selectedQ.type === 'essay' && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 text-violet-700">
                        <Clock size={16} />
                        <span className="text-sm font-black">Điểm tối đa: {selectedQ.max_score} điểm</span>
                      </div>
                    )}
                  </div>

                  {selectedQ.solution_guide && (
                    <>
                      <div className="h-px bg-gray-100 dark:bg-slate-800" />
                      <div>
                        <div className="flex items-center gap-1.5 text-amber-500 mb-2">
                          <Lightbulb size={12} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Lời giải</span>
                        </div>
                        <div className="bg-amber-50/30 dark:bg-amber-900/5 p-3 rounded-xl border border-amber-100 dark:border-amber-900/20 text-sm leading-relaxed">
                          <LatexPreview content={selectedQ.solution_guide} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center mb-3 text-gray-200">
                  <Search size={32} />
                </div>
                <h3 className="text-base font-black text-gray-900 dark:text-white">Không tìm thấy câu hỏi</h3>
                <p className="text-xs text-gray-400 mt-1">Thay đổi bộ lọc hoặc tìm kiếm theo mã ID</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
