import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logLoginInternal } from '@/lib/auth-logger'

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url)
	const code = searchParams.get('code')
	const type = searchParams.get('type')
	const next = searchParams.get('next') ?? '/dashboard'

	if (code) {
		const supabase = await createClient()
		const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code)

		if (!error && authData.user) {
			// Luồng reset password: type=recovery hoặc next=/reset-password
			if (type === 'recovery' || next === '/reset-password') {
				return NextResponse.redirect(`${origin}/reset-password`)
			}

			// Ghi log đăng nhập bình thường
			const forwarded = request.headers.get('x-forwarded-for')
			const ip = forwarded ? forwarded.split(',')[0].trim() : (request.headers.get('x-real-ip') || 'unknown')
			const userAgent = request.headers.get('user-agent') || 'unknown'
			const token = authData.session?.access_token

			await logLoginInternal(authData.user.id, ip, userAgent, token)

			return NextResponse.redirect(`${origin}${next}`)
		}
	}

	return NextResponse.redirect(`${origin}/login?error=Authentication failed`)
}
