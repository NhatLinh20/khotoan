'use client'

import { useState } from 'react'
import { updatePassword } from '@/app/actions/auth'
import { Lock, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export default function ResetPasswordPage() {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)
	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		if (password !== confirm) {
			setError('Mật khẩu xác nhận không khớp.')
			return
		}
		if (password.length < 6) {
			setError('Mật khẩu phải có ít nhất 6 ký tự.')
			return
		}
		setLoading(true)
		setError(null)

		const formData = new FormData()
		formData.append('password', password)
		const result = await updatePassword(formData)

		if (result?.error) {
			setError(result.error)
			setLoading(false)
		}
	}

	// Tính độ mạnh mật khẩu
	const strength = password.length === 0 ? 0
		: password.length < 6 ? 1
		: password.length < 10 ? 2
		: 3
	const strengthLabel = ['', 'Yếu', 'Trung bình', 'Mạnh']
	const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-green-500']

	return (
		<div className="min-h-screen flex items-center justify-center p-6 bg-surface font-body">
			<div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
				{/* Logo */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-display font-bold text-primary tracking-tight">
						KHO<span className="text-tertiary italic">TOÁN</span>
					</h1>
				</div>

				<div className="bg-surface border border-secondary/10 rounded-xl shadow-lg p-8">
					<div className="mb-7">
						<h2 className="text-2xl font-display font-bold text-primary mb-2">Đặt mật khẩu mới</h2>
						<p className="text-secondary text-[0.95rem]">Nhập mật khẩu mới cho tài khoản của bạn.</p>
					</div>

					<form className="space-y-5" onSubmit={handleSubmit}>
						{error && (
							<div className="bg-red-50 text-red-600 p-4 rounded-md text-sm border border-red-100 flex items-center gap-3">
								<div className="h-2 w-2 bg-red-600 rounded-full animate-pulse" />
								{error}
							</div>
						)}

						{/* Mật khẩu mới */}
						<div>
							<label className="block text-[0.95rem] font-bold text-primary mb-2 ml-1">
								Mật khẩu mới
							</label>
							<div className="relative group">
								<Lock className="absolute left-4 top-3.5 h-5 w-5 text-secondary group-focus-within:text-tertiary transition-colors" />
								<input
									id="password"
									type={showPassword ? 'text' : 'password'}
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full pl-12 pr-12 py-3.5 bg-neutral border border-secondary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-tertiary/20 focus:border-tertiary transition-all text-primary shadow-sm hover:border-secondary/40 font-medium"
									placeholder="••••••••"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-4 top-3.5 text-secondary hover:text-primary transition-colors"
								>
									{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
								</button>
							</div>

							{/* Thanh độ mạnh mật khẩu */}
							{password.length > 0 && (
								<div className="mt-2 px-1">
									<div className="flex gap-1 mb-1">
										{[1, 2, 3].map((i) => (
											<div
												key={i}
												className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : 'bg-secondary/20'}`}
											/>
										))}
									</div>
									<p className={`text-xs font-bold ${strength === 1 ? 'text-red-400' : strength === 2 ? 'text-yellow-500' : 'text-green-500'}`}>
										{strengthLabel[strength]}
									</p>
								</div>
							)}
						</div>

						{/* Xác nhận mật khẩu */}
						<div>
							<label className="block text-[0.95rem] font-bold text-primary mb-2 ml-1">
								Xác nhận mật khẩu
							</label>
							<div className="relative group">
								<Lock className="absolute left-4 top-3.5 h-5 w-5 text-secondary group-focus-within:text-tertiary transition-colors" />
								<input
									id="confirm-password"
									type={showConfirm ? 'text' : 'password'}
									required
									value={confirm}
									onChange={(e) => setConfirm(e.target.value)}
									className={`w-full pl-12 pr-12 py-3.5 bg-neutral border rounded-md focus:outline-none focus:ring-2 transition-all text-primary shadow-sm font-medium ${
										confirm.length > 0 && confirm !== password
											? 'border-red-300 focus:ring-red-200 focus:border-red-400'
											: confirm.length > 0 && confirm === password
											? 'border-green-300 focus:ring-green-200 focus:border-green-400'
											: 'border-secondary/20 focus:ring-tertiary/20 focus:border-tertiary hover:border-secondary/40'
									}`}
									placeholder="••••••••"
								/>
								<button
									type="button"
									onClick={() => setShowConfirm(!showConfirm)}
									className="absolute right-4 top-3.5 text-secondary hover:text-primary transition-colors"
								>
									{showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
								</button>
								{confirm.length > 0 && confirm === password && (
									<CheckCircle2 className="absolute right-11 top-3.5 h-5 w-5 text-green-500" />
								)}
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full flex items-center justify-center py-4 px-6 rounded-md text-surface bg-tertiary hover:bg-tertiary/90 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-tertiary/30 disabled:opacity-50 disabled:active:scale-100 transition-all font-display font-bold shadow-md shadow-tertiary/20 gap-2 text-lg tracking-[0.05em] mt-2"
						>
							{loading ? (
								<Loader2 className="animate-spin h-5 w-5" />
							) : (
								'Cập nhật mật khẩu'
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
