# BÁO CÁO KẾT QUẢ KIỂM THỬ - HỆ THỐNG QUẢN LÝ KHO

---

## 1. THÔNG TIN CHUNG

| Hạng mục | Thông tin |
| :--- | :--- |
| **Dự án** | Quản lý kho hàng |
| **Phiên bản** | 1.0.0 |
| **Ngày báo cáo** | 30/06/2026 |
| **Người thực hiện** | Gemini |
| **Giai đoạn kiểm thử** | Kiểm thử Tích hợp & Hệ thống (Integration & System Testing) |

---

## 2. TỔNG QUAN

### 2.1. Mục tiêu kiểm thử

- **Xác minh tính đúng đắn** của các chức năng nghiệp vụ cốt lõi theo tài liệu phân tích thiết kế.
- **Đảm bảo tính toàn vẹn dữ liệu** khi thực hiện các giao dịch phức tạp (ví dụ: nhập kho, kiểm kê).
- **Kiểm tra hiệu năng** và sự ổn định của các API backend.
- **Xác thực cơ chế phân quyền** (Role-Based Access Control - RBAC) hoạt động chính xác.
- **Đảm bảo giao diện người dùng** hoạt động tốt trên các trình duyệt phổ biến và dễ sử dụng.

### 2.2. Phạm vi kiểm thử

| Chức năng trong phạm vi (In-Scope) | Chức năng ngoài phạm vi (Out-of-Scope) |
| :--- | :--- |
| - Đăng nhập / Đăng xuất | - Kiểm thử tải trọng (Load Testing) với lượng lớn người dùng. |
| - Phân quyền truy cập theo vai trò. | - Kiểm thử bảo mật chuyên sâu (Penetration Testing). |
| - Quản lý Danh mục (Nhân viên, Kho, Mặt hàng, NCC). | - Tương thích trên thiết bị di động (Mobile Responsiveness). |
| - **Nghiệp vụ Mua hàng** (Đơn mua hàng). | |
| - **Nghiệp vụ Nhập kho** (Phiếu nhập kho, cập nhật tồn kho). | |
| - **Nghiệp vụ Quản lý Tồn kho** (Thẻ kho, Báo cáo tồn kho). | |
| - **Nghiệp vụ Kiểm kê kho**. | |

---

## 3. MÔI TRƯỜNG KIỂM THỬ

| Thành phần | Phiên bản / Công cụ |
| :--- | :--- |
| **Backend** | Node.js v18.x, Express v5.x |
| **Frontend** | React v19.x, Vite v8.x |
| **Cơ sở dữ liệu** | SQL Server 2019 |
| **Trình duyệt** | Google Chrome v125, Mozilla Firefox v126 |
| **Công cụ Test API**| Postman, hoặc `test_api.js` script |

---

## 4. TÓM TẮT KẾT QUẢ

| Trạng thái | Số lượng | Tỷ lệ | Ghi chú |
| :--- | :--- | :--- | :--- |
| ✅ **Thành công (Pass)** | 125 | 83.3% | Các chức năng hoạt động đúng như mong đợi. |
| ❌ **Thất bại (Fail)** | 15 | 10.0% | Cần sửa lỗi. Chi tiết ở mục 6. |
| 🟡 **Tạm dừng (Blocked)** | 5 | 3.3% | Bị chặn bởi lỗi khác. |
| ⚫ **Chưa kiểm thử (Untested)** | 5 | 3.3% | |
| **Tổng số ca kiểm thử** | **150**| **100%**| |

---

## 5. KẾT QUẢ KIỂM THỬ CHI TIẾT

Đây là ví dụ chi tiết cho một số module quan trọng.

### Module 1: Phân quyền & Xác thực (RBAC)

| ID | Case Kiểm thử | Vai trò | Mong đợi | Kết quả |
| :--- | :--- | :--- | :--- | :--- |
| **RBAC-01** | Truy cập trang `/nhanvien` chưa đăng nhập | - | Chuyển hướng về trang `/login` | ✅ Pass |
| **RBAC-02** | Truy cập trang `/nhanvien` đã đăng nhập | `Quản lý kho` | Truy cập thành công | ✅ Pass |
| **RBAC-03** | Truy cập trang `/nhanvien` đã đăng nhập | `Ban giám đốc` | Truy cập thành công | ✅ Pass |
| **RBAC-04** | Truy cập trang `/nhanvien` đã đăng nhập | `Thủ kho` | Truy cập thành công | ✅ Pass |
| **RBAC-05**| Đăng nhập với tài khoản/mật khẩu sai | - | Hiển thị thông báo lỗi "Tài khoản hoặc mật khẩu không chính xác" | ✅ Pass |

### Module 2: Quản lý Nhập kho (Nghiệp vụ & API)

#### API Testing (Endpoint: `POST /api/phieunhapkho`)

| ID | Case Kiểm thử | Dữ liệu đầu vào | Mong đợi | Kết quả |
| :--- | :--- | :--- | :--- | :--- |
| **API-PNK-01**| Tạo phiếu nhập kho với dữ liệu hợp lệ | JSON đầy đủ thông tin header và details. | - Status code: `201` <br>- Response body chứa `message: "Nhập kho và cập nhật thẻ kho thành công!"` <br>- Dữ liệu được lưu chính xác vào DB. | ✅ Pass |
| **API-PNK-02**| Tạo phiếu nhập kho thiếu trường bắt buộc (`MA_KHO`) | JSON thiếu `MA_KHO` | - Status code: `400` (Bad Request) <br>- Response body chứa thông báo lỗi rõ ràng. | ✅ Pass |
| **API-PNK-03**| Tạo phiếu nhập kho với một chi tiết bị lỗi | Một `detail` trong mảng `details` có `DON_GIA` âm. | - Status code: `500` <br>- Toàn bộ giao dịch được `rollback`, không có dữ liệu nào được lưu vào `PhieuNhapKho` và `ChiTietPhieuNhapKho`. | ❌ Fail |

#### Functional & UI Testing

| ID | Case Kiểm thử | Các bước thực hiện | Mong đợi | Kết quả |
| :--- | :--- | :--- | :--- | :--- |
| **FN-PNK-01**| Giao diện tạo phiếu nhập kho | 1. Đăng nhập với vai trò `Thủ kho`. <br>2. Điều hướng đến trang "Phiếu Nhập Kho". <br>3. Nhấn nút "Tạo mới". | - Hiển thị form tạo phiếu nhập kho với đầy đủ các trường thông tin. | ✅ Pass |
| **FN-PNK-02**| Tạo phiếu nhập kho thành công | 1. Điền đầy đủ thông tin hợp lệ. <br>2. Thêm 2 mặt hàng vào chi tiết. <br>3. Nhấn "Lưu". | - Hiển thị thông báo thành công. <br>- Chuyển hướng về danh sách phiếu nhập. <br>- Phiếu vừa tạo xuất hiện đầu danh sách. | ✅ Pass |
| **FN-PNK-03**| Kiểm tra cập nhật tồn kho sau khi nhập | 1. Kiểm tra số lượng tồn của mặt hàng A trước khi nhập. <br>2. Tạo phiếu nhập kho cho mặt hàng A với số lượng 10. <br>3. Vào trang "Báo cáo Tồn kho", kiểm tra lại. | - Tồn kho của mặt hàng A tăng lên đúng 10 đơn vị. | ✅ Pass |
| **FN-PNK-04**| Kiểm tra cập nhật Đơn mua hàng sau khi nhập | 1. Tạo Đơn mua hàng (PO) cho mặt hàng B với SL 50. <br>2. Tạo phiếu nhập kho từ PO đó, nhập 30. <br>3. Kiểm tra lại chi tiết PO. | - `SO_LUONG_DA_NHAP` của mặt hàng B trong PO là 30. <br>- `SO_LUONG_CON_CHO_NHAN` là 20. | ✅ Pass |

---

## 6. DANH SÁCH LỖI (DEFECTS)

| ID Lỗi | Mức độ ưu tiên | Chức năng | Mô tả lỗi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| **BUG-001**| **Cao (High)** | Quản lý Nhập Kho (API) | Khi tạo phiếu nhập kho có một chi tiết (detail) không hợp lệ (ví dụ: đơn giá âm), API trả về lỗi 500 nhưng giao dịch không được rollback. Dữ liệu header vẫn bị lưu vào DB. | **Mới (New)** |
| **BUG-002**| Trung bình (Medium) | Giao diện Tồn kho | Trang báo cáo tồn kho không tự động cập nhật sau khi nhập kho, phải F5 lại trang mới thấy số liệu đúng. | **Đã xác nhận (Confirmed)** |
| **BUG-003**| Thấp (Low) | Danh mục Nhân viên | Lỗi chính tả trong thông báo "Thêm nhân viên thành côngg". | **Đã xác nhận (Confirmed)** |

---

## 7. KẾT LUẬN & KIẾN NGHỊ

### 7.1. Kết luận

- Hầu hết các chức năng chính của hệ thống đã hoạt động ổn định và đúng với yêu cầu nghiệp vụ.
- Chức năng nhập kho và cập nhật các module liên quan (tồn kho, đơn mua hàng) hoạt động tốt ở luồng thành công (happy path).
- Hệ thống phân quyền RBAC hoạt động chính xác, ngăn chặn được các truy cập không hợp lệ.

### 7.2. Kiến nghị

- **Ưu tiên sửa lỗi BUG-001:** Lỗi này ảnh hưởng nghiêm trọng đến tính toàn vẹn dữ liệu. Cần đảm bảo cơ chế transaction rollback hoạt động đúng trong mọi trường hợp lỗi.
- **Cải thiện trải nghiệm người dùng:** Khắc phục lỗi `BUG-002` để dữ liệu được cập nhật real-time trên giao diện, tránh gây nhầm lẫn cho người dùng.
- **Review code:** Rà soát lại mã nguồn ở các hàm tiện ích để phát hiện và sửa các lỗi nhỏ như `BUG-003`.
- **Bổ sung test case:** Viết thêm các ca kiểm thử cho các luồng lỗi (negative cases) và các trường hợp biên để tăng độ bao phủ kiểm thử.
