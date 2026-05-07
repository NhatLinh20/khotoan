export type Course = {
  id: string
  title: string
  description: string
  grade: number
  topic: string
  price: number
  thumbnail_url: string | null
  teacher_name: string
  student_count: number
  rating: number
  created_at: string
  exam_type?: string
}

export type Lesson = {
  id: string
  course_id: string
  title: string
  video_url: string | null
  pdf_url: string | null
  order_index: number
  duration_minutes: number
}

export const MOCK_COURSES: Course[] = [
  // Lớp 10 - Đại số
  {
    id: 'c10-ds-1', title: 'Mệnh đề & Tập hợp',
    description: 'Nắm vững nền tảng logic toán học với mệnh đề, phủ định và các phép toán trên tập hợp.',
    grade: 10, topic: 'Đại số & Thống kê', price: 0, thumbnail_url: null,
    teacher_name: 'Thầy Nguyễn Văn Minh', student_count: 312, rating: 4.8, created_at: '2024-01-01', exam_type: 'giua_ki_1'
  },
  {
    id: 'c10-ds-2', title: 'Hàm số bậc hai & Đồ thị',
    description: 'Khám phá parabol, đỉnh, trục đối xứng và ứng dụng trong giải phương trình.',
    grade: 10, topic: 'Đại số & Thống kê', price: 149000, thumbnail_url: null,
    teacher_name: 'Cô Phạm Thị Lan', student_count: 245, rating: 4.9, created_at: '2024-01-15'
  },
  {
    id: 'c10-ds-3', title: 'Bất phương trình bậc hai',
    description: 'Phương pháp giải bất phương trình, hệ bất phương trình và ứng dụng thực tế.',
    grade: 10, topic: 'Đại số & Thống kê', price: 149000, thumbnail_url: null,
    teacher_name: 'Thầy Lê Đức Hùng', student_count: 198, rating: 4.7, created_at: '2024-02-01'
  },
  {
    id: 'c10-ds-4', title: 'Tổ hợp - Xác suất',
    description: 'Quy tắc đếm, hoán vị, chỉnh hợp, tổ hợp và tính xác suất theo định nghĩa cổ điển.',
    grade: 10, topic: 'Đại số & Thống kê', price: 199000, thumbnail_url: null,
    teacher_name: 'Cô Trần Thị Hoa', student_count: 287, rating: 4.8, created_at: '2024-02-15'
  },
  // Lớp 10 - Hình học
  {
    id: 'c10-hh-1', title: 'Vectơ trong mặt phẳng',
    description: 'Định nghĩa, phép toán vectơ và ứng dụng trong hình học phẳng.',
    grade: 10, topic: 'Hình học', price: 149000, thumbnail_url: null,
    teacher_name: 'Thầy Nguyễn Văn Minh', student_count: 175, rating: 4.7, created_at: '2024-03-01'
  },
  {
    id: 'c10-hh-2', title: 'Tọa độ trong mặt phẳng Oxy',
    description: 'Hệ tọa độ, phương trình đường thẳng, đường tròn và khoảng cách.',
    grade: 10, topic: 'Hình học', price: 199000, thumbnail_url: null,
    teacher_name: 'Cô Phạm Thị Lan', student_count: 220, rating: 4.9, created_at: '2024-03-15', exam_type: 'tuyen_sinh_10'
  },
  // Lớp 11 - Đại số
  {
    id: 'c11-ds-1', title: 'Hàm số lượng giác',
    description: 'Sin, cos, tan, cot và đồ thị. Giải phương trình lượng giác cơ bản và nâng cao.',
    grade: 11, topic: 'Đại số & Thống kê', price: 199000, thumbnail_url: null,
    teacher_name: 'Thầy Lê Đức Hùng', student_count: 340, rating: 4.9, created_at: '2024-01-01'
  },
  {
    id: 'c11-ds-2', title: 'Dãy số - Cấp số cộng & nhân',
    description: 'Định nghĩa, tính chất và ứng dụng của cấp số cộng, cấp số nhân trong bài toán thực tế.',
    grade: 11, topic: 'Đại số & Thống kê', price: 149000, thumbnail_url: null,
    teacher_name: 'Cô Trần Thị Hoa', student_count: 218, rating: 4.8, created_at: '2024-02-01'
  },
  {
    id: 'c11-ds-3', title: 'Giới hạn & Liên tục',
    description: 'Khái niệm giới hạn dãy số, hàm số và tính liên tục. Nền tảng cho Giải tích.',
    grade: 11, topic: 'Đại số & Thống kê', price: 249000, thumbnail_url: null,
    teacher_name: 'Thầy Nguyễn Văn Minh', student_count: 192, rating: 4.8, created_at: '2024-02-15'
  },
  {
    id: 'c11-ds-4', title: 'Hàm số mũ & Lôgarit',
    description: 'Định nghĩa, tính chất hàm mũ, lôgarit và ứng dụng giải phương trình.',
    grade: 11, topic: 'Đại số & Thống kê', price: 249000, thumbnail_url: null,
    teacher_name: 'Cô Phạm Thị Lan', student_count: 265, rating: 4.9, created_at: '2024-03-01'
  },
  {
    id: 'c11-ds-5', title: 'Đạo hàm & Ứng dụng',
    description: 'Định nghĩa, quy tắc tính đạo hàm và ứng dụng tìm cực trị, tiếp tuyến.',
    grade: 11, topic: 'Đại số & Thống kê', price: 299000, thumbnail_url: null,
    teacher_name: 'Thầy Lê Đức Hùng', student_count: 310, rating: 4.9, created_at: '2024-03-15'
  },
  // Lớp 11 - Hình học
  {
    id: 'c11-hh-1', title: 'Hình học không gian',
    description: 'Đường thẳng, mặt phẳng trong không gian, các quan hệ song song và vuông góc.',
    grade: 11, topic: 'Hình học', price: 199000, thumbnail_url: null,
    teacher_name: 'Cô Trần Thị Hoa', student_count: 278, rating: 4.8, created_at: '2024-04-01'
  },
  // Lớp 12 - Đại số
  {
    id: 'c12-ds-1', title: 'Khảo sát hàm số',
    description: 'Bảng biến thiên, đồ thị hàm số bậc 3, bậc 4 trùng phương. Chinh phục 9+ THPT QG.',
    grade: 12, topic: 'Đại số & Thống kê', price: 349000, thumbnail_url: null,
    teacher_name: 'Thầy Nguyễn Văn Minh', student_count: 520, rating: 4.9, created_at: '2024-01-01', exam_type: 'thpt_qg'
  },
  {
    id: 'c12-ds-2', title: 'Nguyên hàm & Tích phân',
    description: 'Lý thuyết và kỹ thuật tính tích phân. Ứng dụng tính diện tích, thể tích.',
    grade: 12, topic: 'Đại số & Thống kê', price: 349000, thumbnail_url: null,
    teacher_name: 'Cô Phạm Thị Lan', student_count: 489, rating: 4.9, created_at: '2024-02-01'
  },
  {
    id: 'c12-ds-3', title: 'Xác suất & Thống kê',
    description: 'Biến cố, xác suất có điều kiện, biến ngẫu nhiên và phân phối xác suất.',
    grade: 12, topic: 'Đại số & Thống kê', price: 249000, thumbnail_url: null,
    teacher_name: 'Thầy Lê Đức Hùng', student_count: 312, rating: 4.8, created_at: '2024-02-15'
  },
  // Lớp 12 - Hình học
  {
    id: 'c12-hh-1', title: 'Hình học trong không gian Oxyz',
    description: 'Tọa độ không gian, phương trình mặt phẳng, đường thẳng và các bài toán khoảng cách.',
    grade: 12, topic: 'Hình học', price: 349000, thumbnail_url: null,
    teacher_name: 'Cô Trần Thị Hoa', student_count: 445, rating: 4.9, created_at: '2024-03-01'
  },
]

export const MOCK_LESSONS: Record<string, Lesson[]> = {
  'c10-ds-1': [
    { id: 'l1', course_id: 'c10-ds-1', title: 'Bài 1: Mệnh đề - Định nghĩa và phân loại', video_url: '#', pdf_url: '#', order_index: 1, duration_minutes: 45 },
    { id: 'l2', course_id: 'c10-ds-1', title: 'Bài 2: Phủ định mệnh đề & Kéo theo', video_url: '#', pdf_url: null, order_index: 2, duration_minutes: 40 },
    { id: 'l3', course_id: 'c10-ds-1', title: 'Bài 3: Tập hợp - Khái niệm và biểu diễn', video_url: '#', pdf_url: '#', order_index: 3, duration_minutes: 50 },
    { id: 'l4', course_id: 'c10-ds-1', title: 'Bài 4: Các phép toán trên tập hợp', video_url: null, pdf_url: '#', order_index: 4, duration_minutes: 55 },
    { id: 'l5', course_id: 'c10-ds-1', title: 'Bài 5: Tập hợp số và các dạng toán thường gặp', video_url: '#', pdf_url: '#', order_index: 5, duration_minutes: 60 },
  ],
  'c12-ds-1': [
    { id: 'l10', course_id: 'c12-ds-1', title: 'Bài 1: Tính đơn điệu của hàm số', video_url: '#', pdf_url: '#', order_index: 1, duration_minutes: 60 },
    { id: 'l11', course_id: 'c12-ds-1', title: 'Bài 2: Cực trị hàm số', video_url: '#', pdf_url: '#', order_index: 2, duration_minutes: 65 },
    { id: 'l12', course_id: 'c12-ds-1', title: 'Bài 3: GTLN - GTNN trên đoạn', video_url: '#', pdf_url: null, order_index: 3, duration_minutes: 70 },
    { id: 'l13', course_id: 'c12-ds-1', title: 'Bài 4: Đồ thị hàm số bậc ba', video_url: '#', pdf_url: '#', order_index: 4, duration_minutes: 75 },
    { id: 'l14', course_id: 'c12-ds-1', title: 'Bài 5: Hàm số bậc 4 trùng phương', video_url: '#', pdf_url: '#', order_index: 5, duration_minutes: 70 },
    { id: 'l15', course_id: 'c12-ds-1', title: 'Bài 6: Tương giao đồ thị - Biện luận', video_url: '#', pdf_url: '#', order_index: 6, duration_minutes: 80 },
  ],
}

export function getMockLessons(courseId: string): Lesson[] {
  return MOCK_LESSONS[courseId] ?? [
    { id: 'dl1', course_id: courseId, title: 'Bài 1: Giới thiệu chủ đề', video_url: '#', pdf_url: '#', order_index: 1, duration_minutes: 45 },
    { id: 'dl2', course_id: courseId, title: 'Bài 2: Lý thuyết nền tảng', video_url: '#', pdf_url: null, order_index: 2, duration_minutes: 50 },
    { id: 'dl3', course_id: courseId, title: 'Bài 3: Các dạng bài tập cơ bản', video_url: '#', pdf_url: '#', order_index: 3, duration_minutes: 60 },
    { id: 'dl4', course_id: courseId, title: 'Bài 4: Bài tập nâng cao', video_url: null, pdf_url: '#', order_index: 4, duration_minutes: 65 },
    { id: 'dl5', course_id: courseId, title: 'Bài 5: Đề kiểm tra & Lời giải', video_url: '#', pdf_url: '#', order_index: 5, duration_minutes: 55 },
  ]
}
