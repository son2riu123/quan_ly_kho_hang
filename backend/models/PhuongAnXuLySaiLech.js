const sql = require("mssql");
const connectDB = require("../config/database");

const PhuongAnXuLySaiLech = {
  // Lấy các phương án của một hồ sơ
  getByHoSo: async (maHoSo) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maHoSo", sql.Char(10), maHoSo.trim())
      .query(`
        SELECT p.*, nv.HO_TEN as TEN_NGUOI_CHON 
        FROM PhuongAnXuLySaiLech p
        LEFT JOIN NhanVien nv ON p.NGUOI_CHON_PHUONG_AN = nv.MA_NHAN_VIEN
        WHERE p.MA_HO_SO = @maHoSo
        ORDER BY p.THOI_DIEM_CHON DESC
      `);
    return result.recordset;
  },

  create: async (data, nhiemVuData) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      // 1. Tạo phương án
      const requestPA = new sql.Request(transaction);
      await requestPA
        .input("maPhuongAn", sql.Char(10), data.MA_PHUONG_AN)
        .input("maHoSo", sql.Char(10), data.MA_HO_SO)
        .input("loaiPhuongAn", sql.NVarChar(100), data.LOAI_PHUONG_AN)
        .input("lyDo", sql.NVarChar(255), data.LY_DO)
        .input("nguoiChon", sql.Char(10), data.NGUOI_CHON_PHUONG_AN)
        .input("thoiDiemChon", sql.DateTime2, new Date())
        .input("canThaoTac", sql.Bit, data.CAN_THAO_TAC_VAT_LY ? 1 : 0)
        .input("canDuyet", sql.Bit, data.CAN_DUYET_CAP_CAO ? 1 : 0)
        .input("trangThai", sql.NVarChar(30), data.TRANG_THAI_PHUONG_AN)
        .query(`
          INSERT INTO PhuongAnXuLySaiLech 
            (MA_PHUONG_AN, MA_HO_SO, LOAI_PHUONG_AN, LY_DO, NGUOI_CHON_PHUONG_AN, THOI_DIEM_CHON, CAN_THAO_TAC_VAT_LY, CAN_DUYET_CAP_CAO, TRANG_THAI_PHUONG_AN)
          VALUES 
            (@maPhuongAn, @maHoSo, @loaiPhuongAn, @lyDo, @nguoiChon, @thoiDiemChon, @canThaoTac, @canDuyet, @trangThai)
        `);

      // 2. Nếu có tạo nhiệm vụ thao tác vật lý
      if (data.CAN_THAO_TAC_VAT_LY && nhiemVuData) {
        const requestNV = new sql.Request(transaction);
        await requestNV
          .input("maNhiemVu", sql.Char(10), nhiemVuData.MA_NHIEM_VU)
          .input("maHoSo", sql.Char(10), data.MA_HO_SO)
          .input("nguoiDuocPhanCong", sql.Char(10), nhiemVuData.NGUOI_DUOC_PHAN_CONG)
          .input("noiDung", sql.NVarChar(255), nhiemVuData.NOI_DUNG_NHIEM_VU)
          .input("trangThaiNV", sql.NVarChar(30), 'Chờ thực hiện')
          .query(`
            INSERT INTO NhiemVuXuLySaiLech 
              (MA_NHIEM_VU, MA_HO_SO, NGUOI_DUOC_PHAN_CONG, NOI_DUNG_NHIEM_VU, TRANG_THAI_NHIEM_VU)
            VALUES 
              (@maNhiemVu, @maHoSo, @nguoiDuocPhanCong, @noiDung, @trangThaiNV)
          `);
      }

      // 3. Cập nhật trạng thái Hồ sơ thành 'Đang xử lý'
      const requestHS = new sql.Request(transaction);
      await requestHS
        .input("maHoSo", sql.Char(10), data.MA_HO_SO)
        .input("nguoiXuLy", sql.Char(10), data.NGUOI_CHON_PHUONG_AN)
        .input("thoiDiemXuLy", sql.DateTime2, new Date())
        .query(`
          UPDATE HoSoXuLySaiLechTonKho 
          SET TRANG_THAI_HO_SO = N'Đang xử lý',
              NGUOI_XU_LY = @nguoiXuLy,
              THOI_DIEM_XU_LY = @thoiDiemXuLy
          WHERE MA_HO_SO = @maHoSo
        `);

      await transaction.commit();
      return { success: true, message: "Lập phương án thành công" };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};

module.exports = PhuongAnXuLySaiLech;