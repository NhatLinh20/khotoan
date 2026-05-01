-- ============================================================
-- Chạy trong Supabase SQL Editor
-- Tạo bảng exams + exam_questions nếu chưa có,
-- hoặc thêm cột mới nếu bảng đã tồn tại
-- ============================================================

-- 1. Tạo bảng exams
CREATE TABLE IF NOT EXISTS exams (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title         text NOT NULL,
  description   text,
  grade         int,
  subject       text,
  duration_min  int DEFAULT 45,
  exam_type     text NOT NULL DEFAULT 'bank' CHECK (exam_type IN ('bank', 'pdf')),
  pdf_url       text,
  is_published  boolean NOT NULL DEFAULT false,
  created_at    timestamptz DEFAULT now()
);

-- 2. Thêm cột exam_type nếu bảng đã tồn tại nhưng chưa có cột
ALTER TABLE exams ADD COLUMN IF NOT EXISTS exam_type text NOT NULL DEFAULT 'bank';
ALTER TABLE exams ADD COLUMN IF NOT EXISTS pdf_url   text;

-- 3. Tạo bảng exam_questions
CREATE TABLE IF NOT EXISTS exam_questions (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id         uuid REFERENCES exams(id) ON DELETE CASCADE,
  question_id     uuid REFERENCES questions(id) ON DELETE SET NULL,  -- NULL cho đề PDF
  order_index     int NOT NULL DEFAULT 1,
  type            text,           -- mc | tf | short | essay
  correct_answer  text,           -- mc: A/B/C/D
  correct_number  numeric,        -- short
  max_score       numeric,        -- điểm câu
  -- tf items lưu thẳng vào json cho đơn giản
  tf_answers      jsonb,          -- [{label:'a',is_correct:true},...]
  created_at      timestamptz DEFAULT now()
);

-- 3. Thêm cột nếu bảng exams đã tồn tại từ trước (không có các cột mới)
ALTER TABLE exams ADD COLUMN IF NOT EXISTS exam_type    text DEFAULT 'bank';
ALTER TABLE exams ADD COLUMN IF NOT EXISTS pdf_url      text;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS duration_min int  DEFAULT 45;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS grade        int;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS subject      text;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS description  text;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT false;

-- 3b. Thêm cột nếu bảng exam_questions đã tồn tại từ trước
ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS question_id    uuid REFERENCES questions(id) ON DELETE SET NULL;
ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS order_index    int NOT NULL DEFAULT 1;
ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS type           text;
ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS correct_answer text;
ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS correct_number numeric;
ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS max_score      numeric;
ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS tf_answers     jsonb;

-- Cho phép question_id là NULL (dành cho đề thi PDF)
ALTER TABLE exam_questions ALTER COLUMN question_id DROP NOT NULL;

-- Reload schema cache để Supabase nhận diện các cột mới
NOTIFY pgrst, 'reload schema';

-- 4. RLS
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;

-- Giáo viên xem/sửa đề của mình
DROP POLICY IF EXISTS "teacher_own_exams" ON exams;
CREATE POLICY "teacher_own_exams"
  ON exams FOR ALL
  USING (teacher_id = auth.uid());

-- Học sinh chỉ xem đề đã công bố
DROP POLICY IF EXISTS "student_view_published_exams" ON exams;
CREATE POLICY "student_view_published_exams"
  ON exams FOR SELECT
  USING (is_published = true);

-- exam_questions theo exam
DROP POLICY IF EXISTS "exam_questions_access" ON exam_questions;
CREATE POLICY "exam_questions_access"
  ON exam_questions FOR ALL
  USING (
    exam_id IN (
      SELECT id FROM exams WHERE teacher_id = auth.uid()
    )
  );

-- 5. Storage bucket cho PDF đề thi
INSERT INTO storage.buckets (id, name, public)
VALUES ('exam-pdfs', 'exam-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage policies cho bucket exam-pdfs
-- Cho phép user đã đăng nhập upload file
DROP POLICY IF EXISTS "authenticated upload exam-pdfs" ON storage.objects;
CREATE POLICY "authenticated upload exam-pdfs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'exam-pdfs');

-- Cho phép user đã đăng nhập cập nhật file của mình
DROP POLICY IF EXISTS "authenticated update exam-pdfs" ON storage.objects;
CREATE POLICY "authenticated update exam-pdfs"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'exam-pdfs');

-- Cho phép tất cả đọc (public bucket)
DROP POLICY IF EXISTS "public read exam-pdfs" ON storage.objects;
CREATE POLICY "public read exam-pdfs"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'exam-pdfs');

-- Cho phép user xóa file của mình
DROP POLICY IF EXISTS "authenticated delete exam-pdfs" ON storage.objects;
CREATE POLICY "authenticated delete exam-pdfs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'exam-pdfs');
