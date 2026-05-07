'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function enrollCourse(courseId: string) {
 const supabase = await createClient()
 const { data: { user } } = await supabase.auth.getUser()

 if (!user) {
 redirect('/login')
 }

 // Kiểm tra đã đăng ký chưa
 const { data: existing } = await supabase
 .from('enrollments')
 .select('id')
 .eq('user_id', user.id)
 .eq('course_id', courseId)
 .single()

 if (existing) {
 return { error: 'Bạn đã đăng ký khóa học này rồi.' }
 }

 const { error } = await supabase
 .from('enrollments')
 .insert({ user_id: user.id, course_id: courseId })

 if (error) {
 return { error: 'Đăng ký thất bại: ' + error.message }
 }

 await revalidatePath(`/courses/${courseId}`)
 return { success: true }
}
