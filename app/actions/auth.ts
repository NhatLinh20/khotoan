'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { logLoginInternal } from '@/lib/auth-logger'

const ZALO_NUMBER = '0812878792'
const ZALO_LINK = `https://zalo.me/${ZALO_NUMBER}`
const NOT_APPROVED_MSG = `Tài khoản chưa được kích hoạt. Vui lòng liên hệ Zalo: ${ZALO_NUMBER} để được hỗ trợ.`

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Kiểm tra is_approved trong profiles
  const userId = authData.user?.id
  if (userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_approved')
      .eq('id', userId)
      .single()

    // Chỉ học sinh mới cần duyệt; giáo viên luôn được vào
    if (profile && profile.role === 'student' && !profile.is_approved) {
      return { error: NOT_APPROVED_MSG }
    }

    // Ghi log đăng nhập (fire-and-forget, không block redirect)
    const headersList = await headers()
    const forwarded = headersList.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : (headersList.get('x-real-ip') || 'unknown')
    const userAgent = headersList.get('user-agent') || 'unknown'
    const token = authData.session?.access_token
    
    // Đợi ghi log xong mới redirect để tránh Vercel kill function sớm
    await logLoginInternal(userId, ip, userAgent, token)
  }

  await revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function loginWithGoogle() {
  const supabase = await createClient()
  
  // URL của site để redirect về sau khi login Google
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function register(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const grade = parseInt(formData.get('grade') as string)
  const role = (formData.get('role') as string) || 'student'

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        grade,
        role,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Redirect sang /pending — dashboard sẽ chặn nếu is_approved = false
  // KHÔNG gọi signOut vì không đủ tin cậy để clear cookie trong server action
  await revalidatePath('/', 'layout')
  redirect('/pending')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  await revalidatePath('/', 'layout')
  redirect('/login')
}

// ─── Teacher actions ───────────────────────────────────────────────────────────

export async function approveStudent(studentId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .update({ is_approved: true })
    .eq('id', studentId)
  if (error) return { error: error.message }
  revalidatePath('/teacher/students')
  return { success: true }
}

export async function revokeStudent(studentId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .update({ is_approved: false })
    .eq('id', studentId)
  if (error) return { error: error.message }
  revalidatePath('/teacher/students')
  return { success: true }
}

export async function deleteStudent(studentId: string) {
  const supabase = await createClient()
  // Xóa profile (cascade sẽ xóa auth user nếu có policy)
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', studentId)
  if (error) return { error: error.message }
  revalidatePath('/teacher/students')
  return { success: true }
}
