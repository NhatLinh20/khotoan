'use client'

import { useState, useTransition, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ArrowLeft, GripVertical, Loader2, X } from 'lucide-react'
import Link from 'next/link'
import { saveCourse } from '@/app/actions/courses'
import { getChapters, getLessons } from '@/lib/math-taxonomy'

// ── PDF multi-entry helpers ──────────────────────────────────────────
type PdfEntry = { label: string; url: string }

function parsePdfEntries(raw: string): PdfEntry[] {
 if (!raw) return [{ label: '', url: '' }]
 const entries = raw.split('\n').map(s => s.trim()).filter(Boolean).map(line => {
 const sep = line.indexOf('|')
 if (sep > 0) return { label: line.slice(0, sep).trim(), url: line.slice(sep + 1).trim() }
 return { label: '', url: line }
 })
 return entries.length > 0 ? entries : [{ label: '', url: '' }]
}

function serializePdfEntries(entries: PdfEntry[]): string {
 return entries.filter(e => e.url.trim()).map(e => {
 const label = e.label.trim()
 const url = e.url.trim()
 return label ?`${label} | ${url}` : url
 }).join('\n')
}

function PdfUrlsEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
 const [entries, setEntries] = useState<PdfEntry[]>(() => parsePdfEntries(value))

 const update = useCallback((next: PdfEntry[]) => {
 setEntries(next)
 onChange(serializePdfEntries(next))
 }, [onChange])

 const handleChange = (i: number, field: keyof PdfEntry, val: string) => {
 const next = entries.map((e, idx) => idx === i ? { ...e, [field]: val } : e)
 update(next)
 }

 const handleAdd = () => update([...entries, { label: '', url: '' }])

 const handleRemove = (i: number) => {
 const next = entries.filter((_, idx) => idx !== i)
 update(next.length > 0 ? next : [{ label: '', url: '' }])
 }

 return (
 <div className="flex flex-col gap-1.5">
 {entries.map((entry, i) => (
 <div key={i} className="flex gap-1 items-start">
 <div className="flex flex-col gap-1 flex-1">
 <input
 type="text"
 value={entry.label}
 onChange={e => handleChange(i, 'label', e.target.value)}
 className="w-full px-2 py-1 rounded border border-secondary/20 bg-transparent text-primary outline-none focus:border-primary text-[10px] placeholder:text-secondary/80"
 placeholder="Tên file (vd: Bài học)"
 />
 <input
 type="text"
 value={entry.url}
 onChange={e => handleChange(i, 'url', e.target.value)}
 className="w-full px-2 py-1 rounded border border-secondary/20 bg-transparent text-primary outline-none focus:border-primary text-[10px] placeholder:text-secondary/80"
 placeholder="Link Drive..."
 />
 </div>
 {entries.length > 1 && (
 <button
 type="button"
 onClick={() => handleRemove(i)}
 className="mt-1 p-1 rounded text-secondary/80 hover:text-red-500 hover:bg-red-50 :bg-red-900/20 transition-colors shrink-0"
 >
 <X size={12} />
 </button>
 )}
 </div>
 ))}
 <button
 type="button"
 onClick={handleAdd}
 className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors mt-0.5"
 >
 <Plus size={11} /> Thêm file PDF
 </button>
 </div>
 )
}

type LessonInput = {
 _tempId?: string
 id?: string
 title: string
 video_url: string
 pdf_url: string
 duration_minutes: number
 order_index: number
 chapter?: number
 lesson_ref?: number
}

type CourseInput = {
 title: string
 description: string
 grade: number
 topic: string
 price: number
 thumbnail_url: string
 teacher_name: string
}

export default function CourseForm({ 
 initialCourse, 
 initialLessons = [], 
 courseId 
}: { 
 initialCourse?: Partial<CourseInput>, 
 initialLessons?: LessonInput[],
 courseId?: string 
}) {
 const router = useRouter()
 const [isPending, startTransition] = useTransition()
 const [error, setError] = useState<string | null>(null)

 const [course, setCourse] = useState<CourseInput>({
 title: initialCourse?.title || '',
 description: initialCourse?.description || '',
 grade: initialCourse?.grade || 10,
 topic: initialCourse?.topic || 'D',
 price: initialCourse?.price || 0,
 thumbnail_url: initialCourse?.thumbnail_url || '',
 teacher_name: initialCourse?.teacher_name || '',
 })

 // Mapping for taxonomy
 const gradeCode = course.grade === 10 ? '0' : course.grade === 11 ? '1' : course.grade === 12 ? '2' : String(course.grade)
 const subjectCode = !course.topic ? 'ALL' : (course.topic === 'D' || course.topic === 'Đại số' ? 'D' : course.topic === 'H' || course.topic === 'Hình học' ? 'H' : 'C')

 const availableChapters = useMemo(() => getChapters(gradeCode, subjectCode), [gradeCode, subjectCode])
 
 const [selectedChapter, setSelectedChapter] = useState<number>(
 initialLessons.length > 0 && initialLessons[0].chapter ? initialLessons[0].chapter : 0
 )

 const suggestedLessons = useMemo(() => {
 if (!selectedChapter) return []
 return getLessons(gradeCode, subjectCode, selectedChapter)
 }, [gradeCode, subjectCode, selectedChapter])

 const [lessons, setLessons] = useState<LessonInput[]>(() => {
 if (initialLessons.length > 0) {
 return initialLessons.map(l => ({ ...l, _tempId: Math.random().toString() })).sort((a, b) => a.order_index - b.order_index)
 }
 return []
 })

 const handleAddLesson = () => {
 setLessons([
 ...lessons,
 {
 _tempId: Math.random().toString(),
 title: '',
 video_url: '',
 pdf_url: '',
 duration_minutes: 0,
 order_index: lessons.length + 1,
 chapter: selectedChapter,
 lesson_ref: 0
 },
])
 }

 const handleRemoveLesson = (tempId: string) => {
 if (!window.confirm("Bạn có chắc muốn xóa không?")) return;
 const newLessons = lessons.filter(l => l._tempId !== tempId)
 newLessons.forEach((l, i) => {
 l.order_index = i + 1
 })
 setLessons(newLessons)
 }

 const handleLessonChange = (tempId: string, field: keyof LessonInput, value: any) => {
 setLessons(lessons.map(l => l._tempId === tempId ? { ...l, [field]: value } : l))
 }

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setError(null)

 if (!course.title) {
 setError('Vui lòng nhập tên khóa học')
 return
 }

 startTransition(async () => {
 try {
 const payload = {
 courseId,
 course,
 lessons: lessons
 }

 await saveCourse(payload)

 router.push('/teacher/courses')
 router.refresh()
 } catch (err: any) {
 setError(err.message)
 }
 })
 }

 return (
 <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl mx-auto text-[13px]">
 {/* Header */}
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
 <div className="flex items-center gap-3">
 <Link
 href="/teacher/courses"
 className="p-1.5 rounded-lg bg-neutral hover:bg-gray-200 :bg-slate-700 text-secondary transition-colors"
 >
 <ArrowLeft size={16} />
 </Link>
 <div>
 <h1 className="text-xl font-display font-bold text-primary">
 {courseId ? 'Sửa khóa học' : 'Tạo khóa học mới'}
 </h1>
 </div>
 </div>
 <button
 type="submit"
 disabled={isPending}
 className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-surface px-4 py-2 rounded-lg text-[13px] font-bold shadow-sm transition-all disabled:opacity-50"
 >
 {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
 Lưu khóa học
 </button>
 </div>

 {error && (
 <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-100">
 {error}
 </div>
 )}

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
 {/* Course Info */}
 <div className="lg:col-span-3 space-y-4">
 <div className="bg-surface p-4 rounded-md border border-secondary/20 shadow-sm space-y-3">
 <h2 className="text-sm font-display font-bold text-primary mb-2">Thông tin chung</h2>
 
 <div>
 <label className="block text-[11px] font-bold text-gray-700 mb-1">Tên khóa học</label>
 <input
 type="text"
 required
 value={course.title}
 onChange={e => setCourse({ ...course, title: e.target.value })}
 className="w-full px-3 py-2 rounded-lg border border-secondary/20 bg-neutral text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-[13px]"
 placeholder="VD: Toán 10 - Chương 1..."
 />
 </div>

 <div>
 <label className="block text-[11px] font-bold text-gray-700 mb-1">Mô tả khóa học</label>
 <textarea
 value={course.description}
 onChange={e => setCourse({ ...course, description: e.target.value })}
 rows={2}
 className="w-full px-3 py-2 rounded-lg border border-secondary/20 bg-neutral text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none text-[13px]"
 placeholder="Mô tả chi tiết về khóa học..."
 />
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-[11px] font-bold text-gray-700 mb-1">Cấp 1 - Khối lớp</label>
 <select
 value={course.grade}
 onChange={e => setCourse({ ...course, grade: Number(e.target.value) })}
 className="w-full px-3 py-2 rounded-lg border border-secondary/20 bg-neutral text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none text-[13px]"
 >
 <option value={6}>Lớp 6</option>
 <option value={7}>Lớp 7</option>
 <option value={8}>Lớp 8</option>
 <option value={9}>Lớp 9</option>
 <option value={10}>Lớp 10</option>
 <option value={11}>Lớp 11</option>
 <option value={12}>Lớp 12</option>
 </select>
 </div>
 <div>
 <label className="block text-[11px] font-bold text-gray-700 mb-1">Cấp 2 - Môn</label>
 <select
 value={course.topic}
 onChange={e => {
 setCourse({ ...course, topic: e.target.value })
 setSelectedChapter(0)
 }}
 className="w-full px-3 py-2 rounded-lg border border-secondary/20 bg-neutral text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none text-[13px]"
 >
 <option value="">Tất cả các môn</option>
 <option value="D">Đại số & Thống kê</option>
 <option value="H">Hình học</option>
 <option value="C">Chuyên đề</option>
 </select>
 </div>
 </div>

 <div>
 <label className="block text-[11px] font-bold text-gray-700 mb-1">Giáo viên</label>
 <input
 type="text"
 value={course.teacher_name}
 onChange={e => setCourse({ ...course, teacher_name: e.target.value })}
 className="w-full px-3 py-2 rounded-lg border border-secondary/20 bg-neutral text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-[13px]"
 placeholder="VD: Thầy Nguyễn Văn A"
 />
 </div>

 <div>
 <label className="block text-[11px] font-bold text-gray-700 mb-1">Giá (VNĐ)</label>
 <input
 type="number"
 min="0"
 step="1000"
 value={course.price}
 onChange={e => setCourse({ ...course, price: Number(e.target.value) })}
 className="w-full px-3 py-2 rounded-lg border border-secondary/20 bg-neutral text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-[13px]"
 placeholder="0 = Miễn phí"
 />
 </div>

 <div>
 <label className="block text-[11px] font-bold text-gray-700 mb-1">Ảnh bìa (URL)</label>
 <input
 type="text"
 value={course.thumbnail_url}
 onChange={e => setCourse({ ...course, thumbnail_url: e.target.value })}
 className="w-full px-3 py-2 rounded-lg border border-secondary/20 bg-neutral text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-[13px]"
 placeholder="https://..."
 />
 {course.thumbnail_url && (
 <div className="mt-2 relative w-full aspect-video rounded-lg overflow-hidden border border-secondary/20">
 <img src={course.thumbnail_url} alt="Thumbnail preview" className="w-full h-full object-cover" />
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Lessons List */}
 <div className="lg:col-span-9 space-y-3">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3 rounded-md border border-secondary/20 shadow-sm">
 <div className="flex items-center gap-3 flex-1">
 <label className="text-[12px] font-display font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
 Cấp 3 - Chọn Chương:
 </label>
 <select
 value={selectedChapter}
 onChange={e => setSelectedChapter(Number(e.target.value))}
 className="flex-1 max-w-sm px-3 py-2 rounded-lg border border-secondary/20 bg-neutral text-primary outline-none appearance-none text-[13px] font-bold"
 >
 <option value={0}>- Chọn chương -</option>
 {availableChapters.map(c => (
 <option key={c.value} value={c.value}>
 {!course.topic ?`[${c.subject}] ${c.label}` : c.label}
 </option>
 ))}
 </select>
 </div>
 <button
 type="button"
 onClick={handleAddLesson}
 className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-2 rounded-lg text-[13px] font-bold hover:bg-primary/20 transition-colors whitespace-nowrap"
 >
 <Plus size={16} />
 Thêm bài học
 </button>
 </div>

 <datalist id="lesson-suggestions">
 {suggestedLessons.map(l => (
 <option key={l.value} value={`§${l.value}. ${l.label}`} />
 ))}
 </datalist>

 <div className="bg-surface rounded-md border border-secondary/20 overflow-hidden shadow-sm">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse text-[12px]">
 <thead>
 <tr className="bg-neutral/50">
 <th className="px-3 py-3 text-[10px] font-display font-bold text-secondary uppercase w-8">#</th>
 <th className="px-3 py-3 text-[10px] font-display font-bold text-secondary uppercase min-w-[250px]">Cấp 4 - Bài § và Tên bài</th>
 <th className="px-3 py-3 text-[10px] font-display font-bold text-secondary uppercase w-[150px]">Video URL</th>
 <th className="px-3 py-3 text-[10px] font-display font-bold text-secondary uppercase w-[180px]">File PDF
 <span className="block text-[9px] font-medium text-secondary/80 normal-case tracking-normal">Tên hiển thị + Link</span>
 </th>
 <th className="px-3 py-3 text-[10px] font-display font-bold text-secondary uppercase w-[70px] text-center">Phút</th>
 <th className="px-3 py-3 w-12 text-center">Xóa</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100">
 {lessons.filter(l => l.chapter === selectedChapter).map((lesson, index) => (
 <tr key={lesson._tempId} className="hover:bg-neutral/50 :bg-slate-800/20">
 <td className="px-3 py-2 text-center text-secondary/80 cursor-move">
 <GripVertical size={14} className="mx-auto" />
 </td>
 <td className="px-3 py-2">
 <input
 type="text"
 required
 list="lesson-suggestions"
 value={lesson.title}
 onChange={e => handleLessonChange(lesson._tempId!, 'title', e.target.value)}
 className="w-full px-3 py-2 rounded-lg border border-secondary/20 bg-transparent text-primary outline-none focus:border-primary font-medium"
 placeholder="VD: §1. Mệnh đề..."
 />
 </td>
 <td className="px-3 py-2">
 <input
 type="text"
 value={lesson.video_url}
 onChange={e => handleLessonChange(lesson._tempId!, 'video_url', e.target.value)}
 className="w-full px-3 py-2 rounded-lg border border-secondary/20 bg-transparent text-primary outline-none focus:border-primary"
 placeholder="Link YouTube..."
 />
 </td>
 <td className="px-3 py-2 align-top">
 <PdfUrlsEditor
 value={lesson.pdf_url}
 onChange={v => handleLessonChange(lesson._tempId!, 'pdf_url', v)}
 />
 </td>
 <td className="px-3 py-2">
 <input
 type="number"
 min="0"
 value={lesson.duration_minutes}
 onChange={e => handleLessonChange(lesson._tempId!, 'duration_minutes', Number(e.target.value))}
 className="w-full px-3 py-2 rounded-lg border border-secondary/20 bg-transparent text-primary outline-none focus:border-primary text-center"
 />
 </td>
 <td className="px-3 py-2 text-center">
 <button
 type="button"
 onClick={() => handleRemoveLesson(lesson._tempId!)}
 className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 :bg-red-900/40 transition-colors mx-auto"
 title="Xoá bài học"
 >
 <Trash2 size={14} />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>

 {lessons.filter(l => l.chapter === selectedChapter).length === 0 && (
 <div className="text-center py-10">
 <p className="text-[13px] text-secondary font-medium">Chưa có bài học nào. Chọn Chương và ấn"Thêm bài học" nhé!</p>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 </form>
 )
}
