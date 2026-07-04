const sql = require("mssql");
const connectDB = require("../config/database");

const PhieuCachLyHang = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM PhieuCachLyHang");
    return result.recordset;
  },

  getByMa: async (maPhieuCachLy) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maPhieuCachLy", sql.Char(10), maPhieuCachLy.trim())
      .query("SELECT * FROM PhieuCachLyHang WHERE MA_PHIEU_CACH_LY = @maPhieuCachLy");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maPhieuCachLy", sql.Char(10), data.MA_PHIEU_CACH_LY.trim())
      .input("maPhieuBaoCao", sql.Char(10), data.MA_PHIEU_BAO_CAO.trim())
      .input("nguoiThucHien", sql.Char(10), data.NGUOI_THUC_HIEN.trim())
      .input("thoiDiemCachLy", sql.DateTime2, data.THOI_DIEM_CACH_LY)
      .input("viTriCachLy", sql.Char(10), data.VI_TRI_CACH_LY.trim())
      .input("trangThaiCachLy", sql.NVarChar(30), data.TRANG_THAI_CACH_LY)
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
      .query(`
        INSERT INTO PhieuCachLyHang (MA_PHIEU_CACH_LY, MA_PHIEU_BAO_CAO, NGUOI_THUC_HIEN, THOI_DIEM_CACH_LY, VI_TRI_CACH_LY, TRANG_THAI_CACH_LY, GHI_CHU)
        VALUES (@maPhieuCachLy, @maPhieuBaoCao, @nguoiThucHien, @thoiDiemCachLy, @viTriCachLy, @trangThaiCachLy, @ghiChu)
      `);
    return { message: "Thêm phiếu cách ly thành công" };
  },

  update: async (maPhieuCachLy, data) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maPhieuCachLy", sql.Char(10), maPhieuCachLy.trim())
      .input("maPhieuBaoCao", sql.Char(10), data.MA_PHIEU_BAO_CAO.trim())
      .input("nguoiThucHien", sql.Char(10), data.NGUOI_THUC_HIEN.trim())
      .input("thoiDiemCachLy", sql.DateTime2, data.THOI_DIEM_CACH_LY)
      .input("viTriCachLy", sql.Char(10), data.VI_TRI_CACH_LY.trim())
      .input("trangThaiCachLy", sql.NVarChar(30), data.TRANG_THAI_CACH_LY)
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
      .query(`
        UPDATE PhieuCachLyHang
        SET MA_PHIEU_BAO_CAO = @maPhieuBaoCao, NGUOI_THUC_HIEN = @nguoiThucHien, THOI_DIEM_CACH_LY = @thoiDiemCachLy,
            VI_TRI_CACH_LY = @viTriCachLy, TRANG_THAI_CACH_LY = @trangThaiCachLy, GHI_CHU = @ghiChu
        WHERE MA_PHIEU_CACH_LY = @maPhieuCachLy
      `);
    return { affectedRows: result.rowsAffected[0], message: "Cập nhật phiếu cách ly thành công" };
  },

  delete: async (maPhieuCachLy) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maPhieuCachLy", sql.Char(10), maPhieuCachLy.trim())
      .query("DELETE FROM PhieuCachLyHang WHERE MA_PHIEU_CACH_LY = @maPhieuCachLy");
    return { affectedRows: result.rowsAffected[0], message: "Xóa phiếu cách ly thành công" };
  }
};

module.exports = PhieuCachLyHang;