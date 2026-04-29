import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Plus, Pencil, Trash2, Filter, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import DeleteQuestionButton from './DeleteButton'

const GRADE_LABELS: Record<string, string> = { '0': 'Lớp 10', '1': 'Lớp 11', '2': 'Lớp 12' }
const SUBJECT_LABELS: Record<string, string> = { D: 'Đại số', H: 'Hình học', C: 'Chuyên đề' }
const DIFFICULTY_LABELS: Record<string, string> = { N: 'Nhận biết', H: 'Thông hiểu', V: 'Vận dụng', C: 'VD Cao' }
const TYPE_LABELS: Record<string, string> = { mc: 'Trắc nghiệm', tf: 'Đúng/Sai', short: 'Trả lời ngắn', essay: 'Tự luận' }

const DIFFICULTY_COLORS: Record<string, string> = {
  N: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  H: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  V: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
  C: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
}
const TYPE_COLORS: Record<string, string> = {
  mc: 'bg-primary/10 text-primary',
  tf: 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400',
  short: 'bg-secondary/10 text-secondary',
  essay: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400',
}

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    grade?: string; subject?: string; difficulty?: string; type?: string
  }>
}) {
  const params = await searchParams
  const { grade, subject, difficulty, type } = params

  const supabase = await createClient()
  let query = supabase
    .from('questions')
    .select('id, question_code, content, type, grade_code, subject_type, difficulty, chapter, lesson, form')
    .order('created_at', { ascending: false })

  if (grade) query = query.eq('grade_code', grade)
  if (subject) query = query.eq('subject_type', subject)
  if (difficulty) query = query.eq('difficulty', difficulty)
  if (type) query = query.eq('type', type)

  const { data: questions, error } = await query

  const buildUrl = (key: string, val: string) => {
    const p = new URLSearchParams({
      ...(grade ? { grade } : {}),
      ...(subject ? { subject } : {}),
      ...(difficulty ? { difficulty } : {}),
      ...(type ? { type } : {}),
    })
    if (val) p.set(key, val)
    else p.delete(key)
    const s = p.toString()
    return `/teacher/questions${s ? `?${s}` : ''}`
  }

  const FilterBtn = ({
    k, v, label, activeColor = 'bg-primary text-white border-primary',
  }: { k: string; v: string; label: string; activeColor?: string }) => {
    const current = params[k as keyof typeof params]
    const isActive = current === v
    return (
      <Link
        href={buildUrl(k, isActive ? '' : v)}
        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
          isActive ? activeColor + ' shadow-lg' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">Teacher Panel</p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Ngân hàng câu hỏi</h1>
          <p className="text-gray-500 mt-1 font-medium">{questions?.length ?? 0} câu hỏi</p>
        </div>
        <Link
          href="/teacher/questions/new"
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black hover:bg-primary-dark transition-all hover:scale-105 shadow-lg shadow-primary/20 w-fit"
        >
          <Plus size={18} /> Thêm câu hỏi
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-5">
        <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
          <Filter size={14} /> Bộ lọc
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Grade */}
          <span className="text-xs font-bold text-gray-400 self-center mr-1">Lớp:</span>
          {Object.entries(GRADE_LABELS).map(([v, l]) => (
            <FilterBtn key={v} k="grade" v={v} label={l} />
          ))}
          <div className="w-px h-6 bg-gray-100 dark:bg-slate-700 self-center mx-1" />

          {/* Subject */}
          <span className="text-xs font-bold text-gray-400 self-center mr-1">Môn:</span>
          {Object.entries(SUBJECT_LABELS).map(([v, l]) => (
            <FilterBtn key={v} k="subject" v={v} label={l} />
          ))}
          <div className="w-px h-6 bg-gray-100 dark:bg-slate-700 self-center mx-1" />

          {/* Difficulty */}
          <span className="text-xs font-bold text-gray-400 self-center mr-1">Độ khó:</span>
          {Object.entries(DIFFICULTY_LABELS).map(([v, l]) => (
            <FilterBtn key={v} k="difficulty" v={v} label={l} activeColor="bg-orange-500 text-white border-orange-500" />
          ))}
          <div className="w-px h-6 bg-gray-100 dark:bg-slate-700 self-center mx-1" />

          {/* Type */}
          <span className="text-xs font-bold text-gray-400 self-center mr-1">Loại:</span>
          {Object.entries(TYPE_LABELS).map(([v, l]) => (
            <FilterBtn key={v} k="type" v={v} label={l} activeColor="bg-violet-600 text-white border-violet-600" />
          ))}

          {/* Clear */}
          {(grade || subject || difficulty || type) && (
            <Link
              href="/teacher/questions"
              className="px-3 py-1.5 rounded-full text-xs font-bold border border-red-200 text-red-500 hover:bg-red-50 transition-all ml-2"
            >
              Xoá lọc ×
            </Link>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden">
        {questions && questions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
                  {['Mã câu', 'Nội dung', 'Loại', 'Lớp', 'Môn', 'Độ khó', 'Thao tác'].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-5 py-4">
                      <code className="font-black text-primary text-xs bg-primary/10 px-2 py-1 rounded-lg">
                        {q.question_code}
                      </code>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <p className="line-clamp-2 text-gray-700 dark:text-gray-300 font-medium text-xs leading-relaxed">
                        {q.content}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${TYPE_COLORS[q.type] ?? ''}`}>
                        {TYPE_LABELS[q.type] ?? q.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {GRADE_LABELS[q.grade_code ?? ''] ?? q.grade_code}
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-gray-600 dark:text-gray-400">
                      {SUBJECT_LABELS[q.subject_type ?? ''] ?? q.subject_type}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${DIFFICULTY_COLORS[q.difficulty ?? ''] ?? ''}`}>
                        {DIFFICULTY_LABELS[q.difficulty ?? ''] ?? q.difficulty}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/teacher/questions/${q.id}/edit`}
                          className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Sửa"
                        >
                          <Pencil size={14} />
                        </Link>
                        <DeleteQuestionButton id={q.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BookOpen className="text-gray-200 dark:text-slate-700 mb-4" size={56} />
            <p className="font-black text-gray-400 text-lg">Chưa có câu hỏi nào</p>
            <p className="text-gray-300 dark:text-slate-600 text-sm font-medium mt-1 mb-6">
              {grade || subject || difficulty || type ? 'Không có kết quả với bộ lọc hiện tại.' : 'Bắt đầu xây dựng ngân hàng câu hỏi của bạn!'}
            </p>
            <Link
              href="/teacher/questions/new"
              className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-primary-dark transition-all hover:scale-105 shadow-lg shadow-primary/20"
            >
              + Thêm câu hỏi đầu tiên
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
