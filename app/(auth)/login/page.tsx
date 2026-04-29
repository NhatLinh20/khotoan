'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login, loginWithGoogle } from '@/app/actions/auth'
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-left mb-10">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Chào mừng trở lại!</h2>
        <p className="text-gray-500 dark:text-gray-400">Đăng nhập để tiếp tục lộ trình học của bạn</p>
      </div>

      <form className="space-y-6" action={handleSubmit}>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-900/30 flex items-center gap-3">
             <div className="h-2 w-2 bg-red-600 rounded-full animate-pulse" />
             {error}
          </div>
        )}

        <div className="space-y-4">
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
                placeholder="example@email.com"
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Mật khẩu</label>
              <Link href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">Quên mật khẩu?</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white shadow-sm hover:border-gray-300 dark:hover:border-slate-700"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-4 px-6 rounded-2xl text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:active:scale-100 transition-all font-bold shadow-lg shadow-blue-500/20 gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <>
              Đăng nhập ngay
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8">
        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-gray-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs font-medium uppercase tracking-widest">Hoặc</span>
          <div className="flex-grow border-t border-gray-200 dark:border-slate-800"></div>
        </div>

        <button
          onClick={() => loginWithGoogle()}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-gray-200 dark:border-slate-800 rounded-2xl text-gray-700 dark:text-white bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm font-medium"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Đăng nhập với Google
        </button>
      </div>

      <p className="text-center mt-10 text-gray-600 dark:text-gray-400 text-sm">
        Chưa có tài khoản?{' '}
        <Link href="/register" className="font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-blue-500/30 hover:decoration-blue-500 transition-all">
          Tạo tài khoản miễn phí
        </Link>
      </p>
    </div>
  )
}
