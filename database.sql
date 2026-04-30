-- Khởi tạo các bảng cho dự án "Kho Toán"

-- 1. Bảng profiles
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  grade int CHECK (grade BETWEEN 6 AND 12),
  created_at timestamptz DEFAULT now()
);

-- 2. Bảng courses
CREATE TABLE public.courses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  grade int,
  topic text,
  price numeric DEFAULT 0,
  thumbnail_url text,
  teacher_name text,
  student_count int DEFAULT 0,
  rating numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 3. Bảng lessons
CREATE TABLE public.lessons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid REFERENCES public.courses ON DELETE CASCADE,
  title text NOT NULL,
  video_url text,
  pdf_url text,
  order_index int,
  duration_minutes int,
  chapter int,
  lesson_ref int
);

-- 4. Bảng questions
CREATE TABLE public.questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question_code text UNIQUE NOT NULL,
  grade_code text CHECK (grade_code IN ('0', '1', '2')), -- '0'=lớp 10, '1'=lớp 11, '2'=lớp 12
  subject_type text CHECK (subject_type IN ('D', 'H', 'C')), -- 'D'=Đại số/XS/TK, 'H'=Hình học, 'C'=Chuyên đề
  chapter int,
  difficulty text CHECK (difficulty IN ('N', 'H', 'V', 'C')), -- 'N'=Nhận biết, 'H'=Thông hiểu, 'V'=Vận dụng, 'C'=Vận dụng cao
  lesson int,
  form int,
  type text CHECK (type IN ('mc', 'tf', 'short', 'essay')),
  content text NOT NULL,
  image_url text,
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  correct_answer text CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  correct_number numeric,
  solution_guide text,
  max_score numeric,
  created_at timestamptz DEFAULT now()
);

-- 5. Bảng question_tf_items
CREATE TABLE public.question_tf_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id uuid REFERENCES public.questions ON DELETE CASCADE,
  label text CHECK (label IN ('a', 'b', 'c', 'd')),
  content text NOT NULL,
  is_correct boolean NOT NULL
);

-- 6. Bảng exam_results
CREATE TABLE public.exam_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  score numeric NOT NULL,
  total_questions int NOT NULL,
  topic text,
  grade_level int,
  time_spent_seconds int,
  created_at timestamptz DEFAULT now()
);

-- 7. Bảng enrollments
CREATE TABLE public.enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Bật RLS cho các bảng
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_tf_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- RLS: profiles (Chỉ cho phép user đọc/ghi dữ liệu của chính mình)
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- RLS: exam_results (Chỉ cho phép user đọc/ghi dữ liệu của chính mình)
CREATE POLICY "Users can read own exam results" ON public.exam_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own exam results" ON public.exam_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own exam results" ON public.exam_results FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own exam results" ON public.exam_results FOR DELETE USING (auth.uid() = user_id);

-- RLS: enrollments (Chỉ cho phép user đọc/ghi dữ liệu của chính mình)
CREATE POLICY "Users can read own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own enrollments" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own enrollments" ON public.enrollments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own enrollments" ON public.enrollments FOR DELETE USING (auth.uid() = user_id);

-- RLS: questions (Cho phép mọi người đọc - public read)
CREATE POLICY "Public read questions" ON public.questions FOR SELECT USING (true);

-- RLS: question_tf_items (Cho phép mọi người đọc - public read)
CREATE POLICY "Public read question_tf_items" ON public.question_tf_items FOR SELECT USING (true);

-- RLS phụ: courses và lessons (Thường public read để ai cũng xem được danh sách khóa học/bài học)
CREATE POLICY "Public read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert courses" ON public.courses FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update courses" ON public.courses FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete courses" ON public.courses FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Public read lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert lessons" ON public.lessons FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update lessons" ON public.lessons FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete lessons" ON public.lessons FOR DELETE USING (auth.role() = 'authenticated');

-- ==========================================
-- TRIGGERS & FUNCTIONS
-- ==========================================

-- Trigger tự động tạo profile khi có user mới đăng ký qua Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, grade)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    (new.raw_user_meta_data->>'grade')::int
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- DỮ LIỆU MẪU (SEED DATA)
-- ==========================================

-- Thêm khóa học mẫu
INSERT INTO public.courses (id, title, description, grade, topic, price, teacher_name, student_count, rating)
VALUES 
  ('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'Toán 10 - Chương 1: Mệnh đề & Tập hợp', 'Khóa học cơ bản theo chương trình 2018', 10, 'Đại số', 0, 'Thầy Nguyễn Văn A', 150, 4.8),
  ('b2c3d4e5-f6a7-8b9c-0d1e-f2a3b4c5d6e7', 'Toán 11 - Chương 1: Hàm số lượng giác', 'Khóa học nâng cao chinh phục 9+', 11, 'Đại số', 199000, 'Cô Trần Thị B', 85, 4.9);

-- Thêm bài học mẫu
INSERT INTO public.lessons (course_id, title, order_index, duration_minutes)
VALUES 
  ('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'Bài 1: Mệnh đề', 1, 45),
  ('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'Bài 2: Tập hợp', 2, 60);

-- Thêm câu hỏi mẫu (Trắc nghiệm 4 đáp án)
INSERT INTO public.questions (question_code, grade_code, subject_type, chapter, difficulty, type, content, option_a, option_b, option_c, option_d, correct_answer)
VALUES 
  ('1D1N1-1', '0', 'D', 1, 'N', 'mc', 'Trong các câu sau, câu nào là mệnh đề?', 'Hôm nay trời đẹp quá!', 'Bạn có đi học không?', '2 + 3 = 5', 'x + 1 > 2', 'C');

-- Thêm câu hỏi mẫu (Đúng Sai)
INSERT INTO public.questions (id, question_code, grade_code, subject_type, chapter, difficulty, type, content)
VALUES 
  ('f1e2d3c4-b5a6-4c3b-2a1d-0e9f8a7b6c50', '1D1H1-2', '0', 'D', 1, 'H', 'tf', 'Cho tập hợp A = {1, 2, 3}. Xét tính đúng sai của các khẳng định sau:');

INSERT INTO public.question_tf_items (question_id, label, content, is_correct)
VALUES 
  ('f1e2d3c4-b5a6-4c3b-2a1d-0e9f8a7b6c50', 'a', '1 thuộc A', true),
  ('f1e2d3c4-b5a6-4c3b-2a1d-0e9f8a7b6c50', 'b', '{1} thuộc A', false),
  ('f1e2d3c4-b5a6-4c3b-2a1d-0e9f8a7b6c50', 'c', 'Tập rỗng là con của A', true),
  ('f1e2d3c4-b5a6-4c3b-2a1d-0e9f8a7b6c50', 'd', 'A có 8 tập hợp con', true);

-- Thêm câu hỏi mẫu (Trả lời ngắn)
INSERT INTO public.questions (question_code, grade_code, subject_type, chapter, difficulty, type, content, correct_number)
VALUES 
  ('1D1V1-3', '0', 'D', 1, 'V', 'short', 'Cho tập hợp A có 5 phần tử. Số tập hợp con của A là bao nhiêu?', 32);

-- Thêm câu hỏi mẫu (Tự luận)
INSERT INTO public.questions (question_code, grade_code, subject_type, chapter, difficulty, type, content, solution_guide, max_score)
VALUES 
  ('1D1C1-4', '0', 'D', 1, 'C', 'essay', 'Chứng minh rằng với mọi số tự nhiên n, n^2 + n + 1 không chia hết cho 5.', 'Xét các trường hợp n = 5k, 5k+1, ...', 1.0);
