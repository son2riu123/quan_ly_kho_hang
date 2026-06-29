const sql = require("mssql");
const connectDB = require("../config/database");

const PhuongAnXuLySaiLech = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT p.*, nv.HO_TEN AS TEN_NGUOI_CHON
      FROM PhuongAnXuLySaiLech p
      LEFT JOIN NhanVien nv ON p.NGUOI_CHON_PHUONG_AN = nv.MA_NHAN_VIEN
    `);
    return result.recordset;
  },

  getByMa: async (maPhuongAn) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maPhuongAn", sql.Char(10), maPhuongAn)
      .query("SELECT * FROM PhuongAnXuLySaiLech WHERE MA_PHUONG_AN = @maPhuongAn");
    return result.recordset[0];
  },

  getByHoSo: async (maHoSo) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maHoSo", sql.Char(10), maHoSo)
      .query(`
        SELECT p.*, nv.HO_TEN AS TEN_NGUOI_CHON
        FROM PhuongAnXuLySaiLech p
        LEFT JOIN NhanVien nv ON p.NGUOI_CHON_PHUONG_AN = nv.MA_NHAN_VIEN
        WHERE p.MA_HO_SO = @maHoSo
      `);
    return result.recordset;
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maPhuongAn", sql.Char(10), data.MA_PHUONG_AN)
      .input("maHoSo", sql.Char(10), data.MA_HO_SO)
      .input("loaiPhuongAn", sql.NVarChar(100), data.LOAI_PHUONG_AN)
      .input("lyDo", sql.NVarChar(255), data.LY_DO)
      .input("nguoiChon", sql.Char(10), data.NGUOI_CHON_PHUONG_AN)
      .input("thoiDiemChon", sql.DateTime2, data.THOI_DIEM_CHON || new Date())
      .input("canThaotacVatLy", sql.Bit, data.CAN_THAO_TAC_VAT_LY ?? 0)
      .input("canDuyetCapCao", sql.Bit, data.CAN_DUYET_CAP_CAO ?? 0)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI_PHUONG_AN)
      .query(`
        INSERT INTO PhuongAnXuLySaiLech
          (MA_PHUONG_AN, MA_HO_SO, LOAI_PHUONG_AN, LY_DO, NGUOI_CHON_PHUONG_AN,
           THOI_DIEM_CHON, CAN_THAO_TAC_VAT_LY, CAN_DUYET_CAP_CAO, TRANG_THAI_PHUONG_AN)
        VALUES
          (@maPhuongAn, @maHoSo, @loaiPhuongAn, @lyDo, @nguoiChon,
           @thoiDiemChon, @canThaotacVatLy, @canDuyetCapCao, @trangThai)
      `);
    return { message: "Thêm phương án xử lý sai lệch thành công" };
  },

  update: async (maPhuongAn, data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maPhuongAn", sql.Char(10), maPhuongAn)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI_PHUONG_AN)
      .query(`
        UPDATE PhuongAnXuLySaiLech
        SET TRANG_THAI_PHUONG_AN = @trangThai
        WHERE MA_PHUONG_AN = @maPhuongAn
      `);
    return { message: "Cập nhật phương án xử lý sai lệch thành công" };
  },

  delete: async (maPhuongAn) => {
    const pool = await connectDB();
    await pool.request()
      .input("maPhuongAn", sql.Char(10), maPhuongAn)
      .query("DELETE FROM PhuongAnXuLySaiLech WHERE MA_PHUONG_AN = @maPhuongAn");
    return { message: "Xóa phương án xử lý sai lệch thành công" };
  }
};

module.exports = PhuongAnXuLySaiLech;