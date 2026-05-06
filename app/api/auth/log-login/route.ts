import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// ─── Helper: Lấy IP thật từ headers (hỗ trợ Vercel/proxy) ────────────────────
function extractIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for có thể chứa nhiều IP: "client, proxy1, proxy2"
    return forwarded.split(',')[0].trim()
  }
  return req.headers.get('x-real-ip') || req.ip || 'unknown'
}

// ─── Helper: Lấy thông tin vị trí từ IP (dùng ip-api.com - miễn phí) ─────────
interface IPInfo {
  country: string
  countryCode: string
  region: string
  city: string
  isp: string
  timezone: string
  status: string
}

async function getIPInfo(ip: string): Promise<IPInfo | null> {
  // Bỏ qua localhost/private IPs
  if (!ip || ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip === '::1') {
    return {
      country: 'Localhost',
      countryCode: 'LH',
      region: 'Local',
      city: 'Local',
      isp: 'Local',
      timezone: 'Asia/Ho_Chi_Minh',
      status: 'success',
    }
  }

  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,isp,timezone`,
      { next: { revalidate: 3600 } } // cache 1 giờ cho cùng IP
    )
    if (!res.ok) return null
    const data = await res.json()
    return {
      country: data.country || 'Unknown',
      countryCode: data.countryCode || 'XX',
      region: data.regionName || 'Unknown',
      city: data.city || 'Unknown',
      isp: data.isp || 'Unknown',
      timezone: data.timezone || 'Unknown',
      status: data.status,
    }
  } catch {
    return null
  }
}

// ─── Helper: Phát hiện đăng nhập bất thường ──────────────────────────────────
interface SuspiciousResult {
  isSuspicious: boolean
  reason: string | null
}

async function detectAnomaly(
  supabase: ReturnType<typeof createServiceClient>,
  userId: string,
  currentIP: string,
  currentCountry: string
): Promise<SuspiciousResult> {
  // Lấy 10 lần đăng nhập gần nhất
  const { data: recentLogs } = await supabase
    .from('login_logs')
    .select('ip_address, country, logged_in_at')
    .eq('user_id', userId)
    .order('logged_in_at', { ascending: false })
    .limit(10)

  if (!recentLogs || recentLogs.length === 0) {
    // Lần đăng nhập đầu tiên - không bất thường
    return { isSuspicious: false, reason: null }
  }

  const reasons: string[] = []

  // 1. Kiểm tra quốc gia mới
  const knownCountries = new Set(recentLogs.map((l) => l.country).filter(Boolean))
  if (currentCountry && currentCountry !== 'Localhost' && !knownCountries.has(currentCountry)) {
    reasons.push(`Quốc gia mới chưa gặp: ${currentCountry}`)
  }

  // 2. Đăng nhập từ 2 IP khác nhau trong vòng 1 giờ
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const recentHourLogs = recentLogs.filter((l) => l.logged_in_at > oneHourAgo)
  const recentIPs = new Set(recentHourLogs.map((l) => l.ip_address).filter(Boolean))
  if (recentIPs.size > 0 && !recentIPs.has(currentIP) && currentIP !== 'unknown') {
    reasons.push(`Đăng nhập từ IP mới trong vòng 1 giờ (IP cũ: ${[...recentIPs][0]})`)
  }

  // 3. IP hoàn toàn mới (chưa bao giờ dùng)
  const knownIPs = new Set(recentLogs.map((l) => l.ip_address).filter(Boolean))
  if (currentIP !== 'unknown' && !knownIPs.has(currentIP) && recentLogs.length >= 3) {
    reasons.push(`Địa chỉ IP mới: ${currentIP}`)
  }

  if (reasons.length > 0) {
    return { isSuspicious: true, reason: reasons.join(' | ') }
  }

  return { isSuspicious: false, reason: null }
}

// ─── POST /api/auth/log-login ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Xác thực user đang đăng nhập
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Tạo service client để bypass RLS khi insert
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const ip = extractIP(req)
    const userAgent = req.headers.get('user-agent') || 'unknown'

    // Lấy thông tin vị trí
    const ipInfo = await getIPInfo(ip)

    // Phát hiện bất thường
    const { isSuspicious, reason } = await detectAnomaly(
      serviceClient,
      user.id,
      ip,
      ipInfo?.country || 'Unknown'
    )

    // Ghi log vào database
    const { error: insertError } = await serviceClient.from('login_logs').insert({
      user_id: user.id,
      ip_address: ip,
      country: ipInfo?.country || null,
      country_code: ipInfo?.countryCode || null,
      region: ipInfo?.region || null,
      city: ipInfo?.city || null,
      isp: ipInfo?.isp || null,
      timezone: ipInfo?.timezone || null,
      user_agent: userAgent,
      is_suspicious: isSuspicious,
      suspicious_reason: reason,
    })

    if (insertError) {
      console.error('[log-login] Insert error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, isSuspicious })
  } catch (err) {
    console.error('[log-login] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
