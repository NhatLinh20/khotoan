import { createAdminClient } from './lib/supabase/admin'

async function setupPolicies() {
  const supabase = createAdminClient()
  
  const { error } = await supabase.rpc('setup_exam_results_policies', {
    sql: `
      -- Cho phép học sinh tự lưu kết quả thi của mình
      CREATE POLICY "Học sinh có thể lưu kết quả thi"
      ON exam_results
      FOR INSERT 
      TO authenticated
      WITH CHECK (auth.uid() = user_id);

      -- Giáo viên được xem kết quả thi của các đề họ tạo
      CREATE POLICY "Giáo viên xem kết quả đề mình tạo"
      ON exam_results
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM exams
          WHERE exams.id = exam_results.exam_id
          AND exams.teacher_id = auth.uid()
        )
      );

      -- Học sinh chỉ được xem kết quả của chính mình
      CREATE POLICY "Học sinh xem kết quả của chính mình"
      ON exam_results
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
    `
  })

  if (error) {
    console.error("Policy setup error (RPC may not exist):", error)
  }
}

setupPolicies()
