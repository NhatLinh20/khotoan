-- =============================================
-- Bảng ghi lịch sử đăng nhập học sinh
-- Chạy file này trên Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS public.login_logs (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  ip_address       text,
  country          text,
  country_code     text,
  region           text,
  city             text,
  isp              text,
  timezone         text,
  user_agent       text,
  is_suspicious    boolean DEFAULT false,
  suspicious_reason text,        -- Lý do bị đánh dấu bất thường
  logged_in_at     timestamptz DEFAULT now()
);

-- Indexes để query nhanh
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id       ON public.login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_logged_in_at  ON public.login_logs(logged_in_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_logs_suspicious    ON public.login_logs(is_suspicious) WHERE is_suspicious = true;
CREATE INDEX IF NOT EXISTS idx_login_logs_ip            ON public.login_logs(ip_address);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;

-- Học sinh chỉ đọc log của chính mình
DROP POLICY IF EXISTS "Students read own login logs" ON public.login_logs;
CREATE POLICY "Students read own login logs"
  ON public.login_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Server (service role) có thể insert
DROP POLICY IF EXISTS "Service role insert login logs" ON public.login_logs;
CREATE POLICY "Service role insert login logs"
  ON public.login_logs FOR INSERT
  WITH CHECK (true);

-- Giáo viên đọc tất cả log
DROP POLICY IF EXISTS "Teachers read all login logs" ON public.login_logs;
CREATE POLICY "Teachers read all login logs"
  ON public.login_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );
