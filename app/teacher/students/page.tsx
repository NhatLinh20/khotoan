import { createClient } from '@/lib/supabase/server'
import StudentsClient from './StudentsClient'

export const dynamic = 'force-dynamic'

export default async function StudentsPage() {
  const supabase = await createClient()

  // Email giờ được lưu trực tiếp trong profiles (sau khi chạy SQL migration)
  const { data: students, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, grade, is_approved, created_at')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="p-6 text-red-500 font-semibold">
        Lỗi tải dữ liệu: {error.message}
      </div>
    )
  }

  const pending = (students || []).filter((s) => !s.is_approved)
  const approved = (students || []).filter((s) => s.is_approved)

  return <StudentsClient pending={pending} approved={approved} />
}
