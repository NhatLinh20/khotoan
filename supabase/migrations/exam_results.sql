-- Xóa bảng cũ nếu tồn tại (reset sạch)
drop table if exists public.exam_results cascade;

-- Tạo lại bảng exam_results
create table public.exam_results (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  exam_id            uuid not null references public.exams(id) on delete cascade,
  score              numeric(6,2) not null default 0,
  total_questions    int not null default 0,
  time_spent_seconds int not null default 0,
  created_at         timestamptz not null default now()
);

-- Bật RLS
alter table public.exam_results enable row level security;

-- Học sinh chỉ thấy kết quả của chính mình
create policy "Students see own results"
  on public.exam_results for select
  using (auth.uid() = user_id);

-- Giáo viên thấy kết quả đề thi của mình
create policy "Teachers see results for their exams"
  on public.exam_results for select
  using (
    exists (
      select 1 from public.exams
      where exams.id = exam_results.exam_id
        and exams.teacher_id = auth.uid()
    )
  );

-- Chỉ user đã đăng nhập mới insert được (và phải đúng user_id)
create policy "Authenticated users can insert results"
  on public.exam_results for insert
  with check (auth.uid() = user_id);

-- Index tìm nhanh
create index idx_exam_results_user on public.exam_results(user_id);
create index idx_exam_results_exam on public.exam_results(exam_id);
