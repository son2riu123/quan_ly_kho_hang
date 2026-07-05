const sql = require("mssql");
const connectDB = require("../config/database");

const KiemKe = {
  getAllDots: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT d.*, k.TEN_KHO, nv.HO_TEN AS TEN_NGUOI_LAP
      FROM DotKiemKe d
      INNER JOIN Kho k ON d.MA_KHO = k.MA_KHO
      LEFT JOIN NhanVien nv ON d.NGUOI_LAP = nv.MA_NHAN_VIEN
    `);
    return result.recordset;
  },

  getDotByMa: async (maDot) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maDot", sql.Char(10), maDot)
      .query(`
        SELECT d.*, k.TEN_KHO, nv.HO_TEN AS TEN_NGUOI_LAP
        FROM DotKiemKe d
        INNER JOIN Kho k ON d.MA_KHO = k.MA_KHO
        LEFT JOIN NhanVien nv ON d.NGUOI_LAP = nv.MA_NHAN_VIEN
        WHERE d.MA_DOT_KIEM_KE = @maDot
      `);
    const header = result.recordset[0];
    if (!header) return null;

    // Lấy danh sách phiếu kiểm kê của đợt này
    const phieuResult = await pool.request()
      .input("maDot", sql.Char(10), maDot)
      .query(`
        SELECT p.*, nv.HO_TEN AS TEN_NGUOI_PHU_TRACH
        FROM PhieuKiemKe p
        LEFT JOIN NhanVien nv ON p.NGUOI_PHU_TRACH = nv.MA_NHAN_VIEN
        WHERE p.MA_DOT_KIEM_KE = @maDot
      `);
    header.sheets = phieuResult.recordset;
    return header;
  },

  createDot: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maDot", sql.Char(10), data.MA_DOT_KIEM_KE)
      .input("tenDot", sql.NVarChar(200), data.TEN_DOT_KIEM_KE)
      .input("maKho", sql.Char(10), data.MA_KHO)
      .input("loaiKiemKe", sql.NVarChar(50), data.LOAI_KIEM_KE)
      .input("phamViKiemKe", sql.NVarChar(100), data.PHAM_VI_KIEM_KE)
      .input("batDau", sql.DateTime, data.THOI_DIEM_BAT_DAU || new Date())
      .input("nguoiLap", sql.Char(10), data.NGUOI_LAP)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI_DOT || 'Chưa bắt đầu')
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU)
      .query(`
        INSERT INTO DotKiemKe (MA_DOT_KIEM_KE, TEN_DOT_KIEM_KE, MA_KHO, LOAI_KIEM_KE, PHAM_VI_KIEM_KE, THOI_DIEM_BAT_DAU, NGUOI_LAP, TRANG_THAI_DOT, GHI_CHU)
        VALUES (@maDot, @tenDot, @maKho, @loaiKiemKe, @phamViKiemKe, @batDau, @nguoiLap, @trangThai, @ghiChu)
      `);
    return { message: "Tạo đợt kiểm kê thành công", maDotKiemKe: data.MA_DOT_KIEM_KE };
  },

  getPhieuDetails: async (maPhieu) => {
    const pool = await connectDB();
    const headerResult = await pool.request()
      .input("maPhieu", sql.Char(10), maPhieu)
      .query(`
        SELECT p.*, d.TEN_DOT_KIEM_KE, nv.HO_TEN AS TEN_NGUOI_PHU_TRACH
        FROM PhieuKiemKe p
        INNER JOIN DotKiemKe d ON p.MA_DOT_KIEM_KE = d.MA_DOT_KIEM_KE
        LEFT JOIN NhanVien nv ON p.NGUOI_PHU_TRACH = nv.MA_NHAN_VIEN
        WHERE p.MA_PHIEU_KIEM_KE = @maPhieu
      `);
    const header = headerResult.recordset[0];
    if (!header) return null;

    const detailsResult = await pool.request()
      .input("maPhieu", sql.Char(10), maPhieu)
      .query(`
        SELECT ct.*, mh.TEN_MAT_HANG
        FROM ChiTietKiemKe ct
        INNER JOIN MatHang mh ON ct.MA_MAT_HANG = mh.MA_MAT_HANG
        WHERE ct.MA_PHIEU_KIEM_KE = @maPhieu
      `);
    header.details = detailsResult.recordset;
    return header;
  },

  createPhieu: async (data) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      
      const requestHeader = new sql.Request(transaction);
      await requestHeader
        .input("maPhieu", sql.Char(10), data.MA_PHIEU_KIEM_KE)
        .input("maDot", sql.Char(10), data.MA_DOT_KIEM_KE)
        .input("maNhom", sql.Char(10), data.MA_NHOM_KIEM_KE || null)
        .input("nguoiPhuTrach", sql.Char(10), data.NGUOI_PHU_TRACH || null)
        .input("ngayTao", sql.DateTime, data.NGAY_TAO || new Date())
        .input("trangThai", sql.NVarChar(30), data.TRANG_THAI_PHIEU || 'Đang thực hiện')
        .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
        .query(`
          INSERT INTO PhieuKiemKe (MA_PHIEU_KIEM_KE, MA_DOT_KIEM_KE, MA_NHOM_KIEM_KE, NGUOI_PHU_TRACH, NGAY_TAO, TRANG_THAI_PHIEU, GHI_CHU)
          VALUES (@maPhieu, @maDot, @maNhom, @nguoiPhuTrach, @ngayTao, @trangThai, @ghiChu)
        `);

      if (data.details && data.details.length > 0) {
        for (let i = 0; i < data.details.length; i++) {
          const detail = data.details[i];
          const requestDetail = new sql.Request(transaction);
          
          const chenhLech = (detail.SO_LUONG_THUC_TE || 0) - detail.SO_LUONG_SO_SACH;
          const loaiChenhLech = chenhLech > 0 ? 'Thừa' : chenhLech < 0 ? 'Thiếu' : 'Khớp';

          await requestDetail
            .input("maChiTiet", sql.Char(10), detail.MA_CHI_TIET_KIEM_KE)
            .input("maPhieu", sql.Char(10), data.MA_PHIEU_KIEM_KE)
            .input("maMatHang", sql.Char(10), detail.MA_MAT_HANG)
            .input("maLoHang", sql.Char(10), detail.MA_LO_HANG || null)
            .input("viTriHeThong", sql.Char(10), detail.MA_VI_TRI_HE_THONG || null)
            .input("viTriThucTe", sql.Char(10), detail.MA_VI_TRI_THUC_TE || detail.MA_VI_TRI_HE_THONG || null)
            .input("trangThaiHT", sql.NVarChar(50), detail.TRANG_THAI_TON_HE_THONG)
            .input("trangThaiTT", sql.NVarChar(50), detail.TRANG_THAI_TON_THUC_TE)
            .input("soLuongSS", sql.Int, detail.SO_LUONG_SO_SACH)
            .input("soLuongTT", sql.Int, detail.SO_LUONG_THUC_TE)
            .input("chenhLech", sql.Int, chenhLech)
            .input("loaiChenhLech", sql.NVarChar(50), loaiChenhLech)
            .input("tinhTrangHang", sql.NVarChar(100), detail.TINH_TRANG_HANG)
            .input("ghiChu", sql.NVarChar(255), detail.GHI_CHU)
            .query(`
              INSERT INTO ChiTietKiemKe (MA_CHI_TIET_KIEM_KE, MA_PHIEU_KIEM_KE, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI_HE_THONG, MA_VI_TRI_THUC_TE, TRANG_THAI_TON_HE_THONG, TRANG_THAI_TON_THUC_TE, SO_LUONG_SO_SACH, SO_LUONG_THUC_TE, CHENH_LECH, LOAI_CHENH_LECH, TINH_TRANG_HANG, GHI_CHU)
              VALUES (@maChiTiet, @maPhieu, @maMatHang, @maLoHang, @viTriHeThong, @viTriThucTe, @trangThaiHT, @trangThaiTT, @soLuongSS, @soLuongTT, @chenhLech, @loaiChenhLech, @tinhTrangHang, @ghiChu)
            `);
        }
      }

      await transaction.commit();
      return { message: "Lập phiếu kiểm kê thành công", maPhieuKiemKe: data.MA_PHIEU_KIEM_KE };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};

module.exports = KiemKe;
