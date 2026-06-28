const sql = require("mssql");
const connectDB = require("../config/database");

const BienBanKiemNghiem = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM BienBanKiemNghiem");
    return result.recordset;
  },

  getByMa: async (maBienBanKiemNghiem) => {
    const pool = await connectDB();
    const masterResult = await pool.request()
      .input("maBienBanKiemNghiem", sql.Char(10), maBienBanKiemNghiem.trim())
      .query("SELECT * FROM BienBanKiemNghiem WHERE MA_BIEN_BAN_KIEM_NGHIEM = @maBienBanKiemNghiem");
    
    if (!masterResult.recordset[0]) return null;
    
    const detailResult = await pool.request()
      .input("maBienBanKiemNghiem", sql.Char(10), maBienBanKiemNghiem.trim())
      .query("SELECT * FROM ChiTietBienBanKiemNghiem WHERE MA_BIEN_BAN_KIEM_NGHIEM = @maBienBanKiemNghiem");
    
    return {
      ...masterResult.recordset[0],
      CHI_TIET: detailResult.recordset
    };
  },

  create: async (data) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      const requestMaster = new sql.Request(transaction);
      await requestMaster
        .input("maBienBanKiemNghiem", sql.Char(10), data.MA_BIEN_BAN_KIEM_NGHIEM.trim())
        .input("maBienBanGiaoNhan", sql.Char(10), data.MA_BIEN_BAN_GIAO_NHAN.trim())
        .input("ngayLap", sql.DateTime, data.NGAY_LAP)
        .input("maThuKho", sql.Char(10), data.MA_THU_KHO.trim())
        .input("nguoiKiemNghiem", sql.NVarChar(100), data.NGUOI_KIEM_NGHIEM || null)
        .input("ketLuan", sql.NVarChar(255), data.KET_LUAN || null)
        .input("trangThai", sql.NVarChar(30), data.TRANG_THAI)
        .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
        .query(`
          INSERT INTO BienBanKiemNghiem (MA_BIEN_BAN_KIEM_NGHIEM, MA_BIEN_BAN_GIAO_NHAN, NGAY_LAP, MA_THU_KHO, NGUOI_KIEM_NGHIEM, KET_LUAN, TRANG_THAI, GHI_CHU)
          VALUES (@maBienBanKiemNghiem, @maBienBanGiaoNhan, @ngayLap, @maThuKho, @nguoiKiemNghiem, @ketLuan, @trangThai, @ghiChu)
        `);

      if (data.CHI_TIET && Array.isArray(data.CHI_TIET)) {
        for (const item of data.CHI_TIET) {
          const requestDetail = new sql.Request(transaction);
          await requestDetail
            .input("maChiTietBbkn", sql.Char(10), item.MA_CHI_TIET_BBKN.trim())
            .input("maBienBanKiemNghiem", sql.Char(10), data.MA_BIEN_BAN_KIEM_NGHIEM.trim())
            .input("maChiTietBbgn", sql.Char(10), item.MA_CHI_TIET_BBGN.trim())
            .input("maMatHang", sql.Char(10), item.MA_MAT_HANG.trim())
            .input("phuongThucKiemNghiem", sql.NVarChar(100), item.PHUONG_THUC_KIEM_NGHIEM || null)
            .input("maDonViTinh", sql.Char(10), item.MA_DON_VI_TINH.trim())
            .input("soLuongTheoChungTu", sql.Int, item.SO_LUONG_THEO_CHUNG_TU || null)
            .input("soLuongKiemNghiem", sql.Int, item.SO_LUONG_KIEM_NGHIEM)
            .input("soLuongDat", sql.Int, item.SO_LUONG_DAT || 0)
            .input("soLuongKhongDat", sql.Int, item.SO_LUONG_KHONG_DAT || 0)
            .input("lyDoKhongDat", sql.NVarChar(255), item.LY_DO_KHONG_DAT || null)
            .input("ghiChu", sql.NVarChar(255), item.GHI_CHU || null)
            .query(`
              INSERT INTO ChiTietBienBanKiemNghiem (MA_CHI_TIET_BBKN, MA_BIEN_BAN_KIEM_NGHIEM, MA_CHI_TIET_BBGN, MA_MAT_HANG, PHUONG_THUC_KIEM_NGHIEM, MA_DON_VI_TINH, SO_LUONG_THEO_CHUNG_TU, SO_LUONG_KIEM_NGHIEM, SO_LUONG_DAT, SO_LUONG_KHONG_DAT, LY_DO_KHONG_DAT, GHI_CHU)
              VALUES (@maChiTietBbkn, @maBienBanKiemNghiem, @maChiTietBbgn, @maMatHang, @phuongThucKiemNghiem, @maDonViTinh, @soLuongTheoChungTu, @soLuongKiemNghiem, @soLuongDat, @soLuongKhongDat, @lyDoKhongDat, @ghiChu)
            `);
        }
      }
      await transaction.commit();
      return { message: "Thêm biên bản kiểm nghiệm thành công" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  update: async (maBienBanKiemNghiem, data) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      const requestMaster = new sql.Request(transaction);
      const result = await requestMaster
        .input("maBienBanKiemNghiem", sql.Char(10), maBienBanKiemNghiem.trim())
        .input("maBienBanGiaoNhan", sql.Char(10), data.MA_BIEN_BAN_GIAO_NHAN.trim())
        .input("ngayLap", sql.DateTime, data.NGAY_LAP)
        .input("maThuKho", sql.Char(10), data.MA_THU_KHO.trim())
        .input("nguoiKiemNghiem", sql.NVarChar(100), data.NGUOI_KIEM_NGHIEM || null)
        .input("ketLuan", sql.NVarChar(255), data.KET_LUAN || null)
        .input("trangThai", sql.NVarChar(30), data.TRANG_THAI)
        .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
        .query(`
          UPDATE BienBanKiemNghiem
          SET MA_BIEN_BAN_GIAO_NHAN = @maBienBanGiaoNhan, NGAY_LAP = @ngayLap, MA_THU_KHO = @maThuKho,
              NGUOI_KIEM_NGHIEM = @nguoiKiemNghiem, KET_LUAN = @ketLuan, TRANG_THAI = @trangThai, GHI_CHU = @ghiChu
          WHERE MA_BIEN_BAN_KIEM_NGHIEM = @maBienBanKiemNghiem
        `);

      if (data.CHI_TIET && Array.isArray(data.CHI_TIET)) {
        const deleteRequest = new sql.Request(transaction);
        await deleteRequest
          .input("maBienBanKiemNghiem", sql.Char(10), maBienBanKiemNghiem.trim())
          .query("DELETE FROM ChiTietBienBanKiemNghiem WHERE MA_BIEN_BAN_KIEM_NGHIEM = @maBienBanKiemNghiem");

        for (const item of data.CHI_TIET) {
          const requestDetail = new sql.Request(transaction);
          await requestDetail
            .input("maChiTietBbkn", sql.Char(10), item.MA_CHI_TIET_BBKN.trim())
            .input("maBienBanKiemNghiem", sql.Char(10), maBienBanKiemNghiem.trim())
            .input("maChiTietBbgn", sql.Char(10), item.MA_CHI_TIET_BBGN.trim())
            .input("maMatHang", sql.Char(10), item.MA_MAT_HANG.trim())
            .input("phuongThucKiemNghiem", sql.NVarChar(100), item.PHUONG_THUC_KIEM_NGHIEM || null)
            .input("maDonViTinh", sql.Char(10), item.MA_DON_VI_TINH.trim())
            .input("soLuongTheoChungTu", sql.Int, item.SO_LUONG_THEO_CHUNG_TU || null)
            .input("soLuongKiemNghiem", sql.Int, item.SO_LUONG_KIEM_NGHIEM)
            .input("soLuongDat", sql.Int, item.SO_LUONG_DAT || 0)
            .input("soLuongKhongDat", sql.Int, item.SO_LUONG_KHONG_DAT || 0)
            .input("lyDoKhongDat", sql.NVarChar(255), item.LY_DO_KHONG_DAT || null)
            .input("ghiChu", sql.NVarChar(255), item.GHI_CHU || null)
            .query(`
              INSERT INTO ChiTietBienBanKiemNghiem (MA_CHI_TIET_BBKN, MA_BIEN_BAN_KIEM_NGHIEM, MA_CHI_TIET_BBGN, MA_MAT_HANG, PHUONG_THUC_KIEM_NGHIEM, MA_DON_VI_TINH, SO_LUONG_THEO_CHUNG_TU, SO_LUONG_KIEM_NGHIEM, SO_LUONG_DAT, SO_LUONG_KHONG_DAT, LY_DO_KHONG_DAT, GHI_CHU)
              VALUES (@maChiTietBbkn, @maBienBanKiemNghiem, @maChiTietBbgn, @maMatHang, @phuongThucKiemNghiem, @maDonViTinh, @soLuongTheoChungTu, @soLuongKiemNghiem, @soLuongDat, @soLuongKhongDat, @lyDoKhongDat, @ghiChu)
            `);
        }
      }
      await transaction.commit();
      return { affectedRows: result.rowsAffected[0], message: "Cập nhật biên bản kiểm nghiệm thành công" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  delete: async (maBienBanKiemNghiem) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      const deleteDetails = new sql.Request(transaction);
      await deleteDetails
        .input("maBienBanKiemNghiem", sql.Char(10), maBienBanKiemNghiem.trim())
        .query("DELETE FROM ChiTietBienBanKiemNghiem WHERE MA_BIEN_BAN_KIEM_NGHIEM = @maBienBanKiemNghiem");

      const deleteMaster = new sql.Request(transaction);
      const result = await deleteMaster
        .input("maBienBanKiemNghiem", sql.Char(10), maBienBanKiemNghiem.trim())
        .query("DELETE FROM BienBanKiemNghiem WHERE MA_BIEN_BAN_KIEM_NGHIEM = @maBienBanKiemNghiem");

      await transaction.commit();
      return { affectedRows: result.rowsAffected[0], message: "Xóa biên bản kiểm nghiệm thành công" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

module.exports = BienBanKiemNghiem;