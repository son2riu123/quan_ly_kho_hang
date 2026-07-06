const sql = require("mssql");
const connectDB = require("../config/database");

const HoSoDotNhap = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM HoSoDotNhap");
    return result.recordset;
  },

  getByMa: async (maHoSoDotNhap) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maHoSoDotNhap", sql.Char(10), maHoSoDotNhap.trim())
      .query("SELECT * FROM HoSoDotNhap WHERE MA_HO_SO_DOT_NHAP = @maHoSoDotNhap");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maHoSoDotNhap", sql.Char(10), data.MA_HO_SO_DOT_NHAP.trim())
      .input("maDonMua", sql.Char(10), data.MA_DON_MUA.trim())
      .input("maChungTuGiao", sql.Char(10), (!data.MA_CHUNG_TU_GIAO || data.MA_CHUNG_TU_GIAO.trim() === '') ? null : data.MA_CHUNG_TU_GIAO.trim())
      .input("maBienBanGiaoNhan", sql.Char(10), (!data.MA_BIEN_BAN_GIAO_NHAN || data.MA_BIEN_BAN_GIAO_NHAN.trim() === '') ? null : data.MA_BIEN_BAN_GIAO_NHAN.trim())
      .input("maBienBanKiemNghiem", sql.Char(10), (!data.MA_BIEN_BAN_KIEM_NGHIEM || data.MA_BIEN_BAN_KIEM_NGHIEM.trim() === '') ? null : data.MA_BIEN_BAN_KIEM_NGHIEM.trim())
      .input("maPhieuNhapKho", sql.Char(10), (!data.MA_PHIEU_NHAP_KHO || data.MA_PHIEU_NHAP_KHO.trim() === '') ? null : data.MA_PHIEU_NHAP_KHO.trim())
      .input("ngayTao", sql.DateTime, data.NGAY_TAO)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI)
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
      .query(`
        INSERT INTO HoSoDotNhap (MA_HO_SO_DOT_NHAP, MA_DON_MUA, MA_CHUNG_TU_GIAO, MA_BIEN_BAN_GIAO_NHAN, MA_BIEN_BAN_KIEM_NGHIEM, MA_PHIEU_NHAP_KHO, NGAY_TAO, TRANG_THAI, GHI_CHU)
        VALUES (@maHoSoDotNhap, @maDonMua, @maChungTuGiao, @maBienBanGiaoNhan, @maBienBanKiemNghiem, @maPhieuNhapKho, @ngayTao, @trangThai, @ghiChu)
      `);
    return { message: "Thêm hồ sơ đợt nhập thành công" };
  },

  update: async (maHoSoDotNhap, data) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maHoSoDotNhap", sql.Char(10), maHoSoDotNhap.trim())
      .input("maDonMua", sql.Char(10), data.MA_DON_MUA.trim())
      .input("maChungTuGiao", sql.Char(10), (!data.MA_CHUNG_TU_GIAO || data.MA_CHUNG_TU_GIAO.trim() === '') ? null : data.MA_CHUNG_TU_GIAO.trim())
      .input("maBienBanGiaoNhan", sql.Char(10), (!data.MA_BIEN_BAN_GIAO_NHAN || data.MA_BIEN_BAN_GIAO_NHAN.trim() === '') ? null : data.MA_BIEN_BAN_GIAO_NHAN.trim())
      .input("maBienBanKiemNghiem", sql.Char(10), (!data.MA_BIEN_BAN_KIEM_NGHIEM || data.MA_BIEN_BAN_KIEM_NGHIEM.trim() === '') ? null : data.MA_BIEN_BAN_KIEM_NGHIEM.trim())
      .input("maPhieuNhapKho", sql.Char(10), (!data.MA_PHIEU_NHAP_KHO || data.MA_PHIEU_NHAP_KHO.trim() === '') ? null : data.MA_PHIEU_NHAP_KHO.trim())
      .input("ngayTao", sql.DateTime, data.NGAY_TAO)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI)
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
      .query(`
        UPDATE HoSoDotNhap
        SET MA_DON_MUA = @maDonMua, MA_CHUNG_TU_GIAO = @maChungTuGiao, MA_BIEN_BAN_GIAO_NHAN = @maBienBanGiaoNhan,
            MA_BIEN_BAN_KIEM_NGHIEM = @maBienBanKiemNghiem, MA_PHIEU_NHAP_KHO = @maPhieuNhapKho, NGAY_TAO = @ngayTao,
            TRANG_THAI = @trangThai, GHI_CHU = @ghiChu
        WHERE MA_HO_SO_DOT_NHAP = @maHoSoDotNhap
      `);
    return { affectedRows: result.rowsAffected[0], message: "Cập nhật hồ sơ đợt nhập thành công" };
  },

  delete: async (maHoSoDotNhap) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maHoSoDotNhap", sql.Char(10), maHoSoDotNhap.trim())
      .query("DELETE FROM HoSoDotNhap WHERE MA_HO_SO_DOT_NHAP = @maHoSoDotNhap");
    return { affectedRows: result.rowsAffected[0], message: "Xóa hồ sơ đợt nhập thành công" };
  }
};

module.exports = HoSoDotNhap;