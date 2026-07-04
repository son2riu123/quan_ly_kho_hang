const sql = require("mssql");
const connectDB = require("../config/database");

const PhieuKiemKeXacMinh = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT p.*, nv.HO_TEN AS TEN_NGUOI_KIEM_KE
      FROM PhieuKiemKeXacMinh p
      LEFT JOIN NhanVien nv ON p.NGUOI_KIEM_KE = nv.MA_NHAN_VIEN
    `);
    return result.recordset;
  },

  getByMa: async (maPhieu) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maPhieu", sql.Char(10), maPhieu)
      .query(`
        SELECT p.*, nv.HO_TEN AS TEN_NGUOI_KIEM_KE
        FROM PhieuKiemKeXacMinh p
        LEFT JOIN NhanVien nv ON p.NGUOI_KIEM_KE = nv.MA_NHAN_VIEN
        WHERE p.MA_PHIEU_KKXM = @maPhieu
      `);
    return result.recordset[0];
  },


  getByMaWithChiTiet: async (maPhieu) => {
    const pool = await connectDB();
    const phieuResult = await pool.request()
      .input("maPhieu", sql.Char(10), maPhieu)
      .query(`
        SELECT p.*, nv.HO_TEN AS TEN_NGUOI_KIEM_KE
        FROM PhieuKiemKeXacMinh p
        LEFT JOIN NhanVien nv ON p.NGUOI_KIEM_KE = nv.MA_NHAN_VIEN
        WHERE p.MA_PHIEU_KKXM = @maPhieu
      `);
    const chiTietResult = await pool.request()
      .input("maPhieu", sql.Char(10), maPhieu)
      .query(`
        SELECT ct.*, mh.TEN_MAT_HANG, vt.KHU, vt.DAY, vt.KE, vt.TANG, vt.O
        FROM ChiTietPhieuKiemKeXacMinh ct
        LEFT JOIN MatHang mh ON ct.MA_MAT_HANG = mh.MA_MAT_HANG
        LEFT JOIN ViTriKho vt ON ct.MA_VI_TRI = vt.MA_VI_TRI
        WHERE ct.MA_PHIEU_KKXM = @maPhieu
      `);
    const phieu = phieuResult.recordset[0];
    if (phieu) phieu.CHI_TIET = chiTietResult.recordset;
    return phieu;
  },

  getByHoSo: async (maHoSo) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maHoSo", sql.Char(10), maHoSo)
      .query(`
        SELECT p.*, nv.HO_TEN AS TEN_NGUOI_KIEM_KE
        FROM PhieuKiemKeXacMinh p
        LEFT JOIN NhanVien nv ON p.NGUOI_KIEM_KE = nv.MA_NHAN_VIEN
        WHERE p.MA_HO_SO = @maHoSo
      `);
    return result.recordset;
  },


  create: async (data) => {

    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

  
      await new sql.Request(transaction)
        .input("maPhieu", sql.Char(10), data.MA_PHIEU_KKXM)
        .input("maHoSo", sql.Char(10), data.MA_HO_SO)
        .input("nguoiKiemKe", sql.Char(10), data.NGUOI_KIEM_KE)
        .input("thoiDiemKiemKe", sql.DateTime2, data.THOI_DIEM_KIEM_KE || new Date())
        .input("phamViKiemKe", sql.NVarChar(100), data.PHAM_VI_KIEM_KE)
        .input("ketQuaKiemKe", sql.NVarChar(255), data.KET_QUA_KIEM_KE)
        .input("trangThaiPhieu", sql.NVarChar(30), data.TRANG_THAI_PHIEU)
        .input("ghiChu", sql.NVarChar(255), data.GHI_CHU)
        .query(`
          INSERT INTO PhieuKiemKeXacMinh
            (MA_PHIEU_KKXM, MA_HO_SO, NGUOI_KIEM_KE, THOI_DIEM_KIEM_KE,
             PHAM_VI_KIEM_KE, KET_QUA_KIEM_KE, TRANG_THAI_PHIEU, GHI_CHU)
          VALUES
            (@maPhieu, @maHoSo, @nguoiKiemKe, @thoiDiemKiemKe,
             @phamViKiemKe, @ketQuaKiemKe, @trangThaiPhieu, @ghiChu)
        `);


      const chiTiet = data.CHI_TIET || [];
      for (const ct of chiTiet) {
        await new sql.Request(transaction)
          .input("maChiTiet", sql.Char(10), ct.MA_CHI_TIET_KKXM)
          .input("maPhieu", sql.Char(10), data.MA_PHIEU_KKXM)
          .input("maMatHang", sql.Char(10), ct.MA_MAT_HANG)
          .input("maLoHang", sql.Char(10), ct.MA_LO_HANG)
          .input("maViTri", sql.Char(10), ct.MA_VI_TRI)
          .input("soLuongThucTe", sql.Int, ct.SO_LUONG_THUC_TE)
          .input("tinhTrangHang", sql.NVarChar(100), ct.TINH_TRANG_HANG)
          .input("ghiChu", sql.NVarChar(255), ct.GHI_CHU)
          .query(`
            INSERT INTO ChiTietPhieuKiemKeXacMinh
              (MA_CHI_TIET_KKXM, MA_PHIEU_KKXM, MA_MAT_HANG, MA_LO_HANG,
               MA_VI_TRI, SO_LUONG_THUC_TE, TINH_TRANG_HANG, GHI_CHU)
            VALUES
              (@maChiTiet, @maPhieu, @maMatHang, @maLoHang,
               @maViTri, @soLuongThucTe, @tinhTrangHang, @ghiChu)
          `);
      }

      await transaction.commit();
      return { message: "Thêm phiếu kiểm kê xác minh thành công" };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  // Cập nhật phiếu + xóa chi tiết cũ rồi insert lại trong cùng transaction
  update: async (maPhieu, data) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      // 1. Cập nhật header phiếu
      await new sql.Request(transaction)
        .input("maPhieu", sql.Char(10), maPhieu)
        .input("ketQuaKiemKe", sql.NVarChar(255), data.KET_QUA_KIEM_KE)
        .input("trangThaiPhieu", sql.NVarChar(30), data.TRANG_THAI_PHIEU)
        .input("ghiChu", sql.NVarChar(255), data.GHI_CHU)
        .query(`
          UPDATE PhieuKiemKeXacMinh
          SET KET_QUA_KIEM_KE = @ketQuaKiemKe,
              TRANG_THAI_PHIEU = @trangThaiPhieu,
              GHI_CHU           = @ghiChu
          WHERE MA_PHIEU_KKXM = @maPhieu
        `);

      // 2. Xóa toàn bộ chi tiết cũ
      await new sql.Request(transaction)
        .input("maPhieu", sql.Char(10), maPhieu)
        .query("DELETE FROM ChiTietPhieuKiemKeXacMinh WHERE MA_PHIEU_KKXM = @maPhieu");

      // 3. Insert lại chi tiết mới
      const chiTiet = data.CHI_TIET || [];
      for (const ct of chiTiet) {
        await new sql.Request(transaction)
          .input("maChiTiet", sql.Char(10), ct.MA_CHI_TIET_KKXM)
          .input("maPhieu", sql.Char(10), maPhieu)
          .input("maMatHang", sql.Char(10), ct.MA_MAT_HANG)
          .input("maLoHang", sql.Char(10), ct.MA_LO_HANG)
          .input("maViTri", sql.Char(10), ct.MA_VI_TRI)
          .input("soLuongThucTe", sql.Int, ct.SO_LUONG_THUC_TE)
          .input("tinhTrangHang", sql.NVarChar(100), ct.TINH_TRANG_HANG)
          .input("ghiChu", sql.NVarChar(255), ct.GHI_CHU)
          .query(`
            INSERT INTO ChiTietPhieuKiemKeXacMinh
              (MA_CHI_TIET_KKXM, MA_PHIEU_KKXM, MA_MAT_HANG, MA_LO_HANG,
               MA_VI_TRI, SO_LUONG_THUC_TE, TINH_TRANG_HANG, GHI_CHU)
            VALUES
              (@maChiTiet, @maPhieu, @maMatHang, @maLoHang,
               @maViTri, @soLuongThucTe, @tinhTrangHang, @ghiChu)
          `);
      }

      await transaction.commit();
      return { message: "Cập nhật phiếu kiểm kê xác minh thành công" };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },


  delete: async (maPhieu) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      // Xóa chi tiết trước (FK constraint)
      await new sql.Request(transaction)
        .input("maPhieu", sql.Char(10), maPhieu)
        .query("DELETE FROM ChiTietPhieuKiemKeXacMinh WHERE MA_PHIEU_KKXM = @maPhieu");

      // Xóa phiếu header
      await new sql.Request(transaction)
        .input("maPhieu", sql.Char(10), maPhieu)
        .query("DELETE FROM PhieuKiemKeXacMinh WHERE MA_PHIEU_KKXM = @maPhieu");

      await transaction.commit();
      return { message: "Xóa phiếu kiểm kê xác minh thành công" };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};

module.exports = PhieuKiemKeXacMinh;