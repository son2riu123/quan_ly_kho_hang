const sql = require("mssql");
const connectDB = require("../config/database");

const CanhBaoTonKho = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT c.*, k.TEN_KHO, m.TEN_MAT_HANG
      FROM CanhBaoTonKho c
      LEFT JOIN Kho k ON c.MA_KHO = k.MA_KHO
      LEFT JOIN MatHang m ON c.MA_MAT_HANG = m.MA_MAT_HANG
      ORDER BY c.THOI_DIEM_PHAT_SINH DESC
    `);
    return result.recordset;
  },

  getByMa: async (maCanhBao) => {
    const pool = await connectDB();
    const headerResult = await pool.request()
      .input("ma", sql.Char(10), maCanhBao)
      .query(`
        SELECT c.*, k.TEN_KHO, m.TEN_MAT_HANG
        FROM CanhBaoTonKho c
        LEFT JOIN Kho k ON c.MA_KHO = k.MA_KHO
        LEFT JOIN MatHang m ON c.MA_MAT_HANG = m.MA_MAT_HANG
        WHERE c.MA_CANH_BAO = @ma
      `);
    const header = headerResult.recordset[0];
    if (!header) return null;

    const detailsResult = await pool.request()
      .input("ma", sql.Char(10), maCanhBao)
      .query(`
        SELECT * FROM ChiTietCanhBaoTonKho WHERE MA_CANH_BAO = @ma
      `);
    header.details = detailsResult.recordset;
    return header;
  },

  create: async (data) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    try {
      await transaction.begin();
      
      const requestHeader = new sql.Request(transaction);
      await requestHeader
        .input("ma", sql.Char(10), data.MA_CANH_BAO)
        .input("kho", sql.Char(10), data.MA_KHO)
        .input("mh", sql.Char(10), data.MA_MAT_HANG)
        .input("lo", sql.Char(10), data.MA_LO_HANG || null)
        .input("vitri", sql.Char(10), data.MA_VI_TRI || null)
        .input("loai", sql.NVarChar(50), data.LOAI_CANH_BAO)
        .input("uutien", sql.NVarChar(30), data.MUC_DO_UU_TIEN)
        .input("slhientai", sql.Int, data.SO_LUONG_HIEN_TAI)
        .input("nguong", sql.Int, data.NGUONG_CANH_BAO)
        .input("thoigiam", sql.DateTime2(0), new Date())
        .input("trangthai", sql.NVarChar(50), data.TRANG_THAI_CANH_BAO || 'Chờ xử lý')
        .input("mota", sql.NVarChar(255), data.MO_TA || null)
        .input("ghichu", sql.NVarChar(255), data.GHI_CHU || null)
        .query(`
          INSERT INTO CanhBaoTonKho (MA_CANH_BAO, MA_KHO, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, LOAI_CANH_BAO, MUC_DO_UU_TIEN, SO_LUONG_HIEN_TAI, NGUONG_CANH_BAO, THOI_DIEM_PHAT_SINH, TRANG_THAI_CANH_BAO, MO_TA, GHI_CHU)
          VALUES (@ma, @kho, @mh, @lo, @vitri, @loai, @uutien, @slhientai, @nguong, @thoigiam, @trangthai, @mota, @ghichu)
        `);

      if (data.details && data.details.length > 0) {
        for (const detail of data.details) {
          const requestDetail = new sql.Request(transaction);
          await requestDetail
            .input("maCT", sql.Char(10), detail.MA_CHI_TIET_CANH_BAO)
            .input("maCB", sql.Char(10), data.MA_CANH_BAO)
            .input("maTon", sql.Char(10), detail.MA_TON_VI_TRI || null)
            .input("slVatLy", sql.Int, detail.SO_LUONG_VAT_LY || 0)
            .input("slKhaDung", sql.Int, detail.SO_LUONG_KHA_DUNG || 0)
            .input("hsd", sql.Date, detail.HAN_SU_DUNG || null)
            .input("trangThai", sql.NVarChar(50), detail.TRANG_THAI_TON || null)
            .input("nguyenNhan", sql.NVarChar(255), detail.NGUYEN_NHAN_DU_KIEN || null)
            .query(`
              INSERT INTO ChiTietCanhBaoTonKho (MA_CHI_TIET_CANH_BAO, MA_CANH_BAO, MA_TON_VI_TRI, SO_LUONG_VAT_LY, SO_LUONG_KHA_DUNG, HAN_SU_DUNG, TRANG_THAI_TON, NGUYEN_NHAN_DU_KIEN)
              VALUES (@maCT, @maCB, @maTon, @slVatLy, @slKhaDung, @hsd, @trangThai, @nguyenNhan)
            `);
        }
      }
      
      await transaction.commit();
      return { success: true, ma: data.MA_CANH_BAO };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
module.exports = CanhBaoTonKho;
