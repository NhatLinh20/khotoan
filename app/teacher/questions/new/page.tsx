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
 <p className="text-xs font-display font-bold text-primary uppercase tracking-widest mb-1">Ngân hàng câu hỏi</p>
 <h1 className="text-3xl font-display font-bold text-primary">Thêm câu hỏi mới</h1>
 <p className="text-secondary mt-1 font-medium">Điền đầy đủ thông tin bên dưới để lưu câu hỏi vào ngân hàng.</p>
 </div>

 <QuestionForm mode="new" />
 </div>
 )
}
