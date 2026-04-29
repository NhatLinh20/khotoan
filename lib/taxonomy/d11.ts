import type { ChapterItem } from '../math-taxonomy'
const f = (...ls: string[]) => ls.map((label, i) => ({ value: i + 1, label }))

export const D11: ChapterItem[] = [
  { value: 1, label: 'Chương 1. Hàm số lượng giác và phương trình lượng giác', lessons: [
    { value: 1, label: 'Góc lượng giác', forms: f('Câu hỏi lý thuyết','Chuyển đổi đơn vị độ và radian','Số đo của một góc lượng giác','Độ dài của một cung tròn','Đường tròn lượng giác và ứng dụng','Toán thực tế áp dụng góc lượng giác') },
    { value: 2, label: 'Giá trị lượng giác của một góc lượng giác', forms: f('Câu hỏi lý thuyết','Xét dấu giá trị lượng giác. Tính giá trị lượng giác của một góc','Biến đổi, rút gọn biểu thức lượng giác; chứng minh đẳng thức lượng giác','Các góc lượng giác có liên quan đặc biệt: bù nhau, phụ nhau, đối nhau, hơn kém nhau π','Toán thực tế áp dụng giá trị của một góc lượng giác') },
    { value: 3, label: 'Các công thức lượng giác', forms: f('Câu hỏi lý thuyết','Áp dụng công thức cộng','Áp dụng công thức nhân đôi - hạ bậc','Áp dụng công thức biến đổi tích ↔ tổng','Kết hợp nhiều công thức lượng giác','Nhận dạng tam giác','Toán thực tế áp dụng công thức lượng giác') },
    { value: 4, label: 'Hàm số lượng giác và đồ thị', forms: f('Câu hỏi lý thuyết','Tìm tập xác định','Xét tính đơn điệu','Xét tính chẵn, lẻ','Xét tính tuần hoàn, tìm chu kỳ','Tìm tập giá trị và min, max','Bảng biến thiên và đồ thị','Toán thực tế áp dụng hàm số lượng giác') },
    { value: 5, label: 'Phương trình lượng giác cơ bản', forms: f('Câu hỏi lý thuyết. Khái niệm phương trình tương đương','Điều kiện có nghiệm','Phương trình cơ bản dùng Radian','Phương trình cơ bản dùng Độ','Phương trình đưa về dạng cơ bản','Toán thực tế áp dụng phương trình lượng giác') },
    { value: 6, label: '[Giảm] Phương trình lượng giác thường gặp', forms: f('Phương trình bậc n theo một hàm số lượng giác','Phương trình đẳng cấp bậc n đối với sinx và cosx','Phương trình bậc nhất đối với sinx và cosx','Phương trình đối xứng, phản đối xứng','Phương trình lượng giác không mẫu mực','Phương trình lượng giác có chứa ẩn ở mẫu số','Phương trình lượng giác có chứa tham số','Toán thực tế áp dụng phương trình lượng giác thường gặp') },
  ]},
  { value: 2, label: 'Chương 2. Dãy số. Cấp số cộng. Cấp số nhân', lessons: [
    { value: 1, label: 'Dãy số', forms: f('Câu hỏi lý thuyết','Số hạng tổng quát, biểu diễn dãy số','Tìm số hạng cụ thể của dãy số','Dãy số tăng, dãy số giảm','Dãy số bị chặn','Toán thực tế áp dụng dãy số') },
    { value: 2, label: 'Cấp số cộng', forms: f('Câu hỏi lý thuyết','Nhận diện cấp số cộng, công sai d','Số hạng tổng quát của cấp số cộng','Tìm số hạng cụ thể trong cấp số cộng','Điều kiện để dãy số là cấp số cộng','Tính tổng của cấp số cộng','Toán thực tế áp dụng cấp số cộng') },
    { value: 3, label: 'Cấp số nhân', forms: f('Câu hỏi lý thuyết','Nhận diện cấp số nhân, công bội q','Số hạng tổng quát của cấp số nhân','Tìm số hạng cụ thể trong cấp số nhân','Điều kiện để dãy số là cấp số nhân','Tính tổng của cấp số nhân','Kết hợp cấp số nhân và cấp số cộng','Toán thực tế áp dụng cấp số nhân') },
  ]},
  { value: 3, label: 'Chương 3. Giới hạn. Hàm số liên tục', lessons: [
    { value: 1, label: 'Giới hạn của dãy số', forms: f('Câu hỏi lý thuyết','Phương pháp đặt thừa số chung (lim hữu hạn)','Phương pháp lượng liên hợp (lim hữu hạn)','Giới hạn vô cực','Cấp số nhân lùi vô hạn','Toán thực tế áp dụng giới hạn của dãy số') },
    { value: 2, label: 'Giới hạn của hàm số', forms: f('Câu hỏi lý thuyết','Thay số trực tiếp','PP đặt thừa số chung, kết quả hữu hạn','PP đặt thừa số chung, kết quả vô cực','PP lượng liên hợp, kết quả hữu hạn','PP lượng liên hợp, kết quả vô cực','Giới hạn một bên','Toán thực tế áp dụng giới hạn của hàm số') },
    { value: 3, label: 'Hàm số liên tục', forms: f('Câu hỏi lý thuyết','Tính liên tục thể hiện qua đồ thị','Hàm số liên tục tại một điểm','Hàm số liên tục trên khoảng, đoạn','Bài toán phương trình có nghiệm','Toán thực tế áp dụng hàm số liên tục') },
  ]},
  { value: 4, label: 'Chương 5. Các số đặc trưng đo xu thế trung tâm cho mẫu số liệu ghép nhóm', lessons: [
    { value: 1, label: 'Số trung bình và mốt của mẫu số liệu ghép nhóm', forms: f('Câu hỏi lý thuyết','Mẫu số liệu ghép nhóm','Số trung bình','Mốt') },
    { value: 2, label: 'Trung vị và tứ phân vị của mẫu số liệu ghép nhóm', forms: f('Câu hỏi lý thuyết','Trung vị','Tứ phân vị') },
  ]},
  { value: 5, label: 'Chương 6. Hàm số mũ và hàm số lôgarít', lessons: [
    { value: 1, label: 'Phép tính luỹ thừa', forms: f('Tính giá trị của biểu thức chứa lũy thừa','Biến đổi, rút gọn biểu thức chứa lũy thừa','Điều kiện cho luỹ thừa, căn thức','So sánh các lũy thừa') },
    { value: 2, label: 'Phép tính lôgarít', forms: f('Tính giá trị biểu thức chứa lôgarít','Biến đổi, biểu diễn biểu thức chứa lôgarít','Rút gọn, chứng minh biểu thức lôgarít','Số e và bài toán lãi kép','Toán thực tế áp dụng phép tính lôgarít') },
    { value: 3, label: 'Hàm số mũ. Hàm số lôgarít', forms: f('Câu hỏi lý thuyết hàm số lũy thừa, mũ, lôgarít','Tập xác định của hàm số','Sự biến thiên và đồ thị của hàm số mũ, lôgarít','So sánh các luỹ thừa và lôgarít','Toán thực tế áp dụng hàm số mũ, lôgarít') },
    { value: 4, label: 'Phương trình, bất phương trình mũ và lôgarít', forms: f('Điều kiện có nghiệm','Phương trình mũ, lôgarít cơ bản','Bất phương trình mũ, lôgarít cơ bản','Phương trình mũ, lôgarít đưa về cùng cơ số','Bất phương trình mũ, lôgarít đưa về cùng cơ số','Toán thực tế áp dụng phương trình mũ, lôgarít') },
    { value: 5, label: '[Giảm] Các phương pháp giải được giảm tải', forms: f('Phương pháp đặt ẩn phụ cho PT mũ, lôgarít','Phương pháp lôgarít hóa, mũ cho PT mũ, lôgarít','Phương pháp hàm số, đánh giá cho PT mũ, lôgarít','Hệ PT mũ, lôgarít','Toán thực tế áp dụng phương trình mũ, lôgarít') },
  ]},
  { value: 6, label: 'Chương 7. Đạo hàm', lessons: [
    { value: 1, label: 'Đạo hàm', forms: f('Tính đạo hàm bằng định nghĩa','Số gia hàm số, số gia biến số','Ý nghĩa Hình học của đạo hàm','Ý nghĩa Vật lý của đạo hàm','Toán thực tế khác áp dụng định nghĩa đạo hàm') },
    { value: 2, label: 'Các quy tắc đạo hàm', forms: f('Tính đạo hàm','Đẳng thức có y và y\'','Tiếp tuyến tại một điểm','Tiếp tuyến biết trước hệ số góc','Tiếp tuyến chưa biết tiếp điểm và hệ số góc','Giới hạn hàm số lượng giác, hàm số mũ, lôgarít','Dùng đạo hàm cho nhị thức Newton','Toán thực tế áp dụng quy tắc đạo hàm') },
    { value: 3, label: 'Đạo hàm cấp hai', forms: f('Tính đạo hàm cấp hai','Đẳng thức có y và (y\', y\'\')','Toán thực tế và Ý nghĩa Vật lý của đạo hàm cấp hai') },
  ]},
  { value: 7, label: 'Chương 9. Xác suất', lessons: [
    { value: 1, label: 'Biến cố giao và quy tắc nhân xác suất', forms: f('Câu hỏi lí thuyết','Xác định và đếm số phần tử biến cố giao','Công thức nhân xác suất cho 2 biến cố độc lập','Tính xác suất biến cố giao bằng sơ đồ hình cây') },
    { value: 2, label: 'Biến cố hợp và quy tắc cộng xác suất', forms: f('Câu hỏi lí thuyết','Xác định và đếm số phần tử biến cố hợp','Quy tắc cộng cho hai biến cố xung khắc','Quy tắc cộng cho hai biến cố bất kì','Tính xác suất biến cố hợp bằng sơ đồ hình cây') },
  ]},
]
