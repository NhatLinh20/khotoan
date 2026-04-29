import type { ChapterItem } from '../math-taxonomy'
const f = (...ls: string[]) => ls.map((label, i) => ({ value: i + 1, label }))

export const D10: ChapterItem[] = [
  { value: 1, label: 'Chương 1. Mệnh đề. Tập hợp', lessons: [
    { value: 1, label: 'Mệnh đề', forms: f('Xác định mệnh đề, mệnh đề chứa biến','Tính đúng-sai của mệnh đề','Phủ định của một mệnh đề','Mệnh đề kéo theo, mệnh đề đảo, mệnh đề tương đương','Mệnh đề với mọi, tồn tại (và phủ định chúng)','Áp dụng mệnh đề vào suy luận có lí') },
    { value: 2, label: 'Tập hợp', forms: f('Tập hợp và phần tử của tập hợp','Tập hợp con. Hai tập hợp bằng nhau','Ký hiệu khoảng, đoạn, nửa khoảng') },
    { value: 3, label: 'Các phép toán tập hợp', forms: f('Giao và hợp của hai tập hợp (rời rạc)','Hiệu và phần bù của hai tập hợp (rời rạc)','Giao và hợp (dùng đoạn, khoảng)','Hiệu và phần bù (dùng đoạn, khoảng)','Toán thực tế ứng dụng của tập hợp') },
  ]},
  { value: 2, label: 'Chương 2. BPT và hệ BPT bậc nhất hai ẩn', lessons: [
    { value: 1, label: 'Bất phương trình bậc nhất hai ẩn', forms: f('Các khái niệm về BPT bậc nhất hai ẩn','Miền nghiệm của BPT bậc nhất hai ẩn','Toán thực tế về BPT bậc nhất hai ẩn') },
    { value: 2, label: 'Hệ bất phương trình bậc nhất hai ẩn', forms: f('Các khái niệm về Hệ BPT bậc nhất hai ẩn','Miền nghiệm của Hệ BPT bậc nhất hai ẩn','Toán thực tế về Hệ BPT bậc nhất hai ẩn') },
  ]},
  { value: 3, label: 'Chương 3. Hàm số bậc hai và đồ thị', lessons: [
    { value: 1, label: 'Hàm số và đồ thị', forms: f('Xác định một hàm số','Tập xác định của hàm số','Giá trị của hàm số','Đồ thị của hàm số','Tính đồng biến, nghịch biến','Tính chẵn, lẻ','Toán thực tế về hàm số') },
    { value: 2, label: 'Hàm số bậc hai', forms: f('Xác định hàm số bậc hai','Bảng biến thiên, tính đơn điệu, max, min','Đồ thị của hàm số bậc hai','Bài toán về sự tương giao','Hàm số chứa dấu giá trị tuyệt đối','Toán thực tế ứng dụng hàm số bậc hai') },
  ]},
  { value: 4, label: 'Chương 6. Thống kê', lessons: [
    { value: 1, label: 'Số gần đúng. Sai số', forms: f('Tính và ước lượng sai số tuyệt đối, tương đối','Tính và xác định độ chính xác của kết quả','Quy tròn số gần đúng','Viết số gần đúng cho số đúng biết độ chính xác') },
    { value: 2, label: 'Mô tả và biểu diễn dữ liệu trên các bảng và biểu đồ', forms: f('Đọc và phân tích thông tin trên bảng số liệu','Đọc và phân tích thông tin trên biểu đồ','Số liệu bất thường trên bảng số liệu','Số liệu bất thường trên biểu đồ') },
    { value: 3, label: 'Các số đặc trưng đo xu thế trung tâm của mẫu số liệu', forms: f('Câu hỏi lý thuyết','Số trung bình cộng','Số trung vị','Tứ phân vị','Mốt') },
    { value: 4, label: 'Các số đặc trưng đo mức độ phân tán của mẫu số liệu', forms: f('Câu hỏi lý thuyết','Khoảng biến thiên, khoảng tứ phân vị','Giá trị bất thường của mẫu số liệu','Phương sai, độ lệch chuẩn của mẫu số liệu') },
  ]},
  { value: 5, label: 'Chương 7. Bất phương trình bậc 2 một ẩn', lessons: [
    { value: 1, label: 'Dấu của tam thức bậc 2', forms: f('Xác định tam thức bậc 2','Dấu của tam thức bậc 2 và ứng dụng','Bài toán xét dấu biết BXD, đồ thị','Xét dấu biểu thức dạng tích, thương','Toán thực tế ứng dụng dấu tam thức bậc 2') },
    { value: 2, label: 'Giải bất phương trình bậc 2 một ẩn', forms: f('Bất phương trình bậc 2 và ứng dụng','Giải bất phương trình bậc hai biết BXD, đồ thị','Bất phương trình dạng tích, thương','Hệ bất phương trình BPT bậc 2','Bất phương trình chứa căn, |·|','Bài toán có tham số m','Toán thực tế ứng dụng bất phương trình bậc 2 một ẩn') },
    { value: 3, label: 'Phương trình quy về phương trình bậc hai', forms: f('Phương trình căn √f(x)=√g(x) và mở rộng','Phương trình căn √f(x)=g(x) và mở rộng','Phương trình căn thức có tham số','Phương trình căn thức (dạng khác)','Phương trình khác quy về phương trình bậc 2','Toán hình, toán thực tế ứng dụng phương trình quy về bậc 2') },
  ]},
  { value: 6, label: 'Chương 8. Đại số tổ hợp', lessons: [
    { value: 1, label: 'Quy tắc cộng – quy tắc nhân', forms: f('Bài toán chỉ sử dụng quy tắc cộng','Bài toán chỉ sử dụng quy tắc nhân','Bài toán kết hợp quy tắc cộng và quy tắc nhân','Bài toán dùng quy tắc bù trừ','Bài toán đếm số tự nhiên','Sơ đồ hình cây') },
    { value: 2, label: 'Hoán vị. Chỉnh hợp. Tổ hợp', forms: f('Lý thuyết tổng hợp về P, C, A','Bài toán có biểu thức P, C, A','Bài toán đếm số tự nhiên','Bài toán chọn người','Bài toán chọn đối tượng khác','Bài toán có yếu tố hình học','Bài toán xếp chỗ (không tròn, không lặp)','Hoán vị bàn tròn','Hoán vị lặp') },
    { value: 3, label: 'Nhị thức Newton', forms: f('Các câu hỏi lý thuyết tổng hợp','Khai triển một nhị thức Newton','Tìm hệ số, số hạng trong khai triển bằng tam giác Pascal','Tìm hệ số, số hạng trong khai triển','Tính tổng nhờ khai triển nhị thức Newton','Toán tổ hợp có dùng nhị thức Newton') },
  ]},
  { value: 7, label: 'Chương 10. Xác suất', lessons: [
    { value: 1, label: 'Không gian mẫu và biến cố', forms: f('Các câu hỏi lý thuyết tổng hợp','Mô tả không gian mẫu, biến cố','Đếm phần tử không gian mẫu, biến cố') },
    { value: 2, label: 'Xác suất của biến cố', forms: f('Các câu hỏi lý thuyết tổng hợp','Liên quan xúc xắc, đồng tiền (PP liệt kê)','Liên quan việc sắp xếp chỗ','Liên quan việc chọn người','Liên quan việc chọn đối tượng khác','Liên quan hình học','Liên quan việc đếm số','Liên quan bàn tròn hoặc hoán vị lặp','Liên quan vấn đề khác') },
  ]},
]
