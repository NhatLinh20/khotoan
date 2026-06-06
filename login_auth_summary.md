# Tóm tắt Logic và Phân quyền: Module Đăng nhập & Xác thực (Authenticator)

Dự án **Kho Toán** sử dụng Next.js kết hợp với Supabase để quản lý việc xác thực (Authentication) và phân quyền (Authorization). Dưới đây là tài liệu tổng hợp chi tiết về logic, tính năng, và các quy tắc phân quyền liên quan đến đăng nhập.

---

## 1. Giao diện và Phương thức Đăng nhập (Frontend)
- **Tệp tin:** `app/(auth)/login/page.tsx`
- **Giao diện:** Giao diện đăng nhập hiện đại với 2 phương thức chính:
  1. **Đăng nhập bằng Google (OAuth):** Được ưu tiên hiển thị trên cùng để thao tác nhanh chóng.
  2. **Đăng nhập bằng Email & Mật khẩu:** Điền form thông thường.
- **Tính năng phụ trợ:** Có liên kết để phục hồi mật khẩu (Quên mật khẩu) và chuyển đến trang đăng ký tài khoản mới. Trạng thái tải (loading) và hiển thị lỗi (error banner) được xử lý trực tiếp trên giao diện.

---

## 2. Xử lý Đăng nhập và Cơ chế Phê duyệt (Server Actions)
- **Tệp tin:** `app/actions/auth.ts`
- **Logic xử lý Đăng nhập (`login` và `loginWithGoogle`):**
  - Mọi yêu cầu xác thực đều gọi đến API của Supabase (`signInWithPassword` hoặc `signInWithOAuth`).
  - **Cơ chế Phê duyệt Tài khoản (Approval Mechanism):** 
    - Ngay sau khi đăng nhập thành công, hệ thống truy vấn bảng `profiles` để kiểm tra thông tin người dùng.
    - **Học sinh (`student`):** Nếu thuộc role `student` và cột `is_approved` đang là `false`, đăng nhập sẽ bị từ chối với thông báo: *"Tài khoản chưa được kích hoạt. Vui lòng liên hệ Zalo: 0812878792 để được hỗ trợ."*
    - **Giáo viên (`teacher`):** Không bị giới hạn bởi cờ `is_approved` và luôn được phép đăng nhập.
- **Xử lý Đăng ký mới (`register`):** Khi một người dùng mới đăng ký, hệ thống mặc định gán role là `student` và trạng thái `is_approved = false`. Người dùng đăng ký xong sẽ được chuyển hướng thẳng đến trang `/pending` để chờ duyệt.

---

## 3. Phân quyền và Vai trò (Authorization & Roles)
Hệ thống dựa vào 2 trường dữ liệu cốt lõi trong bảng `profiles` (tham khảo `role-schema.sql` và `add-is-approved.sql`):
- `role`: Có thể là `student` hoặc `teacher` (mặc định là `student`).
- `is_approved`: Boolean (mặc định là `false`), xác định xem tài khoản đã được giáo viên phê duyệt hay chưa.

**Cách hoạt động:**
1. **Tạo Profile Tự động:** Khi một người dùng tạo tài khoản Auth trên Supabase, một Postgres Trigger (`handle_new_user`) sẽ lập tức tạo bản ghi tương ứng trong bảng `profiles`. 
2. **Helper Kiểm tra Phân quyền (`lib/supabase/roles.ts`):** 
   - Cung cấp hàm `isTeacher()` và `getProfile()` để dễ dàng trích xuất thông tin về quyền hạn và dùng ở các Route/Action.
3. **Bảo vệ Route (Route Protection):** 
   - Tại `app/dashboard/page.tsx`, hệ thống lấy session hiện tại. Nếu chưa có session, tự động đẩy về `/login`.
   - Nếu là học sinh mà chưa được duyệt (`!is_approved`), đẩy sang `/pending`.
4. **Row Level Security (RLS) Database:**
   - Database áp dụng RLS cực kỳ chặt chẽ dựa trên `role`. 
   - Ví dụ với bảng `exams` (đề thi): Dùng custom function `is_teacher()` để đảm bảo chỉ Giáo viên mới có quyền Thêm/Sửa/Xóa đề thi của chính mình. Học sinh chỉ được phép Đọc (Select) các đề thi có cờ `is_published = true`.

---

## 4. Ghi Log và Phát hiện Đăng nhập Bất thường (Security Logging)
- **Tệp tin:** `lib/auth-logger.ts` và `login-logs.sql`
- Bất cứ khi nào đăng nhập thành công (vượt qua cả rào cản `is_approved`), hệ thống sẽ gọi hàm `logLoginInternal()` để ghi lại lịch sử.
- **Dữ liệu được lưu trữ (`login_logs`):** IP, Quốc gia, Thành phố, Nhà mạng (ISP), Múi giờ, Thiết bị (User Agent). *Hệ thống dùng API của ip-api.com để map IP thành định vị địa lý.*
- **Phát hiện Bất thường (Anomaly Detection):** Hệ thống so sánh thông tin đăng nhập hiện tại với 10 lần đăng nhập gần nhất. Một đăng nhập bị đánh dấu là "bất thường" (`is_suspicious = true`) nếu vi phạm:
  - Địa chỉ IP mới hoàn toàn (khi tài khoản đã có lịch sử >= 3 log).
  - Quốc gia khác với các quốc gia từng đăng nhập.
  - Sử dụng IP mới quá nhanh (nhiều IP khác nhau trong vòng 1 giờ).
  - Chữ ký thiết bị / trình duyệt hoàn toàn lạ.
- **RLS trên Logs:** Học sinh chỉ xem được log đăng nhập của chính mình, trong khi Giáo viên có thể xem được log của toàn bộ hệ thống.

---

## 5. Ngăn chặn Đăng nhập Đồng thời trên Nhiều Thiết Bị
- **Tệp tin:** `components/SessionGuardian.tsx` kết hợp `app/layout.tsx`.
- **Logic hoạt động:**
  - `app/layout.tsx` trích xuất biến `session_id` từ trong JWT Token của người dùng và truyền vào `SessionGuardian`.
  - Component `SessionGuardian` mở một kết nối Socket thông qua **Supabase Realtime** để theo dõi (subscribe) các thay đổi trên dòng của người dùng ở bảng `profiles`.
  - Bất cứ khi nào người dùng đăng nhập trên một thiết bị khác, hệ thống sẽ đẩy `session_id` mới vào profile (mặc định thông qua auth của Supabase). Khi `SessionGuardian` ở thiết bị cũ phát hiện `session_id` bị thay đổi so với phiên bản hiện hành, nó sẽ bật cảnh báo: *"Tài khoản của bạn vừa được đăng nhập trên một thiết bị khác..."* và tự động thực hiện đăng xuất thiết bị cũ.
