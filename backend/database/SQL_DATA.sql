f/* =====================================================================
   HỆ THỐNG QUẢN LÝ KHO VẬN HÀNG - DỮ LIỆU MẪU ĐỒNG BỘ (DML ONLY)
   Mỗi bảng chứa chính xác 8 bản ghi (từ 1 đến 8), khớp hoàn toàn các FK.
   Các trường chức vụ (CHUC_VU) bao gồm: Quản lý kho, Thủ kho, Kế toán, KCS, Kiểm kê.
   ===================================================================== */

USE QL_KHO1;
GO

-- =====================================================================
-- DỌN DẸP DỮ LIỆU CŨ TRƯỚC KHI NHẬP (Thứ tự ngược để tránh lỗi FK)
-- =====================================================================
DELETE FROM NhatKyThaoTac;
DELETE FROM TepDinhKem;
DELETE FROM ChiTietPhieuKiemKeXacMinh;
DELETE FROM PhieuKiemKeXacMinh;
DELETE FROM ChiTietSaiLechTonKho;
DELETE FROM NhiemVuXuLySaiLech;
DELETE FROM PheDuyetPhuongAnSaiLech;
DELETE FROM PhuongAnXuLySaiLech;
DELETE FROM HoSoXuLySaiLechTonKho;
DELETE FROM ChiTietBienBanKiemKe;
DELETE FROM BienBanKiemKe;
DELETE FROM ChiTietKiemKe;
DELETE FROM NhiemVuKiemKe;
DELETE FROM PhieuKiemKe;
DELETE FROM DotKiemKe;
DELETE FROM ThanhVienKiemKe;
DELETE FROM NhomKiemKe;
DELETE FROM PhieuTraNhaCungCap;
DELETE FROM BienBanTieuHuy;
DELETE FROM LenhXuLyHangLoi;
DELETE FROM PhuongAnXuLyHangLoi;
DELETE FROM PhieuCachLyHang;
DELETE FROM ChiTietPhieuBaoCaoHangLoi;
DELETE FROM PhieuBaoCaoHangLoi;
DELETE FROM HoSoXuLyHangLoi;
DELETE FROM BienDongTonKho;
DELETE FROM DongTheKho;
DELETE FROM TheKho;
DELETE FROM TonTheoViTri;
DELETE FROM LoHang;
DELETE FROM HoSoDotNhap;
DELETE FROM ChiTietPhieuNhapKho;
DELETE FROM PhieuNhapKho;
DELETE FROM ChiTietBienBanKiemNghiem;
DELETE FROM BienBanKiemNghiem;
DELETE FROM ChiTietBienBanGiaoNhan;
DELETE FROM BienBanGiaoNhan;
DELETE FROM ChiTietChungTuGiaoHang;
DELETE FROM ChungTuGiaoHang;
DELETE FROM ChiTietDonMuaHang;
DELETE FROM DonMuaHang;
DELETE FROM YeuCauMuaBoSung;
DELETE FROM PhuongAnXuLyCanhBao;
DELETE FROM KetQuaXacMinhCanhBao;
DELETE FROM NhiemVuXacMinhCanhBao;
DELETE FROM ChiTietCanhBaoTonKho;
DELETE FROM CauHinhDinhMucTon;
DELETE FROM CanhBaoTonKho;
DELETE FROM DanhMucViTriKhuyenNghi;
DELETE FROM QuyCachDongGoi;
DELETE FROM MatHang;
DELETE FROM ViTriKho;
DELETE FROM DonViTinh;
DELETE FROM Kho;
DELETE FROM NhaCungCap;
DELETE FROM TaiKhoan;
DELETE FROM NhanVien;
GO

-- =====================================================================
-- NHẬP DỮ LIỆU MẪU ĐỒNG BỘ
-- =====================================================================
-- 1. NhanVien (Khớp chức vụ: Quản lý kho, Thủ kho, Kế toán, KCS, Kiểm kê)
INSERT INTO NhanVien (MA_NHAN_VIEN, HO_TEN, CHUC_VU, SO_DIEN_THOAI, EMAIL, TRANG_THAI) VALUES
('NV01', N'Nguyễn Văn An', N'Quản lý kho', '0911000001', 'nhanvien1@khohang.vn', N'Đang làm việc'),
('NV02', N'Trần Thị Bình', N'Thủ kho', '0911000002', 'nhanvien2@khohang.vn', N'Đang làm việc'),
('NV03', N'Lê Văn Cường', N'Thủ kho', '0911000003', 'nhanvien3@khohang.vn', N'Đang làm việc'),
('NV04', N'Phạm Thị Dung', N'Kế toán', '0911000004', 'nhanvien4@khohang.vn', N'Đang làm việc'),
('NV05', N'Hoàng Văn Em', N'KCS', '0911000005', 'nhanvien5@khohang.vn', N'Đang làm việc'),
('NV06', N'Vũ Thị Phương', N'Kiểm kê', '0911000006', 'nhanvien6@khohang.vn', N'Đang làm việc'),
('NV07', N'Đặng Văn Giang', N'Kiểm kê', '0911000007', 'nhanvien7@khohang.vn', N'Đang làm việc'),
('NV08', N'Bùi Thị Hoa', N'Thủ kho', '0911000008', 'nhanvien8@khohang.vn', N'Đang làm việc');
GO

-- 2. NhaCungCap
INSERT INTO NhaCungCap (MA_NHA_CUNG_CAP, TEN_NHA_CUNG_CAP, DIA_CHI, SO_DIEN_THOAI, EMAIL, MA_SO_THUE, NGUOI_DAI_DIEN, TRANG_THAI) VALUES
('NCC01', N'Công ty CP Vinamilk Việt Nam', N'Địa chỉ NCC 1', '0240000001', 'ncc1@gmail.com', '0102030401', N'Đại diện 1', N'Đang hợp tác'),
('NCC02', N'Tập đoàn Unilever Việt Nam', N'Địa chỉ NCC 2', '0240000002', 'ncc2@gmail.com', '0102030402', N'Đại diện 2', N'Đang hợp tác'),
('NCC03', N'Công ty Thực phẩm Acecook', N'Địa chỉ NCC 3', '0240000003', 'ncc3@gmail.com', '0102030403', N'Đại diện 3', N'Đang hợp tác'),
('NCC04', N'Công ty TNHH Procter & Gamble (P&G)', N'Địa chỉ NCC 4', '0240000004', 'ncc4@gmail.com', '0102030404', N'Đại diện 4', N'Đang hợp tác'),
('NCC05', N'Công ty Giấy Pulppy Việt Nam', N'Địa chỉ NCC 5', '0240000005', 'ncc5@gmail.com', '0102030405', N'Đại diện 5', N'Đang hợp tác'),
('NCC06', N'Tổng công ty Lương thực Miền Bắc', N'Địa chỉ NCC 6', '0240000006', 'ncc6@gmail.com', '0102030406', N'Đại diện 6', N'Đang hợp tác'),
('NCC07', N'Công ty Nước giải khát Suntory PepsiCo', N'Địa chỉ NCC 7', '0240000007', 'ncc7@gmail.com', '0102030407', N'Đại diện 7', N'Đang hợp tác'),
('NCC08', N'Công ty CP Thực Phẩm An Khang', N'Địa chỉ NCC 8', '0240000008', 'ncc8@gmail.com', '0102030408', N'Đại diện 8', N'Đang hợp tác');
GO

-- 3. Kho
INSERT INTO Kho (MA_KHO, TEN_KHO, DIA_CHI, SIEU_THI_GAN_NHAT, TRANG_THAI) VALUES
('KHO01', N'Kho Tổng Hà Nội', N'Địa chỉ kho 1', N'Siêu thị gần nhất 1', N'Đang hoạt động'),
('KHO02', N'Kho Chi Nhánh Đà Nẵng', N'Địa chỉ kho 2', N'Siêu thị gần nhất 2', N'Đang hoạt động'),
('KHO03', N'Kho Lạnh Hồ Chí Minh', N'Địa chỉ kho 3', N'Siêu thị gần nhất 3', N'Đang hoạt động'),
('KHO04', N'Kho Phân Phối Cần Thơ', N'Địa chỉ kho 4', N'Siêu thị gần nhất 4', N'Đang hoạt động'),
('KHO05', N'Kho Trung Chuyển Hải Phòng', N'Địa chỉ kho 5', N'Siêu thị gần nhất 5', N'Đang hoạt động'),
('KHO06', N'Kho Phụ Tùng Bắc Ninh', N'Địa chỉ kho 6', N'Siêu thị gần nhất 6', N'Đang hoạt động'),
('KHO07', N'Kho Nguyên Liệu Đồng Nai', N'Địa chỉ kho 7', N'Siêu thị gần nhất 7', N'Đang hoạt động'),
('KHO08', N'Kho Thành Phẩm Bình Dương', N'Địa chỉ kho 8', N'Siêu thị gần nhất 8', N'Đang hoạt động');
GO

-- 4. DonViTinh
INSERT INTO DonViTinh (MA_DON_VI_TINH, TEN_DON_VI_TINH, MO_TA) VALUES
('DVT01', N'Thùng', N'Mô tả đơn vị Thùng'),
('DVT02', N'Hộp', N'Mô tả đơn vị Hộp'),
('DVT03', N'Túi', N'Mô tả đơn vị Túi'),
('DVT04', N'Chai', N'Mô tả đơn vị Chai'),
('DVT05', N'Cái', N'Mô tả đơn vị Cái'),
('DVT06', N'Lít', N'Mô tả đơn vị Lít'),
('DVT07', N'Kg', N'Mô tả đơn vị Kg'),
('DVT08', N'Cuộn', N'Mô tả đơn vị Cuộn');
GO

-- 5. NhomKiemKe
INSERT INTO NhomKiemKe (MA_NHOM_KIEM_KE, TEN_NHOM, GHI_CHU) VALUES
('NKK01', N'Nhóm Kiểm Kê Khu A', N'Phụ trách kiểm kê nhóm 1'),
('NKK02', N'Nhóm Kiểm Kê Khu B', N'Phụ trách kiểm kê nhóm 2'),
('NKK03', N'Nhóm Kiểm Kê Khu Lạnh', N'Phụ trách kiểm kê nhóm 3'),
('NKK04', N'Nhóm Kiểm Kê Hóa Mỹ Phẩm', N'Phụ trách kiểm kê nhóm 4'),
('NKK05', N'Nhóm Kiểm Kê Tiêu Dùng', N'Phụ trách kiểm kê nhóm 5'),
('NKK06', N'Nhóm Kiểm Kê Thực Phẩm', N'Phụ trách kiểm kê nhóm 6'),
('NKK07', N'Nhóm Kiểm Kê Định Kỳ Hằng Tháng', N'Phụ trách kiểm kê nhóm 7'),
('NKK08', N'Nhóm Kiểm Kê Đột Xuất', N'Phụ trách kiểm kê nhóm 8');
GO

-- 6. ViTriKho
INSERT INTO ViTriKho (MA_VI_TRI, MA_KHO, KHU, DAY, KE, TANG, O, LOAI_VI_TRI, DIEU_KIEN_BAO_QUAN, SUC_CHUA, TRANG_THAI_VI_TRI) VALUES
('VT0001', 'KHO01', N'Khu A', N'Dãy 1', N'Kệ 1', N'Tầng 1', N'Ô 1', N'Thường', N'Điều kiện bảo quản 1', 100 * 1, N'Đang chứa hàng'),
('VT0002', 'KHO02', N'Khu A', N'Dãy 2', N'Kệ 2', N'Tầng 2', N'Ô 2', N'Thường', N'Điều kiện bảo quản 2', 100 * 2, N'Đang chứa hàng'),
('VT0003', 'KHO03', N'Khu B', N'Dãy 3', N'Kệ 3', N'Tầng 3', N'Ô 3', N'Thường', N'Điều kiện bảo quản 3', 100 * 3, N'Đang chứa hàng'),
('VT0004', 'KHO04', N'Khu B', N'Dãy 4', N'Kệ 4', N'Tầng 4', N'Ô 4', N'Thường', N'Điều kiện bảo quản 4', 100 * 4, N'Đang chứa hàng'),
('VT0005', 'KHO05', N'Khu Lạnh', N'Dãy 5', N'Kệ 5', N'Tầng 5', N'Ô 5', N'Lạnh', N'Điều kiện bảo quản 5', 100 * 5, N'Đang chứa hàng'),
('VT0006', 'KHO06', N'Khu Cách Ly', N'Dãy 6', N'Kệ 6', N'Tầng 6', N'Ô 6', N'Cách ly', N'Điều kiện bảo quản 6', 100 * 6, N'Đang chứa hàng'),
('VT0007', 'KHO07', N'Khu Hóa Chất', N'Dãy 7', N'Kệ 7', N'Tầng 7', N'Ô 7', N'Hóa chất', N'Điều kiện bảo quản 7', 100 * 7, N'Đang chứa hàng'),
('VT0008', 'KHO08', N'Khu Phế Phẩm', N'Dãy 8', N'Kệ 8', N'Tầng 8', N'Ô 8', N'Phế phẩm', N'Điều kiện bảo quản 8', 100 * 8, N'Đang chứa hàng');
GO

-- 7. MatHang
INSERT INTO MatHang (MA_MAT_HANG, TEN_MAT_HANG, NHOM_HANG, MA_DON_VI_TINH_NHAP, QUY_CACH_DONG_GOI, CO_HAN_SU_DUNG, DIEU_KIEN_BAO_QUAN, TRANG_THAI) VALUES
('MH001', N'Sữa tươi Vinamilk 1L', N'Thực phẩm', 'DVT01', N'Quy cách đóng gói 1', 1, N'Điều kiện bảo quản 1', N'Đang kinh doanh'),
('MH002', N'Nước rửa tay Lifebuoy 500ml', N'Hóa phẩm', 'DVT02', N'Quy cách đóng gói 2', 1, N'Điều kiện bảo quản 2', N'Đang kinh doanh'),
('MH003', N'Mì gói Hảo Hảo Tôm Chua Cay', N'Thực phẩm', 'DVT03', N'Quy cách đóng gói 3', 1, N'Điều kiện bảo quản 3', N'Đang kinh doanh'),
('MH004', N'Dầu gội đầu Sunsilk 650ml', N'Mỹ phẩm', 'DVT04', N'Quy cách đóng gói 4', 1, N'Điều kiện bảo quản 4', N'Đang kinh doanh'),
('MH005', N'Giấy vệ sinh Pulppy 10 cuộn', N'Hóa phẩm', 'DVT05', N'Quy cách đóng gói 5', 1, N'Điều kiện bảo quản 5', N'Đang kinh doanh'),
('MH006', N'Nước xả vải Downy 1.8L', N'Hóa phẩm', 'DVT06', N'Quy cách đóng gói 6', 1, N'Điều kiện bảo quản 6', N'Đang kinh doanh'),
('MH007', N'Gạo tẻ thơm ST25 5kg', N'Thực phẩm', 'DVT07', N'Quy cách đóng gói 7', 1, N'Điều kiện bảo quản 7', N'Đang kinh doanh'),
('MH008', N'Nước khoáng Aquafina 500ml', N'Đồ uống', 'DVT08', N'Quy cách đóng gói 8', 1, N'Điều kiện bảo quản 8', N'Đang kinh doanh');
GO

-- 8. QuyCachDongGoi
INSERT INTO QuyCachDongGoi (MA_QUY_CACH, MA_MAT_HANG, MA_DON_VI_NHAP, MA_DON_VI_CO_SO, SO_LUONG_QUY_DOI, MO_TA) VALUES
('QC001', 'MH001', 'DVT01', 'DVT05', 10 + 1, N'Mô tả quy cách đóng gói 1'),
('QC002', 'MH002', 'DVT01', 'DVT05', 10 + 2, N'Mô tả quy cách đóng gói 2'),
('QC003', 'MH003', 'DVT01', 'DVT05', 10 + 3, N'Mô tả quy cách đóng gói 3'),
('QC004', 'MH004', 'DVT01', 'DVT05', 10 + 4, N'Mô tả quy cách đóng gói 4'),
('QC005', 'MH005', 'DVT01', 'DVT05', 10 + 5, N'Mô tả quy cách đóng gói 5'),
('QC006', 'MH006', 'DVT01', 'DVT05', 10 + 6, N'Mô tả quy cách đóng gói 6'),
('QC007', 'MH007', 'DVT01', 'DVT05', 10 + 7, N'Mô tả quy cách đóng gói 7'),
('QC008', 'MH008', 'DVT01', 'DVT05', 10 + 8, N'Mô tả quy cách đóng gói 8');
GO

-- 9. DanhMucViTriKhuyenNghi
INSERT INTO DanhMucViTriKhuyenNghi (MA_DANH_MUC, MA_MAT_HANG, MA_VI_TRI, MUC_DO_UU_TIEN, GHI_CHU) VALUES
('DM001', 'MH001', 'VT0001', 1, N'Khuyến nghị vị trí cho Sữa tươi Vinamilk 1L'),
('DM002', 'MH002', 'VT0002', 1, N'Khuyến nghị vị trí cho Nước rửa tay Lifebuoy 500ml'),
('DM003', 'MH003', 'VT0003', 1, N'Khuyến nghị vị trí cho Mì gói Hảo Hảo Tôm Chua Cay'),
('DM004', 'MH004', 'VT0004', 1, N'Khuyến nghị vị trí cho Dầu gội đầu Sunsilk 650ml'),
('DM005', 'MH005', 'VT0005', 1, N'Khuyến nghị vị trí cho Giấy vệ sinh Pulppy 10 cuộn'),
('DM006', 'MH006', 'VT0006', 1, N'Khuyến nghị vị trí cho Nước xả vải Downy 1.8L'),
('DM007', 'MH007', 'VT0007', 1, N'Khuyến nghị vị trí cho Gạo tẻ thơm ST25 5kg'),
('DM008', 'MH008', 'VT0008', 1, N'Khuyến nghị vị trí cho Nước khoáng Aquafina 500ml');
GO

-- 10. TaiKhoan
INSERT INTO TaiKhoan (MA_TAI_KHOAN, MA_NHAN_VIEN, TEN_DANG_NHAP, MAT_KHAU_HASH, TRANG_THAI_TAI_KHOAN, NGAY_TAO, SO_LAN_DANG_NHAP_SAI) VALUES
('TK01', 'NV01', 'an.nv', '$2b$10$2c1ukE5P2.sj8gQn38Kg0O7vTlOXMiXnur0CsGLZp.JqNp1XAFsZG', N'Hoạt động', SYSDATETIME(), 0),
('TK02', 'NV02', 'binh.tt', '$2b$10$2c1ukE5P2.sj8gQn38Kg0O7vTlOXMiXnur0CsGLZp.JqNp1XAFsZG', N'Hoạt động', SYSDATETIME(), 0),
('TK03', 'NV03', 'cuong.lv', '$2b$10$2c1ukE5P2.sj8gQn38Kg0O7vTlOXMiXnur0CsGLZp.JqNp1XAFsZG', N'Hoạt động', SYSDATETIME(), 0),
('TK04', 'NV04', 'dung.pt', '$2b$10$2c1ukE5P2.sj8gQn38Kg0O7vTlOXMiXnur0CsGLZp.JqNp1XAFsZG', N'Hoạt động', SYSDATETIME(), 0),
('TK05', 'NV05', 'em.hv', '$2b$10$2c1ukE5P2.sj8gQn38Kg0O7vTlOXMiXnur0CsGLZp.JqNp1XAFsZG', N'Hoạt động', SYSDATETIME(), 0),
('TK06', 'NV06', 'phuong.vt', '$2b$10$2c1ukE5P2.sj8gQn38Kg0O7vTlOXMiXnur0CsGLZp.JqNp1XAFsZG', N'Hoạt động', SYSDATETIME(), 0),
('TK07', 'NV07', 'giang.dv', '$2b$10$2c1ukE5P2.sj8gQn38Kg0O7vTlOXMiXnur0CsGLZp.JqNp1XAFsZG', N'Hoạt động', SYSDATETIME(), 0),
('TK08', 'NV08', 'hoa.bt', '$2b$10$2c1ukE5P2.sj8gQn38Kg0O7vTlOXMiXnur0CsGLZp.JqNp1XAFsZG', N'Hoạt động', SYSDATETIME(), 0);
GO

-- 11. DonMuaHang
INSERT INTO DonMuaHang (MA_DON_MUA, MA_NHA_CUNG_CAP, MA_KHO_NHAN, NGAY_DAT, NGAY_DU_KIEN_GIAO, TONG_SO_LUONG_DAT, TONG_TIEN, TRANG_THAI, GHI_CHU) VALUES
('PO001', 'NCC01', 'KHO01', '2026-06-25', '2026-06-30', 100 * 1, 100000.00 * 1, N'Đang xử lý', N'Đơn đặt mua hàng số 1'),
('PO002', 'NCC02', 'KHO02', '2026-06-25', '2026-06-30', 100, 100000.00, N'Đang xử lý', N'Đơn đặt mua hàng số 2'),
('PO003', 'NCC03', 'KHO03', '2026-06-25', '2026-06-30', 100, 100000.00, N'Đang xử lý', N'Đơn đặt mua hàng số 3'),
('PO004', 'NCC04', 'KHO04', '2026-06-25', '2026-06-30', 100, 100000.00, N'Đang xử lý', N'Đơn đặt mua hàng số 4'),
('PO005', 'NCC05', 'KHO05', '2026-06-25', '2026-06-30', 100, 100000.00, N'Đang xử lý', N'Đơn đặt mua hàng số 5'),
('PO006', 'NCC06', 'KHO06', '2026-06-25', '2026-06-30', 100, 100000.00, N'Đang xử lý', N'Đơn đặt mua hàng số 6'),
('PO007', 'NCC07', 'KHO07', '2026-06-25', '2026-06-30', 100, 100000.00, N'Đang xử lý', N'Đơn đặt mua hàng số 7'),
('PO008', 'NCC08', 'KHO08', '2026-06-25', '2026-06-30', 100, 100000.00, N'Đang xử lý', N'Đơn đặt mua hàng số 8');
GO

-- 12. ChiTietDonMuaHang
INSERT INTO ChiTietDonMuaHang (MA_CHI_TIET_DON_MUA, MA_DON_MUA, MA_MAT_HANG, MA_DON_VI_TINH, SO_LUONG_DAT, SO_LUONG_DA_NHAP, SO_LUONG_CON_CHO_NHAN, DON_GIA, THANH_TIEN, GHI_CHU) VALUES
('CTPO1', 'PO001', 'MH001', 'DVT01', 100, 50, 50, 1000.00, 100000.00, N'Ghi chú đơn hàng chi tiết 1'),
('CTPO2', 'PO002', 'MH002', 'DVT02', 100, 50, 50, 1000.00, 100000.00, N'Ghi chú đơn hàng chi tiết 2'),
('CTPO3', 'PO003', 'MH003', 'DVT03', 100, 50, 50, 1000.00, 100000.00, N'Ghi chú đơn hàng chi tiết 3'),
('CTPO4', 'PO004', 'MH004', 'DVT04', 100, 50, 50, 1000.00, 100000.00, N'Ghi chú đơn hàng chi tiết 4'),
('CTPO5', 'PO005', 'MH005', 'DVT05', 100, 50, 50, 1000.00, 100000.00, N'Ghi chú đơn hàng chi tiết 5'),
('CTPO6', 'PO006', 'MH006', 'DVT06', 100, 50, 50, 1000.00, 100000.00, N'Ghi chú đơn hàng chi tiết 6'),
('CTPO7', 'PO007', 'MH007', 'DVT07', 100, 50, 50, 1000.00, 100000.00, N'Ghi chú đơn hàng chi tiết 7'),
('CTPO8', 'PO008', 'MH008', 'DVT08', 100, 50, 50, 1000.00, 100000.00, N'Ghi chú đơn hàng chi tiết 8');
GO

-- 13. ChungTuGiaoHang
INSERT INTO ChungTuGiaoHang (MA_CHUNG_TU_GIAO, SO_CHUNG_TU_BEN_GIAO, MA_DON_MUA, NGAY_GIAO, NGUOI_GIAO, SO_DIEN_THOAI_NGUOI_GIAO, FILE_CHUNG_TU, TRANG_THAI, GHI_CHU) VALUES
('CTG01', N'SOCTBEN01', 'PO001', '2026-06-29', N'Người giao đại diện 1', '0922000001', N'chungtu_file_1.pdf', N'Đã giao', N'Giao nhận chứng từ đợt 1'),
('CTG02', N'SOCTBEN02', 'PO002', '2026-06-29', N'Người giao đại diện 2', '0922000002', N'chungtu_file_2.pdf', N'Đã giao', N'Giao nhận chứng từ đợt 2'),
('CTG03', N'SOCTBEN03', 'PO003', '2026-06-29', N'Người giao đại diện 3', '0922000003', N'chungtu_file_3.pdf', N'Đã giao', N'Giao nhận chứng từ đợt 3'),
('CTG04', N'SOCTBEN04', 'PO004', '2026-06-29', N'Người giao đại diện 4', '0922000004', N'chungtu_file_4.pdf', N'Đã giao', N'Giao nhận chứng từ đợt 4'),
('CTG05', N'SOCTBEN05', 'PO005', '2026-06-29', N'Người giao đại diện 5', '0922000005', N'chungtu_file_5.pdf', N'Đã giao', N'Giao nhận chứng từ đợt 5'),
('CTG06', N'SOCTBEN06', 'PO006', '2026-06-29', N'Người giao đại diện 6', '0922000006', N'chungtu_file_6.pdf', N'Đã giao', N'Giao nhận chứng từ đợt 6'),
('CTG07', N'SOCTBEN07', 'PO007', '2026-06-29', N'Người giao đại diện 7', '0922000007', N'chungtu_file_7.pdf', N'Đã giao', N'Giao nhận chứng từ đợt 7'),
('CTG08', N'SOCTBEN08', 'PO008', '2026-06-29', N'Người giao đại diện 8', '0922000008', N'chungtu_file_8.pdf', N'Đã giao', N'Giao nhận chứng từ đợt 8');
GO

-- 14. ChiTietChungTuGiaoHang
INSERT INTO ChiTietChungTuGiaoHang (MA_CHI_TIET_CHUNG_TU, MA_CHUNG_TU_GIAO, MA_MAT_HANG, MA_DON_VI_TINH, SO_LUONG_THEO_CHUNG_TU, DON_GIA, THANH_TIEN, GHI_CHU) VALUES
('CTCT1', 'CTG01', 'MH001', 'DVT01', 100, 1000.00, 100000.00, N'Chi tiết hóa đơn giao 1'),
('CTCT2', 'CTG02', 'MH002', 'DVT02', 100, 1000.00, 100000.00, N'Chi tiết hóa đơn giao 2'),
('CTCT3', 'CTG03', 'MH003', 'DVT03', 100, 1000.00, 100000.00, N'Chi tiết hóa đơn giao 3'),
('CTCT4', 'CTG04', 'MH004', 'DVT04', 100, 1000.00, 100000.00, N'Chi tiết hóa đơn giao 4'),
('CTCT5', 'CTG05', 'MH005', 'DVT05', 100, 1000.00, 100000.00, N'Chi tiết hóa đơn giao 5'),
('CTCT6', 'CTG06', 'MH006', 'DVT06', 100, 1000.00, 100000.00, N'Chi tiết hóa đơn giao 6'),
('CTCT7', 'CTG07', 'MH007', 'DVT07', 100, 1000.00, 100000.00, N'Chi tiết hóa đơn giao 7'),
('CTCT8', 'CTG08', 'MH008', 'DVT08', 100, 1000.00, 100000.00, N'Chi tiết hóa đơn giao 8');
GO

-- 15. BienBanGiaoNhan
INSERT INTO BienBanGiaoNhan (MA_BIEN_BAN_GIAO_NHAN, MA_DON_MUA, MA_CHUNG_TU_GIAO, NGAY_LAP, MA_THU_KHO, NGUOI_GIAO, DIA_DIEM_GIAO_NHAN, TONG_SO_LUONG_THEO_CHUNG_TU, TONG_SO_LUONG_THUC_NHAN, TONG_SO_LUONG_DAT, TONG_SO_LUONG_KHONG_DAT, TRANG_THAI, GHI_CHU) VALUES
('BBGN01', 'PO001', 'CTG01', SYSDATETIME(), 'NV01', N'Người giao đại diện 1', N'Địa điểm giao 1', 100, 95, 90, 5, N'Đã hoàn thành', N'Biên bản số 1'),
('BBGN02', 'PO002', 'CTG02', SYSDATETIME(), 'NV02', N'Người giao đại diện 2', N'Địa điểm giao 2', 100, 95, 90, 5, N'Đã hoàn thành', N'Biên bản số 2'),
('BBGN03', 'PO003', 'CTG03', SYSDATETIME(), 'NV03', N'Người giao đại diện 3', N'Địa điểm giao 3', 100, 95, 90, 5, N'Đã hoàn thành', N'Biên bản số 3'),
('BBGN04', 'PO004', 'CTG04', SYSDATETIME(), 'NV04', N'Người giao đại diện 4', N'Địa điểm giao 4', 100, 95, 90, 5, N'Đã hoàn thành', N'Biên bản số 4'),
('BBGN05', 'PO005', 'CTG05', SYSDATETIME(), 'NV05', N'Người giao đại diện 5', N'Địa điểm giao 5', 100, 95, 90, 5, N'Đã hoàn thành', N'Biên bản số 5'),
('BBGN06', 'PO006', 'CTG06', SYSDATETIME(), 'NV06', N'Người giao đại diện 6', N'Địa điểm giao 6', 100, 95, 90, 5, N'Đã hoàn thành', N'Biên bản số 6'),
('BBGN07', 'PO007', 'CTG07', SYSDATETIME(), 'NV07', N'Người giao đại diện 7', N'Địa điểm giao 7', 100, 95, 90, 5, N'Đã hoàn thành', N'Biên bản số 7'),
('BBGN08', 'PO008', 'CTG08', SYSDATETIME(), 'NV08', N'Người giao đại diện 8', N'Địa điểm giao 8', 100, 95, 90, 5, N'Đã hoàn thành', N'Biên bản số 8');
GO

-- 16. PhieuNhapKho
INSERT INTO PhieuNhapKho (MA_PHIEU_NHAP_KHO, MA_BIEN_BAN_GIAO_NHAN, MA_KHO, NGAY_LAP, MA_THU_KHO, NGUOI_GIAO, TONG_SO_LUONG_THEO_CHUNG_TU, TONG_SO_LUONG_THUC_NHAP, TONG_TIEN, TRANG_THAI, GHI_CHU) VALUES
('PNK01', 'BBGN01', 'KHO01', SYSDATETIME(), 'NV01', N'Người giao hàng 1', 100, 90, 90000.00, N'Đã nhập kho', N'Phiếu nhập kho số 1'),
('PNK02', 'BBGN02', 'KHO02', SYSDATETIME(), 'NV02', N'Người giao hàng 2', 100, 90, 90000.00, N'Đã nhập kho', N'Phiếu nhập kho số 2'),
('PNK03', 'BBGN03', 'KHO03', SYSDATETIME(), 'NV03', N'Người giao hàng 3', 100, 90, 90000.00, N'Đã nhập kho', N'Phiếu nhập kho số 3'),
('PNK04', 'BBGN04', 'KHO04', SYSDATETIME(), 'NV04', N'Người giao hàng 4', 100, 90, 90000.00, N'Đã nhập kho', N'Phiếu nhập kho số 4'),
('PNK05', 'BBGN05', 'KHO05', SYSDATETIME(), 'NV05', N'Người giao hàng 5', 100, 90, 90000.00, N'Đã nhập kho', N'Phiếu nhập kho số 5'),
('PNK06', 'BBGN06', 'KHO06', SYSDATETIME(), 'NV06', N'Người giao hàng 6', 100, 90, 90000.00, N'Đã nhập kho', N'Phiếu nhập kho số 6'),
('PNK07', 'BBGN07', 'KHO07', SYSDATETIME(), 'NV07', N'Người giao hàng 7', 100, 90, 90000.00, N'Đã nhập kho', N'Phiếu nhập kho số 7'),
('PNK08', 'BBGN08', 'KHO08', SYSDATETIME(), 'NV08', N'Người giao hàng 8', 100, 90, 90000.00, N'Đã nhập kho', N'Phiếu nhập kho số 8');
GO

-- 17. ChiTietPhieuNhapKho
INSERT INTO ChiTietPhieuNhapKho (MA_CHI_TIET_PNK, MA_PHIEU_NHAP_KHO, MA_MAT_HANG, MA_LO_HANG, MA_DON_VI_TINH, SO_LUONG_THEO_CHUNG_TU, SO_LUONG_THUC_NHAP, DON_GIA, THANH_TIEN, GHI_CHU) VALUES
('CTPN1', 'PNK01', 'MH001', NULL, 'DVT01', 100, 90, 1000.00, 90000.00, N'Chi tiết phiếu nhập số 1'),
('CTPN2', 'PNK02', 'MH002', NULL, 'DVT02', 100, 90, 1000.00, 90000.00, N'Chi tiết phiếu nhập số 2'),
('CTPN3', 'PNK03', 'MH003', NULL, 'DVT03', 100, 90, 1000.00, 90000.00, N'Chi tiết phiếu nhập số 3'),
('CTPN4', 'PNK04', 'MH004', NULL, 'DVT04', 100, 90, 1000.00, 90000.00, N'Chi tiết phiếu nhập số 4'),
('CTPN5', 'PNK05', 'MH005', NULL, 'DVT05', 100, 90, 1000.00, 90000.00, N'Chi tiết phiếu nhập số 5'),
('CTPN6', 'PNK06', 'MH006', NULL, 'DVT06', 100, 90, 1000.00, 90000.00, N'Chi tiết phiếu nhập số 6'),
('CTPN7', 'PNK07', 'MH007', NULL, 'DVT07', 100, 90, 1000.00, 90000.00, N'Chi tiết phiếu nhập số 7'),
('CTPN8', 'PNK08', 'MH008', NULL, 'DVT08', 100, 90, 1000.00, 90000.00, N'Chi tiết phiếu nhập số 8');
GO

-- 18. LoHang
INSERT INTO LoHang (MA_LO_HANG, MA_MAT_HANG, NGAY_SAN_XUAT, HAN_SU_DUNG, NGAY_NHAP, MA_PHIEU_NHAP_KHO, TRANG_THAI_LO, GHI_CHU) VALUES
('LH01', 'MH001', '2026-01-01', '2027-01-01', '2026-06-30', 'PNK01', N'Hoạt động', N'Lô hàng số 1'),
('LH02', 'MH002', '2026-01-01', '2027-01-01', '2026-06-30', 'PNK02', N'Hoạt động', N'Lô hàng số 2'),
('LH03', 'MH003', '2026-01-01', '2027-01-01', '2026-06-30', 'PNK03', N'Hoạt động', N'Lô hàng số 3'),
('LH04', 'MH004', '2026-01-01', '2027-01-01', '2026-06-30', 'PNK04', N'Hoạt động', N'Lô hàng số 4'),
('LH05', 'MH005', '2026-01-01', '2027-01-01', '2026-06-30', 'PNK05', N'Hoạt động', N'Lô hàng số 5'),
('LH06', 'MH006', '2026-01-01', '2027-01-01', '2026-06-30', 'PNK06', N'Hoạt động', N'Lô hàng số 6'),
('LH07', 'MH007', '2026-01-01', '2027-01-01', '2026-06-30', 'PNK07', N'Hoạt động', N'Lô hàng số 7'),
('LH08', 'MH008', '2026-01-01', '2027-01-01', '2026-06-30', 'PNK08', N'Hoạt động', N'Lô hàng số 8');
GO

-- Cập nhật liên kết lô hàng
UPDATE ChiTietPhieuNhapKho SET MA_LO_HANG = 'LH01' WHERE MA_CHI_TIET_PNK = 'CTPN1';
UPDATE ChiTietPhieuNhapKho SET MA_LO_HANG = 'LH02' WHERE MA_CHI_TIET_PNK = 'CTPN2';
UPDATE ChiTietPhieuNhapKho SET MA_LO_HANG = 'LH03' WHERE MA_CHI_TIET_PNK = 'CTPN3';
UPDATE ChiTietPhieuNhapKho SET MA_LO_HANG = 'LH04' WHERE MA_CHI_TIET_PNK = 'CTPN4';
UPDATE ChiTietPhieuNhapKho SET MA_LO_HANG = 'LH05' WHERE MA_CHI_TIET_PNK = 'CTPN5';
UPDATE ChiTietPhieuNhapKho SET MA_LO_HANG = 'LH06' WHERE MA_CHI_TIET_PNK = 'CTPN6';
UPDATE ChiTietPhieuNhapKho SET MA_LO_HANG = 'LH07' WHERE MA_CHI_TIET_PNK = 'CTPN7';
UPDATE ChiTietPhieuNhapKho SET MA_LO_HANG = 'LH08' WHERE MA_CHI_TIET_PNK = 'CTPN8';
GO

-- 19. ChiTietBienBanGiaoNhan
INSERT INTO ChiTietBienBanGiaoNhan (MA_CHI_TIET_BBGN, MA_BIEN_BAN_GIAO_NHAN, MA_MAT_HANG, MA_LO_HANG, MA_DON_VI_TINH, SO_LUONG_THEO_CHUNG_TU, SO_LUONG_THUC_NHAN, SO_LUONG_DAT, SO_LUONG_KHONG_DAT, TINH_TRANG_HANG, CAN_KIEM_NGHIEM, GHI_CHU) VALUES
('CBBG1', 'BBGN01', 'MH001', 'LH01', 'DVT01', 100, 95, 90, 5, N'Hộp nguyên vẹn', 1, N'Ghi chú CBBG 1'),
('CBBG2', 'BBGN02', 'MH002', 'LH02', 'DVT02', 100, 95, 90, 5, N'Hộp nguyên vẹn', 1, N'Ghi chú CBBG 2'),
('CBBG3', 'BBGN03', 'MH003', 'LH03', 'DVT03', 100, 95, 90, 5, N'Hộp nguyên vẹn', 1, N'Ghi chú CBBG 3'),
('CBBG4', 'BBGN04', 'MH004', 'LH04', 'DVT04', 100, 95, 90, 5, N'Hộp nguyên vẹn', 1, N'Ghi chú CBBG 4'),
('CBBG5', 'BBGN05', 'MH005', 'LH05', 'DVT05', 100, 95, 90, 5, N'Hộp nguyên vẹn', 1, N'Ghi chú CBBG 5'),
('CBBG6', 'BBGN06', 'MH006', 'LH06', 'DVT06', 100, 95, 90, 5, N'Hộp nguyên vẹn', 1, N'Ghi chú CBBG 6'),
('CBBG7', 'BBGN07', 'MH007', 'LH07', 'DVT07', 100, 95, 90, 5, N'Hộp nguyên vẹn', 1, N'Ghi chú CBBG 7'),
('CBBG8', 'BBGN08', 'MH008', 'LH08', 'DVT08', 100, 95, 90, 5, N'Hộp nguyên vẹn', 1, N'Ghi chú CBBG 8');
GO

-- 20. BienBanKiemNghiem
INSERT INTO BienBanKiemNghiem (MA_BIEN_BAN_KIEM_NGHIEM, MA_BIEN_BAN_GIAO_NHAN, NGAY_LAP, MA_THU_KHO, NGUOI_KIEM_NGHIEM, KET_LUAN, TRANG_THAI, GHI_CHU) VALUES
('BBKN01', 'BBGN01', SYSDATETIME(), 'NV01', N'Kiểm nghiệm viên 1', N'Đạt chuẩn chất lượng', N'Đã hoàn thành', N'Biên bản kiểm nghiệm số 1'),
('BBKN02', 'BBGN02', SYSDATETIME(), 'NV02', N'Kiểm nghiệm viên 2', N'Đạt chuẩn chất lượng', N'Đã hoàn thành', N'Biên bản kiểm nghiệm số 2'),
('BBKN03', 'BBGN03', SYSDATETIME(), 'NV03', N'Kiểm nghiệm viên 3', N'Đạt chuẩn chất lượng', N'Đã hoàn thành', N'Biên bản kiểm nghiệm số 3'),
('BBKN04', 'BBGN04', SYSDATETIME(), 'NV04', N'Kiểm nghiệm viên 4', N'Đạt chuẩn chất lượng', N'Đã hoàn thành', N'Biên bản kiểm nghiệm số 4'),
('BBKN05', 'BBGN05', SYSDATETIME(), 'NV05', N'Kiểm nghiệm viên 5', N'Đạt chuẩn chất lượng', N'Đã hoàn thành', N'Biên bản kiểm nghiệm số 5'),
('BBKN06', 'BBGN06', SYSDATETIME(), 'NV06', N'Kiểm nghiệm viên 6', N'Đạt chuẩn chất lượng', N'Đã hoàn thành', N'Biên bản kiểm nghiệm số 6'),
('BBKN07', 'BBGN07', SYSDATETIME(), 'NV07', N'Kiểm nghiệm viên 7', N'Đạt chuẩn chất lượng', N'Đã hoàn thành', N'Biên bản kiểm nghiệm số 7'),
('BBKN08', 'BBGN08', SYSDATETIME(), 'NV08', N'Kiểm nghiệm viên 8', N'Đạt chuẩn chất lượng', N'Đã hoàn thành', N'Biên bản kiểm nghiệm số 8');
GO

-- 21. ChiTietBienBanKiemNghiem
INSERT INTO ChiTietBienBanKiemNghiem (MA_CHI_TIET_BBKN, MA_BIEN_BAN_KIEM_NGHIEM, MA_CHI_TIET_BBGN, MA_MAT_HANG, PHUONG_THUC_KIEM_NGHIEM, MA_DON_VI_TINH, SO_LUONG_THEO_CHUNG_TU, SO_LUONG_KIEM_NGHIEM, SO_LUONG_DAT, SO_LUONG_KHONG_DAT, LY_DO_KHONG_DAT, GHI_CHU) VALUES
('CTKN1', 'BBKN01', 'CBBG1', 'MH001', N'Cảm quan và thử mẫu', 'DVT01', 100, 95, 90, 5, N'Hộp bị biến dạng nhẹ', N'Ghi chú chi tiết 1'),
('CTKN2', 'BBKN02', 'CBBG2', 'MH002', N'Cảm quan và thử mẫu', 'DVT02', 100, 95, 90, 5, N'Hộp bị biến dạng nhẹ', N'Ghi chú chi tiết 2'),
('CTKN3', 'BBKN03', 'CBBG3', 'MH003', N'Cảm quan và thử mẫu', 'DVT03', 100, 95, 90, 5, N'Hộp bị biến dạng nhẹ', N'Ghi chú chi tiết 3'),
('CTKN4', 'BBKN04', 'CBBG4', 'MH004', N'Cảm quan và thử mẫu', 'DVT04', 100, 95, 90, 5, N'Hộp bị biến dạng nhẹ', N'Ghi chú chi tiết 4'),
('CTKN5', 'BBKN05', 'CBBG5', 'MH005', N'Cảm quan và thử mẫu', 'DVT05', 100, 95, 90, 5, N'Hộp bị biến dạng nhẹ', N'Ghi chú chi tiết 5'),
('CTKN6', 'BBKN06', 'CBBG6', 'MH006', N'Cảm quan và thử mẫu', 'DVT06', 100, 95, 90, 5, N'Hộp bị biến dạng nhẹ', N'Ghi chú chi tiết 6'),
('CTKN7', 'BBKN07', 'CBBG7', 'MH007', N'Cảm quan và thử mẫu', 'DVT07', 100, 95, 90, 5, N'Hộp bị biến dạng nhẹ', N'Ghi chú chi tiết 7'),
('CTKN8', 'BBKN08', 'CBBG8', 'MH008', N'Cảm quan và thử mẫu', 'DVT08', 100, 95, 90, 5, N'Hộp bị biến dạng nhẹ', N'Ghi chú chi tiết 8');
GO

-- 22. HoSoDotNhap
INSERT INTO HoSoDotNhap (MA_HO_SO_DOT_NHAP, MA_DON_MUA, MA_CHUNG_TU_GIAO, MA_BIEN_BAN_GIAO_NHAN, MA_BIEN_BAN_KIEM_NGHIEM, MA_PHIEU_NHAP_KHO, NGAY_TAO, TRANG_THAI, GHI_CHU) VALUES
('HSDN01', 'PO001', 'CTG01', 'BBGN01', 'BBKN01', 'PNK01', SYSDATETIME(), N'Hoàn thành', N'Hồ sơ đồng bộ đợt nhập 1'),
('HSDN02', 'PO002', 'CTG02', 'BBGN02', 'BBKN02', 'PNK02', SYSDATETIME(), N'Hoàn thành', N'Hồ sơ đồng bộ đợt nhập 2'),
('HSDN03', 'PO003', 'CTG03', 'BBGN03', 'BBKN03', 'PNK03', SYSDATETIME(), N'Hoàn thành', N'Hồ sơ đồng bộ đợt nhập 3'),
('HSDN04', 'PO004', 'CTG04', 'BBGN04', 'BBKN04', 'PNK04', SYSDATETIME(), N'Hoàn thành', N'Hồ sơ đồng bộ đợt nhập 4'),
('HSDN05', 'PO005', 'CTG05', 'BBGN05', 'BBKN05', 'PNK05', SYSDATETIME(), N'Hoàn thành', N'Hồ sơ đồng bộ đợt nhập 5'),
('HSDN06', 'PO006', 'CTG06', 'BBGN06', 'BBKN06', 'PNK06', SYSDATETIME(), N'Hoàn thành', N'Hồ sơ đồng bộ đợt nhập 6'),
('HSDN07', 'PO007', 'CTG07', 'BBGN07', 'BBKN07', 'PNK07', SYSDATETIME(), N'Hoàn thành', N'Hồ sơ đồng bộ đợt nhập 7'),
('HSDN08', 'PO008', 'CTG08', 'BBGN08', 'BBKN08', 'PNK08', SYSDATETIME(), N'Hoàn thành', N'Hồ sơ đồng bộ đợt nhập 8');
GO

-- 23. TonTheoViTri
INSERT INTO TonTheoViTri (MA_TON_VI_TRI, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, MA_CHI_TIET_PNK, SO_LUONG, TRANG_THAI_TON, NGAY_DUA_VAO, NGAY_CAP_NHAT_GAN_NHAT, GHI_CHU) VALUES
('TTVT01', 'MH001', 'LH01', 'VT0001', 'CTPN1', 90, N'Tồn kho', SYSDATETIME(), SYSDATETIME(), N'Ghi chú tồn vị trí 1'),
('TTVT02', 'MH002', 'LH02', 'VT0002', 'CTPN2', 90, N'Tồn kho', SYSDATETIME(), SYSDATETIME(), N'Ghi chú tồn vị trí 2'),
('TTVT03', 'MH003', 'LH03', 'VT0003', 'CTPN3', 90, N'Tồn kho', SYSDATETIME(), SYSDATETIME(), N'Ghi chú tồn vị trí 3'),
('TTVT04', 'MH004', 'LH04', 'VT0004', 'CTPN4', 90, N'Tồn kho', SYSDATETIME(), SYSDATETIME(), N'Ghi chú tồn vị trí 4'),
('TTVT05', 'MH005', 'LH05', 'VT0005', 'CTPN5', 90, N'Tồn kho', SYSDATETIME(), SYSDATETIME(), N'Ghi chú tồn vị trí 5'),
('TTVT06', 'MH006', 'LH06', 'VT0006', 'CTPN6', 90, N'Tồn kho', SYSDATETIME(), SYSDATETIME(), N'Ghi chú tồn vị trí 6'),
('TTVT07', 'MH007', 'LH07', 'VT0007', 'CTPN7', 90, N'Tồn kho', SYSDATETIME(), SYSDATETIME(), N'Ghi chú tồn vị trí 7'),
('TTVT08', 'MH008', 'LH08', 'VT0008', 'CTPN8', 90, N'Tồn kho', SYSDATETIME(), SYSDATETIME(), N'Ghi chú tồn vị trí 8');
GO

-- 24. TheKho
INSERT INTO TheKho (MA_THE_KHO, MA_MAT_HANG, NGAY_MO_THE, NGUOI_LAP_THE, TRANG_THAI) VALUES
('TKH01', 'MH001', SYSDATETIME(), 'NV01', N'Hoạt động'),
('TKH02', 'MH002', SYSDATETIME(), 'NV02', N'Hoạt động'),
('TKH03', 'MH003', SYSDATETIME(), 'NV03', N'Hoạt động'),
('TKH04', 'MH004', SYSDATETIME(), 'NV04', N'Hoạt động'),
('TKH05', 'MH005', SYSDATETIME(), 'NV05', N'Hoạt động'),
('TKH06', 'MH006', SYSDATETIME(), 'NV06', N'Hoạt động'),
('TKH07', 'MH007', SYSDATETIME(), 'NV07', N'Hoạt động'),
('TKH08', 'MH008', SYSDATETIME(), 'NV08', N'Hoạt động');
GO

-- 25. DongTheKho
INSERT INTO DongTheKho (MA_DONG_THE_KHO, MA_THE_KHO, NGAY_GHI, MA_CHUNG_TU, LOAI_CHUNG_TU, DIEN_GIAI, SO_LUONG_NHAP, SO_LUONG_XUAT, SO_LUONG_TON, NGUOI_GHI) VALUES
('DTK01', 'TKH01', SYSDATETIME(), 'PNK01', N'Phiếu nhập kho', N'Nhập kho lô hàng 1', 90, 0, 90, 'NV01'),
('DTK02', 'TKH02', SYSDATETIME(), 'PNK02', N'Phiếu nhập kho', N'Nhập kho lô hàng 2', 90, 0, 90, 'NV02'),
('DTK03', 'TKH03', SYSDATETIME(), 'PNK03', N'Phiếu nhập kho', N'Nhập kho lô hàng 3', 90, 0, 90, 'NV03'),
('DTK04', 'TKH04', SYSDATETIME(), 'PNK04', N'Phiếu nhập kho', N'Nhập kho lô hàng 4', 90, 0, 90, 'NV04'),
('DTK05', 'TKH05', SYSDATETIME(), 'PNK05', N'Phiếu nhập kho', N'Nhập kho lô hàng 5', 90, 0, 90, 'NV05'),
('DTK06', 'TKH06', SYSDATETIME(), 'PNK06', N'Phiếu nhập kho', N'Nhập kho lô hàng 6', 90, 0, 90, 'NV06'),
('DTK07', 'TKH07', SYSDATETIME(), 'PNK07', N'Phiếu nhập kho', N'Nhập kho lô hàng 7', 90, 0, 90, 'NV07'),
('DTK08', 'TKH08', SYSDATETIME(), 'PNK08', N'Phiếu nhập kho', N'Nhập kho lô hàng 8', 90, 0, 90, 'NV08');
GO

-- 26. BienDongTonKho
INSERT INTO BienDongTonKho (MA_BIEN_DONG, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, MA_CHUNG_TU, LOAI_CHUNG_TU, LOAI_BIEN_DONG, SO_LUONG, THOI_GIAN, NGUOI_THUC_HIEN, GHI_CHU) VALUES
('BDTK01', 'MH001', 'LH01', 'VT0001', 'PNK01', N'Phiếu nhập kho', N'Nhập', 90, SYSDATETIME(), 'NV01', N'Biến động nhập hàng 1'),
('BDTK02', 'MH002', 'LH02', 'VT0002', 'PNK02', N'Phiếu nhập kho', N'Nhập', 90, SYSDATETIME(), 'NV02', N'Biến động nhập hàng 2'),
('BDTK03', 'MH003', 'LH03', 'VT0003', 'PNK03', N'Phiếu nhập kho', N'Nhập', 90, SYSDATETIME(), 'NV03', N'Biến động nhập hàng 3'),
('BDTK04', 'MH004', 'LH04', 'VT0004', 'PNK04', N'Phiếu nhập kho', N'Nhập', 90, SYSDATETIME(), 'NV04', N'Biến động nhập hàng 4'),
('BDTK05', 'MH005', 'LH05', 'VT0005', 'PNK05', N'Phiếu nhập kho', N'Nhập', 90, SYSDATETIME(), 'NV05', N'Biến động nhập hàng 5'),
('BDTK06', 'MH006', 'LH06', 'VT0006', 'PNK06', N'Phiếu nhập kho', N'Nhập', 90, SYSDATETIME(), 'NV06', N'Biến động nhập hàng 6'),
('BDTK07', 'MH007', 'LH07', 'VT0007', 'PNK07', N'Phiếu nhập kho', N'Nhập', 90, SYSDATETIME(), 'NV07', N'Biến động nhập hàng 7'),
('BDTK08', 'MH008', 'LH08', 'VT0008', 'PNK08', N'Phiếu nhập kho', N'Nhập', 90, SYSDATETIME(), 'NV08', N'Biến động nhập hàng 8');
GO

-- 27. PhieuBaoCaoHangLoi
INSERT INTO PhieuBaoCaoHangLoi (MA_PHIEU_BAO_CAO, NGUOI_LAP, THOI_DIEM_LAP, NGUON_PHAT_HIEN, MO_TA_CHUNG, TRANG_THAI_PHIEU, GHI_CHU) VALUES
('PBCL01', 'NV01', SYSDATETIME(), N'Kiểm tra định kỳ', N'Phát hiện hàng hỏng lỗi đợt 1', N'Chờ xử lý', N'Phiếu báo cáo lỗi 1'),
('PBCL02', 'NV02', SYSDATETIME(), N'Kiểm tra định kỳ', N'Phát hiện hàng hỏng lỗi đợt 2', N'Chờ xử lý', N'Phiếu báo cáo lỗi 2'),
('PBCL03', 'NV03', SYSDATETIME(), N'Kiểm tra định kỳ', N'Phát hiện hàng hỏng lỗi đợt 3', N'Chờ xử lý', N'Phiếu báo cáo lỗi 3'),
('PBCL04', 'NV04', SYSDATETIME(), N'Kiểm tra định kỳ', N'Phát hiện hàng hỏng lỗi đợt 4', N'Chờ xử lý', N'Phiếu báo cáo lỗi 4'),
('PBCL05', 'NV05', SYSDATETIME(), N'Kiểm tra định kỳ', N'Phát hiện hàng hỏng lỗi đợt 5', N'Chờ xử lý', N'Phiếu báo cáo lỗi 5'),
('PBCL06', 'NV06', SYSDATETIME(), N'Kiểm tra định kỳ', N'Phát hiện hàng hỏng lỗi đợt 6', N'Chờ xử lý', N'Phiếu báo cáo lỗi 6'),
('PBCL07', 'NV07', SYSDATETIME(), N'Kiểm tra định kỳ', N'Phát hiện hàng hỏng lỗi đợt 7', N'Chờ xử lý', N'Phiếu báo cáo lỗi 7'),
('PBCL08', 'NV08', SYSDATETIME(), N'Kiểm tra định kỳ', N'Phát hiện hàng hỏng lỗi đợt 8', N'Chờ xử lý', N'Phiếu báo cáo lỗi 8');
GO

-- 28. ChiTietPhieuBaoCaoHangLoi
INSERT INTO ChiTietPhieuBaoCaoHangLoi (MA_CHI_TIET_PHIEU, MA_PHIEU_BAO_CAO, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, SO_LUONG_BAO_CAO, LOAI_VAN_DE, TINH_TRANG_HANG, MO_TA_CHI_TIET, MINH_CHUNG) VALUES
('CPHL01', 'PBCL01', 'MH001', 'LH01', 'VT0001', 5, N'Hết hạn / hỏng hóc', N'Móp vỏ chai', N'Lỗi đóng gói từ xưởng', N'minhchung_img_1.jpg'),
('CPHL02', 'PBCL02', 'MH002', 'LH02', 'VT0002', 5, N'Hết hạn / hỏng hóc', N'Móp vỏ chai', N'Lỗi đóng gói từ xưởng', N'minhchung_img_2.jpg'),
('CPHL03', 'PBCL03', 'MH003', 'LH03', 'VT0003', 5, N'Hết hạn / hỏng hóc', N'Móp vỏ chai', N'Lỗi đóng gói từ xưởng', N'minhchung_img_3.jpg'),
('CPHL04', 'PBCL04', 'MH004', 'LH04', 'VT0004', 5, N'Hết hạn / hỏng hóc', N'Móp vỏ chai', N'Lỗi đóng gói từ xưởng', N'minhchung_img_4.jpg'),
('CPHL05', 'PBCL05', 'MH005', 'LH05', 'VT0005', 5, N'Hết hạn / hỏng hóc', N'Móp vỏ chai', N'Lỗi đóng gói từ xưởng', N'minhchung_img_5.jpg'),
('CPHL06', 'PBCL06', 'MH006', 'LH06', 'VT0006', 5, N'Hết hạn / hỏng hóc', N'Móp vỏ chai', N'Lỗi đóng gói từ xưởng', N'minhchung_img_6.jpg'),
('CPHL07', 'PBCL07', 'MH007', 'LH07', 'VT0007', 5, N'Hết hạn / hỏng hóc', N'Móp vỏ chai', N'Lỗi đóng gói từ xưởng', N'minhchung_img_7.jpg'),
('CPHL08', 'PBCL08', 'MH008', 'LH08', 'VT0008', 5, N'Hết hạn / hỏng hóc', N'Móp vỏ chai', N'Lỗi đóng gói từ xưởng', N'minhchung_img_8.jpg');
GO

-- 29. PhieuCachLyHang
INSERT INTO PhieuCachLyHang (MA_PHIEU_CACH_LY, MA_PHIEU_BAO_CAO, NGUOI_THUC_HIEN, THOI_DIEM_CACH_LY, VI_TRI_CACH_LY, TRANG_THAI_CACH_LY, GHI_CHU) VALUES
('PCLH01', 'PBCL01', 'NV01', SYSDATETIME(), 'VT0001', N'Đang cách ly', N'Phiếu cách ly vật lý 1'),
('PCLH02', 'PBCL02', 'NV02', SYSDATETIME(), 'VT0002', N'Đang cách ly', N'Phiếu cách ly vật lý 2'),
('PCLH03', 'PBCL03', 'NV03', SYSDATETIME(), 'VT0003', N'Đang cách ly', N'Phiếu cách ly vật lý 3'),
('PCLH04', 'PBCL04', 'NV04', SYSDATETIME(), 'VT0004', N'Đang cách ly', N'Phiếu cách ly vật lý 4'),
('PCLH05', 'PBCL05', 'NV05', SYSDATETIME(), 'VT0005', N'Đang cách ly', N'Phiếu cách ly vật lý 5'),
('PCLH06', 'PBCL06', 'NV06', SYSDATETIME(), 'VT0006', N'Đang cách ly', N'Phiếu cách ly vật lý 6'),
('PCLH07', 'PBCL07', 'NV07', SYSDATETIME(), 'VT0007', N'Đang cách ly', N'Phiếu cách ly vật lý 7'),
('PCLH08', 'PBCL08', 'NV08', SYSDATETIME(), 'VT0008', N'Đang cách ly', N'Phiếu cách ly vật lý 8');
GO

-- 30. PhuongAnXuLyHangLoi
INSERT INTO PhuongAnXuLyHangLoi (MA_PHUONG_AN, MA_PHIEU_BAO_CAO, LOAI_PHUONG_AN, LY_DO, NGUOI_CHON_PHUONG_AN, THOI_DIEM_CHON, CAN_DUYET_CAP_CAO, TRANG_THAI_PHUONG_AN) VALUES
('PAHL01', 'PBCL01', N'Hủy / Trả NCC', N'Không thể tái sử dụng', 'NV01', SYSDATETIME(), 0, N'Đã duyệt'),
('PAHL02', 'PBCL02', N'Hủy / Trả NCC', N'Không thể tái sử dụng', 'NV02', SYSDATETIME(), 0, N'Đã duyệt'),
('PAHL03', 'PBCL03', N'Hủy / Trả NCC', N'Không thể tái sử dụng', 'NV03', SYSDATETIME(), 0, N'Đã duyệt'),
('PAHL04', 'PBCL04', N'Hủy / Trả NCC', N'Không thể tái sử dụng', 'NV04', SYSDATETIME(), 0, N'Đã duyệt'),
('PAHL05', 'PBCL05', N'Hủy / Trả NCC', N'Không thể tái sử dụng', 'NV05', SYSDATETIME(), 0, N'Đã duyệt'),
('PAHL06', 'PBCL06', N'Hủy / Trả NCC', N'Không thể tái sử dụng', 'NV06', SYSDATETIME(), 0, N'Đã duyệt'),
('PAHL07', 'PBCL07', N'Hủy / Trả NCC', N'Không thể tái sử dụng', 'NV07', SYSDATETIME(), 0, N'Đã duyệt'),
('PAHL08', 'PBCL08', N'Hủy / Trả NCC', N'Không thể tái sử dụng', 'NV08', SYSDATETIME(), 0, N'Đã duyệt');
GO

-- 31. LenhXuLyHangLoi
INSERT INTO LenhXuLyHangLoi (MA_LENH_XU_LY, MA_PHUONG_AN, NGUOI_DUOC_PHAN_CONG, NOI_DUNG_LENH, THOI_HAN, TRANG_THAI_LENH, KET_QUA_THUC_HIEN) VALUES
('LXLH01', 'PAHL01', 'NV01', N'Tiêu hủy hoặc trả hàng lỗi', SYSDATETIME(), N'Đang thực hiện', N'Chưa hoàn thành'),
('LXLH02', 'PAHL02', 'NV02', N'Tiêu hủy hoặc trả hàng lỗi', SYSDATETIME(), N'Đang thực hiện', N'Chưa hoàn thành'),
('LXLH03', 'PAHL03', 'NV03', N'Tiêu hủy hoặc trả hàng lỗi', SYSDATETIME(), N'Đang thực hiện', N'Chưa hoàn thành'),
('LXLH04', 'PAHL04', 'NV04', N'Tiêu hủy hoặc trả hàng lỗi', SYSDATETIME(), N'Đang thực hiện', N'Chưa hoàn thành'),
('LXLH05', 'PAHL05', 'NV05', N'Tiêu hủy hoặc trả hàng lỗi', SYSDATETIME(), N'Đang thực hiện', N'Chưa hoàn thành'),
('LXLH06', 'PAHL06', 'NV06', N'Tiêu hủy hoặc trả hàng lỗi', SYSDATETIME(), N'Đang thực hiện', N'Chưa hoàn thành'),
('LXLH07', 'PAHL07', 'NV07', N'Tiêu hủy hoặc trả hàng lỗi', SYSDATETIME(), N'Đang thực hiện', N'Chưa hoàn thành'),
('LXLH08', 'PAHL08', 'NV08', N'Tiêu hủy hoặc trả hàng lỗi', SYSDATETIME(), N'Đang thực hiện', N'Chưa hoàn thành');
GO

-- 32. BienBanTieuHuy
INSERT INTO BienBanTieuHuy (MA_BIEN_BAN_TIEU_HUY, MA_LENH_XU_LY, NGAY_TIEU_HUY, NGUOI_THUC_HIEN, NGUOI_CHUNG_KIEN, SO_LUONG_TIEU_HUY, PHUONG_THUC_TIEU_HUY, MINH_CHUNG, GHI_CHU) VALUES
('BBTH01', 'LXLH01', SYSDATETIME(), 'NV01', 'NV02', 3, N'Đốt bỏ trong lò', N'video_tieu_huy_1.mp4', N'Biên bản tiêu hủy sản phẩm 1'),
('BBTH02', 'LXLH02', SYSDATETIME(), 'NV02', 'NV02', 3, N'Đốt bỏ trong lò', N'video_tieu_huy_2.mp4', N'Biên bản tiêu hủy sản phẩm 2'),
('BBTH03', 'LXLH03', SYSDATETIME(), 'NV03', 'NV02', 3, N'Đốt bỏ trong lò', N'video_tieu_huy_3.mp4', N'Biên bản tiêu hủy sản phẩm 3'),
('BBTH04', 'LXLH04', SYSDATETIME(), 'NV04', 'NV02', 3, N'Đốt bỏ trong lò', N'video_tieu_huy_4.mp4', N'Biên bản tiêu hủy sản phẩm 4'),
('BBTH05', 'LXLH05', SYSDATETIME(), 'NV05', 'NV02', 3, N'Đốt bỏ trong lò', N'video_tieu_huy_5.mp4', N'Biên bản tiêu hủy sản phẩm 5'),
('BBTH06', 'LXLH06', SYSDATETIME(), 'NV06', 'NV02', 3, N'Đốt bỏ trong lò', N'video_tieu_huy_6.mp4', N'Biên bản tiêu hủy sản phẩm 6'),
('BBTH07', 'LXLH07', SYSDATETIME(), 'NV07', 'NV02', 3, N'Đốt bỏ trong lò', N'video_tieu_huy_7.mp4', N'Biên bản tiêu hủy sản phẩm 7'),
('BBTH08', 'LXLH08', SYSDATETIME(), 'NV08', 'NV02', 3, N'Đốt bỏ trong lò', N'video_tieu_huy_8.mp4', N'Biên bản tiêu hủy sản phẩm 8');
GO

-- 33. PhieuTraNhaCungCap
INSERT INTO PhieuTraNhaCungCap (MA_PHIEU_TRA, MA_LENH_XU_LY, MA_NHA_CUNG_CAP, NGAY_LAP, NGUOI_LAP, LY_DO_TRA, SO_LUONG_TRA, TRANG_THAI_TRA, GHI_CHU) VALUES
('PTNC01', 'LXLH01', 'NCC01', SYSDATETIME(), 'NV01', N'Lỗi đóng gói từ nhà máy', 2, N'Đã hoàn thành', N'Phiếu xuất trả NCC 1'),
('PTNC02', 'LXLH02', 'NCC02', SYSDATETIME(), 'NV02', N'Lỗi đóng gói từ nhà máy', 2, N'Đã hoàn thành', N'Phiếu xuất trả NCC 2'),
('PTNC03', 'LXLH03', 'NCC03', SYSDATETIME(), 'NV03', N'Lỗi đóng gói từ nhà máy', 2, N'Đã hoàn thành', N'Phiếu xuất trả NCC 3'),
('PTNC04', 'LXLH04', 'NCC04', SYSDATETIME(), 'NV04', N'Lỗi đóng gói từ nhà máy', 2, N'Đã hoàn thành', N'Phiếu xuất trả NCC 4'),
('PTNC05', 'LXLH05', 'NCC05', SYSDATETIME(), 'NV05', N'Lỗi đóng gói từ nhà máy', 2, N'Đã hoàn thành', N'Phiếu xuất trả NCC 5'),
('PTNC06', 'LXLH06', 'NCC06', SYSDATETIME(), 'NV06', N'Lỗi đóng gói từ nhà máy', 2, N'Đã hoàn thành', N'Phiếu xuất trả NCC 6'),
('PTNC07', 'LXLH07', 'NCC07', SYSDATETIME(), 'NV07', N'Lỗi đóng gói từ nhà máy', 2, N'Đã hoàn thành', N'Phiếu xuất trả NCC 7'),
('PTNC08', 'LXLH08', 'NCC08', SYSDATETIME(), 'NV08', N'Lỗi đóng gói từ nhà máy', 2, N'Đã hoàn thành', N'Phiếu xuất trả NCC 8');
GO

-- 34. HoSoXuLyHangLoi
INSERT INTO HoSoXuLyHangLoi (MA_HO_SO, MA_PHIEU_BAO_CAO, MA_PHUONG_AN, MA_LENH_XU_LY, NGAY_TAO, TRANG_THAI_HO_SO, NGAY_DONG_HO_SO, GHI_CHU) VALUES
('HSLH01', 'PBCL01', 'PAHL01', 'LXLH01', SYSDATETIME(), N'Đang xử lý', NULL, N'Hồ sơ lỗi sản phẩm đợt 1'),
('HSLH02', 'PBCL02', 'PAHL02', 'LXLH02', SYSDATETIME(), N'Đang xử lý', NULL, N'Hồ sơ lỗi sản phẩm đợt 2'),
('HSLH03', 'PBCL03', 'PAHL03', 'LXLH03', SYSDATETIME(), N'Đang xử lý', NULL, N'Hồ sơ lỗi sản phẩm đợt 3'),
('HSLH04', 'PBCL04', 'PAHL04', 'LXLH04', SYSDATETIME(), N'Đang xử lý', NULL, N'Hồ sơ lỗi sản phẩm đợt 4'),
('HSLH05', 'PBCL05', 'PAHL05', 'LXLH05', SYSDATETIME(), N'Đang xử lý', NULL, N'Hồ sơ lỗi sản phẩm đợt 5'),
('HSLH06', 'PBCL06', 'PAHL06', 'LXLH06', SYSDATETIME(), N'Đang xử lý', NULL, N'Hồ sơ lỗi sản phẩm đợt 6'),
('HSLH07', 'PBCL07', 'PAHL07', 'LXLH07', SYSDATETIME(), N'Đang xử lý', NULL, N'Hồ sơ lỗi sản phẩm đợt 7'),
('HSLH08', 'PBCL08', 'PAHL08', 'LXLH08', SYSDATETIME(), N'Đang xử lý', NULL, N'Hồ sơ lỗi sản phẩm đợt 8');
GO

-- 35. ThanhVienKiemKe
INSERT INTO ThanhVienKiemKe (MA_NHOM_KIEM_KE, MA_NHAN_VIEN, VAI_TRO_TRONG_NHOM) VALUES
('NKK01', 'NV01', N'Kiểm kê viên nhóm 1'),
('NKK02', 'NV02', N'Kiểm kê viên nhóm 2'),
('NKK03', 'NV03', N'Kiểm kê viên nhóm 3'),
('NKK04', 'NV04', N'Kiểm kê viên nhóm 4'),
('NKK05', 'NV05', N'Kiểm kê viên nhóm 5'),
('NKK06', 'NV06', N'Kiểm kê viên nhóm 6'),
('NKK07', 'NV07', N'Kiểm kê viên nhóm 7'),
('NKK08', 'NV08', N'Kiểm kê viên nhóm 8');
GO

-- 36. DotKiemKe
INSERT INTO DotKiemKe (MA_DOT_KIEM_KE, TEN_DOT_KIEM_KE, MA_KHO, LOAI_KIEM_KE, PHAM_VI_KIEM_KE, THOI_DIEM_BAT_DAU, THOI_DIEM_KET_THUC, NGUOI_LAP, TRANG_THAI_DOT, GHI_CHU) VALUES
('DKK01', N'Đợt kiểm kê định kỳ số 1', 'KHO01', N'Định kỳ', N'Phạm vi kiểm kê khu 1', SYSDATETIME(), SYSDATETIME(), 'NV01', N'Đã hoàn thành', N'Ghi chú đợt 1'),
('DKK02', N'Đợt kiểm kê định kỳ số 2', 'KHO02', N'Định kỳ', N'Phạm vi kiểm kê khu 2', SYSDATETIME(), SYSDATETIME(), 'NV02', N'Đã hoàn thành', N'Ghi chú đợt 2'),
('DKK03', N'Đợt kiểm kê định kỳ số 3', 'KHO03', N'Định kỳ', N'Phạm vi kiểm kê khu 3', SYSDATETIME(), SYSDATETIME(), 'NV03', N'Đã hoàn thành', N'Ghi chú đợt 3'),
('DKK04', N'Đợt kiểm kê định kỳ số 4', 'KHO04', N'Định kỳ', N'Phạm vi kiểm kê khu 4', SYSDATETIME(), SYSDATETIME(), 'NV04', N'Đã hoàn thành', N'Ghi chú đợt 4'),
('DKK05', N'Đợt kiểm kê định kỳ số 5', 'KHO05', N'Định kỳ', N'Phạm vi kiểm kê khu 5', SYSDATETIME(), SYSDATETIME(), 'NV05', N'Đã hoàn thành', N'Ghi chú đợt 5'),
('DKK06', N'Đợt kiểm kê định kỳ số 6', 'KHO06', N'Định kỳ', N'Phạm vi kiểm kê khu 6', SYSDATETIME(), SYSDATETIME(), 'NV06', N'Đã hoàn thành', N'Ghi chú đợt 6'),
('DKK07', N'Đợt kiểm kê định kỳ số 7', 'KHO07', N'Định kỳ', N'Phạm vi kiểm kê khu 7', SYSDATETIME(), SYSDATETIME(), 'NV07', N'Đã hoàn thành', N'Ghi chú đợt 7'),
('DKK08', N'Đợt kiểm kê định kỳ số 8', 'KHO08', N'Định kỳ', N'Phạm vi kiểm kê khu 8', SYSDATETIME(), SYSDATETIME(), 'NV08', N'Đã hoàn thành', N'Ghi chú đợt 8');
GO

-- 37. PhieuKiemKe
INSERT INTO PhieuKiemKe (MA_PHIEU_KIEM_KE, MA_DOT_KIEM_KE, MA_NHOM_KIEM_KE, NGUOI_PHU_TRACH, NGAY_TAO, TRANG_THAI_PHIEU, GHI_CHU) VALUES
('PKK01', 'DKK01', 'NKK01', 'NV01', SYSDATETIME(), N'Hoàn thành', N'Phiếu kê kiểm hàng 1'),
('PKK02', 'DKK02', 'NKK02', 'NV02', SYSDATETIME(), N'Hoàn thành', N'Phiếu kê kiểm hàng 2'),
('PKK03', 'DKK03', 'NKK03', 'NV03', SYSDATETIME(), N'Hoàn thành', N'Phiếu kê kiểm hàng 3'),
('PKK04', 'DKK04', 'NKK04', 'NV04', SYSDATETIME(), N'Hoàn thành', N'Phiếu kê kiểm hàng 4'),
('PKK05', 'DKK05', 'NKK05', 'NV05', SYSDATETIME(), N'Hoàn thành', N'Phiếu kê kiểm hàng 5'),
('PKK06', 'DKK06', 'NKK06', 'NV06', SYSDATETIME(), N'Hoàn thành', N'Phiếu kê kiểm hàng 6'),
('PKK07', 'DKK07', 'NKK07', 'NV07', SYSDATETIME(), N'Hoàn thành', N'Phiếu kê kiểm hàng 7'),
('PKK08', 'DKK08', 'NKK08', 'NV08', SYSDATETIME(), N'Hoàn thành', N'Phiếu kê kiểm hàng 8');
GO

-- 38. NhiemVuKiemKe
INSERT INTO NhiemVuKiemKe (MA_NHIEM_VU, MA_DOT_KIEM_KE, NGUOI_DUOC_PHAN_CONG, PHAM_VI_KIEM_KE, THOI_HAN, TRANG_THAI_NHIEM_VU, KET_QUA_THUC_HIEN) VALUES
('NVK01', 'DKK01', 'NV01', N'Phạm vi kiểm kê 1', SYSDATETIME(), N'Hoàn thành', N'Đã hoàn thành tốt'),
('NVK02', 'DKK02', 'NV02', N'Phạm vi kiểm kê 2', SYSDATETIME(), N'Hoàn thành', N'Đã hoàn thành tốt'),
('NVK03', 'DKK03', 'NV03', N'Phạm vi kiểm kê 3', SYSDATETIME(), N'Hoàn thành', N'Đã hoàn thành tốt'),
('NVK04', 'DKK04', 'NV04', N'Phạm vi kiểm kê 4', SYSDATETIME(), N'Hoàn thành', N'Đã hoàn thành tốt'),
('NVK05', 'DKK05', 'NV05', N'Phạm vi kiểm kê 5', SYSDATETIME(), N'Hoàn thành', N'Đã hoàn thành tốt'),
('NVK06', 'DKK06', 'NV06', N'Phạm vi kiểm kê 6', SYSDATETIME(), N'Hoàn thành', N'Đã hoàn thành tốt'),
('NVK07', 'DKK07', 'NV07', N'Phạm vi kiểm kê 7', SYSDATETIME(), N'Hoàn thành', N'Đã hoàn thành tốt'),
('NVK08', 'DKK08', 'NV08', N'Phạm vi kiểm kê 8', SYSDATETIME(), N'Hoàn thành', N'Đã hoàn thành tốt');
GO

-- 39. ChiTietKiemKe
INSERT INTO ChiTietKiemKe (MA_CHI_TIET_KIEM_KE, MA_PHIEU_KIEM_KE, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI_HE_THONG, MA_VI_TRI_THUC_TE, TRANG_THAI_TON_HE_THONG, TRANG_THAI_TON_THUC_TE, SO_LUONG_SO_SACH, SO_LUONG_THUC_TE, CHENH_LECH, LOAI_CHENH_LECH, TINH_TRANG_HANG, GHI_CHU) VALUES
('CTKK1', 'PKK01', 'MH001', 'LH01', 'VT0001', 'VT0001', N'Bình thường', N'Bình thường', 90, 88, -2, N'Thiếu', N'Nguyên vẹn', N'Thiếu do hao hụt tự nhiên 1'),
('CTKK2', 'PKK02', 'MH002', 'LH02', 'VT0002', 'VT0002', N'Bình thường', N'Bình thường', 90, 88, -2, N'Thiếu', N'Nguyên vẹn', N'Thiếu do hao hụt tự nhiên 2'),
('CTKK3', 'PKK03', 'MH003', 'LH03', 'VT0003', 'VT0003', N'Bình thường', N'Bình thường', 90, 88, -2, N'Thiếu', N'Nguyên vẹn', N'Thiếu do hao hụt tự nhiên 3'),
('CTKK4', 'PKK04', 'MH004', 'LH04', 'VT0004', 'VT0004', N'Bình thường', N'Bình thường', 90, 88, -2, N'Thiếu', N'Nguyên vẹn', N'Thiếu do hao hụt tự nhiên 4'),
('CTKK5', 'PKK05', 'MH005', 'LH05', 'VT0005', 'VT0005', N'Bình thường', N'Bình thường', 90, 88, -2, N'Thiếu', N'Nguyên vẹn', N'Thiếu do hao hụt tự nhiên 5'),
('CTKK6', 'PKK06', 'MH006', 'LH06', 'VT0006', 'VT0006', N'Bình thường', N'Bình thường', 90, 88, -2, N'Thiếu', N'Nguyên vẹn', N'Thiếu do hao hụt tự nhiên 6'),
('CTKK7', 'PKK07', 'MH007', 'LH07', 'VT0007', 'VT0007', N'Bình thường', N'Bình thường', 90, 88, -2, N'Thiếu', N'Nguyên vẹn', N'Thiếu do hao hụt tự nhiên 7'),
('CTKK8', 'PKK08', 'MH008', 'LH08', 'VT0008', 'VT0008', N'Bình thường', N'Bình thường', 90, 88, -2, N'Thiếu', N'Nguyên vẹn', N'Thiếu do hao hụt tự nhiên 8');
GO

-- 40. BienBanKiemKe
INSERT INTO BienBanKiemKe (MA_BIEN_BAN_KIEM_KE, MA_DOT_KIEM_KE, NGAY_LAP, NGUOI_LAP, DAI_DIEN_QUAN_LY_KHO, DAI_DIEN_THU_KHO, DAI_DIEN_KE_TOAN, KET_LUAN, TRANG_THAI_BIEN_BAN, GHI_CHU) VALUES
('BBKK01', 'DKK01', SYSDATETIME(), 'NV01', 'NV01', 'NV02', 'NV03', N'Đạt yêu cầu đối chiếu', N'Đã hoàn thành', N'Biên bản kiểm kê số 1'),
('BBKK02', 'DKK02', SYSDATETIME(), 'NV02', 'NV01', 'NV02', 'NV03', N'Đạt yêu cầu đối chiếu', N'Đã hoàn thành', N'Biên bản kiểm kê số 2'),
('BBKK03', 'DKK03', SYSDATETIME(), 'NV03', 'NV01', 'NV02', 'NV03', N'Đạt yêu cầu đối chiếu', N'Đã hoàn thành', N'Biên bản kiểm kê số 3'),
('BBKK04', 'DKK04', SYSDATETIME(), 'NV04', 'NV01', 'NV02', 'NV03', N'Đạt yêu cầu đối chiếu', N'Đã hoàn thành', N'Biên bản kiểm kê số 4'),
('BBKK05', 'DKK05', SYSDATETIME(), 'NV05', 'NV01', 'NV02', 'NV03', N'Đạt yêu cầu đối chiếu', N'Đã hoàn thành', N'Biên bản kiểm kê số 5'),
('BBKK06', 'DKK06', SYSDATETIME(), 'NV06', 'NV01', 'NV02', 'NV03', N'Đạt yêu cầu đối chiếu', N'Đã hoàn thành', N'Biên bản kiểm kê số 6'),
('BBKK07', 'DKK07', SYSDATETIME(), 'NV07', 'NV01', 'NV02', 'NV03', N'Đạt yêu cầu đối chiếu', N'Đã hoàn thành', N'Biên bản kiểm kê số 7'),
('BBKK08', 'DKK08', SYSDATETIME(), 'NV08', 'NV01', 'NV02', 'NV03', N'Đạt yêu cầu đối chiếu', N'Đã hoàn thành', N'Biên bản kiểm kê số 8');
GO

-- 41. ChiTietBienBanKiemKe
INSERT INTO ChiTietBienBanKiemKe (MA_CHI_TIET_BIEN_BAN, MA_BIEN_BAN_KIEM_KE, MA_CHI_TIET_KIEM_KE, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, MA_DON_VI_TINH, SO_LUONG_SO_SACH, SO_LUONG_THUC_TE, SO_LUONG_THUA, SO_LUONG_THIEU, TINH_TRANG_HANG, GHI_CHU) VALUES
('CTBB1', 'BBKK01', 'CTKK1', 'MH001', 'LH01', 'VT0001', 'DVT01', 90, 88, 0, 2, N'Thiếu hụt tự nhiên', N'Ghi chú chi tiết biên bản 1'),
('CTBB2', 'BBKK02', 'CTKK2', 'MH002', 'LH02', 'VT0002', 'DVT02', 90, 88, 0, 2, N'Thiếu hụt tự nhiên', N'Ghi chú chi tiết biên bản 2'),
('CTBB3', 'BBKK03', 'CTKK3', 'MH003', 'LH03', 'VT0003', 'DVT03', 90, 88, 0, 2, N'Thiếu hụt tự nhiên', N'Ghi chú chi tiết biên bản 3'),
('CTBB4', 'BBKK04', 'CTKK4', 'MH004', 'LH04', 'VT0004', 'DVT04', 90, 88, 0, 2, N'Thiếu hụt tự nhiên', N'Ghi chú chi tiết biên bản 4'),
('CTBB5', 'BBKK05', 'CTKK5', 'MH005', 'LH05', 'VT0005', 'DVT05', 90, 88, 0, 2, N'Thiếu hụt tự nhiên', N'Ghi chú chi tiết biên bản 5'),
('CTBB6', 'BBKK06', 'CTKK6', 'MH006', 'LH06', 'VT0006', 'DVT06', 90, 88, 0, 2, N'Thiếu hụt tự nhiên', N'Ghi chú chi tiết biên bản 6'),
('CTBB7', 'BBKK07', 'CTKK7', 'MH007', 'LH07', 'VT0007', 'DVT07', 90, 88, 0, 2, N'Thiếu hụt tự nhiên', N'Ghi chú chi tiết biên bản 7'),
('CTBB8', 'BBKK08', 'CTKK8', 'MH008', 'LH08', 'VT0008', 'DVT08', 90, 88, 0, 2, N'Thiếu hụt tự nhiên', N'Ghi chú chi tiết biên bản 8');
GO

-- 42. HoSoXuLySaiLechTonKho
INSERT INTO HoSoXuLySaiLechTonKho (MA_HO_SO, NGUOI_PHAT_HIEN, THOI_DIEM_PHAT_HIEN, NGUON_PHAT_HIEN, MO_TA_CHUNG, TRANG_THAI_HO_SO, NGUOI_XU_LY, THOI_DIEM_XU_LY, GHI_CHU) VALUES
('HSSL01', 'NV01', SYSDATETIME(), N'Kiểm kê cuối kỳ', N'Hồ sơ sai lệch đợt kiểm kê 1', N'Đang xử lý', 'NV02', SYSDATETIME(), N'Ghi chú hồ sơ 1'),
('HSSL02', 'NV02', SYSDATETIME(), N'Kiểm kê cuối kỳ', N'Hồ sơ sai lệch đợt kiểm kê 2', N'Đang xử lý', 'NV02', SYSDATETIME(), N'Ghi chú hồ sơ 2'),
('HSSL03', 'NV03', SYSDATETIME(), N'Kiểm kê cuối kỳ', N'Hồ sơ sai lệch đợt kiểm kê 3', N'Đang xử lý', 'NV02', SYSDATETIME(), N'Ghi chú hồ sơ 3'),
('HSSL04', 'NV04', SYSDATETIME(), N'Kiểm kê cuối kỳ', N'Hồ sơ sai lệch đợt kiểm kê 4', N'Đang xử lý', 'NV02', SYSDATETIME(), N'Ghi chú hồ sơ 4'),
('HSSL05', 'NV05', SYSDATETIME(), N'Kiểm kê cuối kỳ', N'Hồ sơ sai lệch đợt kiểm kê 5', N'Đang xử lý', 'NV02', SYSDATETIME(), N'Ghi chú hồ sơ 5'),
('HSSL06', 'NV06', SYSDATETIME(), N'Kiểm kê cuối kỳ', N'Hồ sơ sai lệch đợt kiểm kê 6', N'Đang xử lý', 'NV02', SYSDATETIME(), N'Ghi chú hồ sơ 6'),
('HSSL07', 'NV07', SYSDATETIME(), N'Kiểm kê cuối kỳ', N'Hồ sơ sai lệch đợt kiểm kê 7', N'Đang xử lý', 'NV02', SYSDATETIME(), N'Ghi chú hồ sơ 7'),
('HSSL08', 'NV08', SYSDATETIME(), N'Kiểm kê cuối kỳ', N'Hồ sơ sai lệch đợt kiểm kê 8', N'Đang xử lý', 'NV02', SYSDATETIME(), N'Ghi chú hồ sơ 8');
GO

-- 43. ChiTietSaiLechTonKho
INSERT INTO ChiTietSaiLechTonKho (MA_CHI_TIET_SAI_LECH, MA_HO_SO, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, TRANG_THAI_HANG, MA_DON_VI_TINH, SO_LUONG_HE_THONG, SO_LUONG_THUC_TE, SO_LUONG_SAI_LECH, LOAI_SAI_LECH, MO_TA_SAI_LECH, MINH_CHUNG) VALUES
('CTSL01', 'HSSL01', 'MH001', 'LH01', 'VT0001', N'Tồn kho', 'DVT01', 90, 88, -2, N'Thiếu', N'Sai lệch thực tế thiếu 2', N'hinh_sai_lech_1.jpg'),
('CTSL02', 'HSSL02', 'MH002', 'LH02', 'VT0002', N'Tồn kho', 'DVT02', 90, 88, -2, N'Thiếu', N'Sai lệch thực tế thiếu 2', N'hinh_sai_lech_2.jpg'),
('CTSL03', 'HSSL03', 'MH003', 'LH03', 'VT0003', N'Tồn kho', 'DVT03', 90, 88, -2, N'Thiếu', N'Sai lệch thực tế thiếu 2', N'hinh_sai_lech_3.jpg'),
('CTSL04', 'HSSL04', 'MH004', 'LH04', 'VT0004', N'Tồn kho', 'DVT04', 90, 88, -2, N'Thiếu', N'Sai lệch thực tế thiếu 2', N'hinh_sai_lech_4.jpg'),
('CTSL05', 'HSSL05', 'MH005', 'LH05', 'VT0005', N'Tồn kho', 'DVT05', 90, 88, -2, N'Thiếu', N'Sai lệch thực tế thiếu 2', N'hinh_sai_lech_5.jpg'),
('CTSL06', 'HSSL06', 'MH006', 'LH06', 'VT0006', N'Tồn kho', 'DVT06', 90, 88, -2, N'Thiếu', N'Sai lệch thực tế thiếu 2', N'hinh_sai_lech_6.jpg'),
('CTSL07', 'HSSL07', 'MH007', 'LH07', 'VT0007', N'Tồn kho', 'DVT07', 90, 88, -2, N'Thiếu', N'Sai lệch thực tế thiếu 2', N'hinh_sai_lech_7.jpg'),
('CTSL08', 'HSSL08', 'MH008', 'LH08', 'VT0008', N'Tồn kho', 'DVT08', 90, 88, -2, N'Thiếu', N'Sai lệch thực tế thiếu 2', N'hinh_sai_lech_8.jpg');
GO

-- 44. PhieuKiemKeXacMinh
INSERT INTO PhieuKiemKeXacMinh (MA_PHIEU_KKXM, MA_HO_SO, NGUOI_KIEM_KE, THOI_DIEM_KIEM_KE, PHAM_VI_KIEM_KE, KET_QUA_KIEM_KE, TRANG_THAI_PHIEU, GHI_CHU) VALUES
('PKXM01', 'HSSL01', 'NV01', SYSDATETIME(), N'Khu kệ VT0001', N'Thiếu do sơ xuất nhập liệu', N'Đã hoàn thành', N'Phiếu xác minh sai lệch số 1'),
('PKXM02', 'HSSL02', 'NV02', SYSDATETIME(), N'Khu kệ VT0002', N'Thiếu do sơ xuất nhập liệu', N'Đã hoàn thành', N'Phiếu xác minh sai lệch số 2'),
('PKXM03', 'HSSL03', 'NV03', SYSDATETIME(), N'Khu kệ VT0003', N'Thiếu do sơ xuất nhập liệu', N'Đã hoàn thành', N'Phiếu xác minh sai lệch số 3'),
('PKXM04', 'HSSL04', 'NV04', SYSDATETIME(), N'Khu kệ VT0004', N'Thiếu do sơ xuất nhập liệu', N'Đã hoàn thành', N'Phiếu xác minh sai lệch số 4'),
('PKXM05', 'HSSL05', 'NV05', SYSDATETIME(), N'Khu kệ VT0005', N'Thiếu do sơ xuất nhập liệu', N'Đã hoàn thành', N'Phiếu xác minh sai lệch số 5'),
('PKXM06', 'HSSL06', 'NV06', SYSDATETIME(), N'Khu kệ VT0006', N'Thiếu do sơ xuất nhập liệu', N'Đã hoàn thành', N'Phiếu xác minh sai lệch số 6'),
('PKXM07', 'HSSL07', 'NV07', SYSDATETIME(), N'Khu kệ VT0007', N'Thiếu do sơ xuất nhập liệu', N'Đã hoàn thành', N'Phiếu xác minh sai lệch số 7'),
('PKXM08', 'HSSL08', 'NV08', SYSDATETIME(), N'Khu kệ VT0008', N'Thiếu do sơ xuất nhập liệu', N'Đã hoàn thành', N'Phiếu xác minh sai lệch số 8');
GO

-- 45. ChiTietPhieuKiemKeXacMinh
INSERT INTO ChiTietPhieuKiemKeXacMinh (MA_CHI_TIET_KKXM, MA_PHIEU_KKXM, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, SO_LUONG_THUC_TE, TINH_TRANG_HANG, GHI_CHU) VALUES
('CKXM1', 'PKXM01', 'MH001', 'LH01', 'VT0001', 88, N'Nguyên vẹn', N'Chi tiết xác minh 1'),
('CKXM2', 'PKXM02', 'MH002', 'LH02', 'VT0002', 88, N'Nguyên vẹn', N'Chi tiết xác minh 2'),
('CKXM3', 'PKXM03', 'MH003', 'LH03', 'VT0003', 88, N'Nguyên vẹn', N'Chi tiết xác minh 3'),
('CKXM4', 'PKXM04', 'MH004', 'LH04', 'VT0004', 88, N'Nguyên vẹn', N'Chi tiết xác minh 4'),
('CKXM5', 'PKXM05', 'MH005', 'LH05', 'VT0005', 88, N'Nguyên vẹn', N'Chi tiết xác minh 5'),
('CKXM6', 'PKXM06', 'MH006', 'LH06', 'VT0006', 88, N'Nguyên vẹn', N'Chi tiết xác minh 6'),
('CKXM7', 'PKXM07', 'MH007', 'LH07', 'VT0007', 88, N'Nguyên vẹn', N'Chi tiết xác minh 7'),
('CKXM8', 'PKXM08', 'MH008', 'LH08', 'VT0008', 88, N'Nguyên vẹn', N'Chi tiết xác minh 8');
GO

-- 46. PhuongAnXuLySaiLech
INSERT INTO PhuongAnXuLySaiLech (MA_PHUONG_AN, MA_HO_SO, LOAI_PHUONG_AN, LY_DO, NGUOI_CHON_PHUONG_AN, THOI_DIEM_CHON, CAN_THAO_TAC_VAT_LY, CAN_DUYET_CAP_CAO, TRANG_THAI_PHUONG_AN) VALUES
('PASL01', 'HSSL01', N'Cân đối tài khoản hao hụt', N'Hao hụt vận chuyển', 'NV01', SYSDATETIME(), 0, 0, N'Đã duyệt'),
('PASL02', 'HSSL02', N'Cân đối tài khoản hao hụt', N'Hao hụt vận chuyển', 'NV02', SYSDATETIME(), 0, 0, N'Đã duyệt'),
('PASL03', 'HSSL03', N'Cân đối tài khoản hao hụt', N'Hao hụt vận chuyển', 'NV03', SYSDATETIME(), 0, 0, N'Đã duyệt'),
('PASL04', 'HSSL04', N'Cân đối tài khoản hao hụt', N'Hao hụt vận chuyển', 'NV04', SYSDATETIME(), 0, 0, N'Đã duyệt'),
('PASL05', 'HSSL05', N'Cân đối tài khoản hao hụt', N'Hao hụt vận chuyển', 'NV05', SYSDATETIME(), 0, 0, N'Đã duyệt'),
('PASL06', 'HSSL06', N'Cân đối tài khoản hao hụt', N'Hao hụt vận chuyển', 'NV06', SYSDATETIME(), 0, 0, N'Đã duyệt'),
('PASL07', 'HSSL07', N'Cân đối tài khoản hao hụt', N'Hao hụt vận chuyển', 'NV07', SYSDATETIME(), 0, 0, N'Đã duyệt'),
('PASL08', 'HSSL08', N'Cân đối tài khoản hao hụt', N'Hao hụt vận chuyển', 'NV08', SYSDATETIME(), 0, 0, N'Đã duyệt');
GO

-- 47. PheDuyetPhuongAnSaiLech
INSERT INTO PheDuyetPhuongAnSaiLech (MA_PHE_DUYET, MA_PHUONG_AN, NGUOI_PHE_DUYET, THOI_DIEM_PHE_DUYET, KET_QUA_PHE_DUYET, GHI_CHU) VALUES
('PDPA01', 'PASL01', 'NV01', SYSDATETIME(), N'Phê duyệt', N'Đồng ý với phương án điều chỉnh 1'),
('PDPA02', 'PASL02', 'NV01', SYSDATETIME(), N'Phê duyệt', N'Đồng ý với phương án điều chỉnh 2'),
('PDPA03', 'PASL03', 'NV01', SYSDATETIME(), N'Phê duyệt', N'Đồng ý với phương án điều chỉnh 3'),
('PDPA04', 'PASL04', 'NV01', SYSDATETIME(), N'Phê duyệt', N'Đồng ý với phương án điều chỉnh 4'),
('PDPA05', 'PASL05', 'NV01', SYSDATETIME(), N'Phê duyệt', N'Đồng ý với phương án điều chỉnh 5'),
('PDPA06', 'PASL06', 'NV01', SYSDATETIME(), N'Phê duyệt', N'Đồng ý với phương án điều chỉnh 6'),
('PDPA07', 'PASL07', 'NV01', SYSDATETIME(), N'Phê duyệt', N'Đồng ý với phương án điều chỉnh 7'),
('PDPA08', 'PASL08', 'NV01', SYSDATETIME(), N'Phê duyệt', N'Đồng ý với phương án điều chỉnh 8');
GO

-- 48. NhiemVuXuLySaiLech
INSERT INTO NhiemVuXuLySaiLech (MA_NHIEM_VU, MA_HO_SO, NGUOI_DUOC_PHAN_CONG, NOI_DUNG_NHIEM_VU, THOI_HAN, TRANG_THAI_NHIEM_VU, KET_QUA_THUC_HIEN) VALUES
('NVSL01', 'HSSL01', 'NV01', N'Cập nhật số liệu tồn hệ thống thực tế', SYSDATETIME(), N'Hoàn thành', N'Đã thực hiện xong'),
('NVSL02', 'HSSL02', 'NV02', N'Cập nhật số liệu tồn hệ thống thực tế', SYSDATETIME(), N'Hoàn thành', N'Đã thực hiện xong'),
('NVSL03', 'HSSL03', 'NV03', N'Cập nhật số liệu tồn hệ thống thực tế', SYSDATETIME(), N'Hoàn thành', N'Đã thực hiện xong'),
('NVSL04', 'HSSL04', 'NV04', N'Cập nhật số liệu tồn hệ thống thực tế', SYSDATETIME(), N'Hoàn thành', N'Đã thực hiện xong'),
('NVSL05', 'HSSL05', 'NV05', N'Cập nhật số liệu tồn hệ thống thực tế', SYSDATETIME(), N'Hoàn thành', N'Đã thực hiện xong'),
('NVSL06', 'HSSL06', 'NV06', N'Cập nhật số liệu tồn hệ thống thực tế', SYSDATETIME(), N'Hoàn thành', N'Đã thực hiện xong'),
('NVSL07', 'HSSL07', 'NV07', N'Cập nhật số liệu tồn hệ thống thực tế', SYSDATETIME(), N'Hoàn thành', N'Đã thực hiện xong'),
('NVSL08', 'HSSL08', 'NV08', N'Cập nhật số liệu tồn hệ thống thực tế', SYSDATETIME(), N'Hoàn thành', N'Đã thực hiện xong');
GO

-- 49. TepDinhKem
INSERT INTO TepDinhKem (MA_TEP, TEN_TEP, DUONG_DAN, LOAI_TEP, DOI_TUONG_LIEN_KET, MA_DOI_TUONG_LIEN_KET, NGAY_TAI_LEN, NGUOI_TAI_LEN) VALUES
('TDK01', 'file_dinh_kem_1.png', '/upload/doc_1.png', 'image/png', 'BienBanGiaoNhan', 'BBGN01', SYSDATETIME(), 'NV01'),
('TDK02', 'file_dinh_kem_2.png', '/upload/doc_2.png', 'image/png', 'BienBanGiaoNhan', 'BBGN02', SYSDATETIME(), 'NV02'),
('TDK03', 'file_dinh_kem_3.png', '/upload/doc_3.png', 'image/png', 'BienBanGiaoNhan', 'BBGN03', SYSDATETIME(), 'NV03'),
('TDK04', 'file_dinh_kem_4.png', '/upload/doc_4.png', 'image/png', 'BienBanGiaoNhan', 'BBGN04', SYSDATETIME(), 'NV04'),
('TDK05', 'file_dinh_kem_5.png', '/upload/doc_5.png', 'image/png', 'BienBanGiaoNhan', 'BBGN05', SYSDATETIME(), 'NV05'),
('TDK06', 'file_dinh_kem_6.png', '/upload/doc_6.png', 'image/png', 'BienBanGiaoNhan', 'BBGN06', SYSDATETIME(), 'NV06'),
('TDK07', 'file_dinh_kem_7.png', '/upload/doc_7.png', 'image/png', 'BienBanGiaoNhan', 'BBGN07', SYSDATETIME(), 'NV07'),
('TDK08', 'file_dinh_kem_8.png', '/upload/doc_8.png', 'image/png', 'BienBanGiaoNhan', 'BBGN08', SYSDATETIME(), 'NV08');
GO

-- 50. NhatKyThaoTac
INSERT INTO NhatKyThaoTac (MA_LOG, NGUOI_THAO_TAC, THOI_GIAN, HANH_DONG, DOI_TUONG_BI_TAC_DONG, MA_DOI_TUONG, DU_LIEU_TRUOC, DU_LIEU_SAU, GHI_CHU) VALUES
('LOG01', 'NV01', SYSDATETIME(), N'CREATE', N'MatHang', 'MH001', NULL, '{"MA_MAT_HANG": "MH001"}', N'Lưu nhật ký thao tác 1'),
('LOG02', 'NV02', SYSDATETIME(), N'CREATE', N'MatHang', 'MH002', NULL, '{"MA_MAT_HANG": "MH002"}', N'Lưu nhật ký thao tác 2'),
('LOG03', 'NV03', SYSDATETIME(), N'CREATE', N'MatHang', 'MH003', NULL, '{"MA_MAT_HANG": "MH003"}', N'Lưu nhật ký thao tác 3'),
('LOG04', 'NV04', SYSDATETIME(), N'CREATE', N'MatHang', 'MH004', NULL, '{"MA_MAT_HANG": "MH004"}', N'Lưu nhật ký thao tác 4'),
('LOG05', 'NV05', SYSDATETIME(), N'CREATE', N'MatHang', 'MH005', NULL, '{"MA_MAT_HANG": "MH005"}', N'Lưu nhật ký thao tác 5'),
('LOG06', 'NV06', SYSDATETIME(), N'CREATE', N'MatHang', 'MH006', NULL, '{"MA_MAT_HANG": "MH006"}', N'Lưu nhật ký thao tác 6'),
('LOG07', 'NV07', SYSDATETIME(), N'CREATE', N'MatHang', 'MH007', NULL, '{"MA_MAT_HANG": "MH007"}', N'Lưu nhật ký thao tác 7'),
('LOG08', 'NV08', SYSDATETIME(), N'CREATE', N'MatHang', 'MH008', NULL, '{"MA_MAT_HANG": "MH008"}', N'Lưu nhật ký thao tác 8');
GO

-- 51. CanhBaoTonKho
INSERT INTO CanhBaoTonKho (MA_CANH_BAO, MA_KHO, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, LOAI_CANH_BAO, MUC_DO_UU_TIEN, SO_LUONG_HIEN_TAI, NGUONG_CANH_BAO, THOI_DIEM_PHAT_SINH, TRANG_THAI_CANH_BAO, MO_TA, GHI_CHU) VALUES
('CBTK01', 'KHO01', 'MH001', 'LH01', 'VT0001', N'Tồn thấp', N'Cao', 5, 15, SYSDATETIME(), N'Đang cảnh báo', N'Tồn dưới ngưỡng tối thiểu', N'Cảnh báo hệ thống 1'),
('CBTK02', 'KHO02', 'MH002', 'LH02', 'VT0002', N'Tồn thấp', N'Cao', 5, 15, SYSDATETIME(), N'Đang cảnh báo', N'Tồn dưới ngưỡng tối thiểu', N'Cảnh báo hệ thống 2'),
('CBTK03', 'KHO03', 'MH003', 'LH03', 'VT0003', N'Tồn thấp', N'Cao', 5, 15, SYSDATETIME(), N'Đang cảnh báo', N'Tồn dưới ngưỡng tối thiểu', N'Cảnh báo hệ thống 3'),
('CBTK04', 'KHO04', 'MH004', 'LH04', 'VT0004', N'Tồn thấp', N'Cao', 5, 15, SYSDATETIME(), N'Đang cảnh báo', N'Tồn dưới ngưỡng tối thiểu', N'Cảnh báo hệ thống 4'),
('CBTK05', 'KHO05', 'MH005', 'LH05', 'VT0005', N'Tồn thấp', N'Cao', 5, 15, SYSDATETIME(), N'Đang cảnh báo', N'Tồn dưới ngưỡng tối thiểu', N'Cảnh báo hệ thống 5'),
('CBTK06', 'KHO06', 'MH006', 'LH06', 'VT0006', N'Tồn thấp', N'Cao', 5, 15, SYSDATETIME(), N'Đang cảnh báo', N'Tồn dưới ngưỡng tối thiểu', N'Cảnh báo hệ thống 6'),
('CBTK07', 'KHO07', 'MH007', 'LH07', 'VT0007', N'Tồn thấp', N'Cao', 5, 15, SYSDATETIME(), N'Đang cảnh báo', N'Tồn dưới ngưỡng tối thiểu', N'Cảnh báo hệ thống 7'),
('CBTK08', 'KHO08', 'MH008', 'LH08', 'VT0008', N'Tồn thấp', N'Cao', 5, 15, SYSDATETIME(), N'Đang cảnh báo', N'Tồn dưới ngưỡng tối thiểu', N'Cảnh báo hệ thống 8');
GO

-- 52. CauHinhDinhMucTon
INSERT INTO CauHinhDinhMucTon (MA_CAU_HINH, MA_KHO, MA_MAT_HANG, MUC_TON_TOI_THIEU, MUC_TON_TOI_DA, NGUONG_CAN_HAN, TRANG_THAI) VALUES
('CHD01', 'KHO01', 'MH001', 15, 1000, 30, N'Hoạt động'),
('CHD02', 'KHO02', 'MH002', 15, 1000, 30, N'Hoạt động'),
('CHD03', 'KHO03', 'MH003', 15, 1000, 30, N'Hoạt động'),
('CHD04', 'KHO04', 'MH004', 15, 1000, 30, N'Hoạt động'),
('CHD05', 'KHO05', 'MH005', 15, 1000, 30, N'Hoạt động'),
('CHD06', 'KHO06', 'MH006', 15, 1000, 30, N'Hoạt động'),
('CHD07', 'KHO07', 'MH007', 15, 1000, 30, N'Hoạt động'),
('CHD08', 'KHO08', 'MH008', 15, 1000, 30, N'Hoạt động');
GO

-- 53. ChiTietCanhBaoTonKho
INSERT INTO ChiTietCanhBaoTonKho (MA_CHI_TIET_CANH_BAO, MA_CANH_BAO, MA_TON_VI_TRI, SO_LUONG_VAT_LY, SO_LUONG_KHA_DUNG, HAN_SU_DUNG, TRANG_THAI_TON, NGUYEN_NHAN_DU_KIEN, GHI_CHU) VALUES
('CTCB1', 'CBTK01', 'TTVT01', 5, 5, '2027-01-01', N'Tồn thấp', N'Nhu cầu đặt hàng tăng mạnh', N'Chi tiết cảnh báo tồn số 1'),
('CTCB2', 'CBTK02', 'TTVT02', 5, 5, '2027-01-01', N'Tồn thấp', N'Nhu cầu đặt hàng tăng mạnh', N'Chi tiết cảnh báo tồn số 2'),
('CTCB3', 'CBTK03', 'TTVT03', 5, 5, '2027-01-01', N'Tồn thấp', N'Nhu cầu đặt hàng tăng mạnh', N'Chi tiết cảnh báo tồn số 3'),
('CTCB4', 'CBTK04', 'TTVT04', 5, 5, '2027-01-01', N'Tồn thấp', N'Nhu cầu đặt hàng tăng mạnh', N'Chi tiết cảnh báo tồn số 4'),
('CTCB5', 'CBTK05', 'TTVT05', 5, 5, '2027-01-01', N'Tồn thấp', N'Nhu cầu đặt hàng tăng mạnh', N'Chi tiết cảnh báo tồn số 5'),
('CTCB6', 'CBTK06', 'TTVT06', 5, 5, '2027-01-01', N'Tồn thấp', N'Nhu cầu đặt hàng tăng mạnh', N'Chi tiết cảnh báo tồn số 6'),
('CTCB7', 'CBTK07', 'TTVT07', 5, 5, '2027-01-01', N'Tồn thấp', N'Nhu cầu đặt hàng tăng mạnh', N'Chi tiết cảnh báo tồn số 7'),
('CTCB8', 'CBTK08', 'TTVT08', 5, 5, '2027-01-01', N'Tồn thấp', N'Nhu cầu đặt hàng tăng mạnh', N'Chi tiết cảnh báo tồn số 8');
GO

-- 54. NhiemVuXacMinhCanhBao
INSERT INTO NhiemVuXacMinhCanhBao (MA_NHIEM_VU, MA_CANH_BAO, NGUOI_DUOC_PHAN_CONG, NOI_DUNG_YEU_CAU, THOI_HAN, TRANG_THAI_NHIEM_VU, KET_QUA_TOM_TAT) VALUES
('NVCB01', 'CBTK01', 'NV01', N'Đếm thực tế số lượng tại kệ', SYSDATETIME(), N'Hoàn thành', N'Xác nhận số lượng thực tế khớp'),
('NVCB02', 'CBTK02', 'NV02', N'Đếm thực tế số lượng tại kệ', SYSDATETIME(), N'Hoàn thành', N'Xác nhận số lượng thực tế khớp'),
('NVCB03', 'CBTK03', 'NV03', N'Đếm thực tế số lượng tại kệ', SYSDATETIME(), N'Hoàn thành', N'Xác nhận số lượng thực tế khớp'),
('NVCB04', 'CBTK04', 'NV04', N'Đếm thực tế số lượng tại kệ', SYSDATETIME(), N'Hoàn thành', N'Xác nhận số lượng thực tế khớp'),
('NVCB05', 'CBTK05', 'NV05', N'Đếm thực tế số lượng tại kệ', SYSDATETIME(), N'Hoàn thành', N'Xác nhận số lượng thực tế khớp'),
('NVCB06', 'CBTK06', 'NV06', N'Đếm thực tế số lượng tại kệ', SYSDATETIME(), N'Hoàn thành', N'Xác nhận số lượng thực tế khớp'),
('NVCB07', 'CBTK07', 'NV07', N'Đếm thực tế số lượng tại kệ', SYSDATETIME(), N'Hoàn thành', N'Xác nhận số lượng thực tế khớp'),
('NVCB08', 'CBTK08', 'NV08', N'Đếm thực tế số lượng tại kệ', SYSDATETIME(), N'Hoàn thành', N'Xác nhận số lượng thực tế khớp');
GO

-- 55. KetQuaXacMinhCanhBao
INSERT INTO KetQuaXacMinhCanhBao (MA_KET_QUA, MA_NHIEM_VU, MA_CANH_BAO, SO_LUONG_THUC_TE, MA_VI_TRI_THUC_TE, MA_LO_HANG_THUC_TE, TINH_TRANG_HANG, GHI_CHU, THOI_DIEM_CAP_NHAT, NGUOI_CAP_NHAT) VALUES
('KQCB01', 'NVCB01', 'CBTK01', 5, 'VT0001', 'LH01', N'Tốt nguyên vẹn', N'Đã cập nhật đúng số liệu', SYSDATETIME(), 'NV01'),
('KQCB02', 'NVCB02', 'CBTK02', 5, 'VT0002', 'LH02', N'Tốt nguyên vẹn', N'Đã cập nhật đúng số liệu', SYSDATETIME(), 'NV02'),
('KQCB03', 'NVCB03', 'CBTK03', 5, 'VT0003', 'LH03', N'Tốt nguyên vẹn', N'Đã cập nhật đúng số liệu', SYSDATETIME(), 'NV03'),
('KQCB04', 'NVCB04', 'CBTK04', 5, 'VT0004', 'LH04', N'Tốt nguyên vẹn', N'Đã cập nhật đúng số liệu', SYSDATETIME(), 'NV04'),
('KQCB05', 'NVCB05', 'CBTK05', 5, 'VT0005', 'LH05', N'Tốt nguyên vẹn', N'Đã cập nhật đúng số liệu', SYSDATETIME(), 'NV05'),
('KQCB06', 'NVCB06', 'CBTK06', 5, 'VT0006', 'LH06', N'Tốt nguyên vẹn', N'Đã cập nhật đúng số liệu', SYSDATETIME(), 'NV06'),
('KQCB07', 'NVCB07', 'CBTK07', 5, 'VT0007', 'LH07', N'Tốt nguyên vẹn', N'Đã cập nhật đúng số liệu', SYSDATETIME(), 'NV07'),
('KQCB08', 'NVCB08', 'CBTK08', 5, 'VT0008', 'LH08', N'Tốt nguyên vẹn', N'Đã cập nhật đúng số liệu', SYSDATETIME(), 'NV08');
GO

-- 56. PhuongAnXuLyCanhBao
INSERT INTO PhuongAnXuLyCanhBao (MA_PHUONG_AN, MA_CANH_BAO, LOAI_PHUONG_AN, NOI_DUNG_PHUONG_AN, NGUOI_CHON, THOI_DIEM_CHON, TRANG_THAI_PHUONG_AN, GHI_CHU) VALUES
('PACB01', 'CBTK01', N'Lập đề xuất mua bổ sung', N'Liên hệ nhà cung cấp đặt hàng thêm', 'NV01', SYSDATETIME(), N'Đã duyệt', N'Ghi chú phương án cảnh báo 1'),
('PACB02', 'CBTK02', N'Lập đề xuất mua bổ sung', N'Liên hệ nhà cung cấp đặt hàng thêm', 'NV02', SYSDATETIME(), N'Đã duyệt', N'Ghi chú phương án cảnh báo 2'),
('PACB03', 'CBTK03', N'Lập đề xuất mua bổ sung', N'Liên hệ nhà cung cấp đặt hàng thêm', 'NV03', SYSDATETIME(), N'Đã duyệt', N'Ghi chú phương án cảnh báo 3'),
('PACB04', 'CBTK04', N'Lập đề xuất mua bổ sung', N'Liên hệ nhà cung cấp đặt hàng thêm', 'NV04', SYSDATETIME(), N'Đã duyệt', N'Ghi chú phương án cảnh báo 4'),
('PACB05', 'CBTK05', N'Lập đề xuất mua bổ sung', N'Liên hệ nhà cung cấp đặt hàng thêm', 'NV05', SYSDATETIME(), N'Đã duyệt', N'Ghi chú phương án cảnh báo 5'),
('PACB06', 'CBTK06', N'Lập đề xuất mua bổ sung', N'Liên hệ nhà cung cấp đặt hàng thêm', 'NV06', SYSDATETIME(), N'Đã duyệt', N'Ghi chú phương án cảnh báo 6'),
('PACB07', 'CBTK07', N'Lập đề xuất mua bổ sung', N'Liên hệ nhà cung cấp đặt hàng thêm', 'NV07', SYSDATETIME(), N'Đã duyệt', N'Ghi chú phương án cảnh báo 7'),
('PACB08', 'CBTK08', N'Lập đề xuất mua bổ sung', N'Liên hệ nhà cung cấp đặt hàng thêm', 'NV08', SYSDATETIME(), N'Đã duyệt', N'Ghi chú phương án cảnh báo 8');
GO

-- 57. YeuCauMuaBoSung
INSERT INTO YeuCauMuaBoSung (MA_YEU_CAU_MUA, MA_CANH_BAO, MA_MAT_HANG, MA_KHO, SO_LUONG_DE_XUAT, LY_DO, TRANG_THAI_YEU_CAU, NGUOI_TAO, THOI_DIEM_TAO) VALUES
('YCMB01', 'CBTK01', 'MH001', 'KHO01', 500, N'Tồn kho dưới hạn mức quy định', N'Đã gửi đề xuất', 'NV01', SYSDATETIME()),
('YCMB02', 'CBTK02', 'MH002', 'KHO02', 500, N'Tồn kho dưới hạn mức quy định', N'Đã gửi đề xuất', 'NV02', SYSDATETIME()),
('YCMB03', 'CBTK03', 'MH003', 'KHO03', 500, N'Tồn kho dưới hạn mức quy định', N'Đã gửi đề xuất', 'NV03', SYSDATETIME()),
('YCMB04', 'CBTK04', 'MH004', 'KHO04', 500, N'Tồn kho dưới hạn mức quy định', N'Đã gửi đề xuất', 'NV04', SYSDATETIME()),
('YCMB05', 'CBTK05', 'MH005', 'KHO05', 500, N'Tồn kho dưới hạn mức quy định', N'Đã gửi đề xuất', 'NV05', SYSDATETIME()),
('YCMB06', 'CBTK06', 'MH006', 'KHO06', 500, N'Tồn kho dưới hạn mức quy định', N'Đã gửi đề xuất', 'NV06', SYSDATETIME()),
('YCMB07', 'CBTK07', 'MH007', 'KHO07', 500, N'Tồn kho dưới hạn mức quy định', N'Đã gửi đề xuất', 'NV07', SYSDATETIME()),
('YCMB08', 'CBTK08', 'MH008', 'KHO08', 500, N'Tồn kho dưới hạn mức quy định', N'Đã gửi đề xuất', 'NV08', SYSDATETIME());
GO

