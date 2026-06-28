const sql = require("mssql");
const connectDB = require("../config/database");

const BienBanGiaoNhan = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM BienBanGiaoNhan");
    return result.recordset;
  },

  getByMa: async (maBienBanGiaoNhan) => {
    const pool = await connectDB();
    const masterResult = await pool.request()
      .input("maBienBanGiaoNhan", sql.Char(10), maBienBanGiaoNhan.trim())
      .query("SELECT * FROM BienBanGiaoNhan WHERE MA_BIEN_BAN_GIAO_NHAN = @maBienBanGiaoNhan");
    
    if (!masterResult.recordset[0]) return null;
    
    const detailResult = await pool.request()
      .input("maBienBanGiaoNhan", sql.Char(10), maBienBanGiaoNhan.trim())
      .query("SELECT * FROM ChiTietBienBanGiaoNhan WHERE MA_BIEN_BAN_GIAO_NHAN = @maBienBanGiaoNhan");
    
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
        .input("maBienBanGiaoNhan", sql.Char(10), data.MA_BIEN_BAN_GIAO_NHAN.trim())
        .input("maDonMua", sql.Char(10), data.MA_DON_MUA.trim())
        .input("maChungTuGiao", sql.Char(10), data.MA_CHUNG_TU_GIAO ? data.MA_CHUNG_TU_GIAO.trim() : null)
        .input("ngayLap", sql.DateTime, data.NGAY_LAP)
        .input("maThuKho", sql.Char(10), data.MA_THU_KHO.trim())
        .input("nguoiGiao", sql.NVarChar(100), data.NGUOI_GIAO || null)
        .input("diaDiemGiaoNhan", sql.NVarChar(255), data.DIA_DIEM_GIAO_NHAN || null)
        .input("tongSoLuongTheoChungTu", sql.Int, data.TONG_SO_LUONG_THEO_CHUNG_TU || null)
        .input("tongSoLuongThucNhan", sql.Int, data.TONG_SO_LUONG_THUC_NHAN || null)
        .input("tongSoLuongDat", sql.Int, data.TONG_SO_LUONG_DAT || null)
        .input("tongSoLuongKhongDat", sql.Int, data.TONG_SO_LUONG_KHONG_DAT || null)
        .input("trangThai", sql.NVarChar(30), data.TRANG_THAI)
        .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
        .query(`
          INSERT INTO BienBanGiaoNhan (MA_BIEN_BAN_GIAO_NHAN, MA_DON_MUA, MA_CHUNG_TU_GIAO, NGAY_LAP, MA_THU_KHO, NGUOI_GIAO, DIA_DIEM_GIAO_NHAN, TONG_SO_LUONG_THEO_CHUNG_TU, TONG_SO_LUONG_THUC_NHAN, TONG_SO_LUONG_DAT, TONG_SO_LUONG_KHONG_DAT, TRANG_THAI, GHI_CHU)
          VALUES (@maBienBanGiaoNhan, @maDonMua, @maChungTuGiao, @ngayLap, @maThuKho, @nguoiGiao, @diaDiemGiaoNhan, @tongSoLuongTheoChungTu, @tongSoLuongThucNhan, @tongSoLuongDat, @tongSoLuongKhongDat, @trangThai, @ghiChu)
        `);

      if (data.CHI_TIET && Array.isArray(data.CHI_TIET)) {
        for (const item of data.CHI_TIET) {
          const requestDetail = new sql.Request(transaction);
          await requestDetail
            .input("maChiTietBbgn", sql.Char(10), item.MA_CHI_TIET_BBGN.trim())
            .input("maBienBanGiaoNhan", sql.Char(10), data.MA_BIEN_BAN_GIAO_NHAN.trim())
            .input("maMatHang", sql.Char(10), item.MA_MAT_HANG.trim())
            .input("maLoHang", sql.Char(10), item.MA_LO_HANG ? item.MA_LO_HANG.trim() : null)
            .input("maDonViTinh", sql.Char(10), item.MA_DON_VI_TINH.trim())
            .input("soLuongTheoChungTu", sql.Int, item.SO_LUONG_THEO_CHUNG_TU)
            .input("soLuongThucNhan", sql.Int, item.SO_LUONG_THUC_NHAN)
            .input("soLuongDat", sql.Int, item.SO_LUONG_DAT || 0)
            .input("soLuongKhongDat", sql.Int, item.SO_LUONG_KHONG_DAT || 0)
            .input("tinhTrangHang", sql.NVarChar(100), item.TINH_TRANG_HANG || null)
            .input("canKiemNghiem", sql.Bit, item.CAN_KIEM_NGHIEM || 0)
            .input("ghiChu", sql.NVarChar(255), item.GHI_CHU || null)
            .query(`
              INSERT INTO ChiTietBienBanGiaoNhan (MA_CHI_TIET_BBGN, MA_BIEN_BAN_GIAO_NHAN, MA_MAT_HANG, MA_LO_HANG, MA_DON_VI_TINH, SO_LUONG_THEO_CHUNG_TU, SO_LUONG_THUC_NHAN, SO_LUONG_DAT, SO_LUONG_KHONG_DAT, TINH_TRANG_HANG, CAN_KIEM_NGHIEM, GHI_CHU)
              VALUES (@maChiTietBbgn, @maBienBanGiaoNhan, @maMatHang, @maLoHang, @maDonViTinh, @soLuongTheoChungTu, @soLuongThucNhan, @soLuongDat, @soLuongKhongDat, @tinhTrangHang, @canKiemNghiem, @ghiChu)
            `);
        }
      }
      await transaction.commit();
      return { message: "Thêm biên bản giao nhận thành công" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  update: async (maBienBanGiaoNhan, data) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      const requestMaster = new sql.Request(transaction);
      const result = await requestMaster
        .input("maBienBanGiaoNhan", sql.Char(10), maBienBanGiaoNhan.trim())
        .input("maDonMua", sql.Char(10), data.MA_DON_MUA.trim())
        .input("maChungTuGiao", sql.Char(10), data.MA_CHUNG_TU_GIAO ? data.MA_CHUNG_TU_GIAO.trim() : null)
        .input("ngayLap", sql.DateTime, data.NGAY_LAP)
        .input("maThuKho", sql.Char(10), data.MA_THU_KHO.trim())
        .input("nguoiGiao", sql.NVarChar(100), data.NGUOI_GIAO || null)
        .input("diaDiemGiaoNhan", sql.NVarChar(255), data.DIA_DIEM_GIAO_NHAN || null)
        .input("tongSoLuongTheoChungTu", sql.Int, data.TONG_SO_LUONG_THEO_CHUNG_TU || null)
        .input("tongSoLuongThucNhan", sql.Int, data.TONG_SO_LUONG_THUC_NHAN || null)
        .input("tongSoLuongDat", sql.Int, data.TONG_SO_LUONG_DAT || null)
        .input("tongSoLuongKhongDat", sql.Int, data.TONG_SO_LUONG_KHONG_DAT || null)
        .input("trangThai", sql.NVarChar(30), data.TRANG_THAI)
        .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
        .query(`
          UPDATE BienBanGiaoNhan
          SET MA_DON_MUA = @maDonMua, MA_CHUNG_TU_GIAO = @maChungTuGiao, NGAY_LAP = @ngayLap, MA_THU_KHO = @maThuKho,
              NGUOI_GIAO = @nguoiGiao, DIA_DIEM_GIAO_NHAN = @diaDiemGiaoNhan, TONG_SO_LUONG_THEO_CHUNG_TU = @tongSoLuongTheoChungTu,
              TONG_SO_LUONG_THUC_NHAN = @tongSoLuongThucNhan, TONG_SO_LUONG_DAT = @tongSoLuongDat,
              TONG_SO_LUONG_KHONG_DAT = @tongSoLuongKhongDat, TRANG_THAI = @trangThai, GHI_CHU = @ghiChu
          WHERE MA_BIEN_BAN_GIAO_NHAN = @maBienBanGiaoNhan
        `);

      if (data.CHI_TIET && Array.isArray(data.CHI_TIET)) {
        const deleteRequest = new sql.Request(transaction);
        await deleteRequest
          .input("maBienBanGiaoNhan", sql.Char(10), maBienBanGiaoNhan.trim())
          .query("DELETE FROM ChiTietBienBanGiaoNhan WHERE MA_BIEN_BAN_GIAO_NHAN = @maBienBanGiaoNhan");

        for (const item of data.CHI_TIET) {
          const requestDetail = new sql.Request(transaction);
          await requestDetail
            .input("maChiTietBbgn", sql.Char(10), item.MA_CHI_TIET_BBGN.trim())
            .input("maBienBanGiaoNhan", sql.Char(10), maBienBanGiaoNhan.trim())
            .input("maMatHang", sql.Char(10), item.MA_MAT_HANG.trim())
            .input("maLoHang", sql.Char(10), item.MA_LO_HANG ? item.MA_LO_HANG.trim() : null)
            .input("maDonViTinh", sql.Char(10), item.MA_DON_VI_TINH.trim())
            .input("soLuongTheoChungTu", sql.Int, item.SO_LUONG_THEO_CHUNG_TU)
            .input("soLuongThucNhan", sql.Int, item.SO_LUONG_THUC_NHAN)
            .input("soLuongDat", sql.Int, item.SO_LUONG_DAT || 0)
            .input("soLuongKhongDat", sql.Int, item.SO_LUONG_KHONG_DAT || 0)
            .input("tinhTrangHang", sql.NVarChar(100), item.TINH_TRANG_HANG || null)
            .input("canKiemNghiem", sql.Bit, item.CAN_KIEM_NGHIEM || 0)
            .input("ghiChu", sql.NVarChar(255), item.GHI_CHU || null)
            .query(`
              INSERT INTO ChiTietBienBanGiaoNhan (MA_CHI_TIET_BBGN, MA_BIEN_BAN_GIAO_NHAN, MA_MAT_HANG, MA_LO_HANG, MA_DON_VI_TINH, SO_LUONG_THEO_CHUNG_TU, SO_LUONG_THUC_NHAN, SO_LUONG_DAT, SO_LUONG_KHONG_DAT, TINH_TRANG_HANG, CAN_KIEM_NGHIEM, GHI_CHU)
              VALUES (@maChiTietBbgn, @maBienBanGiaoNhan, @maMatHang, @maLoHang, @maDonViTinh, @soLuongTheoChungTu, @soLuongThucNhan, @soLuongDat, @soLuongKhongDat, @tinhTrangHang, @canKiemNghiem, @ghiChu)
            `);
        }
      }
      await transaction.commit();
      return { affectedRows: result.rowsAffected[0], message: "Cập nhật biên bản giao nhận thành công" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  delete: async (maBienBanGiaoNhan) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      const deleteDetails = new sql.Request(transaction);
      await deleteDetails
        .input("maBienBanGiaoNhan", sql.Char(10), maBienBanGiaoNhan.trim())
        .query("DELETE FROM ChiTietBienBanGiaoNhan WHERE MA_BIEN_BAN_GIAO_NHAN = @maBienBanGiaoNhan");

      const deleteMaster = new sql.Request(transaction);
      const result = await deleteMaster
        .input("maBienBanGiaoNhan", sql.Char(10), maBienBanGiaoNhan.trim())
        .query("DELETE FROM BienBanGiaoNhan WHERE MA_BIEN_BAN_GIAO_NHAN = @maBienBanGiaoNhan");

      await transaction.commit();
      return { affectedRows: result.rowsAffected[0], message: "Xóa biên bản giao nhận thành công" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

module.exports = BienBanGiaoNhan;