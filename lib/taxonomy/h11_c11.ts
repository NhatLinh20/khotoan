import type { ChapterItem } from '../math-taxonomy'
const f = (...ls: string[]) => ls.map((label, i) => ({ value: i + 1, label }))

export const H11: ChapterItem[] = [
  { value: 1, label: 'Chương 4. Đường thẳng, mặt phẳng. Quan hệ song song', lessons: [
    { value: 1, label: 'Điểm, đường thẳng và mặt phẳng', forms: f('Câu hỏi lý thuyết','Hình biểu diễn của một hình không gian','Tìm giao tuyến của hai mặt phẳng','Tìm giao điểm của đường thẳng và mặt phẳng','Xác định thiết diện','Ba điểm thẳng hàng, ba đường thẳng đồng quy','Toán thực tế áp dụng điểm, đường thẳng và mặt phẳng') },
    { value: 2, label: 'Hai đường thẳng song song', forms: f('Câu hỏi lý thuyết','Hai đường thẳng song song','Tìm giao tuyến bằng cách kẻ song song','Tìm giao điểm của đường thẳng và mặt phẳng','Xác định thiết diện bằng cách kẻ song song','Ba điểm thẳng hàng','Bài toán quỹ tích và điểm cố định','Toán thực tế áp dụng hai đường thẳng song song') },
    { value: 3, label: 'Đường thẳng và mặt phẳng song song', forms: f('Câu hỏi lý thuyết','Đường thẳng song song với mặt phẳng','Tìm giao tuyến bằng cách kẻ song song','Tìm giao điểm của đường thẳng và mặt phẳng','Xác định thiết diện bằng cách kẻ song song','Ba điểm thẳng hàng','Bài toán quỹ tích và điểm cố định','Toán thực tế áp dụng đường thẳng song song mặt phẳng') },
    { value: 4, label: 'Hai mặt phẳng song song', forms: f('Câu hỏi lý thuyết','Hai mặt phẳng song song','Chứng minh đường thẳng song song mặt phẳng','Xác định mặt phẳng đi qua một điểm và song song với một mặt phẳng','Xác định mặt phẳng chứa đường thẳng và song song với một mặt phẳng','Bài toán tổng hợp','Toán thực tế áp dụng hai mặt phẳng song song') },
    { value: 5, label: 'Hình lăng trụ và hình hộp (xiên)', forms: f('Câu hỏi lý thuyết','Bài toán về hình lăng trụ (xiên)','Bài toán về hình hộp (xiên)','Toán thực tế áp dụng hình lăng trụ và hình hộp') },
    { value: 6, label: 'Phép chiếu song song', forms: f('Câu hỏi lý thuyết','Hình biểu diễn của một hình không gian','Xác định yếu tố song song','Xác định phương chiếu','Tính tỉ số đoạn thẳng, diện tích qua phép chiếu') },
  ]},
  { value: 2, label: 'Chương 8. Quan hệ vuông góc trong không gian', lessons: [
    { value: 1, label: 'Hai đường thẳng vuông góc', forms: f('Câu hỏi lí thuyết','Xác định hai đường thẳng vuông góc','Tìm góc giữa hai đường thẳng','Toán thực tế áp dụng hai đường thẳng vuông góc') },
    { value: 2, label: 'Đường thẳng vuông góc với mặt phẳng', forms: f('Câu hỏi lí thuyết','Xác định hoặc chứng minh đường thẳng và mặt phẳng vuông góc','Xác định hoặc chứng minh hai đường thẳng vuông góc','Dựng mặt phẳng, tìm thiết diện','Hình chiếu vuông góc của một hình trên mặt phẳng','Toán thực tế áp dụng đường thẳng vuông góc mặt phẳng') },
    { value: 3, label: 'Phép chiếu vuông góc', forms: f('Lý thuyết về phép chiếu vuông góc','Hình chiếu vuông góc của đa giác trên mặt phẳng','Các bài toán thực tế áp dụng phép chiếu vuông góc') },
    { value: 4, label: 'Hai mặt phẳng vuông góc', forms: f('Câu hỏi lí thuyết','Xác định/chứng minh đường thẳng vuông góc mặt phẳng, mặt phẳng vuông góc','Xác định góc giữa hai mặt phẳng','Dựng mặt phẳng, thiết diện','Nhận dạng và tính toán liên quan các hình thông dụng','Bài toán cho trước góc giữa d và (P)','Toán thực tế áp dụng hai mặt phẳng vuông góc') },
    { value: 5, label: 'Khoảng cách', forms: f('Câu hỏi lí thuyết','Khoảng cách giữa 2 điểm, từ 1 điểm đến 1 đường thẳng','Khoảng cách từ một điểm đến một mặt phẳng','Khoảng cách giữa hai đường thẳng chéo nhau','Đường vuông góc chung của hai đường thẳng chéo nhau','Toán thực tế áp dụng khoảng cách') },
    { value: 6, label: 'Góc giữa đường thẳng và mặt phẳng. Góc nhị diện', forms: f('Góc giữa đường thẳng và mặt phẳng','Góc nhị diện, góc phẳng nhị diện','Góc giữa 2 mặt phẳng, biết trước góc (d,(P))','Khoảng cách giữa điểm, đường, biết trước góc (d,(P))','Khoảng cách giữa điểm - mặt phẳng, biết trước góc (d,(P))','Khoảng cách giữa 2 đường chéo nhau, biết trước góc (d,(P))','Toán thực tế về góc đường thẳng, mặt phẳng, góc nhị diện') },
    { value: 7, label: 'Hình lăng trụ đứng. Hình chóp đều. Thể tích', forms: f('Câu hỏi lí thuyết, công thức','Thể tích khối chóp tam giác','Thể tích khối chóp tứ giác','Thể tích khối lăng trụ tam giác','Thể tích khối lăng trụ tứ giác','Thể tích khối chóp cụt và các khối khác','Tỉ số thể tích','Ứng dụng thể tích tính góc, khoảng cách','Toán thực tế hình lăng trụ đứng, chóp đều, thể tích') },
  ]},
]

export const C11: ChapterItem[] = [
  { value: 1, label: 'Chuyên đề 1. Phép biến hình phẳng', lessons: [
    { value: 1, label: 'Phép biến hình, phép dời hình và hai hình bằng nhau', forms: f('Câu hỏi lý thuyết','Bài toán xác định một phép đặt tương ứng có là phép dời hình hay không?','Xác định ảnh khi thực hiện phép dời hình') },
    { value: 2, label: 'Phép tịnh tiến', forms: f('Câu hỏi lý thuyết','Tìm ảnh hoặc tạo ảnh khi thực hiện phép tịnh tiến','Ứng dụng phép tịnh tiến') },
    { value: 3, label: 'Phép đối xứng trục', forms: f('Câu hỏi lý thuyết','Tìm ảnh hoặc tạo ảnh khi thực hiện phép đối xứng trục','Xác định trục đối xứng và số trục đối xứng của một hình','Ứng dụng phép đối xứng trục') },
    { value: 4, label: 'Phép đối xứng tâm', forms: f('Câu hỏi lý thuyết','Tìm ảnh, tạo ảnh khi thực hiện phép đối xứng tâm','Xác định hình có tâm đối xứng','Ứng dụng phép đối xứng tâm') },
    { value: 5, label: 'Phép quay', forms: f('Câu hỏi lý thuyết','Xác định vị trí ảnh của điểm, hình khi thực hiện phép quay cho trước','Tìm tọa độ ảnh của điểm, phương trình của một đường thẳng khi thực hiện phép quay','Ứng dụng phép quay') },
    { value: 6, label: 'Phép vị tự', forms: f('Câu hỏi lý thuyết','Xác định ảnh, tạo ảnh khi thực hiện phép vị tự','Tìm tâm vị tự của hai đường tròn','Ứng dụng phép vị tự') },
    { value: 7, label: 'Phép đồng dạng', forms: f('Câu hỏi lý thuyết','Xác định ảnh, tạo ảnh khi thực hiện phép đồng dạng') },
  ]},
  { value: 2, label: 'Chuyên đề 2. Lý thuyết đồ thị', lessons: [
    { value: 1, label: 'Đồ thị', forms: f('Câu hỏi về đỉnh, cạnh của đồ thị','Câu hỏi về bậc của đồ thị','Câu hỏi tổng hợp') },
    { value: 2, label: 'Đường đi Euler và Hamilton', forms: f('Đường đi Euler','Đường đi Hamilton','Câu hỏi tổng hợp') },
    { value: 3, label: 'Bài toán tìm đường đi ngắn nhất', forms: f('Bài toán tìm đường đi ngắn nhất','Tổng hợp') },
  ]},
  { value: 3, label: 'Chuyên đề 3. Một số yếu tố vẽ kỹ thuật', lessons: [
    { value: 1, label: 'Hình biểu diễn của một hình, khối', forms: f('Lý thuyết về phép chiếu và hình biểu diễn song song','Lý thuyết về phép chiếu vuông góc','Lý thuyết về phép chiếu trục đo','Tổng hợp') },
    { value: 2, label: 'Bản vẽ kỹ thuật', forms: f('Lý thuyết cơ bản về bản vẽ kỹ thuật','Phương pháp biểu diễn bản vẽ kỹ thuật','Tổng hợp') },
  ]},
]
