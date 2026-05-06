import { createClient } from '@/lib/supabase/server'
import StudentsClient from './StudentsClient'

export const dynamic = 'force-dynamic'

export default async function StudentsPage() {
  const supabase = await createClient()

  // Lấy tất cả học sinh (role = student) cùng email từ auth.users qua view
  // Supabase không cho join auth.users trực tiếp nên ta dùng profiles
  // Email được lưu trong profiles nếu trigger đã copy, hoặc ta join thêm
  const { data: students, error } = await supabase
    .from('profiles')
    .select('id, full_name, grade, is_approved, created_at')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="p-6 text-red-500 font-semibold">
        Lỗi tải dữ liệu: {error.message}
      </div>
    )
  }

  // Lấy email từ auth admin API (server-side)
  const adminClient = supabase // same client, có thể dùng service_role nếu cần
  const userIds = (students || []).map((s) => s.id)

  // Map email từ Supabase Auth (chỉ hoạt động với service_role key)
  // Nếu bảng profiles có cột email thì dùng trực tiếp
  // Ta sẽ fetch từng user hoặc dùng admin API nếu available
  // Fallback: để email null nếu không có
  let emailMap: Record<string, string> = {}
  try {
    // Thử dùng listUsers (chỉ có với service_role)
    const { data: usersPage } = await (supabase as any).auth.admin.listUsers({ perPage: 1000 })
    if (usersPage?.users) {
      usersPage.users.forEach((u: any) => {
        emailMap[u.id] = u.email || ''
      })
    }
  } catch {
    // Bỏ qua nếu không có quyền admin
  }

  const enriched = (students || []).map((s) => ({
    ...s,
    email: emailMap[s.id] || null,
  }))

  const pending = enriched.filter((s) => !s.is_approved)
  const approved = enriched.filter((s) => s.is_approved)

  return <StudentsClient pending={pending} approved={approved} />
}
