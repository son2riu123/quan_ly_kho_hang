const sql = require("mssql");
const connectDB = require("../config/database");

const PhieuNhapKho = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT pnk.*, k.TEN_KHO, nv.HO_TEN AS TEN_THU_KHO
      FROM PhieuNhapKho pnk
      LEFT JOIN Kho k ON pnk.MA_KHO = k.MA_KHO
      LEFT JOIN NhanVien nv ON pnk.MA_THU_KHO = nv.MA_NHAN_VIEN
    `);
    return result.recordset;
  },

  getByMa: async (maPhieu) => {
    const pool = await connectDB();
    
    const headerResult = await pool.request()
      .input("maPhieu", sql.Char(10), maPhieu)
      .query(`
        SELECT pnk.*, k.TEN_KHO, nv.HO_TEN AS TEN_THU_KHO
        FROM PhieuNhapKho pnk
        LEFT JOIN Kho k ON pnk.MA_KHO = k.MA_KHO
        LEFT JOIN NhanVien nv ON pnk.MA_THU_KHO = nv.MA_NHAN_VIEN
        WHERE pnk.MA_PHIEU_NHAP_KHO = @maPhieu
      `);
      
    const header = headerResult.recordset[0];
    if (!header) return null;

    const detailsResult = await pool.request()
      .input("maPhieu", sql.Char(10), maPhieu)
      .query(`
        SELECT ct.*, mh.TEN_MAT_HANG, dvt.TEN_DON_VI_TINH
        FROM ChiTietPhieuNhapKho ct
        INNER JOIN MatHang mh ON ct.MA_MAT_HANG = mh.MA_MAT_HANG
        INNER JOIN DonViTinh dvt ON ct.MA_DON_VI_TINH = dvt.MA_DON_VI_TINH
        WHERE ct.MA_PHIEU_NHAP_KHO = @maPhieu
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
        .input("maPhieu", sql.Char(10), data.MA_PHIEU_NHAP_KHO)
        .input("maBBGN", sql.Char(10), data.MA_BIEN_BAN_GIAO_NHAN)
        .input("maKho", sql.Char(10), data.MA_KHO)
        .input("ngayLap", sql.DateTime, data.NGAY_LAP || new Date())
        .input("maThuKho", sql.Char(10), data.MA_THU_KHO)
        .input("nguoiGiao", sql.NVarChar(100), data.NGUOI_GIAO)
        .input("tongSoLuongTheoChungTu", sql.Int, data.TONG_SO_LUONG_THEO_CHUNG_TU)
        .input("tongSoLuongThucNhap", sql.Int, data.TONG_SO_LUONG_THUC_NHAP)
        .input("tongTien", sql.Decimal(18, 2), data.TONG_TIEN)
        .input("trangThai", sql.NVarChar(30), data.TRANG_THAI || 'Đã nhập kho')
        .input("ghiChu", sql.NVarChar(255), data.GHI_CHU)
        .query(`
          INSERT INTO PhieuNhapKho (MA_PHIEU_NHAP_KHO, MA_BIEN_BAN_GIAO_NHAN, MA_KHO, NGAY_LAP, MA_THU_KHO, NGUOI_GIAO, TONG_SO_LUONG_THEO_CHUNG_TU, TONG_SO_LUONG_THUC_NHAP, TONG_TIEN, TRANG_THAI, GHI_CHU)
          VALUES (@maPhieu, @maBBGN, @maKho, @ngayLap, @maThuKho, @nguoiGiao, @tongSoLuongTheoChungTu, @tongSoLuongThucNhap, @tongTien, @trangThai, @ghiChu)
        `);

      // 2. Insert details & update stock/orders
      if (data.details && data.details.length > 0) {
        for (let i = 0; i < data.details.length; i++) {
          const detail = data.details[i];
          // Tự động tạo Lô hàng nếu chưa tồn tại
          if (detail.MA_LO_HANG) {
            const checkLoRequest = new sql.Request(transaction);
            const checkLo = await checkLoRequest
              .input("maLo", sql.Char(10), detail.MA_LO_HANG.trim())
              .query("SELECT MA_LO_HANG FROM LoHang WHERE MA_LO_HANG = @maLo");
            
            if (checkLo.recordset.length === 0) {
              const insertLoRequest = new sql.Request(transaction);
              await insertLoRequest
                .input("maLo", sql.Char(10), detail.MA_LO_HANG.trim())
                .input("maMatHang", sql.Char(10), detail.MA_MAT_HANG.trim())
                .input("ngayNhap", sql.DateTime, data.NGAY_LAP || new Date())
                .input("maPhieu", sql.Char(10), data.MA_PHIEU_NHAP_KHO.trim())
                .query(`
                  INSERT INTO LoHang (MA_LO_HANG, MA_MAT_HANG, NGAY_SAN_XUAT, HAN_SU_DUNG, NGAY_NHAP, MA_PHIEU_NHAP_KHO, TRANG_THAI_LO)
                  VALUES (@maLo, @maMatHang, DATEADD(month, -1, @ngayNhap), DATEADD(year, 1, @ngayNhap), @ngayNhap, @maPhieu, N'Bình thường')
                `);
            }
          }

          const requestDetail = new sql.Request(transaction);
          await requestDetail
            .input("maChiTiet", sql.Char(10), detail.MA_CHI_TIET_PNK)
            .input("maPhieu", sql.Char(10), data.MA_PHIEU_NHAP_KHO)
            .input("maMatHang", sql.Char(10), detail.MA_MAT_HANG)
            .input("maLoHang", sql.Char(10), detail.MA_LO_HANG)
            .input("maDonViTinh", sql.Char(10), detail.MA_DON_VI_TINH)
            .input("soLuongTheoChungTu", sql.Int, detail.SO_LUONG_THEO_CHUNG_TU)
            .input("soLuongThucNhap", sql.Int, detail.SO_LUONG_THUC_NHAP)
            .input("donGia", sql.Decimal(18, 2), detail.DON_GIA)
            .input("thanhTien", sql.Decimal(18, 2), detail.THANH_TIEN)
            .input("ghiChu", sql.NVarChar(255), detail.GHI_CHU)
            .query(`
              INSERT INTO ChiTietPhieuNhapKho (MA_CHI_TIET_PNK, MA_PHIEU_NHAP_KHO, MA_MAT_HANG, MA_LO_HANG, MA_DON_VI_TINH, SO_LUONG_THEO_CHUNG_TU, SO_LUONG_THUC_NHAP, DON_GIA, THANH_TIEN, GHI_CHU)
              VALUES (@maChiTiet, @maPhieu, @maMatHang, @maLoHang, @maDonViTinh, @soLuongTheoChungTu, @soLuongThucNhap, @donGia, @thanhTien, @ghiChu)
            `);




          // Nếu có đơn đặt hàng (PO) liên kết, ta cập nhật số lượng đã nhập vào ChiTietDonMuaHang
          if (data.MA_DON_MUA) {
            const requestUpdatePO = new sql.Request(transaction);
            await requestUpdatePO
              .input("maDonMua", sql.Char(10), data.MA_DON_MUA)
              .input("maMatHang", sql.Char(10), detail.MA_MAT_HANG)
              .input("soLuongNhap", sql.Int, detail.SO_LUONG_THUC_NHAP)
              .query(`
                UPDATE ChiTietDonMuaHang
                SET SO_LUONG_DA_NHAP = SO_LUONG_DA_NHAP + @soLuongNhap,
                    SO_LUONG_CON_CHO_NHAN = CASE 
                      WHEN SO_LUONG_CON_CHO_NHAN - @soLuongNhap < 0 THEN 0 
                      ELSE SO_LUONG_CON_CHO_NHAN - @soLuongNhap 
                    END
                WHERE MA_DON_MUA = @maDonMua AND MA_MAT_HANG = @maMatHang
              `);
          }
        }
      }

      await transaction.commit();
      return { message: "Tạo phiếu nhập kho thành công", maPhieuNhapKho: data.MA_PHIEU_NHAP_KHO };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};

module.exports = PhieuNhapKho;
