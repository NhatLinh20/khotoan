'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export type TfItem = { label: 'a' | 'b' | 'c' | 'd'; content: string; is_correct: boolean }

export async function saveQuestion(formData: FormData) {
 const supabase = await createClient()

 const question_code = formData.get('question_code') as string
 const grade_code = formData.get('grade_code') as string
 const subject_type = formData.get('subject_type') as string
 const chapter = parseInt(formData.get('chapter') as string)
 const difficulty = formData.get('difficulty') as string
 const lesson = parseInt(formData.get('lesson') as string)
 const form = parseInt(formData.get('form') as string)
 const type = formData.get('type') as string
 const content = formData.get('content') as string
 const image_url = (formData.get('image_url') as string) || null

 // Type-specific fields
 const option_a = (formData.get('option_a') as string) || null
 const option_b = (formData.get('option_b') as string) || null
 const option_c = (formData.get('option_c') as string) || null
 const option_d = (formData.get('option_d') as string) || null
 const correct_answer = (formData.get('correct_answer') as string) || null
 const correct_number_raw = formData.get('correct_number') as string
 const correct_number = correct_number_raw ? parseFloat(correct_number_raw) : null
 const solution_guide = (formData.get('solution_guide') as string) || null
 const max_score_raw = formData.get('max_score') as string
 const max_score = max_score_raw ? parseFloat(max_score_raw) : null

 const { data: question, error } = await supabase
 .from('questions')
 .insert({
 question_code,
 grade_code,
 subject_type,
 chapter,
 difficulty,
 lesson,
 form,
 type,
 content,
 image_url,
 option_a,
 option_b,
 option_c,
 option_d,
 correct_answer,
 correct_number,
 solution_guide,
 max_score,
 })
 .select('id')
 .single()

 if (error) return { error: error.message }

 // Insert tf items
 if (type === 'tf' && question) {
 const items: TfItem[] = (['a', 'b', 'c', 'd'] as const).map((label) => ({
 label,
 content: (formData.get(`tf_content_${label}`) as string) ?? '',
 is_correct: formData.get(`tf_correct_${label}`) === 'true',
 }))
 const { error: tfError } = await supabase
 .from('question_tf_items')
 .insert(items.map((i) => ({ ...i, question_id: question.id })))
 if (tfError) return { error: tfError.message }
 }

 await revalidatePath('/teacher/questions')
 redirect('/teacher/questions')
}

export async function updateQuestion(id: string, formData: FormData) {
 const supabase = await createClient()

 const type = formData.get('type') as string
 const content = formData.get('content') as string
 const difficulty = formData.get('difficulty') as string
 const image_url = (formData.get('image_url') as string) || null
 const option_a = (formData.get('option_a') as string) || null
 const option_b = (formData.get('option_b') as string) || null
 const option_c = (formData.get('option_c') as string) || null
 const option_d = (formData.get('option_d') as string) || null
 const correct_answer = (formData.get('correct_answer') as string) || null
 const correct_number_raw = formData.get('correct_number') as string
 const correct_number = correct_number_raw ? parseFloat(correct_number_raw) : null
 const solution_guide = (formData.get('solution_guide') as string) || null
 const max_score_raw = formData.get('max_score') as string
 const max_score = max_score_raw ? parseFloat(max_score_raw) : null

 const { error } = await supabase
 .from('questions')
 .update({
 content, difficulty, image_url,
 option_a, option_b, option_c, option_d, correct_answer,
 correct_number, solution_guide, max_score,
 })
 .eq('id', id)

 if (error) return { error: error.message }

 // Update tf items: delete old, insert new
 if (type === 'tf') {
 await supabase.from('question_tf_items').delete().eq('question_id', id)
 const items = (['a', 'b', 'c', 'd'] as const).map((label) => ({
 label,
 question_id: id,
 content: (formData.get(`tf_content_${label}`) as string) ?? '',
 is_correct: formData.get(`tf_correct_${label}`) === 'true',
 }))
 await supabase.from('question_tf_items').insert(items)
 }

 await revalidatePath('/teacher/questions')
 redirect('/teacher/questions')
}

export async function deleteQuestion(id: string) {
 const supabase = await createClient()
 await supabase.from('questions').delete().eq('id', id)
 await revalidatePath('/teacher/questions')
}
