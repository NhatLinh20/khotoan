'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { enrollCourse } from '@/app/actions/enrollment'
import { CheckCircle, Loader2, BookOpen } from 'lucide-react'

interface EnrollButtonProps {
  courseId: string
  isEnrolled: boolean
  isLoggedIn: boolean
  price: number
}

function formatPrice(price: number) {
  if (price === 0) return 'Đăng nhập'
  return `Đăng ký — ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}`
}

export default function EnrollButton({ courseId, isEnrolled, isLoggedIn, price }: EnrollButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [enrolled, setEnrolled] = useState(isEnrolled)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleEnroll = () => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    setError(null)
    startTransition(async () => {
      const result = await enrollCourse(courseId)
      if (result?.error) {
        setError(result.error)
      } else {
        setEnrolled(true)
      }
    })
  }

  if (enrolled) {
    return (
      <div className="w-full flex items-center justify-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-400 py-2.5 rounded-2xl font-black text-lg">
        <CheckCircle size={22} />
        Đã đăng ký học
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleEnroll}
        disabled={isPending}
        className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white py-2.5 rounded-2xl font-black text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/30"
      >
        {isPending ? (
          <><Loader2 size={20} className="animate-spin" /> Đang xử lý...</>
        ) : (
          <><BookOpen size={20} /> {formatPrice(price)}</>
        )}
      </button>
      {!isLoggedIn && (
        <p className="text-center text-[11px] text-gray-400 font-medium">
          Đăng nhập để xem toàn bộ video bài giảng
        </p>
      )}
      {error && (
        <p className="text-center text-sm text-red-500 font-bold">{error}</p>
      )}
    </div>
  )
}
