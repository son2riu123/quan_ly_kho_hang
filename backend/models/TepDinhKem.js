const sql = require("mssql");
const connectDB = require("../config/database");

const TepDinhKem = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT t.*, nv.HO_TEN AS TEN_NGUOI_TAI_LEN
      FROM TepDinhKem t
      LEFT JOIN NhanVien nv ON t.NGUOI_TAI_LEN = nv.MA_NHAN_VIEN
    `);
    return result.recordset;
  },

  getByMa: async (maTep) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maTep", sql.Char(10), maTep)
      .query("SELECT * FROM TepDinhKem WHERE MA_TEP = @maTep");
    return result.recordset[0];
  },

  getByDoiTuong: async (doiTuongLienKet, maDoiTuong) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("doiTuongLienKet", sql.NVarChar(50), doiTuongLienKet)
      .input("maDoiTuong", sql.Char(10), maDoiTuong)
      .query(`
        SELECT t.*, nv.HO_TEN AS TEN_NGUOI_TAI_LEN
        FROM TepDinhKem t
        LEFT JOIN NhanVien nv ON t.NGUOI_TAI_LEN = nv.MA_NHAN_VIEN
        WHERE t.DOI_TUONG_LIEN_KET = @doiTuongLienKet
          AND t.MA_DOI_TUONG_LIEN_KET = @maDoiTuong
      `);
    return result.recordset;
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maTep", sql.Char(10), data.MA_TEP)
      .input("tenTep", sql.NVarChar(150), data.TEN_TEP)
      .input("duongDan", sql.NVarChar(255), data.DUONG_DAN)
      .input("loaiTep", sql.NVarChar(50), data.LOAI_TEP)
      .input("doiTuongLienKet", sql.NVarChar(50), data.DOI_TUONG_LIEN_KET)
      .input("maDoiTuongLienKet", sql.Char(10), data.MA_DOI_TUONG_LIEN_KET)
      .input("ngayTaiLen", sql.DateTime2, data.NGAY_TAI_LEN || new Date())
      .input("nguoiTaiLen", sql.Char(10), data.NGUOI_TAI_LEN)
      .query(`
        INSERT INTO TepDinhKem
          (MA_TEP, TEN_TEP, DUONG_DAN, LOAI_TEP, DOI_TUONG_LIEN_KET,
           MA_DOI_TUONG_LIEN_KET, NGAY_TAI_LEN, NGUOI_TAI_LEN)
        VALUES
          (@maTep, @tenTep, @duongDan, @loaiTep, @doiTuongLienKet,
           @maDoiTuongLienKet, @ngayTaiLen, @nguoiTaiLen)
      `);
    return { message: "Thêm tệp đính kèm thành công" };
  },

  delete: async (maTep) => {
    const pool = await connectDB();
    await pool.request()
      .input("maTep", sql.Char(10), maTep)
      .query("DELETE FROM TepDinhKem WHERE MA_TEP = @maTep");
    return { message: "Xóa tệp đính kèm thành công" };
  }
};

module.exports = TepDinhKem;