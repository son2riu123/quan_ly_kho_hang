const sql = require("mssql");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../backend/.env") });

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

async function run() {
  try {
    const pool = await sql.connect(config);
    console.log("Connected to SQL Server successfully.");
    
    const dbResult = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
    `);
    const dbTables = dbResult.recordset.map(row => row.TABLE_NAME.toLowerCase());
    
    const sqlContent = fs.readFileSync("C:\\Users\\Admin\\Documents\\QL_KHO.sql", "utf-8");
    
    const createTableRegex = /CREATE\s+TABLE\s+(\w+)/gi;
    let match;
    const sqlTables = [];
    while ((match = createTableRegex.exec(sqlContent)) !== null) {
      const tableName = match[1].toLowerCase();
      if (!sqlTables.includes(tableName)) {
        sqlTables.push(tableName);
      }
    }
    
    console.log(`Tables defined in SQL file: ${sqlTables.length}`);
    console.log(`Tables existing in Database: ${dbTables.length}`);
    
    const missing = sqlTables.filter(t => !dbTables.includes(t));
    if (missing.length > 0) {
      console.log("\nMISSING_TABLES_START");
      missing.forEach(t => console.log(t));
      console.log("MISSING_TABLES_END");
    } else {
      console.log("\nALL_OK: All tables exist in the database.");
    }
    
    console.log("\nROW_COUNTS_START");
    const checkTables = ['nhanvien', 'nhacungcap', 'kho', 'mathang', 'donmuahang', 'phieunhapkho', 'vitrikho', 'donvitinh'];
    for (const table of checkTables) {
      if (dbTables.includes(table)) {
        try {
          const countRes = await pool.request().query(`SELECT COUNT(*) as cnt FROM [${table}]`);
          console.log(`${table}:${countRes.recordset[0].cnt}`);
        } catch (e) {
          console.log(`${table}:error`);
        }
      } else {
        console.log(`${table}:missing`);
      }
    }
    console.log("ROW_COUNTS_END");
    
    await sql.close();
  } catch (err) {
    console.error("Error connecting or running query: ", err.message);
  }
}

run();
