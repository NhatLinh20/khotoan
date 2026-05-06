import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  // 1. Kiểm tra user hiện tại
  const { data: { user } } = await supabase.auth.getUser()

  // 2. Thử SELECT login_logs
  const { data: logs, error: selectError } = await supabase
    .from('login_logs')
    .select('*')
    .limit(5)

  // 3. Nếu đã đăng nhập, thử INSERT một log test
  let insertResult = null
  if (user) {
    const { data, error } = await supabase.from('login_logs').insert({
      user_id: user.id,
      ip_address: '1.2.3.4',
      country: 'Vietnam',
      is_suspicious: false,
    }).select()
    insertResult = { data, error: error ? { message: error.message, code: error.code, details: error.details } : null }
  }

  return NextResponse.json({
    user: user ? { id: user.id, email: user.email } : null,
    select: {
      count: logs?.length ?? 0,
      error: selectError ? { message: selectError.message, code: selectError.code } : null,
    },
    insert: insertResult,
  })
}
