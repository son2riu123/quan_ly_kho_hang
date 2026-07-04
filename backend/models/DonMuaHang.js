const sql = require("mssql");
const connectDB = require("../config/database");

const DonMuaHang = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT dm.*, ncc.TEN_NHA_CUNG_CAP, k.TEN_KHO
      FROM DonMuaHang dm
      LEFT JOIN NhaCungCap ncc ON dm.MA_NHA_CUNG_CAP = ncc.MA_NHA_CUNG_CAP
      LEFT JOIN Kho k ON dm.MA_KHO_NHAN = k.MA_KHO
    `);
    return result.recordset;
  },

  getByMa: async (maDonMua) => {
    const pool = await connectDB();
    
    // Lấy thông tin Header của đơn mua hàng
    const headerResult = await pool.request()
      .input("maDonMua", sql.Char(10), maDonMua)
      .query(`
        SELECT dm.*, ncc.TEN_NHA_CUNG_CAP, k.TEN_KHO
        FROM DonMuaHang dm
        LEFT JOIN NhaCungCap ncc ON dm.MA_NHA_CUNG_CAP = ncc.MA_NHA_CUNG_CAP
        LEFT JOIN Kho k ON dm.MA_KHO_NHAN = k.MA_KHO
        WHERE dm.MA_DON_MUA = @maDonMua
      `);
      
    const header = headerResult.recordset[0];
    if (!header) return null;

    // Lấy thông tin các mặt hàng chi tiết trong đơn
    const detailsResult = await pool.request()
      .input("maDonMua", sql.Char(10), maDonMua)
      .query(`
        SELECT ct.*, mh.TEN_MAT_HANG, dvt.TEN_DON_VI_TINH
        FROM ChiTietDonMuaHang ct
        INNER JOIN MatHang mh ON ct.MA_MAT_HANG = mh.MA_MAT_HANG
        INNER JOIN DonViTinh dvt ON ct.MA_DON_VI_TINH = dvt.MA_DON_VI_TINH
        WHERE ct.MA_DON_MUA = @maDonMua
      `);
      
    header.details = detailsResult.recordset;
    return header;
  },

  create: async (data) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      
      // 1. Insert header
      const requestHeader = new sql.Request(transaction);
      await requestHeader
        .input("maDonMua", sql.Char(10), data.MA_DON_MUA)
        .input("maNhaCungCap", sql.Char(10), data.MA_NHA_CUNG_CAP)
        .input("maKhoNhan", sql.Char(10), data.MA_KHO_NHAN)
        .input("ngayDat", sql.Date, data.NGAY_DAT)
        .input("ngayDuKienGiao", sql.Date, data.NGAY_DU_KIEN_GIAO)
        .input("tongSoLuongDat", sql.Int, data.TONG_SO_LUONG_DAT)
        .input("tongTien", sql.Decimal(18, 2), data.TONG_TIEN)
        .input("trangThai", sql.NVarChar(30), data.TRANG_THAI || 'Chờ nhận')
        .input("ghiChu", sql.NVarChar(255), data.GHI_CHU)
        .query(`
          INSERT INTO DonMuaHang (MA_DON_MUA, MA_NHA_CUNG_CAP, MA_KHO_NHAN, NGAY_DAT, NGAY_DU_KIEN_GIAO, TONG_SO_LUONG_DAT, TONG_TIEN, TRANG_THAI, GHI_CHU)
          VALUES (@maDonMua, @maNhaCungCap, @maKhoNhan, @ngayDat, @ngayDuKienGiao, @tongSoLuongDat, @tongTien, @trangThai, @ghiChu)
        `);

      // 2. Insert details
      if (data.details && data.details.length > 0) {
        for (let i = 0; i < data.details.length; i++) {
          const detail = data.details[i];
          const requestDetail = new sql.Request(transaction);
          await requestDetail
            .input("maChiTiet", sql.Char(10), detail.MA_CHI_TIET_DON_MUA)
            .input("maDonMua", sql.Char(10), data.MA_DON_MUA)
            .input("maMatHang", sql.Char(10), detail.MA_MAT_HANG)
            .input("maDonViTinh", sql.Char(10), detail.MA_DON_VI_TINH)
            .input("soLuongDat", sql.Int, detail.SO_LUONG_DAT)
            .input("soLuongDaNhap", sql.Int, 0)
            .input("soLuongConChoNhan", sql.Int, detail.SO_LUONG_DAT)
            .input("donGia", sql.Decimal(18, 2), detail.DON_GIA)
            .input("thanhTien", sql.Decimal(18, 2), detail.THANH_TIEN)
            .input("ghiChu", sql.NVarChar(255), detail.GHI_CHU)
            .query(`
              INSERT INTO ChiTietDonMuaHang (MA_CHI_TIET_DON_MUA, MA_DON_MUA, MA_MAT_HANG, MA_DON_VI_TINH, SO_LUONG_DAT, SO_LUONG_DA_NHAP, SO_LUONG_CON_CHO_NHAN, DON_GIA, THANH_TIEN, GHI_CHU)
              VALUES (@maChiTiet, @maDonMua, @maMatHang, @maDonViTinh, @soLuongDat, @soLuongDaNhap, @soLuongConChoNhan, @donGia, @thanhTien, @ghiChu)
            `);
        }
      }

      await transaction.commit();
      return { message: "Tạo đơn mua hàng thành công", maDonMua: data.MA_DON_MUA };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};

module.exports = DonMuaHang;
