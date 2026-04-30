import type { ChapterItem } from '../math-taxonomy'
const f = (...ls: string[]) => ls.map((label, i) => ({ value: i + 1, label }))

export const H10: ChapterItem[] = [
  { value: 4, label: 'Chương 4. Hệ thức lượng trong tam giác', lessons: [
    { value: 1, label: 'Giá trị lượng giác của một góc từ 0 đến 180', forms: f('Tính giá trị lượng giác của một góc','Tính giá trị của biểu thức lượng giác','Chứng minh các đẳng thức lượng giác','Góc giữa hai véctơ') },
    { value: 2, label: 'Hệ thức lượng trong tam giác', forms: f('Định lí côsin và định lí sin','Tính các cạnh và các góc của tam giác','Tính diện tích và các bán kính đường tròn ngoại tiếp, nội tiếp','Giải tam giác','Bài toán thực tế áp dụng hệ thức lượng trong tam giác') },
  ]},
  { value: 5, label: 'Chương 5. Véctơ', lessons: [
    { value: 1, label: 'Các khái niệm mở đầu', forms: f('Câu hỏi lý thuyết','Xác định một véctơ, độ dài véctơ','Véctơ cùng phương, véctơ bằng nhau') },
    { value: 2, label: 'Tổng và hiệu của hai véctơ', forms: f('Câu hỏi lý thuyết','Tính độ dài của tổng, hiệu hai véctơ','Chứng minh đẳng thức véctơ','Xác định điểm thoả mãn đẳng thức véctơ','Bài toán thực tế ứng dụng tổng, hiệu véctơ') },
    { value: 3, label: 'Tích của một số với một véctơ', forms: f('Câu hỏi lý thuyết','Xác định véctơ ku','Tính độ dài véctơ ku','Chứng minh đẳng thức véctơ','Xác định điểm thoả mãn đẳng thức véctơ','Hai véctơ cùng phương, ba điểm thẳng hàng','Biểu diễn (phân tích) một véctơ qua hai véctơ cho trước','Toán thực tế ứng dụng tích một số với véctơ') },
    { value: 4, label: 'Tích vô hướng của hai véctơ', forms: f('Câu hỏi lý thuyết','Tính tích vô hướng của hai véctơ','Tính độ dài của véctơ','Tính góc giữa hai véctơ','Chứng minh hai véctơ vuông góc','Chứng minh đẳng thức véctơ','Xác định điểm thoả mãn đẳng thức véctơ','Bài toán cực trị (max, min)','Toán thực tế ứng dụng tích vô hướng') },
  ]},
  { value: 9, label: 'Chương 9. Phương pháp tọa độ trong mặt phẳng', lessons: [
    { value: 1, label: 'Tọa độ của véctơ', forms: f('Tìm tọa độ của véctơ','Tìm tọa độ của điểm','Các phép toán véctơ và ứng dụng (cùng phương, thẳng hàng)','Tích vô hướng và ứng dụng (độ dài, góc, vuông góc)','Bài toán tìm điểm đặc biệt trong tam giác, tứ giác','Toán thực tế ứng dụng tọa độ véctơ') },
    { value: 2, label: 'Đường thẳng trong mặt phẳng tọa độ', forms: f('Câu hỏi lý thuyết (VTPT, VTCP, PTTQ, PTTS)','Viết phương trình đường thẳng','Vị trí tương đối của hai đường thẳng','Góc giữa hai đường thẳng','Khoảng cách từ điểm đến đường thẳng','Bài toán liên quan đến đối xứng, chiếu vuông góc','Bài toán liên quan đến tam giác, tứ giác, hình hành, ...','Bài toán cực trị (max, min)') },
    { value: 3, label: 'Đường tròn trong mặt phẳng tọa độ', forms: f('Câu hỏi lý thuyết (tâm, bán kính, nhận dạng PT)','Viết phương trình đường tròn','Vị trí tương đối (đường thẳng & đường tròn, đường tròn & đường tròn)','Phương trình tiếp tuyến của đường tròn','Bài toán liên quan đến tam giác, tứ giác','Bài toán cực trị (max, min)') },
    { value: 4, label: 'Ba đường conic trong mặt phẳng tọa độ', forms: f('Đường Elip (nhận dạng, tìm các yếu tố)','Viết phương trình Elip','Bài toán liên quan đến điểm thuộc Elip','Đường Hyperbol (nhận dạng, tìm các yếu tố)','Viết phương trình Hyperbol','Đường Parabol (nhận dạng, tìm các yếu tố)','Viết phương trình Parabol','Toán thực tế ứng dụng ba đường conic') },
  ]},
]

export const C10: ChapterItem[] = [
  { value: 1, label: 'Chuyên đề 1. Hệ phương trình bậc nhất 3 ẩn', lessons: [
    { value: 1, label: 'Hệ phương trình bậc nhất 3 ẩn', forms: f('Giải hệ phương trình bằng phương pháp Gauss','Toán thực tế ứng dụng hệ phương trình bậc nhất 3 ẩn') },
  ]},
  { value: 2, label: 'Chuyên đề 2. Phương pháp quy nạp toán học. Nhị thức Newton', lessons: [
    { value: 1, label: 'Phương pháp quy nạp toán học', forms: f('Chứng minh đẳng thức','Chứng minh bất đẳng thức','Chứng minh tính chia hết') },
    { value: 2, label: 'Nhị thức Newton', forms: f('Khai triển nhị thức Newton với số mũ lớn','Tìm hệ số, số hạng trong khai triển','Ứng dụng nhị thức Newton tính tổng') },
  ]},
  { value: 3, label: 'Chuyên đề 3. Ba đường Conic và ứng dụng', lessons: [
    { value: 1, label: 'Ba đường Conic và ứng dụng', forms: f('Các tính chất của Elip, Hyperbol, Parabol','Toán thực tế ứng dụng ba đường Conic') },
  ]},
]
