import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile && profile.role === 'student' && !profile.is_approved) {
    redirect('/pending')
  }

  // ── Fetch exam results ──────────────────────────────────────────────────────
  const { data: examResults } = await supabase
    .from('exam_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // ── Fetch enrollments + course info ────────────────────────────────────────
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, courses(id, title, grade, teacher_name, thumbnail_url, description)')
    .eq('user_id', user.id)
    .order('enrolled_at', { ascending: false })

  // ── Fetch leaderboard (same grade) ─────────────────────────────────────────
  let leaderboard: any[] = []
  if (profile?.grade) {
    const { data: leaderboardRaw } = await supabase.rpc('get_leaderboard_by_grade', {
      p_grade: profile.grade,
      p_limit: 10,
    })
    leaderboard = leaderboardRaw || []
  }

  // ── Compute stats ───────────────────────────────────────────────────────────
  const results = examResults || []
  const totalExams = results.length
  const avgScore = totalExams > 0
    ? Math.round(results.reduce((s, r) => s + (r.score / (r.total_questions || 1)) * 100, 0) / totalExams)
    : 0
  const totalCorrect = results.reduce((s, r) => s + (r.score || 0), 0)
  const totalSeconds = results.reduce((s, r) => s + (r.time_spent_seconds || 0), 0)

  // Last 7 results for line chart
  const recentChart = [...results].reverse().slice(-7).map((r) => ({
    date: new Date(r.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    score: Math.round((r.score / (r.total_questions || 1)) * 10 * 10) / 10,
    topic: r.topic || 'Luyện thi',
  }))

  // Pie chart data
  const totalQuestions = results.reduce((s, r) => s + (r.total_questions || 0), 0)
  const totalWrong = totalQuestions - totalCorrect
  const pieData = [
    { name: 'Đúng', value: totalCorrect, color: '#22c55e' },
    { name: 'Sai', value: totalWrong, color: '#ef4444' },
  ]

  // Recent 5 for history table
  const recentExams = results.slice(0, 5)

  return (
    <DashboardClient
      profile={profile}
      user={user}
      totalExams={totalExams}
      avgScore={avgScore}
      totalCorrect={totalCorrect}
      totalSeconds={totalSeconds}
      recentChart={recentChart}
      pieData={pieData}
      enrollments={enrollments || []}
      recentExams={recentExams}
      leaderboard={leaderboard}
    />
  )
}
