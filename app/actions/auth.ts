'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
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

  // Sau khi đăng ký thành công, Supabase có thể yêu cầu xác nhận email.
  // Nếu email confirmation bị tắt, user sẽ được log in ngay.
  
  await revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  await revalidatePath('/', 'layout')
  redirect('/login')
}
