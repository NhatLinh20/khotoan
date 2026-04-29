'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Save, Loader2, Hash } from 'lucide-react'
import dynamic from 'next/dynamic'
import { saveQuestion, updateQuestion } from '@/app/actions/questions'

const LatexPreview = dynamic(() => import('@/components/LatexPreview'), { ssr: false })

// ─── Config ─────────────────────────────────────────────────────────
const GRADE_OPTIONS = [
  { value: '0', label: 'Lớp 10' },
  { value: '1', label: 'Lớp 11' },
  { value: '2', label: 'Lớp 12' },
]
const SUBJECT_OPTIONS = [
  { value: 'D', label: 'D — Đại số / XS / TK' },
  { value: 'H', label: 'H — Hình học' },
  { value: 'C', label: 'C — Chuyên đề' },
]
const DIFFICULTY_OPTIONS = [
  { value: 'N', label: 'N — Nhận biết' },
  { value: 'H', label: 'H — Thông hiểu' },
  { value: 'V', label: 'V — Vận dụng' },
  { value: 'C', label: 'C — Vận dụng cao' },
]
const TYPE_OPTIONS = [
  { value: 'mc', label: 'Trắc nghiệm 4 đáp án (MC)' },
  { value: 'tf', label: 'Đúng / Sai (TF)' },
  { value: 'short', label: 'Trả lời ngắn (Số)' },
  { value: 'essay', label: 'Tự luận (Essay)' },
]

// ─── Types ──────────────────────────────────────────────────────────
interface TfState { content: string; is_correct: boolean }
interface QuestionFormProps {
  mode: 'new' | 'edit'
  initialData?: {
    id: string
    question_code: string
    grade_code: string
    subject_type: string
    chapter: number
    difficulty: string
    lesson: number
    form: number
    type: string
    content: string
    image_url: string | null
    option_a: string | null
    option_b: string | null
    option_c: string | null
    option_d: string | null
    correct_answer: string | null
    correct_number: number | null
    solution_guide: string | null
    max_score: number | null
    tf_items?: { label: string; content: string; is_correct: boolean }[]
  }
}

// ─── Shared input style ──────────────────────────────────────────────
const inputCls =
  'w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
const labelCls = 'block text-xs font-black text-gray-500 uppercase tracking-widest mb-2'

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-8 flex flex-col gap-6">
      <h2 className="text-base font-black text-gray-900 dark:text-white">{title}</h2>
      {children}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────
export default function QuestionForm({ mode, initialData }: QuestionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Code params
  const [gradeCode, setGradeCode] = useState(initialData?.grade_code ?? '0')
  const [subjectType, setSubjectType] = useState(initialData?.subject_type ?? 'D')
  const [chapter, setChapter] = useState(String(initialData?.chapter ?? 1))
  const [difficultyCode, setDifficultyCode] = useState(initialData?.difficulty ?? 'N')
  const [lesson, setLesson] = useState(String(initialData?.lesson ?? 1))
  const [form, setForm] = useState(String(initialData?.form ?? 1))

  // Content
  const [qType, setQType] = useState(initialData?.type ?? 'mc')
  const [content, setContent] = useState(initialData?.content ?? '')
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? '')

  // MC
  const [optA, setOptA] = useState(initialData?.option_a ?? '')
  const [optB, setOptB] = useState(initialData?.option_b ?? '')
  const [optC, setOptC] = useState(initialData?.option_c ?? '')
  const [optD, setOptD] = useState(initialData?.option_d ?? '')
  const [correctAnswer, setCorrectAnswer] = useState(initialData?.correct_answer ?? 'A')

  // TF
  const [tfItems, setTfItems] = useState<Record<'a' | 'b' | 'c' | 'd', TfState>>({
    a: { content: initialData?.tf_items?.find((i) => i.label === 'a')?.content ?? '', is_correct: initialData?.tf_items?.find((i) => i.label === 'a')?.is_correct ?? false },
    b: { content: initialData?.tf_items?.find((i) => i.label === 'b')?.content ?? '', is_correct: false },
    c: { content: initialData?.tf_items?.find((i) => i.label === 'c')?.content ?? '', is_correct: false },
    d: { content: initialData?.tf_items?.find((i) => i.label === 'd')?.content ?? '', is_correct: false },
  })

  // Short / Essay
  const [correctNumber, setCorrectNumber] = useState(String(initialData?.correct_number ?? ''))
  const [solutionGuide, setSolutionGuide] = useState(initialData?.solution_guide ?? '')
  const [maxScore, setMaxScore] = useState(String(initialData?.max_score ?? ''))

  // Auto-generate question_code
  const questionCode = `${gradeCode}${subjectType}${chapter}${difficultyCode}${lesson}-${form}`

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)

    const result = mode === 'new'
      ? await saveQuestion(fd)
      : await updateQuestion(initialData!.id, fd)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // On success, server action redirects
  }, [mode, initialData])

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-5 py-4 rounded-2xl text-sm font-bold">
          ⚠ {error}
        </div>
      )}

      {/* ── Section 1: Mã ID ── */}
      <SectionCard title="① Mã câu hỏi (tự động sinh)">
        {/* Preview code */}
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-2xl px-5 py-4">
          <Hash size={20} className="text-primary shrink-0" />
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã câu hỏi</p>
            <p className="text-2xl font-black text-primary tracking-widest">{questionCode}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              [{gradeCode}=Lớp] [{subjectType}=Môn] [{chapter}=Chương] [{difficultyCode}=Mức] [{lesson}=Bài] - [{form}=Dạng]
            </p>
          </div>
        </div>

        <input type="hidden" name="question_code" value={questionCode} />
        <input type="hidden" name="grade_code" value={gradeCode} />
        <input type="hidden" name="subject_type" value={subjectType} />
        <input type="hidden" name="difficulty" value={difficultyCode} />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>1 — Lớp</label>
            <select value={gradeCode} onChange={(e) => setGradeCode(e.target.value)} className={inputCls}>
              {GRADE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>2 — Môn</label>
            <select value={subjectType} onChange={(e) => setSubjectType(e.target.value)} className={inputCls}>
              {SUBJECT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>3 — Chương</label>
            <input
              name="chapter"
              type="number" min={1} max={9}
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>4 — Mức độ</label>
            <select value={difficultyCode} onChange={(e) => setDifficultyCode(e.target.value)} className={inputCls}>
              {DIFFICULTY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>5 — Bài §</label>
            <input
              name="lesson"
              type="number" min={1} max={9}
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>6 — Dạng</label>
            <input
              name="form"
              type="number" min={1} max={9}
              value={form}
              onChange={(e) => setForm(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
      </SectionCard>

      {/* ── Section 2: Loại câu + Nội dung ── */}
      <SectionCard title="② Nội dung câu hỏi">
        {/* Question type */}
        <div>
          <label className={labelCls}>Loại câu hỏi</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TYPE_OPTIONS.map((o) => (
              <label
                key={o.value}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl border cursor-pointer transition-all text-sm font-bold ${
                  qType === o.value
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 dark:border-slate-700 text-gray-500 hover:border-primary/40'
                }`}
              >
                <input
                  type="radio" name="type" value={o.value}
                  checked={qType === o.value}
                  onChange={() => setQType(o.value)}
                  className="accent-primary"
                />
                {o.label}
              </label>
            ))}
          </div>
        </div>

        {/* Content + preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelCls}>Nội dung câu hỏi</label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
            >
              <Eye size={14} />
              {showPreview ? 'Ẩn preview' : 'Preview LaTeX'}
            </button>
          </div>
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            required
            placeholder="Nhập nội dung câu hỏi. Dùng $...$ cho LaTeX inline, $$...$$ cho display math."
            className={`${inputCls} resize-y font-mono`}
          />
          {showPreview && content && (
            <div className="mt-3 p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Preview</p>
              <LatexPreview content={content} />
            </div>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label className={labelCls}>Hình ảnh (URL, tuỳ chọn)</label>
          <input
            name="image_url"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className={inputCls}
          />
        </div>
      </SectionCard>

      {/* ── Section 3: Type-specific ── */}
      {qType === 'mc' && (
        <SectionCard title="③ Đáp án trắc nghiệm">
          {(['a', 'b', 'c', 'd'] as const).map((opt, i) => {
            const letter = opt.toUpperCase() as 'A' | 'B' | 'C' | 'D'
            const val = [optA, optB, optC, optD][i]
            const setter = [setOptA, setOptB, setOptC, setOptD][i]
            return (
              <div key={opt} className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 mt-0.5 ${
                  correctAnswer === letter ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'
                }`}>
                  {letter}
                </div>
                <input
                  name={`option_${opt}`}
                  value={val}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={`Đáp án ${letter}`}
                  className={`${inputCls} flex-1`}
                />
                <label className="flex items-center gap-1.5 mt-2 cursor-pointer shrink-0">
                  <input
                    type="radio" name="correct_answer" value={letter}
                    checked={correctAnswer === letter}
                    onChange={() => setCorrectAnswer(letter)}
                    className="accent-emerald-500"
                  />
                  <span className="text-xs font-bold text-emerald-600">Đúng</span>
                </label>
              </div>
            )
          })}
        </SectionCard>
      )}

      {qType === 'tf' && (
        <SectionCard title="③ Mệnh đề Đúng / Sai">
          {(['a', 'b', 'c', 'd'] as const).map((label) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center font-black text-sm text-gray-500 shrink-0 mt-0.5">
                {label}
              </div>
              <div className="flex-1">
                <input
                  name={`tf_content_${label}`}
                  value={tfItems[label].content}
                  onChange={(e) => setTfItems((prev) => ({ ...prev, [label]: { ...prev[label], content: e.target.value } }))}
                  placeholder={`Nội dung mệnh đề ${label}`}
                  className={inputCls}
                />
              </div>
              {/* Toggle Đúng/Sai */}
              <button
                type="button"
                onClick={() => setTfItems((prev) => ({
                  ...prev,
                  [label]: { ...prev[label], is_correct: !prev[label].is_correct },
                }))}
                className={`mt-1 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 border ${
                  tfItems[label].is_correct
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-500 border-red-200 dark:border-red-800'
                }`}
              >
                {tfItems[label].is_correct ? '✓ Đúng' : '✗ Sai'}
              </button>
              <input type="hidden" name={`tf_correct_${label}`} value={String(tfItems[label].is_correct)} />
            </div>
          ))}
        </SectionCard>
      )}

      {qType === 'short' && (
        <SectionCard title="③ Đáp số (số)">
          <div>
            <label className={labelCls}>Đáp án đúng (số)</label>
            <input
              name="correct_number"
              type="number"
              step="any"
              value={correctNumber}
              onChange={(e) => setCorrectNumber(e.target.value)}
              placeholder="VD: -3.5 hoặc 32"
              className={inputCls}
            />
          </div>
        </SectionCard>
      )}

      {qType === 'essay' && (
        <SectionCard title="③ Hướng dẫn chấm tự luận">
          <div>
            <label className={labelCls}>Hướng dẫn giải</label>
            <textarea
              name="solution_guide"
              value={solutionGuide}
              onChange={(e) => setSolutionGuide(e.target.value)}
              rows={5}
              placeholder="Trình bày hướng dẫn giải chi tiết..."
              className={`${inputCls} resize-y`}
            />
          </div>
          <div className="max-w-xs">
            <label className={labelCls}>Điểm tối đa</label>
            <input
              name="max_score"
              type="number"
              step="0.25"
              min={0}
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              placeholder="VD: 1.0"
              className={inputCls}
            />
          </div>
        </SectionCard>
      )}

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black hover:bg-primary-dark disabled:opacity-60 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/30"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {mode === 'new' ? 'Lưu câu hỏi' : 'Cập nhật'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/teacher/questions')}
          className="px-6 py-4 rounded-2xl font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all border border-gray-200 dark:border-slate-700"
        >
          Huỷ
        </button>
      </div>
    </form>
  )
}
