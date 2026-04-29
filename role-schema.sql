-- ==========================================
-- ROLE SCHEMA — Kho Toán
-- Chạy file này trong Supabase SQL Editor
-- ==========================================

-- 1. Thêm cột role vào bảng profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'student'
  CHECK (role IN ('student', 'teacher'));

-- 2. Bảng exams (đề kiểm tra do giáo viên tạo)
CREATE TABLE IF NOT EXISTS public.exams (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title           text NOT NULL,
  description     text,
  teacher_id      uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  grade_code      text CHECK (grade_code IN ('0', '1', '2')),
  subject_type    text CHECK (subject_type IN ('D', 'H', 'C')),
  duration_minutes int NOT NULL DEFAULT 60,
  is_published    boolean NOT NULL DEFAULT false,
  created_at      timestamptz DEFAULT now()
);

-- 3. Bảng exam_questions (câu hỏi trong đề)
CREATE TABLE IF NOT EXISTS public.exam_questions (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id      uuid REFERENCES public.exams ON DELETE CASCADE NOT NULL,
  question_id  uuid REFERENCES public.questions ON DELETE CASCADE NOT NULL,
  order_index  int NOT NULL DEFAULT 0,
  UNIQUE (exam_id, question_id)
);

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;

-- Helper function: kiểm tra user hiện tại có role teacher không
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'teacher'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- RLS: exams
-- Teacher chỉ thao tác đề của chính mình
CREATE POLICY "Teachers can create exams"
  ON public.exams FOR INSERT
  WITH CHECK (auth.uid() = teacher_id AND public.is_teacher());

CREATE POLICY "Teachers can update own exams"
  ON public.exams FOR UPDATE
  USING (auth.uid() = teacher_id AND public.is_teacher());

CREATE POLICY "Teachers can delete own exams"
  ON public.exams FOR DELETE
  USING (auth.uid() = teacher_id AND public.is_teacher());

-- Teacher xem tất cả đề của mình (kể cả chưa publish)
CREATE POLICY "Teachers can read own exams"
  ON public.exams FOR SELECT
  USING (auth.uid() = teacher_id AND public.is_teacher());

-- Student chỉ đọc đề đã published
CREATE POLICY "Students can read published exams"
  ON public.exams FOR SELECT
  USING (is_published = true);

-- RLS: exam_questions
CREATE POLICY "Teachers can manage exam_questions of own exams"
  ON public.exam_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.exams e
      WHERE e.id = exam_id AND e.teacher_id = auth.uid() AND public.is_teacher()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.exams e
      WHERE e.id = exam_id AND e.teacher_id = auth.uid() AND public.is_teacher()
    )
  );

CREATE POLICY "Students can read exam_questions of published exams"
  ON public.exam_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.exams e
      WHERE e.id = exam_id AND e.is_published = true
    )
  );

-- ==========================================
-- CẬP NHẬT TRIGGER TẠO PROFILE
-- Đảm bảo role được lưu đúng khi đăng ký
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, grade, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    (new.raw_user_meta_data->>'grade')::int,
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
