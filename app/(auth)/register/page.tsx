'use client'

import { useState } from 'react'
import Link from 'next/link'
import { register } from '@/app/actions/auth'
import { Mail, Lock, User, GraduationCap, Loader2, UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    const result = await register(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-left mb-8">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Tạo tài khoản mới</h2>
        <p className="text-gray-500 dark:text-gray-400">Bắt đầu hành trình chinh phục môn Toán ngay hôm nay</p>
      </div>

      <form className="space-y-5" action={handleSubmit}>
        {/* Mặc định role = student khi đăng ký */}
        <input type="hidden" name="role" value="student" />
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-900/30 flex items-center gap-3">
             <div className="h-2 w-2 bg-red-600 rounded-full animate-pulse" />
             {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Họ và tên</label>
            <div className="relative group">
              <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white shadow-sm hover:border-gray-300 dark:hover:border-slate-700"
                placeholder="Nguyễn Văn An"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white shadow-sm hover:border-gray-300 dark:hover:border-slate-700"
                  placeholder="an@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Lớp</label>
              <div className="relative group">
                <GraduationCap className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                <select
                  id="grade"
                  name="grade"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white shadow-sm hover:border-gray-300 dark:hover:border-slate-700 appearance-none"
                >
                  <option value="">Chọn lớp</option>
                  {[6, 7, 8, 9, 10, 11, 12].map((g) => (
                    <option key={g} value={g}>Lớp {g}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-4 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Mật khẩu</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white shadow-sm hover:border-gray-300 dark:hover:border-slate-700"
                placeholder="Tối thiểu 6 ký tự"
                minLength={6}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-4 px-6 rounded-2xl text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:active:scale-100 transition-all font-bold shadow-lg shadow-blue-500/20 gap-2 mt-4"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <>
              Đăng ký ngay
              <UserPlus className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <p className="text-center mt-8 text-gray-600 dark:text-gray-400 text-sm">
        Đã có tài khoản?{' '}
        <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-blue-500/30 hover:decoration-blue-500 transition-all">
          Đăng nhập ngay
        </Link>
      </p>
    </div>
  )
}
