import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Image as ImageIcon } from 'lucide-react'
import DeleteCourseButton from './DeleteCourseButton'

export const metadata = {
 title: 'Quản lý khóa học - Kho Toán',
}

export default async function TeacherCoursesPage() {
 const supabase = await createClient()

 // Fetch courses
 const { data: courses, error } = await supabase
 .from('courses')
 .select('*')
 .order('created_at', { ascending: false })

 if (error) {
 console.error('Error fetching courses:', error)
 }

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
 <div>
 <h1 className="text-2xl font-display font-bold text-primary">Quản lý khóa học</h1>
 <p className="text-sm text-secondary mt-1">
 Thêm, sửa, xoá và quản lý các khóa học trên hệ thống.
 </p>
 </div>
 <Link
 href="/teacher/courses/new"
 className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-surface px-4 py-2.5 rounded-md text-sm font-bold shadow-sm transition-all shadow-primary/20 hover:shadow-primary/40"
 >
 <Plus size={18} />
 Tạo khóa mới
 </Link>
 </div>

 {/* Courses List */}
 <div className="bg-surface rounded-lg border border-secondary/20 overflow-hidden shadow-sm">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse text-[13px]">
 <thead>
 <tr className="bg-neutral/50">
 <th className="px-4 py-3 text-[11px] font-display font-bold text-secondary uppercase tracking-wider">
 Khóa học
 </th>
 <th className="px-4 py-3 text-[11px] font-display font-bold text-secondary uppercase tracking-wider">
 Phân loại
 </th>
 <th className="px-4 py-3 text-[11px] font-display font-bold text-secondary uppercase tracking-wider text-center">
 Học viên
 </th>
 <th className="px-4 py-3 text-[11px] font-display font-bold text-secondary uppercase tracking-wider">
 Trạng thái
 </th>
 <th className="px-4 py-3 text-[11px] font-display font-bold text-secondary uppercase tracking-wider text-right">
 Thao tác
 </th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100">
 {!courses || courses.length === 0 ? (
 <tr>
 <td colSpan={7} className="px-4 py-8 text-center text-secondary">
 Chưa có khóa học nào.
 </td>
 </tr>
 ) : (
 courses.map((course) => (
 <tr key={course.id} className="hover:bg-neutral :bg-slate-800/50 transition-colors">
 <td className="px-4 py-3">
 <div className="font-bold text-primary line-clamp-1">
 {course.title}
 </div>
 <div className="text-[11px] text-secondary mt-0.5">
 {course.teacher_name || 'Đang cập nhật'}
 </div>
 </td>
 <td className="px-4 py-3">
 <div className="flex gap-1.5">
 <span className="px-1.5 py-0.5 rounded border border-blue-100 bg-blue-50/50 text-blue-600 text-[10px] font-bold whitespace-nowrap">
 Lớp {course.grade}
 </span>
 {course.topic && (
 <span className="px-1.5 py-0.5 rounded border border-purple-100 bg-purple-50/50 text-purple-600 text-[10px] font-bold whitespace-nowrap">
 {course.topic}
 </span>
 )}
 </div>
 </td>
 <td className="px-4 py-3 text-center">
 <span className="inline-flex items-center justify-center min-w-[1.5rem] px-1.5 py-0.5 rounded-md bg-neutral text-[11px] font-display font-bold text-secondary">
 {course.student_count || 0}
 </span>
 </td>
 <td className="px-4 py-3">
 <span className="px-1.5 py-0.5 rounded border border-green-100 bg-green-50/50 text-green-600 text-[10px] font-bold whitespace-nowrap flex items-center gap-1 w-max">
 <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
 Đang mở
 </span>
 </td>
 <td className="px-4 py-3">
 <div className="flex items-center justify-end gap-1">
 <Link
 href={`/teacher/courses/${course.id}/edit`}
 className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
 title="Chỉnh sửa"
 >
 <Edit size={14} />
 </Link>
 <DeleteCourseButton id={course.id} />
 </div>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )
}
