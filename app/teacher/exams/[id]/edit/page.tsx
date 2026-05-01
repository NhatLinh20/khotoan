import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import ExamBankBuilder from '../../ExamBankBuilder'
import ExamPdfBuilder from '../../ExamPdfBuilder'

export const metadata = { title: 'Sửa đề thi - Kho Toán' }

export default async function EditExamPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: exam } = await supabase
    .from('exams')
    .select('*')
    .eq('id', id)
    .eq('teacher_id', user.id)
    .single()

  if (!exam) notFound()

  const { data: examQs } = await supabase
    .from('exam_questions')
    .select('*, questions(id, question_code, type, difficulty, content, max_score)')
    .eq('exam_id', id)
    .order('order_index')

  const questions = (examQs ?? []).map((eq: any) => ({
    id: eq.questions?.id ?? '',
    question_code: eq.questions?.question_code ?? '',
    type: eq.questions?.type ?? eq.type ?? 'mc',
    difficulty: eq.questions?.difficulty ?? '',
    content: eq.questions?.content ?? '',
    max_score: eq.max_score ?? eq.questions?.max_score ?? 1,
    _uid: eq.id,
    // pdf fields
    correct_answer: eq.correct_answer,
    correct_number: eq.correct_number,
    tf_answers: eq.tf_answers,
  }))

  if (exam.exam_type === 'pdf') {
    return (
      <ExamPdfBuilder
        initialExamId={id}
        initialData={{
          title: exam.title,
          description: exam.description ?? '',
          grade: exam.grade,
          subject: exam.subject,
          duration_min: exam.duration_min,
          pdfUrl: exam.pdf_url ?? '',
          answers: questions.map((q: any) => ({
            _uid: q._uid,
            type: q.type,
            correct_answer: q.correct_answer ?? 'A',
            correct_number: q.correct_number ? String(q.correct_number) : '',
            max_score: String(q.max_score ?? 1),
            tf_answers: q.tf_answers ?? [
              { label: 'a', is_correct: false }, { label: 'b', is_correct: false },
              { label: 'c', is_correct: false }, { label: 'd', is_correct: false },
            ],
          })),
        }}
      />
    )
  }

  return (
    <ExamBankBuilder
      initialExamId={id}
      initialData={{
        title: exam.title,
        description: exam.description ?? '',
        grade: exam.grade,
        subject: exam.subject,
        duration_min: exam.duration_min,
        questions,
      }}
    />
  )
}
