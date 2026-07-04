const sql = require("mssql");
const connectDB = require("../config/database");

const Dashboard = {
  getStats: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT
        (SELECT COUNT(*) FROM MatHang) AS totalMatHang,
        (SELECT COUNT(*) FROM NhanVien) AS totalNhanVien,
        (SELECT COUNT(*) FROM Kho) AS totalKho,
        (SELECT COUNT(*) FROM NhaCungCap) AS totalNhaCungCap,
        (SELECT COUNT(*) FROM DonMuaHang) AS totalDonMuaHang,
        (SELECT COUNT(*) FROM PhieuNhapKho) AS totalPhieuNhapKho
    `);
    return result.recordset[0];
  }
};

module.exports = Dashboard;
