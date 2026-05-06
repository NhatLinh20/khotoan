import { createClient } from '@/lib/supabase/server'
import StudentsClient from './StudentsClient'

export const dynamic = 'force-dynamic'

export default async function StudentsPage() {
  const supabase = await createClient()

  // Fetch danh sách học sinh
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

  // Fetch login logs (50 bản ghi gần nhất)
  const { data: loginLogs } = await supabase
    .from('login_logs')
    .select('id, user_id, ip_address, country, country_code, region, city, isp, user_agent, is_suspicious, suspicious_reason, logged_in_at, profiles!inner(full_name, email)')
    .order('logged_in_at', { ascending: false })
    .limit(200)

  const pending = (students || []).filter((s) => !s.is_approved)
  const approved = (students || []).filter((s) => s.is_approved)

  return (
    <StudentsClient
      pending={pending}
      approved={approved}
      loginLogs={(loginLogs as any) || []}
    />
  )
}
