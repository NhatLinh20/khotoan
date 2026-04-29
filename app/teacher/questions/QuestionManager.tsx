'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Pencil, Trash2, BookOpen, Clock, 
  CheckCircle2, XCircle, Image as ImageIcon,
  ChevronRight, ArrowLeft, Info, Lightbulb,
  Search, ChevronLeft, Filter, X
} from 'lucide-react'
import dynamic from 'next/dynamic'
import DeleteQuestionButton from './DeleteButton'

const LatexPreview = dynamic(() => import('@/components/LatexPreview'), { ssr: false })

// ─── Helpers & Labels ────────────────────────────────────────────────
const GRADE_LABELS: Record<string, string> = { '0': 'Khối 10', '1': 'Khối 11', '2': 'Khối 12' }
const SUBJECT_LABELS: Record<string, string> = { D: 'Đại số/XS/TK', H: 'Hình học', C: 'Chuyên đề' }
const DIFFICULTY_LABELS: Record<string, string> = { N: 'Nhận biết', H: 'Thông hiểu', V: 'Vận dụng', C: 'Vận dụng cao' }
const TYPE_LABELS: Record<string, string> = { mc: 'Trắc nghiệm', tf: 'Đúng/Sai', short: 'Trả lời ngắn', essay: 'Tự luận' }

const DIFFICULTY_COLORS: Record<string, string> = {
  N: 'bg-emerald-500 text-white',
  H: 'bg-blue-500 text-white',
  V: 'bg-orange-500 text-white',
  C: 'bg-red-500 text-white',
}

interface Question {
  id: string
  question_code: string
  content: string
  type: string
  grade_code: string | null
  subject_type: string | null
  difficulty: string | null
  chapter: number | null
  lesson: number | null
  form: number | null
  image_url: string | null
  option_a: string | null
  option_b: string | null
  option_c: string | null
  option_d: string | null
  correct_answer: string | null
  correct_number: number | null
  solution_guide: string | null
  max_score: number | null
  question_tf_items?: { label: string; content: string; is_correct: boolean }[]
}

interface QuestionManagerProps {
  questions: Question[]
  initialParams: any
}

export default function QuestionManager({ questions, initialParams }: QuestionManagerProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [searchValue, setSearchValue] = useState(initialParams.code || '')

  const selectedQ = questions[currentIndex]
  const totalCount = questions.length

  // Reset index when questions list changes (e.g. after filtering)
  useEffect(() => {
    setCurrentIndex(0)
  }, [questions])

  // Real-time search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(initialParams)
      if (searchValue) params.set('code', searchValue)
      else params.delete('code')
      
      router.push(`/teacher/questions?${params.toString()}`, { scroll: false })
    }, 400)

    return () => clearTimeout(delayDebounceFn)
  }, [searchValue, router])

  // ID Parsing for suggestions
  const getSuggestion = (val: string) => {
    if (!val) return null
    const main = val.split('-')[0]
    const form = val.split('-')[1]
    const suggestions: string[] = []

    if (main[0]) suggestions.push(GRADE_LABELS[main[0]] || `Khối ${main[0]}`)
    if (main[1]) suggestions.push(SUBJECT_LABELS[main[1]] || `Môn ${main[1]}`)
    if (main[2]) suggestions.push(`Chương ${main[2]}`)
    if (main[3]) suggestions.push(DIFFICULTY_LABELS[main[3]] || `Độ khó ${main[3]}`)
    if (main[4]) suggestions.push(`Bài §${main[4]}`)
    if (form) suggestions.push(`Dạng ${form}`)

    return suggestions.join(' • ')
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const handleNext = () => {
    if (currentIndex < totalCount - 1) setCurrentIndex(currentIndex + 1)
  }

  const buildUrl = (key: string, val: string) => {
    const p = new URLSearchParams(initialParams)
    if (val) p.set(key, val)
    else p.delete(key)
    return `/teacher/questions?${p.toString()}`
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ─── THANH CÔNG CỤ (FILTERS & SMART SEARCH) ─── */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          {/* Smart Search Input */}
          <div className="relative flex-1 group">
            <input 
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value.toUpperCase())}
              placeholder="Gõ mã ID để tìm kiếm (VD: 1D2H...)"
              className="w-full pl-12 pr-10 py-3 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-2xl text-xs font-black focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
            {searchValue && (
              <button 
                onClick={() => setSearchValue('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}
            
            {/* Real-time Suggestion Breadcrumb */}
            {searchValue && (
              <div className="absolute left-4 -bottom-5 flex items-center gap-1.5 text-[9px] font-black text-primary uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                <Info size={10} /> {getSuggestion(searchValue)}
              </div>
            )}
          </div>

          {/* Quick Stats & Navigation Arrows */}
          <div className="flex items-center gap-2">
            <div className="bg-gray-50 dark:bg-slate-800 px-4 py-2 rounded-2xl border-2 border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center min-w-[100px]">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">Kết quả</span>
              <span className="text-base font-black text-gray-900 dark:text-white leading-none">{totalCount}</span>
            </div>
            
            <div className="flex items-stretch gap-1.5">
              <button 
                onClick={handlePrev}
                disabled={currentIndex === 0 || totalCount === 0}
                className="p-3 bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                title="Câu trước"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex flex-col items-center justify-center px-4 bg-primary/5 border-2 border-primary/20 rounded-xl min-w-[80px]">
                <span className="text-[9px] font-black text-primary uppercase tracking-widest">Câu hỏi</span>
                <span className="text-xs font-black text-primary">{totalCount > 0 ? currentIndex + 1 : 0}/{totalCount}</span>
              </div>
              <button 
                onClick={handleNext}
                disabled={currentIndex === totalCount - 1 || totalCount === 0}
                className="p-3 bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                title="Câu sau"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Standard Filters (Buttons) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-50 dark:border-slate-800">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mr-1 flex items-center gap-1.5">
            <Filter size={10} /> Lọc nhanh:
          </span>
          {Object.entries(GRADE_LABELS).map(([v, l]) => (
            <Link 
              key={v} href={buildUrl('grade', initialParams.grade === v ? '' : v)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border-2 transition-all ${
                initialParams.grade === v ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' : 'bg-white border-gray-100 text-gray-500 hover:border-primary/30'
              }`}
            >
              {l}
            </Link>
          ))}
          <div className="w-px h-5 bg-gray-100 mx-1" />
          {Object.entries(SUBJECT_LABELS).map(([v, l]) => (
            <Link 
              key={v} href={buildUrl('subject', initialParams.subject === v ? '' : v)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border-2 transition-all ${
                initialParams.subject === v ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' : 'bg-white border-gray-100 text-gray-500 hover:border-primary/30'
              }`}
            >
              {l}
            </Link>
          ))}
          {(initialParams.grade || initialParams.subject || initialParams.code) && (
            <Link href="/teacher/questions" className="ml-auto text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline px-2">Xoá lọc ×</Link>
          )}
        </div>
      </div>

      {/* ─── KHU VỰC PREVIEW (FULL WIDTH) ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-lg overflow-hidden min-h-[500px] flex flex-col">
        {selectedQ ? (
          <>
            {/* Preview Header */}
            <div className="px-8 py-5 border-b border-gray-50 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-gray-50/30 dark:bg-slate-800/20">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{selectedQ.question_code}</h2>
                  <span className="px-2.5 py-1 rounded-lg bg-violet-600 text-white text-[9px] font-black uppercase tracking-wider shadow-md shadow-violet-500/20">
                    {TYPE_LABELS[selectedQ.type]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-500">{GRADE_LABELS[selectedQ.grade_code ?? '']}</span>
                  <div className="w-1 h-1 rounded-full bg-gray-200" />
                  <span className="text-[10px] font-bold text-gray-500">{SUBJECT_LABELS[selectedQ.subject_type ?? '']}</span>
                  <div className="w-1 h-1 rounded-full bg-gray-200" />
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${DIFFICULTY_COLORS[selectedQ.difficulty ?? '']}`}>
                    {DIFFICULTY_LABELS[selectedQ.difficulty ?? '']}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Link
                  href={`/teacher/questions/${selectedQ.id}/edit`}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95"
                >
                  <Pencil size={14} /> Sửa câu hỏi
                </Link>
                <DeleteQuestionButton id={selectedQ.id} />
              </div>
            </div>

            {/* Preview Body */}
            <div className="flex-1 p-8 space-y-8 overflow-y-auto max-h-[700px] scrollbar-thin scrollbar-thumb-gray-200">
              {/* 1 — Content */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <BookOpen size={16} />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Nội dung câu hỏi</h3>
                </div>
                <div className="text-base leading-relaxed text-gray-900 dark:text-gray-100 bg-gray-50/50 dark:bg-slate-800/30 p-6 rounded-2xl border border-gray-100 dark:border-slate-800">
                  <LatexPreview content={selectedQ.content} />
                </div>
                {selectedQ.image_url && (
                  <div className="relative aspect-video max-h-[400px] rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 group bg-white shadow-sm">
                    <img src={selectedQ.image_url} alt="Question" className="w-full h-full object-contain" />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xl text-white p-2.5 rounded-xl shadow-xl">
                      <ImageIcon size={16} />
                    </div>
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-100 dark:bg-slate-800" />

              {/* 2 — Answers */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-500">
                  <CheckCircle2 size={16} />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Đáp án</h3>
                </div>
                
                {selectedQ.type === 'mc' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                      const optKey = `option_${letter.toLowerCase()}` as keyof Question
                      const content = selectedQ[optKey] as string
                      const isCorrect = selectedQ.correct_answer === letter
                      return (
                        <div key={letter} className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all ${
                          isCorrect ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-500 text-emerald-900 dark:text-emerald-400 shadow-md shadow-emerald-500/10' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-800'
                        }`}>
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${isCorrect ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-gray-100 dark:bg-slate-700 text-gray-500'}`}>
                            {letter}
                          </span>
                          <div className="text-base font-bold flex-1 pt-1"><LatexPreview content={content || '...'} /></div>
                          {isCorrect && <CheckCircle2 size={18} className="text-emerald-500 mt-1 shrink-0" />}
                        </div>
                      )
                    })}
                  </div>
                )}

                {selectedQ.type === 'tf' && (
                  <div className="flex flex-col gap-3">
                    {selectedQ.question_tf_items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-slate-800/30 border border-gray-100 dark:border-slate-800 group hover:border-primary/20 transition-all">
                        <span className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex items-center justify-center text-[10px] font-black text-gray-400 shadow-sm">{item.label.toUpperCase()}</span>
                        <div className="flex-1 text-base font-bold text-gray-800 dark:text-gray-200"><LatexPreview content={item.content} /></div>
                        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-md ${item.is_correct ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-red-500 text-white shadow-red-500/20'}`}>
                          {item.is_correct ? <CheckCircle2 size={14} /> : <XCircle size={14} />} {item.is_correct ? 'ĐÚNG' : 'SAI'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedQ.type === 'short' && (
                  <div className="p-8 rounded-3xl bg-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center gap-2">
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">Đáp số chính xác</span>
                    <span className="text-4xl font-black text-primary tracking-tighter">{selectedQ.correct_number}</span>
                  </div>
                )}

                {selectedQ.type === 'essay' && (
                  <div className="flex items-center gap-3 p-6 rounded-2xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 text-violet-700 dark:text-violet-400">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm text-violet-600"><Clock size={20} /></div>
                    <span className="text-base font-black">Điểm tối đa: {selectedQ.max_score} điểm</span>
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-100 dark:bg-slate-800" />

              {/* 3 — Solution */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-500">
                  <Lightbulb size={16} />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Lời giải</h3>
                </div>
                {selectedQ.solution_guide ? (
                  <div className="bg-amber-50/30 dark:bg-amber-900/5 p-8 rounded-2xl border border-amber-100 dark:border-amber-900/20 text-base leading-relaxed text-gray-800 dark:text-gray-200">
                    <LatexPreview content={selectedQ.solution_guide} />
                  </div>
                ) : (
                  <div className="p-10 rounded-2xl border-2 border-dashed border-gray-100 dark:border-slate-800 flex items-center justify-center text-gray-400 italic font-bold text-sm">Chưa có lời giải chi tiết cho câu hỏi này.</div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-16 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center mb-4 animate-pulse text-gray-200"><Search size={48} /></div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Không tìm thấy câu hỏi</h3>
            <p className="text-sm text-gray-500 mt-1 font-medium">Hãy thử thay đổi bộ lọc hoặc gõ mã ID khác.</p>
          </div>
        )}
      </div>
    </div>
  )
}
