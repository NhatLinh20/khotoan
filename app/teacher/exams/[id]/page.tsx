import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import {
 ArrowLeft, FileText, Database, Globe, EyeOff,
 Clock, BookOpen, Pencil, Download
} from 'lucide-react'
import ExamPublishButton from './ExamPublishButton'

const GRADE_LABEL: Record<number, string> = {
 6: 'Lớp 6', 7: 'Lớp 7', 8: 'Lớp 8', 9: 'Lớp 9',
 10: 'Lớp 10', 11: 'Lớp 11', 12: 'Lớp 12'
}
const SUBJECT_LABEL: Record<string, string> = { D: 'Đại số', H: 'Hình học', C: 'Chuyên đề' }
const TYPE_LABELS: Record<string, string> = {
 mc: 'Trắc nghiệm', tf: 'Đúng/Sai', short: 'Trả lời ngắn', essay: 'Tự luận'
}
const TYPE_COLORS: Record<string, string> = {
 mc: 'bg-blue-100 text-blue-700 ',
 tf: 'bg-violet-100 text-violet-700 ',
 short: 'bg-amber-100 text-amber-700 ',
 essay: 'bg-rose-100 text-rose-700 ',
}
const DIFF_COLORS: Record<string, string> = {
 N: 'bg-emerald-100 text-emerald-700 ',
 H: 'bg-blue-100 text-blue-700 ',
 V: 'bg-amber-100 text-amber-700 ',
 C: 'bg-red-100 text-red-700 ',
}

export default async function ExamDetailPage({
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
 .select('*, questions(question_code, type, difficulty, content)')
 .eq('exam_id', id)
 .order('order_index')

 const questions = examQs ?? []
 const totalScore = questions.reduce((s: number, q: any) => s + (q.max_score ?? 0), 0)

 // Stats for bank exams
 const typeCounts: Record<string, number> = {}
 const diffCounts: Record<string, number> = {}
 questions.forEach((q: any) => {
 const t = q.questions?.type ?? q.type ?? 'mc'
 const d = q.questions?.difficulty ?? ''
 typeCounts[t] = (typeCounts[t] ?? 0) + 1
 if (d) diffCounts[d] = (diffCounts[d] ?? 0) + 1
 })

 return (
 <div className="max-w-5xl mx-auto space-y-6">
 {/* Header */}
 <div className="flex items-center gap-3 flex-wrap">
 <Link href="/teacher/exams"
 className="p-2 rounded-md bg-neutral hover:bg-gray-200 :bg-slate-700 text-secondary transition-colors">
 <ArrowLeft size={16} />
 </Link>
 <div className="flex-1 min-w-0">
 <h1 className="text-xl font-display font-bold text-primary truncate">{exam.title}</h1>
 <p className="text-sm text-secondary mt-0.5">
 {GRADE_LABEL[exam.grade] ??`Lớp ${exam.grade}`} · {SUBJECT_LABEL[exam.subject] ?? exam.subject}
 </p>
 </div>
 <div className="flex items-center gap-2">
 <Link href={`/teacher/exams/${id}/edit`}
 className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-surface text-sm font-bold hover:bg-blue-700 transition-all shadow-sm">
 <Pencil size={14} /> Sửa đề
 </Link>
 <ExamPublishButton examId={id} isPublished={exam.is_published} />
 </div>
 </div>

 {/* Info cards */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 {[
 { icon: <Clock size={16} />, label: 'Thời gian', value:`${exam.duration_min} phút`, color: 'text-blue-500' },
 { icon: <BookOpen size={16} />, label: 'Số câu', value:`${questions.length} câu`, color: 'text-primary' },
 { icon: exam.exam_type === 'pdf' ? <FileText size={16} /> : <Database size={16} />, label: 'Loại đề', value: exam.exam_type === 'pdf' ? 'PDF' : 'Ngân hàng', color: 'text-orange-500' },
 { icon: exam.is_published ? <Globe size={16} /> : <EyeOff size={16} />, label: 'Trạng thái', value: exam.is_published ? 'Công bố' : 'Bản nháp', color: exam.is_published ? 'text-emerald-500' : 'text-secondary/80' },
].map(item => (
 <div key={item.label} className="bg-surface rounded-md border border-secondary/20 p-4 flex items-center gap-3">
 <div className={`w-9 h-9 rounded-md bg-neutral flex items-center justify-center ${item.color}`}>
 {item.icon}
 </div>
 <div>
 <p className="text-[10px] font-display font-bold text-secondary/80 uppercase tracking-widest">{item.label}</p>
 <p className="font-display font-bold text-primary text-sm">{item.value}</p>
 </div>
 </div>
 ))}
 </div>

 {/* Description */}
 {exam.description && (
 <div className="bg-surface rounded-md border border-secondary/20 p-5">
 <p className="text-[10px] font-display font-bold text-secondary/80 uppercase tracking-widest mb-1">Mô tả</p>
 <p className="text-sm text-secondary">{exam.description}</p>
 </div>
 )}

 {/* PDF exam */}
 {exam.exam_type === 'pdf' && exam.pdf_url && (
 <div className="bg-surface rounded-md border border-secondary/20 overflow-hidden">
 <div className="px-5 py-4 border-b border-secondary/20 flex items-center justify-between">
 <h2 className="font-display font-bold text-primary">File đề thi PDF</h2>
 <a href={exam.pdf_url} target="_blank" rel="noreferrer"
 className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-surface rounded-md text-xs font-bold hover:bg-orange-600 transition-all">
 <Download size={13} /> Tải xuống
 </a>
 </div>
 <iframe src={exam.pdf_url} className="w-full h-[500px] border-0" title="PDF Preview" />
 </div>
 )}

 {/* Bank exam: stats */}
 {exam.exam_type === 'bank' && questions.length > 0 && (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="bg-surface rounded-md border border-secondary/20 p-5">
 <h3 className="text-xs font-display font-bold text-secondary/80 uppercase tracking-widest mb-3">Phân bố loại câu</h3>
 <div className="space-y-2">
 {Object.entries(typeCounts).map(([t, n]) => (
 <div key={t} className="flex items-center gap-2">
 <span className={`text-[10px] font-display font-bold px-2 py-0.5 rounded w-20 text-center ${TYPE_COLORS[t]}`}>{TYPE_LABELS[t]}</span>
 <div className="flex-1 bg-neutral rounded-full h-2">
 <div className="bg-primary h-2 rounded-full transition-all" style={{ width:`${(n / questions.length) * 100}%` }} />
 </div>
 <span className="text-xs font-display font-bold text-secondary w-8 text-right">{n}</span>
 </div>
 ))}
 </div>
 </div>
 <div className="bg-surface rounded-md border border-secondary/20 p-5">
 <h3 className="text-xs font-display font-bold text-secondary/80 uppercase tracking-widest mb-3">Phân bố độ khó</h3>
 <div className="space-y-2">
 {Object.entries(diffCounts).map(([d, n]) => (
 <div key={d} className="flex items-center gap-2">
 <span className={`text-[10px] font-display font-bold px-2 py-0.5 rounded w-20 text-center ${DIFF_COLORS[d]}`}>
 {d === 'N' ? 'Nhận biết' : d === 'H' ? 'Thông hiểu' : d === 'V' ? 'Vận dụng' : 'VD cao'}
 </span>
 <div className="flex-1 bg-neutral rounded-full h-2">
 <div className="bg-primary h-2 rounded-full transition-all" style={{ width:`${(n / questions.length) * 100}%` }} />
 </div>
 <span className="text-xs font-display font-bold text-secondary w-8 text-right">{n}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 )}

 {/* Questions list */}
 <div className="bg-surface rounded-md border border-secondary/20 overflow-hidden">
 <div className="px-5 py-4 border-b border-secondary/20 flex items-center justify-between">
 <h2 className="font-display font-bold text-primary">
 {exam.exam_type === 'pdf' ? 'Danh sách đáp án' : 'Danh sách câu hỏi'}
 </h2>
 <span className="text-sm font-display font-bold text-primary bg-primary/10 px-3 py-1 rounded-md">
 Tổng: {totalScore.toFixed(2)} điểm
 </span>
 </div>
 {questions.length === 0 ? (
 <div className="py-12 text-center text-secondary/80 text-sm">Chưa có câu hỏi nào</div>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead>
 <tr className="bg-neutral/50 border-b border-secondary/20">
 <th className="px-4 py-2.5 text-left text-[10px] font-display font-bold text-secondary/80 uppercase w-12">STT</th>
 {exam.exam_type === 'bank' && (
 <th className="px-4 py-2.5 text-left text-[10px] font-display font-bold text-secondary/80 uppercase w-32">Mã ID</th>
 )}
 <th className="px-4 py-2.5 text-left text-[10px] font-display font-bold text-secondary/80 uppercase">
 {exam.exam_type === 'pdf' ? 'Đáp án' : 'Nội dung'}
 </th>
 <th className="px-4 py-2.5 text-center text-[10px] font-display font-bold text-secondary/80 uppercase w-28">Loại</th>
 {exam.exam_type === 'bank' && (
 <th className="px-4 py-2.5 text-center text-[10px] font-display font-bold text-secondary/80 uppercase w-24">Độ khó</th>
 )}
 <th className="px-4 py-2.5 text-center text-[10px] font-display font-bold text-secondary/80 uppercase w-20">Điểm</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-50">
 {questions.map((q: any, i: number) => {
 const qData = q.questions
 const type = qData?.type ?? q.type ?? 'mc'
 const diff = qData?.difficulty ?? ''
 return (
 <tr key={q.id} className="hover:bg-neutral/50 :bg-slate-800/20">
 <td className="px-4 py-2.5 text-center text-xs font-display font-bold text-secondary/80">{i + 1}</td>
 {exam.exam_type === 'bank' && (
 <td className="px-4 py-2.5">
 <span className="font-mono text-[11px] font-display font-bold text-secondary">
 {qData?.question_code ?? '—'}
 </span>
 </td>
 )}
 <td className="px-4 py-2.5">
 {exam.exam_type === 'bank' ? (
 <p className="text-xs text-gray-700 line-clamp-2">{qData?.content}</p>
 ) : (
 <span className="text-xs font-bold text-gray-700">
 {type === 'mc' &&`Đáp án đúng: ${q.correct_answer ?? '—'}`}
 {type === 'tf' && (
 <span className="flex gap-1.5">
 {(q.tf_answers ?? []).map((t: any) => (
 <span key={t.label} className={`px-1.5 py-0.5 rounded text-[9px] font-display font-bold ${t.is_correct ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
 {t.label.toUpperCase()}:{t.is_correct ? 'Đ' : 'S'}
 </span>
 ))}
 </span>
 )}
 {type === 'short' &&`Đáp số: ${q.correct_number ?? '—'}`}
 {type === 'essay' && 'Chấm thủ công'}
 </span>
 )}
 </td>
 <td className="px-4 py-2.5 text-center">
 <span className={`text-[9px] font-display font-bold px-1.5 py-0.5 rounded ${TYPE_COLORS[type]}`}>
 {TYPE_LABELS[type]}
 </span>
 </td>
 {exam.exam_type === 'bank' && (
 <td className="px-4 py-2.5 text-center">
 {diff ? (
 <span className={`text-[9px] font-display font-bold px-1.5 py-0.5 rounded ${DIFF_COLORS[diff]}`}>{diff}</span>
 ) : '—'}
 </td>
 )}
 <td className="px-4 py-2.5 text-center text-xs font-display font-bold text-primary">
 {(q.max_score ?? 0).toFixed(2)}
 </td>
 </tr>
 )
 })}
 </tbody>
 </table>
 </div>
 )}
 </div>
 </div>
 )
}
