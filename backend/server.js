const express = require("express");
require("dotenv").config(); 

const connectDB = require("./config/database");

const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());

app.use('/api/kho', require('./routes/khoRoutes'));
app.use('/api/mathang', require('./routes/matHangRoutes'));
app.use('/api/nhanvien', require('./routes/nhanVienRoutes'));
app.use('/api/nhacungcap', require('./routes/nhaCungCapRoutes'));
app.use('/api/donmuahang', require('./routes/donMuaHangRoutes'));
app.use('/api/phieunhapkho', require('./routes/phieuNhapKhoRoutes'));
app.use('/api/vitrikho', require('./routes/viTriKhoRoutes'));
app.use('/api/tonkho', require('./routes/tonKhoRoutes'));
app.use('/api/thekho', require('./routes/theKhoRoutes'));
app.use('/api/kiemke', require('./routes/kiemKeRoutes'));
app.use('/api/donvitinh', require('./routes/donViTinhRoutes'));
// 
app.use('/api/danh-muc-vi-tri-khuyen-nghi', require('./routes/DanhMucViTriKhuyenNghiRoutes'));
app.use('/api/quy-cach-dong-goi', require('./routes/QuyCachDongGoiRoutes'));
app.use('/api/nhom-kiem-ke', require('./routes/NhomKiemKeRoutes'));
app.use('/api/chung-tu-giao-hang', require('./routes/ChungTuGiaoHangRoutes'));
app.use('/api/bien-ban-giao-nhan', require('./routes/BienBanGiaoNhanRoutes'));
app.use('/api/bien-ban-kiem-nghiem', require('./routes/BienBanKiemNghiemRoutes'));
app.use('/api/ho-so-dot-nhap', require('./routes/HoSoDotNhapRoutes'));
connectDB();

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});