# quan_ly_kho_hang_nhom7



Markdown
# 📦 Hệ thống Quản lý Kho hàng - Backend API

Dự án Backend phục vụ cho Hệ thống Quản lý Kho hàng (Inventory Management System), tập trung vào phân hệ xử lý nghiệp vụ, quản lý sai lệch tồn kho và xuất/nhập hàng. Hệ thống được xây dựng trên nền tảng **Node.js, Express** và kết nối với cơ sở dữ liệu **SQL Server**.

---

## 🗂️ Cấu trúc thư mục

Dự án áp dụng mô hình phân tầng tiêu chuẩn (Controller - Service - Model) giúp code rõ ràng, dễ bảo trì và dễ phân chia công việc:

```text
backend/
├── src/
│   ├── config/        # Cấu hình hệ thống (Ví dụ: file database.js kết nối SQL Server)
│   ├── controllers/   # Tiếp nhận Request từ Client, điều hướng và trả về Response
│   ├── middlewares/   # Các hàm kiểm tra trung gian (Xác thực Token, phân quyền...)
│   ├── models/        # Chứa logic tương tác trực tiếp với Database (Câu lệnh SQL)
│   ├── routes/        # Định tuyến các đường dẫn API (Endpoints)
│   ├── services/      # Chứa toàn bộ logic nghiệp vụ tính toán phức tạp
│   └── utils/         # Các hàm tiện ích dùng chung (Format ngày tháng, mã hóa...)
├── .env.example       # Khung biến môi trường mẫu (Push lên Git)
├── .gitignore         # Khai báo các file chặn push lên Git (node_modules, .env)
├── package.json       # Quản lý danh sách thư viện và thông tin dự án
└── server.js          # Điểm khởi chạy ứng dụng (Entry point)

frontend/
├── public/            # Chứa các tài nguyên tĩnh công khai (logo, favicon...)
├── src/
│   ├── assets/        # Hình ảnh, font chữ, icon cục bộ...
│   ├── components/    # Thành phần dùng chung ở mọi trang (Sidebar, Header, Layout)
│   ├── pages/         # Từng màn hình chức năng độc lập (Dashboard, Nhập kho, Kiểm kê...)
│   ├── services/      # Kết nối API (Axios/Fetch) đến Backend
│   ├── utils/         # Các hàm format định dạng tiện ích (tiền tệ, ngày giờ...)
│   ├── App.css        # CSS giao diện macOS 26
│   ├── App.jsx        # Định tuyến (Router) và cấu trúc ứng dụng React
│   ├── index.css      # CSS cơ bản toàn cục
│   └── main.jsx       # Điểm neo React Component vào index.html
├── index.html         # Trang HTML gốc
├── package.json       # Quản lý thư viện phụ thuộc của Frontend
├── vite.config.js     # Cấu hình bundler Vite
└── .gitignore         # Chặn đẩy các thư mục như node_modules lên Git
```

🚀 Hướng dẫn cài đặt (Dành cho thành viên trong nhóm)
Để chạy dự án này trên máy cá nhân, các thành viên vui lòng thực hiện đúng theo 4 bước sau:

Bước 1: Clone dự án và di chuyển vào thư mục backend
Mở Terminal / Git Bash và chạy lệnh:

Bash
git clone <Link_Repo_Của_Nhóm_Bạn>
cd QUAN_LY_KHO_HANG/backend
Bước 2: Cài đặt các thư viện cần thiết
Hệ thống sẽ tự động đọc file package.json để tải các gói như express, mssql, dotenv về máy của bạn:

Bash
npm install
Bước 3: Cấu hình biến môi trường (Bắt buộc)
Tuyệt đối KHÔNG viết cứng thông tin Database vào file code.

Copy file .env.example và đổi tên bản sao thành .env.

Mở file .env ra và điền thông tin kết nối SQL Server (Máy ảo/Docker) của riêng bạn vào:

Đoạn mã
DB_USER=sa
DB_PASSWORD=mật_khẩu_sql_của_bạn
DB_SERVER=ip_máy_ảo_hoặc_localhost
DB_DATABASE=QL_KHOHANG
DB_PORT=1433
PORT=3000
(Lưu ý: File .env đã được chặn bởi .gitignore nên sẽ không bị đẩy lên mạng, bạn hoàn toàn yên tâm điền mật khẩu).

Bước 4: Khởi chạy Server
Chạy lệnh sau để bật server:

Bash
node server.js
Nếu Terminal xuất hiện 2 dòng thông báo màu xanh dưới đây, chúc mừng bạn đã thiết lập thành công:

🚀 Server đang chạy tại http://localhost:3000
🚀 Kết nối SQL Server thành công!

⚠️ Quy tắc làm việc nhóm (Cần tuân thủ)
Tuyệt đối KHÔNG push thư mục node_modules và file .env lên kho lưu trữ chung.

Logic tính toán (như tính số lượng tồn kho) phải được viết ở tầng services/, không viết chung vào controllers/.

Nếu bạn cài đặt thêm một thư viện mới (ví dụ: npm install cors), hãy báo cho các thành viên khác để họ chạy lại lệnh npm install khi pull code về.

