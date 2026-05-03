'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookOpen, Users, Star, ChevronRight, Search, X } from 'lucide-react'
import type { Course } from '@/lib/mock-data'

const GRADES = [6, 7, 8, 9, 10, 11, 12]

function formatPrice(price: number) {
  if (price === 0) return 'Miễn phí'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-row h-28 sm:h-32 md:h-40"
    >
      {/* Thumbnail */}
      <div className="relative h-full w-28 sm:w-40 md:w-[240px] shrink-0 bg-gradient-to-br from-primary/10 to-primary/20 overflow-hidden">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="text-primary/40 group-hover:text-primary/60 transition-colors w-8 h-8 md:w-10 md:h-10" />
          </div>
        )}
        <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 bg-primary text-white text-[8px] md:text-[10px] font-black px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full tracking-wider uppercase shadow-md">
          Lớp {course.grade}
        </div>
        <div className="absolute bottom-1.5 left-1.5 md:top-2 md:right-2 md:bottom-auto md:left-auto bg-white/90 dark:bg-slate-900/90 text-gray-700 dark:text-gray-200 text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full backdrop-blur-sm shadow-sm">
          {course.topic}
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1 justify-center min-w-0">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 sm:gap-2 md:gap-4 flex-1">
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="text-sm md:text-base font-black text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors leading-snug">
              {course.title}
            </h3>
            <p className="text-[10px] sm:text-xs mt-1 md:mt-1.5 font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1 sm:gap-1.5">
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[8px] sm:text-[9px] font-black shrink-0">GV</span>
              <span className="truncate">{course.teacher_name}</span>
            </p>
          </div>
          
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0 mt-2 md:mt-0">
            <span className={`text-sm sm:text-base md:text-lg font-black leading-none ${course.price === 0 ? 'text-emerald-600' : 'text-primary'}`}>
              {formatPrice(course.price)}
            </span>
            <div className="flex items-center gap-1.5 sm:mt-1">
              <div className="flex items-center gap-0.5">
                <Star size={12} className="text-secondary fill-secondary" />
                <span className="text-[10px] font-bold text-gray-500">{course.rating.toFixed(1)}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                <Users size={12} />
                <span>{course.student_count.toLocaleString('vi-VN')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-end pt-3 border-t border-gray-100 dark:border-slate-800 mt-auto">
          <span className="text-[11px] font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
            Xem chi tiết <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function CourseExplorer({ initialCourses }: { initialCourses: Course[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [level, setLevel] = useState(searchParams.get('level') || '')
  const [grade, setGrade] = useState(searchParams.get('grade') ? parseInt(searchParams.get('grade')!) : null)
  const [searchQuery, setSearchQuery] = useState('')

  // Sync state with URL if it changes externally
  useEffect(() => {
    setLevel(searchParams.get('level') || '')
    setGrade(searchParams.get('grade') ? parseInt(searchParams.get('grade')!) : null)
  }, [searchParams])

  const updateFilters = (newFilters: { level?: string; grade?: number | null }) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if ('level' in newFilters) {
      if (newFilters.level) params.set('level', newFilters.level)
      else params.delete('level')
      params.delete('grade')
    }

    if ('grade' in newFilters) {
      if (newFilters.grade) params.set('grade', String(newFilters.grade))
      else params.delete('grade')
    }

    router.push(`/courses?${params.toString()}`, { scroll: false })
  }

  const filteredCourses = useMemo(() => {
    return initialCourses.filter((c) => {
      if (level === 'THCS' && (c.grade < 6 || c.grade > 9)) return false
      if (level === 'THPT' && (c.grade < 10 || c.grade > 12)) return false
      if (grade && c.grade !== grade) return false
      if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [initialCourses, level, grade, searchQuery])

  const thcsGrades = GRADES.filter((g) => g <= 9)
  const thptGrades = GRADES.filter((g) => g >= 10)

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-5 relative">
      
      {/* FILTER TOP BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-4 flex flex-col md:flex-row items-start md:items-center gap-4 z-10 sticky top-20">
        {/* Search */}
        <div className="relative w-full md:w-64 shrink-0">
          <input 
            type="text"
            placeholder="Tìm khóa học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>

        {/* Filters Row/Wrap */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full">
          <select 
            value={level}
            onChange={(e) => updateFilters({ level: e.target.value, grade: null })}
            className="w-full md:w-auto px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shrink-0"
          >
            <option value="">Tất cả cấp học</option>
            <option value="THCS">Trung học Cơ sở</option>
            <option value="THPT">Trung học Phổ thông</option>
          </select>

          <div className="hidden md:block w-px h-6 bg-gray-200 dark:bg-slate-700 shrink-0 mx-1"></div>

          <div className="flex flex-wrap items-center gap-1.5 w-full">
            {(level === 'THCS' ? thcsGrades : level === 'THPT' ? thptGrades : GRADES).map((g) => (
              <button
                key={g}
                onClick={() => updateFilters({ grade: grade === g ? null : g })}
                className={`px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all ${
                  grade === g
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                Lớp {g}
              </button>
            ))}

            {(level || grade || searchQuery) && (
              <button 
                onClick={() => {
                  setLevel('')
                  setGrade(null)
                  setSearchQuery('')
                  router.push('/courses', { scroll: false })
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 md:px-3 md:py-1.5 text-xs md:text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg md:rounded-xl transition-colors shrink-0"
                title="Xóa bộ lọc"
              >
                <X size={14} className="md:w-4 md:h-4" /> Xóa lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT: DANH SÁCH */}
      <main className="w-full">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex flex-col gap-0.5">
            <p className="text-base md:text-lg font-black text-gray-900 dark:text-white">
              Hiển thị {filteredCourses.length} khóa học
            </p>
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="flex flex-col gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="py-16 md:py-24 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 text-center shadow-sm">
            <BookOpen className="mx-auto mb-4 text-gray-200 dark:text-slate-800" size={48} />
            <h3 className="text-base font-black text-gray-500 mb-1">Chưa có khóa học phù hợp</h3>
            <p className="text-xs text-gray-400 font-medium px-8">
              Không tìm thấy khóa học nào khớp với bộ lọc hiện tại.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

