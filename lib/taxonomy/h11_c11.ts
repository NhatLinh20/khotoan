import type { ChapterItem } from '../math-taxonomy'
const f = (...ls: string[]) => ls.map((label, i) => ({ value: i + 1, label }))

export const H11: ChapterItem[] = [
  { value: 4, label: 'Chương 4. Đường thẳng, mặt phẳng. Quan hệ song song trong không gian', lessons: [
    { value: 1, label: 'Điểm, đường thẳng và mặt phẳng', forms: f('Câu hỏi lý thuyết','Hình biểu diễn của một hình không gian','Tìm giao tuyến của hai mặt phẳng','Tìm giao điểm của đường thẳng và mặt phẳng','Xác định thiết diện','Ba điểm thẳng hàng, ba đường thẳng đồng quy','Toán thực tế áp dụng điểm, đường thẳng và mặt phẳng') },
    { value: 2, label: 'Hai đường thẳng song song', forms: f('Câu hỏi lý thuyết (vị trí tương đối)','Chứng minh hai đường thẳng song song','Tìm giao tuyến của hai mặt phẳng (có yếu tố song song)','Tìm giao điểm, thiết diện (có yếu tố song song)') },
    { value: 3, label: 'Đường thẳng song song với mặt phẳng', forms: f('Câu hỏi lý thuyết','Chứng minh đường thẳng song song với mặt phẳng','Tìm giao tuyến, thiết diện (yếu tố song song mp)','Bài toán có tham số m') },
    { value: 4, label: 'Hai mặt phẳng song song', forms: f('Câu hỏi lý thuyết','Chứng minh hai mặt phẳng song song','Tính chất hai mặt phẳng song song (định lí Ta-lét)','Hình lăng trụ và hình hộp','Hình chóp cụt','Toán thực tế áp dụng quan hệ song song') },
    { value: 5, label: 'Phép chiếu song song', forms: f('Câu hỏi lý thuyết','Xác định hình chiếu của một hình','Hình biểu diễn của một hình phẳng') },
  ]},
  { value: 8, label: 'Chương 8. Quan hệ vuông góc trong không gian', lessons: [
    { value: 1, label: 'Hai đường thẳng vuông góc', forms: f('Câu hỏi lý thuyết','Góc giữa hai đường thẳng','Chứng minh hai đường thẳng vuông góc') },
    { value: 2, label: 'Đường thẳng vuông góc với mặt phẳng', forms: f('Câu hỏi lý thuyết','Chứng minh đường thẳng vuông góc với mặt phẳng','Chứng minh hai đường thẳng vuông góc (dùng đường vuông góc mp)','Xác định hình chiếu vuông góc','Góc giữa đường thẳng và mặt phẳng','Thiết diện chứa đường thẳng vuông góc với mặt phẳng') },
    { value: 3, label: 'Hai mặt phẳng vuông góc', forms: f('Câu hỏi lý thuyết','Chứng minh hai mặt phẳng vuông góc','Chứng minh đường thẳng vuông góc mặt phẳng (dùng 2 mp vuông góc)','Góc giữa hai mặt phẳng','Hình lăng trụ đứng, hình hộp chữ nhật, hình lập phương','Hình chóp đều, hình chóp có mặt bên vuông góc đáy','Thiết diện chứa đường thẳng vuông góc với mặt phẳng') },
    { value: 4, label: 'Khoảng cách trong không gian', forms: f('Khoảng cách từ một điểm đến một đường thẳng','Khoảng cách từ một điểm đến một mặt phẳng','Khoảng cách giữa đường thẳng và mặt phẳng song song','Khoảng cách giữa hai mặt phẳng song song','Khoảng cách giữa hai đường thẳng chéo nhau','Toán thực tế áp dụng khoảng cách') },
    { value: 5, label: 'Thể tích', forms: f('Câu hỏi lý thuyết','Thể tích khối chóp','Thể tích khối lăng trụ','Toán thực tế áp dụng thể tích') },
  ]},
]

export const C11: ChapterItem[] = [
  { value: 1, label: 'Chuyên đề 1. Phép biến hình phẳng', lessons: [
    { value: 1, label: 'Phép biến hình phẳng', forms: f('Phép tịnh tiến','Phép quay','Phép vị tự','Toán thực tế ứng dụng phép biến hình phẳng') },
  ]},
  { value: 2, label: 'Chuyên đề 2. Làm quen với hình học họa hình', lessons: [
    { value: 1, label: 'Làm quen với hình học họa hình', forms: f('Các phương pháp biểu diễn hình không gian','Toán thực tế ứng dụng hình học họa hình') },
  ]},
  { value: 3, label: 'Chuyên đề 3. Vẽ kỹ thuật', lessons: [
    { value: 1, label: 'Vẽ kỹ thuật', forms: f('Các tiêu chuẩn vẽ kỹ thuật','Các bài toán vẽ kỹ thuật thực tế') },
  ]},
]
