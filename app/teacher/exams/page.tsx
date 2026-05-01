import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ExamListClient from './ExamListClient'

export const metadata = { title: 'Quản lý đề thi - Kho Toán' }

export default async function ExamsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: exams } = await supabase
    .from('exams')
    .select('*, exam_questions(count)')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Quản lý đề thi</h1>
          <p className="text-sm text-gray-500 mt-1">Tạo và quản lý đề kiểm tra từ ngân hàng câu hỏi hoặc file PDF</p>
        </div>
      </div>
      <ExamListClient initialExams={exams ?? []} />
    </div>
  )
}
