import CourseForm from '../CourseForm'

export const metadata = {
 title: 'Tạo khóa học mới - Kho Toán',
}

export default function NewCoursePage() {
 return (
 <div className="max-w-5xl mx-auto">
 <CourseForm />
 </div>
 )
}
