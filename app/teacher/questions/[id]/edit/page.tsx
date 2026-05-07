import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import QuestionForm from '@/components/QuestionForm'

export default async function EditQuestionPage({
 params,
}: {
 params: Promise<{ id: string }>
}) {
 const { id } = await params
 const supabase = await createClient()

 const { data: q, error } = await supabase
 .from('questions')
 .select('*')
 .eq('id', id)
 .single()

 if (error || !q) notFound()

 // Fetch TF items if applicable
 let tf_items: { label: string; content: string; is_correct: boolean }[] = []
 if (q.type === 'tf') {
 const { data } = await supabase
 .from('question_tf_items')
 .select('label, content, is_correct')
 .eq('question_id', id)
 .order('label')
 tf_items = data ?? []
 }

 const initialData = {
 id: q.id,
 question_code: q.question_code,
 grade_code: q.grade_code ?? '0',
 subject_type: q.subject_type ?? 'D',
 chapter: q.chapter ?? 1,
 difficulty: q.difficulty ?? 'N',
 lesson: q.lesson ?? 1,
 form: q.form ?? 1,
 type: q.type,
 content: q.content,
 image_url: q.image_url ?? null,
 option_a: q.option_a ?? null,
 option_b: q.option_b ?? null,
 option_c: q.option_c ?? null,
 option_d: q.option_d ?? null,
 correct_answer: q.correct_answer ?? null,
 correct_number: q.correct_number ?? null,
 solution_guide: q.solution_guide ?? null,
 max_score: q.max_score ?? null,
 tf_items,
 }

 return (
 <div className="flex flex-col gap-8">
 {/* Header */}
 <div>
 <Link
 href="/teacher/questions"
 className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline mb-4"
 >
 <ArrowLeft size={16} /> Quay lại ngân hàng
 </Link>
 <p className="text-xs font-display font-bold text-primary uppercase tracking-widest mb-1">Chỉnh sửa</p>
 <h1 className="text-3xl font-display font-bold text-primary">
 Sửa câu hỏi{' '}
 <code className="text-primary bg-primary/10 px-3 py-1 rounded-md text-2xl">
 {q.question_code}
 </code>
 </h1>
 <p className="text-secondary mt-2 font-medium">
 Lớp: {({'0': '10', '1': '11', '2': '12'} as Record<string,string>)[q.grade_code ?? ''] ?? '?'} · 
 Môn: {({D: 'Đại số', H: 'Hình học', C: 'Chuyên đề'} as Record<string,string>)[q.subject_type ?? ''] ?? '?'}
 </p>
 </div>

 <QuestionForm mode="edit" initialData={initialData} />
 </div>
 )
}
