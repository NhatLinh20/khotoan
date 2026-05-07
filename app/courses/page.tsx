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
 <div className="min-h-screen bg-neutral">
 {/* Header Banner - Modern Design */}
 <div className="bg-surface border-b border-secondary/20">
 <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
 <div className="flex flex-col gap-3">
 {/* Breadcrumb */}
 <nav className="flex text-sm text-secondary font-medium">
 <ol className="flex items-center gap-2">
 <li>
 <a href="/" className="hover:text-primary transition-colors">Trang chủ</a>
 </li>
 <li>
 <span className="text-secondary/50">/</span>
 </li>
 <li>
 <span className="text-primary font-bold">Khóa học</span>
 </li>
 </ol>
 </nav>
 
 <div>
 <h1 className="text-3xl md:text-4xl font-display font-bold text-primary tracking-tight">
 Khóa học Toán
 </h1>
 <p className="text-sm md:text-[0.95rem] text-secondary mt-2 max-w-2xl font-medium leading-[1.55]">
 Hệ thống bài giảng, đề thi và luyện tập chuyên sâu cho học sinh từ lớp 6 đến lớp 12. Được thiết kế tối ưu giúp nắm vững kiến thức và tự tin chinh phục mọi kỳ thi.
 </p>
 </div>
 </div>
 </div>
 </div>

 <Suspense fallback={<CoursesSkeleton />}>
 <CourseExplorer initialCourses={allCourses} />
 </Suspense>
 </div>
 )
}

function CoursesSkeleton() {
 return (
 <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start animate-pulse">
 <div className="w-full md:w-[280px] shrink-0 bg-surface rounded-lg h-[600px] border border-secondary/10" />
 <div className="flex-1 w-full flex flex-col gap-6">
 <div className="w-full h-12 bg-surface rounded-lg border border-secondary/10" />
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
 {[1, 2, 3, 4, 5, 6].map((i) => (
 <div key={i} className="bg-surface rounded-lg h-[320px] border border-secondary/10" />
 ))}
 </div>
 </div>
 </div>
 )
}
