import { createClient } from '@/lib/supabase/server'
import CourseForm from '../../CourseForm'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Chỉnh sửa khóa học - Kho Toán',
}

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()

  if (courseError || !course) {
    notFound()
  }

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', id)
    .order('order_index', { ascending: true })

  return (
    <div className="max-w-5xl mx-auto">
      <CourseForm 
        initialCourse={course} 
        initialLessons={lessons || []} 
        courseId={id} 
      />
    </div>
  )
}
