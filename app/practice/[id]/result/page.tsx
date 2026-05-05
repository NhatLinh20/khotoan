import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ResultView from './ResultView'

export const metadata = { title: 'Kết quả thi - Kho Toán' }

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch exam
  const { data: exam } = await supabase
    .from('exams')
    .select('id, title, grade, subject, duration_min, exam_type')
    .eq('id', id)
    .single()

  if (!exam) redirect('/practice')

  // Fetch questions with correct answers
  const { data: questions } = await supabase
    .from('exam_questions')
    .select(`
      id, order_index, type, correct_answer, correct_number, max_score, tf_answers,
      questions:question_id ( content )
    `)
    .eq('exam_id', id)
    .order('order_index')

  return (
    <ResultView
      exam={exam}
      questions={questions ?? []}
      userId={user.id}
    />
  )
}
