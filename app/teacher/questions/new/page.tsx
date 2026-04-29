import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import QuestionForm from '@/components/QuestionForm'

export default function NewQuestionPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <Link
          href="/teacher/questions"
          className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline mb-4"
        >
          <ArrowLeft size={16} /> Quay lại ngân hàng
        </Link>
        <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">Ngân hàng câu hỏi</p>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Thêm câu hỏi mới</h1>
        <p className="text-gray-500 mt-1 font-medium">Điền đầy đủ thông tin bên dưới để lưu câu hỏi vào ngân hàng.</p>
      </div>

      <QuestionForm mode="new" />
    </div>
  )
}
