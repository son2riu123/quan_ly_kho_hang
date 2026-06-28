const sql = require("mssql");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, 
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10) || 1433, 
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function run() {
  try {
    const pool = await sql.connect(config);
    console.log("Connected to SQL Server.");

    // 1. Seed DonViTinh
    const dvtCount = await pool.request().query("SELECT COUNT(*) as cnt FROM DonViTinh");
    if (dvtCount.recordset[0].cnt === 0) {
      console.log("Seeding DonViTinh...");
      await pool.request().query(`
        INSERT INTO DonViTinh (MA_DON_VI_TINH, TEN_DON_VI_TINH, MO_TA) VALUES
        ('DVT01', N'Thùng', N'Đơn vị đóng gói thùng sỉ'),
        ('DVT02', N'Chai', N'Đơn vị chai lẻ'),
        ('DVT03', N'Túi', N'Đơn vị túi lẻ')
      `);
      console.log("DonViTinh seeded successfully.");
    } else {
      console.log("DonViTinh already has data.");
    }

    // 2. Seed MatHang
    const mhCount = await pool.request().query("SELECT COUNT(*) as cnt FROM MatHang");
    if (mhCount.recordset[0].cnt === 0) {
      console.log("Seeding MatHang...");
      await pool.request().query(`
        INSERT INTO MatHang (MA_MAT_HANG, TEN_MAT_HANG, NHOM_HANG, MA_DON_VI_TINH_NHAP, QUY_CACH_DONG_GOI, CO_HAN_SU_DUNG, DIEU_KIEN_BAO_QUAN, TRANG_THAI) VALUES
        ('VT01', N'Nước lau sàn Sunlight Hương Hoa Thiên Nhiên', N'Hóa phẩm', 'DVT01', N'Túi 3.4kg', 1, N'Nơi khô ráo', N'Đang kinh doanh'),
        ('VT02', N'Nước rửa chén Sunlight Chanh', N'Hóa phẩm', 'DVT01', N'Túi 3.6kg', 1, N'Nơi khô ráo', N'Đang kinh doanh'),
        ('VT03', N'Dầu gội Clear Bạc Hà Mát Lạnh', N'Chăm sóc cá nhân', 'DVT01', N'Chai 630g', 1, N'Tránh ánh nắng', N'Đang kinh doanh'),
        ('VT04', N'Bột giặt OMO Comfort Tinh Dầu Thơm', N'Hóa phẩm', 'DVT01', N'Túi 5.3kg', 1, N'Khô ráo thoáng mát', N'Đang kinh doanh')
      `);
      console.log("MatHang seeded successfully.");
    } else {
      console.log("MatHang already has data.");
    }

    // 3. Seed default Kho if empty
    const khoCount = await pool.request().query("SELECT COUNT(*) as cnt FROM Kho");
    if (khoCount.recordset[0].cnt === 0) {
      console.log("Seeding Kho...");
      await pool.request().query(`
        INSERT INTO Kho (MA_KHO, TEN_KHO, DIA_CHI, SIEU_THI_GAN_NHAT, TRANG_THAI) VALUES
        ('KHO01', N'Kho tổng siêu thị Thành Đô', N'352 Hồ Tùng Mậu, Cầu Giấy, Hà Nội', N'Siêu thị Thành Đô Cầu Giấy', N'Hoạt động')
      `);
      console.log("Kho seeded successfully.");
    } else {
      console.log("Kho already has data.");
    }

    // 4. Seed default NhanVien if empty
    const nvCount = await pool.request().query("SELECT COUNT(*) as cnt FROM NhanVien");
    if (nvCount.recordset[0].cnt === 0) {
      console.log("Seeding NhanVien...");
      await pool.request().query(`
        INSERT INTO NhanVien (MA_NHAN_VIEN, HO_TEN, CHUC_VU, SO_DIEN_THOAI, EMAIL, VAI_TRO, TRANG_THAI) VALUES
        ('NV001', N'Nguyễn Văn Vũ', N'Thủ kho', '0987654321', 'vu.nguyen@thanhdo.vn', N'Thủ kho', N'Đang làm việc'),
        ('NV002', N'Trần Xuân Vân', N'Quản lý kho', '0912345678', 'van.tran@thanhdo.vn', N'Quản lý kho', N'Đang làm việc')
      `);
      console.log("NhanVien seeded successfully.");
    } else {
      console.log("NhanVien already has data.");
    }

    // 5. Seed default NhaCungCap if empty
    const nccCount = await pool.request().query("SELECT COUNT(*) as cnt FROM NhaCungCap");
    if (nccCount.recordset[0].cnt === 0) {
      console.log("Seeding NhaCungCap...");
      await pool.request().query(`
        INSERT INTO NhaCungCap (MA_NHA_CUNG_CAP, TEN_NHA_CUNG_CAP, DIA_CHI, SO_DIEN_THOAI, EMAIL, MA_SO_THUE, NGUOI_DAI_DIEN, TRANG_THAI) VALUES
        ('NCC01', N'Công ty TNHH Unilever Việt Nam', N'KCN Tây Bắc Củ Chi, TP. Hồ Chí Minh', '0283823000', 'contact@unilever.com', '0300123456', N'Trần Chí Bảo', N'Đang hợp tác'),
        ('NCC02', N'Công ty P&G Việt Nam', N'KCN Đồng An, Bình Dương', '0274374000', 'contact@pg.com', '0300123999', N'Lê Minh', N'Đang hợp tác')
      `);
      console.log("NhaCungCap seeded successfully.");
    } else {
      console.log("NhaCungCap already has data.");
    }

    await pool.close();
    console.log("Seeding finished successfully!");
  } catch (err) {
    console.error("Error during seeding: ", err.message);
  }
}

run();
