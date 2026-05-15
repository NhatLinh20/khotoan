import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, XCircle, Clock, BookOpen, Trophy, HelpCircle } from 'lucide-react'

// ──────────────────────────────────
// Types
// ──────────────────────────────────
type TfAnswer = { label: string; is_correct: boolean }

type Question = {
  id: string
  order_index: number
  type: string
  correct_answer?: string | null
  correct_number?: number | null
  max_score?: number | null
  tf_answers?: TfAnswer[] | null
  questions?: { content: string } | null
}

type StudentAnswer = {
  mc?: string
  tf?: Record<string, boolean>
  short?: string
  essay?: string
}

const TF_SCORE_MAP = [0, 0.1, 0.25, 0.5, 1]

// ──────────────────────────────────
// Scoring logic
// ──────────────────────────────────
function scoreQuestion(q: Question, a: StudentAnswer): { score: number; status: 'correct' | 'wrong' | 'partial' | 'pending'; tfText?: string } {
  const max = q.max_score ?? 1
  if (q.type === 'mc') {
    if (!a?.mc) return { score: 0, status: 'wrong' }
    return a.mc === q.correct_answer
      ? { score: max, status: 'correct' }
      : { score: 0, status: 'wrong' }
  }
  if (q.type === 'tf') {
    const key = q.tf_answers ?? []
    const tfMap = a?.tf ?? {}
    const correctCount = key.filter(k => tfMap[k.label] === k.is_correct).length
    const s = TF_SCORE_MAP[correctCount] ?? 0
    const status = correctCount === key.length ? 'correct' : correctCount > 0 ? 'partial' : 'wrong'
    return { score: s, status, tfText: `${correctCount}/${key.length} ý` }
  }
  if (q.type === 'short') {
    const studentNum = parseFloat(a?.short ?? '')
    if (isNaN(studentNum)) return { score: 0, status: 'wrong' }
    const correct = Math.abs(studentNum - (q.correct_number ?? 0)) <= 0.01
    return { score: correct ? max : 0, status: correct ? 'correct' : 'wrong' }
  }
  if (q.type === 'essay') {
    return { score: 0, status: 'pending' }
  }
  return { score: 0, status: 'wrong' }
}

function formatAnswer(q: Question, a: StudentAnswer): string {
  if (!a) return '—'
  if (q.type === 'mc') return a.mc ?? '—'
  if (q.type === 'tf') {
    const labels = ['a', 'b', 'c', 'd']
    return labels.map(l => `${l.toUpperCase()}:${a.tf?.[l] === true ? 'Đ' : a.tf?.[l] === false ? 'S' : '?'}`).join(' ')
  }
  if (q.type === 'short') return a.short ?? '—'
  if (q.type === 'essay') return (a.essay ?? '').slice(0, 40) || '—'
  return '—'
}

function formatCorrect(q: Question): string {
  if (q.type === 'mc') return q.correct_answer ?? '—'
  if (q.type === 'tf') {
    const answers = q.tf_answers ?? []
    return answers.map(t => `${t.label.toUpperCase()}:${t.is_correct ? 'Đ' : 'S'}`).join(' ')
  }
  if (q.type === 'short') return String(q.correct_number ?? '—')
  if (q.type === 'essay') return '(GV chấm)'
  return '—'
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m} phút ${s} giây`
}

export default async function TeacherResultDetailView({
  params,
}: {
  params: Promise<{ id: string, resultId: string }>
}) {
  const { id, resultId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminSupabase = createAdminClient()

  // Fetch result details
  const { data: rawResult } = await adminSupabase
    .from('exam_results')
    .select('id, user_id, score, total_questions, time_spent_seconds, created_at, detail_answers')
    .eq('id', resultId)
    .single()

  if (!rawResult) notFound()

  // Fetch profile separately
  const { data: profileData } = await adminSupabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', rawResult.user_id)
    .single()
    
  const profile = profileData || { full_name: 'Học sinh', email: '' }
  const answers = rawResult.detail_answers || {}

  // Fetch exam
  const { data: exam } = await supabase
    .from('exams')
    .select('*')
    .eq('id', id)
    .single()

  if (!exam) notFound()

  // Fetch questions
  const { data: examQs } = await supabase
    .from('exam_questions')
    .select('*, questions(question_code, type, difficulty, content)')
    .eq('exam_id', id)
    .order('order_index')

  const questions = (examQs ?? []) as Question[]

  // Compute scores based on answers payload
  const results = questions.map(q => ({
    question: q,
    answer: answers[q.id] ?? {},
    ...scoreQuestion(q, answers[q.id] ?? {}),
  }))

  const totalScore = results.reduce((s, r) => s + r.score, 0)
  const maxTotal = questions.reduce((s, q) => s + (q.max_score ?? 1), 0)
  const correctCount = results.filter(r => r.status === 'correct').length
  const wrongCount = results.filter(r => r.status === 'wrong').length
  const pendingCount = results.filter(r => r.status === 'pending').length
  const pct = maxTotal > 0 ? Math.round((totalScore / maxTotal) * 100) : 0

  const grade = pct >= 90 ? 'Xuất sắc' : pct >= 70 ? 'Khá' : pct >= 50 ? 'Trung bình' : 'Cần cố gắng'
  const gradeColor = pct >= 90 ? 'text-emerald-500' : pct >= 70 ? 'text-blue-500' : pct >= 50 ? 'text-amber-500' : 'text-tertiary'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/teacher/exams/${id}`}
          className="p-2 rounded-md bg-neutral hover:bg-gray-200 text-secondary transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-display font-bold text-primary truncate">Kết quả của {profile.full_name}</h1>
          <p className="text-sm text-secondary mt-0.5">
            {profile.email} • {exam.title}
          </p>
        </div>
      </div>

      {/* Score Card */}
      <div className="bg-surface rounded-lg border border-secondary/20 shadow-sm overflow-hidden">
        <div className="bg-neutral px-6 py-8 text-center border-b border-secondary/20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-md bg-surface border border-secondary/20 shadow-sm mb-4">
            <Trophy className={`${gradeColor}`} size={36} />
          </div>
          <p className="text-[0.95rem] text-secondary mb-4">Điểm số</p>
          <div className={`text-5xl font-display font-bold tabular-nums ${gradeColor} mb-1`}>
            {totalScore.toFixed(2)}
            <span className="text-2xl text-secondary">/{maxTotal.toFixed(0)}</span>
          </div>
          <p className={`text-lg font-display font-bold ${gradeColor}`}>{grade} — {pct}%</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y md:divide-y-0 divide-secondary/20">
          <div className="px-4 py-5 text-center">
            <CheckCircle2 className="mx-auto mb-1.5 text-emerald-500" size={20} />
            <p className="text-[1.2rem] font-display font-bold text-primary">{correctCount}</p>
            <p className="text-[0.78rem] text-secondary font-display font-bold uppercase tracking-[0.14em]">Câu đúng</p>
          </div>
          <div className="px-4 py-5 text-center">
            <XCircle className="mx-auto mb-1.5 text-tertiary" size={20} />
            <p className="text-[1.2rem] font-display font-bold text-primary">{wrongCount}</p>
            <p className="text-[0.78rem] text-secondary font-display font-bold uppercase tracking-[0.14em]">Câu sai</p>
          </div>
          <div className="px-4 py-5 text-center">
            <HelpCircle className="mx-auto mb-1.5 text-secondary" size={20} />
            <p className="text-[1.2rem] font-display font-bold text-primary">{pendingCount}</p>
            <p className="text-[0.78rem] text-secondary font-display font-bold uppercase tracking-[0.14em]">Chờ chấm</p>
          </div>
          <div className="px-4 py-5 text-center">
            <Clock className="mx-auto mb-1.5 text-blue-500" size={20} />
            <p className="text-[0.95rem] font-display font-bold text-primary">{formatTime(rawResult.time_spent_seconds ?? 0)}</p>
            <p className="text-[0.78rem] text-secondary font-display font-bold uppercase tracking-[0.14em]">Thời gian</p>
          </div>
        </div>
      </div>

      {!rawResult.detail_answers && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 text-sm">
          <strong>Lưu ý:</strong> Bài thi này được nộp trước khi hệ thống lưu chi tiết đáp án, nên không có danh sách đúng sai từng câu.
        </div>
      )}

      {/* Review Table */}
      <div className="bg-surface rounded-lg border border-secondary/20 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-secondary/20">
          <h2 className="text-[0.95rem] font-display font-bold text-primary flex items-center gap-2">
            <BookOpen size={16} className="text-primary" /> Chi tiết bài làm
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[0.95rem]">
            <thead>
              <tr className="bg-neutral border-b border-secondary/20">
                <th className="px-3 py-2.5 text-left text-[0.78rem] font-display font-bold text-secondary uppercase tracking-[0.14em] w-10">STT</th>
                <th className="px-3 py-2.5 text-center text-[0.78rem] font-display font-bold text-secondary uppercase tracking-[0.14em] w-32">HS chọn</th>
                <th className="px-3 py-2.5 text-center text-[0.78rem] font-display font-bold text-secondary uppercase tracking-[0.14em] w-32">Đáp án đúng</th>
                <th className="px-3 py-2.5 text-center text-[0.78rem] font-display font-bold text-secondary uppercase tracking-[0.14em] w-20">Điểm</th>
                <th className="px-3 py-2.5 text-center text-[0.78rem] font-display font-bold text-secondary uppercase tracking-[0.14em] w-24">Kết quả</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/20">
              {results.map(({ question: q, answer: a, score, status, tfText }) => (
                <tr key={q.id} className="hover:bg-neutral/50">
                  <td className="px-3 py-3 text-center text-[0.78rem] font-display font-bold text-secondary">{q.order_index}</td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-[0.95rem] font-bold text-secondary font-mono">
                      {formatAnswer(q, a)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-[0.95rem] font-bold text-emerald-600 font-mono">
                      {formatCorrect(q)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-[0.95rem] font-display font-bold text-primary">{score.toFixed(2)}</span>
                    <span className="text-[0.78rem] text-secondary">/{q.max_score ?? 1}</span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    {status === 'correct' && q.type !== 'tf' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-display font-bold bg-emerald-100 text-emerald-700">
                        <CheckCircle2 size={10} /> Đúng
                      </span>
                    )}
                    {q.type === 'tf' && (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-display font-bold ${
                        status === 'correct' ? 'bg-emerald-100 text-emerald-700' :
                        status === 'partial' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {status === 'wrong' ? <XCircle size={10} /> : <CheckCircle2 size={10} />} {tfText}
                      </span>
                    )}
                    {status === 'wrong' && q.type !== 'tf' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-display font-bold bg-red-100 text-red-700">
                        <XCircle size={10} /> Sai
                      </span>
                    )}
                    {status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-display font-bold bg-secondary/10 text-secondary">
                        <HelpCircle size={10} /> Chờ chấm
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
