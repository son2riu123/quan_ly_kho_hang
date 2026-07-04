const sql = require("mssql");
const connectDB = require("../config/database");

const QuyCachDongGoi = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT qc.*, mh.TEN_MAT_HANG, dvt1.TEN_DON_VI_TINH AS TEN_DON_VI_NHAP
      FROM QuyCachDongGoi qc
      LEFT JOIN MatHang mh ON qc.MA_MAT_HANG = mh.MA_MAT_HANG
      LEFT JOIN DonViTinh dvt1 ON qc.MA_DON_VI_NHAP = dvt1.MA_DON_VI_TINH
    `);
    return result.recordset;
  },

  getByMa: async (maQuyCach) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maQuyCach", sql.Char(10), maQuyCach.trim())
      .query("SELECT * FROM QuyCachDongGoi WHERE MA_QUY_CACH = @maQuyCach");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maQuyCach", sql.Char(10), data.MA_QUY_CACH.trim())
      .input("maMatHang", sql.Char(10), data.MA_MAT_HANG.trim())
      .input("maDonViNhap", sql.Char(10), data.MA_DON_VI_NHAP.trim())
      .input("maDonViCoSo", sql.Char(10), data.MA_DON_VI_CO_SO ? data.MA_DON_VI_CO_SO.trim() : null)
      .input("soLuongQuyDoi", sql.Int, data.SO_LUONG_QUY_DOI || null)
      .input("moTa", sql.NVarChar(255), data.MO_TA || null)
      .query(`
        INSERT INTO QuyCachDongGoi (MA_QUY_CACH, MA_MAT_HANG, MA_DON_VI_NHAP, MA_DON_VI_CO_SO, SO_LUONG_QUY_DOI, MO_TA)
        VALUES (@maQuyCach, @maMatHang, @maDonViNhap, @maDonViCoSo, @soLuongQuyDoi, @moTa)
      `);
    return { message: "Thêm quy cách đóng gói thành công" };
  },

  update: async (maQuyCach, data) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maQuyCach", sql.Char(10), maQuyCach.trim())
      .input("maMatHang", sql.Char(10), data.MA_MAT_HANG.trim())
      .input("maDonViNhap", sql.Char(10), data.MA_DON_VI_NHAP.trim())
      .input("maDonViCoSo", sql.Char(10), data.MA_DON_VI_CO_SO ? data.MA_DON_VI_CO_SO.trim() : null)
      .input("soLuongQuyDoi", sql.Int, data.SO_LUONG_QUY_DOI || null)
      .input("moTa", sql.NVarChar(255), data.MO_TA || null)
      .query(`
        UPDATE QuyCachDongGoi
        SET MA_MAT_HANG = @maMatHang, MA_DON_VI_NHAP = @maDonViNhap,
            MA_DON_VI_CO_SO = @maDonViCoSo, SO_LUONG_QUY_DOI = @soLuongQuyDoi, MO_TA = @moTa
        WHERE MA_QUY_CACH = @maQuyCach
      `);
    return { 
      affectedRows: result.rowsAffected[0], 
      message: "Cập nhật quy cách đóng gói thành công" 
    };
  },

  delete: async (maQuyCach) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maQuyCach", sql.Char(10), maQuyCach.trim())
      .query("DELETE FROM QuyCachDongGoi WHERE MA_QUY_CACH = @maQuyCach");
    return { 
      affectedRows: result.rowsAffected[0], 
      message: "Xóa quy cách đóng gói thành công" 
    };
  }
};

module.exports = QuyCachDongGoi;