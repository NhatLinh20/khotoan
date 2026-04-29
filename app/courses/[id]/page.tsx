import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Star, Users, BookOpen, Clock, Video, FileText,
  ChevronRight, ArrowLeft, GraduationCap, Award
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { MOCK_COURSES, getMockLessons, type Course, type Lesson } from '@/lib/mock-data'
import EnrollButton from './EnrollButton'

function formatPrice(price: number) {
  if (price === 0) return 'Miễn phí'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch user
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch course
  let course: Course | null = null
  const { data: dbCourse } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()

  if (dbCourse) {
    course = dbCourse
  } else {
    course = MOCK_COURSES.find((c) => c.id === id) ?? null
  }

  if (!course) notFound()

  // Fetch lessons
  let lessons: Lesson[] = []
  const { data: dbLessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', id)
    .order('order_index')

  lessons = (dbLessons && dbLessons.length > 0) ? dbLessons : getMockLessons(id)

  // Check enrollment
  let isEnrolled = false
  if (user) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', id)
      .single()
    isEnrolled = !!enrollment
  }

  const totalDuration = lessons.reduce((sum, l) => sum + (l.duration_minutes || 0), 0)
  const stars = Math.round(course.rating)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-gray-500 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <ChevronRight size={14} />
          <Link href="/courses" className="hover:text-primary transition-colors">Khóa học</Link>
          <ChevronRight size={14} />
          <span className="text-gray-800 dark:text-gray-200 font-bold line-clamp-1">{course.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-10">
        {/* LEFT: Main info */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Back */}
          <Link href="/courses" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline w-fit">
            <ArrowLeft size={16} /> Quay lại danh sách
          </Link>

          {/* Thumbnail */}
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/20 shadow-xl">
            {course.thumbnail_url ? (
              <Image
                src={course.thumbnail_url}
                alt={course.title}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="text-primary/30" size={96} />
              </div>
            )}
          </div>

          {/* Title & meta */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-primary text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                Lớp {course.grade}
              </span>
              <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-xs font-bold px-3 py-1.5 rounded-full">
                {course.topic}
              </span>
              {course.price === 0 && (
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Miễn phí
                </span>
              )}
            </div>

            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
              {course.title}
            </h1>

            {/* Rating row */}
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < stars ? 'text-secondary fill-secondary' : 'text-gray-300 dark:text-gray-600'}
                  />
                ))}
                <span className="font-black text-gray-700 dark:text-gray-200 ml-1">{course.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <Users size={15} />
                <span className="font-bold">{course.student_count.toLocaleString('vi-VN')} học viên</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <Clock size={15} />
                <span className="font-bold">{totalDuration} phút</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <BookOpen size={15} />
                <span className="font-bold">{lessons.length} bài học</span>
              </div>
            </div>

            {/* Teacher */}
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg shrink-0">
                GV
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Giảng viên</p>
                <p className="font-black text-gray-900 dark:text-white">{course.teacher_name}</p>
              </div>
              <Award className="ml-auto text-secondary" size={24} />
            </div>
          </div>

          {/* Description */}
          {course.description && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-8">
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">Mô tả khóa học</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                {course.description}
              </p>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  'Theo chương trình GDPT 2018',
                  'Bài giảng chi tiết, dễ hiểu',
                  'Video + Tài liệu PDF',
                  'Bài tập thực hành',
                  'Hỗ trợ giải đáp',
                  'Học mọi lúc mọi nơi',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lessons */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                Nội dung khóa học
              </h2>
              <span className="text-sm font-bold text-gray-400">{lessons.length} bài học</span>
            </div>

            <div className="flex flex-col gap-2">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors group"
                >
                  {/* Index */}
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex items-center justify-center text-xs font-black text-gray-500 group-hover:border-primary group-hover:text-primary transition-colors shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-1 group-hover:text-primary transition-colors">
                      {lesson.title}
                    </p>
                    {lesson.duration_minutes > 0 && (
                      <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                        <Clock size={11} /> {lesson.duration_minutes} phút
                      </p>
                    )}
                  </div>

                  {/* Media icons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {lesson.video_url && (
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center" title="Có video">
                        <Video size={14} className="text-blue-500" />
                      </div>
                    )}
                    {lesson.pdf_url && (
                      <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center" title="Có tài liệu PDF">
                        <FileText size={14} className="text-red-500" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Sticky sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-8 shadow-xl shadow-gray-100 dark:shadow-none">
              {/* Price */}
              <div className="mb-6 text-center">
                <div className={`text-4xl font-black mb-1 ${course.price === 0 ? 'text-emerald-600' : 'text-primary'}`}>
                  {formatPrice(course.price)}
                </div>
                {course.price > 0 && (
                  <p className="text-sm text-gray-400 font-medium">Thanh toán một lần, học mãi mãi</p>
                )}
              </div>

              {/* Enroll Button */}
              <EnrollButton
                courseId={course.id}
                isEnrolled={isEnrolled}
                isLoggedIn={!!user}
                price={course.price}
              />

              {/* What's included */}
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-3">
                <p className="text-xs uppercase font-black text-gray-400 tracking-widest mb-1">Bao gồm</p>
                {[
                  { icon: <Video size={15} className="text-blue-500" />, label: `${lessons.filter(l => l.video_url).length} bài giảng video` },
                  { icon: <FileText size={15} className="text-red-500" />, label: `${lessons.filter(l => l.pdf_url).length} tài liệu PDF` },
                  { icon: <Clock size={15} className="text-emerald-500" />, label: `${totalDuration} phút nội dung` },
                  { icon: <GraduationCap size={15} className="text-primary" />, label: 'Chứng chỉ hoàn thành' },
                  { icon: <Users size={15} className="text-secondary" />, label: 'Hỗ trợ giải đáp' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {icon}
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Back to list */}
            <Link
              href="/courses"
              className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 dark:border-slate-700 text-sm font-bold text-gray-500 hover:border-primary hover:text-primary transition-all"
            >
              <ArrowLeft size={14} /> Xem thêm khóa học khác
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
