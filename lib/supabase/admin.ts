import { createClient } from '@supabase/supabase-js'

/**
 * Admin client dùng SERVICE_ROLE_KEY — bypass RLS hoàn toàn.
 * CHỈ dùng trong Server Components / Route Handlers (server-side).
 * KHÔNG bao giờ expose sang client.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
