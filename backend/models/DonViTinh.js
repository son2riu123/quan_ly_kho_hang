const sql = require("mssql");
const connectDB = require("../config/database");

const DonViTinh = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM DonViTinh");
    return result.recordset;
  }
};

module.exports = DonViTinh;
