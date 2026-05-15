import { createAdminClient } from './lib/supabase/admin'

async function check() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('exam_results').select('*').limit(1)
  console.log(data, error)
}
check()
