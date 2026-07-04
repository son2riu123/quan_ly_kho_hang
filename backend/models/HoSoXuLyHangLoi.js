const sql = require("mssql");
const connectDB = require("../config/database");

const HoSoXuLyHangLoi = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM HoSoXuLyHangLoi");
    return result.recordset;
  },

  getByMa: async (maHoSo) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maHoSo", sql.Char(10), maHoSo)
      .query("SELECT * FROM HoSoXuLyHangLoi WHERE MA_HO_SO = @maHoSo");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maHoSo", sql.Char(10), data.MA_HO_SO)
      .input("maPhieuBaoCao", sql.Char(10), data.MA_PHIEU_BAO_CAO)
      .input("maPhuongAn", sql.Char(10), data.MA_PHUONG_AN)
      .input("maLenhXuLy", sql.Char(10), data.MA_LENH_XU_LY)
      .input("ngayTao", sql.DateTime2(0), data.NGAY_TAO)
      .input("trangThaiHoSo", sql.NVarChar(30), data.TRANG_THAI_HO_SO)
      .input("ngayDongHoSo", sql.DateTime2(0), data.NGAY_DONG_HO_SO)
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU)
      .query(`
        INSERT INTO HoSoXuLyHangLoi 
        (MA_HO_SO, MA_PHIEU_BAO_CAO, MA_PHUONG_AN, MA_LENH_XU_LY, NGAY_TAO, TRANG_THAI_HO_SO, NGAY_DONG_HO_SO, GHI_CHU)
        VALUES 
        (@maHoSo, @maPhieuBaoCao, @maPhuongAn, @maLenhXuLy, @ngayTao, @trangThaiHoSo, @ngayDongHoSo, @ghiChu)
      `);
    return { message: "Thêm hồ sơ xử lý hàng lỗi thành công" };
  },

  update: async (maHoSo, data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maHoSo", sql.Char(10), maHoSo)
      .input("maPhieuBaoCao", sql.Char(10), data.MA_PHIEU_BAO_CAO)
      .input("maPhuongAn", sql.Char(10), data.MA_PHUONG_AN)
      .input("maLenhXuLy", sql.Char(10), data.MA_LENH_XU_LY)
      .input("ngayTao", sql.DateTime2(0), data.NGAY_TAO)
      .input("trangThaiHoSo", sql.NVarChar(30), data.TRANG_THAI_HO_SO)
      .input("ngayDongHoSo", sql.DateTime2(0), data.NGAY_DONG_HO_SO)
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU)
      .query(`
        UPDATE HoSoXuLyHangLoi 
        SET MA_PHIEU_BAO_CAO = @maPhieuBaoCao, MA_PHUONG_AN = @maPhuongAn, MA_LENH_XU_LY = @maLenhXuLy, 
            NGAY_TAO = @ngayTao, TRANG_THAI_HO_SO = @trangThaiHoSo, NGAY_DONG_HO_SO = @ngayDongHoSo, GHI_CHU = @ghiChu
        WHERE MA_HO_SO = @maHoSo
      `);
    return { message: "Cập nhật hồ sơ xử lý hàng lỗi thành công" };
  },

  delete: async (maHoSo) => {
    const pool = await connectDB();
    await pool.request()
      .input("maHoSo", sql.Char(10), maHoSo)
      .query("DELETE FROM HoSoXuLyHangLoi WHERE MA_HO_SO = @maHoSo");
    return { message: "Xóa hồ sơ thành công" };
  }
};

module.exports = HoSoXuLyHangLoi;