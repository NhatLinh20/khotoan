import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes yêu cầu đăng nhập
const PROTECTED_ROUTES = ['/dashboard', '/teacher']

// Routes chỉ dành cho teacher
const TEACHER_ROUTES = ['/teacher']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Luôn refresh session token
  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  const isTeacherRoute = TEACHER_ROUTES.some((r) => pathname.startsWith(r))

  // Chưa đăng nhập mà truy cập route được bảo vệ → redirect /login
  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Đã đăng nhập nhưng truy cập /teacher/* → kiểm tra role
  if (isTeacherRoute && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'teacher') {
      const dashboardUrl = request.nextUrl.clone()
      dashboardUrl.pathname = '/dashboard'
      return NextResponse.redirect(dashboardUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

export default proxy
