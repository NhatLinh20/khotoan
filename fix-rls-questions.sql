-- ==========================================
-- FIX RLS FOR QUESTIONS — Kho Toán
-- Chạy các lệnh này trong Supabase SQL Editor
-- ==========================================

-- 1. Cho phép giáo viên quản lý câu hỏi (Thêm/Sửa/Xóa)
-- Lưu ý: Phải có function public.is_teacher() đã tạo ở role-schema.sql
DROP POLICY IF EXISTS "Teachers can manage questions" ON public.questions;
CREATE POLICY "Teachers can manage questions" 
  ON public.questions FOR ALL 
  TO authenticated
  USING (public.is_teacher())
  WITH CHECK (public.is_teacher());

-- 2. Cho phép giáo viên quản lý các ý Đúng/Sai (question_tf_items)
DROP POLICY IF EXISTS "Teachers can manage question_tf_items" ON public.question_tf_items;
CREATE POLICY "Teachers can manage question_tf_items" 
  ON public.question_tf_items FOR ALL 
  TO authenticated
  USING (public.is_teacher())
  WITH CHECK (public.is_teacher());

-- 3. Đảm bảo mọi người vẫn có thể đọc (đã có ở database.sql nhưng re-check)
-- CREATE POLICY "Public read questions" ON public.questions FOR SELECT USING (true);
