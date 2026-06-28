const sql = require("mssql");
const connectDB = require("../config/database");

const Kho = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM Kho");
    return result.recordset;
  },

  getByMa: async (maKho) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maKho", sql.Char(10), maKho)
      .query("SELECT * FROM Kho WHERE MA_KHO = @maKho");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maKho", sql.Char(10), data.MA_KHO)
      .input("tenKho", sql.NVarChar(150), data.TEN_KHO)
      .input("diaChi", sql.NVarChar(255), data.DIA_CHI)
      .input("sieuThiGanNhat", sql.NVarChar(150), data.SIEU_THI_GAN_NHAT)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI)
      .query(`
        INSERT INTO Kho (MA_KHO, TEN_KHO, DIA_CHI, SIEU_THI_GAN_NHAT, TRANG_THAI)
        VALUES (@maKho, @tenKho, @diaChi, @sieuThiGanNhat, @trangThai)
      `);
    return { message: "Thêm kho thành công" };
  },

  update: async (maKho, data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maKho", sql.Char(10), maKho)
      .input("tenKho", sql.NVarChar(150), data.TEN_KHO)
      .input("diaChi", sql.NVarChar(255), data.DIA_CHI)
      .input("sieuThiGanNhat", sql.NVarChar(150), data.SIEU_THI_GAN_NHAT)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI)
      .query(`
        UPDATE Kho 
        SET TEN_KHO = @tenKho, DIA_CHI = @diaChi, SIEU_THI_GAN_NHAT = @sieuThiGanNhat, TRANG_THAI = @trangThai
        WHERE MA_KHO = @maKho
      `);
    return { message: "Cập nhật kho thành công" };
  },

  delete: async (maKho) => {
    const pool = await connectDB();
    await pool.request()
      .input("maKho", sql.Char(10), maKho)
      .query("DELETE FROM Kho WHERE MA_KHO = @maKho");
    return { message: "Xóa kho thành công" };
  }
};

module.exports = Kho;
