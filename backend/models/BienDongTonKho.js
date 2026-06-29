const sql = require("mssql");
const connectDB = require("../config/database");

const BienDongTonKho = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM BienDongTonKho");
    return result.recordset;
  },

  getByMa: async (maBienDong) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maBienDong", sql.Char(10), maBienDong.trim())
      .query("SELECT * FROM BienDongTonKho WHERE MA_BIEN_DONG = @maBienDong");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maBienDong", sql.Char(10), data.MA_BIEN_DONG.trim())
      .input("maMatHang", sql.Char(10), data.MA_MAT_HANG.trim())
      .input("maLoHang", sql.Char(10), data.MA_LO_HANG ? data.MA_LO_HANG.trim() : null)
      .input("maViTri", sql.Char(10), data.MA_VI_TRI ? data.MA_VI_TRI.trim() : null)
      .input("maChungTu", sql.Char(10), data.MA_CHUNG_TU ? data.MA_CHUNG_TU.trim() : null)
      .input("loaiChungTu", sql.NVarChar(50), data.LOAI_CHUNG_TU || null)
      .input("loaiBienDong", sql.NVarChar(50), data.LOAI_BIEN_DONG)
      .input("soLuong", sql.Int, data.SO_LUONG)
      .input("thoiGian", sql.DateTime2, data.THOI_GIAN)
      .input("nguoiThucHien", sql.Char(10), data.NGUOI_THUC_HIEN.trim())
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
      .query(`
        INSERT INTO BienDongTonKho (MA_BIEN_DONG, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, MA_CHUNG_TU, LOAI_CHUNG_TU, LOAI_BIEN_DONG, SO_LUONG, THOI_GIAN, NGUOI_THUC_HIEN, GHI_CHU)
        VALUES (@maBienDong, @maMatHang, @maLoHang, @maViTri, @maChungTu, @loaiChungTu, @loaiBienDong, @soLuong, @thoiGian, @nguoiThucHien, @ghiChu)
      `);
    return { message: "Ghi nhận biến động tồn kho thành công" };
  }
};

module.exports = BienDongTonKho;