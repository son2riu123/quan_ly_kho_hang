const sql = require("mssql");
const connectDB = require("../config/database");

const BienBanTieuHuy = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM BienBanTieuHuy");
    return result.recordset;
  },

  getByMa: async (maBienBan) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maBienBan", sql.Char(10), maBienBan.trim())
      .query("SELECT * FROM BienBanTieuHuy WHERE MA_BIEN_BAN_TIEU_HUY = @maBienBan");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maBienBan", sql.Char(10), data.MA_BIEN_BAN_TIEU_HUY.trim())
      .input("maLenh", sql.Char(10), data.MA_LENH_XU_LY.trim())
      .input("ngayTieuHuy", sql.DateTime2, data.NGAY_TIEU_HUY)
      .input("nguoiThucHien", sql.Char(10), data.NGUOI_THUC_HIEN.trim())
      .input("nguoiChungKien", sql.Char(10), data.NGUOI_CHUNG_KIEN ? data.NGUOI_CHUNG_KIEN.trim() : null)
      .input("soLuong", sql.Int, data.SO_LUONG_TIEU_HUY)
      .input("phuongThuc", sql.NVarChar(100), data.PHUONG_THUC_TIEU_HUY || null)
      .input("minhChung", sql.NVarChar(255), data.MINH_CHUNG || null)
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
      .query(`
        INSERT INTO BienBanTieuHuy (MA_BIEN_BAN_TIEU_HUY, MA_LENH_XU_LY, NGAY_TIEU_HUY, NGUOI_THUC_HIEN, NGUOI_CHUNG_KIEN, SO_LUONG_TIEU_HUY, PHUONG_THUC_TIEU_HUY, MINH_CHUNG, GHI_CHU)
        VALUES (@maBienBan, @maLenh, @ngayTieuHuy, @nguoiThucHien, @nguoiChungKien, @soLuong, @phuongThuc, @minhChung, @ghiChu)
      `);
    return { message: "Thêm biên bản tiêu hủy thành công" };
  },

  update: async (maBienBan, data) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maBienBan", sql.Char(10), maBienBan.trim())
      .input("maLenh", sql.Char(10), data.MA_LENH_XU_LY.trim())
      .input("ngayTieuHuy", sql.DateTime2, data.NGAY_TIEU_HUY)
      .input("nguoiThucHien", sql.Char(10), data.NGUOI_THUC_HIEN.trim())
      .input("nguoiChungKien", sql.Char(10), data.NGUOI_CHUNG_KIEN ? data.NGUOI_CHUNG_KIEN.trim() : null)
      .input("soLuong", sql.Int, data.SO_LUONG_TIEU_HUY)
      .input("phuongThuc", sql.NVarChar(100), data.PHUONG_THUC_TIEU_HUY || null)
      .input("minhChung", sql.NVarChar(255), data.MINH_CHUNG || null)
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
      .query(`
        UPDATE BienBanTieuHuy
        SET MA_LENH_XU_LY = @maLenh, NGAY_TIEU_HUY = @ngayTieuHuy, NGUOI_THUC_HIEN = @nguoiThucHien,
            NGUOI_CHUNG_KIEN = @nguoiChungKien, SO_LUONG_TIEU_HUY = @soLuong, 
            PHUONG_THUC_TIEU_HUY = @phuongThuc, MINH_CHUNG = @minhChung, GHI_CHU = @ghiChu
        WHERE MA_BIEN_BAN_TIEU_HUY = @maBienBan
      `);
    return { affectedRows: result.rowsAffected[0], message: "Cập nhật biên bản tiêu hủy thành công" };
  },

  delete: async (maBienBan) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maBienBan", sql.Char(10), maBienBan.trim())
      .query("DELETE FROM BienBanTieuHuy WHERE MA_BIEN_BAN_TIEU_HUY = @maBienBan");
    return { affectedRows: result.rowsAffected[0], message: "Xóa biên bản tiêu hủy thành công" };
  }
};

module.exports = BienBanTieuHuy;