import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
 Star, Users, BookOpen, Clock, Video, FileText,
 ChevronRight, ArrowLeft, GraduationCap, Award
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { MOCK_COURSES, getMockLessons, type Course, type Lesson } from '@/lib/mock-data'
import { getChapters } from '@/lib/math-taxonomy'
import EnrollButton from './EnrollButton'
import CourseContentAccordion, { type LessonGroup } from './CourseContentAccordion'

function formatPrice(price: number) {
 if (price === 0) return 'Miễn phí'
 return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

export default async function CourseDetailPage({
 params,
 searchParams
}: {
 params: Promise<{ id: string }>
 searchParams: Promise<{ lesson?: string }>
}) {
 const { id } = await params
 const resolvedSearchParams = await searchParams
 const lessonIdParam = resolvedSearchParams.lesson

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

 // Determine active lesson
 let activeLesson = null
 if (lessons.length > 0) {
 if (lessonIdParam) {
 activeLesson = lessons.find(l => l.id === lessonIdParam) || lessons[0]
 } else {
 activeLesson = lessons[0]
 }
 }

 // Extract video URL
 let activeVideoUrl = null
 if (activeLesson && activeLesson.video_url) {
 let rawUrl = activeLesson.video_url
 if (rawUrl.includes('<iframe') && rawUrl.includes('src=')) {
 const match = rawUrl.match(/src=["'](.*?)["']/)
 if (match && match[1]) rawUrl = match[1]
 } else if (rawUrl.includes('youtube.com/watch?v=')) {
 try {
 const videoId = new URL(rawUrl).searchParams.get('v')
 if (videoId) rawUrl =`https://www.youtube.com/embed/${videoId}`
 } catch (e) {}
 } else if (rawUrl.includes('youtu.be/')) {
 const videoId = rawUrl.split('youtu.be/')[1].split('?')[0]
 if (videoId) rawUrl =`https://www.youtube.com/embed/${videoId}`
 }
 activeVideoUrl = rawUrl
 }

 const totalDuration = lessons.reduce((sum, l) => sum + (l.duration_minutes || 0), 0)
 const stars = Math.round(course.rating)

 // Build chapter groups for accordion
 const gradeCode = course.grade === 10 ? '0' : course.grade === 11 ? '1' : course.grade === 12 ? '2' : String(course.grade)
 const topic = course.topic
 let subjectCode: 'D' | 'H' | 'C' | 'ALL' = 'ALL'
 if (topic === 'D' || topic === 'Đại số' || topic === 'Đại số & Thống kê') subjectCode = 'D'
 else if (topic === 'H' || topic === 'Hình học') subjectCode = 'H'
 else if (topic === 'C' || topic === 'Chuyên đề') subjectCode = 'C'
 const availableChapters = getChapters(gradeCode, subjectCode)

 // Group lessons by chapter field; fall back to group-of-10 if no chapter data
 const hasChapterData = lessons.some(l => !!(l as any).chapter)
 const groupMap = new Map<string, typeof lessons>()

 if (hasChapterData) {
 lessons.forEach(l => {
 const cid: number = (l as any).chapter ?? 0
 const chInfo = availableChapters.find(c => c.value === cid)
 const key = chInfo
 ?`Chương ${chInfo.value}: ${chInfo.label}`
 : cid === 0 ? 'Bài học chung' :`Chương ${cid}`
 if (!groupMap.has(key)) groupMap.set(key, [])
 groupMap.get(key)!.push(l)
 })
 } else {
 // fallback: group by 10
 const sorted = [...lessons].sort((a, b) => ((a as any).order_index || 0) - ((b as any).order_index || 0))
 for (let i = 0; i < sorted.length; i += 10) {
 const key =`Chương ${Math.floor(i / 10) + 1}`
 groupMap.set(key, sorted.slice(i, i + 10))
 }
 }

 const lessonGroups: LessonGroup[] = Array.from(groupMap.entries()).map(([chapterName, ls]) => ({
 chapterName,
 lessons: ls.map(l => ({
 id: l.id,
 title: l.title,
 video_url: l.video_url,
 pdf_url: l.pdf_url,
 duration_minutes: l.duration_minutes || 0,
 globalIndex: lessons.findIndex(x => x.id === l.id),
 })),
 }))

 // Which group contains the active lesson (to open by default)
 const initialOpenIndex = activeLesson
 ? lessonGroups.findIndex(g => g.lessons.some(l => l.id === activeLesson.id))
 : -1

 return (
 <div className="min-h-screen bg-neutral">
 {/* Breadcrumb */}
 <div className="bg-surface border-b border-secondary/20">
 <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-secondary font-medium">
 <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
 <ChevronRight size={14} />
 <Link href="/courses" className="hover:text-primary transition-colors">Khóa học</Link>
 <ChevronRight size={14} />
 <span className="text-primary font-bold line-clamp-1">{course.title}</span>
 </div>
 </div>

 <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-10">
 {/* LEFT: Main info */}
 <div className="lg:col-span-2 flex flex-col gap-8">
 {/* Back */}
 <Link href="/courses" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline w-fit">
 <ArrowLeft size={16} /> Quay lại danh sách
 </Link>

 {/* Main Display: Video Player OR Thumbnail */}
 <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-900 shadow-xl border border-secondary/20">
 {activeVideoUrl ? (
 <iframe
 src={activeVideoUrl}
 className="w-full h-full border-0"
 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
 allowFullScreen
 />
 ) : course.thumbnail_url ? (
 <Image
 src={course.thumbnail_url}
 alt={course.title}
 fill
 priority
 className="object-cover"
 />
 ) : (
 <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
 <BookOpen className="text-primary/30" size={96} />
 </div>
 )}
 </div>

 {/* Title & meta */}
 <div>
 <div className="flex flex-wrap gap-2 mb-4">
 <span className="bg-primary text-surface text-xs font-display font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
 Lớp {course.grade}
 </span>
 <span className="bg-neutral text-secondary text-xs font-bold px-3 py-1.5 rounded-full">
 {course.topic}
 </span>
 {course.price === 0 && (
 <span className="bg-emerald-100 text-emerald-700 text-xs font-display font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
 Miễn phí
 </span>
 )}
 </div>

 <h1 className="text-3xl font-display font-bold text-primary mb-4 leading-tight">
 {activeLesson ?`Đang học: ${activeLesson.title}` : course.title}
 </h1>

 {/* Rating row */}
 <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
 <div className="flex items-center gap-1">
 {Array.from({ length: 5 }).map((_, i) => (
 <Star
 key={i}
 size={16}
 className={i < stars ? 'text-secondary fill-secondary' : 'text-secondary/50 '}
 />
 ))}
 <span className="font-display font-bold text-gray-700 ml-1">{course.rating.toFixed(1)}</span>
 </div>
 <div className="flex items-center gap-1.5 text-secondary">
 <Users size={15} />
 <span className="font-bold">{course.student_count.toLocaleString('vi-VN')} học viên</span>
 </div>
 <div className="flex items-center gap-1.5 text-secondary">
 <Clock size={15} />
 <span className="font-bold">{totalDuration} phút</span>
 </div>
 <div className="flex items-center gap-1.5 text-secondary">
 <BookOpen size={15} />
 <span className="font-bold">{lessons.length} bài học</span>
 </div>
 </div>

 {/* Teacher */}
 <div className="flex items-center gap-3 p-4 bg-surface rounded-md border border-secondary/20">
 <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-lg shrink-0">
 GV
 </div>
 <div>
 <p className="text-[10px] uppercase font-display font-bold text-secondary/80 tracking-widest">Giảng viên</p>
 <p className="font-display font-bold text-primary">{course.teacher_name}</p>
 </div>
 <Award className="ml-auto text-secondary" size={24} />
 </div>
 </div>

 {/* Description */}
 {course.description && !activeLesson && (
 <div className="bg-surface rounded-lg border border-secondary/20 p-8">
 <h2 className="text-xl font-display font-bold text-primary mb-4">Mô tả khóa học</h2>
 <p className="text-secondary leading-relaxed font-medium">
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
 <div key={item} className="flex items-center gap-2 text-sm text-secondary font-medium">
 <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
 <div className="w-2 h-2 rounded-full bg-primary" />
 </div>
 {item}
 </div>
 ))}
 </div>
 </div>
 )}

 </div>

 {/* RIGHT: Sticky sidebar */}
 <div className="lg:col-span-1">
 <div className="sticky top-24 flex flex-col gap-4 max-h-[calc(100vh-120px)]">
 
 {/* Price & Enroll Card - Only show if NOT enrolled */}
 {!isEnrolled && (
 <div className="bg-surface rounded-lg border border-secondary/20 p-5 shadow-xl shadow-gray-100 shrink-0">
 {/* Price (only show if > 0) */}
 {course.price > 0 && (
 <div className="mb-4 text-center">
 <div className="text-3xl font-display font-bold mb-1 text-primary">
 {formatPrice(course.price)}
 </div>
 <p className="text-[10px] text-secondary/80 font-medium uppercase tracking-wider">Học mãi mãi</p>
 </div>
 )}

 {/* Enroll Button */}
 <div className={course.price > 0 ? '' : 'mt-2'}>
 <EnrollButton
 courseId={course.id}
 isEnrolled={isEnrolled}
 isLoggedIn={!!user}
 price={course.price}
 />
 </div>

 {/* What's included */}
 <div className="mt-4 pt-4 border-t border-secondary/20 flex flex-col gap-2">
 <p className="text-[10px] uppercase font-display font-bold text-secondary/80 tracking-widest mb-0.5">Bao gồm</p>
 {[
 { icon: <Video size={13} className="text-blue-500" />, label:`${lessons.filter(l => l.video_url).length} bài giảng video` },
 { icon: <FileText size={13} className="text-red-500" />, label:`${lessons.filter(l => l.pdf_url).length} tài liệu PDF` },
 { icon: <Clock size={13} className="text-emerald-500" />, label:`${totalDuration} phút nội dung` },
 { icon: <GraduationCap size={13} className="text-primary" />, label: 'Chứng chỉ' },
 { icon: <Users size={13} className="text-secondary" />, label: 'Hỗ trợ' },
].map(({ icon, label }) => (
 <div key={label} className="flex items-center gap-2.5 text-xs text-secondary font-medium">
 {icon}
 {label}
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Lessons List on Sidebar */}
 <div className="bg-surface rounded-lg border border-secondary/20 p-6 shadow-xl shadow-gray-100 flex flex-col overflow-hidden">
 <div className="flex items-center justify-between mb-4 shrink-0">
 <h2 className="text-lg font-display font-bold text-primary">
 Nội dung khóa học
 </h2>
 <span className="text-xs font-bold text-secondary/80 bg-neutral px-2 py-1 rounded-md">{lessons.length} bài</span>
 </div>

 <CourseContentAccordion
 groups={lessonGroups}
 activeLessonId={activeLesson?.id}
 isEnrolled={isEnrolled}
 courseId={course.id}
 initialOpenIndex={initialOpenIndex}
 />
 </div>

 {/* Back to list */}
 <Link
 href="/courses"
 className="flex items-center justify-center gap-2 py-3 rounded-md border border-secondary/20 text-sm font-bold text-secondary hover:border-primary hover:text-primary transition-all"
 >
 <ArrowLeft size={14} /> Xem thêm khóa học khác
 </Link>
 </div>
 </div>
 </div>
 </div>
 )
}
