const sql = require("mssql");
const connectDB = require("../config/database");

const DanhMucViTriKhuyenNghi = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT dm.*, mh.TEN_MAT_HANG 
      FROM DanhMucViTriKhuyenNghi dm
      LEFT JOIN MatHang mh ON dm.MA_MAT_HANG = mh.MA_MAT_HANG
    `);
    return result.recordset;
  },

  getByMa: async (maDanhMuc) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maDanhMuc", sql.Char(10), maDanhMuc)
      .query("SELECT * FROM DanhMucViTriKhuyenNghi WHERE MA_DANH_MUC = @maDanhMuc");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maDanhMuc", sql.Char(10), data.MA_DANH_MUC)
      .input("maMatHang", sql.Char(10), data.MA_MAT_HANG)
      .input("maViTri", sql.Char(10), data.MA_VI_TRI)
      .input("mucDoUuTien", sql.Int, data.MUC_DO_UU_TIEN || null)
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
      .query(`
        INSERT INTO DanhMucViTriKhuyenNghi (MA_DANH_MUC, MA_MAT_HANG, MA_VI_TRI, MUC_DO_UU_TIEN, GHI_CHU)
        VALUES (@maDanhMuc, @maMatHang, @maViTri, @mucDoUuTien, @ghiChu)
      `);
    return { message: "Thêm danh mục vị trí khuyến nghị thành công" };
  },

  update: async (maDanhMuc, data) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maDanhMuc", sql.Char(10), maDanhMuc)
      .input("maMatHang", sql.Char(10), data.MA_MAT_HANG)
      .input("maViTri", sql.Char(10), data.MA_VI_TRI)
      .input("mucDoUuTien", sql.Int, data.MUC_DO_UU_TIEN || null)
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
      .query(`
        UPDATE DanhMucViTriKhuyenNghi
        SET MA_MAT_HANG = @maMatHang, 
            MA_VI_TRI = @maViTri, 
            MUC_DO_UU_TIEN = @mucDoUuTien, 
            GHI_CHU = @ghiChu
        WHERE MA_DANH_MUC = @maDanhMuc
      `);
    return { 
      affectedRows: result.rowsAffected[0], 
      message: "Cập nhật danh mục vị trí khuyến nghị thành công" 
    };
  },

  delete: async (maDanhMuc) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maDanhMuc", sql.Char(10), maDanhMuc)
      .query("DELETE FROM DanhMucViTriKhuyenNghi WHERE MA_DANH_MUC = @maDanhMuc");
    return { 
      affectedRows: result.rowsAffected[0], 
      message: "Xóa danh mục vị trí khuyến nghị thành công" 
    };
  }
};

module.exports = DanhMucViTriKhuyenNghi;