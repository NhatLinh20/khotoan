'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
 Plus, FileText, Database, Pencil, Trash2,
 Globe, EyeOff, ChevronRight, Clock, BookOpen,
 X, LayoutGrid
} from 'lucide-react'
import { deleteExam, publishExam } from '@/app/actions/exams'

type Exam = {
 id: string
 title: string
 grade: number | null
 subject: string | null
 duration_min: number | null
 exam_type: string
 is_published: boolean
 created_at: string
 exam_questions: { count: number }[]
}

const GRADE_LABEL: Record<number, string> = {
 6: 'Lớp 6', 7: 'Lớp 7', 8: 'Lớp 8', 9: 'Lớp 9',
 10: 'Lớp 10', 11: 'Lớp 11', 12: 'Lớp 12'
}
const SUBJECT_LABEL: Record<string, string> = {
 D: 'Đại số', H: 'Hình học', C: 'Chuyên đề'
}

export default function ExamListClient({ initialExams }: { initialExams: Exam[] }) {
 const router = useRouter()
 const [exams, setExams] = useState<Exam[]>(initialExams)
 const [showModal, setShowModal] = useState(false)
 const [isPending, startTransition] = useTransition()
 const [actionId, setActionId] = useState<string | null>(null)

 const handleDelete = (id: string, title: string) => {
 if (!confirm(`Xoá đề thi"${title}"?`)) return
 setActionId(id)
 startTransition(async () => {
 await deleteExam(id)
 setExams(prev => prev.filter(e => e.id !== id))
 setActionId(null)
 })
 }

 const handlePublish = (id: string, current: boolean) => {
 setActionId(id)
 startTransition(async () => {
 await publishExam(id, !current)
 setExams(prev => prev.map(e => e.id === id ? { ...e, is_published: !current } : e))
 setActionId(null)
 })
 }

 return (
 <>
 {/* Header actions */}
 <div className="flex justify-end">
 <button
 onClick={() => setShowModal(true)}
 className="inline-flex items-center gap-2 bg-primary text-surface px-4 py-2.5 rounded-md font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
 >
 <Plus size={16} /> Tạo đề mới
 </button>
 </div>

 {/* Table */}
 <div className="bg-surface rounded-md border border-secondary/20 overflow-hidden shadow-sm">
 {exams.length === 0 ? (
 <div className="py-20 text-center">
 <LayoutGrid size={40} className="mx-auto text-gray-200 mb-3" />
 <p className="text-secondary font-bold">Chưa có đề thi nào</p>
 <p className="text-secondary/80 text-sm mt-1">Bấm"Tạo đề mới" để bắt đầu</p>
 </div>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead>
 <tr className="bg-neutral/80 border-b border-secondary/20">
 <th className="px-4 py-3 text-left text-[11px] font-display font-bold text-secondary/80 uppercase tracking-wider">Tên đề</th>
 <th className="px-4 py-3 text-left text-[11px] font-display font-bold text-secondary/80 uppercase tracking-wider w-20">Lớp</th>
 <th className="px-4 py-3 text-left text-[11px] font-display font-bold text-secondary/80 uppercase tracking-wider w-24">Môn</th>
 <th className="px-4 py-3 text-center text-[11px] font-display font-bold text-secondary/80 uppercase tracking-wider w-20">Số câu</th>
 <th className="px-4 py-3 text-center text-[11px] font-display font-bold text-secondary/80 uppercase tracking-wider w-20">Phút</th>
 <th className="px-4 py-3 text-center text-[11px] font-display font-bold text-secondary/80 uppercase tracking-wider w-24">Loại</th>
 <th className="px-4 py-3 text-center text-[11px] font-display font-bold text-secondary/80 uppercase tracking-wider w-28">Trạng thái</th>
 <th className="px-4 py-3 text-center text-[11px] font-display font-bold text-secondary/80 uppercase tracking-wider w-36">Thao tác</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-50">
 {exams.map(exam => {
 const qCount = exam.exam_questions?.[0]?.count ?? 0
 const isLoading = actionId === exam.id && isPending
 return (
 <tr key={exam.id} className="hover:bg-neutral/50 :bg-slate-800/30 transition-colors">
 <td className="px-4 py-3">
 <Link
 href={`/teacher/exams/${exam.id}`}
 className="font-bold text-primary hover:text-primary transition-colors line-clamp-1"
 >
 {exam.title}
 </Link>
 <p className="text-[11px] text-secondary/80 mt-0.5">
 {new Date(exam.created_at).toLocaleDateString('vi-VN')}
 </p>
 </td>
 <td className="px-4 py-3 text-secondary text-xs font-bold">
 {exam.grade ? GRADE_LABEL[exam.grade] ??`Lớp ${exam.grade}` : '—'}
 </td>
 <td className="px-4 py-3 text-secondary text-xs font-bold">
 {exam.subject ? SUBJECT_LABEL[exam.subject] ?? exam.subject : '—'}
 </td>
 <td className="px-4 py-3 text-center">
 <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-700">
 <BookOpen size={12} /> {qCount}
 </span>
 </td>
 <td className="px-4 py-3 text-center">
 <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-700">
 <Clock size={12} /> {exam.duration_min ?? '—'}
 </span>
 </td>
 <td className="px-4 py-3 text-center">
 <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-display font-bold uppercase ${
 exam.exam_type === 'pdf'
 ? 'bg-orange-100 text-orange-700 '
 : 'bg-blue-100 text-blue-700 '
 }`}>
 {exam.exam_type === 'pdf' ? <FileText size={10} /> : <Database size={10} />}
 {exam.exam_type === 'pdf' ? 'PDF' : 'Ngân hàng'}
 </span>
 </td>
 <td className="px-4 py-3 text-center">
 <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-display font-bold uppercase ${
 exam.is_published
 ? 'bg-emerald-100 text-emerald-700 '
 : 'bg-neutral text-secondary '
 }`}>
 {exam.is_published ? <Globe size={10} /> : <EyeOff size={10} />}
 {exam.is_published ? 'Công bố' : 'Nháp'}
 </span>
 </td>
 <td className="px-4 py-3">
 <div className="flex items-center justify-center gap-1.5">
 <Link
 href={`/teacher/exams/${exam.id}/edit`}
 className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 :bg-blue-900/40 transition-colors"
 title="Sửa"
 >
 <Pencil size={13} />
 </Link>
 <button
 onClick={() => handlePublish(exam.id, exam.is_published)}
 disabled={isLoading}
 className={`p-1.5 rounded-lg transition-colors ${
 exam.is_published
 ? 'bg-neutral text-secondary hover:bg-gray-200 :bg-slate-600'
 : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 :bg-emerald-900/40'
 }`}
 title={exam.is_published ? 'Hủy công bố' : 'Công bố'}
 >
 {exam.is_published ? <EyeOff size={13} /> : <Globe size={13} />}
 </button>
 <button
 onClick={() => handleDelete(exam.id, exam.title)}
 disabled={isLoading}
 className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 :bg-red-900/40 transition-colors"
 title="Xóa"
 >
 <Trash2 size={13} />
 </button>
 </div>
 </td>
 </tr>
 )
 })}
 </tbody>
 </table>
 </div>
 )}
 </div>

 {/* Modal chọn loại */}
 {showModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
 <div className="relative bg-surface rounded-lg shadow-2xl p-8 max-w-md w-full border border-secondary/20">
 <button
 onClick={() => setShowModal(false)}
 className="absolute top-4 right-4 p-2 rounded-md text-secondary/80 hover:bg-neutral :bg-slate-800 transition-colors"
 >
 <X size={16} />
 </button>
 <h2 className="text-xl font-display font-bold text-primary mb-2">Tạo đề thi mới</h2>
 <p className="text-sm text-secondary mb-6">Chọn hình thức tạo đề phù hợp</p>

 <div className="grid gap-4">
 <Link
 href="/teacher/exams/new"
 onClick={() => setShowModal(false)}
 className="flex items-start gap-4 p-5 rounded-md border-2 border-blue-100 bg-blue-50 hover:border-blue-400 hover:bg-blue-100/70 :bg-blue-900/20 transition-all group"
 >
 <div className="w-12 h-12 rounded-md bg-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
 <Database size={22} className="text-surface" />
 </div>
 <div>
 <p className="font-display font-bold text-primary">Tạo từ ngân hàng câu hỏi</p>
 <p className="text-sm text-secondary mt-0.5">Chọn câu hỏi có sẵn từ kho đề, hệ thống tự chấm điểm</p>
 </div>
 <ChevronRight size={16} className="ml-auto self-center text-secondary/50 group-hover:text-blue-500 transition-colors" />
 </Link>

 <Link
 href="/teacher/exams/upload"
 onClick={() => setShowModal(false)}
 className="flex items-start gap-4 p-5 rounded-md border-2 border-orange-100 bg-orange-50 hover:border-orange-400 hover:bg-orange-100/70 :bg-orange-900/20 transition-all group"
 >
 <div className="w-12 h-12 rounded-md bg-orange-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
 <FileText size={22} className="text-surface" />
 </div>
 <div>
 <p className="font-display font-bold text-primary">Tạo nhanh từ file PDF</p>
 <p className="text-sm text-secondary mt-0.5">Upload đề PDF, nhập đáp án để hệ thống tự chấm</p>
 </div>
 <ChevronRight size={16} className="ml-auto self-center text-secondary/50 group-hover:text-orange-500 transition-colors" />
 </Link>
 </div>
 </div>
 </div>
 )}
 </>
 )
}
