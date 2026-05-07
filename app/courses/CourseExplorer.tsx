'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookOpen, Users, Star, ChevronRight, Search, X, Filter, ChevronDown, User } from 'lucide-react'
import type { Course } from '@/lib/mock-data'

const GRADES = [6, 7, 8, 9, 10, 11, 12]

const EXAM_TYPES = [
  { value: 'giua_ki_1', label: 'Giữa kì 1' },
  { value: 'cuoi_ki_1', label: 'Cuối kì 1' },
  { value: 'giua_ki_2', label: 'Giữa kì 2' },
  { value: 'cuoi_ki_2', label: 'Cuối kì 2' },
  { value: 'tuyen_sinh_10', label: 'Tuyển sinh lớp 10' },
  { value: 'thpt_qg', label: 'Thi THPT Quốc gia' },
]

function formatPrice(price: number) {
  if (price === 0) return 'Miễn phí'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

function getExamTypeLabel(type?: string) {
  return EXAM_TYPES.find(t => t.value === type)?.label || 'Khác'
}



function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 hover:border-primary/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(24,95,165,0.1)] transition-all duration-300 flex flex-col hover:-translate-y-1 h-full"
    >
      {/* Thumbnail (16:9) */}
      <div className="relative w-full aspect-video bg-gradient-to-br from-primary/10 to-primary/30 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 pointer-events-none" />
        
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="text-white/40 group-hover:text-white/60 transition-colors w-12 h-12 z-0" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
          <div className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full tracking-wider uppercase shadow-md">
            Lớp {course.grade}
          </div>
        </div>
        {course.exam_type && course.exam_type !== 'other' && (
          <div className="absolute top-3 right-3 z-20">
            <div className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              {getExamTypeLabel(course.exam_type)}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 md:p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-base font-black text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors leading-snug mb-3">
          {course.title}
        </h3>
        
        {/* Teacher */}
        <div className="flex items-center gap-2 mb-3 mt-auto">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User size={12} className="text-primary" />
          </div>
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 truncate">
            {course.teacher_name}
          </span>
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-md">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-500">{course.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded-md">
            <Users size={12} />
            <span>{course.student_count.toLocaleString('vi-VN')} học sinh</span>
          </div>
        </div>
        
        {/* Footer (Price + Button) */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
          <span className={`text-base font-black leading-none ${course.price === 0 ? 'text-green-600 dark:text-green-500' : 'text-orange-500 dark:text-orange-400'}`}>
            {formatPrice(course.price)}
          </span>
          <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-1.5 transition-all bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg">
            Chi tiết <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function CourseExplorer({ initialCourses }: { initialCourses: Course[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [grade, setGrade] = useState<number | null>(searchParams.get('grade') ? parseInt(searchParams.get('grade')!) : null)
  const [examType, setExamType] = useState<string | null>(searchParams.get('exam_type') || null)
  const [searchQuery, setSearchQuery] = useState('')

  // Sync state with URL if it changes externally
  useEffect(() => {
    setGrade(searchParams.get('grade') ? parseInt(searchParams.get('grade')!) : null)
    setExamType(searchParams.get('exam_type') || null)
  }, [searchParams])

  const updateFilters = (newFilters: { grade?: number | null, exam_type?: string | null }) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if ('grade' in newFilters) {
      if (newFilters.grade) params.set('grade', String(newFilters.grade))
      else params.delete('grade')
    }
    
    if ('exam_type' in newFilters) {
      if (newFilters.exam_type) params.set('exam_type', newFilters.exam_type)
      else params.delete('exam_type')
    }

    router.push(`/courses?${params.toString()}`, { scroll: false })
  }

  const handleApply = () => {
    // Already realtime, just for UX feel
    router.push(`/courses?${new URLSearchParams(searchParams.toString()).toString()}`, { scroll: false })
  }

  const clearFilters = () => {
    setGrade(null)
    setExamType(null)
    setSearchQuery('')
    router.push('/courses', { scroll: false })
  }

  const filteredCourses = useMemo(() => {
    return initialCourses.filter((c) => {
      if (grade && c.grade !== grade) return false
      if (examType && c.exam_type !== examType) return false
      if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [initialCourses, grade, examType, searchQuery])

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 relative flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
      
      {/* SIDEBAR BỘ LỌC (Left Column) */}
      <aside className="w-full md:w-[280px] shrink-0 md:sticky md:top-24 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center gap-2">
          <Filter size={18} className="text-primary" />
          <h2 className="text-lg font-black text-gray-900 dark:text-white">Bộ lọc</h2>
        </div>
        
        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {/* Lọc Khối Lớp */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">
              Khối lớp
            </label>
            <div className="relative">
              <select 
                value={grade || ''}
                onChange={(e) => updateFilters({ grade: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full appearance-none bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white text-sm font-semibold rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
              >
                <option value="">Tất cả khối lớp</option>
                {GRADES.map(g => (
                  <option key={g} value={g}>Lớp {g}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Lọc Kỳ Thi */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">
              Kỳ thi
            </label>
            <div className="relative">
              <select 
                value={examType || ''}
                onChange={(e) => updateFilters({ exam_type: e.target.value || null })}
                className="w-full appearance-none bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white text-sm font-semibold rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
              >
                <option value="">Tất cả kỳ thi</option>
                {EXAM_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/20">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-4 text-center">
            Hiển thị <span className="text-primary">{filteredCourses.length}</span> khóa học
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleApply}
              className="flex-1 flex items-center justify-center bg-primary text-white text-sm font-black py-3 rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all"
            >
              Áp dụng lọc
            </button>
            <button 
              onClick={clearFilters}
              disabled={!grade && !examType && !searchQuery}
              className="shrink-0 flex items-center justify-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-xl transition-colors"
              title="Xóa bộ lọc"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT: DANH SÁCH KHÓA HỌC (Right Column) */}
      <main className="flex-1 w-full min-w-0">
        
        {/* Search Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-2 mb-6">
          <div className="relative w-full flex items-center">
            <Search className="absolute left-4 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm kiếm khóa học theo tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-transparent border-none text-sm focus:ring-0 outline-none text-gray-900 dark:text-white font-medium placeholder-gray-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 p-1 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Grid Courses */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 text-center shadow-sm flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Search className="text-gray-300 dark:text-gray-600" size={32} />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Không tìm thấy khóa học</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm px-4 mb-6">
              Không có khóa học nào khớp với bộ lọc hiện tại. Vui lòng thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.
            </p>
            <button 
              onClick={clearFilters}
              className="px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
