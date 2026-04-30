'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookOpen, Users, Star, ChevronRight, Filter, LayoutGrid, Check, Search } from 'lucide-react'
import type { Course } from '@/lib/mock-data'

const GRADES = [6, 7, 8, 9, 10, 11, 12]

function formatPrice(price: number) {
  if (price === 0) return 'Miễn phí'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

function CourseCard({ course }: { course: Course }) {
  const stars = Math.round(course.rating)
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative h-32 bg-gradient-to-br from-primary/10 to-primary/20 overflow-hidden">
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
            <BookOpen className="text-primary/40 group-hover:text-primary/60 transition-colors" size={48} />
          </div>
        )}
        <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-black px-2.5 py-1 rounded-full tracking-wider uppercase shadow-lg">
          Lớp {course.grade}
        </div>
        <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 text-gray-700 dark:text-gray-200 text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
          {course.topic}
        </div>
        {course.price === 0 && (
          <div className="absolute bottom-2 right-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">
            Miễn phí
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="text-sm font-black text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {course.title}
        </h3>
        
        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[8px] font-black shrink-0">GV</span>
          {course.teacher_name}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < stars ? 'text-secondary fill-secondary' : 'text-gray-300 dark:text-gray-600'}
              />
            ))}
            <span className="text-[10px] font-bold text-gray-500 ml-1">{course.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
            <Users size={11} />
            {course.student_count.toLocaleString('vi-VN')}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-800 mt-auto">
          <span className={`text-base font-black ${course.price === 0 ? 'text-emerald-600' : 'text-primary'}`}>
            {formatPrice(course.price)}
          </span>
          <span className="text-[10px] font-bold text-primary flex items-center gap-0.5 group-hover:gap-1 transition-all">
            Chi tiết <ChevronRight size={12} />
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

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

  const FilterContent = () => (
    <div className="p-5 md:p-6 space-y-6">
      {/* Search within results */}
      <div className="relative">
        <input 
          type="text"
          placeholder="Tìm khóa học..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-xs focus:ring-2 focus:ring-primary/20 transition-all"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
      </div>

      {/* Cấp học */}
      <div className="space-y-3">
        <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Filter size={10} className="text-primary" /> Cấp học
        </h3>
        <div className="flex flex-col gap-0.5">
          {[
            { label: 'Tất cả cấp học', value: '' },
            { label: 'Trung học Cơ sở', value: 'THCS' },
            { label: 'Trung học Phổ thông', value: 'THPT' }
          ].map((lv) => (
            <button
              key={lv.value}
              onClick={() => {
                updateFilters({ level: lv.value })
                if (window.innerWidth < 768) setIsMobileFilterOpen(false)
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                level === lv.value
                  ? 'bg-primary/5 text-primary'
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              {lv.label}
              {level === lv.value && <Check size={14} className="text-primary" />}
            </button>
          ))}
        </div>
      </div>

      {/* Khối lớp */}
      <div className="space-y-3">
        <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <LayoutGrid size={10} className="text-primary" /> Khối lớp
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {(level === 'THCS' ? thcsGrades : level === 'THPT' ? thptGrades : GRADES).map((g) => (
            <button
              key={g}
              onClick={() => {
                updateFilters({ grade: grade === g ? null : g })
                if (window.innerWidth < 768) setIsMobileFilterOpen(false)
              }}
              className={`px-2 py-2 rounded-xl text-[11px] font-bold border-2 text-center transition-all ${
                grade === g
                  ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                  : 'bg-white dark:bg-slate-900 border-gray-50 dark:border-slate-800 text-gray-500 hover:border-primary/40'
              }`}
            >
              Lớp {g}
            </button>
          ))}
        </div>
      </div>



      {/* Reset All */}
      {(level || grade || searchQuery) && (
        <button 
          onClick={() => {
            setLevel('')
            setGrade(null)
            setSearchQuery('')
            router.push('/courses', { scroll: false })
            if (window.innerWidth < 768) setIsMobileFilterOpen(false)
          }}
          className="w-full py-3 text-center text-[9px] font-black text-red-500 uppercase tracking-[0.2em] border-2 border-red-50 border-dashed rounded-xl hover:bg-red-50 transition-colors"
        >
          Xoá bộ lọc ×
        </button>
      )}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col md:flex-row gap-8 items-start relative">
      
      {/* MOBILE FILTER BUTTON */}
      <div className="md:hidden w-full mb-6">
        <button 
          onClick={() => setIsMobileFilterOpen(true)}
          className="w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Filter size={20} />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Bộ lọc</p>
              <p className="text-[10px] font-bold text-gray-400">
                {level || 'Tất cả'} • Lớp {grade || '...'}
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-300" />
        </button>
      </div>

      {/* SIDEBAR: DESKTOP */}
      <aside className="hidden md:block w-80 shrink-0 sticky top-24 z-10">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <FilterContent />
        </div>
      </aside>

      {/* MOBILE FILTER OVERLAY (DRAWER) */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] md:hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-950 rounded-t-[3rem] max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-full duration-500 shadow-2xl">
            <div className="sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-8 py-6 border-b border-gray-100 dark:border-slate-900 flex items-center justify-between z-20">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Bộ lọc khóa học</h2>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500"
              >
                ×
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}

      {/* MAIN CONTENT: DANH SÁCH */}
      <main className="flex-1 w-full">
        <div className="flex items-center justify-between mb-8 px-2 md:px-0">
          <div className="flex flex-col gap-1">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Danh sách khóa học</h2>
            <p className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
              Hiển thị {filteredCourses.length} kết quả
            </p>
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="py-20 md:py-32 bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 dark:border-slate-800 text-center shadow-sm mx-2 md:mx-0">
            <BookOpen className="mx-auto mb-6 text-gray-200 dark:text-slate-800" size={64} />
            <h3 className="text-lg font-black text-gray-500 mb-2">Chưa có khóa học phù hợp</h3>
            <p className="text-sm text-gray-400 font-medium px-8">
              Không tìm thấy khóa học nào khớp với bộ lọc hiện tại.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
