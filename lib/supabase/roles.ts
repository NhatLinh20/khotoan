import { createClient } from '@/lib/supabase/server'

export type Profile = {
  id: string
  full_name: string | null
  grade: number | null
  role: 'student' | 'teacher'
  created_at: string
}

/**
 * Lấy profile (bao gồm role) của một user.
 * Trả về null nếu không tìm thấy.
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, grade, role, created_at')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return data as Profile
}

/**
 * Kiểm tra user hiện tại (từ session) có phải teacher không.
 * Dùng trong Server Components và Server Actions.
 */
export async function isTeacher(userId: string): Promise<boolean> {
  const profile = await getProfile(userId)
  return profile?.role === 'teacher'
}

/**
 * Lấy user hiện tại và profile trong cùng một lần gọi.
 * Tiện dụng cho layout và page components.
 */
export async function getCurrentUserWithProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { user: null, profile: null }

  const profile = await getProfile(user.id)
  return { user, profile }
}
