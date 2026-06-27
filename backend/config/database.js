const sql = require("mssql");
require("dotenv").config(); // Kích hoạt đọc file .env

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, 
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10) || 1433, 
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function connectDB() {
  try {
    const pool = await sql.connect(config);
    console.log(" Kết nối SQL Server thành công!");
    return pool;
  } catch (err) {
    console.error(" Lỗi kết nối CSDL:", err.message);
  }
}

module.exports = connectDB;