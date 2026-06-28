const sql = require("mssql");
const connectDB = require("../config/database");

const ViTriKho = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT vt.*, k.TEN_KHO 
      FROM ViTriKho vt
      LEFT JOIN Kho k ON vt.MA_KHO = k.MA_KHO
    `);
    return result.recordset;
  },

  getByMa: async (maViTri) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maViTri", sql.Char(10), maViTri)
      .query("SELECT * FROM ViTriKho WHERE MA_VI_TRI = @maViTri");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maViTri", sql.Char(10), data.MA_VI_TRI)
      .input("maKho", sql.Char(10), data.MA_KHO)
      .input("khu", sql.NVarChar(100), data.KHU)
      .input("day", sql.NVarChar(100), data.DAY)
      .input("ke", sql.NVarChar(100), data.KE)
      .input("tang", sql.NVarChar(50), data.TANG)
      .input("o", sql.NVarChar(50), data.O)
      .input("loaiViTri", sql.NVarChar(50), data.LOAI_VI_TRI)
      .input("dieuKienBaoQuan", sql.NVarChar(100), data.DIEU_KIEN_BAO_QUAN)
      .input("sucChua", sql.Int, data.SUC_CHUA)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI_VI_TRI || 'Trống')
      .query(`
        INSERT INTO ViTriKho (MA_VI_TRI, MA_KHO, KHU, DAY, KE, TANG, O, LOAI_VI_TRI, DIEU_KIEN_BAO_QUAN, SUC_CHUA, TRANG_THAI_VI_TRI)
        VALUES (@maViTri, @maKho, @khu, @day, @ke, @tang, @o, @loaiViTri, @dieuKienBaoQuan, @sucChua, @trangThai)
      `);
    return { message: "Thêm vị trí kho thành công" };
  },

  update: async (maViTri, data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maViTri", sql.Char(10), maViTri)
      .input("maKho", sql.Char(10), data.MA_KHO)
      .input("khu", sql.NVarChar(100), data.KHU)
      .input("day", sql.NVarChar(100), data.DAY)
      .input("ke", sql.NVarChar(100), data.KE)
      .input("tang", sql.NVarChar(50), data.TANG)
      .input("o", sql.NVarChar(50), data.O)
      .input("loaiViTri", sql.NVarChar(50), data.LOAI_VI_TRI)
      .input("dieuKienBaoQuan", sql.NVarChar(100), data.DIEU_KIEN_BAO_QUAN)
      .input("sucChua", sql.Int, data.SUC_CHUA)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI_VI_TRI)
      .query(`
        UPDATE ViTriKho 
        SET MA_KHO = @maKho, KHU = @khu, DAY = @day, KE = @ke, TANG = @tang, O = @o, 
            LOAI_VI_TRI = @loaiViTri, DIEU_KIEN_BAO_QUAN = @dieuKienBaoQuan, SUC_CHUA = @sucChua, TRANG_THAI_VI_TRI = @trangThai
        WHERE MA_VI_TRI = @maViTri
      `);
    return { message: "Cập nhật vị trí kho thành công" };
  },

  delete: async (maViTri) => {
    const pool = await connectDB();
    await pool.request()
      .input("maViTri", sql.Char(10), maViTri)
      .query("DELETE FROM ViTriKho WHERE MA_VI_TRI = @maViTri");
    return { message: "Xóa vị trí kho thành công" };
  }
};

module.exports = ViTriKho;
