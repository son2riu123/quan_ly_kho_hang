const sql = require("mssql");
const connectDB = require("../config/database");

const DotKiemKe = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM DotKiemKe");
    return result.recordset;
  },

  getByMa: async (maDotKiemKe) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maDotKiemKe", sql.Char(10), maDotKiemKe)
      .query("SELECT * FROM DotKiemKe WHERE MA_DOT_KIEM_KE = @maDotKiemKe");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maDotKiemKe", sql.Char(10), data.MA_DOT_KIEM_KE)
      .input("tenDotKiemKe", sql.NVarChar(200), data.TEN_DOT_KIEM_KE)
      .input("maKho", sql.Char(10), data.MA_KHO)
      .input("loaiKiemKe", sql.NVarChar(50), data.LOAI_KIEM_KE)
      .input("phamViKiemKe", sql.NVarChar(100), data.PHAM_VI_KIEM_KE)
      .input("thoiDiemBatDau", sql.DateTime2(0), data.THOI_DIEM_BAT_DAU)
      .input("thoiDiemKetThuc", sql.DateTime2(0), data.THOI_DIEM_KET_THUC)
      .input("nguoiLap", sql.Char(10), data.NGUOI_LAP)
      .input("trangThaiDot", sql.NVarChar(30), data.TRANG_THAI_DOT)
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU)
      .query(`
        INSERT INTO DotKiemKe 
        (MA_DOT_KIEM_KE, TEN_DOT_KIEM_KE, MA_KHO, LOAI_KIEM_KE, PHAM_VI_KIEM_KE, THOI_DIEM_BAT_DAU, THOI_DIEM_KET_THUC, NGUOI_LAP, TRANG_THAI_DOT, GHI_CHU)
        VALUES 
        (@maDotKiemKe, @tenDotKiemKe, @maKho, @loaiKiemKe, @phamViKiemKe, @thoiDiemBatDau, @thoiDiemKetThuc, @nguoiLap, @trangThaiDot, @ghiChu)
      `);
    return { message: "Thêm đợt kiểm kê thành công" };
  },

  update: async (maDotKiemKe, data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maDotKiemKe", sql.Char(10), maDotKiemKe)
      .input("tenDotKiemKe", sql.NVarChar(200), data.TEN_DOT_KIEM_KE)
      .input("maKho", sql.Char(10), data.MA_KHO)
      .input("loaiKiemKe", sql.NVarChar(50), data.LOAI_KIEM_KE)
      .input("phamViKiemKe", sql.NVarChar(100), data.PHAM_VI_KIEM_KE)
      .input("thoiDiemBatDau", sql.DateTime2(0), data.THOI_DIEM_BAT_DAU)
      .input("thoiDiemKetThuc", sql.DateTime2(0), data.THOI_DIEM_KET_THUC)
      .input("nguoiLap", sql.Char(10), data.NGUOI_LAP)
      .input("trangThaiDot", sql.NVarChar(30), data.TRANG_THAI_DOT)
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU)
      .query(`
        UPDATE DotKiemKe 
        SET TEN_DOT_KIEM_KE = @tenDotKiemKe, MA_KHO = @maKho, LOAI_KIEM_KE = @loaiKiemKe, 
            PHAM_VI_KIEM_KE = @phamViKiemKe, THOI_DIEM_BAT_DAU = @thoiDiemBatDau, 
            THOI_DIEM_KET_THUC = @thoiDiemKetThuc, NGUOI_LAP = @nguoiLap, 
            TRANG_THAI_DOT = @trangThaiDot, GHI_CHU = @ghiChu
        WHERE MA_DOT_KIEM_KE = @maDotKiemKe
      `);
    return { message: "Cập nhật đợt kiểm kê thành công" };
  },

  delete: async (maDotKiemKe) => {
    const pool = await connectDB();
    await pool.request()
      .input("maDotKiemKe", sql.Char(10), maDotKiemKe)
      .query("DELETE FROM DotKiemKe WHERE MA_DOT_KIEM_KE = @maDotKiemKe");
    return { message: "Xóa đợt kiểm kê thành công" };
  }
};

module.exports = DotKiemKe;