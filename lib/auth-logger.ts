import { createClient as createServiceClient } from '@supabase/supabase-js'

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
      { next: { revalidate: 3600 } }
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
  supabase: any,
  userId: string,
  currentIP: string,
  currentCountry: string,
  currentUserAgent: string
): Promise<SuspiciousResult> {
  const { data: recentLogs } = await supabase
    .from('login_logs')
    .select('ip_address, country, user_agent, logged_in_at')
    .eq('user_id', userId)
    .order('logged_in_at', { ascending: false })
    .limit(10)

  if (!recentLogs || recentLogs.length === 0) {
    return { isSuspicious: false, reason: null }
  }

  const reasons: string[] = []

  const knownCountries = new Set((recentLogs || []).map((l: any) => l.country).filter(Boolean))
  if (currentCountry && currentCountry !== 'Localhost' && !knownCountries.has(currentCountry)) {
    reasons.push(`Quốc gia lạ: ${currentCountry}`)
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const recentHourLogs = (recentLogs || []).filter((l: any) => l.logged_in_at > oneHourAgo)
  const recentIPs = new Set(recentHourLogs.map((l: any) => l.ip_address).filter(Boolean))
  if (recentIPs.size > 0 && !recentIPs.has(currentIP) && currentIP !== 'unknown') {
    reasons.push(`Đăng nhập từ IP mới quá nhanh (IP cũ: ${[...recentIPs][0]})`)
  }

  const knownIPs = new Set((recentLogs || []).map((l: any) => l.ip_address).filter(Boolean))
  if (currentIP !== 'unknown' && !knownIPs.has(currentIP) && (recentLogs || []).length >= 3) {
    reasons.push(`Địa chỉ IP mới: ${currentIP}`)
  }

  // Phát hiện thiết bị mới (so sánh chữ ký trình duyệt/thiết bị cơ bản)
  const knownAgents = new Set((recentLogs || []).map((l: any) => l.user_agent?.split(' ')[0]).filter(Boolean))
  const currentAgentBase = currentUserAgent.split(' ')[0]
  if (currentAgentBase && currentAgentBase !== 'unknown' && !knownAgents.has(currentAgentBase)) {
    reasons.push(`Thiết bị/Trình duyệt mới`)
  }

  if (reasons.length > 0) {
    return { isSuspicious: true, reason: reasons.join(' | ') }
  }

  return { isSuspicious: false, reason: null }
}

export async function logLoginInternal(userId: string, ip: string, userAgent: string, token?: string) {
  try {
    // Khởi tạo client với access_token của user để qua RLS (KHÔNG dùng service role key vì dễ lỗi cấu hình)
    const authClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      token ? {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      } : undefined
    )

    const ipInfo = await getIPInfo(ip)

    const { isSuspicious, reason } = await detectAnomaly(
      authClient,
      userId,
      ip,
      ipInfo?.country || 'Unknown',
      userAgent
    )

    const { error: insertError } = await authClient.from('login_logs').insert({
      user_id: userId,
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
    }
  } catch (err) {
    console.error('[log-login] Unexpected error:', err)
  }
}
