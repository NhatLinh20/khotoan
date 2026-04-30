import type { ChapterItem } from '../math-taxonomy'
const f = (...ls: string[]) => ls.map((label, i) => ({ value: i + 1, label }))

export const D11: ChapterItem[] = [
  { value: 1, label: 'Chương 1. Hàm số lượng giác và phương trình lượng giác', lessons: [
    { value: 1, label: 'Góc lượng giác. Giá trị lượng giác của góc lượng giác', forms: f('Đổi đơn vị độ và radian','Độ dài cung tròn','Tính các giá trị lượng giác của một góc','Tính giá trị biểu thức lượng giác','Chứng minh đẳng thức lượng giác','Góc lượng giác, hệ thức Chasles') },
    { value: 2, label: 'Các công thức lượng giác', forms: f('Công thức cộng','Công thức nhân đôi','Công thức biến đổi tích thành tổng','Công thức biến đổi tổng thành tích','Rút gọn, tính giá trị biểu thức lượng giác','Chứng minh đẳng thức lượng giác') },
    { value: 3, label: 'Hàm số lượng giác', forms: f('Câu hỏi lý thuyết','Tìm tập xác định của hàm số','Tìm giá trị lớn nhất, nhỏ nhất','Tính chẵn, lẻ, tuần hoàn của hàm số','Sự biến thiên và đồ thị hàm số') },
    { value: 4, label: 'Phương trình lượng giác cơ bản', forms: f('Phương trình sinx=m, cosx=m','Phương trình tanx=m, cotx=m','Phương trình lượng giác có điều kiện','Phương trình lượng giác chứa tham số m','Toán thực tế áp dụng phương trình lượng giác') },
    { value: 5, label: 'Một số phương trình lượng giác thường gặp', forms: f('Phương trình bậc nhất đối với sin và cos','Phương trình bậc hai đối với một hàm số lượng giác','Phương trình đưa về dạng cơ bản (dùng công thức lượng giác)','Phương trình lượng giác khác') },
  ]},
  { value: 2, label: 'Chương 2. Dãy số. Cấp số cộng và cấp số nhân', lessons: [
    { value: 1, label: 'Dãy số', forms: f('Câu hỏi lý thuyết','Tìm các số hạng của dãy số','Tìm công thức số hạng tổng quát','Dãy số tăng, dãy số giảm','Dãy số bị chặn') },
    { value: 2, label: 'Cấp số cộng', forms: f('Câu hỏi lý thuyết (định nghĩa, tính chất)','Xác định u1, d, un, Sn','Tìm công thức số hạng tổng quát','Chứng minh một dãy số là CSC','Toán thực tế áp dụng cấp số cộng') },
    { value: 3, label: 'Cấp số nhân', forms: f('Câu hỏi lý thuyết (định nghĩa, tính chất)','Xác định u1, q, un, Sn','Tìm công thức số hạng tổng quát','Chứng minh một dãy số là CSN','Toán thực tế áp dụng cấp số nhân') },
  ]},
  { value: 3, label: 'Chương 3. Giới hạn. Hàm số liên tục', lessons: [
    { value: 1, label: 'Giới hạn của dãy số', forms: f('Câu hỏi lý thuyết','Phương pháp đặt thừa số chung (lim hữu hạn)','Phương pháp lượng liên hợp (lim hữu hạn)','Giới hạn vô cực','Cấp số nhân lùi vô hạn','Toán thực tế áp dụng giới hạn của dãy số') },
    { value: 2, label: 'Giới hạn của hàm số', forms: f('Giới hạn tại một điểm, giới hạn một bên','Giới hạn tại vô cực','Giới hạn vô cực','Dạng vô định 0/0 (đa thức, căn thức)','Dạng vô định ∞/∞','Dạng vô định ∞-∞, 0·∞','Giới hạn chứa tham số m','Toán thực tế áp dụng giới hạn của hàm số') },
    { value: 3, label: 'Hàm số liên tục', forms: f('Hàm số liên tục tại một điểm','Hàm số liên tục trên một khoảng, một đoạn','Xét tính liên tục của hàm số chứa tham số m','Chứng minh phương trình có nghiệm','Toán thực tế áp dụng hàm số liên tục') },
  ]},
  { value: 5, label: 'Chương 5. Các số đặc trưng đo xu thế trung tâm của mẫu số liệu ghép nhóm', lessons: [
    { value: 1, label: 'Số trung bình, mốt của mẫu số liệu ghép nhóm', forms: f('Bảng số liệu ghép nhóm','Số trung bình cộng','Mốt') },
    { value: 2, label: 'Trung vị, tứ phân vị của mẫu số liệu ghép nhóm', forms: f('Số trung vị','Tứ phân vị') },
  ]},
  { value: 6, label: 'Chương 6. Hàm số mũ và hàm số lôgarit', lessons: [
    { value: 1, label: 'Phép tính lũy thừa', forms: f('Câu hỏi lý thuyết','Tính giá trị, rút gọn biểu thức lũy thừa','So sánh các biểu thức lũy thừa','Toán thực tế áp dụng phép tính lũy thừa') },
    { value: 2, label: 'Phép tính lôgarit', forms: f('Câu hỏi lý thuyết','Tính giá trị, rút gọn biểu thức lôgarit','Biểu diễn lôgarit này qua lôgarit khác','Toán thực tế áp dụng phép tính lôgarit') },
    { value: 3, label: 'Hàm số mũ. Hàm số lôgarit', forms: f('Câu hỏi lý thuyết','Tập xác định, đạo hàm của hàm số','Sự biến thiên và đồ thị hàm số mũ, lôgarit','Toán thực tế áp dụng hàm số mũ, lôgarit') },
    { value: 4, label: 'Phương trình, bất phương trình mũ và lôgarit', forms: f('Phương trình mũ','Phương trình lôgarit','Bất phương trình mũ','Bất phương trình lôgarit','Toán thực tế áp dụng phương trình, BPT mũ và lôgarit') },
  ]},
  { value: 7, label: 'Chương 7. Đạo hàm', lessons: [
    { value: 1, label: 'Đạo hàm', forms: f('Định nghĩa đạo hàm','Tính đạo hàm bằng định nghĩa','Ý nghĩa hình học của đạo hàm (tiếp tuyến)','Đạo hàm một bên và tính liên tục','Toán thực tế áp dụng đạo hàm') },
    { value: 2, label: 'Các quy tắc tính đạo hàm', forms: f('Đạo hàm của hàm số sơ cấp (x^n, căn, sin, cos, ...)','Quy tắc đạo hàm tổng, hiệu, tích, thương','Đạo hàm của hàm số hợp','Đạo hàm của hàm số lượng giác','Đạo hàm cấp hai','Giải phương trình, BPT có chứa đạo hàm','Tiếp tuyến của đồ thị hàm số','Toán thực tế áp dụng các quy tắc đạo hàm') },
  ]},
  { value: 9, label: 'Chương 9. Xác suất', lessons: [
    { value: 1, label: 'Biến cố giao và quy tắc nhân xác suất', forms: f('Câu hỏi lý thuyết','Phép toán biến cố (giao, hợp, biến cố độc lập)','Quy tắc nhân xác suất') },
    { value: 2, label: 'Biến cố hợp và quy tắc cộng xác suất', forms: f('Biến cố xung khắc','Quy tắc cộng xác suất') },
  ]},
]
