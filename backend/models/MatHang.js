const sql = require("mssql");
const connectDB = require("../config/database");

const MatHang = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT mh.*, dvt.TEN_DON_VI_TINH 
      FROM MatHang mh
      LEFT JOIN DonViTinh dvt ON mh.MA_DON_VI_TINH_NHAP = dvt.MA_DON_VI_TINH
    `);
    return result.recordset;
  },

  getByMa: async (maMatHang) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maMatHang", sql.Char(10), maMatHang)
      .query("SELECT * FROM MatHang WHERE MA_MAT_HANG = @maMatHang");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maMatHang", sql.Char(10), data.MA_MAT_HANG)
      .input("tenMatHang", sql.NVarChar(150), data.TEN_MAT_HANG)
      .input("nhomHang", sql.NVarChar(100), data.NHOM_HANG)
      .input("maDonViTinhNhap", sql.Char(10), data.MA_DON_VI_TINH_NHAP)
      .input("quyCachDongGoi", sql.NVarChar(150), data.QUY_CACH_DONG_GOI)
      .input("coHanSuDung", sql.Bit, data.CO_HAN_SU_DUNG)
      .input("dieuKienBaoQuan", sql.NVarChar(100), data.DIEU_KIEN_BAO_QUAN)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI)
      .query(`
        INSERT INTO MatHang (MA_MAT_HANG, TEN_MAT_HANG, NHOM_HANG, MA_DON_VI_TINH_NHAP, QUY_CACH_DONG_GOI, CO_HAN_SU_DUNG, DIEU_KIEN_BAO_QUAN, TRANG_THAI)
        VALUES (@maMatHang, @tenMatHang, @nhomHang, @maDonViTinhNhap, @quyCachDongGoi, @coHanSuDung, @dieuKienBaoQuan, @trangThai)
      `);
    return { message: "Thêm mặt hàng thành công" };
  },

  update: async (maMatHang, data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maMatHang", sql.Char(10), maMatHang)
      .input("tenMatHang", sql.NVarChar(150), data.TEN_MAT_HANG)
      .input("nhomHang", sql.NVarChar(100), data.NHOM_HANG)
      .input("maDonViTinhNhap", sql.Char(10), data.MA_DON_VI_TINH_NHAP)
      .input("quyCachDongGoi", sql.NVarChar(150), data.QUY_CACH_DONG_GOI)
      .input("coHanSuDung", sql.Bit, data.CO_HAN_SU_DUNG)
      .input("dieuKienBaoQuan", sql.NVarChar(100), data.DIEU_KIEN_BAO_QUAN)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI)
      .query(`
        UPDATE MatHang 
        SET TEN_MAT_HANG = @tenMatHang, NHOM_HANG = @nhomHang, MA_DON_VI_TINH_NHAP = @maDonViTinhNhap, 
            QUY_CACH_DONG_GOI = @quyCachDongGoi, CO_HAN_SU_DUNG = @coHanSuDung, 
            DIEU_KIEN_BAO_QUAN = @dieuKienBaoQuan, TRANG_THAI = @trangThai
        WHERE MA_MAT_HANG = @maMatHang
      `);
    return { message: "Cập nhật mặt hàng thành công" };
  },

  delete: async (maMatHang) => {
    const pool = await connectDB();
    await pool.request()
      .input("maMatHang", sql.Char(10), maMatHang)
      .query("DELETE FROM MatHang WHERE MA_MAT_HANG = @maMatHang");
    return { message: "Xóa mặt hàng thành công" };
  }
};

module.exports = MatHang;
