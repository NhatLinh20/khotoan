import { createClient } from '@/lib/supabase/server'
import { MOCK_COURSES, type Course } from '@/lib/mock-data'
import CourseExplorer from './CourseExplorer'
import { Suspense } from 'react'

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: dbCourses } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  // Dùng mock nếu DB trống
  const allCourses: Course[] = (dbCourses && dbCourses.length > 0) ? dbCourses : MOCK_COURSES

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header Banner - Minimal Version */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-3 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Khám phá <span className="text-primary italic">Tri thức</span>
              </h1>
              <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">
                Hệ thống khóa học Lớp 6 — 12
              </p>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-12 text-center font-bold text-gray-400">Đang tải dữ liệu...</div>}>
        <CourseExplorer initialCourses={allCourses} />
      </Suspense>
    </div>
  )
}
