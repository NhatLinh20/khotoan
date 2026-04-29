import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import QuestionManager from './QuestionManager'

const GRADE_LABELS: Record<string, string> = { '0': 'Lớp 10', '1': 'Lớp 11', '2': 'Lớp 12' }
const SUBJECT_LABELS: Record<string, string> = { D: 'Đại số', H: 'Hình học', C: 'Chuyên đề' }
const DIFFICULTY_LABELS: Record<string, string> = { N: 'Nhận biết', H: 'Thông hiểu', V: 'Vận dụng', C: 'VD Cao' }
const TYPE_LABELS: Record<string, string> = { mc: 'Trắc nghiệm', tf: 'Đúng/Sai', short: 'Trả lời ngắn', essay: 'Tự luận' }

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    grade?: string; subject?: string; difficulty?: string; type?: string; code?: string
  }>
}) {
  const params = await searchParams
  const { grade, subject, difficulty, type, code } = params

  const supabase = await createClient()
  let query = supabase
    .from('questions')
    .select('*, question_tf_items(*)')
    .order('created_at', { ascending: false })

  // Advanced ID Parsing logic for the 'code' parameter
  if (code) {
    const mainPart = code.split('-')[0]
    const formPart = code.split('-')[1]

    if (mainPart[0]) query = query.eq('grade_code', mainPart[0])
    if (mainPart[1]) query = query.eq('subject_type', mainPart[1])
    if (mainPart[2]) query = query.eq('chapter', parseInt(mainPart[2]))
    if (mainPart[3]) query = query.eq('difficulty', mainPart[3])
    if (mainPart[4]) query = query.eq('lesson', parseInt(mainPart[4]))
    if (formPart) query = query.eq('form', parseInt(formPart))
  } else {
    if (grade) query = query.eq('grade_code', grade)
    if (subject) query = query.eq('subject_type', subject)
    if (difficulty) query = query.eq('difficulty', difficulty)
    if (type) query = query.eq('type', type)
  }

  const { data: questions } = await query

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* Header & Main Search Area */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Hệ thống quản lý</p>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Ngân hàng <span className="text-primary">Câu hỏi</span></h1>
          </div>
          <Link
            href="/teacher/questions/new"
            className="flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-2xl font-black hover:bg-primary-dark transition-all hover:scale-105 shadow-xl shadow-primary/20 text-sm"
          >
            <Plus size={18} /> Thêm câu hỏi mới
          </Link>
        </div>

        {/* Smart Search & Filters Placeholder */}
        <QuestionManager questions={questions || []} initialParams={params} />
      </div>
    </div>
  )
}
