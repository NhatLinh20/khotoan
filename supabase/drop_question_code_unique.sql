-- Xóa ràng buộc UNIQUE trên question_code
-- Chạy trong Supabase → SQL Editor

ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_question_code_key;

-- Kiểm tra lại (không còn unique constraint)
SELECT conname, contype
FROM pg_constraint
WHERE conrelid = 'questions'::regclass
  AND conname LIKE '%question_code%';
