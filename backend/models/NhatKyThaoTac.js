const sql = require("mssql");
const connectDB = require("../config/database");

const NhatKyThaoTac = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT n.*, nv.HO_TEN AS TEN_NGUOI_THAO_TAC
      FROM NhatKyThaoTac n
      LEFT JOIN NhanVien nv ON n.NGUOI_THAO_TAC = nv.MA_NHAN_VIEN
      ORDER BY n.THOI_GIAN DESC
    `);
    return result.recordset;
  },

  getByMa: async (maLog) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maLog", sql.Char(10), maLog)
      .query("SELECT * FROM NhatKyThaoTac WHERE MA_LOG = @maLog");
    return result.recordset[0];
  },

  getByNguoi: async (nguoiThaoTac) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("nguoiThaoTac", sql.Char(10), nguoiThaoTac)
      .query(`
        SELECT * FROM NhatKyThaoTac
        WHERE NGUOI_THAO_TAC = @nguoiThaoTac
        ORDER BY THOI_GIAN DESC
      `);
    return result.recordset;
  },

  getByDoiTuong: async (doiTuong, maDoiTuong) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("doiTuong", sql.NVarChar(100), doiTuong)
      .input("maDoiTuong", sql.Char(10), maDoiTuong)
      .query(`
        SELECT n.*, nv.HO_TEN AS TEN_NGUOI_THAO_TAC
        FROM NhatKyThaoTac n
        LEFT JOIN NhanVien nv ON n.NGUOI_THAO_TAC = nv.MA_NHAN_VIEN
        WHERE n.DOI_TUONG_BI_TAC_DONG = @doiTuong AND n.MA_DOI_TUONG = @maDoiTuong
        ORDER BY n.THOI_GIAN DESC
      `);
    return result.recordset;
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maLog", sql.Char(10), data.MA_LOG)
      .input("nguoiThaoTac", sql.Char(10), data.NGUOI_THAO_TAC)
      .input("thoiGian", sql.DateTime2, data.THOI_GIAN || new Date())
      .input("hanhDong", sql.NVarChar(100), data.HANH_DONG)
      .input("doiTuongBiTacDong", sql.NVarChar(100), data.DOI_TUONG_BI_TAC_DONG)
      .input("maDoiTuong", sql.Char(10), data.MA_DOI_TUONG)
      .input("duLieuTruoc", sql.NVarChar(sql.MAX), data.DU_LIEU_TRUOC)
      .input("duLieuSau", sql.NVarChar(sql.MAX), data.DU_LIEU_SAU)
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU)
      .query(`
        INSERT INTO NhatKyThaoTac
          (MA_LOG, NGUOI_THAO_TAC, THOI_GIAN, HANH_DONG, DOI_TUONG_BI_TAC_DONG,
           MA_DOI_TUONG, DU_LIEU_TRUOC, DU_LIEU_SAU, GHI_CHU)
        VALUES
          (@maLog, @nguoiThaoTac, @thoiGian, @hanhDong, @doiTuongBiTacDong,
           @maDoiTuong, @duLieuTruoc, @duLieuSau, @ghiChu)
      `);
    return { message: "Ghi nhật ký thao tác thành công" };
  }
};

module.exports = NhatKyThaoTac;