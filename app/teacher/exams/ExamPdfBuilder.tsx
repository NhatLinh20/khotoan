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
 correct_answer: string // mc
 correct_number: string // short
 max_score: string
 tf_answers: { label: 'a' | 'b' | 'c' | 'd'; is_correct: boolean }[]
}

const mkRow = (type: string, score: string): AnswerRow => ({
 _uid: Math.random().toString(36).slice(2),
 type, correct_answer: 'A', correct_number: '',
 max_score: score,
 tf_answers: [
 { label: 'a', is_correct: false }, { label: 'b', is_correct: false },
 { label: 'c', is_correct: false }, { label: 'd', is_correct: false },
],
})

const inputCls = 'w-full px-3 py-2.5 bg-neutral border border-secondary/20 rounded-md text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
const labelCls = 'block text-[11px] font-display font-bold text-secondary/80 uppercase tracking-widest mb-1'
const miniInputCls = 'w-20 px-2 py-1.5 bg-neutral border border-secondary/20 rounded-lg text-sm text-center text-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

const TF_SCORE_MAP = [0, 0.1, 0.25, 0.5, 1]

// Hàm này dùng khi CHẤM BÀI (so sánh đáp án học sinh vs key)
// Không dùng để tính điểm tối đa — TF luôn = 1đ/câu
export function calcTfStudentScore(studentAnswers: boolean[], keyAnswers: boolean[]): number {
 const correct = keyAnswers.filter((k, i) => k === studentAnswers[i]).length
 return TF_SCORE_MAP[correct] ?? 0
}

type QConfig = { count: number; totalScore: number }
type QConfigs = { mc: QConfig; tf: QConfig; short: QConfig; essay: QConfig }

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

 // Step 3 — Question config & Answers
 const [qConfig, setQConfig] = useState<QConfigs>({
 mc: { count: 0, totalScore: 0 }, tf: { count: 0, totalScore: 0 },
 short: { count: 0, totalScore: 0 }, essay: { count: 0, totalScore: 0 },
 })
 const [rows, setRows] = useState<AnswerRow[]>(initialData?.answers ?? [])
 const [generated, setGenerated] = useState(false)

 const supabase = createClient()

 const totalScore = rows.reduce((s, r) => s + (parseFloat(r.max_score) || 0), 0)
 const totalCount = rows.length

 const generateRows = () => {
 const all: AnswerRow[] = []
 for (const t of ['mc', 'tf', 'short', 'essay'] as const) {
 const cfg = qConfig[t]
 if (cfg.count <= 0) continue
 const perQ = cfg.count > 0 ? cfg.totalScore / cfg.count : 0
 for (let i = 0; i < cfg.count; i++) {
 all.push(mkRow(t, t === 'tf' ? '1' : perQ.toFixed(2)))
 }
 }
 setRows(all)
 setGenerated(true)
 }

 const handleFileSelect = async (file: File) => {
 if (!file.type.includes('pdf')) { setError('Vui lòng chọn file PDF'); return }
 setPdfFile(file)
 setError(null)
 setUploading(true)

 // Dùng UUID để tránh ký tự tiếng Việt/đặc biệt trong tên file
 const ext = file.name.split('.').pop()?.toLowerCase() ?? 'pdf'
 const safeId =`${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
 const path =`${safeId}.${ext}`

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
 <Link href="/teacher/exams" className="p-2 rounded-md bg-neutral hover:bg-gray-200 :bg-slate-700 text-secondary transition-colors">
 <ArrowLeft size={16} />
 </Link>
 <h1 className="text-xl font-display font-bold text-primary">Tạo đề từ file PDF</h1>
 </div>

 {/* Stepper */}
 <div className="flex items-center gap-1">
 {steps.map((s, i) => (
 <div key={i} className="flex items-center gap-1 flex-1">
 <button
 onClick={() => { if (i + 1 < step) setStep(i + 1) }}
 className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-display font-bold transition-all flex-1 ${
 step === i + 1 ? 'bg-primary text-surface shadow-lg shadow-primary/20'
 : step > i + 1 ? 'bg-primary/10 text-primary cursor-pointer hover:bg-primary/20'
 : 'bg-neutral text-secondary/80 cursor-default'
 }`}
 >
 <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-display font-bold shrink-0 ${
 step > i + 1 ? 'bg-primary text-surface' : step === i + 1 ? 'bg-surface/20' : 'bg-gray-200 '
 }`}>
 {step > i + 1 ? '✓' : i + 1}
 </span>
 {s}
 </button>
 {i < steps.length - 1 && <ChevronRight size={14} className="text-secondary/50 shrink-0" />}
 </div>
 ))}
 </div>

 {error && (
 <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm font-bold border border-red-100">
 ⚠ {error}
 </div>
 )}

 {/* Step 1 */}
 {step === 1 && (
 <div className="bg-surface rounded-md border border-secondary/20 p-6 space-y-4">
 <h2 className="text-base font-display font-bold text-primary">Bước 1 — Thông tin đề thi</h2>
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
 className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-surface rounded-md font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
 Tiếp theo <ChevronRight size={15} />
 </button>
 </div>
 </div>
 )}

 {/* Step 2 */}
 {step === 2 && (
 <div className="bg-surface rounded-md border border-secondary/20 p-6 space-y-4">
 <h2 className="text-base font-display font-bold text-primary">Bước 2 — Upload file PDF</h2>
 <div
 onDragOver={e => { e.preventDefault(); setDragOver(true) }}
 onDragLeave={() => setDragOver(false)}
 onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f) }}
 onClick={() => document.getElementById('pdf-input')?.click()}
 className={`border-2 border-dashed rounded-md p-10 text-center cursor-pointer transition-all ${
 dragOver ? 'border-primary bg-primary/5' : 'border-secondary/20 hover:border-primary/50 hover:bg-neutral :bg-slate-800/50'
 }`}
 >
 <input id="pdf-input" type="file" accept=".pdf" className="hidden"
 onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }} />
 {uploading ? (
 <div className="flex flex-col items-center gap-2">
 <Loader2 size={36} className="animate-spin text-primary" />
 <p className="text-sm font-bold text-secondary">Đang upload...</p>
 </div>
 ) : pdfUrl ? (
 <div className="flex flex-col items-center gap-2">
 <CheckCircle size={36} className="text-emerald-500" />
 <p className="text-sm font-display font-bold text-primary">{pdfFile?.name}</p>
 <p className="text-xs text-secondary/80">{pdfFile ? (pdfFile.size / 1024).toFixed(0) + ' KB' : ''} · Upload thành công</p>
 <button onClick={e => { e.stopPropagation(); setPdfFile(null); setPdfUrl('') }}
 className="text-xs text-red-500 hover:underline mt-1">Chọn file khác</button>
 </div>
 ) : (
 <div className="flex flex-col items-center gap-2">
 <Upload size={36} className="text-secondary/50" />
 <p className="text-sm font-bold text-secondary">Kéo thả hoặc click để chọn file PDF</p>
 <p className="text-xs text-secondary/80">Tối đa 20MB</p>
 </div>
 )}
 </div>
 <div className="flex justify-between">
 <button onClick={() => setStep(1)} className="px-4 py-2 rounded-md border border-secondary/20 text-sm font-bold text-secondary hover:bg-neutral :bg-slate-800 transition-all">
 ← Quay lại
 </button>
 <button onClick={() => { if (!pdfUrl) { setError('Vui lòng upload file PDF'); return }; setError(null); setStep(3) }}
 className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-surface rounded-md font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
 Tiếp theo <ChevronRight size={15} />
 </button>
 </div>
 </div>
 )}

 {/* Step 3 */}
 {step === 3 && (
 <div className="space-y-4">
 {/* CONFIG PANEL */}
 <div className="bg-surface rounded-md border border-secondary/20 p-5 space-y-4">
 <h2 className="text-base font-display font-bold text-primary">Bước 3 — Cấu hình số câu &amp; điểm</h2>
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead><tr className="border-b border-secondary/20">
 <th className="text-left py-2 px-3 text-[10px] font-display font-bold text-secondary/80 uppercase">Loại câu</th>
 <th className="text-center py-2 px-3 text-[10px] font-display font-bold text-secondary/80 uppercase w-28">Số câu</th>
 <th className="text-center py-2 px-3 text-[10px] font-display font-bold text-secondary/80 uppercase w-32">Tổng điểm loại</th>
 </tr></thead>
 <tbody className="divide-y divide-gray-50">
 {([
 { key: 'mc' as const, label: 'Trắc nghiệm (MC)', color: 'bg-blue-100 text-blue-700 ' },
 { key: 'tf' as const, label: 'Đúng/Sai (TF)', color: 'bg-violet-100 text-violet-700 ', note: 'Mặc định 1đ/câu' },
 { key: 'short' as const, label: 'Trả lời ngắn', color: 'bg-amber-100 text-amber-700 ' },
 { key: 'essay' as const, label: 'Tự luận', color: 'bg-rose-100 text-rose-700 ' },
]).map(t => (
 <tr key={t.key}>
 <td className="py-2.5 px-3">
 <span className={`text-xs font-display font-bold px-2 py-1 rounded-lg ${t.color}`}>{t.label}</span>
 {t.note && <span className="text-[10px] text-secondary/80 ml-2 italic">{t.note}</span>}
 </td>
 <td className="py-2.5 px-3 text-center">
 <input type="number" min={0} value={qConfig[t.key].count || ''}
 onChange={e => {
 const v = parseInt(e.target.value) || 0
 setQConfig(p => ({ ...p, [t.key]: { ...p[t.key], count: v, totalScore: t.key === 'tf' ? v : p[t.key].totalScore } }))
 }}
 className={miniInputCls} placeholder="0" />
 </td>
 <td className="py-2.5 px-3 text-center">
 {t.key === 'tf' ? (
 <span className="text-xs font-display font-bold text-violet-600">{qConfig.tf.count}đ</span>
 ) : (
 <input type="number" min={0} step={0.5} value={qConfig[t.key].totalScore || ''}
 onChange={e => setQConfig(p => ({ ...p, [t.key]: { ...p[t.key], totalScore: parseFloat(e.target.value) || 0 } }))}
 className={miniInputCls} placeholder="0" />
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <div className="flex items-center justify-between pt-3 border-t border-secondary/20">
 <div className="flex items-center gap-4 text-sm">
 <span className="font-bold text-secondary">Tổng: <b className="text-primary">{qConfig.mc.count + qConfig.tf.count + qConfig.short.count + qConfig.essay.count} câu</b></span>
 <span className="font-display font-bold text-primary bg-primary/10 px-3 py-1 rounded-md">
 {(qConfig.mc.totalScore + qConfig.tf.count + qConfig.short.totalScore + qConfig.essay.totalScore).toFixed(1)} điểm
 </span>
 </div>
 <button onClick={generateRows}
 className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-surface rounded-md font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
 <Plus size={15} /> Tạo danh sách câu
 </button>
 </div>
 </div>

 {/* GROUPED ANSWER TABLES */}
 {generated && rows.length > 0 && (() => {
 const mcRows = rows.filter(r => r.type === 'mc')
 const tfRows = rows.filter(r => r.type === 'tf')
 const shortRows = rows.filter(r => r.type === 'short')
 const essayRows = rows.filter(r => r.type === 'essay')
 let globalIdx = 0
 const secCls ="bg-surface rounded-md border border-secondary/20 overflow-hidden"
 const thC ="px-3 py-2 text-[10px] font-display font-bold text-secondary/80 uppercase"
 const tdC ="px-3 py-2"
 const scCls ="w-20 px-2 py-1.5 bg-neutral border border-secondary/20 rounded-lg text-xs text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
 const delBtn = (uid: string) => (
 <button onClick={() => setRows(p => p.filter(r => r._uid !== uid))}
 className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 :bg-red-900/20 transition-colors"><Trash2 size={13}/></button>
 )
 return (<>
 {mcRows.length > 0 && (<div className={secCls}>
 <div className="px-4 py-3 bg-blue-50/50 border-b border-secondary/20">
 <span className="text-xs font-display font-bold text-blue-700 uppercase tracking-wider">Trắc nghiệm — {mcRows.length} câu · {(parseFloat(mcRows[0]?.max_score)||0).toFixed(2)}đ/câu</span>
 </div>
 <table className="w-full text-sm"><thead><tr className="border-b border-secondary/20">
 <th className={`${thC} w-12 text-center`}>STT</th><th className={`${thC} text-left`}>Đáp án</th>
 <th className={`${thC} w-24 text-center`}>Điểm</th><th className={`${thC} w-10`}></th>
 </tr></thead><tbody className="divide-y divide-gray-50">
 {mcRows.map(row => { globalIdx++; return (
 <tr key={row._uid} className="hover:bg-neutral/50 :bg-slate-800/20">
 <td className={`${tdC} text-center text-xs font-display font-bold text-secondary/80`}>{globalIdx}</td>
 <td className={tdC}><div className="flex gap-1">
 {(['A','B','C','D'] as const).map(l => (
 <button key={l} type="button" onClick={() => updateRow(row._uid, { correct_answer: l })}
 className={`w-8 h-8 rounded-lg text-xs font-display font-bold transition-all ${row.correct_answer === l ? 'bg-primary text-surface' : 'bg-neutral text-secondary hover:bg-gray-200'}`}>{l}</button>
 ))}
 </div></td>
 <td className={`${tdC} text-center`}><input type="number" step="0.25" min="0" value={row.max_score} onChange={e => updateRow(row._uid, { max_score: e.target.value })} className={scCls}/></td>
 <td className={`${tdC} text-center`}>{delBtn(row._uid)}</td>
 </tr>
 )})}
 </tbody></table>
 </div>)}

 {tfRows.length > 0 && (<div className={secCls}>
 <div className="px-4 py-3 bg-violet-50/50 border-b border-secondary/20">
 <span className="text-xs font-display font-bold text-violet-700 uppercase tracking-wider">Đúng/Sai — {tfRows.length} câu</span>
 <span className="text-[10px] text-secondary/80 ml-2 italic">(0.1/0.25/0.5/1đ tùy số ý đúng)</span>
 </div>
 <table className="w-full text-sm"><thead><tr className="border-b border-secondary/20">
 <th className={`${thC} w-12 text-center`}>STT</th>
 <th className={`${thC} text-center w-16`}>a</th><th className={`${thC} text-center w-16`}>b</th>
 <th className={`${thC} text-center w-16`}>c</th><th className={`${thC} text-center w-16`}>d</th>
 <th className={`${thC} w-24 text-center`}>Điểm</th><th className={`${thC} w-10`}></th>
 </tr></thead><tbody className="divide-y divide-gray-50">
 {tfRows.map(row => { globalIdx++; return (
 <tr key={row._uid} className="hover:bg-neutral/50 :bg-slate-800/20">
 <td className={`${tdC} text-center text-xs font-display font-bold text-secondary/80`}>{globalIdx}</td>
 {row.tf_answers.map(t => (
 <td key={t.label} className={`${tdC} text-center`}>
 <button type="button" onClick={() => toggleTf(row._uid, t.label)}
 className={`w-10 h-8 rounded-lg text-xs font-display font-bold transition-all border-2 ${t.is_correct ? 'bg-emerald-500 text-surface border-emerald-500' : 'bg-red-50 text-red-500 border-red-200 '}`}>
 {t.is_correct ? 'Đ' : 'S'}
 </button>
 </td>
 ))}
 <td className={`${tdC} text-center`}><input type="number" step="0.25" min="0" value={row.max_score} onChange={e => updateRow(row._uid, { max_score: e.target.value })} className={scCls}/></td>
 <td className={`${tdC} text-center`}>{delBtn(row._uid)}</td>
 </tr>
 )})}
 </tbody></table>
 </div>)}

 {shortRows.length > 0 && (<div className={secCls}>
 <div className="px-4 py-3 bg-amber-50/50 border-b border-secondary/20">
 <span className="text-xs font-display font-bold text-amber-700 uppercase tracking-wider">Trả lời ngắn — {shortRows.length} câu · {(parseFloat(shortRows[0]?.max_score)||0).toFixed(2)}đ/câu</span>
 </div>
 <table className="w-full text-sm"><thead><tr className="border-b border-secondary/20">
 <th className={`${thC} w-12 text-center`}>STT</th><th className={`${thC} text-left`}>Đáp số</th>
 <th className={`${thC} w-24 text-center`}>Điểm</th><th className={`${thC} w-10`}></th>
 </tr></thead><tbody className="divide-y divide-gray-50">
 {shortRows.map(row => { globalIdx++; return (
 <tr key={row._uid} className="hover:bg-neutral/50 :bg-slate-800/20">
 <td className={`${tdC} text-center text-xs font-display font-bold text-secondary/80`}>{globalIdx}</td>
 <td className={tdC}><input type="number" step="any" value={row.correct_number} onChange={e => updateRow(row._uid, { correct_number: e.target.value })} placeholder="Đáp số..."
 className="px-2 py-1.5 bg-neutral border border-secondary/20 rounded-lg text-xs w-32 focus:outline-none focus:ring-2 focus:ring-primary/20"/></td>
 <td className={`${tdC} text-center`}><input type="number" step="0.25" min="0" value={row.max_score} onChange={e => updateRow(row._uid, { max_score: e.target.value })} className={scCls}/></td>
 <td className={`${tdC} text-center`}>{delBtn(row._uid)}</td>
 </tr>
 )})}
 </tbody></table>
 </div>)}

 {essayRows.length > 0 && (<div className={secCls}>
 <div className="px-4 py-3 bg-rose-50/50 border-b border-secondary/20">
 <span className="text-xs font-display font-bold text-rose-700 uppercase tracking-wider">Tự luận — {essayRows.length} câu</span>
 </div>
 <table className="w-full text-sm"><thead><tr className="border-b border-secondary/20">
 <th className={`${thC} w-12 text-center`}>STT</th><th className={`${thC} text-left`}>Ghi chú</th>
 <th className={`${thC} w-24 text-center`}>Điểm tối đa</th><th className={`${thC} w-10`}></th>
 </tr></thead><tbody className="divide-y divide-gray-50">
 {essayRows.map(row => { globalIdx++; return (
 <tr key={row._uid} className="hover:bg-neutral/50 :bg-slate-800/20">
 <td className={`${tdC} text-center text-xs font-display font-bold text-secondary/80`}>{globalIdx}</td>
 <td className={tdC}><span className="text-xs text-secondary/80 italic">Chấm thủ công</span></td>
 <td className={`${tdC} text-center`}><input type="number" step="0.5" min="0" value={row.max_score} onChange={e => updateRow(row._uid, { max_score: e.target.value })} className={scCls}/></td>
 <td className={`${tdC} text-center`}>{delBtn(row._uid)}</td>
 </tr>
 )})}
 </tbody></table>
 </div>)}

 {/* Summary + Nav */}
 <div className="bg-surface rounded-md border border-secondary/20 px-5 py-4 flex items-center justify-between">
 <div className="flex items-center gap-4">
 <span className="text-sm font-bold text-secondary">{totalCount} câu</span>
 <span className="text-sm font-display font-bold text-primary bg-primary/10 px-3 py-1 rounded-md">Tổng: {totalScore.toFixed(2)} điểm</span>
 </div>
 <div className="flex gap-2">
 <button onClick={() => setStep(2)} className="px-4 py-2 rounded-md border border-secondary/20 text-sm font-bold text-secondary hover:bg-neutral :bg-slate-800 transition-all">← Quay lại</button>
 <button onClick={() => { setError(null); setStep(4) }}
 className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-surface rounded-md font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
 Xác nhận <ChevronRight size={15} />
 </button>
 </div>
 </div>
 </>)
 })()}

 {!generated && (
 <div className="flex justify-between">
 <button onClick={() => setStep(2)} className="px-4 py-2 rounded-md border border-secondary/20 text-sm font-bold text-secondary hover:bg-neutral :bg-slate-800 transition-all">← Quay lại</button>
 </div>
 )}
 </div>
 )}

 {/* Step 4 */}
 {step === 4 && (
 <div className="bg-surface rounded-md border border-secondary/20 p-6 space-y-5">
 <h2 className="text-base font-display font-bold text-primary">Bước 4 — Xác nhận & Lưu</h2>

 <div className="bg-neutral rounded-md p-5 space-y-3 border border-secondary/20">
 <div className="grid grid-cols-2 gap-3 text-sm">
 {[
 ['Tên đề thi', title],
 ['Khối lớp', GRADE_OPTS.find(o => o.v === grade)?.l ?? ''],
 ['Môn học', SUBJECT_OPTS.find(o => o.v === subject)?.l ?? ''],
 ['Thời gian',`${duration} phút`],
 ['Số câu',`${rows.length} câu`],
 ['Tổng điểm',`${totalScore.toFixed(2)} điểm`],
].map(([k, v]) => (
 <div key={k} className="flex items-center gap-2">
 <span className="text-secondary/80 font-bold text-xs w-24 shrink-0">{k}:</span>
 <span className="font-display font-bold text-primary">{v}</span>
 </div>
 ))}
 </div>
 <div className="pt-3 border-t border-secondary/20 flex items-center gap-3">
 <FileText size={16} className="text-orange-500 shrink-0" />
 <div>
 <p className="text-xs font-display font-bold text-gray-700">File PDF đề thi</p>
 <p className="text-[11px] text-secondary/80 truncate max-w-sm">{pdfFile?.name}</p>
 </div>
 </div>
 </div>

 <div className="flex gap-3 justify-between">
 <button onClick={() => setStep(3)} className="px-4 py-2 rounded-md border border-secondary/20 text-sm font-bold text-secondary hover:bg-neutral :bg-slate-800 transition-all">
 ← Quay lại
 </button>
 <div className="flex gap-3">
 <button onClick={() => handleSave(false)} disabled={isPending}
 className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-secondary/20 text-sm font-bold text-secondary hover:bg-neutral :bg-slate-800 transition-all disabled:opacity-50">
 {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
 Lưu nháp
 </button>
 <button onClick={() => handleSave(true)} disabled={isPending}
 className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-surface rounded-md font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
 <Globe size={15} /> Công bố ngay
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 )
}
