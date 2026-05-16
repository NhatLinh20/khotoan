'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SessionGuardian({ userId, currentSessionId }: { userId: string, currentSessionId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [isKickedOut, setIsKickedOut] = useState(false)

  useEffect(() => {
    if (!userId || !currentSessionId) return

    // Lắng nghe sự thay đổi trên bảng profiles
    const channel = supabase.channel('profiles_session_updates')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'profiles', 
        filter: `id=eq.${userId}` 
      }, (payload) => {
        const newSessionId = payload.new.session_id
        if (newSessionId && newSessionId !== currentSessionId) {
          setIsKickedOut(true)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, currentSessionId, supabase])

  useEffect(() => {
    if (isKickedOut) {
      alert('Tài khoản của bạn vừa được đăng nhập trên một thiết bị khác. Bạn sẽ bị đăng xuất khỏi thiết bị này!')
      supabase.auth.signOut().then(() => {
        router.push('/login')
        router.refresh()
      })
    }
  }, [isKickedOut, router, supabase])

  return null
}
