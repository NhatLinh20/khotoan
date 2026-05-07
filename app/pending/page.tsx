import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { Clock, MessageCircle, Home, LogOut, CheckCircle2 } from 'lucide-react'

const ZALO_NUMBER = '0812878792'
const ZALO_LINK =`https://zalo.me/${ZALO_NUMBER}`

export default async function PendingPage() {
 const supabase = await createClient()
 const { data: { user } } = await supabase.auth.getUser()

 // Nếu chưa đăng nhập → về login
 if (!user) redirect('/login')

 // Lấy profile
 const { data: profile } = await supabase
 .from('profiles')
 .select('role, is_approved, full_name')
 .eq('id', user.id)
 .single()

 // Nếu đã được duyệt hoặc là teacher → vào dashboard luôn
 if (!profile || profile.role === 'teacher' || profile.is_approved) {
 redirect('/dashboard')
 }

 return (
 <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center p-6">
 <div className="w-full max-w-md">
 {/* Card */}
 <div className="bg-surface rounded-lg shadow-2xl shadow-gray-200/60 border border-secondary/20 p-10 text-center">

 {/* Icon */}
 <div className="relative inline-block mb-6">
 <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center shadow-xl shadow-amber-200/50 mx-auto">
 <CheckCircle2 className="h-12 w-12 text-amber-500" strokeWidth={1.5} />
 </div>
 <span className="absolute top-0 right-0 flex h-5 w-5">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
 <span className="relative inline-flex rounded-full h-5 w-5 bg-amber-500"></span>
 </span>
 </div>

 {/* Title */}
 <h1 className="text-2xl font-display font-bold text-primary mb-2">
 Đăng ký thành công!
 </h1>
 <div className="w-10 h-1 bg-amber-400 rounded-full mx-auto mb-6" />

 {/* Greeting */}
 {profile.full_name && (
 <p className="text-secondary text-sm mb-6">
 Xin chào, <span className="font-bold text-gray-700">{profile.full_name}</span>
 </p>
 )}

 {/* Message box */}
 <div className="bg-amber-50 border border-amber-200 rounded-md p-5 mb-8 text-left">
 <div className="flex items-start gap-3">
 <Clock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0 animate-pulse" />
 <div>
 <p className="font-bold text-amber-800 mb-1.5">
 Tài khoản của bạn đang chờ kích hoạt
 </p>
 <p className="text-sm text-amber-700 leading-relaxed">
 Vui lòng liên hệ qua Zalo số{' '}
 <span className="font-display font-bold text-amber-900">{ZALO_NUMBER}</span>{' '}
 để được hỗ trợ mua khóa học và kích hoạt tài khoản.
 </p>
 </div>
 </div>
 </div>

 {/* Buttons */}
 <div className="space-y-3">
 <a
 href={ZALO_LINK}
 target="_blank"
 rel="noopener noreferrer"
 className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-md text-surface font-bold bg-green-500 hover:bg-green-600 active:scale-[0.98] transition-all shadow-lg shadow-green-500/30"
 >
 <MessageCircle className="h-5 w-5" />
 Liên hệ Zalo: {ZALO_NUMBER}
 </a>

 <Link
 href="/"
 className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-md text-gray-700 font-bold border border-secondary/20 hover:bg-neutral :bg-slate-800 active:scale-[0.98] transition-all"
 >
 <Home className="h-5 w-5" />
 Về trang chủ
 </Link>

 <form action={logout}>
 <button
 type="submit"
 className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-md text-red-500 font-semibold text-sm hover:bg-red-50 :bg-red-900/20 active:scale-[0.98] transition-all"
 >
 <LogOut className="h-4 w-4" />
 Đăng xuất
 </button>
 </form>
 </div>
 </div>

 {/* Footer note */}
 <p className="text-center text-xs text-secondary/80 mt-6">
 Sau khi được kích hoạt, hãy{' '}
 <Link href="/login" className="text-blue-500 font-semibold hover:underline">
 đăng nhập lại
 </Link>
 {' '}để vào học.
 </p>
 </div>
 </div>
 )
}
