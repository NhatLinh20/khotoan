'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ExamQuestion = {
 id?: string
 question_id?: string | null
 order_index: number
 type: string
 correct_answer?: string | null
 correct_number?: number | null
 max_score?: number | null
 tf_answers?: { label: string; is_correct: boolean }[] | null
}

export type ExamPayload = {
 examId?: string
 title: string
 description?: string
 grade: number
 subject: string
 duration_min: number
 exam_type: 'bank' | 'pdf'
 pdf_url?: string | null
 is_published?: boolean
 questions: ExamQuestion[]
}

export async function saveExam(payload: ExamPayload) {
 const supabase = await createClient()
 const { data: { user } } = await supabase.auth.getUser()
 if (!user) return { error: 'Chưa đăng nhập' }

 const { examId, questions, ...examData } = payload

 let finalExamId = examId

 if (examId) {
 const { error } = await supabase
 .from('exams')
 .update({ ...examData })
 .eq('id', examId)
 .eq('teacher_id', user.id)
 if (error) return { error: error.message }

 await supabase.from('exam_questions').delete().eq('exam_id', examId)
 } else {
 const { data, error } = await supabase
 .from('exams')
 .insert({ ...examData, teacher_id: user.id })
 .select('id')
 .single()
 if (error) return { error: error.message }
 finalExamId = data.id
 }

 if (questions.length > 0 && finalExamId) {
 const rows = questions.map((q, i) => ({
 exam_id: finalExamId,
 question_id: q.question_id ?? null,
 order_index: i + 1,
 type: q.type,
 correct_answer: q.correct_answer ?? null,
 correct_number: q.correct_number ?? null,
 max_score: q.max_score ?? null,
 tf_answers: q.tf_answers ?? null,
 }))
 const { error } = await supabase.from('exam_questions').insert(rows)
 if (error) return { error: error.message }
 }

 revalidatePath('/teacher/exams')
 return { success: true, examId: finalExamId }
}

export async function publishExam(examId: string, publish: boolean) {
 const supabase = await createClient()
 const { data: { user } } = await supabase.auth.getUser()
 if (!user) return { error: 'Chưa đăng nhập' }

 const { error } = await supabase
 .from('exams')
 .update({ is_published: publish })
 .eq('id', examId)
 .eq('teacher_id', user.id)

 if (error) return { error: error.message }
 revalidatePath('/teacher/exams')
 return { success: true }
}

export async function deleteExam(examId: string) {
 const supabase = await createClient()
 const { data: { user } } = await supabase.auth.getUser()
 if (!user) return { error: 'Chưa đăng nhập' }

 const { error } = await supabase
 .from('exams')
 .delete()
 .eq('id', examId)
 .eq('teacher_id', user.id)

 if (error) return { error: error.message }
 revalidatePath('/teacher/exams')
 return { success: true }
}
