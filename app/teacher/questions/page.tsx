import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import QuestionManager from './QuestionManager'

export default async function QuestionsPage({
 searchParams,
}: {
 searchParams: Promise<{
 grade?: string; subject?: string; chapter?: string
 lesson?: string; difficulty?: string; form?: string
 type?: string; code?: string
 }>
}) {
 const params = await searchParams
 const { grade, subject, chapter, lesson, difficulty, form, type, code } = params

 const supabase = await createClient()
 let query = supabase
 .from('questions')
 .select('*, question_tf_items(*)')
 .order('created_at', { ascending: false })

 if (code) {
 // Smart ID search: parse character by character
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
 if (chapter) query = query.eq('chapter', parseInt(chapter))
 if (lesson) query = query.eq('lesson', parseInt(lesson))
 if (difficulty) query = query.eq('difficulty', difficulty)
 if (form) query = query.eq('form', parseInt(form))
 if (type) query = query.eq('type', type)
 }

 const { data: questions } = await query

 return (
 <div className="flex flex-col gap-4 max-w-7xl mx-auto pb-10">
 {/* Page Header */}
 <div className="flex items-center justify-between">
 <div>
 <p className="text-[10px] font-display font-bold text-primary uppercase tracking-widest mb-0.5">Hệ thống quản lý</p>
 <h1 className="text-2xl font-display font-bold text-primary tracking-tight">
 Ngân hàng <span className="text-primary">Câu hỏi</span>
 </h1>
 </div>
 <Link
 href="/teacher/questions/new"
 className="flex items-center gap-2 bg-primary text-surface px-5 py-2.5 rounded-md font-display font-bold hover:bg-primary-dark transition-all hover:scale-105 shadow-lg shadow-primary/20 text-xs"
 >
 <Plus size={14} /> Thêm câu hỏi mới
 </Link>
 </div>

 {/* 2-Column Layout */}
 <QuestionManager questions={questions || []} initialParams={params} />
 </div>
 )
}
