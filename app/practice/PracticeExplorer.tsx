'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { BookOpen, Clock, FileText, Database, ChevronRight, Search, SlidersHorizontal } from 'lucide-react'

const GRADE_OPTS = [6,7,8,9,10,11,12]
const SUBJECT_MAP: Record<string,string> = { D: 'Đại số', H: 'Hình học', C: 'Chuyên đề' }

type Exam = {
 id: string
 title: string
 grade: number
 subject: string
 duration_min: number
 exam_type: 'bank' | 'pdf'
 description: string | null
 question_count: number
}

export default function PracticeExplorer({ exams }: { exams: Exam[] }) {
 const [search, setSearch] = useState('')
 const [grade, setGrade] = useState<number | null>(null)
 const [subject, setSubject] = useState('')
 const [type, setType] = useState('')

 const filtered = useMemo(() => exams.filter(e => {
 if (grade && e.grade !== grade) return false
 if (subject && e.subject !== subject) return false
 if (type && e.exam_type !== type) return false
 if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false
 return true
 }), [exams, grade, subject, type, search])

 const hasFilter = grade || subject || type || search

 return (
 <div className="min-h-screen bg-neutral text-primary font-body">
 {/* Hero Banner */}
 <div className="bg-surface border-b border-secondary/20">
 <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
 <h1 className="text-2xl md:text-3xl font-display font-bold text-primary">
 Luyện thi <span className="text-tertiary italic">Toán học</span>
 </h1>
 <p className="text-secondary text-sm mt-1">
 {exams.length} đề thi đang mở — chọn đề và bắt đầu luyện tập ngay
 </p>
 </div>
 </div>

 <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-5">
 {/* Filter Bar */}
 <div className="bg-surface rounded-lg border border-secondary/20 shadow-sm p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
 <div className="relative w-full md:w-64 shrink-0">
 <input
 placeholder="Tìm đề thi..."
 value={search}
 onChange={e => setSearch(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 bg-neutral border border-secondary/20 rounded-md text-sm focus:ring-2 focus:ring-primary/20 font-medium outline-none text-primary placeholder-secondary/50"
 />
 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" size={16} />
 </div>
 <div className="flex flex-wrap items-center gap-2 w-full">
 <select value={subject} onChange={e => setSubject(e.target.value)}
 className="px-3 py-2 bg-neutral border border-secondary/20 rounded-md text-sm font-bold text-primary outline-none cursor-pointer">
 <option value="">Tất cả môn</option>
 {Object.entries(SUBJECT_MAP).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
 </select>
 <select value={type} onChange={e => setType(e.target.value)}
 className="px-3 py-2 bg-neutral border border-secondary/20 rounded-md text-sm font-bold text-primary outline-none cursor-pointer">
 <option value="">Tất cả loại</option>
 <option value="pdf">Đề PDF</option>
 <option value="bank">Ngân hàng câu hỏi</option>
 </select>
 <div className="w-px h-6 bg-secondary/20 mx-1 hidden md:block" />
 <div className="flex flex-wrap gap-1.5">
 {GRADE_OPTS.map(g => (
 <button key={g} onClick={() => setGrade(grade === g ? null : g)}
 className={`px-2.5 py-1.5 rounded-sm font-display text-[0.78rem] tracking-[0.14em] uppercase font-bold transition-all ${grade === g ? 'bg-primary text-surface' : 'bg-neutral text-secondary hover:bg-primary/10 hover:text-primary'}`}>
 Lớp {g}
 </button>
 ))}
 </div>
 {hasFilter && (
 <button onClick={() => { setGrade(null); setSubject(''); setType(''); setSearch('') }}
 className="px-2.5 py-1.5 text-[0.78rem] font-display font-bold text-tertiary uppercase tracking-[0.14em] bg-tertiary/10 hover:bg-tertiary/20 rounded-sm transition-colors">
 Xóa lọc ×
 </button>
 )}
 </div>
 </div>

 {/* Results count */}
 <p className="text-[0.95rem] font-bold text-primary px-1">
 {filtered.length} đề thi
 </p>

 {/* Exam List */}
 {filtered.length > 0 ? (
 <div className="flex flex-col gap-3">
 {filtered.map(exam => (
 <div key={exam.id}
 className="bg-surface rounded-lg border border-secondary/20 hover:border-primary/40 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center overflow-hidden group p-4 gap-4">
 
 {/* Left Info */}
 <div className="flex-1 min-w-0 flex flex-col gap-2">
 <div className="flex flex-wrap items-center gap-2">
 <span className="bg-primary text-surface text-[0.78rem] font-display font-bold px-2 py-0.5 rounded-sm uppercase tracking-[0.14em] shrink-0">
 Lớp {exam.grade}
 </span>
 <span className="bg-neutral text-secondary border border-secondary/20 text-[0.78rem] font-display font-bold px-2 py-0.5 rounded-sm shrink-0">
 {SUBJECT_MAP[exam.subject] ?? exam.subject}
 </span>
 <span className={`flex items-center gap-1 text-[0.78rem] font-display font-bold px-2 py-0.5 rounded-sm shrink-0 ${exam.exam_type === 'pdf' ? 'bg-secondary/10 text-secondary' : 'bg-tertiary/10 text-tertiary'}`}>
 {exam.exam_type === 'pdf' ? <FileText size={10} /> : <Database size={10} />}
 {exam.exam_type === 'pdf' ? 'PDF' : 'Ngân hàng'}
 </span>
 </div>
 
 <h2 className="text-[1.2rem] font-display font-semibold text-primary line-clamp-1 group-hover:text-tertiary transition-colors">
 {exam.title}
 </h2>
 {exam.description && (
 <p className="text-[0.95rem] text-secondary line-clamp-1">{exam.description}</p>
 )}
 </div>

 {/* Right Meta & Action */}
 <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t border-secondary/10 md:border-t-0 pt-3 md:pt-0">
 <div className="flex flex-row md:flex-col items-start gap-4 md:gap-1 text-[0.78rem] font-display font-bold text-secondary uppercase tracking-[0.14em]">
 <span className="flex items-center gap-1.5"><BookOpen size={12} className="text-secondary" /> {exam.question_count} câu</span>
 <span className="flex items-center gap-1.5"><Clock size={12} className="text-secondary" /> {exam.duration_min} phút</span>
 </div>
 <Link href={`/practice/${exam.id}`}
 className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-tertiary text-surface rounded-md font-display font-semibold hover:bg-tertiary/90 transition-all shadow-sm group-hover:scale-105 shrink-0">
 Bắt đầu <ChevronRight size={14} />
 </Link>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="py-24 text-center bg-surface rounded-lg border border-secondary/20">
 <SlidersHorizontal className="mx-auto mb-4 text-secondary/40" size={48} />
 <p className="text-[0.95rem] font-bold text-secondary">Không có đề thi phù hợp</p>
 <p className="text-[0.95rem] text-secondary/80 mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
 </div>
 )}
 </div>
 </div>
 )
}
