ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS exam_type text DEFAULT 'other';

-- Giá trị có thể là: 'giua_ki_1', 'cuoi_ki_1', 'giua_ki_2', 'cuoi_ki_2', 'tuyen_sinh_10', 'thpt_qg', 'other'
