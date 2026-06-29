const sql = require("mssql");
const connectDB = require("../config/database");

const LoHang = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM LoHang");
    return result.recordset;
  },

  getByMa: async (maLoHang) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maLoHang", sql.Char(10), maLoHang.trim())
      .query("SELECT * FROM LoHang WHERE MA_LO_HANG = @maLoHang");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maLoHang", sql.Char(10), data.MA_LO_HANG.trim())
      .input("maMatHang", sql.Char(10), data.MA_MAT_HANG.trim())
      .input("ngaySanXuat", sql.Date, data.NGAY_SAN_XUAT || null)
      .input("hanSuDung", sql.Date, data.HAN_SU_DUNG || null)
      .input("ngayNhap", sql.Date, data.NGAY_NHAP || null)
      .input("maPhieuNhapKho", sql.Char(10), data.MA_PHIEU_NHAP_KHO ? data.MA_PHIEU_NHAP_KHO.trim() : null)
      .input("trangThaiLo", sql.NVarChar(50), data.TRANG_THAI_LO)
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
      .query(`
        INSERT INTO LoHang (MA_LO_HANG, MA_MAT_HANG, NGAY_SAN_XUAT, HAN_SU_DUNG, NGAY_NHAP, MA_PHIEU_NHAP_KHO, TRANG_THAI_LO, GHI_CHU)
        VALUES (@maLoHang, @maMatHang, @ngaySanXuat, @hanSuDung, @ngayNhap, @maPhieuNhapKho, @trangThaiLo, @ghiChu)
      `);
    return { message: "Thêm lô hàng thành công" };
  },

  update: async (maLoHang, data) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maLoHang", sql.Char(10), maLoHang.trim())
      .input("maMatHang", sql.Char(10), data.MA_MAT_HANG.trim())
      .input("ngaySanXuat", sql.Date, data.NGAY_SAN_XUAT || null)
      .input("hanSuDung", sql.Date, data.HAN_SU_DUNG || null)
      .input("ngayNhap", sql.Date, data.NGAY_NHAP || null)
      .input("maPhieuNhapKho", sql.Char(10), data.MA_PHIEU_NHAP_KHO ? data.MA_PHIEU_NHAP_KHO.trim() : null)
      .input("trangThaiLo", sql.NVarChar(50), data.TRANG_THAI_LO)
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
      .query(`
        UPDATE LoHang 
        SET MA_MAT_HANG = @maMatHang, NGAY_SAN_XUAT = @ngaySanXuat, HAN_SU_DUNG = @hanSuDung,
            NGAY_NHAP = @ngayNhap, MA_PHIEU_NHAP_KHO = @maPhieuNhapKho, TRANG_THAI_LO = @trangThaiLo, GHI_CHU = @ghiChu
        WHERE MA_LO_HANG = @maLoHang
      `);
    return { affectedRows: result.rowsAffected[0], message: "Cập nhật lô hàng thành công" };
  },

  delete: async (maLoHang) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maLoHang", sql.Char(10), maLoHang.trim())
      .query("DELETE FROM LoHang WHERE MA_LO_HANG = @maLoHang");
    return { affectedRows: result.rowsAffected[0], message: "Xóa lô hàng thành công" };
  }
};

module.exports = LoHang;