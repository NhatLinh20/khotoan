import type { ChapterItem } from '../math-taxonomy'
const f = (...ls: string[]) => ls.map((label, i) => ({ value: i + 1, label }))

export const H10: ChapterItem[] = [
  { value: 1, label: 'Chương 4. Hệ thức lượng trong tam giác', lessons: [
    { value: 1, label: 'Giá trị lượng giác của góc (0°–180°)', forms: f('Xét dấu của biểu thức lượng giác','Tính các giá trị lượng giác','Biến đổi, rút gọn biểu thức lượng giác') },
    { value: 2, label: 'Định lý sin và định lý côsin', forms: f('Bài toán chỉ dùng định lý Sin, Côsin','Bài toán có dùng công thức diện tích','Biến đổi, rút gọn biểu thức','Nhận dạng tam giác') },
    { value: 3, label: 'Giải tam giác và ứng dụng thực tế', forms: f('Giải tam giác','Các ứng dụng thực tế') },
  ]},
  { value: 2, label: 'Chương 5. Véctơ (chưa xét tọa độ)', lessons: [
    { value: 1, label: 'Khái niệm véctơ', forms: f('Xác định một véctơ','Xét phương và hướng của các véctơ','Hai véctơ bằng nhau','Hai véctơ đối nhau','Độ dài của một véctơ','Toán thực tế áp dụng véctơ') },
    { value: 2, label: 'Tổng và hiệu của hai véctơ', forms: f('Tính toán, thu gọn hiệu các véctơ','Tính đúng-sai của 1 đẳng thức véctơ','Tìm điểm nhờ đẳng thức véctơ','Tính độ dài của véctơ tổng, hiệu','Cực trị hình học','Toán thực tế áp dụng tổng hiệu véctơ') },
    { value: 3, label: 'Tích của một số với véctơ', forms: f('Xác định k.v và độ dài của nó','Biến đổi, thu gọn 1 đẳng thức véctơ','Tìm điểm nhờ đẳng thức véctơ','Sự cùng phương của 2 véctơ và ứng dụng','Phân tích 1 véctơ theo 2 véctơ không cùng phương','Tính độ dài của véctơ tổng, hiệu','Tập hợp điểm','Cực trị hình học','Toán thực tế áp dụng tích 1 số với véctơ') },
    { value: 4, label: 'Tích vô hướng (chưa xét tọa độ)', forms: f('Tích vô hướng, góc giữa 2 véctơ','Tìm góc nhờ tích vô hướng','Đẳng thức về tích vô hướng hoặc độ dài','Điều kiện vuông góc','Các bài toán tìm điểm và tập hợp điểm','Cực trị và chứng minh bất đẳng thức','Toán thực tế áp dụng tích vô hướng') },
  ]},
  { value: 3, label: 'Chương 9. Phương pháp toạ độ trong mặt phẳng Oxy', lessons: [
    { value: 1, label: 'Toạ độ của véctơ', forms: f('Tọa độ điểm, độ dài đại số của véctơ trên 1 trục','Phép toán véctơ (tổng, hiệu, tích với số) trong Oxy','Tọa độ điểm và véctơ trên hệ trục Oxy','Sự cùng phương của 2 véctơ và ứng dụng','Phân tích một véctơ theo 2 véctơ không cùng phương','Toán thực tế dùng hệ toạ độ') },
    { value: 2, label: 'Tích vô hướng (theo tọa độ)', forms: f('Tích vô hướng, góc giữa 2 véctơ','Tìm góc nhờ tích vô hướng','Đẳng thức về tích vô hướng hoặc độ dài','Điều kiện vuông góc','Các bài toán tìm điểm và tập hợp điểm','Cực trị và chứng minh bất đẳng thức','Toán thực tế, liên môn') },
    { value: 3, label: 'Đường thẳng trong mặt phẳng toạ độ', forms: f('Điểm, véctơ, hệ số góc của đường thẳng','Phương trình đường thẳng','Vị trí tương đối giữa hai đường thẳng','Bài toán về góc giữa hai đường thẳng','Bài toán về khoảng cách','Bài toán tìm điểm','Bài toán dùng cho tam giác, tứ giác','Bài toán thực tế, PP tọa độ hóa','Bài toán có dùng PT chính tắc') },
    { value: 4, label: 'Đường tròn trong mặt phẳng toạ độ', forms: f('Tìm tâm, bán kính và điều kiện là đường tròn','Phương trình đường tròn','Phương trình tiếp tuyến của đường tròn','Vị trí tương đối liên quan đường tròn','Toán tổng hợp đường thẳng và đường tròn','Bài toán dùng cho tam giác, tứ giác','Bài toán thực tế, PP tọa độ hóa') },
    { value: 5, label: 'Ba đường conic trong mặt phẳng toạ độ', forms: f('Xác định các yếu tố của elip','Phương trình chính tắc của elip','Bài toán điểm trên elip','Xác định các yếu tố của hypebol','Phương trình chính tắc của hypebol','Bài toán điểm trên hypebol','Xác định các yếu tố của parabol','Phương trình chính tắc của parabol','Bài toán điểm trên parabol') },
  ]},
]

export const C10: ChapterItem[] = [
  { value: 1, label: 'Chuyên đề 1. Hệ phương trình bậc nhất 3 ẩn', lessons: [
    { value: 1, label: 'Hệ phương trình bậc nhất 3 ẩn và ứng dụng', forms: f('Các khái niệm về Hệ PT bậc nhất 3 ẩn','Giải Hệ PT bậc nhất 3 ẩn','Toán thực tế ứng dụng Hệ PT bậc nhất 3 ẩn') },
  ]},
  { value: 2, label: 'Chuyên đề 2. Phương pháp quy nạp toán học', lessons: [
    { value: 1, label: 'Phương pháp quy nạp toán học', forms: f('Quy nạp chứng minh các đẳng thức/công thức/chia hết','Quy nạp chứng minh các bất đẳng thức') },
  ]},
  { value: 3, label: 'Chuyên đề 3. Ba đường conic trong mặt phẳng toạ độ', lessons: [
    { value: 1, label: 'Ba đường conic trong mặt phẳng toạ độ', forms: f('Xác định các yếu tố của elip','Phương trình chính tắc của elip','Bài toán điểm trên elip','Xác định các yếu tố của hypebol','Phương trình chính tắc của hypebol','Bài toán điểm trên hypebol','Xác định các yếu tố của parabol','Phương trình chính tắc của parabol','Bài toán điểm trên parabol') },
  ]},
]
