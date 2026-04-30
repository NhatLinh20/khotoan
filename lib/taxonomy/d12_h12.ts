import type { ChapterItem } from '../math-taxonomy'
const f = (...ls: string[]) => ls.map((label, i) => ({ value: i + 1, label }))

export const D12: ChapterItem[] = [
  { value: 1, label: 'Chương 1. Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số', lessons: [
    { value: 1, label: 'Tính đơn điệu và cực trị của hàm số', forms: f('Câu hỏi lý thuyết','Tìm khoảng đơn điệu của hàm số','Tìm cực trị của hàm số','Sự biến thiên và cực trị của hàm số hợp, hàm ẩn','Bài toán có tham số m','Toán thực tế ứng dụng tính đơn điệu, cực trị') },
    { value: 2, label: 'Giá trị lớn nhất và giá trị nhỏ nhất của hàm số', forms: f('Tìm GTLN, GTNN trên một đoạn','Tìm GTLN, GTNN trên một khoảng, nửa khoảng','Tìm GTLN, GTNN của hàm số hợp, hàm ẩn','Bài toán có tham số m','Toán thực tế ứng dụng GTLN, GTNN') },
    { value: 3, label: 'Đường tiệm cận của đồ thị hàm số', forms: f('Câu hỏi lý thuyết','Tìm tiệm cận ngang','Tìm tiệm cận đứng','Tìm tiệm cận xiên','Tiệm cận của đồ thị hàm số chứa tham số m','Tiệm cận của đồ thị hàm số hợp, hàm ẩn') },
    { value: 4, label: 'Khảo sát sự biến thiên và vẽ đồ thị của hàm số', forms: f('Câu hỏi lý thuyết (tâm đối xứng, trục đối xứng)','Khảo sát hàm số bậc ba','Khảo sát hàm số phân thức bậc nhất / bậc nhất','Khảo sát hàm số phân thức bậc hai / bậc nhất','Nhận dạng đồ thị, bảng biến thiên','Sự tương giao của hai đồ thị hàm số','Tiếp tuyến của đồ thị hàm số','Toán thực tế ứng dụng đồ thị hàm số') },
  ]},
  { value: 3, label: 'Chương 3. Nguyên hàm và tích phân', lessons: [
    { value: 1, label: 'Nguyên hàm', forms: f('Câu hỏi lý thuyết','Tính nguyên hàm bằng bảng công thức','Tính nguyên hàm bằng phương pháp đổi biến số','Tính nguyên hàm bằng phương pháp từng phần','Toán thực tế ứng dụng nguyên hàm') },
    { value: 2, label: 'Tích phân', forms: f('Câu hỏi lý thuyết','Tính tích phân bằng định nghĩa, tính chất','Tính tích phân bằng phương pháp đổi biến số','Tính tích phân bằng phương pháp từng phần','Tính tích phân hàm ẩn, tích phân hàm phân nhánh','Toán thực tế ứng dụng tích phân') },
    { value: 3, label: 'Ứng dụng hình học của tích phân', forms: f('Tính diện tích hình phẳng','Tính thể tích khối tròn xoay','Toán thực tế ứng dụng tích phân trong hình học') },
  ]},
  { value: 4, label: 'Chương 4. Phương pháp tọa độ trong không gian', lessons: [
    { value: 1, label: 'Tọa độ của điểm và véctơ trong không gian', forms: f('Tìm tọa độ điểm, véctơ','Các phép toán véctơ và ứng dụng (độ dài, góc, vuông góc)','Bài toán tìm điểm đặc biệt (trọng tâm, đối xứng, ...)','Toán thực tế ứng dụng tọa độ trong không gian') },
    { value: 2, label: 'Phương trình mặt phẳng', forms: f('Câu hỏi lý thuyết (VTPT, PT mặt phẳng)','Viết phương trình mặt phẳng','Vị trí tương đối của hai mặt phẳng','Khoảng cách từ điểm đến mặt phẳng','Góc giữa hai mặt phẳng','Bài toán liên quan đến tam diện vuông, tứ diện') },
    { value: 3, label: 'Phương trình đường thẳng trong không gian', forms: f('Câu hỏi lý thuyết (VTCP, PT đường thẳng)','Viết phương trình đường thẳng','Vị trí tương đối (đt & đt, đt & mp)','Góc (đt & đt, đt & mp)','Khoảng cách (điểm & đt, đt & đt)','Bài toán liên quan đến hình chiếu, đối xứng') },
    { value: 4, label: 'Phương trình mặt cầu', forms: f('Câu hỏi lý thuyết (tâm, bán kính, nhận dạng)','Viết phương trình mặt cầu','Vị trí tương đối (mặt cầu & mp, mặt cầu & đt)','Tiếp diện của mặt cầu','Bài toán cực trị (max, min)') },
  ]},
  { value: 6, label: 'Chương 6. Xác suất có điều kiện', lessons: [
    { value: 1, label: 'Xác suất có điều kiện', forms: f('Câu hỏi lý thuyết','Tính xác suất có điều kiện bằng định nghĩa','Công thức xác suất toàn phần','Công thức Bayes','Toán thực tế ứng dụng xác suất có điều kiện') },
  ]},
]

export const H12: ChapterItem[] = [
  { value: 2, label: 'Chương 2. Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm', lessons: [
    { value: 1, label: 'Khoảng biến thiên, khoảng tứ phân vị của mẫu số liệu ghép nhóm', forms: f('Khoảng biến thiên','Khoảng tứ phân vị') },
    { value: 2, label: 'Phương sai, độ lệch chuẩn của mẫu số liệu ghép nhóm', forms: f('Phương sai','Độ lệch chuẩn') },
  ]},
  { value: 5, label: 'Chương 5. Các số đặc trưng đo xu thế trung tâm cho mẫu số liệu ghép nhóm', lessons: [
    { value: 1, label: 'Các số đặc trưng đo xu thế trung tâm cho mẫu số liệu ghép nhóm', forms: f('Số trung bình','Trung vị','Tứ phân vị','Mốt') },
  ]},
]

export const C12: ChapterItem[] = [
  { value: 1, label: 'Chuyên đề 1', lessons: [
    { value: 1, label: 'Bài 1', forms: f('Dạng 1') },
  ]},
]
