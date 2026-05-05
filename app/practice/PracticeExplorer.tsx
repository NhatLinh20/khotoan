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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Hero Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
            Luyện thi <span className="text-primary italic">Toán học</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {exams.length} đề thi đang mở — chọn đề và bắt đầu luyện tập ngay
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-5">
        {/* Filter Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="relative w-full md:w-64 shrink-0">
            <input
              placeholder="Tìm đề thi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 font-medium outline-none"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full">
            <select value={subject} onChange={e => setSubject(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 outline-none cursor-pointer">
              <option value="">Tất cả môn</option>
              {Object.entries(SUBJECT_MAP).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <select value={type} onChange={e => setType(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 outline-none cursor-pointer">
              <option value="">Tất cả loại</option>
              <option value="pdf">Đề PDF</option>
              <option value="bank">Ngân hàng câu hỏi</option>
            </select>
            <div className="w-px h-6 bg-gray-200 dark:bg-slate-700 mx-1 hidden md:block" />
            <div className="flex flex-wrap gap-1.5">
              {GRADE_OPTS.map(g => (
                <button key={g} onClick={() => setGrade(grade === g ? null : g)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${grade === g ? 'bg-primary text-white' : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary'}`}>
                  Lớp {g}
                </button>
              ))}
            </div>
            {hasFilter && (
              <button onClick={() => { setGrade(null); setSubject(''); setType(''); setSearch('') }}
                className="px-2.5 py-1.5 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 rounded-lg transition-colors">
                Xóa lọc ×
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <p className="text-base font-black text-gray-900 dark:text-white px-1">
          {filtered.length} đề thi
        </p>

        {/* Exam List */}
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filtered.map(exam => (
              <div key={exam.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col md:flex-row md:items-center overflow-hidden group p-4 gap-4">
                
                {/* Left Info */}
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                      Lớp {exam.grade}
                    </span>
                    <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      {SUBJECT_MAP[exam.subject] ?? exam.subject}
                    </span>
                    <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${exam.exam_type === 'pdf' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                      {exam.exam_type === 'pdf' ? <FileText size={10} /> : <Database size={10} />}
                      {exam.exam_type === 'pdf' ? 'PDF' : 'Ngân hàng'}
                    </span>
                  </div>
                  
                  <h2 className="text-sm font-black text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                    {exam.title}
                  </h2>
                  {exam.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{exam.description}</p>
                  )}
                </div>

                {/* Right Meta & Action */}
                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t border-gray-50 dark:border-slate-800 md:border-t-0 pt-3 md:pt-0">
                  <div className="flex flex-row md:flex-col items-start gap-4 md:gap-1 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><BookOpen size={12} className="text-gray-400" /> {exam.question_count} câu</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-gray-400" /> {exam.duration_min} phút</span>
                  </div>
                  <Link href={`/practice/${exam.id}`}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group-hover:scale-105 shrink-0">
                    Bắt đầu <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
            <SlidersHorizontal className="mx-auto mb-4 text-gray-200 dark:text-slate-700" size={48} />
            <p className="text-base font-black text-gray-400">Không có đề thi phù hợp</p>
            <p className="text-sm text-gray-400 mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}
      </div>
    </div>
  )
}
