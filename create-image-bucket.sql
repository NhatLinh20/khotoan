-- 1. Storage bucket cho ảnh câu hỏi
INSERT INTO storage.buckets (id, name, public)
VALUES ('question-images', 'question-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage policies cho bucket question-images
-- Cho phép user đã đăng nhập upload file
DROP POLICY IF EXISTS "authenticated upload question-images" ON storage.objects;
CREATE POLICY "authenticated upload question-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'question-images');

-- Cho phép user đã đăng nhập cập nhật file
DROP POLICY IF EXISTS "authenticated update question-images" ON storage.objects;
CREATE POLICY "authenticated update question-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'question-images');

-- Cho phép tất cả đọc (public bucket)
DROP POLICY IF EXISTS "public read question-images" ON storage.objects;
CREATE POLICY "public read question-images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'question-images');

-- Cho phép user xóa file
DROP POLICY IF EXISTS "authenticated delete question-images" ON storage.objects;
CREATE POLICY "authenticated delete question-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'question-images');
