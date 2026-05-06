-- =====================================================
-- Migration: Thêm cột is_approved vào bảng profiles
-- Chạy trong Supabase SQL Editor
-- =====================================================

-- 1. Thêm cột is_approved (mặc định false)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT false;

-- 2. Tài khoản teacher tự động được duyệt
UPDATE profiles 
SET is_approved = true 
WHERE role = 'teacher';

-- 3. (Tuỳ chọn) Xem kết quả
SELECT id, full_name, role, is_approved, created_at 
FROM profiles 
ORDER BY role, created_at DESC;
