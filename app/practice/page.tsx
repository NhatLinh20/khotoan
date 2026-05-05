import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PracticeExplorer from './PracticeExplorer'

export const metadata = { title: 'Luyện thi - Kho Toán' }

export default async function PracticePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: exams } = await supabase
    .from('exams')
    .select('id, title, grade, subject, duration_min, exam_type, description, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // Fetch question counts per exam
  const examIds = (exams ?? []).map(e => e.id)
  let questionCounts: Record<string, number> = {}
  if (examIds.length > 0) {
    const { data: counts } = await supabase
      .from('exam_questions')
      .select('exam_id')
      .in('exam_id', examIds)
    if (counts) {
      counts.forEach(r => {
        questionCounts[r.exam_id] = (questionCounts[r.exam_id] ?? 0) + 1
      })
    }
  }

  const examsWithCount = (exams ?? []).map(e => ({
    ...e,
    question_count: questionCounts[e.id] ?? 0,
  }))

  return <PracticeExplorer exams={examsWithCount} />
}
