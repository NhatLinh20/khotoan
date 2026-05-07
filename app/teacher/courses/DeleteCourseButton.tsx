'use client'

import { Trash2, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { deleteCourse } from '@/app/actions/courses'

export default function DeleteCourseButton({ id }: { id: string }) {
 const [isPending, startTransition] = useTransition()

 const handleDelete = () => {
 if (confirm('Bạn có chắc muốn xóa không?')) {
 startTransition(async () => {
 await deleteCourse(id)
 })
 }
 }

 return (
 <button
 type="button"
 onClick={handleDelete}
 disabled={isPending}
 className="p-2 rounded-md bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-50 transition-colors"
 title="Xoá"
 >
 {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
 </button>
 )
}
