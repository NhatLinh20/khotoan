'use client'

import { useState, useEffect, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Search, Plus, Trash2, Loader2,
  BookOpen, Globe, Save, X, GripVertical
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { saveExam } from '@/app/actions/exams'
import { getChapters, getLessons } from '@/lib/math-taxonomy'

const GRADE_OPTS = [
  { v: 6, l: 'Lớp 6' }, { v: 7, l: 'Lớp 7' }, { v: 8, l: 'Lớp 8' }, { v: 9, l: 'Lớp 9' },
  { v: 10, l: 'Lớp 10' }, { v: 11, l: 'Lớp 11' }, { v: 12, l: 'Lớp 12' },
]
const SUBJECT_OPTS = [
  { v: 'D', l: 'Đại số' }, { v: 'H', l: 'Hình học' }, { v: 'C', l: 'Chuyên đề' },
]
const DIFF_OPTS = [
  { v: 'N', l: 'Nhận biết' }, { v: 'H', l: 'Thông hiểu' }, { v: 'V', l: 'Vận dụng' }, { v: 'C', l: 'Vận dụng cao' },
]
const TYPE_OPTS = [
  { v: 'mc', l: 'Trắc nghiệm' }, { v: 'tf', l: 'Đúng/Sai' }, { v: 'short', l: 'Trả lời ngắn' }, { v: 'essay', l: 'Tự luận' },
]
const TYPE_COLORS: Record<string, string> = {
  mc: 'bg-blue-100 text-blue-700', tf: 'bg-violet-100 text-violet-700',
  short: 'bg-amber-100 text-amber-700', essay: 'bg-rose-100 text-rose-700',
}
const DIFF_COLORS: Record<string, string> = {
  N: 'bg-emerald-100 text-emerald-700', H: 'bg-blue-100 text-blue-700',
  V: 'bg-amber-100 text-amber-700', C: 'bg-red-100 text-red-700',
}

type Question = {
  id: string
  question_code: string
  type: string
  difficulty: string
  content: string
  max_score?: number | null
}

type ExamQ = Question & { _uid: string }

interface Props {
  initialExamId?: string
  initialData?: {
    title: string
    description: string
    grade: number
    subject: string
    duration_min: number
    questions: ExamQ[]
  }
}

const inputCls = 'w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
const labelCls = 'block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1'

export default function ExamBankBuilder({ initialExamId, initialData }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Form info
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [desc, setDesc] = useState(initialData?.description ?? '')
  const [grade, setGrade] = useState<number>(initialData?.grade ?? 10)
  const [subject, setSubject] = useState(initialData?.subject ?? 'D')
  const [duration, setDuration] = useState(initialData?.duration_min ?? 45)

  // Search / filter for question bank
  const [codeSearch, setCodeSearch] = useState('')
  const [filterGrade, setFilterGrade] = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [filterDiff, setFilterDiff] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterChapter, setFilterChapter] = useState('')
  const [filterLesson, setFilterLesson] = useState('')
  const [filterForm, setFilterForm] = useState('')
  const [bankQuestions, setBankQuestions] = useState<Question[]>([])
  const [bankLoading, setBankLoading] = useState(false)

  const supabase = createClient()

  // Taxonomy derivation from DB
  const [dbChapters, setDbChapters] = useState<number[]>([])
  const [dbLessons, setDbLessons] = useState<number[]>([])

  useEffect(() => {
    if (!filterGrade || !filterSubject) { setDbChapters([]); return }
    supabase.from('questions').select('chapter').eq('grade_code', filterGrade).eq('subject_type', filterSubject)
      .then(({ data }) => {
        if (data) {
          const unique = Array.from(new Set(data.map(d => d.chapter).filter(Boolean) as number[])).sort((a,b)=>a-b)
          setDbChapters(unique)
        }
      })
  }, [filterGrade, filterSubject, supabase])

  useEffect(() => {
    if (!filterGrade || !filterSubject || !filterChapter) { setDbLessons([]); return }
    supabase.from('questions').select('lesson').eq('grade_code', filterGrade).eq('subject_type', filterSubject).eq('chapter', Number(filterChapter))
      .then(({ data }) => {
        if (data) {
          const unique = Array.from(new Set(data.map(d => d.lesson).filter(Boolean) as number[])).sort((a,b)=>a-b)
          setDbLessons(unique)
        }
      })
  }, [filterGrade, filterSubject, filterChapter, supabase])

  // Selected questions & Scoring
  const [examQuestions, setExamQuestions] = useState<ExamQ[]>(initialData?.questions ?? [])
  
  const [ptsMC, setPtsMC] = useState(() => initialData?.questions.filter(q => q.type==='mc').reduce((s, q) => s + (q.max_score||1), 0) ?? 0)
  const [ptsShort, setPtsShort] = useState(() => initialData?.questions.filter(q => q.type==='short').reduce((s, q) => s + (q.max_score||1), 0) ?? 0)
  const [ptsEssay, setPtsEssay] = useState(() => initialData?.questions.filter(q => q.type==='essay').reduce((s, q) => s + (q.max_score||1), 0) ?? 0)

  const countMC = examQuestions.filter(q => q.type === 'mc').length
  const countTF = examQuestions.filter(q => q.type === 'tf').length
  const countShort = examQuestions.filter(q => q.type === 'short').length
  const countEssay = examQuestions.filter(q => q.type === 'essay').length
  
  const totalScore = ptsMC + (countTF * 1.0) + ptsShort + ptsEssay

  const getQuestionScore = (type: string) => {
    if (type === 'mc') return countMC > 0 ? (ptsMC / countMC) : 0
    if (type === 'tf') return 1.0
    if (type === 'short') return countShort > 0 ? (ptsShort / countShort) : 0
    if (type === 'essay') return countEssay > 0 ? (ptsEssay / countEssay) : 0
    return 0
  }

  useEffect(() => {
    const run = async () => {
      setBankLoading(true)
      let q = supabase.from('questions').select('id,question_code,type,difficulty,content,max_score')
      if (codeSearch) q = q.ilike('question_code', `%${codeSearch}%`)
      else {
        if (filterGrade) q = q.eq('grade_code', filterGrade)
        if (filterSubject) q = q.eq('subject_type', filterSubject)
        if (filterDiff) q = q.eq('difficulty', filterDiff)
        if (filterType) q = q.eq('type', filterType)
        if (filterChapter) q = q.eq('chapter', Number(filterChapter))
        if (filterLesson) q = q.eq('lesson', Number(filterLesson))
        if (filterForm) q = q.eq('form', Number(filterForm))
      }
      const { data } = await q.order('created_at', { ascending: false }).limit(100)
      setBankQuestions(data ?? [])
      setBankLoading(false)
    }
    const t = setTimeout(run, 300)
    return () => clearTimeout(t)
  }, [codeSearch, filterGrade, filterSubject, filterDiff, filterType, filterChapter, filterLesson, filterForm])

  const addedIds = useMemo(() => new Set(examQuestions.map(q => q.id)), [examQuestions])

  const handleAdd = (q: Question) => {
    if (addedIds.has(q.id)) return
    setExamQuestions(prev => [...prev, { ...q, _uid: Math.random().toString(36).slice(2) }])
  }

  const handleRemove = (uid: string) => {
    setExamQuestions(prev => prev.filter(q => q._uid !== uid))
  }

  const handleSave = (publish: boolean) => {
    if (!title.trim()) { setError('Vui lòng nhập tên đề thi'); return }
    setError(null)
    startTransition(async () => {
      const res = await saveExam({
        examId: initialExamId,
        title, description: desc, grade, subject, duration_min: duration,
        exam_type: 'bank', is_published: publish,
        questions: examQuestions.map((q, i) => ({
          question_id: q.id, order_index: i + 1, type: q.type,
          max_score: getQuestionScore(q.type) || 0,
        })),
      })
      if (res.error) { setError(res.error); return }
      router.push('/teacher/exams')
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/teacher/exams" className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">
            {initialExamId ? 'Sửa đề thi' : 'Tạo đề từ ngân hàng câu hỏi'}
          </h1>
        </div>
        <div className="flex gap-2 ml-auto">
          <button onClick={() => handleSave(false)} disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50">
            {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Lưu nháp
          </button>
          <button onClick={() => handleSave(true)} disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
            <Globe size={15} /> Công bố
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold border border-red-100 dark:border-red-900/30">
          ⚠ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT: Exam info + selected */}
        <div className="lg:col-span-4 space-y-4">
          {/* Info card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-black text-gray-900 dark:text-white">Thông tin đề thi</h2>

            <div>
              <label className={labelCls}>Tên đề thi *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: Kiểm tra 1 tiết Chương 1..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Mô tả</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} className={`${inputCls} resize-none`} placeholder="Ghi chú thêm về đề thi..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Khối lớp</label>
                <select value={grade} onChange={e => setGrade(Number(e.target.value))} className={inputCls}>
                  {GRADE_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Môn học</label>
                <select value={subject} onChange={e => setSubject(e.target.value)} className={inputCls}>
                  {SUBJECT_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Thời gian (phút)</label>
              <input type="number" min={5} value={duration} onChange={e => setDuration(Number(e.target.value))} className={inputCls} />
            </div>
          </div>

          {/* Scoring Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-black text-gray-900 dark:text-white">Cấu trúc điểm</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800">
                    <th className="py-2 text-left font-bold text-gray-500 text-xs">Loại câu</th>
                    <th className="py-2 text-center font-bold text-gray-500 text-xs">Số câu</th>
                    <th className="py-2 text-right font-bold text-gray-500 text-xs w-28">Tổng điểm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800 text-sm">
                  <tr>
                    <td className="py-2">Trắc nghiệm</td>
                    <td className="py-2 text-center font-bold">{countMC}</td>
                    <td className="py-2">
                      <input type="number" step="any" min={0} value={ptsMC} onChange={e => setPtsMC(Number(e.target.value) || 0)} className="w-full text-right bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">Đúng/Sai</td>
                    <td className="py-2 text-center font-bold">{countTF}</td>
                    <td className="py-2">
                      <input type="number" disabled value={countTF * 1.0} className="w-full text-right bg-gray-100 dark:bg-slate-800/50 text-gray-400 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-1 cursor-not-allowed" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">Trả lời ngắn</td>
                    <td className="py-2 text-center font-bold">{countShort}</td>
                    <td className="py-2">
                      <input type="number" step="any" min={0} value={ptsShort} onChange={e => setPtsShort(Number(e.target.value) || 0)} className="w-full text-right bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">Tự luận</td>
                    <td className="py-2 text-center font-bold">{countEssay}</td>
                    <td className="py-2">
                      <input type="number" step="any" min={0} value={ptsEssay} onChange={e => setPtsEssay(Number(e.target.value) || 0)} className="w-full text-right bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </td>
                  </tr>
                </tbody>
                <tfoot className="border-t-2 border-gray-100 dark:border-slate-800">
                  <tr>
                    <td className="py-2 font-black">Tổng cộng</td>
                    <td className="py-2 text-center font-black">{examQuestions.length}</td>
                    <td className="py-2 text-right font-black text-primary">{totalScore} đ</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Selected questions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-black text-gray-900 dark:text-white">Câu hỏi trong đề</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">{examQuestions.length} câu</span>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">{totalScore} đ</span>
              </div>
            </div>
            {examQuestions.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">
                <BookOpen size={28} className="mx-auto mb-2 text-gray-200" />
                Chưa có câu hỏi nào
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-slate-800 max-h-[400px] overflow-y-auto">
                {examQuestions.map((q, i) => (
                  <div key={q._uid} className="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 group">
                    <span className="text-[10px] font-black text-gray-300 w-5 text-center shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black text-gray-600 dark:text-gray-400 font-mono">{q.question_code}</p>
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{q.content.slice(0, 60)}…</p>
                    </div>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 ${TYPE_COLORS[q.type]}`}>{q.type.toUpperCase()}</span>
                    <span className="text-[10px] font-bold text-gray-500 w-10 text-right shrink-0">{Number(getQuestionScore(q.type).toFixed(2))}đ</span>
                    <button onClick={() => handleRemove(q._uid)} className="p-1 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Question bank */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-sm font-black text-gray-900 dark:text-white mb-3">Tìm câu hỏi từ ngân hàng</h2>
            <div className="flex flex-col gap-2">
              {/* Search */}
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={codeSearch} onChange={e => setCodeSearch(e.target.value.toUpperCase())}
                  placeholder="Tìm theo mã ID câu hỏi..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                />
              </div>
              {/* Filters */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <select value={filterGrade} onChange={e => { setFilterGrade(e.target.value); setFilterChapter(''); setFilterLesson(''); setFilterForm('') }}
                  className="px-2 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Tất cả lớp</option>
                  <option value="6">Lớp 6</option><option value="7">Lớp 7</option>
                  <option value="8">Lớp 8</option><option value="9">Lớp 9</option>
                  <option value="0">Lớp 10</option><option value="1">Lớp 11</option><option value="2">Lớp 12</option>
                </select>
                <select value={filterSubject} onChange={e => { setFilterSubject(e.target.value); setFilterChapter(''); setFilterLesson(''); setFilterForm('') }}
                  className="px-2 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Tất cả môn</option>
                  {SUBJECT_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
                <select value={filterChapter} onChange={e => { setFilterChapter(e.target.value); setFilterLesson(''); setFilterForm('') }}
                  className="px-2 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Tất cả chương</option>
                  {dbChapters.map(c => <option key={c} value={c}>Chương {c}</option>)}
                </select>
                <select value={filterLesson} onChange={e => { setFilterLesson(e.target.value); setFilterForm('') }}
                  className="px-2 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Tất cả bài</option>
                  {dbLessons.map(l => <option key={l} value={l}>Bài {l}</option>)}
                </select>
                
                <input type="number" placeholder="Dạng..." value={filterForm} onChange={e => setFilterForm(e.target.value)}
                  className="px-2 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <select value={filterDiff} onChange={e => setFilterDiff(e.target.value)}
                  className="px-2 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Tất cả mức</option>
                  {DIFF_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
                <select value={filterType} onChange={e => setFilterType(e.target.value)}
                  className="px-2 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Tất cả loại</option>
                  {TYPE_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Bank list */}
          <div className="overflow-y-auto max-h-[600px]">
            {bankLoading ? (
              <div className="py-10 flex justify-center"><Loader2 size={24} className="animate-spin text-primary" /></div>
            ) : bankQuestions.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">Không tìm thấy câu hỏi nào</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-slate-800/30 border-b border-gray-100 dark:border-slate-800">
                    <th className="px-3 py-2 text-left text-[10px] font-black text-gray-400 uppercase w-28">Mã ID</th>
                    <th className="px-3 py-2 text-left text-[10px] font-black text-gray-400 uppercase">Nội dung</th>
                    <th className="px-3 py-2 text-center text-[10px] font-black text-gray-400 uppercase w-20">Loại</th>
                    <th className="px-3 py-2 text-center text-[10px] font-black text-gray-400 uppercase w-20">Mức độ</th>
                    <th className="px-3 py-2 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                  {bankQuestions.map(q => {
                    const already = addedIds.has(q.id)
                    return (
                      <tr key={q.id} className={`hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-colors ${already ? 'opacity-40' : ''}`}>
                        <td className="px-3 py-2">
                          <span className="font-mono text-[11px] font-black text-gray-600 dark:text-gray-400">{q.question_code}</span>
                        </td>
                        <td className="px-3 py-2 max-w-xs">
                          <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 leading-snug">{q.content}</p>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${TYPE_COLORS[q.type]}`}>{q.type.toUpperCase()}</span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${DIFF_COLORS[q.difficulty]}`}>{q.difficulty}</span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => handleAdd(q)}
                            disabled={already}
                            className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title={already ? 'Đã thêm' : 'Thêm vào đề'}
                          >
                            <Plus size={13} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
