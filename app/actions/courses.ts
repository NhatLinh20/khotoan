'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteCourse(id: string) {
 const supabase = await createClient()

 // Xóa khóa học, bảng lessons sẽ tự động xóa do ON DELETE CASCADE
 const { error } = await supabase.from('courses').delete().eq('id', id)

 if (error) {
 console.error('Error deleting course:', error)
 throw new Error('Không thể xoá khóa học')
 }

 revalidatePath('/teacher/courses')
}

export async function saveCourse(payload: { courseId?: string, course: any, lessons: any[] }) {
 const supabase = await createClient()

 const { courseId, course, lessons } = payload

 let finalCourseId = courseId

 if (courseId) {
 // Update existing course
 const { error: courseError } = await supabase
 .from('courses')
 .update(course)
 .eq('id', courseId)

 if (courseError) throw new Error(courseError.message)
 
 // For lessons:
 // It's simpler to delete all existing lessons and re-insert, or upsert.
 // Let's delete all and reinsert to manage deletions easily.
 const { error: deleteLessonsError } = await supabase
 .from('lessons')
 .delete()
 .eq('course_id', courseId)

 if (deleteLessonsError) throw new Error(deleteLessonsError.message)
 } else {
 // Insert new course
 const { data: newCourse, error: courseError } = await supabase
 .from('courses')
 .insert([course])
 .select('id')
 .single()

 if (courseError) throw new Error(courseError.message)
 finalCourseId = newCourse.id
 }

 // Insert lessons
 if (lessons.length > 0 && finalCourseId) {
 const lessonsToInsert = lessons.map(lesson => ({
 course_id: finalCourseId,
 title: lesson.title,
 video_url: lesson.video_url,
 pdf_url: lesson.pdf_url,
 order_index: lesson.order_index,
 duration_minutes: lesson.duration_minutes,
 chapter: lesson.chapter || null,
 lesson_ref: lesson.lesson_ref || null
 }))

 const { error: lessonsError } = await supabase
 .from('lessons')
 .insert(lessonsToInsert)

 if (lessonsError) throw new Error(lessonsError.message)
 }

 revalidatePath('/teacher/courses')
 return { success: true }
}
