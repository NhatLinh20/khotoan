import type { ChapterItem } from '../math-taxonomy'
const f = (...ls: string[]) => ls.map((label, i) => ({ value: i + 1, label }))

export const D12: ChapterItem[] = [
  { value: 1, label: 'Chương 1. Ứng dụng đạo hàm để khảo sát hàm số', lessons: [
    { value: 1, label: 'Sự đồng biến và nghịch biến của hàm số', forms: f('Xét tính đơn điệu của hàm số cho bởi công thức','Xét tính đơn điệu dựa vào bảng biến thiên, đồ thị','Tìm tham số m để hàm số đơn điệu','Ứng dụng tính đơn điệu để chứng minh bất đẳng thức, giải phương trình, bất phương trình, hệ phương trình','Toán thực tế ứng dụng sự đồng biến nghịch biến') },
    { value: 2, label: 'Cực trị của hàm số', forms: f('Tìm cực trị của hàm số cho bởi công thức','Tìm cực trị dựa vào BBT, đồ thị','Tìm m để hàm số đạt cực trị tại 1 điểm x0 cho trước','Tìm m để hàm số, đồ thị hàm số bậc ba có cực trị thỏa mãn điều kiện','Tìm m để hàm số, đồ thị hàm số trùng phương có cực trị thỏa mãn điều kiện','Tìm m để hàm số, đồ thị hàm số các hàm số khác có cực trị thỏa mãn điều kiện','Toán thực tế ứng dụng cực trị của hàm số') },
    { value: 3, label: 'Giá trị lớn nhất và giá trị nhỏ nhất của hàm số', forms: f('GTLN, GTNN trên đoạn [a; b]','GTLN, GTNN trên khoảng','Sử dụng các đánh giá, bất đẳng thức cổ điển','Ứng dụng GTNN, GTLN trong bài toán phương trình, bất phương trình, hệ phương trình','GTLN, GTNN hàm nhiều biến','Toán thực tế ứng dụng GTLN, GTNN của hàm số') },
    { value: 4, label: 'Đường tiệm cận', forms: f('Bài toán xác định các đường tiệm cận của hàm số (không chứa tham số) hoặc biết BBT, đồ thị','Bài toán xác định các đường tiệm cận của hàm số có chứa tham số','Bài toán liên quan đến đồ thị hàm số và các đường tiệm cận','Toán thực tế ứng dụng tiệm cận') },
    { value: 5, label: 'Khảo sát sự biến thiên và vẽ đồ thị hàm số', forms: f('Nhận dạng đồ thị','Các phép biến đổi đồ thị','Biện luận số giao điểm dựa vào đồ thị, bảng biến thiên','Sự tương giao của hai đồ thị (liên quan đến tọa độ giao điểm)','Đồ thị của hàm đạo hàm','Phương trình tiếp tuyến của đồ thị hàm số','Điểm đặc biệt của đồ thị hàm số','Toán thực tế ứng dụng khảo sát hàm số') },
  ]},
  { value: 2, label: 'Chương 3. Các số đặc trưng đo mức độ phân tán (ghép nhóm)', lessons: [
    { value: 1, label: 'Khoảng biến thiên, khoảng tứ phân vị của mẫu số liệu ghép nhóm', forms: f('Công thức lý thuyết','Tìm khoảng biến thiên','Tìm khoảng tứ phân vị','Câu hỏi tổng hợp') },
    { value: 2, label: 'Phương sai, độ lệch chuẩn của mẫu số liệu ghép nhóm', forms: f('Công thức lý thuyết','Tìm phương sai, độ lệch chuẩn','Câu hỏi tổng hợp') },
  ]},
  { value: 3, label: 'Chương 4. Nguyên hàm, tích phân và ứng dụng', lessons: [
    { value: 1, label: 'Nguyên hàm', forms: f('Công thức lý thuyết','Nguyên hàm cơ bản đa thức, phân thức','Nguyên hàm cơ bản hàm lượng giác','Nguyên hàm cơ bản hàm mũ, luỹ thừa','Phương pháp đổi biến số cơ bản','Toán thực tế áp dụng nguyên hàm') },
    { value: 2, label: 'Tích phân', forms: f('Công thức lý thuyết','Tích phân cơ bản đa thức, phân thức','Tích phân cơ bản hàm lượng giác','Tích phân cơ bản hàm mũ, luỹ thừa','Phương pháp đổi biến số cơ bản','Toán thực tế áp dụng nguyên hàm') },
    { value: 3, label: 'Ứng dụng thực tế và hình học của tích phân', forms: f('Diện tích hình phẳng được giới hạn bởi các đồ thị','Bài toán thực tế sử dụng diện tích hình phẳng','Thể tích giới hạn bởi các đồ thị (tròn xoay)','Thể tích tính theo mặt cắt S(x)','Bài toán thực tế và ứng dụng thể tích tròn xoay, S(x)') },
  ]},
  { value: 4, label: 'Chương 6. Một số yếu tố xác suất', lessons: [
    { value: 1, label: 'Xác suất có điều kiện', forms: f('Công thức lý thuyết','Tính xác suất có điều kiện bằng công thức','Tính xác suất có điều kiện bằng sơ đồ cây','Bài toán tổng hợp') },
    { value: 2, label: 'Công thức xác suất toàn phần. Công thức Bayes', forms: f('Công thức lý thuyết','Tính xác suất bằng công thức xác suất toàn phần','Tính xác suất bằng công thức xác suất Bayes','Bài toán tổng hợp') },
  ]},
]

export const H12: ChapterItem[] = [
  { value: 1, label: 'Chương 2. Tọa độ của véc-tơ trong không gian', lessons: [
    { value: 1, label: 'Véc-tơ và các phép toán véc-tơ trong không gian (chưa toạ độ hoá)', forms: f('Công thức lý thuyết','Tổng, hiệu, tích một số với véc-tơ','Tích vô hướng và ứng dụng','Toán thực tế áp dụng các phép toán véc-tơ') },
    { value: 2, label: 'Toạ độ của véc-tơ và các công thức', forms: f('Công thức lý thuyết','Tìm tọa độ điểm','Tìm tọa độ véc-tơ','Công thức toạ độ của tích vô hướng và ứng dụng','Công thức toạ độ của tích có hướng và ứng dụng','Toán thực tế áp dụng các phép toán toạ độ hoá véc-tơ') },
  ]},
  { value: 2, label: 'Chương 5. Phương trình mặt phẳng, đường thẳng, mặt cầu trong không gian Oxyz', lessons: [
    { value: 1, label: 'Phương trình mặt phẳng', forms: f('Câu hỏi lý thuyết','Xác định véc-tơ pháp tuyến, cặp véc-tơ chỉ phương','Viết phương trình tổng quát mặt phẳng','Vị trí tương đối giữa hai mặt phẳng (song song, vuông góc)','Khoảng cách điểm tới mặt phẳng','Góc giữa hai mặt phẳng','Toán thực tế áp dụng phương trình mặt phẳng') },
    { value: 2, label: 'Phương trình đường thẳng trong không gian', forms: f('Câu hỏi lý thuyết','Xác định véc-tơ chỉ phương, cặp véc-tơ pháp tuyến','Viết phương trình tổng quát, chính tắc, tham số đường thẳng','Vị trí tương đối giữa hai đường thẳng','Vị trí tương đối giữa đường thẳng và mặt phẳng','Khoảng cách điểm tới đường thẳng','Góc giữa hai đường thẳng, đường thẳng và mặt phẳng','Toán thực tế áp dụng phương trình đường thẳng') },
    { value: 3, label: 'Phương trình mặt cầu trong không gian', forms: f('Câu hỏi lý thuyết','Xác định tâm, bán kính, đường kính mặt cầu','Viết phương trình tổng quát mặt cầu','Toán thực tế áp dụng phương trình mặt cầu') },
  ]},
]
