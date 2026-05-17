'use client'

import { useState } from 'react'
import Link from 'next/link'
import { resetPassword } from '@/app/actions/auth'
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [sent, setSent] = useState(false)
	const [email, setEmail] = useState('')

	async function handleSubmit(formData: FormData) {
		setLoading(true)
		setError(null)

		const result = await resetPassword(formData)

		if (result?.error) {
			setError(result.error)
			setLoading(false)
		} else {
			setSent(true)
			setLoading(false)
		}
	}

	if (sent) {
		return (
			<div className="animate-in fade-in slide-in-from-bottom-4 duration-700 font-body">
				<div className="text-center py-4">
					<div className="flex justify-center mb-6">
						<div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
							<CheckCircle2 className="h-8 w-8 text-green-500" />
						</div>
					</div>
					<h2 className="text-2xl font-display font-bold text-primary mb-3">Kiểm tra hộp thư!</h2>
					<p className="text-secondary text-[0.95rem] leading-relaxed mb-2">
						Chúng tôi đã gửi link đặt lại mật khẩu đến
					</p>
					<p className="font-bold text-primary mb-6">{email}</p>
					<p className="text-secondary text-sm">
						Không thấy email? Kiểm tra thư mục spam hoặc{' '}
						<button
							onClick={() => setSent(false)}
							className="text-tertiary font-bold hover:underline"
						>
							thử lại
						</button>
					</p>
				</div>

				<div className="mt-8 pt-6 border-t border-secondary/10 text-center">
					<Link
						href="/login"
						className="inline-flex items-center gap-2 text-[0.9rem] text-secondary hover:text-primary font-bold transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						Quay lại đăng nhập
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="animate-in fade-in slide-in-from-bottom-4 duration-700 font-body">
			<div className="mb-8">
				<h2 className="text-3xl font-display font-bold text-primary mb-2">Quên mật khẩu?</h2>
				<p className="text-secondary text-[0.95rem]">
					Nhập email của bạn, chúng tôi sẽ gửi link đặt lại mật khẩu.
				</p>
			</div>

			<form className="space-y-5" action={handleSubmit}>
				{error && (
					<div className="bg-red-50 text-red-600 p-4 rounded-md text-sm border border-red-100 flex items-center gap-3">
						<div className="h-2 w-2 bg-red-600 rounded-full animate-pulse" />
						{error}
					</div>
				)}

				<div>
					<label className="block text-[0.95rem] font-bold text-primary mb-2 ml-1">Email</label>
					<div className="relative group">
						<Mail className="absolute left-4 top-3.5 h-5 w-5 text-secondary group-focus-within:text-tertiary transition-colors" />
						<input
							id="email"
							name="email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full pl-12 pr-4 py-3.5 bg-neutral border border-secondary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-tertiary/20 focus:border-tertiary transition-all text-primary shadow-sm hover:border-secondary/40 font-medium"
							placeholder="example@email.com"
						/>
					</div>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full flex items-center justify-center py-4 px-6 rounded-md text-surface bg-tertiary hover:bg-tertiary/90 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-tertiary/30 disabled:opacity-50 disabled:active:scale-100 transition-all font-display font-bold shadow-md shadow-tertiary/20 gap-2 text-lg tracking-[0.05em]"
				>
					{loading ? (
						<Loader2 className="animate-spin h-5 w-5" />
					) : (
						'Gửi link đặt lại mật khẩu'
					)}
				</button>
			</form>

			<div className="mt-8 pt-6 border-t border-secondary/10 text-center">
				<Link
					href="/login"
					className="inline-flex items-center gap-2 text-[0.9rem] text-secondary hover:text-primary font-bold transition-colors"
				>
					<ArrowLeft className="h-4 w-4" />
					Quay lại đăng nhập
				</Link>
			</div>
		</div>
	)
}
