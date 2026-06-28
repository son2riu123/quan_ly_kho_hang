const sql = require("mssql");
const connectDB = require("../config/database");

const TheKho = {
  getAllCards: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT tk.*, mh.TEN_MAT_HANG, nv.HO_TEN AS TEN_NGUOI_LAP
      FROM TheKho tk
      INNER JOIN MatHang mh ON tk.MA_MAT_HANG = mh.MA_MAT_HANG
      LEFT JOIN NhanVien nv ON tk.NGUOI_LAP_THE = nv.MA_NHAN_VIEN
    `);
    return result.recordset;
  },

  getCardDetails: async (maTheKho) => {
    const pool = await connectDB();
    const headerResult = await pool.request()
      .input("maTheKho", sql.Char(10), maTheKho)
      .query(`
        SELECT tk.*, mh.TEN_MAT_HANG, nv.HO_TEN AS TEN_NGUOI_LAP
        FROM TheKho tk
        INNER JOIN MatHang mh ON tk.MA_MAT_HANG = mh.MA_MAT_HANG
        LEFT JOIN NhanVien nv ON tk.NGUOI_LAP_THE = nv.MA_NHAN_VIEN
        WHERE tk.MA_THE_KHO = @maTheKho
      `);
      
    const header = headerResult.recordset[0];
    if (!header) return null;

    const logsResult = await pool.request()
      .input("maTheKho", sql.Char(10), maTheKho)
      .query(`
        SELECT dtk.*, nv.HO_TEN AS TEN_NGUOI_GHI
        FROM DongTheKho dtk
        LEFT JOIN NhanVien nv ON dtk.NGUOI_GHI = nv.MA_NHAN_VIEN
        WHERE dtk.MA_THE_KHO = @maTheKho
        ORDER BY dtk.NGAY_GHI DESC
      `);
      
    header.logs = logsResult.recordset;
    return header;
  },

  createCard: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maTheKho", sql.Char(10), data.MA_THE_KHO)
      .input("maMatHang", sql.Char(10), data.MA_MAT_HANG)
      .input("ngayMoThe", sql.DateTime, data.NGAY_MO_THE || new Date())
      .input("nguoiLapThe", sql.Char(10), data.NGUOI_LAP_THE)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI || 'Hoạt động')
      .query(`
        INSERT INTO TheKho (MA_THE_KHO, MA_MAT_HANG, NGAY_MO_THE, NGUOI_LAP_THE, TRANG_THAI)
        VALUES (@maTheKho, @maMatHang, @ngayMoThe, @nguoiLapThe, @trangThai)
      `);
    return { message: "Mở thẻ kho thành công", maTheKho: data.MA_THE_KHO };
  },

  addLogEntry: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maDong", sql.Char(10), data.MA_DONG_THE_KHO)
      .input("maTheKho", sql.Char(10), data.MA_THE_KHO)
      .input("ngayGhi", sql.DateTime, data.NGAY_GHI || new Date())
      .input("maChungTu", sql.Char(10), data.MA_CHUNG_TU)
      .input("loaiChungTu", sql.NVarChar(50), data.LOAI_CHUNG_TU)
      .input("dienGiai", sql.NVarChar(255), data.DIEN_GIAI)
      .input("soLuongNhap", sql.Int, data.SO_LUONG_NHAP || 0)
      .input("soLuongXuat", sql.Int, data.SO_LUONG_XUAT || 0)
      .input("soLuongTon", sql.Int, data.SO_LUONG_TON)
      .input("nguoiGhi", sql.Char(10), data.NGUOI_GHI)
      .query(`
        INSERT INTO DongTheKho (MA_DONG_THE_KHO, MA_THE_KHO, NGAY_GHI, MA_CHUNG_TU, LOAI_CHUNG_TU, DIEN_GIAI, SO_LUONG_NHAP, SO_LUONG_XUAT, SO_LUONG_TON, NGUOI_GHI)
        VALUES (@maDong, @maTheKho, @ngayGhi, @maChungTu, @loaiChungTu, @dienGiai, @soLuongNhap, @soLuongXuat, @soLuongTon, @nguoiGhi)
      `);
    return { message: "Ghi dòng thẻ kho thành công" };
  }
};

module.exports = TheKho;
