'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, EyeOff, Loader2 } from 'lucide-react'
import { publishExam } from '@/app/actions/exams'

export default function ExamPublishButton({
 examId,
 isPublished,
}: {
 examId: string
 isPublished: boolean
}) {
 const [isPending, startTransition] = useTransition()
 const router = useRouter()

 const handle = () => {
 startTransition(async () => {
 await publishExam(examId, !isPublished)
 router.refresh()
 })
 }

 return (
 <button
 onClick={handle}
 disabled={isPending}
 className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all disabled:opacity-50 ${
 isPublished
 ? 'bg-neutral text-secondary hover:bg-gray-200 :bg-slate-700'
 : 'bg-emerald-500 text-surface hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
 }`}
 >
 {isPending ? (
 <Loader2 size={14} className="animate-spin" />
 ) : isPublished ? (
 <EyeOff size={14} />
 ) : (
 <Globe size={14} />
 )}
 {isPublished ? 'Hủy công bố' : 'Công bố'}
 </button>
 )
}
