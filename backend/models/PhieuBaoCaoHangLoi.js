const sql = require("mssql");
const connectDB = require("../config/database");

const PhieuBaoCaoHangLoi = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM PhieuBaoCaoHangLoi");
    return result.recordset;
  },

  getByMa: async (maPhieu) => {
    const pool = await connectDB();
    const masterResult = await pool.request()
      .input("maPhieu", sql.Char(10), maPhieu.trim())
      .query("SELECT * FROM PhieuBaoCaoHangLoi WHERE MA_PHIEU_BAO_CAO = @maPhieu");
    
    if (!masterResult.recordset[0]) return null;
    
    const detailResult = await pool.request()
      .input("maPhieu", sql.Char(10), maPhieu.trim())
      .query("SELECT * FROM ChiTietPhieuBaoCaoHangLoi WHERE MA_PHIEU_BAO_CAO = @maPhieu");
    
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
        .input("maPhieu", sql.Char(10), data.MA_PHIEU_BAO_CAO.trim())
        .input("nguoiLap", sql.Char(10), data.NGUOI_LAP.trim())
        .input("thoiDiemLap", sql.DateTime2, data.THOI_DIEM_LAP)
        .input("nguonPhatHien", sql.NVarChar(50), data.NGUON_PHAT_HIEN)
        .input("moTaChung", sql.NVarChar(255), data.MO_TA_CHUNG || null)
        .input("trangThaiPhieu", sql.NVarChar(30), data.TRANG_THAI_PHIEU)
        .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
        .query(`
          INSERT INTO PhieuBaoCaoHangLoi (MA_PHIEU_BAO_CAO, NGUOI_LAP, THOI_DIEM_LAP, NGUON_PHAT_HIEN, MO_TA_CHUNG, TRANG_THAI_PHIEU, GHI_CHU)
          VALUES (@maPhieu, @nguoiLap, @thoiDiemLap, @nguonPhatHien, @moTaChung, @trangThaiPhieu, @ghiChu)
        `);

      if (data.CHI_TIET && Array.isArray(data.CHI_TIET)) {
        for (const item of data.CHI_TIET) {
          const requestDetail = new sql.Request(transaction);
          await requestDetail
            .input("maChiTiet", sql.Char(10), item.MA_CHI_TIET_PHIEU.trim())
            .input("maPhieu", sql.Char(10), data.MA_PHIEU_BAO_CAO.trim())
            .input("maMatHang", sql.Char(10), item.MA_MAT_HANG.trim())
            .input("maLoHang", sql.Char(10), item.MA_LO_HANG ? item.MA_LO_HANG.trim() : null)
            .input("maViTri", sql.Char(10), item.MA_VI_TRI.trim())
            .input("soLuong", sql.Int, item.SO_LUONG_BAO_CAO)
            .input("loaiVanDe", sql.NVarChar(50), item.LOAI_VAN_DE)
            .input("tinhTrang", sql.NVarChar(100), item.TINH_TRANG_HANG || null)
            .input("moTa", sql.NVarChar(255), item.MO_TA_CHI_TIET || null)
            .input("minhChung", sql.NVarChar(255), item.MINH_CHUNG || null)
            .query(`
              INSERT INTO ChiTietPhieuBaoCaoHangLoi (MA_CHI_TIET_PHIEU, MA_PHIEU_BAO_CAO, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, SO_LUONG_BAO_CAO, LOAI_VAN_DE, TINH_TRANG_HANG, MO_TA_CHI_TIET, MINH_CHUNG)
              VALUES (@maChiTiet, @maPhieu, @maMatHang, @maLoHang, @maViTri, @soLuong, @loaiVanDe, @tinhTrang, @moTa, @minhChung)
            `);
        }
      }
      await transaction.commit();
      return { message: "Thêm phiếu báo cáo hàng lỗi thành công" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  update: async (maPhieu, data) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      const requestMaster = new sql.Request(transaction);
      const result = await requestMaster
        .input("maPhieu", sql.Char(10), maPhieu.trim())
        .input("nguoiLap", sql.Char(10), data.NGUOI_LAP.trim())
        .input("thoiDiemLap", sql.DateTime2, data.THOI_DIEM_LAP)
        .input("nguonPhatHien", sql.NVarChar(50), data.NGUON_PHAT_HIEN)
        .input("moTaChung", sql.NVarChar(255), data.MO_TA_CHUNG || null)
        .input("trangThaiPhieu", sql.NVarChar(30), data.TRANG_THAI_PHIEU)
        .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
        .query(`
          UPDATE PhieuBaoCaoHangLoi
          SET NGUOI_LAP = @nguoiLap, THOI_DIEM_LAP = @thoiDiemLap, NGUON_PHAT_HIEN = @nguonPhatHien,
              MO_TA_CHUNG = @moTaChung, TRANG_THAI_PHIEU = @trangThaiPhieu, GHI_CHU = @ghiChu
          WHERE MA_PHIEU_BAO_CAO = @maPhieu
        `);

      if (data.CHI_TIET && Array.isArray(data.CHI_TIET)) {
        const deleteRequest = new sql.Request(transaction);
        await deleteRequest
          .input("maPhieu", sql.Char(10), maPhieu.trim())
          .query("DELETE FROM ChiTietPhieuBaoCaoHangLoi WHERE MA_PHIEU_BAO_CAO = @maPhieu");

        for (const item of data.CHI_TIET) {
          const requestDetail = new sql.Request(transaction);
          await requestDetail
            .input("maChiTiet", sql.Char(10), item.MA_CHI_TIET_PHIEU.trim())
            .input("maPhieu", sql.Char(10), maPhieu.trim())
            .input("maMatHang", sql.Char(10), item.MA_MAT_HANG.trim())
            .input("maLoHang", sql.Char(10), item.MA_LO_HANG ? item.MA_LO_HANG.trim() : null)
            .input("maViTri", sql.Char(10), item.MA_VI_TRI.trim())
            .input("soLuong", sql.Int, item.SO_LUONG_BAO_CAO)
            .input("loaiVanDe", sql.NVarChar(50), item.LOAI_VAN_DE)
            .input("tinhTrang", sql.NVarChar(100), item.TINH_TRANG_HANG || null)
            .input("moTa", sql.NVarChar(255), item.MO_TA_CHI_TIET || null)
            .input("minhChung", sql.NVarChar(255), item.MINH_CHUNG || null)
            .query(`
              INSERT INTO ChiTietPhieuBaoCaoHangLoi (MA_CHI_TIET_PHIEU, MA_PHIEU_BAO_CAO, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, SO_LUONG_BAO_CAO, LOAI_VAN_DE, TINH_TRANG_HANG, MO_TA_CHI_TIET, MINH_CHUNG)
              VALUES (@maChiTiet, @maPhieu, @maMatHang, @maLoHang, @maViTri, @soLuong, @loaiVanDe, @tinhTrang, @moTa, @minhChung)
            `);
        }
      }
      await transaction.commit();
      return { affectedRows: result.rowsAffected[0], message: "Cập nhật phiếu báo cáo thành công" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  delete: async (maPhieu) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      const deleteDetails = new sql.Request(transaction);
      await deleteDetails
        .input("maPhieu", sql.Char(10), maPhieu.trim())
        .query("DELETE FROM ChiTietPhieuBaoCaoHangLoi WHERE MA_PHIEU_BAO_CAO = @maPhieu");

      const deleteMaster = new sql.Request(transaction);
      const result = await deleteMaster
        .input("maPhieu", sql.Char(10), maPhieu.trim())
        .query("DELETE FROM PhieuBaoCaoHangLoi WHERE MA_PHIEU_BAO_CAO = @maPhieu");

      await transaction.commit();
      return { affectedRows: result.rowsAffected[0], message: "Xóa phiếu báo cáo thành công" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

module.exports = PhieuBaoCaoHangLoi;