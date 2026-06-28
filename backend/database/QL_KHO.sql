/* =====================================================================
   HỆ THỐNG QUẢN LÝ KHO VẬN HÀNG
   Script tạo cấu trúc CSDL cho SQL Server (DDL ONLY - CHƯA IMPORT DỮ LIỆU)
   Gồm 49 bảng, đã chuẩn hóa "đơn vị tính": tất cả cột lưu tên đơn vị tính
   dạng text (DON_VI_TINH, DON_VI_TINH_NHAP, DON_VI_NHAP, DON_VI_CO_SO)
   được đổi thành cột FK (MA_DON_VI_TINH...) tham chiếu bảng DonViTinh.
   ===================================================================== */

-- ---------------------------------------------------------------------
-- 0. TẠO DATABASE (bỏ qua nếu đã có database riêng)
-- ---------------------------------------------------------------------


USE QL_KHO;
GO

-- =====================================================================
-- 1. DANH MỤC CƠ BẢN (9 bảng)
-- =====================================================================

CREATE TABLE NhanVien (
    MA_NHAN_VIEN     CHAR(10)      NOT NULL,
    HO_TEN           NVARCHAR(100) NOT NULL,
    CHUC_VU          NVARCHAR(50)  NOT NULL,
    SO_DIEN_THOAI    VARCHAR(15)   NULL,
    EMAIL            VARCHAR(100)  NULL,
    VAI_TRO          NVARCHAR(50)  NOT NULL,
    TRANG_THAI       NVARCHAR(30)  NOT NULL,
    CONSTRAINT PK_NhanVien PRIMARY KEY (MA_NHAN_VIEN)
);
GO

CREATE TABLE NhaCungCap (
    MA_NHA_CUNG_CAP   CHAR(10)      NOT NULL,
    TEN_NHA_CUNG_CAP  NVARCHAR(150) NOT NULL,
    DIA_CHI           NVARCHAR(255) NULL,
    SO_DIEN_THOAI     VARCHAR(15)   NULL,
    EMAIL             VARCHAR(100)  NULL,
    MA_SO_THUE        VARCHAR(30)   NULL,
    NGUOI_DAI_DIEN    NVARCHAR(100) NULL,
    TRANG_THAI        NVARCHAR(30)  NOT NULL,
    CONSTRAINT PK_NhaCungCap PRIMARY KEY (MA_NHA_CUNG_CAP)
);
GO

CREATE TABLE Kho (
    MA_KHO              CHAR(10)      NOT NULL,
    TEN_KHO             NVARCHAR(150) NOT NULL,
    DIA_CHI             NVARCHAR(255) NULL,
    SIEU_THI_GAN_NHAT   NVARCHAR(150) NULL,
    TRANG_THAI          NVARCHAR(30)  NOT NULL,
    CONSTRAINT PK_Kho PRIMARY KEY (MA_KHO)
);
GO

CREATE TABLE DonViTinh (
    MA_DON_VI_TINH   CHAR(10)      NOT NULL,
    TEN_DON_VI_TINH  NVARCHAR(50)  NOT NULL,
    MO_TA            NVARCHAR(255) NULL,
    CONSTRAINT PK_DonViTinh PRIMARY KEY (MA_DON_VI_TINH)
);
GO

CREATE TABLE NhomKiemKe (
    MA_NHOM_KIEM_KE  CHAR(10)      NOT NULL,
    TEN_NHOM         NVARCHAR(100) NOT NULL,
    GHI_CHU          NVARCHAR(255) NULL,
    CONSTRAINT PK_NhomKiemKe PRIMARY KEY (MA_NHOM_KIEM_KE)
);
GO

CREATE TABLE ViTriKho (
    MA_VI_TRI            CHAR(10)      NOT NULL,
    MA_KHO               CHAR(10)      NOT NULL,
    KHU                  NVARCHAR(100) NULL,
    DAY                  NVARCHAR(100) NULL,
    KE                   NVARCHAR(100) NULL,
    TANG                 NVARCHAR(50)  NULL,
    O                    NVARCHAR(50)  NULL,
    LOAI_VI_TRI          NVARCHAR(50)  NOT NULL,
    DIEU_KIEN_BAO_QUAN   NVARCHAR(100) NULL,
    SUC_CHUA             INT           NULL,
    TRANG_THAI_VI_TRI    NVARCHAR(30)  NOT NULL,
    CONSTRAINT PK_ViTriKho PRIMARY KEY (MA_VI_TRI)
);
GO

-- MatHang: DON_VI_TINH_NHAP (text) -> MA_DON_VI_TINH_NHAP (FK)
CREATE TABLE MatHang (
    MA_MAT_HANG           CHAR(10)      NOT NULL,
    TEN_MAT_HANG          NVARCHAR(150) NOT NULL,
    NHOM_HANG             NVARCHAR(100) NULL,
    MA_DON_VI_TINH_NHAP   CHAR(10)      NOT NULL,
    QUY_CACH_DONG_GOI     NVARCHAR(150) NULL,
    CO_HAN_SU_DUNG        BIT           NOT NULL,
    DIEU_KIEN_BAO_QUAN    NVARCHAR(100) NULL,
    TRANG_THAI            NVARCHAR(30)  NOT NULL,
    CONSTRAINT PK_MatHang PRIMARY KEY (MA_MAT_HANG)
);
GO

-- QuyCachDongGoi: DON_VI_NHAP / DON_VI_CO_SO (text) -> FK
CREATE TABLE QuyCachDongGoi (
    MA_QUY_CACH         CHAR(10)      NOT NULL,
    MA_MAT_HANG         CHAR(10)      NOT NULL,
    MA_DON_VI_NHAP      CHAR(10)      NOT NULL,
    MA_DON_VI_CO_SO     CHAR(10)      NULL,
    SO_LUONG_QUY_DOI    INT           NULL,
    MO_TA               NVARCHAR(255) NULL,
    CONSTRAINT PK_QuyCachDongGoi PRIMARY KEY (MA_QUY_CACH)
);
GO

CREATE TABLE DanhMucViTriKhuyenNghi (
    MA_DANH_MUC       CHAR(10)      NOT NULL,
    MA_MAT_HANG       CHAR(10)      NOT NULL,
    MA_VI_TRI         CHAR(10)      NOT NULL,
    MUC_DO_UU_TIEN    INT           NULL,
    GHI_CHU           NVARCHAR(255) NULL,
    CONSTRAINT PK_DanhMucViTriKhuyenNghi PRIMARY KEY (MA_DANH_MUC)
);
GO

-- =====================================================================
-- 2. NGHIỆP VỤ NHẬP HÀNG (11 bảng)
-- =====================================================================

CREATE TABLE DonMuaHang (
    MA_DON_MUA            CHAR(10)      NOT NULL,
    MA_NHA_CUNG_CAP       CHAR(10)      NOT NULL,
    MA_KHO_NHAN           CHAR(10)      NOT NULL,
    NGAY_DAT              DATE          NOT NULL,
    NGAY_DU_KIEN_GIAO     DATE          NULL,
    TONG_SO_LUONG_DAT     INT           NULL,
    TONG_TIEN             DECIMAL(18,2) NULL,
    TRANG_THAI            NVARCHAR(30)  NOT NULL,
    GHI_CHU               NVARCHAR(255) NULL,
    CONSTRAINT PK_DonMuaHang PRIMARY KEY (MA_DON_MUA)
);
GO

-- DON_VI_TINH (text) -> MA_DON_VI_TINH (FK)
CREATE TABLE ChiTietDonMuaHang (
    MA_CHI_TIET_DON_MUA     CHAR(10)      NOT NULL,
    MA_DON_MUA              CHAR(10)      NOT NULL,
    MA_MAT_HANG             CHAR(10)      NOT NULL,
    MA_DON_VI_TINH          CHAR(10)      NOT NULL,
    SO_LUONG_DAT            INT           NOT NULL,
    SO_LUONG_DA_NHAP        INT           NOT NULL DEFAULT 0,
    SO_LUONG_CON_CHO_NHAN   INT           NOT NULL DEFAULT 0,
    DON_GIA                 DECIMAL(18,2) NULL,
    THANH_TIEN              DECIMAL(18,2) NULL,
    GHI_CHU                 NVARCHAR(255) NULL,
    CONSTRAINT PK_ChiTietDonMuaHang PRIMARY KEY (MA_CHI_TIET_DON_MUA)
);
GO

CREATE TABLE ChungTuGiaoHang (
    MA_CHUNG_TU_GIAO           CHAR(10)      NOT NULL,
    SO_CHUNG_TU_BEN_GIAO       NVARCHAR(50)  NOT NULL,
    MA_DON_MUA                 CHAR(10)      NOT NULL,
    NGAY_GIAO                  DATE          NOT NULL,
    NGUOI_GIAO                 NVARCHAR(100) NULL,
    SO_DIEN_THOAI_NGUOI_GIAO   VARCHAR(15)   NULL,
    FILE_CHUNG_TU              NVARCHAR(255) NULL,
    TRANG_THAI                 NVARCHAR(30)  NOT NULL,
    GHI_CHU                    NVARCHAR(255) NULL,
    CONSTRAINT PK_ChungTuGiaoHang PRIMARY KEY (MA_CHUNG_TU_GIAO)
);
GO

-- DON_VI_TINH (text) -> MA_DON_VI_TINH (FK)
CREATE TABLE ChiTietChungTuGiaoHang (
    MA_CHI_TIET_CHUNG_TU     CHAR(10)      NOT NULL,
    MA_CHUNG_TU_GIAO         CHAR(10)      NOT NULL,
    MA_MAT_HANG              CHAR(10)      NOT NULL,
    MA_DON_VI_TINH           CHAR(10)      NOT NULL,
    SO_LUONG_THEO_CHUNG_TU   INT           NOT NULL,
    DON_GIA                  DECIMAL(18,2) NULL,
    THANH_TIEN               DECIMAL(18,2) NULL,
    GHI_CHU                  NVARCHAR(255) NULL,
    CONSTRAINT PK_ChiTietChungTuGiaoHang PRIMARY KEY (MA_CHI_TIET_CHUNG_TU)
);
GO

CREATE TABLE BienBanGiaoNhan (
    MA_BIEN_BAN_GIAO_NHAN         CHAR(10)      NOT NULL,
    MA_DON_MUA                    CHAR(10)      NOT NULL,
    MA_CHUNG_TU_GIAO              CHAR(10)      NULL,
    NGAY_LAP                      DATETIME2(0)  NOT NULL,
    MA_THU_KHO                    CHAR(10)      NOT NULL,
    NGUOI_GIAO                    NVARCHAR(100) NULL,
    DIA_DIEM_GIAO_NHAN            NVARCHAR(255) NULL,
    TONG_SO_LUONG_THEO_CHUNG_TU   INT           NULL,
    TONG_SO_LUONG_THUC_NHAN       INT           NULL,
    TONG_SO_LUONG_DAT             INT           NULL,
    TONG_SO_LUONG_KHONG_DAT       INT           NULL,
    TRANG_THAI                    NVARCHAR(30)  NOT NULL,
    GHI_CHU                       NVARCHAR(255) NULL,
    CONSTRAINT PK_BienBanGiaoNhan PRIMARY KEY (MA_BIEN_BAN_GIAO_NHAN)
);
GO

-- DON_VI_TINH (text) -> MA_DON_VI_TINH (FK)
CREATE TABLE ChiTietBienBanGiaoNhan (
    MA_CHI_TIET_BBGN          CHAR(10)      NOT NULL,
    MA_BIEN_BAN_GIAO_NHAN     CHAR(10)      NOT NULL,
    MA_MAT_HANG               CHAR(10)      NOT NULL,
    MA_LO_HANG                CHAR(10)      NULL,
    MA_DON_VI_TINH            CHAR(10)      NOT NULL,
    SO_LUONG_THEO_CHUNG_TU    INT           NOT NULL,
    SO_LUONG_THUC_NHAN        INT           NOT NULL,
    SO_LUONG_DAT              INT           NOT NULL DEFAULT 0,
    SO_LUONG_KHONG_DAT        INT           NOT NULL DEFAULT 0,
    TINH_TRANG_HANG           NVARCHAR(100) NULL,
    CAN_KIEM_NGHIEM           BIT           NOT NULL DEFAULT 0,
    GHI_CHU                   NVARCHAR(255) NULL,
    CONSTRAINT PK_ChiTietBienBanGiaoNhan PRIMARY KEY (MA_CHI_TIET_BBGN)
);
GO

CREATE TABLE BienBanKiemNghiem (
    MA_BIEN_BAN_KIEM_NGHIEM   CHAR(10)      NOT NULL,
    MA_BIEN_BAN_GIAO_NHAN     CHAR(10)      NOT NULL,
    NGAY_LAP                  DATETIME2(0)  NOT NULL,
    MA_THU_KHO                CHAR(10)      NOT NULL,
    NGUOI_KIEM_NGHIEM         NVARCHAR(100) NULL,
    KET_LUAN                  NVARCHAR(255) NULL,
    TRANG_THAI                NVARCHAR(30)  NOT NULL,
    GHI_CHU                   NVARCHAR(255) NULL,
    CONSTRAINT PK_BienBanKiemNghiem PRIMARY KEY (MA_BIEN_BAN_KIEM_NGHIEM)
);
GO

-- DON_VI_TINH (text) -> MA_DON_VI_TINH (FK)
CREATE TABLE ChiTietBienBanKiemNghiem (
    MA_CHI_TIET_BBKN          CHAR(10)      NOT NULL,
    MA_BIEN_BAN_KIEM_NGHIEM   CHAR(10)      NOT NULL,
    MA_CHI_TIET_BBGN          CHAR(10)      NOT NULL,
    MA_MAT_HANG               CHAR(10)      NOT NULL,
    PHUONG_THUC_KIEM_NGHIEM   NVARCHAR(100) NULL,
    MA_DON_VI_TINH            CHAR(10)      NOT NULL,
    SO_LUONG_THEO_CHUNG_TU    INT           NULL,
    SO_LUONG_KIEM_NGHIEM      INT           NOT NULL,
    SO_LUONG_DAT              INT           NOT NULL DEFAULT 0,
    SO_LUONG_KHONG_DAT        INT           NOT NULL DEFAULT 0,
    LY_DO_KHONG_DAT           NVARCHAR(255) NULL,
    GHI_CHU                   NVARCHAR(255) NULL,
    CONSTRAINT PK_ChiTietBienBanKiemNghiem PRIMARY KEY (MA_CHI_TIET_BBKN)
);
GO

CREATE TABLE PhieuNhapKho (
    MA_PHIEU_NHAP_KHO             CHAR(10)      NOT NULL,
    MA_BIEN_BAN_GIAO_NHAN         CHAR(10)      NOT NULL,
    MA_KHO                        CHAR(10)      NOT NULL,
    NGAY_LAP                      DATETIME2(0)  NOT NULL,
    MA_THU_KHO                    CHAR(10)      NOT NULL,
    NGUOI_GIAO                    NVARCHAR(100) NULL,
    TONG_SO_LUONG_THEO_CHUNG_TU   INT           NULL,
    TONG_SO_LUONG_THUC_NHAP       INT           NULL,
    TONG_TIEN                     DECIMAL(18,2) NULL,
    TRANG_THAI                    NVARCHAR(30)  NOT NULL,
    GHI_CHU                       NVARCHAR(255) NULL,
    CONSTRAINT PK_PhieuNhapKho PRIMARY KEY (MA_PHIEU_NHAP_KHO)
);
GO

-- DON_VI_TINH (text) -> MA_DON_VI_TINH (FK)
CREATE TABLE ChiTietPhieuNhapKho (
    MA_CHI_TIET_PNK           CHAR(10)      NOT NULL,
    MA_PHIEU_NHAP_KHO         CHAR(10)      NOT NULL,
    MA_MAT_HANG               CHAR(10)      NOT NULL,
    MA_LO_HANG                CHAR(10)      NULL,
    MA_DON_VI_TINH            CHAR(10)      NOT NULL,
    SO_LUONG_THEO_CHUNG_TU    INT           NULL,
    SO_LUONG_THUC_NHAP        INT           NOT NULL,
    DON_GIA                   DECIMAL(18,2) NULL,
    THANH_TIEN                DECIMAL(18,2) NULL,
    GHI_CHU                   NVARCHAR(255) NULL,
    CONSTRAINT PK_ChiTietPhieuNhapKho PRIMARY KEY (MA_CHI_TIET_PNK)
);
GO

CREATE TABLE HoSoDotNhap (
    MA_HO_SO_DOT_NHAP          CHAR(10)      NOT NULL,
    MA_DON_MUA                 CHAR(10)      NOT NULL,
    MA_CHUNG_TU_GIAO           CHAR(10)      NULL,
    MA_BIEN_BAN_GIAO_NHAN      CHAR(10)      NULL,
    MA_BIEN_BAN_KIEM_NGHIEM    CHAR(10)      NULL,
    MA_PHIEU_NHAP_KHO          CHAR(10)      NULL,
    NGAY_TAO                   DATETIME2(0)  NOT NULL,
    TRANG_THAI                 NVARCHAR(30)  NOT NULL,
    GHI_CHU                    NVARCHAR(255) NULL,
    CONSTRAINT PK_HoSoDotNhap PRIMARY KEY (MA_HO_SO_DOT_NHAP)
);
GO

-- =====================================================================
-- 3. LÔ HÀNG & TỒN KHO (5 bảng)
-- =====================================================================

CREATE TABLE LoHang (
    MA_LO_HANG          CHAR(10)      NOT NULL,
    MA_MAT_HANG         CHAR(10)      NOT NULL,
    NGAY_SAN_XUAT       DATE          NULL,
    HAN_SU_DUNG         DATE          NULL,
    NGAY_NHAP           DATE          NULL,
    MA_PHIEU_NHAP_KHO   CHAR(10)      NULL,
    TRANG_THAI_LO       NVARCHAR(50)  NOT NULL,
    GHI_CHU             NVARCHAR(255) NULL,
    CONSTRAINT PK_LoHang PRIMARY KEY (MA_LO_HANG)
);
GO

CREATE TABLE TonTheoViTri (
    MA_TON_VI_TRI             CHAR(10)      NOT NULL,
    MA_MAT_HANG               CHAR(10)      NOT NULL,
    MA_LO_HANG                CHAR(10)      NULL,
    MA_VI_TRI                 CHAR(10)      NOT NULL,
    MA_CHI_TIET_PNK           CHAR(10)      NULL,
    SO_LUONG                  INT           NOT NULL,
    TRANG_THAI_TON            NVARCHAR(50)  NOT NULL,
    NGAY_DUA_VAO              DATETIME2(0)  NOT NULL,
    NGAY_CAP_NHAT_GAN_NHAT    DATETIME2(0)  NOT NULL,
    GHI_CHU                   NVARCHAR(255) NULL,
    CONSTRAINT PK_TonTheoViTri PRIMARY KEY (MA_TON_VI_TRI)
);
GO

CREATE TABLE TheKho (
    MA_THE_KHO       CHAR(10)      NOT NULL,
    MA_MAT_HANG      CHAR(10)      NOT NULL,
    NGAY_MO_THE      DATETIME2(0)  NOT NULL,
    NGUOI_LAP_THE    CHAR(10)      NULL,
    TRANG_THAI       NVARCHAR(30)  NOT NULL,
    CONSTRAINT PK_TheKho PRIMARY KEY (MA_THE_KHO)
);
GO

CREATE TABLE DongTheKho (
    MA_DONG_THE_KHO   CHAR(10)      NOT NULL,
    MA_THE_KHO        CHAR(10)      NOT NULL,
    NGAY_GHI          DATETIME2(0)  NOT NULL,
    MA_CHUNG_TU       CHAR(10)      NULL,
    LOAI_CHUNG_TU     NVARCHAR(50)  NULL,
    DIEN_GIAI         NVARCHAR(255) NULL,
    SO_LUONG_NHAP     INT           NOT NULL DEFAULT 0,
    SO_LUONG_XUAT     INT           NOT NULL DEFAULT 0,
    SO_LUONG_TON      INT           NOT NULL,
    NGUOI_GHI         CHAR(10)      NULL,
    CONSTRAINT PK_DongTheKho PRIMARY KEY (MA_DONG_THE_KHO)
);
GO

CREATE TABLE BienDongTonKho (
    MA_BIEN_DONG        CHAR(10)      NOT NULL,
    MA_MAT_HANG         CHAR(10)      NOT NULL,
    MA_LO_HANG          CHAR(10)      NULL,
    MA_VI_TRI           CHAR(10)      NULL,
    MA_CHUNG_TU         CHAR(10)      NULL,
    LOAI_CHUNG_TU       NVARCHAR(50)  NULL,
    LOAI_BIEN_DONG      NVARCHAR(50)  NOT NULL,
    SO_LUONG            INT           NOT NULL,
    THOI_GIAN           DATETIME2(0)  NOT NULL,
    NGUOI_THUC_HIEN     CHAR(10)      NOT NULL,
    GHI_CHU             NVARCHAR(255) NULL,
    CONSTRAINT PK_BienDongTonKho PRIMARY KEY (MA_BIEN_DONG)
);
GO

-- =====================================================================
-- 4. XỬ LÝ HÀNG LỖI, HỎNG, HẾT HẠN (8 bảng)
-- =====================================================================

CREATE TABLE PhieuBaoCaoHangLoi (
    MA_PHIEU_BAO_CAO   CHAR(10)      NOT NULL,
    NGUOI_LAP          CHAR(10)      NOT NULL,
    THOI_DIEM_LAP      DATETIME2(0)  NOT NULL,
    NGUON_PHAT_HIEN    NVARCHAR(50)  NOT NULL,
    MO_TA_CHUNG        NVARCHAR(255) NULL,
    TRANG_THAI_PHIEU   NVARCHAR(30)  NOT NULL,
    GHI_CHU            NVARCHAR(255) NULL,
    CONSTRAINT PK_PhieuBaoCaoHangLoi PRIMARY KEY (MA_PHIEU_BAO_CAO)
);
GO

CREATE TABLE ChiTietPhieuBaoCaoHangLoi (
    MA_CHI_TIET_PHIEU   CHAR(10)      NOT NULL,
    MA_PHIEU_BAO_CAO    CHAR(10)      NOT NULL,
    MA_MAT_HANG         CHAR(10)      NOT NULL,
    MA_LO_HANG          CHAR(10)      NULL,
    MA_VI_TRI           CHAR(10)      NOT NULL,
    SO_LUONG_BAO_CAO    INT           NOT NULL,
    LOAI_VAN_DE         NVARCHAR(50)  NOT NULL,
    TINH_TRANG_HANG     NVARCHAR(100) NULL,
    MO_TA_CHI_TIET      NVARCHAR(255) NULL,
    MINH_CHUNG          NVARCHAR(255) NULL,
    CONSTRAINT PK_ChiTietPhieuBaoCaoHangLoi PRIMARY KEY (MA_CHI_TIET_PHIEU)
);
GO

CREATE TABLE PhieuCachLyHang (
    MA_PHIEU_CACH_LY     CHAR(10)      NOT NULL,
    MA_PHIEU_BAO_CAO     CHAR(10)      NOT NULL,
    NGUOI_THUC_HIEN      CHAR(10)      NOT NULL,
    THOI_DIEM_CACH_LY    DATETIME2(0)  NOT NULL,
    VI_TRI_CACH_LY       CHAR(10)      NOT NULL,
    TRANG_THAI_CACH_LY   NVARCHAR(30)  NOT NULL,
    GHI_CHU              NVARCHAR(255) NULL,
    CONSTRAINT PK_PhieuCachLyHang PRIMARY KEY (MA_PHIEU_CACH_LY)
);
GO

CREATE TABLE PhuongAnXuLyHangLoi (
    MA_PHUONG_AN           CHAR(10)      NOT NULL,
    MA_PHIEU_BAO_CAO       CHAR(10)      NOT NULL,
    LOAI_PHUONG_AN         NVARCHAR(100) NOT NULL,
    LY_DO                  NVARCHAR(255) NOT NULL,
    NGUOI_CHON_PHUONG_AN   CHAR(10)      NOT NULL,
    THOI_DIEM_CHON         DATETIME2(0)  NOT NULL,
    CAN_DUYET_CAP_CAO      BIT           NOT NULL,
    TRANG_THAI_PHUONG_AN   NVARCHAR(30)  NOT NULL,
    CONSTRAINT PK_PhuongAnXuLyHangLoi PRIMARY KEY (MA_PHUONG_AN)
);
GO

CREATE TABLE LenhXuLyHangLoi (
    MA_LENH_XU_LY          CHAR(10)      NOT NULL,
    MA_PHUONG_AN           CHAR(10)      NOT NULL,
    NGUOI_DUOC_PHAN_CONG   CHAR(10)      NOT NULL,
    NOI_DUNG_LENH          NVARCHAR(255) NOT NULL,
    THOI_HAN                DATETIME2(0)  NULL,
    TRANG_THAI_LENH        NVARCHAR(30)  NOT NULL,
    KET_QUA_THUC_HIEN      NVARCHAR(255) NULL,
    CONSTRAINT PK_LenhXuLyHangLoi PRIMARY KEY (MA_LENH_XU_LY)
);
GO

CREATE TABLE BienBanTieuHuy (
    MA_BIEN_BAN_TIEU_HUY    CHAR(10)      NOT NULL,
    MA_LENH_XU_LY           CHAR(10)      NOT NULL,
    NGAY_TIEU_HUY           DATETIME2(0)  NOT NULL,
    NGUOI_THUC_HIEN         CHAR(10)      NOT NULL,
    NGUOI_CHUNG_KIEN        CHAR(10)      NULL,
    SO_LUONG_TIEU_HUY       INT           NOT NULL,
    PHUONG_THUC_TIEU_HUY    NVARCHAR(100) NULL,
    MINH_CHUNG              NVARCHAR(255) NULL,
    GHI_CHU                 NVARCHAR(255) NULL,
    CONSTRAINT PK_BienBanTieuHuy PRIMARY KEY (MA_BIEN_BAN_TIEU_HUY)
);
GO

CREATE TABLE PhieuTraNhaCungCap (
    MA_PHIEU_TRA       CHAR(10)      NOT NULL,
    MA_LENH_XU_LY      CHAR(10)      NOT NULL,
    MA_NHA_CUNG_CAP    CHAR(10)      NOT NULL,
    NGAY_LAP           DATETIME2(0)  NOT NULL,
    NGUOI_LAP          CHAR(10)      NOT NULL,
    LY_DO_TRA          NVARCHAR(255) NOT NULL,
    SO_LUONG_TRA       INT           NOT NULL,
    TRANG_THAI_TRA     NVARCHAR(30)  NOT NULL,
    GHI_CHU            NVARCHAR(255) NULL,
    CONSTRAINT PK_PhieuTraNhaCungCap PRIMARY KEY (MA_PHIEU_TRA)
);
GO

CREATE TABLE HoSoXuLyHangLoi (
    MA_HO_SO           CHAR(10)      NOT NULL,
    MA_PHIEU_BAO_CAO   CHAR(10)      NOT NULL,
    MA_PHUONG_AN       CHAR(10)      NULL,
    MA_LENH_XU_LY      CHAR(10)      NULL,
    NGAY_TAO           DATETIME2(0)  NOT NULL,
    TRANG_THAI_HO_SO   NVARCHAR(30)  NOT NULL,
    NGAY_DONG_HO_SO    DATETIME2(0)  NULL,
    GHI_CHU            NVARCHAR(255) NULL,
    CONSTRAINT PK_HoSoXuLyHangLoi PRIMARY KEY (MA_HO_SO)
);
GO

-- =====================================================================
-- 5. KIỂM KÊ TỒN KHO (7 bảng)
-- =====================================================================

CREATE TABLE ThanhVienKiemKe (
    MA_NHOM_KIEM_KE       CHAR(10)      NOT NULL,
    MA_NHAN_VIEN          CHAR(10)      NOT NULL,
    VAI_TRO_TRONG_NHOM    NVARCHAR(50)  NULL,
    CONSTRAINT PK_ThanhVienKiemKe PRIMARY KEY (MA_NHOM_KIEM_KE, MA_NHAN_VIEN)
);
GO

CREATE TABLE DotKiemKe (
    MA_DOT_KIEM_KE       CHAR(10)      NOT NULL,
    TEN_DOT_KIEM_KE      NVARCHAR(200) NOT NULL,
    MA_KHO               CHAR(10)      NOT NULL,
    LOAI_KIEM_KE         NVARCHAR(50)  NOT NULL,
    PHAM_VI_KIEM_KE      NVARCHAR(100) NOT NULL,
    THOI_DIEM_BAT_DAU    DATETIME2(0)  NULL,
    THOI_DIEM_KET_THUC   DATETIME2(0)  NULL,
    NGUOI_LAP            CHAR(10)      NOT NULL,
    TRANG_THAI_DOT       NVARCHAR(30)  NOT NULL,
    GHI_CHU              NVARCHAR(255) NULL,
    CONSTRAINT PK_DotKiemKe PRIMARY KEY (MA_DOT_KIEM_KE)
);
GO

CREATE TABLE PhieuKiemKe (
    MA_PHIEU_KIEM_KE     CHAR(10)      NOT NULL,
    MA_DOT_KIEM_KE       CHAR(10)      NOT NULL,
    MA_NHOM_KIEM_KE      CHAR(10)      NULL,
    NGUOI_PHU_TRACH      CHAR(10)      NULL,
    NGAY_TAO             DATETIME2(0)  NOT NULL,
    TRANG_THAI_PHIEU     NVARCHAR(30)  NOT NULL,
    GHI_CHU              NVARCHAR(255) NULL,
    CONSTRAINT PK_PhieuKiemKe PRIMARY KEY (MA_PHIEU_KIEM_KE)
);
GO

CREATE TABLE NhiemVuKiemKe (
    MA_NHIEM_VU            CHAR(10)      NOT NULL,
    MA_DOT_KIEM_KE         CHAR(10)      NOT NULL,
    NGUOI_DUOC_PHAN_CONG   CHAR(10)      NOT NULL,
    PHAM_VI_KIEM_KE        NVARCHAR(150) NOT NULL,
    THOI_HAN               DATETIME2(0)  NULL,
    TRANG_THAI_NHIEM_VU    NVARCHAR(30)  NOT NULL,
    KET_QUA_THUC_HIEN      NVARCHAR(255) NULL,
    CONSTRAINT PK_NhiemVuKiemKe PRIMARY KEY (MA_NHIEM_VU)
);
GO

CREATE TABLE ChiTietKiemKe (
    MA_CHI_TIET_KIEM_KE       CHAR(10)      NOT NULL,
    MA_PHIEU_KIEM_KE          CHAR(10)      NOT NULL,
    MA_MAT_HANG               CHAR(10)      NOT NULL,
    MA_LO_HANG                CHAR(10)      NULL,
    MA_VI_TRI_HE_THONG        CHAR(10)      NULL,
    MA_VI_TRI_THUC_TE         CHAR(10)      NULL,
    TRANG_THAI_TON_HE_THONG   NVARCHAR(50)  NULL,
    TRANG_THAI_TON_THUC_TE    NVARCHAR(50)  NULL,
    SO_LUONG_SO_SACH          INT           NOT NULL,
    SO_LUONG_THUC_TE          INT           NULL,
    CHENH_LECH                INT           NULL,
    LOAI_CHENH_LECH           NVARCHAR(50)  NULL,
    TINH_TRANG_HANG           NVARCHAR(100) NULL,
    GHI_CHU                   NVARCHAR(255) NULL,
    CONSTRAINT PK_ChiTietKiemKe PRIMARY KEY (MA_CHI_TIET_KIEM_KE)
);
GO

CREATE TABLE BienBanKiemKe (
    MA_BIEN_BAN_KIEM_KE    CHAR(10)      NOT NULL,
    MA_DOT_KIEM_KE         CHAR(10)      NOT NULL,
    NGAY_LAP               DATETIME2(0)  NOT NULL,
    NGUOI_LAP              CHAR(10)      NOT NULL,
    DAI_DIEN_QUAN_LY_KHO   CHAR(10)      NULL,
    DAI_DIEN_THU_KHO       CHAR(10)      NULL,
    DAI_DIEN_KE_TOAN       CHAR(10)      NULL,
    KET_LUAN               NVARCHAR(255) NULL,
    TRANG_THAI_BIEN_BAN    NVARCHAR(30)  NOT NULL,
    GHI_CHU                NVARCHAR(255) NULL,
    CONSTRAINT PK_BienBanKiemKe PRIMARY KEY (MA_BIEN_BAN_KIEM_KE)
);
GO

-- DON_VI_TINH (text) -> MA_DON_VI_TINH (FK)
CREATE TABLE ChiTietBienBanKiemKe (
    MA_CHI_TIET_BIEN_BAN   CHAR(10)      NOT NULL,
    MA_BIEN_BAN_KIEM_KE    CHAR(10)      NOT NULL,
    MA_CHI_TIET_KIEM_KE    CHAR(10)      NOT NULL,
    MA_MAT_HANG            CHAR(10)      NOT NULL,
    MA_LO_HANG             CHAR(10)      NULL,
    MA_VI_TRI              CHAR(10)      NULL,
    MA_DON_VI_TINH         CHAR(10)      NOT NULL,
    SO_LUONG_SO_SACH       INT           NOT NULL,
    SO_LUONG_THUC_TE       INT           NOT NULL,
    SO_LUONG_THUA          INT           NOT NULL DEFAULT 0,
    SO_LUONG_THIEU         INT           NOT NULL DEFAULT 0,
    TINH_TRANG_HANG        NVARCHAR(100) NULL,
    GHI_CHU                NVARCHAR(255) NULL,
    CONSTRAINT PK_ChiTietBienBanKiemKe PRIMARY KEY (MA_CHI_TIET_BIEN_BAN)
);
GO

-- =====================================================================
-- 6. XỬ LÝ SAI LỆCH TỒN KHO (7 bảng)
-- =====================================================================

CREATE TABLE HoSoXuLySaiLechTonKho (
    MA_HO_SO              CHAR(10)      NOT NULL,
    NGUOI_PHAT_HIEN       CHAR(10)      NOT NULL,
    THOI_DIEM_PHAT_HIEN   DATETIME2(0)  NOT NULL,
    NGUON_PHAT_HIEN       NVARCHAR(50)  NOT NULL,
    MO_TA_CHUNG           NVARCHAR(255) NULL,
    TRANG_THAI_HO_SO      NVARCHAR(30)  NOT NULL,
    NGUOI_XU_LY           CHAR(10)      NULL,
    THOI_DIEM_XU_LY       DATETIME2(0)  NULL,
    GHI_CHU               NVARCHAR(255) NULL,
    CONSTRAINT PK_HoSoXuLySaiLechTonKho PRIMARY KEY (MA_HO_SO)
);
GO

-- DON_VI_TINH (text) -> MA_DON_VI_TINH (FK)
CREATE TABLE ChiTietSaiLechTonKho (
    MA_CHI_TIET_SAI_LECH   CHAR(10)      NOT NULL,
    MA_HO_SO               CHAR(10)      NOT NULL,
    MA_MAT_HANG            CHAR(10)      NOT NULL,
    MA_LO_HANG             CHAR(10)      NULL,
    MA_VI_TRI              CHAR(10)      NULL,
    TRANG_THAI_HANG        NVARCHAR(50)  NULL,
    MA_DON_VI_TINH         CHAR(10)      NOT NULL,
    SO_LUONG_HE_THONG      INT           NOT NULL,
    SO_LUONG_THUC_TE       INT           NOT NULL,
    SO_LUONG_SAI_LECH      INT           NOT NULL,
    LOAI_SAI_LECH          NVARCHAR(100) NOT NULL,
    MO_TA_SAI_LECH         NVARCHAR(255) NULL,
    MINH_CHUNG             NVARCHAR(255) NULL,
    CONSTRAINT PK_ChiTietSaiLechTonKho PRIMARY KEY (MA_CHI_TIET_SAI_LECH)
);
GO

CREATE TABLE PhieuKiemKeXacMinh (
    MA_PHIEU_KKXM        CHAR(10)      NOT NULL,
    MA_HO_SO             CHAR(10)      NOT NULL,
    NGUOI_KIEM_KE        CHAR(10)      NOT NULL,
    THOI_DIEM_KIEM_KE    DATETIME2(0)  NOT NULL,
    PHAM_VI_KIEM_KE      NVARCHAR(100) NOT NULL,
    KET_QUA_KIEM_KE      NVARCHAR(255) NULL,
    TRANG_THAI_PHIEU     NVARCHAR(30)  NOT NULL,
    GHI_CHU              NVARCHAR(255) NULL,
    CONSTRAINT PK_PhieuKiemKeXacMinh PRIMARY KEY (MA_PHIEU_KKXM)
);
GO

CREATE TABLE ChiTietPhieuKiemKeXacMinh (
    MA_CHI_TIET_KKXM   CHAR(10)      NOT NULL,
    MA_PHIEU_KKXM      CHAR(10)      NOT NULL,
    MA_MAT_HANG        CHAR(10)      NOT NULL,
    MA_LO_HANG         CHAR(10)      NULL,
    MA_VI_TRI          CHAR(10)      NULL,
    SO_LUONG_THUC_TE   INT           NOT NULL,
    TINH_TRANG_HANG    NVARCHAR(100) NULL,
    GHI_CHU            NVARCHAR(255) NULL,
    CONSTRAINT PK_ChiTietPhieuKiemKeXacMinh PRIMARY KEY (MA_CHI_TIET_KKXM)
);
GO

CREATE TABLE PhuongAnXuLySaiLech (
    MA_PHUONG_AN           CHAR(10)      NOT NULL,
    MA_HO_SO               CHAR(10)      NOT NULL,
    LOAI_PHUONG_AN         NVARCHAR(100) NOT NULL,
    LY_DO                  NVARCHAR(255) NOT NULL,
    NGUOI_CHON_PHUONG_AN   CHAR(10)      NOT NULL,
    THOI_DIEM_CHON         DATETIME2(0)  NOT NULL,
    CAN_THAO_TAC_VAT_LY    BIT           NOT NULL,
    CAN_DUYET_CAP_CAO      BIT           NOT NULL,
    TRANG_THAI_PHUONG_AN   NVARCHAR(30)  NOT NULL,
    CONSTRAINT PK_PhuongAnXuLySaiLech PRIMARY KEY (MA_PHUONG_AN)
);
GO

CREATE TABLE PheDuyetPhuongAnSaiLech (
    MA_PHE_DUYET           CHAR(10)      NOT NULL,
    MA_PHUONG_AN           CHAR(10)      NOT NULL,
    NGUOI_PHE_DUYET        CHAR(10)      NOT NULL,
    THOI_DIEM_PHE_DUYET    DATETIME2(0)  NOT NULL,
    KET_QUA_PHE_DUYET      NVARCHAR(30)  NOT NULL,
    GHI_CHU                NVARCHAR(255) NULL,
    CONSTRAINT PK_PheDuyetPhuongAnSaiLech PRIMARY KEY (MA_PHE_DUYET)
);
GO

CREATE TABLE NhiemVuXuLySaiLech (
    MA_NHIEM_VU            CHAR(10)      NOT NULL,
    MA_HO_SO               CHAR(10)      NOT NULL,
    NGUOI_DUOC_PHAN_CONG   CHAR(10)      NOT NULL,
    NOI_DUNG_NHIEM_VU      NVARCHAR(255) NOT NULL,
    THOI_HAN               DATETIME2(0)  NULL,
    TRANG_THAI_NHIEM_VU    NVARCHAR(30)  NOT NULL,
    KET_QUA_THUC_HIEN      NVARCHAR(255) NULL,
    CONSTRAINT PK_NhiemVuXuLySaiLech PRIMARY KEY (MA_NHIEM_VU)
);
GO

-- =====================================================================
-- 7. DÙNG CHUNG (2 bảng)
-- =====================================================================

CREATE TABLE TepDinhKem (
    MA_TEP                  CHAR(10)      NOT NULL,
    TEN_TEP                 NVARCHAR(150) NOT NULL,
    DUONG_DAN               NVARCHAR(255) NOT NULL,
    LOAI_TEP                NVARCHAR(50)  NULL,
    DOI_TUONG_LIEN_KET      NVARCHAR(50)  NOT NULL,
    MA_DOI_TUONG_LIEN_KET   CHAR(10)      NOT NULL,
    NGAY_TAI_LEN            DATETIME2(0)  NOT NULL,
    NGUOI_TAI_LEN           CHAR(10)      NULL,
    CONSTRAINT PK_TepDinhKem PRIMARY KEY (MA_TEP)
);
GO

CREATE TABLE NhatKyThaoTac (
    MA_LOG                   CHAR(10)      NOT NULL,
    NGUOI_THAO_TAC           CHAR(10)      NOT NULL,
    THOI_GIAN                DATETIME2(0)  NOT NULL,
    HANH_DONG                NVARCHAR(100) NOT NULL,
    DOI_TUONG_BI_TAC_DONG    NVARCHAR(100) NULL,
    MA_DOI_TUONG             CHAR(10)      NULL,
    DU_LIEU_TRUOC            NVARCHAR(MAX) NULL,
    DU_LIEU_SAU              NVARCHAR(MAX) NULL,
    GHI_CHU                  NVARCHAR(255) NULL,
    CONSTRAINT PK_NhatKyThaoTac PRIMARY KEY (MA_LOG)
);
GO

/* =====================================================================
   8. KHAI BÁO TOÀN BỘ FOREIGN KEY
   (Tạo bảng trước, gắn FK sau để tránh lỗi thứ tự phụ thuộc chéo)
   ===================================================================== */

-- ViTriKho
ALTER TABLE ViTriKho ADD CONSTRAINT FK_ViTriKho_Kho FOREIGN KEY (MA_KHO) REFERENCES Kho(MA_KHO);

-- MatHang
ALTER TABLE MatHang ADD CONSTRAINT FK_MatHang_DonViTinh FOREIGN KEY (MA_DON_VI_TINH_NHAP) REFERENCES DonViTinh(MA_DON_VI_TINH);

-- QuyCachDongGoi
ALTER TABLE QuyCachDongGoi ADD CONSTRAINT FK_QuyCachDongGoi_MatHang FOREIGN KEY (MA_MAT_HANG) REFERENCES MatHang(MA_MAT_HANG);
ALTER TABLE QuyCachDongGoi ADD CONSTRAINT FK_QuyCachDongGoi_DonViNhap FOREIGN KEY (MA_DON_VI_NHAP) REFERENCES DonViTinh(MA_DON_VI_TINH);
ALTER TABLE QuyCachDongGoi ADD CONSTRAINT FK_QuyCachDongGoi_DonViCoSo FOREIGN KEY (MA_DON_VI_CO_SO) REFERENCES DonViTinh(MA_DON_VI_TINH);

-- DanhMucViTriKhuyenNghi
ALTER TABLE DanhMucViTriKhuyenNghi ADD CONSTRAINT FK_DanhMucVTKN_MatHang FOREIGN KEY (MA_MAT_HANG) REFERENCES MatHang(MA_MAT_HANG);
ALTER TABLE DanhMucViTriKhuyenNghi ADD CONSTRAINT FK_DanhMucVTKN_ViTriKho FOREIGN KEY (MA_VI_TRI) REFERENCES ViTriKho(MA_VI_TRI);

-- DonMuaHang
ALTER TABLE DonMuaHang ADD CONSTRAINT FK_DonMuaHang_NhaCungCap FOREIGN KEY (MA_NHA_CUNG_CAP) REFERENCES NhaCungCap(MA_NHA_CUNG_CAP);
ALTER TABLE DonMuaHang ADD CONSTRAINT FK_DonMuaHang_Kho FOREIGN KEY (MA_KHO_NHAN) REFERENCES Kho(MA_KHO);

-- ChiTietDonMuaHang
ALTER TABLE ChiTietDonMuaHang ADD CONSTRAINT FK_CTDonMua_DonMuaHang FOREIGN KEY (MA_DON_MUA) REFERENCES DonMuaHang(MA_DON_MUA);
ALTER TABLE ChiTietDonMuaHang ADD CONSTRAINT FK_CTDonMua_MatHang FOREIGN KEY (MA_MAT_HANG) REFERENCES MatHang(MA_MAT_HANG);
ALTER TABLE ChiTietDonMuaHang ADD CONSTRAINT FK_CTDonMua_DonViTinh FOREIGN KEY (MA_DON_VI_TINH) REFERENCES DonViTinh(MA_DON_VI_TINH);

-- ChungTuGiaoHang
ALTER TABLE ChungTuGiaoHang ADD CONSTRAINT FK_ChungTuGiao_DonMuaHang FOREIGN KEY (MA_DON_MUA) REFERENCES DonMuaHang(MA_DON_MUA);

-- ChiTietChungTuGiaoHang
ALTER TABLE ChiTietChungTuGiaoHang ADD CONSTRAINT FK_CTChungTuGiao_ChungTuGiao FOREIGN KEY (MA_CHUNG_TU_GIAO) REFERENCES ChungTuGiaoHang(MA_CHUNG_TU_GIAO);
ALTER TABLE ChiTietChungTuGiaoHang ADD CONSTRAINT FK_CTChungTuGiao_MatHang FOREIGN KEY (MA_MAT_HANG) REFERENCES MatHang(MA_MAT_HANG);
ALTER TABLE ChiTietChungTuGiaoHang ADD CONSTRAINT FK_CTChungTuGiao_DonViTinh FOREIGN KEY (MA_DON_VI_TINH) REFERENCES DonViTinh(MA_DON_VI_TINH);

-- BienBanGiaoNhan
ALTER TABLE BienBanGiaoNhan ADD CONSTRAINT FK_BBGiaoNhan_DonMuaHang FOREIGN KEY (MA_DON_MUA) REFERENCES DonMuaHang(MA_DON_MUA);
ALTER TABLE BienBanGiaoNhan ADD CONSTRAINT FK_BBGiaoNhan_ChungTuGiao FOREIGN KEY (MA_CHUNG_TU_GIAO) REFERENCES ChungTuGiaoHang(MA_CHUNG_TU_GIAO);
ALTER TABLE BienBanGiaoNhan ADD CONSTRAINT FK_BBGiaoNhan_ThuKho FOREIGN KEY (MA_THU_KHO) REFERENCES NhanVien(MA_NHAN_VIEN);

-- ChiTietBienBanGiaoNhan
ALTER TABLE ChiTietBienBanGiaoNhan ADD CONSTRAINT FK_CTBBGiaoNhan_BBGiaoNhan FOREIGN KEY (MA_BIEN_BAN_GIAO_NHAN) REFERENCES BienBanGiaoNhan(MA_BIEN_BAN_GIAO_NHAN);
ALTER TABLE ChiTietBienBanGiaoNhan ADD CONSTRAINT FK_CTBBGiaoNhan_MatHang FOREIGN KEY (MA_MAT_HANG) REFERENCES MatHang(MA_MAT_HANG);
ALTER TABLE ChiTietBienBanGiaoNhan ADD CONSTRAINT FK_CTBBGiaoNhan_LoHang FOREIGN KEY (MA_LO_HANG) REFERENCES LoHang(MA_LO_HANG);
ALTER TABLE ChiTietBienBanGiaoNhan ADD CONSTRAINT FK_CTBBGiaoNhan_DonViTinh FOREIGN KEY (MA_DON_VI_TINH) REFERENCES DonViTinh(MA_DON_VI_TINH);

-- BienBanKiemNghiem
ALTER TABLE BienBanKiemNghiem ADD CONSTRAINT FK_BBKiemNghiem_BBGiaoNhan FOREIGN KEY (MA_BIEN_BAN_GIAO_NHAN) REFERENCES BienBanGiaoNhan(MA_BIEN_BAN_GIAO_NHAN);
ALTER TABLE BienBanKiemNghiem ADD CONSTRAINT FK_BBKiemNghiem_ThuKho FOREIGN KEY (MA_THU_KHO) REFERENCES NhanVien(MA_NHAN_VIEN);

-- ChiTietBienBanKiemNghiem
ALTER TABLE ChiTietBienBanKiemNghiem ADD CONSTRAINT FK_CTBBKiemNghiem_BBKiemNghiem FOREIGN KEY (MA_BIEN_BAN_KIEM_NGHIEM) REFERENCES BienBanKiemNghiem(MA_BIEN_BAN_KIEM_NGHIEM);
ALTER TABLE ChiTietBienBanKiemNghiem ADD CONSTRAINT FK_CTBBKiemNghiem_CTBBGiaoNhan FOREIGN KEY (MA_CHI_TIET_BBGN) REFERENCES ChiTietBienBanGiaoNhan(MA_CHI_TIET_BBGN);
ALTER TABLE ChiTietBienBanKiemNghiem ADD CONSTRAINT FK_CTBBKiemNghiem_MatHang FOREIGN KEY (MA_MAT_HANG) REFERENCES MatHang(MA_MAT_HANG);
ALTER TABLE ChiTietBienBanKiemNghiem ADD CONSTRAINT FK_CTBBKiemNghiem_DonViTinh FOREIGN KEY (MA_DON_VI_TINH) REFERENCES DonViTinh(MA_DON_VI_TINH);

-- PhieuNhapKho
ALTER TABLE PhieuNhapKho ADD CONSTRAINT FK_PNK_BBGiaoNhan FOREIGN KEY (MA_BIEN_BAN_GIAO_NHAN) REFERENCES BienBanGiaoNhan(MA_BIEN_BAN_GIAO_NHAN);
ALTER TABLE PhieuNhapKho ADD CONSTRAINT FK_PNK_Kho FOREIGN KEY (MA_KHO) REFERENCES Kho(MA_KHO);
ALTER TABLE PhieuNhapKho ADD CONSTRAINT FK_PNK_ThuKho FOREIGN KEY (MA_THU_KHO) REFERENCES NhanVien(MA_NHAN_VIEN);

-- ChiTietPhieuNhapKho
ALTER TABLE ChiTietPhieuNhapKho ADD CONSTRAINT FK_CTPNK_PhieuNhapKho FOREIGN KEY (MA_PHIEU_NHAP_KHO) REFERENCES PhieuNhapKho(MA_PHIEU_NHAP_KHO);
ALTER TABLE ChiTietPhieuNhapKho ADD CONSTRAINT FK_CTPNK_MatHang FOREIGN KEY (MA_MAT_HANG) REFERENCES MatHang(MA_MAT_HANG);
ALTER TABLE ChiTietPhieuNhapKho ADD CONSTRAINT FK_CTPNK_LoHang FOREIGN KEY (MA_LO_HANG) REFERENCES LoHang(MA_LO_HANG);
ALTER TABLE ChiTietPhieuNhapKho ADD CONSTRAINT FK_CTPNK_DonViTinh FOREIGN KEY (MA_DON_VI_TINH) REFERENCES DonViTinh(MA_DON_VI_TINH);

-- HoSoDotNhap
ALTER TABLE HoSoDotNhap ADD CONSTRAINT FK_HoSoDotNhap_DonMuaHang FOREIGN KEY (MA_DON_MUA) REFERENCES DonMuaHang(MA_DON_MUA);
ALTER TABLE HoSoDotNhap ADD CONSTRAINT FK_HoSoDotNhap_ChungTuGiao FOREIGN KEY (MA_CHUNG_TU_GIAO) REFERENCES ChungTuGiaoHang(MA_CHUNG_TU_GIAO);
ALTER TABLE HoSoDotNhap ADD CONSTRAINT FK_HoSoDotNhap_BBGiaoNhan FOREIGN KEY (MA_BIEN_BAN_GIAO_NHAN) REFERENCES BienBanGiaoNhan(MA_BIEN_BAN_GIAO_NHAN);
ALTER TABLE HoSoDotNhap ADD CONSTRAINT FK_HoSoDotNhap_BBKiemNghiem FOREIGN KEY (MA_BIEN_BAN_KIEM_NGHIEM) REFERENCES BienBanKiemNghiem(MA_BIEN_BAN_KIEM_NGHIEM);
ALTER TABLE HoSoDotNhap ADD CONSTRAINT FK_HoSoDotNhap_PhieuNhapKho FOREIGN KEY (MA_PHIEU_NHAP_KHO) REFERENCES PhieuNhapKho(MA_PHIEU_NHAP_KHO);

-- LoHang
ALTER TABLE LoHang ADD CONSTRAINT FK_LoHang_MatHang FOREIGN KEY (MA_MAT_HANG) REFERENCES MatHang(MA_MAT_HANG);
ALTER TABLE LoHang ADD CONSTRAINT FK_LoHang_PhieuNhapKho FOREIGN KEY (MA_PHIEU_NHAP_KHO) REFERENCES PhieuNhapKho(MA_PHIEU_NHAP_KHO);

-- TonTheoViTri
ALTER TABLE TonTheoViTri ADD CONSTRAINT FK_TonViTri_MatHang FOREIGN KEY (MA_MAT_HANG) REFERENCES MatHang(MA_MAT_HANG);
ALTER TABLE TonTheoViTri ADD CONSTRAINT FK_TonViTri_LoHang FOREIGN KEY (MA_LO_HANG) REFERENCES LoHang(MA_LO_HANG);
ALTER TABLE TonTheoViTri ADD CONSTRAINT FK_TonViTri_ViTriKho FOREIGN KEY (MA_VI_TRI) REFERENCES ViTriKho(MA_VI_TRI);
ALTER TABLE TonTheoViTri ADD CONSTRAINT FK_TonViTri_CTPNK FOREIGN KEY (MA_CHI_TIET_PNK) REFERENCES ChiTietPhieuNhapKho(MA_CHI_TIET_PNK);

-- TheKho
ALTER TABLE TheKho ADD CONSTRAINT FK_TheKho_MatHang FOREIGN KEY (MA_MAT_HANG) REFERENCES MatHang(MA_MAT_HANG);
ALTER TABLE TheKho ADD CONSTRAINT FK_TheKho_NguoiLapThe FOREIGN KEY (NGUOI_LAP_THE) REFERENCES NhanVien(MA_NHAN_VIEN);

-- DongTheKho
ALTER TABLE DongTheKho ADD CONSTRAINT FK_DongTheKho_TheKho FOREIGN KEY (MA_THE_KHO) REFERENCES TheKho(MA_THE_KHO);
ALTER TABLE DongTheKho ADD CONSTRAINT FK_DongTheKho_NguoiGhi FOREIGN KEY (NGUOI_GHI) REFERENCES NhanVien(MA_NHAN_VIEN);

-- BienDongTonKho
ALTER TABLE BienDongTonKho ADD CONSTRAINT FK_BienDongTon_MatHang FOREIGN KEY (MA_MAT_HANG) REFERENCES MatHang(MA_MAT_HANG);
ALTER TABLE BienDongTonKho ADD CONSTRAINT FK_BienDongTon_LoHang FOREIGN KEY (MA_LO_HANG) REFERENCES LoHang(MA_LO_HANG);
ALTER TABLE BienDongTonKho ADD CONSTRAINT FK_BienDongTon_ViTriKho FOREIGN KEY (MA_VI_TRI) REFERENCES ViTriKho(MA_VI_TRI);
ALTER TABLE BienDongTonKho ADD CONSTRAINT FK_BienDongTon_NguoiThucHien FOREIGN KEY (NGUOI_THUC_HIEN) REFERENCES NhanVien(MA_NHAN_VIEN);

-- PhieuBaoCaoHangLoi
ALTER TABLE PhieuBaoCaoHangLoi ADD CONSTRAINT FK_PhieuBaoCao_NguoiLap FOREIGN KEY (NGUOI_LAP) REFERENCES NhanVien(MA_NHAN_VIEN);

-- ChiTietPhieuBaoCaoHangLoi
ALTER TABLE ChiTietPhieuBaoCaoHangLoi ADD CONSTRAINT FK_CTPhieuBaoCao_PhieuBaoCao FOREIGN KEY (MA_PHIEU_BAO_CAO) REFERENCES PhieuBaoCaoHangLoi(MA_PHIEU_BAO_CAO);
ALTER TABLE ChiTietPhieuBaoCaoHangLoi ADD CONSTRAINT FK_CTPhieuBaoCao_MatHang FOREIGN KEY (MA_MAT_HANG) REFERENCES MatHang(MA_MAT_HANG);
ALTER TABLE ChiTietPhieuBaoCaoHangLoi ADD CONSTRAINT FK_CTPhieuBaoCao_LoHang FOREIGN KEY (MA_LO_HANG) REFERENCES LoHang(MA_LO_HANG);
ALTER TABLE ChiTietPhieuBaoCaoHangLoi ADD CONSTRAINT FK_CTPhieuBaoCao_ViTriKho FOREIGN KEY (MA_VI_TRI) REFERENCES ViTriKho(MA_VI_TRI);

-- PhieuCachLyHang
ALTER TABLE PhieuCachLyHang ADD CONSTRAINT FK_PhieuCachLy_PhieuBaoCao FOREIGN KEY (MA_PHIEU_BAO_CAO) REFERENCES PhieuBaoCaoHangLoi(MA_PHIEU_BAO_CAO);
ALTER TABLE PhieuCachLyHang ADD CONSTRAINT FK_PhieuCachLy_NguoiThucHien FOREIGN KEY (NGUOI_THUC_HIEN) REFERENCES NhanVien(MA_NHAN_VIEN);
ALTER TABLE PhieuCachLyHang ADD CONSTRAINT FK_PhieuCachLy_ViTriKho FOREIGN KEY (VI_TRI_CACH_LY) REFERENCES ViTriKho(MA_VI_TRI);

-- PhuongAnXuLyHangLoi
ALTER TABLE PhuongAnXuLyHangLoi ADD CONSTRAINT FK_PhuongAnHangLoi_PhieuBaoCao FOREIGN KEY (MA_PHIEU_BAO_CAO) REFERENCES PhieuBaoCaoHangLoi(MA_PHIEU_BAO_CAO);
ALTER TABLE PhuongAnXuLyHangLoi ADD CONSTRAINT FK_PhuongAnHangLoi_NguoiChon FOREIGN KEY (NGUOI_CHON_PHUONG_AN) REFERENCES NhanVien(MA_NHAN_VIEN);

-- LenhXuLyHangLoi
ALTER TABLE LenhXuLyHangLoi ADD CONSTRAINT FK_LenhXuLy_PhuongAn FOREIGN KEY (MA_PHUONG_AN) REFERENCES PhuongAnXuLyHangLoi(MA_PHUONG_AN);
ALTER TABLE LenhXuLyHangLoi ADD CONSTRAINT FK_LenhXuLy_NguoiDuocPhanCong FOREIGN KEY (NGUOI_DUOC_PHAN_CONG) REFERENCES NhanVien(MA_NHAN_VIEN);

-- BienBanTieuHuy
ALTER TABLE BienBanTieuHuy ADD CONSTRAINT FK_BBTieuHuy_LenhXuLy FOREIGN KEY (MA_LENH_XU_LY) REFERENCES LenhXuLyHangLoi(MA_LENH_XU_LY);
ALTER TABLE BienBanTieuHuy ADD CONSTRAINT FK_BBTieuHuy_NguoiThucHien FOREIGN KEY (NGUOI_THUC_HIEN) REFERENCES NhanVien(MA_NHAN_VIEN);
ALTER TABLE BienBanTieuHuy ADD CONSTRAINT FK_BBTieuHuy_NguoiChungKien FOREIGN KEY (NGUOI_CHUNG_KIEN) REFERENCES NhanVien(MA_NHAN_VIEN);

-- PhieuTraNhaCungCap
ALTER TABLE PhieuTraNhaCungCap ADD CONSTRAINT FK_PhieuTraNCC_LenhXuLy FOREIGN KEY (MA_LENH_XU_LY) REFERENCES LenhXuLyHangLoi(MA_LENH_XU_LY);
ALTER TABLE PhieuTraNhaCungCap ADD CONSTRAINT FK_PhieuTraNCC_NhaCungCap FOREIGN KEY (MA_NHA_CUNG_CAP) REFERENCES NhaCungCap(MA_NHA_CUNG_CAP);
ALTER TABLE PhieuTraNhaCungCap ADD CONSTRAINT FK_PhieuTraNCC_NguoiLap FOREIGN KEY (NGUOI_LAP) REFERENCES NhanVien(MA_NHAN_VIEN);

-- HoSoXuLyHangLoi
ALTER TABLE HoSoXuLyHangLoi ADD CONSTRAINT FK_HoSoXuLyHangLoi_PhieuBaoCao FOREIGN KEY (MA_PHIEU_BAO_CAO) REFERENCES PhieuBaoCaoHangLoi(MA_PHIEU_BAO_CAO);
ALTER TABLE HoSoXuLyHangLoi ADD CONSTRAINT FK_HoSoXuLyHangLoi_PhuongAn FOREIGN KEY (MA_PHUONG_AN) REFERENCES PhuongAnXuLyHangLoi(MA_PHUONG_AN);
ALTER TABLE HoSoXuLyHangLoi ADD CONSTRAINT FK_HoSoXuLyHangLoi_LenhXuLy FOREIGN KEY (MA_LENH_XU_LY) REFERENCES LenhXuLyHangLoi(MA_LENH_XU_LY);

-- ThanhVienKiemKe
ALTER TABLE ThanhVienKiemKe ADD CONSTRAINT FK_TVKiemKe_NhomKiemKe FOREIGN KEY (MA_NHOM_KIEM_KE) REFERENCES NhomKiemKe(MA_NHOM_KIEM_KE);
ALTER TABLE ThanhVienKiemKe ADD CONSTRAINT FK_TVKiemKe_NhanVien FOREIGN KEY (MA_NHAN_VIEN) REFERENCES NhanVien(MA_NHAN_VIEN);

-- DotKiemKe
ALTER TABLE DotKiemKe ADD CONSTRAINT FK_DotKiemKe_Kho FOREIGN KEY (MA_KHO) REFERENCES Kho(MA_KHO);
ALTER TABLE DotKiemKe ADD CONSTRAINT FK_DotKiemKe_NguoiLap FOREIGN KEY (NGUOI_LAP) REFERENCES NhanVien(MA_NHAN_VIEN);

-- PhieuKiemKe
ALTER TABLE PhieuKiemKe ADD CONSTRAINT FK_PhieuKiemKe_DotKiemKe FOREIGN KEY (MA_DOT_KIEM_KE) REFERENCES DotKiemKe(MA_DOT_KIEM_KE);
ALTER TABLE PhieuKiemKe ADD CONSTRAINT FK_PhieuKiemKe_NhomKiemKe FOREIGN KEY (MA_NHOM_KIEM_KE) REFERENCES NhomKiemKe(MA_NHOM_KIEM_KE);
ALTER TABLE PhieuKiemKe ADD CONSTRAINT FK_PhieuKiemKe_NguoiPhuTrach FOREIGN KEY (NGUOI_PHU_TRACH) REFERENCES NhanVien(MA_NHAN_VIEN);

-- NhiemVuKiemKe
ALTER TABLE NhiemVuKiemKe ADD CONSTRAINT FK_NhiemVuKiemKe_DotKiemKe FOREIGN KEY (MA_DOT_KIEM_KE) REFERENCES DotKiemKe(MA_DOT_KIEM_KE);
ALTER TABLE NhiemVuKiemKe ADD CONSTRAINT FK_NhiemVuKiemKe_NguoiDuocPhanCong FOREIGN KEY (NGUOI_DUOC_PHAN_CONG) REFERENCES NhanVien(MA_NHAN_VIEN);

-- ChiTietKiemKe
ALTER TABLE ChiTietKiemKe ADD CONSTRAINT FK_CTKiemKe_PhieuKiemKe FOREIGN KEY (MA_PHIEU_KIEM_KE) REFERENCES PhieuKiemKe(MA_PHIEU_KIEM_KE);
ALTER TABLE ChiTietKiemKe ADD CONSTRAINT FK_CTKiemKe_MatHang FOREIGN KEY (MA_MAT_HANG) REFERENCES MatHang(MA_MAT_HANG);
ALTER TABLE ChiTietKiemKe ADD CONSTRAINT FK_CTKiemKe_LoHang FOREIGN KEY (MA_LO_HANG) REFERENCES LoHang(MA_LO_HANG);
ALTER TABLE ChiTietKiemKe ADD CONSTRAINT FK_CTKiemKe_ViTriHeThong FOREIGN KEY (MA_VI_TRI_HE_THONG) REFERENCES ViTriKho(MA_VI_TRI);
ALTER TABLE ChiTietKiemKe ADD CONSTRAINT FK_CTKiemKe_ViTriThucTe FOREIGN KEY (MA_VI_TRI_THUC_TE) REFERENCES ViTriKho(MA_VI_TRI);

-- BienBanKiemKe
ALTER TABLE BienBanKiemKe ADD CONSTRAINT FK_BBKiemKe_DotKiemKe FOREIGN KEY (MA_DOT_KIEM_KE) REFERENCES DotKiemKe(MA_DOT_KIEM_KE);
ALTER TABLE BienBanKiemKe ADD CONSTRAINT FK_BBKiemKe_NguoiLap FOREIGN KEY (NGUOI_LAP) REFERENCES NhanVien(MA_NHAN_VIEN);
ALTER TABLE BienBanKiemKe ADD CONSTRAINT FK_BBKiemKe_DaiDienQuanLyKho FOREIGN KEY (DAI_DIEN_QUAN_LY_KHO) REFERENCES NhanVien(MA_NHAN_VIEN);
ALTER TABLE BienBanKiemKe ADD CONSTRAINT FK_BBKiemKe_DaiDienThuKho FOREIGN KEY (DAI_DIEN_THU_KHO) REFERENCES NhanVien(MA_NHAN_VIEN);
ALTER TABLE BienBanKiemKe ADD CONSTRAINT FK_BBKiemKe_DaiDienKeToan FOREIGN KEY (DAI_DIEN_KE_TOAN) REFERENCES NhanVien(MA_NHAN_VIEN);

-- ChiTietBienBanKiemKe
ALTER TABLE ChiTietBienBanKiemKe ADD CONSTRAINT FK_CTBBKiemKe_BBKiemKe FOREIGN KEY (MA_BIEN_BAN_KIEM_KE) REFERENCES BienBanKiemKe(MA_BIEN_BAN_KIEM_KE);
ALTER TABLE ChiTietBienBanKiemKe ADD CONSTRAINT FK_CTBBKiemKe_CTKiemKe FOREIGN KEY (MA_CHI_TIET_KIEM_KE) REFERENCES ChiTietKiemKe(MA_CHI_TIET_KIEM_KE);
ALTER TABLE ChiTietBienBanKiemKe ADD CONSTRAINT FK_CTBBKiemKe_MatHang FOREIGN KEY (MA_MAT_HANG) REFERENCES MatHang(MA_MAT_HANG);
ALTER TABLE ChiTietBienBanKiemKe ADD CONSTRAINT FK_CTBBKiemKe_LoHang FOREIGN KEY (MA_LO_HANG) REFERENCES LoHang(MA_LO_HANG);
ALTER TABLE ChiTietBienBanKiemKe ADD CONSTRAINT FK_CTBBKiemKe_ViTriKho FOREIGN KEY (MA_VI_TRI) REFERENCES ViTriKho(MA_VI_TRI);
ALTER TABLE ChiTietBienBanKiemKe ADD CONSTRAINT FK_CTBBKiemKe_DonViTinh FOREIGN KEY (MA_DON_VI_TINH) REFERENCES DonViTinh(MA_DON_VI_TINH);

-- HoSoXuLySaiLechTonKho
ALTER TABLE HoSoXuLySaiLechTonKho ADD CONSTRAINT FK_HoSoSaiLech_NguoiPhatHien FOREIGN KEY (NGUOI_PHAT_HIEN) REFERENCES NhanVien(MA_NHAN_VIEN);
ALTER TABLE HoSoXuLySaiLechTonKho ADD CONSTRAINT FK_HoSoSaiLech_NguoiXuLy FOREIGN KEY (NGUOI_XU_LY) REFERENCES NhanVien(MA_NHAN_VIEN);

-- ChiTietSaiLechTonKho
ALTER TABLE ChiTietSaiLechTonKho ADD CONSTRAINT FK_CTSaiLech_HoSo FOREIGN KEY (MA_HO_SO) REFERENCES HoSoXuLySaiLechTonKho(MA_HO_SO);
ALTER TABLE ChiTietSaiLechTonKho ADD CONSTRAINT FK_CTSaiLech_MatHang FOREIGN KEY (MA_MAT_HANG) REFERENCES MatHang(MA_MAT_HANG);
ALTER TABLE ChiTietSaiLechTonKho ADD CONSTRAINT FK_CTSaiLech_LoHang FOREIGN KEY (MA_LO_HANG) REFERENCES LoHang(MA_LO_HANG);
ALTER TABLE ChiTietSaiLechTonKho ADD CONSTRAINT FK_CTSaiLech_ViTriKho FOREIGN KEY (MA_VI_TRI) REFERENCES ViTriKho(MA_VI_TRI);
ALTER TABLE ChiTietSaiLechTonKho ADD CONSTRAINT FK_CTSaiLech_DonViTinh FOREIGN KEY (MA_DON_VI_TINH) REFERENCES DonViTinh(MA_DON_VI_TINH);

-- PhieuKiemKeXacMinh
ALTER TABLE PhieuKiemKeXacMinh ADD CONSTRAINT FK_PhieuKKXM_HoSo FOREIGN KEY (MA_HO_SO) REFERENCES HoSoXuLySaiLechTonKho(MA_HO_SO);
ALTER TABLE PhieuKiemKeXacMinh ADD CONSTRAINT FK_PhieuKKXM_NguoiKiemKe FOREIGN KEY (NGUOI_KIEM_KE) REFERENCES NhanVien(MA_NHAN_VIEN);

-- ChiTietPhieuKiemKeXacMinh
ALTER TABLE ChiTietPhieuKiemKeXacMinh ADD CONSTRAINT FK_CTPhieuKKXM_PhieuKKXM FOREIGN KEY (MA_PHIEU_KKXM) REFERENCES PhieuKiemKeXacMinh(MA_PHIEU_KKXM);
ALTER TABLE ChiTietPhieuKiemKeXacMinh ADD CONSTRAINT FK_CTPhieuKKXM_MatHang FOREIGN KEY (MA_MAT_HANG) REFERENCES MatHang(MA_MAT_HANG);
ALTER TABLE ChiTietPhieuKiemKeXacMinh ADD CONSTRAINT FK_CTPhieuKKXM_LoHang FOREIGN KEY (MA_LO_HANG) REFERENCES LoHang(MA_LO_HANG);
ALTER TABLE ChiTietPhieuKiemKeXacMinh ADD CONSTRAINT FK_CTPhieuKKXM_ViTriKho FOREIGN KEY (MA_VI_TRI) REFERENCES ViTriKho(MA_VI_TRI);

-- PhuongAnXuLySaiLech
ALTER TABLE PhuongAnXuLySaiLech ADD CONSTRAINT FK_PhuongAnSaiLech_HoSo FOREIGN KEY (MA_HO_SO) REFERENCES HoSoXuLySaiLechTonKho(MA_HO_SO);
ALTER TABLE PhuongAnXuLySaiLech ADD CONSTRAINT FK_PhuongAnSaiLech_NguoiChon FOREIGN KEY (NGUOI_CHON_PHUONG_AN) REFERENCES NhanVien(MA_NHAN_VIEN);

-- PheDuyetPhuongAnSaiLech
ALTER TABLE PheDuyetPhuongAnSaiLech ADD CONSTRAINT FK_PheDuyet_PhuongAn FOREIGN KEY (MA_PHUONG_AN) REFERENCES PhuongAnXuLySaiLech(MA_PHUONG_AN);
ALTER TABLE PheDuyetPhuongAnSaiLech ADD CONSTRAINT FK_PheDuyet_NguoiPheDuyet FOREIGN KEY (NGUOI_PHE_DUYET) REFERENCES NhanVien(MA_NHAN_VIEN);

-- NhiemVuXuLySaiLech
ALTER TABLE NhiemVuXuLySaiLech ADD CONSTRAINT FK_NhiemVuSaiLech_HoSo FOREIGN KEY (MA_HO_SO) REFERENCES HoSoXuLySaiLechTonKho(MA_HO_SO);
ALTER TABLE NhiemVuXuLySaiLech ADD CONSTRAINT FK_NhiemVuSaiLech_NguoiDuocPhanCong FOREIGN KEY (NGUOI_DUOC_PHAN_CONG) REFERENCES NhanVien(MA_NHAN_VIEN);

-- TepDinhKem
ALTER TABLE TepDinhKem ADD CONSTRAINT FK_TepDinhKem_NguoiTaiLen FOREIGN KEY (NGUOI_TAI_LEN) REFERENCES NhanVien(MA_NHAN_VIEN);

-- NhatKyThaoTac
ALTER TABLE NhatKyThaoTac ADD CONSTRAINT FK_NhatKyThaoTac_NguoiThaoTac FOREIGN KEY (NGUOI_THAO_TAC) REFERENCES NhanVien(MA_NHAN_VIEN);

GO

/* =====================================================================
   GHI CHÚ:
   - MA_CHUNG_TU (BienDongTonKho, DongTheKho), MA_DOI_TUONG (NhatKyThaoTac),
     MA_DOI_TUONG_LIEN_KET (TepDinhKem) là tham chiếu đa hình (có thể trỏ
     tới nhiều loại bảng chứng từ khác nhau tùy LOAI_CHUNG_TU/HANH_DONG),
     nên KHÔNG đặt FK cứng cho các cột này - đúng với thiết kế gốc.
   - Toàn bộ FK dùng hành vi mặc định (NO ACTION) khi xóa/sửa. Nếu cần
     ON DELETE CASCADE/SET NULL ở chỗ nào, có thể chỉnh lại riêng.
   - Script này chỉ tạo cấu trúc (DDL), CHƯA có lệnh INSERT dữ liệu.
   ===================================================================== */
