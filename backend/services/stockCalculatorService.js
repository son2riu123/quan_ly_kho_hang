const sql = require("mssql");
const connectDB = require("../config/database");

const stockCalculatorService = {
  /**
   * Tính số lượng Tồn Khả Dụng thực tế của một mặt hàng.
   * Tồn khả dụng = Tổng tồn vật lý - Hàng cách ly - Hàng lỗi/chờ trả.
   * => Có thể hiểu đơn giản là chỉ tính các Lô Hàng / Vị trí có trạng thái 'Bình thường'.
   */
  getTonKhaDung: async (maMatHang, maKho = null) => {
    const pool = await connectDB();
    
    // Base query
    let query = `
      SELECT SUM(t.SO_LUONG) AS TON_KHA_DUNG
      FROM TonTheoViTri t
      JOIN ViTriKho v ON t.MA_VI_TRI = v.MA_VI_TRI
      WHERE t.MA_MAT_HANG = @mh 
        AND t.TRANG_THAI_TON = N'Bình thường'
    `;

    if (maKho) {
      query += ` AND v.MA_KHO = @kho `;
    }

    const request = pool.request().input("mh", sql.Char(10), maMatHang);
    if (maKho) request.input("kho", sql.Char(10), maKho);

    const result = await request.query(query);
    
    return result.recordset[0].TON_KHA_DUNG || 0;
  },

  /**
   * Tính tổng tồn vật lý (bao gồm cả hàng lỗi/cách ly)
   */
  getTonVatLy: async (maMatHang, maKho = null) => {
    const pool = await connectDB();
    
    let query = `
      SELECT SUM(t.SO_LUONG) AS TON_VAT_LY
      FROM TonTheoViTri t
      JOIN ViTriKho v ON t.MA_VI_TRI = v.MA_VI_TRI
      WHERE t.MA_MAT_HANG = @mh
    `;

    if (maKho) {
      query += ` AND v.MA_KHO = @kho `;
    }

    const request = pool.request().input("mh", sql.Char(10), maMatHang);
    if (maKho) request.input("kho", sql.Char(10), maKho);

    const result = await request.query(query);
    
    return result.recordset[0].TON_VAT_LY || 0;
  }
};

module.exports = stockCalculatorService;
