'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Upload, Plus, Trash2, Loader2,
  Globe, Save, FileText, CheckCircle, ChevronRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { saveExam } from '@/app/actions/exams'

const GRADE_OPTS = [
  { v: 6, l: 'Lớp 6' }, { v: 7, l: 'Lớp 7' }, { v: 8, l: 'Lớp 8' }, { v: 9, l: 'Lớp 9' },
  { v: 10, l: 'Lớp 10' }, { v: 11, l: 'Lớp 11' }, { v: 12, l: 'Lớp 12' },
]
const SUBJECT_OPTS = [{ v: 'D', l: 'Đại số' }, { v: 'H', l: 'Hình học' }, { v: 'C', l: 'Chuyên đề' }]
const TYPE_OPTS = [
  { v: 'mc', l: 'Trắc nghiệm (MC)' }, { v: 'tf', l: 'Đúng/Sai (TF)' },
  { v: 'short', l: 'Trả lời ngắn' }, { v: 'essay', l: 'Tự luận' },
]
const TYPE_COLORS: Record<string, string> = {
  mc: 'bg-blue-100 text-blue-700', tf: 'bg-violet-100 text-violet-700',
  short: 'bg-amber-100 text-amber-700', essay: 'bg-rose-100 text-rose-700',
}

type AnswerRow = {
  _uid: string
  type: string
  correct_answer: string       // mc
  correct_number: string       // short
  max_score: string
  tf_answers: { label: 'a' | 'b' | 'c' | 'd'; is_correct: boolean }[]
}

const newRow = (): AnswerRow => ({
  _uid: Math.random().toString(36).slice(2),
  type: 'mc', correct_answer: 'A', correct_number: '',
  max_score: '1',
  tf_answers: [
    { label: 'a', is_correct: false }, { label: 'b', is_correct: false },
    { label: 'c', is_correct: false }, { label: 'd', is_correct: false },
  ],
})

const inputCls = 'w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
const labelCls = 'block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1'

const TF_SCORE_MAP = [0, 0.1, 0.25, 0.5, 1]

// Hàm này dùng khi CHẤM BÀI (so sánh đáp án học sinh vs key)
// Không dùng để tính điểm tối đa — TF luôn = 1đ/câu
export function calcTfStudentScore(studentAnswers: boolean[], keyAnswers: boolean[]): number {
  const correct = keyAnswers.filter((k, i) => k === studentAnswers[i]).length
  return TF_SCORE_MAP[correct] ?? 0
}

interface PdfBuilderProps {
  initialExamId?: string
  initialData?: {
    title: string
    description: string
    grade: number
    subject: string
    duration_min: number
    pdfUrl: string
    answers: AnswerRow[]
  }
}

export default function ExamPdfBuilder({ initialExamId, initialData }: PdfBuilderProps = {}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)

  // Step 1 — Info
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [desc, setDesc] = useState(initialData?.description ?? '')
  const [grade, setGrade] = useState<number>(initialData?.grade ?? 10)
  const [subject, setSubject] = useState(initialData?.subject ?? 'D')
  const [duration, setDuration] = useState(initialData?.duration_min ?? 45)

  // Step 2 — PDF
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl ?? '')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  // Step 3 — Answers
  const [rows, setRows] = useState<AnswerRow[]>(initialData?.answers ?? [newRow()])

  const supabase = createClient()

  const totalScore = rows.reduce((s, r) => {
    // TF câu luôn = 1đ tối đa; điểm thực tế tính khi chấm bài học sinh
    if (r.type === 'tf') return s + 1
    return s + (parseFloat(r.max_score) || 0)
  }, 0)

  const handleFileSelect = async (file: File) => {
    if (!file.type.includes('pdf')) { setError('Vui lòng chọn file PDF'); return }
    setPdfFile(file)
    setError(null)
    setUploading(true)

    // Dùng UUID để tránh ký tự tiếng Việt/đặc biệt trong tên file
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'pdf'
    const safeId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const path = `${safeId}.${ext}`

    const { data, error: upErr } = await supabase.storage
      .from('exam-pdfs').upload(path, file, { upsert: true })
    setUploading(false)
    if (upErr) { setError('Upload thất bại: ' + upErr.message); return }
    const { data: { publicUrl } } = supabase.storage.from('exam-pdfs').getPublicUrl(data.path)
    setPdfUrl(publicUrl)
  }

  const updateRow = (uid: string, patch: Partial<AnswerRow>) =>
    setRows(prev => prev.map(r => r._uid === uid ? { ...r, ...patch } : r))

  const toggleTf = (uid: string, label: 'a' | 'b' | 'c' | 'd') =>
    setRows(prev => prev.map(r =>
      r._uid === uid
        ? { ...r, tf_answers: r.tf_answers.map(t => t.label === label ? { ...t, is_correct: !t.is_correct } : t) }
        : r
    ))

  const handleSave = (publish: boolean) => {
    if (!title.trim()) { setError('Vui lòng nhập tên đề thi'); setStep(1); return }
    if (!pdfUrl) { setError('Vui lòng upload file PDF'); setStep(2); return }
    setError(null)
    startTransition(async () => {
      const questions = rows.map((r, i) => ({
        order_index: i + 1,
        type: r.type,
        correct_answer: r.type === 'mc' ? r.correct_answer : null,
        correct_number: r.type === 'short' && r.correct_number ? parseFloat(r.correct_number) : null,
        max_score: r.type === 'tf' ? 1 : parseFloat(r.max_score) || 1,
        tf_answers: r.type === 'tf' ? r.tf_answers : null,
      }))
      const res = await saveExam({
        examId: initialExamId,
        title, description: desc, grade, subject, duration_min: duration,
        exam_type: 'pdf', pdf_url: pdfUrl, is_published: publish, questions,
      })
      if (res.error) { setError(res.error); return }
      router.push('/teacher/exams')
    })
  }

  const steps = ['Thông tin', 'Upload PDF', 'Nhập đáp án', 'Xác nhận']

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/teacher/exams" className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-xl font-black text-gray-900 dark:text-white">Tạo đề từ file PDF</h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-1 flex-1">
            <button
              onClick={() => { if (i + 1 < step) setStep(i + 1) }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black transition-all flex-1 ${
                step === i + 1 ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : step > i + 1 ? 'bg-primary/10 text-primary cursor-pointer hover:bg-primary/20'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-default'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                step > i + 1 ? 'bg-primary text-white' : step === i + 1 ? 'bg-white/20' : 'bg-gray-200 dark:bg-slate-700'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </span>
              {s}
            </button>
            {i < steps.length - 1 && <ChevronRight size={14} className="text-gray-300 shrink-0" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold border border-red-100 dark:border-red-900/30">
          ⚠ {error}
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 space-y-4">
          <h2 className="text-base font-black text-gray-900 dark:text-white">Bước 1 — Thông tin đề thi</h2>
          <div>
            <label className={labelCls}>Tên đề thi *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: Đề kiểm tra 1 tiết số 1 – Lớp 10" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Mô tả</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} className={`${inputCls} resize-none`} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Khối lớp</label>
              <select value={grade} onChange={e => setGrade(Number(e.target.value))} className={inputCls}>
                {GRADE_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Môn học</label>
              <select value={subject} onChange={e => setSubject(e.target.value)} className={inputCls}>
                {SUBJECT_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Thời gian (phút)</label>
              <input type="number" min={5} value={duration} onChange={e => setDuration(Number(e.target.value))} className={inputCls} />
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={() => { if (!title.trim()) { setError('Vui lòng nhập tên đề thi'); return }; setError(null); setStep(2) }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              Tiếp theo <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 space-y-4">
          <h2 className="text-base font-black text-gray-900 dark:text-white">Bước 2 — Upload file PDF</h2>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f) }}
            onClick={() => document.getElementById('pdf-input')?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              dragOver ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-slate-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <input id="pdf-input" type="file" accept=".pdf" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }} />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 size={36} className="animate-spin text-primary" />
                <p className="text-sm font-bold text-gray-500">Đang upload...</p>
              </div>
            ) : pdfUrl ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle size={36} className="text-emerald-500" />
                <p className="text-sm font-black text-gray-900 dark:text-white">{pdfFile?.name}</p>
                <p className="text-xs text-gray-400">{pdfFile ? (pdfFile.size / 1024).toFixed(0) + ' KB' : ''} · Upload thành công</p>
                <button onClick={e => { e.stopPropagation(); setPdfFile(null); setPdfUrl('') }}
                  className="text-xs text-red-500 hover:underline mt-1">Chọn file khác</button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload size={36} className="text-gray-300" />
                <p className="text-sm font-bold text-gray-500">Kéo thả hoặc click để chọn file PDF</p>
                <p className="text-xs text-gray-400">Tối đa 20MB</p>
              </div>
            )}
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
              ← Quay lại
            </button>
            <button onClick={() => { if (!pdfUrl) { setError('Vui lòng upload file PDF'); return }; setError(null); setStep(3) }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              Tiếp theo <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-black text-gray-900 dark:text-white">Bước 3 — Nhập câu hỏi & đáp án</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-500">{rows.length} câu</span>
              <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-xl">Tổng: {totalScore.toFixed(2)} đ</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-slate-800/40 border-b border-gray-100 dark:border-slate-800">
                  <th className="px-3 py-2.5 text-left text-[10px] font-black text-gray-400 uppercase w-10">STT</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-black text-gray-400 uppercase w-36">Loại câu</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-black text-gray-400 uppercase">Đáp án</th>
                  <th className="px-3 py-2.5 text-center text-[10px] font-black text-gray-400 uppercase w-24">Điểm</th>
                  <th className="px-3 py-2.5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {rows.map((row, i) => (
                  <tr key={row._uid} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/20">
                    <td className="px-3 py-2 text-center text-xs font-black text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2">
                      <select value={row.type}
                        onChange={e => updateRow(row._uid, { type: e.target.value, correct_answer: 'A', correct_number: '', max_score: '1' })}
                        className="w-full px-2 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20">
                        {TYPE_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      {row.type === 'mc' && (
                        <div className="flex gap-1">
                          {(['A', 'B', 'C', 'D'] as const).map(l => (
                            <button key={l} type="button"
                              onClick={() => updateRow(row._uid, { correct_answer: l })}
                              className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                                row.correct_answer === l ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 hover:bg-gray-200'
                              }`}>{l}</button>
                          ))}
                        </div>
                      )}
                      {row.type === 'tf' && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] text-gray-400 font-bold mr-1">Đáp án đúng:</span>
                          {row.tf_answers.map(t => (
                            <button key={t.label} type="button"
                              onClick={() => toggleTf(row._uid, t.label)}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-black transition-all border-2 ${
                                t.is_correct
                                  ? 'bg-emerald-500 text-white border-emerald-500'
                                  : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                              }`}>
                              {t.label.toUpperCase()}: {t.is_correct ? 'Đ' : 'S'}
                            </button>
                          ))}
                          <span className="text-[10px] text-gray-400 ml-1 italic">
                            (0.1 / 0.25 / 0.5 / 1đ tùy số ý đúng)
                          </span>
                        </div>
                      )}
                      {row.type === 'short' && (
                        <input type="number" step="any" value={row.correct_number}
                          onChange={e => updateRow(row._uid, { correct_number: e.target.value })}
                          placeholder="Đáp số..."
                          className="px-2 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs w-32 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      )}
                      {row.type === 'essay' && (
                        <span className="text-xs text-gray-400 italic">Chấm thủ công sau khi thi</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {row.type === 'tf' ? (
                        <span className="text-center text-xs font-black text-primary block">1.00</span>
                      ) : (
                        <input type="number" step="0.25" min="0" value={row.max_score}
                          onChange={e => updateRow(row._uid, { max_score: e.target.value })}
                          className="w-full px-2 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-center focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button onClick={() => setRows(prev => prev.filter(r => r._uid !== row._uid))}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <button onClick={() => setRows(prev => [...prev, newRow()])}
              className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-colors">
              <Plus size={14} /> Thêm câu
            </button>
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
                ← Quay lại
              </button>
              <button onClick={() => { setError(null); setStep(4) }}
                className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                Xác nhận <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 space-y-5">
          <h2 className="text-base font-black text-gray-900 dark:text-white">Bước 4 — Xác nhận & Lưu</h2>

          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-5 space-y-3 border border-gray-100 dark:border-slate-700">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Tên đề thi', title],
                ['Khối lớp', GRADE_OPTS.find(o => o.v === grade)?.l ?? ''],
                ['Môn học', SUBJECT_OPTS.find(o => o.v === subject)?.l ?? ''],
                ['Thời gian', `${duration} phút`],
                ['Số câu', `${rows.length} câu`],
                ['Tổng điểm', `${totalScore.toFixed(2)} điểm`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <span className="text-gray-400 font-bold text-xs w-24 shrink-0">{k}:</span>
                  <span className="font-black text-gray-900 dark:text-white">{v}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-gray-200 dark:border-slate-700 flex items-center gap-3">
              <FileText size={16} className="text-orange-500 shrink-0" />
              <div>
                <p className="text-xs font-black text-gray-700 dark:text-gray-300">File PDF đề thi</p>
                <p className="text-[11px] text-gray-400 truncate max-w-sm">{pdfFile?.name}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-between">
            <button onClick={() => setStep(3)} className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
              ← Quay lại
            </button>
            <div className="flex gap-3">
              <button onClick={() => handleSave(false)} disabled={isPending}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50">
                {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                Lưu nháp
              </button>
              <button onClick={() => handleSave(true)} disabled={isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                <Globe size={15} /> Công bố ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
