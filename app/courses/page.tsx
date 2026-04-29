import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Users, Star, ChevronRight, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { MOCK_COURSES, type Course } from '@/lib/mock-data'

const GRADES = [6, 7, 8, 9, 10, 11, 12]
const TOPICS = ['Đại số & Thống kê', 'Hình học', 'Chuyên đề']

function formatPrice(price: number) {
  if (price === 0) return 'Miễn phí'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

function CourseCard({ course }: { course: Course }) {
  const stars = Math.round(course.rating)
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-800 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-primary/10 to-primary/20 overflow-hidden">
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
            <BookOpen className="text-primary/40 group-hover:text-primary/60 transition-colors" size={64} />
          </div>
        )}
        {/* Grade badge */}
        <div className="absolute top-3 left-3 bg-primary text-white text-xs font-black px-3 py-1.5 rounded-full tracking-wider uppercase shadow-lg">
          Lớp {course.grade}
        </div>
        {/* Topic badge */}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 text-gray-700 dark:text-gray-200 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {course.topic}
        </div>
        {/* Free overlay */}
        {course.price === 0 && (
          <div className="absolute bottom-3 right-3 bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
            Miễn phí
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 gap-3">
        <h3 className="text-base font-black text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {course.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed flex-1">
          {course.description}
        </p>

        {/* Teacher */}
        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black shrink-0">GV</span>
          {course.teacher_name}
        </p>

        {/* Rating & Students */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                className={i < stars ? 'text-secondary fill-secondary' : 'text-gray-300 dark:text-gray-600'}
              />
            ))}
            <span className="text-xs font-bold text-gray-500 ml-1">{course.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
            <Users size={13} />
            {course.student_count.toLocaleString('vi-VN')}
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800 mt-auto">
          <span className={`text-lg font-black ${course.price === 0 ? 'text-emerald-600' : 'text-primary'}`}>
            {formatPrice(course.price)}
          </span>
          <span className="text-xs font-bold text-primary flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
            Xem chi tiết <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; grade?: string; topic?: string }>
}) {
  const params = await searchParams
  const selectedLevel = params.level || ''
  const selectedGrade = params.grade ? parseInt(params.grade) : null
  const selectedTopic = params.topic || ''

  const supabase = await createClient()
  const { data: dbCourses } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  // Dùng mock nếu DB trống
  const allCourses: Course[] = (dbCourses && dbCourses.length > 0) ? dbCourses : MOCK_COURSES

  // Lọc
  const filtered = allCourses.filter((c) => {
    if (selectedLevel === 'THCS' && (c.grade < 6 || c.grade > 9)) return false
    if (selectedLevel === 'THPT' && (c.grade < 10 || c.grade > 12)) return false
    if (selectedGrade && c.grade !== selectedGrade) return false
    if (selectedTopic && c.topic !== selectedTopic) return false
    return true
  })

  const thcsGrades = GRADES.filter((g) => g <= 9)
  const thptGrades = GRADES.filter((g) => g >= 10)

  const buildHref = (key: string, value: string) => {
    const p = new URLSearchParams({
      ...(selectedLevel ? { level: selectedLevel } : {}),
      ...(selectedGrade ? { grade: String(selectedGrade) } : {}),
      ...(selectedTopic ? { topic: selectedTopic } : {}),
    })
    if (value) p.set(key, value)
    else p.delete(key)
    const s = p.toString()
    return `/courses${s ? `?${s}` : ''}`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Khóa học <span className="text-primary">Toán</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              Theo chương trình GDPT 2018 — Lớp 6 đến 12
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mr-2">
              <Filter size={16} />
              Lọc:
            </div>

            {/* Level */}
            {['', 'THCS', 'THPT'].map((lv) => (
              <Link
                key={lv}
                href={buildHref('level', lv)}
                className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                  selectedLevel === lv
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-primary hover:text-primary'
                }`}
              >
                {lv === '' ? 'Tất cả' : lv}
              </Link>
            ))}

            <div className="w-px h-6 bg-gray-200 dark:bg-slate-700 mx-1" />

            {/* Grade */}
            {(selectedLevel === 'THCS'
              ? thcsGrades
              : selectedLevel === 'THPT'
              ? thptGrades
              : GRADES
            ).map((g) => (
              <Link
                key={g}
                href={buildHref('grade', selectedGrade === g ? '' : String(g))}
                className={`px-3 py-2 rounded-full text-sm font-bold border transition-all ${
                  selectedGrade === g
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-primary hover:text-primary'
                }`}
              >
                Lớp {g}
              </Link>
            ))}

            <div className="w-px h-6 bg-gray-200 dark:bg-slate-700 mx-1" />

            {/* Topic */}
            {TOPICS.map((tp) => (
              <Link
                key={tp}
                href={buildHref('topic', selectedTopic === tp ? '' : tp)}
                className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                  selectedTopic === tp
                    ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-secondary hover:text-secondary'
                }`}
              >
                {tp}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-sm text-gray-500 font-bold mb-6 uppercase tracking-widest">
          {filtered.length} khóa học
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <BookOpen className="mx-auto mb-6 text-gray-300" size={64} />
            <h3 className="text-xl font-black text-gray-500 mb-2">Chưa có khóa học</h3>
            <p className="text-gray-400 font-medium">Hãy thử bộ lọc khác hoặc quay lại sau bạn nhé!</p>
            <Link href="/courses" className="mt-6 inline-block text-primary font-bold hover:underline">
              Xem tất cả →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
