const sql = require("mssql");
const connectDB = require("../config/database");

const ChungTuGiaoHang = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM ChungTuGiaoHang");
    return result.recordset;
  },

  getByMa: async (maChungTuGiao) => {
    const pool = await connectDB();
    const masterResult = await pool.request()
      .input("maChungTuGiao", sql.Char(10), maChungTuGiao.trim())
      .query("SELECT * FROM ChungTuGiaoHang WHERE MA_CHUNG_TU_GIAO = @maChungTuGiao");
    
    if (!masterResult.recordset[0]) return null;
    
    const detailResult = await pool.request()
      .input("maChungTuGiao", sql.Char(10), maChungTuGiao.trim())
      .query("SELECT * FROM ChiTietChungTuGiaoHang WHERE MA_CHUNG_TU_GIAO = @maChungTuGiao");
    
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
        .input("maChungTuGiao", sql.Char(10), data.MA_CHUNG_TU_GIAO.trim())
        .input("soChungTuBenGiao", sql.NVarChar(50), data.SO_CHUNG_TU_BEN_GIAO)
        .input("maDonMua", sql.Char(10), data.MA_DON_MUA.trim())
        .input("ngayGiao", sql.Date, data.NGAY_GIAO)
        .input("nguoiGiao", sql.NVarChar(100), data.NGUOI_GIAO || null)
        .input("soDienThoaiNguoiGiao", sql.VarChar(15), data.SO_DIEN_THOAI_NGUOI_GIAO || null)
        .input("fileChungTu", sql.NVarChar(255), data.FILE_CHUNG_TU || null)
        .input("trangThai", sql.NVarChar(30), data.TRANG_THAI)
        .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
        .query(`
          INSERT INTO ChungTuGiaoHang (MA_CHUNG_TU_GIAO, SO_CHUNG_TU_BEN_GIAO, MA_DON_MUA, NGAY_GIAO, NGUOI_GIAO, SO_DIEN_THOAI_NGUOI_GIAO, FILE_CHUNG_TU, TRANG_THAI, GHI_CHU)
          VALUES (@maChungTuGiao, @soChungTuBenGiao, @maDonMua, @ngayGiao, @nguoiGiao, @soDienThoaiNguoiGiao, @fileChungTu, @trangThai, @ghiChu)
        `);

      if (data.CHI_TIET && Array.isArray(data.CHI_TIET)) {
        for (const item of data.CHI_TIET) {
          const requestDetail = new sql.Request(transaction);
          await requestDetail
            .input("maChiTietChungTu", sql.Char(10), item.MA_CHI_TIET_CHUNG_TU.trim())
            .input("maChungTuGiao", sql.Char(10), data.MA_CHUNG_TU_GIAO.trim())
            .input("maMatHang", sql.Char(10), item.MA_MAT_HANG.trim())
            .input("maDonViTinh", sql.Char(10), item.MA_DON_VI_TINH.trim())
            .input("soLuongTheoChungTu", sql.Int, item.SO_LUONG_THEO_CHUNG_TU)
            .input("donGia", sql.Decimal(18, 2), item.DON_GIA || null)
            .input("thanhTien", sql.Decimal(18, 2), item.THANH_TIEN || null)
            .input("ghiChu", sql.NVarChar(255), item.GHI_CHU || null)
            .query(`
              INSERT INTO ChiTietChungTuGiaoHang (MA_CHI_TIET_CHUNG_TU, MA_CHUNG_TU_GIAO, MA_MAT_HANG, MA_DON_VI_TINH, SO_LUONG_THEO_CHUNG_TU, DON_GIA, THANH_TIEN, GHI_CHU)
              VALUES (@maChiTietChungTu, @maChungTuGiao, @maMatHang, @maDonViTinh, @soLuongTheoChungTu, @donGia, @thanhTien, @ghiChu)
            `);
        }
      }
      await transaction.commit();
      return { message: "Thêm chứng từ giao hàng thành công" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  update: async (maChungTuGiao, data) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      const requestMaster = new sql.Request(transaction);
      const result = await requestMaster
        .input("maChungTuGiao", sql.Char(10), maChungTuGiao.trim())
        .input("soChungTuBenGiao", sql.NVarChar(50), data.SO_CHUNG_TU_BEN_GIAO)
        .input("maDonMua", sql.Char(10), data.MA_DON_MUA.trim())
        .input("ngayGiao", sql.Date, data.NGAY_GIAO)
        .input("nguoiGiao", sql.NVarChar(100), data.NGUOI_GIAO || null)
        .input("soDienThoaiNguoiGiao", sql.VarChar(15), data.SO_DIEN_THOAI_NGUOI_GIAO || null)
        .input("fileChungTu", sql.NVarChar(255), data.FILE_CHUNG_TU || null)
        .input("trangThai", sql.NVarChar(30), data.TRANG_THAI)
        .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
        .query(`
          UPDATE ChungTuGiaoHang
          SET SO_CHUNG_TU_BEN_GIAO = @soChungTuBenGiao, MA_DON_MUA = @maDonMua, NGAY_GIAO = @ngayGiao,
              NGUOI_GIAO = @nguoiGiao, SO_DIEN_THOAI_NGUOI_GIAO = @soDienThoaiNguoiGiao,
              FILE_CHUNG_TU = @fileChungTu, TRANG_THAI = @trangThai, GHI_CHU = @ghiChu
          WHERE MA_CHUNG_TU_GIAO = @maChungTuGiao
        `);

      if (data.CHI_TIET && Array.isArray(data.CHI_TIET)) {
        const deleteRequest = new sql.Request(transaction);
        await deleteRequest
          .input("maChungTuGiao", sql.Char(10), maChungTuGiao.trim())
          .query("DELETE FROM ChiTietChungTuGiaoHang WHERE MA_CHUNG_TU_GIAO = @maChungTuGiao");

        for (const item of data.CHI_TIET) {
          const requestDetail = new sql.Request(transaction);
          await requestDetail
            .input("maChiTietChungTu", sql.Char(10), item.MA_CHI_TIET_CHUNG_TU.trim())
            .input("maChungTuGiao", sql.Char(10), maChungTuGiao.trim())
            .input("maMatHang", sql.Char(10), item.MA_MAT_HANG.trim())
            .input("maDonViTinh", sql.Char(10), item.MA_DON_VI_TINH.trim())
            .input("soLuongTheoChungTu", sql.Int, item.SO_LUONG_THEO_CHUNG_TU)
            .input("donGia", sql.Decimal(18, 2), item.DON_GIA || null)
            .input("thanhTien", sql.Decimal(18, 2), item.THANH_TIEN || null)
            .input("ghiChu", sql.NVarChar(255), item.GHI_CHU || null)
            .query(`
              INSERT INTO ChiTietChungTuGiaoHang (MA_CHI_TIET_CHUNG_TU, MA_CHUNG_TU_GIAO, MA_MAT_HANG, MA_DON_VI_TINH, SO_LUONG_THEO_CHUNG_TU, DON_GIA, THANH_TIEN, GHI_CHU)
              VALUES (@maChiTietChungTu, @maChungTuGiao, @maMatHang, @maDonViTinh, @soLuongTheoChungTu, @donGia, @thanhTien, @ghiChu)
            `);
        }
      }
      await transaction.commit();
      return { affectedRows: result.rowsAffected[0], message: "Cập nhật chứng từ giao hàng thành công" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  delete: async (maChungTuGiao) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      const deleteDetails = new sql.Request(transaction);
      await deleteDetails
        .input("maChungTuGiao", sql.Char(10), maChungTuGiao.trim())
        .query("DELETE FROM ChiTietChungTuGiaoHang WHERE MA_CHUNG_TU_GIAO = @maChungTuGiao");

      const deleteMaster = new sql.Request(transaction);
      const result = await deleteMaster
        .input("maChungTuGiao", sql.Char(10), maChungTuGiao.trim())
        .query("DELETE FROM ChungTuGiaoHang WHERE MA_CHUNG_TU_GIAO = @maChungTuGiao");

      await transaction.commit();
      return { affectedRows: result.rowsAffected[0], message: "Xóa chứng từ giao hàng thành công" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

module.exports = ChungTuGiaoHang;