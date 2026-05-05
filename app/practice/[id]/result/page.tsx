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
  const { data: rawQuestions } = await supabase
    .from('exam_questions')
    .select(`
      id, order_index, type, correct_answer, correct_number, max_score, tf_answers,
      questions:question_id ( content, correct_answer, correct_number, question_tf_items ( label, content, is_correct ) )
    `)
    .eq('exam_id', id)
    .order('order_index')

  // Normalize for bank exams (where correct answers are in the linked questions table)
  const questions = (rawQuestions ?? []).map(q => ({
    ...q,
    correct_answer: q.correct_answer ?? (q.questions as any)?.correct_answer,
    correct_number: q.correct_number ?? (q.questions as any)?.correct_number,
    tf_answers: q.tf_answers ?? (q.questions as any)?.question_tf_items,
  }))

  return (
    <ResultView
      exam={exam}
      questions={questions}
      userId={user.id}
    />
  )
}
