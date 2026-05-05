import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PracticeSession from './PracticeSession'

export const metadata = { title: 'Làm bài thi - Kho Toán' }

export default async function PracticeExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch exam
  const { data: exam, error } = await supabase
    .from('exams')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single()

  if (error || !exam) redirect('/practice')

  // Fetch questions (with full bank question data if bank type)
  let questions: any[] = []
  if (exam.exam_type === 'bank') {
    const { data } = await supabase
      .from('exam_questions')
      .select(`
        id, order_index, type, correct_answer, correct_number, max_score, tf_answers,
        question_id,
        questions:question_id (
          content, image_url, option_a, option_b, option_c, option_d,
          question_tf_items ( label, content, is_correct )
        )
      `)
      .eq('exam_id', id)
      .order('order_index')
    
    // Map data to ensure 'questions' is an object, not an array
    questions = (data ?? []).map((q: any) => ({
      ...q,
      questions: Array.isArray(q.questions) ? q.questions[0] : q.questions
    }))
  } else {
    const { data } = await supabase
      .from('exam_questions')
      .select('id, order_index, type, correct_answer, correct_number, max_score, tf_answers')
      .eq('exam_id', id)
      .order('order_index')
    questions = data ?? []
  }

  return (
    <PracticeSession
      exam={exam}
      questions={questions}
      userId={user.id}
    />
  )
}
