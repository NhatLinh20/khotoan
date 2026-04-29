'use client'

import { Trash2, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { deleteQuestion } from '@/app/actions/questions'

export default function DeleteQuestionButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm('Bạn có chắc chắn muốn xoá câu hỏi này?')) {
      startTransition(async () => {
        await deleteQuestion(id)
      })
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 disabled:opacity-50 transition-colors"
      title="Xoá"
    >
      {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </button>
  )
}
