'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Save, Loader2, Hash, BookOpen, CheckCircle, Upload, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { saveQuestion, updateQuestion } from '@/app/actions/questions'
import { getChapters, getLessons, getForms } from '@/lib/math-taxonomy'
import { createClient } from '@/lib/supabase/client'

const LatexPreview = dynamic(() => import('@/components/LatexPreview'), { ssr: false })

// ─── Config ─────────────────────────────────────────────────────────
const GRADE_OPTIONS = [
 { value: '6', label: 'Lớp 6' },
 { value: '7', label: 'Lớp 7' },
 { value: '8', label: 'Lớp 8' },
 { value: '9', label: 'Lớp 9' },
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
 { value: 'mc', label: 'Trắc nghiệm (MC)' },
 { value: 'tf', label: 'Đúng / Sai (TF)' },
 { value: 'short', label: 'Trả lời ngắn' },
 { value: 'essay', label: 'Tự luận' },
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

// ─── Shared styles ───────────────────────────────────────────────────
const inputCls = 'w-full px-3 py-2.5 bg-surface border border-secondary/20 rounded-md text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
const labelCls = 'block text-[10px] font-display font-bold text-secondary/80 uppercase tracking-widest mb-1.5'

function SectionCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
 return (
 <div className="bg-surface rounded-md border border-secondary/20 p-6 flex flex-col gap-5">
 <div className="flex items-center gap-2">
 {icon && <span className="text-primary">{icon}</span>}
 <h2 className="text-sm font-display font-bold text-primary uppercase tracking-wide">{title}</h2>
 </div>
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

 // ── ID params ──
 const [gradeCode, setGradeCode] = useState(initialData?.grade_code ?? '0')
 const [subjectType, setSubjectType] = useState(initialData?.subject_type ?? 'D')
 const [chapter, setChapter] = useState(initialData?.chapter ?? 1)
 const [difficultyCode, setDifficultyCode] = useState(initialData?.difficulty ?? 'N')
 const [lesson, setLesson] = useState(initialData?.lesson ?? 1)
 const [form, setForm] = useState(initialData?.form ?? 1)

 // ── Derived taxonomy lists ──
 const chapters = getChapters(gradeCode, subjectType)
 const lessons = getLessons(gradeCode, subjectType, chapter)
 const forms = getForms(gradeCode, subjectType, chapter, lesson)

 // Reset cascades when parent changes
 useEffect(() => {
 const chs = getChapters(gradeCode, subjectType)
 if (!chs.find((c) => c.value === chapter)) {
 const first = chs[0]?.value ?? 1
 setChapter(first)
 }
 }, [gradeCode, subjectType])

 useEffect(() => {
 const lss = getLessons(gradeCode, subjectType, chapter)
 if (!lss.find((l) => l.value === lesson)) {
 setLesson(lss[0]?.value ?? 1)
 }
 }, [gradeCode, subjectType, chapter])

 useEffect(() => {
 const fms = getForms(gradeCode, subjectType, chapter, lesson)
 if (!fms.find((f) => f.value === form)) {
 setForm(fms[0]?.value ?? 1)
 }
 }, [gradeCode, subjectType, chapter, lesson])

 // ── Content ──
 const [qType, setQType] = useState(initialData?.type ?? 'mc')
 const [content, setContent] = useState(initialData?.content ?? '')
 const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? '')
 const [isUploading, setIsUploading] = useState(false)

 const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0]
 if (!file) return

 setIsUploading(true)
 setError(null)

 try {
 const supabase = createClient()
 const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
 const path = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`

 const { data, error: upErr } = await supabase.storage
 .from('question-images')
 .upload(path, file)

 if (upErr) throw upErr

 const { data: { publicUrl } } = supabase.storage.from('question-images').getPublicUrl(data.path)
 setImageUrl(publicUrl)
 } catch (err: any) {
 setError('Lỗi tải ảnh: ' + (err.message || 'Không xác định'))
 } finally {
 setIsUploading(false)
 }
 }

 // ── MC ──
 const [optA, setOptA] = useState(initialData?.option_a ?? '')
 const [optB, setOptB] = useState(initialData?.option_b ?? '')
 const [optC, setOptC] = useState(initialData?.option_c ?? '')
 const [optD, setOptD] = useState(initialData?.option_d ?? '')
 const [correctAnswer, setCorrectAnswer] = useState(initialData?.correct_answer ?? 'A')

 // ── TF ──
 const [tfItems, setTfItems] = useState<Record<'a' | 'b' | 'c' | 'd', TfState>>({
 a: { content: initialData?.tf_items?.find((i) => i.label === 'a')?.content ?? '', is_correct: initialData?.tf_items?.find((i) => i.label === 'a')?.is_correct ?? false },
 b: { content: initialData?.tf_items?.find((i) => i.label === 'b')?.content ?? '', is_correct: initialData?.tf_items?.find((i) => i.label === 'b')?.is_correct ?? false },
 c: { content: initialData?.tf_items?.find((i) => i.label === 'c')?.content ?? '', is_correct: initialData?.tf_items?.find((i) => i.label === 'c')?.is_correct ?? false },
 d: { content: initialData?.tf_items?.find((i) => i.label === 'd')?.content ?? '', is_correct: initialData?.tf_items?.find((i) => i.label === 'd')?.is_correct ?? false },
 })

 // ── Short / Essay ──
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
 }, [mode, initialData])

 // ── Chapter label for breadcrumb ──
 const chapterLabel = chapters.find((c) => c.value === chapter)?.label ?? ''
 const lessonLabel = lessons.find((l) => l.value === lesson)?.label ?? ''

 return (
 <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-4xl">
 {error && (
 <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-md text-sm font-bold">
 ⚠ {error}
 </div>
 )}

 {/* ── SECTION 1: MÃ ID ── */}
 <SectionCard title="Mã câu hỏi" icon={<Hash size={16} />}>

 {/* Live ID Badge */}
 <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-md px-4 py-3">
 <div className="flex-1">
 <p className="text-[9px] font-display font-bold text-secondary/80 uppercase tracking-widest mb-0.5">Mã tự động sinh</p>
 <p className="text-xl font-display font-bold text-primary tracking-widest font-mono">{questionCode}</p>
 </div>
 <div className="text-right text-[10px] text-secondary/80 leading-relaxed max-w-[55%] hidden sm:block">
 <p className="font-bold text-secondary truncate">{chapterLabel}</p>
 <p className="truncate">{lessonLabel}</p>
 </div>
 </div>

 <input type="hidden" name="question_code" value={questionCode} />
 <input type="hidden" name="grade_code" value={gradeCode} />
 <input type="hidden" name="subject_type" value={subjectType} />
 <input type="hidden" name="chapter" value={chapter} />
 <input type="hidden" name="difficulty" value={difficultyCode} />
 <input type="hidden" name="lesson" value={lesson} />
 <input type="hidden" name="form" value={form} />

 {/* Row 1: Grade + Subject + Difficulty + Type */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
 <div>
 <label className={labelCls}>① Lớp</label>
 <select value={gradeCode} onChange={(e) => setGradeCode(e.target.value)} className={inputCls}>
 {GRADE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
 </select>
 </div>
 <div>
 <label className={labelCls}>② Môn học</label>
 <select value={subjectType} onChange={(e) => setSubjectType(e.target.value)} className={inputCls}>
 {SUBJECT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
 </select>
 </div>
 <div>
 <label className={labelCls}>④ Mức độ</label>
 <select value={difficultyCode} onChange={(e) => setDifficultyCode(e.target.value)} className={inputCls}>
 {DIFFICULTY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
 </select>
 </div>
 <div>
 <label className={labelCls}>⑥ Dạng bài</label>
 <select value={form} onChange={(e) => setForm(Number(e.target.value))} className={inputCls}>
 {forms.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
 </select>
 </div>
 </div>

 {/* Row 2: Chapter + Lesson (full width, cascading dropdowns) */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 <div>
 <label className={labelCls}>③ Chương</label>
 <select
 value={chapter}
 onChange={(e) => setChapter(Number(e.target.value))}
 className={inputCls}
 >
 {chapters.map((c) => (
 <option key={c.value} value={c.value}>{c.label}</option>
 ))}
 </select>
 </div>
 <div>
 <label className={labelCls}>⑤ Bài học</label>
 <select
 value={lesson}
 onChange={(e) => setLesson(Number(e.target.value))}
 className={inputCls}
 >
 {lessons.map((l) => (
 <option key={l.value} value={l.value}>{l.label}</option>
 ))}
 </select>
 </div>
 </div>
 </SectionCard>

 {/* ── SECTION 2: LOẠI CÂU HỎI + NỘI DUNG ── */}
 <SectionCard title="Nội dung câu hỏi" icon={<BookOpen size={16} />}>

 {/* Question type pills */}
 <div>
 <label className={labelCls}>Loại câu hỏi</label>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
 {TYPE_OPTIONS.map((o) => (
 <label
 key={o.value}
 className={`flex items-center gap-2 px-3 py-2.5 rounded-md border cursor-pointer transition-all text-xs font-bold ${
 qType === o.value
 ? 'border-primary bg-primary/5 text-primary'
 : 'border-secondary/20 text-secondary hover:border-primary/40'
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

 {/* Content */}
 <div>
 <div className="flex items-center justify-between mb-1.5">
 <label className={labelCls}>Nội dung câu hỏi</label>
 <button
 type="button"
 onClick={() => setShowPreview(!showPreview)}
 className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary-dark"
 >
 <Eye size={12} />
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
 <div className="mt-3 p-4 bg-neutral rounded-md border border-secondary/20 ">
 <p className="text-[9px] font-display font-bold text-secondary/80 uppercase tracking-widest mb-2">Preview</p>
 <LatexPreview content={content} />
 </div>
 )}
 </div>

 {/* Image URL & Upload */}
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <label className={labelCls}>Hình ảnh bài toán</label>
 {imageUrl && (
 <button
 type="button"
 onClick={() => setImageUrl('')}
 className="text-[10px] font-bold text-red-500 hover:underline flex items-center gap-1"
 >
 <X size={10} /> Xóa ảnh
 </button>
 )}
 </div>
 
 <div className="flex flex-col sm:flex-row gap-3">
 <div className="flex-1">
 <input
 name="image_url"
 type="url"
 value={imageUrl}
 onChange={(e) => setImageUrl(e.target.value)}
 placeholder="Dán link ảnh (https://...) hoặc tải lên bên cạnh"
 className={inputCls}
 />
 </div>
 <div className="shrink-0">
 <label className="flex items-center gap-2 px-4 py-2.5 bg-neutral border border-secondary/20 rounded-md text-sm font-bold text-secondary cursor-pointer hover:bg-gray-200 :bg-slate-700 transition-all">
 {isUploading ? (
 <Loader2 size={16} className="animate-spin text-primary" />
 ) : (
 <Upload size={16} className="text-primary" />
 )}
 <span>{isUploading ? 'Đang tải...' : 'Tải ảnh lên'}</span>
 <input
 type="file"
 accept="image/*"
 className="hidden"
 onChange={handleImageUpload}
 disabled={isUploading}
 />
 </label>
 </div>
 </div>

 {imageUrl && (
 <div className="mt-2 flex justify-center">
 <img 
 src={imageUrl} 
 alt="Preview" 
 className="max-h-64 border border-secondary/20 shadow-sm"
 />
 </div>
 )}
 <p className="text-[10px] text-secondary/80 italic">Hỗ trợ các định dạng: JPG, PNG, GIF, WebP. Dung lượng tối đa 5MB.</p>
 </div>
 </SectionCard>

 {/* ── SECTION 3: TYPE-SPECIFIC ── */}
 {qType === 'mc' && (
 <SectionCard title="Đáp án trắc nghiệm" icon={<CheckCircle size={16} />}>
 {(['a', 'b', 'c', 'd'] as const).map((opt, i) => {
 const letter = opt.toUpperCase() as 'A' | 'B' | 'C' | 'D'
 const val = [optA, optB, optC, optD][i]
 const setter = [setOptA, setOptB, setOptC, setOptD][i]
 return (
 <div key={opt} className="flex items-center gap-3">
 <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-xs shrink-0 ${
 correctAnswer === letter ? 'bg-emerald-500 text-surface' : 'bg-neutral text-secondary'
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
 <label className="flex items-center gap-1 cursor-pointer shrink-0">
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
 <SectionCard title="Mệnh đề Đúng / Sai" icon={<CheckCircle size={16} />}>
 {(['a', 'b', 'c', 'd'] as const).map((label) => (
 <div key={label} className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-lg bg-neutral flex items-center justify-center font-display font-bold text-xs text-secondary shrink-0">
 {label}
 </div>
 <input
 name={`tf_content_${label}`}
 value={tfItems[label].content}
 onChange={(e) => setTfItems((prev) => ({ ...prev, [label]: { ...prev[label], content: e.target.value } }))}
 placeholder={`Nội dung mệnh đề ${label}`}
 className={`${inputCls} flex-1`}
 />
 <button
 type="button"
 onClick={() => setTfItems((prev) => ({
 ...prev,
 [label]: { ...prev[label], is_correct: !prev[label].is_correct },
 }))}
 className={`px-3 py-2 rounded-md text-xs font-display font-bold transition-all shrink-0 border ${
 tfItems[label].is_correct
 ? 'bg-emerald-500 text-surface border-emerald-500'
 : 'bg-red-50 text-red-500 border-red-200 '
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
 <SectionCard title="Đáp số (số)" icon={<CheckCircle size={16} />}>
 <div className="max-w-xs">
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
 <SectionCard title="Hướng dẫn chấm tự luận" icon={<CheckCircle size={16} />}>
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

 {/* Lời giải chung (ngoài essay) */}
 {qType !== 'essay' && (
 <SectionCard title="Lời giải (tuỳ chọn)" icon={<BookOpen size={16} />}>
 <textarea
 name="solution_guide"
 value={solutionGuide}
 onChange={(e) => setSolutionGuide(e.target.value)}
 rows={4}
 placeholder="Trình bày lời giải chi tiết... (hỗ trợ LaTeX)"
 className={`${inputCls} resize-y`}
 />
 </SectionCard>
 )}

 {/* Submit */}
 <div className="flex items-center gap-3 pt-1">
 <button
 type="submit"
 disabled={loading}
 className="flex items-center gap-2 bg-primary text-surface px-6 py-3 rounded-md font-display font-bold text-sm hover:bg-primary-dark disabled:opacity-60 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/30"
 >
 {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
 {mode === 'new' ? 'Lưu câu hỏi' : 'Cập nhật'}
 </button>
 <button
 type="button"
 onClick={() => router.push('/teacher/questions')}
 className="px-5 py-3 rounded-md font-bold text-sm text-secondary hover:text-gray-700 hover:bg-neutral :bg-slate-800 transition-all border border-secondary/20 "
 >
 Huỷ
 </button>
 </div>
 </form>
 )
}
