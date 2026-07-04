/* =====================================================================
   DỮ LIỆU MẪU ĐẦY ĐỦ CHO DATABASE QL_KHO1
   (TOÀN BỘ 57 BẢNG - chạy 1 file duy nhất từ đầu, khớp với file
   QL_KHO1.sql bạn đã upload - lưu ý NhanVien KHÔNG có cột VAI_TRO)

   Chạy SAU khi đã chạy file QL_KHO1.sql (đã gộp: schema gốc 49 bảng +
   nhóm Cảnh báo tồn kho (7 bảng) + bảng TaiKhoan).

   Thứ tự INSERT tuân theo thứ tự phụ thuộc khóa ngoại (FK):
     - Bảng 1-49 : dữ liệu gốc (nhân sự, NCC, kho, nhập hàng, lô hàng,
                    tồn kho, hàng lỗi/hỏng, kiểm kê, sai lệch tồn kho...)
     - Bảng 50-57: cấu hình định mức tồn, cảnh báo tồn kho, xác minh,
                    phương án xử lý, yêu cầu mua bổ sung, tài khoản

   Kịch bản xuyên suốt: Nhập hàng (PO0001, PO0002) -> phát hiện hàng
   lỗi/hỏng -> xử lý (tiêu hủy + trả NCC) -> kiểm kê định kỳ -> phát
   hiện & xử lý sai lệch tồn kho -> cấu hình định mức tồn sinh cảnh
   báo (dưới mức tối thiểu / gần hết hạn) -> xác minh -> phương án xử
   lý -> yêu cầu mua bổ sung. Đồng thời tạo tài khoản đăng nhập cho
   từng nhân viên (mật khẩu demo: Test@123, đã băm bcrypt).
   ===================================================================== */

USE QL_KHO1;
GO

-- 1. NhanVien
INSERT INTO NhanVien (MA_NHAN_VIEN, HO_TEN, CHUC_VU, SO_DIEN_THOAI, EMAIL, TRANG_THAI) VALUES
('NV01', N'Nguyễn Văn An',  N'Quản lý kho',          '0911000001', 'an.nv@khohang.vn',    N'Đang làm việc'),
('NV02', N'Trần Thị Bình',  N'Thủ kho',              '0911000002', 'binh.tt@khohang.vn',  N'Đang làm việc'),
('NV03', N'Lê Văn Cường',   N'Thủ kho',              '0911000003', 'cuong.lv@khohang.vn', N'Đang làm việc'),
('NV04', N'Phạm Thị Dung',  N'Nhân viên mua hàng',   '0911000004', 'dung.pt@khohang.vn',  N'Đang làm việc'),
('NV05', N'Hoàng Văn Em',   N'Nhân viên KCS',        '0911000005', 'em.hv@khohang.vn',    N'Đang làm việc'),
('NV06', N'Vũ Thị Phương',  N'Kế toán kho',          '0911000006', 'phuong.vt@khohang.vn',N'Đang làm việc'),
('NV07', N'Đặng Văn Giang', N'Nhân viên kiểm kê',    '0911000007', 'giang.dv@khohang.vn', N'Đang làm việc'),
('NV08', N'Bùi Thị Hoa',    N'Nhân viên kiểm kê',    '0911000008', 'hoa.bt@khohang.vn',   N'Đang làm việc');
GO

-- 2. NhaCungCap
INSERT INTO NhaCungCap (MA_NHA_CUNG_CAP, TEN_NHA_CUNG_CAP, DIA_CHI, SO_DIEN_THOAI, EMAIL, MA_SO_THUE, NGUOI_DAI_DIEN, TRANG_THAI) VALUES
('NCC01', N'Công ty TNHH Thực Phẩm Sạch An Khang', N'12 Láng Hạ, Đống Đa, Hà Nội', '0241234567', 'lienhe@ankhang.vn',  '0102030405', N'Nguyễn Văn Tài', N'Đang hợp tác'),
('NCC02', N'Công ty CP Hóa Mỹ Phẩm Hương Việt',    N'45 Trần Duy Hưng, Hà Nội',    '0247654321', 'cskh@huongviet.vn',  '0203040506', N'Lê Thị Mai',     N'Đang hợp tác'),
('NCC03', N'Công ty TNHH Thương Mại Đại Phát',     N'78 Nguyễn Trãi, Hà Nội',      '0249998888', 'info@daiphat.vn',    '0304050607', N'Vũ Văn Phát',    N'Đang hợp tác');
GO

-- 3. Kho
INSERT INTO Kho (MA_KHO, TEN_KHO, DIA_CHI, SIEU_THI_GAN_NHAT, TRANG_THAI) VALUES
('KHO01', N'Kho Tổng Hà Nội',        N'Khu Công nghiệp Quang Minh, Hà Nội', N'Siêu thị WinMart Quang Minh', N'Đang hoạt động'),
('KHO02', N'Kho Chi Nhánh Đà Nẵng',  N'Khu Công nghiệp Hòa Khánh, Đà Nẵng', N'Siêu thị Co.opmart Hòa Khánh', N'Đang hoạt động');
GO

-- 4. DonViTinh
INSERT INTO DonViTinh (MA_DON_VI_TINH, TEN_DON_VI_TINH, MO_TA) VALUES
('DVT01', N'Thùng', N'Đơn vị đóng gói lớn'),
('DVT02', N'Hộp',   N'Đơn vị đóng gói trung bình'),
('DVT03', N'Túi',   N'Đơn vị đóng gói nhỏ'),
('DVT04', N'Chai',  N'Đơn vị tính theo chai'),
('DVT05', N'Kg',    N'Đơn vị tính theo khối lượng'),
('DVT06', N'Cái',   N'Đơn vị tính theo cái/đơn vị lẻ');
GO

-- 5. NhomKiemKe
INSERT INTO NhomKiemKe (MA_NHOM_KIEM_KE, TEN_NHOM, GHI_CHU) VALUES
('NKK01', N'Nhóm Kiểm Kê Khu A', N'Phụ trách kiểm kê khu A, B'),
('NKK02', N'Nhóm Kiểm Kê Khu B', N'Phụ trách kiểm kê khu C, D');
GO

-- 6. ViTriKho
INSERT INTO ViTriKho (MA_VI_TRI, MA_KHO, KHU, DAY, KE, TANG, O, LOAI_VI_TRI, DIEU_KIEN_BAO_QUAN, SUC_CHUA, TRANG_THAI_VI_TRI) VALUES
('VT0001', 'KHO01', N'Khu A', N'Dãy 1', N'Kệ 1', N'Tầng 1', N'Ô 1', N'Thường',   N'Khô, mát', 1000, N'Đang chứa hàng'),
('VT0002', 'KHO01', N'Khu A', N'Dãy 1', N'Kệ 2', N'Tầng 1', N'Ô 2', N'Thường',   N'Khô, mát', 1000, N'Đang chứa hàng'),
('VT0003', 'KHO01', N'Khu B', N'Dãy 2', N'Kệ 1', N'Tầng 1', N'Ô 1', N'Lạnh',     N'2-8 độ C', 500,  N'Đang chứa hàng'),
('VT0004', 'KHO01', N'Khu C', N'Dãy 1', N'Kệ 1', N'Tầng 1', N'Ô 1', N'Cách ly',  N'Khô, biệt lập', 100, N'Đang chứa hàng'),
('VT0005', 'KHO02', N'Khu A', N'Dãy 1', N'Kệ 1', N'Tầng 1', N'Ô 1', N'Thường',   N'Khô, mát', 800,  N'Trống'),
('VT0006', 'KHO02', N'Khu B', N'Dãy 1', N'Kệ 1', N'Tầng 1', N'Ô 1', N'Chờ xử lý',N'Khô',      200,  N'Trống');
GO

-- 7. MatHang (đã chuẩn hóa MA_DON_VI_TINH_NHAP -> FK DonViTinh)
INSERT INTO MatHang (MA_MAT_HANG, TEN_MAT_HANG, NHOM_HANG, MA_DON_VI_TINH_NHAP, QUY_CACH_DONG_GOI, CO_HAN_SU_DUNG, DIEU_KIEN_BAO_QUAN, TRANG_THAI) VALUES
('MH001', N'Sữa tươi Vinamilk 1L',     N'Thực phẩm', 'DVT01', N'1 thùng = 12 hộp', 1, N'2-8 độ C',  N'Đang kinh doanh'),
('MH002', N'Nước rửa tay Lifebuoy 500ml', N'Hóa phẩm', 'DVT02', N'1 hộp = 6 chai',   1, N'Khô, mát', N'Đang kinh doanh'),
('MH003', N'Mì gói Hảo Hảo',            N'Thực phẩm', 'DVT01', N'1 thùng = 30 túi', 1, N'Khô, mát', N'Đang kinh doanh'),
('MH004', N'Dầu gội Sunsilk 650ml',     N'Mỹ phẩm',   'DVT04', NULL,                1, N'Khô, mát', N'Đang kinh doanh'),
('MH005', N'Giấy vệ sinh Pulppy',       N'Hóa phẩm',  'DVT03', NULL,                0, N'Khô',      N'Đang kinh doanh');
GO

-- 8. QuyCachDongGoi (DON_VI_NHAP / DON_VI_CO_SO -> FK DonViTinh)
INSERT INTO QuyCachDongGoi (MA_QUY_CACH, MA_MAT_HANG, MA_DON_VI_NHAP, MA_DON_VI_CO_SO, SO_LUONG_QUY_DOI, MO_TA) VALUES
('QC001', 'MH001', 'DVT01', 'DVT02', 12, N'1 thùng sữa = 12 hộp'),
('QC002', 'MH002', 'DVT02', 'DVT04', 6,  N'1 hộp nước rửa tay = 6 chai'),
('QC003', 'MH003', 'DVT01', 'DVT03', 30, N'1 thùng mì = 30 túi');
GO

-- 9. DanhMucViTriKhuyenNghi
INSERT INTO DanhMucViTriKhuyenNghi (MA_DANH_MUC, MA_MAT_HANG, MA_VI_TRI, MUC_DO_UU_TIEN, GHI_CHU) VALUES
('DM001', 'MH001', 'VT0003', 1, N'Sữa cần bảo quản lạnh'),
('DM002', 'MH002', 'VT0001', 1, NULL),
('DM003', 'MH003', 'VT0002', 1, NULL),
('DM004', 'MH004', 'VT0001', 2, NULL),
('DM005', 'MH005', 'VT0002', 2, NULL);
GO

-- 10. DonMuaHang
INSERT INTO DonMuaHang (MA_DON_MUA, MA_NHA_CUNG_CAP, MA_KHO_NHAN, NGAY_DAT, NGAY_DU_KIEN_GIAO, TONG_SO_LUONG_DAT, TONG_TIEN, TRANG_THAI, GHI_CHU) VALUES
('PO0001', 'NCC01', 'KHO01', '2026-05-01', '2026-05-05', 500, 50000000, N'Nhận đủ',       NULL),
('PO0002', 'NCC02', 'KHO01', '2026-05-10', '2026-05-15', 200, 30000000, N'Nhận một phần', N'Thiếu 2 hộp so với đặt hàng');
GO

-- 11. ChiTietDonMuaHang (DON_VI_TINH -> FK)
INSERT INTO ChiTietDonMuaHang (MA_CHI_TIET_DON_MUA, MA_DON_MUA, MA_MAT_HANG, MA_DON_VI_TINH, SO_LUONG_DAT, SO_LUONG_DA_NHAP, SO_LUONG_CON_CHO_NHAN, DON_GIA, THANH_TIEN, GHI_CHU) VALUES
('CTDM001', 'PO0001', 'MH001', 'DVT01', 300, 300, 0, 100000, 30000000, NULL),
('CTDM002', 'PO0001', 'MH003', 'DVT01', 200, 200, 0, 100000, 20000000, NULL),
('CTDM003', 'PO0002', 'MH002', 'DVT02', 200, 198, 2, 150000, 29700000, N'Thiếu 2 hộp trong quá trình vận chuyển');
GO

-- 12. ChungTuGiaoHang
INSERT INTO ChungTuGiaoHang (MA_CHUNG_TU_GIAO, SO_CHUNG_TU_BEN_GIAO, MA_DON_MUA, NGAY_GIAO, NGUOI_GIAO, SO_DIEN_THOAI_NGUOI_GIAO, FILE_CHUNG_TU, TRANG_THAI, GHI_CHU) VALUES
('CTG0001', 'AK-2026-0501', 'PO0001', '2026-05-05', N'Nguyễn Văn Tài', '0901234567', N'/files/ctg/AK-2026-0501.pdf', N'Hợp lệ', NULL),
('CTG0002', 'HV-2026-0515', 'PO0002', '2026-05-15', N'Lê Thị Mai',     '0907654321', N'/files/ctg/HV-2026-0515.pdf', N'Hợp lệ', NULL);
GO

-- 13. ChiTietChungTuGiaoHang (DON_VI_TINH -> FK)
INSERT INTO ChiTietChungTuGiaoHang (MA_CHI_TIET_CHUNG_TU, MA_CHUNG_TU_GIAO, MA_MAT_HANG, MA_DON_VI_TINH, SO_LUONG_THEO_CHUNG_TU, DON_GIA, THANH_TIEN, GHI_CHU) VALUES
('CTCT001', 'CTG0001', 'MH001', 'DVT01', 300, 100000, 30000000, NULL),
('CTCT002', 'CTG0001', 'MH003', 'DVT01', 200, 100000, 20000000, NULL),
('CTCT003', 'CTG0002', 'MH002', 'DVT02', 200, 150000, 30000000, NULL);
GO

-- 14. BienBanGiaoNhan
INSERT INTO BienBanGiaoNhan (MA_BIEN_BAN_GIAO_NHAN, MA_DON_MUA, MA_CHUNG_TU_GIAO, NGAY_LAP, MA_THU_KHO, NGUOI_GIAO, DIA_DIEM_GIAO_NHAN, TONG_SO_LUONG_THEO_CHUNG_TU, TONG_SO_LUONG_THUC_NHAN, TONG_SO_LUONG_DAT, TONG_SO_LUONG_KHONG_DAT, TRANG_THAI, GHI_CHU) VALUES
('BBGN001', 'PO0001', 'CTG0001', '2026-05-05 09:00:00', 'NV02', N'Nguyễn Văn Tài', N'Kho Tổng Hà Nội', 500, 500, 500, 0, N'Đã xác nhận', NULL),
('BBGN002', 'PO0002', 'CTG0002', '2026-05-15 10:00:00', 'NV03', N'Lê Thị Mai',     N'Kho Tổng Hà Nội', 200, 198, 195, 3, N'Đã xác nhận', N'3 hộp bị rách bao bì khi vận chuyển');
GO

-- 15. PhieuNhapKho
INSERT INTO PhieuNhapKho (MA_PHIEU_NHAP_KHO, MA_BIEN_BAN_GIAO_NHAN, MA_KHO, NGAY_LAP, MA_THU_KHO, NGUOI_GIAO, TONG_SO_LUONG_THEO_CHUNG_TU, TONG_SO_LUONG_THUC_NHAP, TONG_TIEN, TRANG_THAI, GHI_CHU) VALUES
('PNK0001', 'BBGN001', 'KHO01', '2026-05-05 11:00:00', 'NV02', N'Nguyễn Văn Tài', 500, 500, 50000000, N'Đã ghi nhận tồn', NULL),
('PNK0002', 'BBGN002', 'KHO01', '2026-05-15 11:00:00', 'NV03', N'Lê Thị Mai',     200, 195, 29250000, N'Đã ghi nhận tồn', N'Chỉ nhập kho phần hàng đạt kiểm nhận (195/198)');
GO

-- 16. LoHang
INSERT INTO LoHang (MA_LO_HANG, MA_MAT_HANG, NGAY_SAN_XUAT, HAN_SU_DUNG, NGAY_NHAP, MA_PHIEU_NHAP_KHO, TRANG_THAI_LO, GHI_CHU) VALUES
('LOT0001', 'MH001', '2026-04-01', '2027-04-01', '2026-05-05', 'PNK0001', N'Bình thường', NULL),
('LOT0002', 'MH003', '2026-03-15', '2026-09-15', '2026-05-05', 'PNK0001', N'Bình thường', NULL),
('LOT0003', 'MH002', '2026-02-01', '2027-02-01', '2026-05-15', 'PNK0002', N'Bình thường', NULL);
GO

-- 17. ChiTietBienBanGiaoNhan (DON_VI_TINH -> FK)
INSERT INTO ChiTietBienBanGiaoNhan (MA_CHI_TIET_BBGN, MA_BIEN_BAN_GIAO_NHAN, MA_MAT_HANG, MA_LO_HANG, MA_DON_VI_TINH, SO_LUONG_THEO_CHUNG_TU, SO_LUONG_THUC_NHAN, SO_LUONG_DAT, SO_LUONG_KHONG_DAT, TINH_TRANG_HANG, CAN_KIEM_NGHIEM, GHI_CHU) VALUES
('CTBBGN001', 'BBGN001', 'MH001', 'LOT0001', 'DVT01', 300, 300, 300, 0, N'Tốt',                          0, NULL),
('CTBBGN002', 'BBGN001', 'MH003', 'LOT0002', 'DVT01', 200, 200, 200, 0, N'Tốt',                          0, NULL),
('CTBBGN003', 'BBGN002', 'MH002', 'LOT0003', 'DVT02', 200, 198, 195, 3, N'3 hộp bị rách bao bì, hở miệng',1, N'Cần kiểm nghiệm trước khi nhập kho');
GO

-- 18. BienBanKiemNghiem
INSERT INTO BienBanKiemNghiem (MA_BIEN_BAN_KIEM_NGHIEM, MA_BIEN_BAN_GIAO_NHAN, NGAY_LAP, MA_THU_KHO, NGUOI_KIEM_NGHIEM, KET_LUAN, TRANG_THAI, GHI_CHU) VALUES
('BBKN001', 'BBGN002', '2026-05-15 13:00:00', 'NV03', N'Hoàng Văn Em (KCS)', N'3 hộp rách bao bì không đạt, số còn lại đạt chất lượng', N'Đã xác nhận', NULL);
GO

-- 19. ChiTietBienBanKiemNghiem (DON_VI_TINH -> FK)
INSERT INTO ChiTietBienBanKiemNghiem (MA_CHI_TIET_BBKN, MA_BIEN_BAN_KIEM_NGHIEM, MA_CHI_TIET_BBGN, MA_MAT_HANG, PHUONG_THUC_KIEM_NGHIEM, MA_DON_VI_TINH, SO_LUONG_THEO_CHUNG_TU, SO_LUONG_KIEM_NGHIEM, SO_LUONG_DAT, SO_LUONG_KHONG_DAT, LY_DO_KHONG_DAT, GHI_CHU) VALUES
('CTBBKN001', 'BBKN001', 'CTBBGN003', 'MH002', N'Kiểm tra cảm quan bao bì', 'DVT02', 198, 198, 195, 3, N'Bao bì rách, hở miệng hộp', NULL);
GO

-- 20. ChiTietPhieuNhapKho (DON_VI_TINH -> FK)
INSERT INTO ChiTietPhieuNhapKho (MA_CHI_TIET_PNK, MA_PHIEU_NHAP_KHO, MA_MAT_HANG, MA_LO_HANG, MA_DON_VI_TINH, SO_LUONG_THEO_CHUNG_TU, SO_LUONG_THUC_NHAP, DON_GIA, THANH_TIEN, GHI_CHU) VALUES
('CTPNK001', 'PNK0001', 'MH001', 'LOT0001', 'DVT01', 300, 300, 100000, 30000000, NULL),
('CTPNK002', 'PNK0001', 'MH003', 'LOT0002', 'DVT01', 200, 200, 100000, 20000000, NULL),
('CTPNK003', 'PNK0002', 'MH002', 'LOT0003', 'DVT02', 198, 195, 150000, 29250000, N'Chỉ nhập phần đạt kiểm nghiệm');
GO

-- 21. HoSoDotNhap
INSERT INTO HoSoDotNhap (MA_HO_SO_DOT_NHAP, MA_DON_MUA, MA_CHUNG_TU_GIAO, MA_BIEN_BAN_GIAO_NHAN, MA_BIEN_BAN_KIEM_NGHIEM, MA_PHIEU_NHAP_KHO, NGAY_TAO, TRANG_THAI, GHI_CHU) VALUES
('HSDN001', 'PO0001', 'CTG0001', 'BBGN001', NULL,      'PNK0001', '2026-05-05 08:00:00', N'Hoàn tất', NULL),
('HSDN002', 'PO0002', 'CTG0002', 'BBGN002', 'BBKN001', 'PNK0002', '2026-05-15 08:00:00', N'Hoàn tất', NULL);
GO

-- 22. TonTheoViTri
INSERT INTO TonTheoViTri (MA_TON_VI_TRI, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, MA_CHI_TIET_PNK, SO_LUONG, TRANG_THAI_TON, NGAY_DUA_VAO, NGAY_CAP_NHAT_GAN_NHAT, GHI_CHU) VALUES
('TVT0001', 'MH001', 'LOT0001', 'VT0003', 'CTPNK001', 300, N'Khả dụng', '2026-05-05 12:00:00', '2026-06-26 17:00:00', NULL),
('TVT0002', 'MH003', 'LOT0002', 'VT0002', 'CTPNK002', 197, N'Khả dụng', '2026-05-05 12:30:00', '2026-06-27 09:00:00', N'Đã điều chỉnh giảm 3 sau kiểm kê (xem ChiTietSaiLechTonKho CTSL001)'),
('TVT0003', 'MH002', 'LOT0003', 'VT0001', 'CTPNK003', 195, N'Khả dụng', '2026-05-15 14:00:00', '2026-05-15 14:00:00', NULL);
GO

-- 23. TheKho
INSERT INTO TheKho (MA_THE_KHO, MA_MAT_HANG, NGAY_MO_THE, NGUOI_LAP_THE, TRANG_THAI) VALUES
('TK0001', 'MH001', '2026-05-05 12:00:00', 'NV02', N'Đang dùng'),
('TK0002', 'MH002', '2026-05-15 14:00:00', 'NV03', N'Đang dùng'),
('TK0003', 'MH003', '2026-05-05 12:30:00', 'NV02', N'Đang dùng');
GO

-- 24. DongTheKho
INSERT INTO DongTheKho (MA_DONG_THE_KHO, MA_THE_KHO, NGAY_GHI, MA_CHUNG_TU, LOAI_CHUNG_TU, DIEN_GIAI, SO_LUONG_NHAP, SO_LUONG_XUAT, SO_LUONG_TON, NGUOI_GHI) VALUES
('DTK0001', 'TK0001', '2026-05-05 12:00:00', 'PNK0001', N'Phiếu nhập kho', N'Nhập kho lô LOT0001',     300, 0, 300, 'NV02'),
('DTK0002', 'TK0003', '2026-05-05 12:30:00', 'PNK0001', N'Phiếu nhập kho', N'Nhập kho lô LOT0002',     200, 0, 200, 'NV02'),
('DTK0003', 'TK0002', '2026-05-15 14:00:00', 'PNK0002', N'Phiếu nhập kho', N'Nhập kho lô LOT0003',     195, 0, 195, 'NV03'),
('DTK0004', 'TK0003', '2026-06-27 09:00:00', 'PASL001', N'Điều chỉnh tồn kho', N'Điều chỉnh giảm 3 túi mì Hảo Hảo do thiếu hụt khi kiểm kê', 0, 3, 197, 'NV03');
GO

-- 25. BienDongTonKho
INSERT INTO BienDongTonKho (MA_BIEN_DONG, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, MA_CHUNG_TU, LOAI_CHUNG_TU, LOAI_BIEN_DONG, SO_LUONG, THOI_GIAN, NGUOI_THUC_HIEN, GHI_CHU) VALUES
('BD0001', 'MH001', 'LOT0001', 'VT0003', 'PNK0001', N'Phiếu nhập kho',     N'Nhập kho',          300, '2026-05-05 12:00:00', 'NV02', NULL),
('BD0002', 'MH003', 'LOT0002', 'VT0002', 'PNK0001', N'Phiếu nhập kho',     N'Nhập kho',          200, '2026-05-05 12:30:00', 'NV02', NULL),
('BD0003', 'MH002', 'LOT0003', 'VT0001', 'PNK0002', N'Phiếu nhập kho',     N'Nhập kho',          195, '2026-05-15 14:00:00', 'NV03', NULL),
('BD0004', 'MH001', 'LOT0001', 'VT0004', 'PCL0001',  N'Phiếu cách ly hàng', N'Chuyển vị trí (cách ly)', 5,   '2026-06-01 09:00:00', 'NV02', N'Cách ly 5 hộp sữa nghi hỏng'),
('BD0005', 'MH001', 'LOT0001', 'VT0004', 'BBTH001',  N'Biên bản tiêu hủy',  N'Tiêu hủy',          5,   '2026-06-03 14:00:00', 'NV02', NULL),
('BD0006', 'MH003', 'LOT0002', 'VT0002', 'PASL001',  N'Phương án xử lý sai lệch', N'Điều chỉnh giảm tồn kho', 3, '2026-06-27 09:00:00', 'NV03', N'Điều chỉnh giảm do thiếu hụt');
GO

-- 26. PhieuBaoCaoHangLoi
INSERT INTO PhieuBaoCaoHangLoi (MA_PHIEU_BAO_CAO, NGUOI_LAP, THOI_DIEM_LAP, NGUON_PHAT_HIEN, MO_TA_CHUNG, TRANG_THAI_PHIEU, GHI_CHU) VALUES
('PBC0001', 'NV02', '2026-06-01 08:00:00', N'Kiểm tra định kỳ',          N'Phát hiện một số hộp sữa bị phồng, có dấu hiệu hỏng', N'Đã xử lý', NULL),
('PBC0002', 'NV03', '2026-05-15 15:00:00', N'Phát hiện khi kiểm nhận',   N'3 hộp nước rửa tay bị rách bao bì khi giao hàng',     N'Đã xử lý', NULL);
GO

-- 27. ChiTietPhieuBaoCaoHangLoi
INSERT INTO ChiTietPhieuBaoCaoHangLoi (MA_CHI_TIET_PHIEU, MA_PHIEU_BAO_CAO, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, SO_LUONG_BAO_CAO, LOAI_VAN_DE, TINH_TRANG_HANG, MO_TA_CHI_TIET, MINH_CHUNG) VALUES
('CTPBC001', 'PBC0001', 'MH001', 'LOT0001', 'VT0003', 5, N'Hỏng', N'Hộp bị phồng, có mùi lạ',     N'5 hộp sữa bị phồng nắp, nghi hỏng do bảo quản', N'/files/hangloi/anh_001.jpg'),
('CTPBC002', 'PBC0002', 'MH002', 'LOT0003', 'VT0001', 3, N'Lỗi',  N'Bao bì rách, hở miệng hộp',   N'3 hộp bị rách trong quá trình vận chuyển',       N'/files/hangloi/anh_002.jpg');
GO

-- 28. PhieuCachLyHang
INSERT INTO PhieuCachLyHang (MA_PHIEU_CACH_LY, MA_PHIEU_BAO_CAO, NGUOI_THUC_HIEN, THOI_DIEM_CACH_LY, VI_TRI_CACH_LY, TRANG_THAI_CACH_LY, GHI_CHU) VALUES
('PCL0001', 'PBC0001', 'NV02', '2026-06-01 09:00:00', 'VT0004', N'Đã cách ly', NULL);
GO

-- 29. PhuongAnXuLyHangLoi
INSERT INTO PhuongAnXuLyHangLoi (MA_PHUONG_AN, MA_PHIEU_BAO_CAO, LOAI_PHUONG_AN, LY_DO, NGUOI_CHON_PHUONG_AN, THOI_DIEM_CHON, CAN_DUYET_CAP_CAO, TRANG_THAI_PHUONG_AN) VALUES
('PA0001', 'PBC0001', N'Tiêu hủy',         N'Hàng hỏng không thể sử dụng, đã quá thời hạn đổi trả NCC', 'NV01', '2026-06-01 10:00:00', 1, N'Đã duyệt'),
('PA0002', 'PBC0002', N'Trả nhà cung cấp', N'Hàng lỗi do vận chuyển từ NCC, còn trong thời hạn đổi trả', 'NV04', '2026-05-15 16:00:00', 0, N'Đã duyệt');
GO

-- 30. LenhXuLyHangLoi
INSERT INTO LenhXuLyHangLoi (MA_LENH_XU_LY, MA_PHUONG_AN, NGUOI_DUOC_PHAN_CONG, NOI_DUNG_LENH, THOI_HAN, TRANG_THAI_LENH, KET_QUA_THUC_HIEN) VALUES
('LXL0001', 'PA0001', 'NV02', N'Tiến hành tiêu hủy 5 hộp sữa hỏng theo quy trình', '2026-06-03 17:00:00', N'Hoàn thành', N'Đã tiêu hủy đúng quy trình'),
('LXL0002', 'PA0002', 'NV03', N'Lập phiếu trả 3 hộp lỗi cho NCC02',                 '2026-05-20 17:00:00', N'Hoàn thành', N'Đã trả hàng, NCC xác nhận');
GO

-- 31. BienBanTieuHuy
INSERT INTO BienBanTieuHuy (MA_BIEN_BAN_TIEU_HUY, MA_LENH_XU_LY, NGAY_TIEU_HUY, NGUOI_THUC_HIEN, NGUOI_CHUNG_KIEN, SO_LUONG_TIEU_HUY, PHUONG_THUC_TIEU_HUY, MINH_CHUNG, GHI_CHU) VALUES
('BBTH001', 'LXL0001', '2026-06-03 14:00:00', 'NV02', 'NV06', 5, N'Tiêu hủy theo quy định vệ sinh môi trường', N'/files/tieuhuy/bb_001.pdf', NULL);
GO

-- 32. PhieuTraNhaCungCap
INSERT INTO PhieuTraNhaCungCap (MA_PHIEU_TRA, MA_LENH_XU_LY, MA_NHA_CUNG_CAP, NGAY_LAP, NGUOI_LAP, LY_DO_TRA, SO_LUONG_TRA, TRANG_THAI_TRA, GHI_CHU) VALUES
('PTNCC001', 'LXL0002', 'NCC02', '2026-05-16 09:00:00', 'NV03', N'Hàng bị rách bao bì do lỗi vận chuyển', 3, N'Đã hoàn tất', NULL);
GO

-- 33. HoSoXuLyHangLoi
INSERT INTO HoSoXuLyHangLoi (MA_HO_SO, MA_PHIEU_BAO_CAO, MA_PHUONG_AN, MA_LENH_XU_LY, NGAY_TAO, TRANG_THAI_HO_SO, NGAY_DONG_HO_SO, GHI_CHU) VALUES
('HSHL001', 'PBC0001', 'PA0001', 'LXL0001', '2026-06-01 08:30:00', N'Đã đóng', '2026-06-03 15:00:00', NULL),
('HSHL002', 'PBC0002', 'PA0002', 'LXL0002', '2026-05-15 15:30:00', N'Đã đóng', '2026-05-16 10:00:00', NULL);
GO

-- 34. ThanhVienKiemKe (PK kép)
INSERT INTO ThanhVienKiemKe (MA_NHOM_KIEM_KE, MA_NHAN_VIEN, VAI_TRO_TRONG_NHOM) VALUES
('NKK01', 'NV07', N'Trưởng nhóm'),
('NKK01', 'NV08', N'Thành viên'),
('NKK02', 'NV02', N'Giám sát');
GO

-- 35. DotKiemKe
INSERT INTO DotKiemKe (MA_DOT_KIEM_KE, TEN_DOT_KIEM_KE, MA_KHO, LOAI_KIEM_KE, PHAM_VI_KIEM_KE, THOI_DIEM_BAT_DAU, THOI_DIEM_KET_THUC, NGUOI_LAP, TRANG_THAI_DOT, GHI_CHU) VALUES
('DKK0001', N'Kiểm kê định kỳ Quý 2/2026', 'KHO01', N'Định kỳ', N'Toàn kho', '2026-06-25 08:00:00', '2026-06-26 17:00:00', 'NV01', N'Hoàn thành', NULL);
GO

-- 36. PhieuKiemKe
INSERT INTO PhieuKiemKe (MA_PHIEU_KIEM_KE, MA_DOT_KIEM_KE, MA_NHOM_KIEM_KE, NGUOI_PHU_TRACH, NGAY_TAO, TRANG_THAI_PHIEU, GHI_CHU) VALUES
('PKK0001', 'DKK0001', 'NKK01', 'NV07', '2026-06-25 08:00:00', N'Hoàn thành', NULL);
GO

-- 37. NhiemVuKiemKe
INSERT INTO NhiemVuKiemKe (MA_NHIEM_VU, MA_DOT_KIEM_KE, NGUOI_DUOC_PHAN_CONG, PHAM_VI_KIEM_KE, THOI_HAN, TRANG_THAI_NHIEM_VU, KET_QUA_THUC_HIEN) VALUES
('NVKK001', 'DKK0001', 'NV07', N'Khu A và Khu B', '2026-06-26 17:00:00', N'Hoàn thành', N'Đã kiểm đầy đủ, phát hiện 1 sai lệch nhỏ');
GO

-- 38. ChiTietKiemKe
INSERT INTO ChiTietKiemKe (MA_CHI_TIET_KIEM_KE, MA_PHIEU_KIEM_KE, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI_HE_THONG, MA_VI_TRI_THUC_TE, TRANG_THAI_TON_HE_THONG, TRANG_THAI_TON_THUC_TE, SO_LUONG_SO_SACH, SO_LUONG_THUC_TE, CHENH_LECH, LOAI_CHENH_LECH, TINH_TRANG_HANG, GHI_CHU) VALUES
('CTKK001', 'PKK0001', 'MH001', 'LOT0001', 'VT0003', 'VT0003', N'Khả dụng', N'Khả dụng', 300, 300, 0,  NULL,      N'Tốt', NULL),
('CTKK002', 'PKK0001', 'MH003', 'LOT0002', 'VT0002', 'VT0002', N'Khả dụng', N'Khả dụng', 200, 197, -3, N'Thiếu',  N'Tốt', N'Thiếu 3 thùng so với sổ sách');
GO

-- 39. BienBanKiemKe
INSERT INTO BienBanKiemKe (MA_BIEN_BAN_KIEM_KE, MA_DOT_KIEM_KE, NGAY_LAP, NGUOI_LAP, DAI_DIEN_QUAN_LY_KHO, DAI_DIEN_THU_KHO, DAI_DIEN_KE_TOAN, KET_LUAN, TRANG_THAI_BIEN_BAN, GHI_CHU) VALUES
('BBKK001', 'DKK0001', '2026-06-26 17:00:00', 'NV01', 'NV01', 'NV02', 'NV06', N'Phát hiện thiếu 3 thùng mì Hảo Hảo, đã lập hồ sơ xử lý sai lệch', N'Đã xác nhận', NULL);
GO

-- 40. ChiTietBienBanKiemKe (DON_VI_TINH -> FK)
INSERT INTO ChiTietBienBanKiemKe (MA_CHI_TIET_BIEN_BAN, MA_BIEN_BAN_KIEM_KE, MA_CHI_TIET_KIEM_KE, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, MA_DON_VI_TINH, SO_LUONG_SO_SACH, SO_LUONG_THUC_TE, SO_LUONG_THUA, SO_LUONG_THIEU, TINH_TRANG_HANG, GHI_CHU) VALUES
('CTBBKK001', 'BBKK001', 'CTKK001', 'MH001', 'LOT0001', 'VT0003', 'DVT01', 300, 300, 0, 0, N'Tốt', NULL),
('CTBBKK002', 'BBKK001', 'CTKK002', 'MH003', 'LOT0002', 'VT0002', 'DVT01', 200, 197, 0, 3, N'Tốt', NULL);
GO

-- 41. HoSoXuLySaiLechTonKho
INSERT INTO HoSoXuLySaiLechTonKho (MA_HO_SO, NGUOI_PHAT_HIEN, THOI_DIEM_PHAT_HIEN, NGUON_PHAT_HIEN, MO_TA_CHUNG, TRANG_THAI_HO_SO, NGUOI_XU_LY, THOI_DIEM_XU_LY, GHI_CHU) VALUES
('HSSL001', 'NV07', '2026-06-26 16:00:00', N'Kiểm kê', N'Thiếu 3 thùng mì Hảo Hảo so với sổ sách tại vị trí VT0002', N'Đã xử lý', 'NV01', '2026-06-27 09:00:00', NULL);
GO

-- 42. ChiTietSaiLechTonKho (DON_VI_TINH -> FK)
INSERT INTO ChiTietSaiLechTonKho (MA_CHI_TIET_SAI_LECH, MA_HO_SO, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, TRANG_THAI_HANG, MA_DON_VI_TINH, SO_LUONG_HE_THONG, SO_LUONG_THUC_TE, SO_LUONG_SAI_LECH, LOAI_SAI_LECH, MO_TA_SAI_LECH, MINH_CHUNG) VALUES
('CTSL001', 'HSSL001', 'MH003', 'LOT0002', 'VT0002', N'Khả dụng', 'DVT01', 200, 197, -3, N'Thiếu', N'Thiếu 3 thùng so với sổ sách, nghi do thất thoát khi xuất hàng lẻ', NULL);
GO

-- 43. PhieuKiemKeXacMinh
INSERT INTO PhieuKiemKeXacMinh (MA_PHIEU_KKXM, MA_HO_SO, NGUOI_KIEM_KE, THOI_DIEM_KIEM_KE, PHAM_VI_KIEM_KE, KET_QUA_KIEM_KE, TRANG_THAI_PHIEU, GHI_CHU) VALUES
('PKKXM001', 'HSSL001', 'NV08', '2026-06-26 17:30:00', N'Vị trí VT0002', N'Xác nhận thiếu 3 thùng mì Hảo Hảo', N'Hoàn thành', NULL);
GO

-- 44. ChiTietPhieuKiemKeXacMinh
INSERT INTO ChiTietPhieuKiemKeXacMinh (MA_CHI_TIET_KKXM, MA_PHIEU_KKXM, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, SO_LUONG_THUC_TE, TINH_TRANG_HANG, GHI_CHU) VALUES
('CTKKXM001', 'PKKXM001', 'MH003', 'LOT0002', 'VT0002', 197, N'Tốt', NULL);
GO

-- 45. PhuongAnXuLySaiLech
INSERT INTO PhuongAnXuLySaiLech (MA_PHUONG_AN, MA_HO_SO, LOAI_PHUONG_AN, LY_DO, NGUOI_CHON_PHUONG_AN, THOI_DIEM_CHON, CAN_THAO_TAC_VAT_LY, CAN_DUYET_CAP_CAO, TRANG_THAI_PHUONG_AN) VALUES
('PASL001', 'HSSL001', N'Điều chỉnh giảm tồn kho', N'Xác nhận thiếu hụt thực tế, điều chỉnh số liệu cho khớp thực tế', 'NV01', '2026-06-27 08:30:00', 0, 1, N'Đã duyệt');
GO

-- 46. PheDuyetPhuongAnSaiLech
INSERT INTO PheDuyetPhuongAnSaiLech (MA_PHE_DUYET, MA_PHUONG_AN, NGUOI_PHE_DUYET, THOI_DIEM_PHE_DUYET, KET_QUA_PHE_DUYET, GHI_CHU) VALUES
('PD0001', 'PASL001', 'NV01', '2026-06-27 09:00:00', N'Duyệt', NULL);
GO

-- 47. NhiemVuXuLySaiLech
INSERT INTO NhiemVuXuLySaiLech (MA_NHIEM_VU, MA_HO_SO, NGUOI_DUOC_PHAN_CONG, NOI_DUNG_NHIEM_VU, THOI_HAN, TRANG_THAI_NHIEM_VU, KET_QUA_THUC_HIEN) VALUES
('NVSL001', 'HSSL001', 'NV03', N'Cập nhật điều chỉnh giảm 3 thùng mì Hảo Hảo trên hệ thống', '2026-06-28 17:00:00', N'Hoàn thành', N'Đã điều chỉnh xong trên hệ thống');
GO

-- 48. TepDinhKem
INSERT INTO TepDinhKem (MA_TEP, TEN_TEP, DUONG_DAN, LOAI_TEP, DOI_TUONG_LIEN_KET, MA_DOI_TUONG_LIEN_KET, NGAY_TAI_LEN, NGUOI_TAI_LEN) VALUES
('TEP00001', N'anh_hang_loi_001.jpg', N'/files/2026/06/anh_hang_loi_001.jpg', N'Ảnh', N'PhieuBaoCaoHangLoi', 'PBC0001', '2026-06-01 08:10:00', 'NV02'),
('TEP00002', N'bb_tieuhuy_001.pdf',   N'/files/2026/06/bb_tieuhuy_001.pdf',   N'PDF', N'BienBanTieuHuy',     'BBTH001', '2026-06-03 14:30:00', 'NV02');
GO

-- 49. NhatKyThaoTac
INSERT INTO NhatKyThaoTac (MA_LOG, NGUOI_THAO_TAC, THOI_GIAN, HANH_DONG, DOI_TUONG_BI_TAC_DONG, MA_DOI_TUONG, DU_LIEU_TRUOC, DU_LIEU_SAU, GHI_CHU) VALUES
('LOG00001', 'NV02', '2026-05-05 12:00:00', N'Tạo phiếu nhập kho',                     N'PhieuNhapKho',         'PNK0001', NULL, NULL, NULL),
('LOG00002', 'NV01', '2026-06-01 10:00:00', N'Phê duyệt phương án xử lý hàng lỗi',      N'PhuongAnXuLyHangLoi',  'PA0001',  NULL, NULL, NULL),
('LOG00003', 'NV01', '2026-06-27 09:00:00', N'Phê duyệt phương án xử lý sai lệch tồn kho', N'PhuongAnXuLySaiLech', 'PASL001', NULL, NULL, NULL);
GO

-- =====================================================================
-- 50. CauHinhDinhMucTon (cấu hình định mức tồn kho)
-- ---------------------------------------------------------------------
INSERT INTO CauHinhDinhMucTon (MA_CAU_HINH, MA_KHO, MA_MAT_HANG, MUC_TON_TOI_THIEU, MUC_TON_TOI_DA, NGUONG_CAN_HAN, TRANG_THAI) VALUES
('CH0001', 'KHO01', 'MH001', 50,  500, 60, N'Đang áp dụng'),
('CH0002', 'KHO01', 'MH002', 200, 400, 60, N'Đang áp dụng'),  -- tồn hiện tại 195 < 200 -> sinh cảnh báo
('CH0003', 'KHO01', 'MH003', 150, 500, 90, N'Đang áp dụng');  -- LOT0002 còn ~78 ngày tới HSD, trong ngưỡng 90 ngày
GO

-- ---------------------------------------------------------------------
-- 51. CanhBaoTonKho
-- ---------------------------------------------------------------------
INSERT INTO CanhBaoTonKho (MA_CANH_BAO, MA_KHO, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, LOAI_CANH_BAO, MUC_DO_UU_TIEN, SO_LUONG_HIEN_TAI, NGUONG_CANH_BAO, THOI_DIEM_PHAT_SINH, TRANG_THAI_CANH_BAO, MO_TA, GHI_CHU) VALUES
('CB0001', 'KHO01', 'MH002', 'LOT0003', 'VT0001', N'Dưới mức tối thiểu', N'Cao',         195, 200, '2026-06-28 06:00:00', N'Đang xử lý',  N'Tồn kho nước rửa tay Lifebuoy 500ml tại VT0001 đang dưới mức tối thiểu (195/200 hộp)', NULL),
('CB0002', 'KHO01', 'MH003', 'LOT0002', 'VT0002', N'Gần hết hạn',        N'Trung bình', 197, 90,  '2026-06-28 06:00:00', N'Đã xác minh', N'Lô mì Hảo Hảo LOT0002 còn khoảng 78 ngày tới hạn sử dụng (15/09/2026), trong ngưỡng cảnh báo 90 ngày', NULL);
GO

-- ---------------------------------------------------------------------
-- 52. ChiTietCanhBaoTonKho
-- ---------------------------------------------------------------------
INSERT INTO ChiTietCanhBaoTonKho (MA_CHI_TIET_CANH_BAO, MA_CANH_BAO, MA_TON_VI_TRI, SO_LUONG_VAT_LY, SO_LUONG_KHA_DUNG, HAN_SU_DUNG, TRANG_THAI_TON, NGUYEN_NHAN_DU_KIEN, GHI_CHU) VALUES
('CTCB001', 'CB0001', 'TVT0003', 195, 195, '2027-02-01', N'Khả dụng', N'Tốc độ tiêu thụ tăng do khuyến mãi, chưa kịp đặt hàng bổ sung', NULL),
('CTCB002', 'CB0002', 'TVT0002', 197, 197, '2026-09-15', N'Khả dụng', N'Lô hàng nhập đã lâu, cần ưu tiên xuất trước (nguyên tắc FEFO)',  NULL);
GO

-- ---------------------------------------------------------------------
-- 53. NhiemVuXacMinhCanhBao
-- ---------------------------------------------------------------------
INSERT INTO NhiemVuXacMinhCanhBao (MA_NHIEM_VU, MA_CANH_BAO, NGUOI_DUOC_PHAN_CONG, NOI_DUNG_YEU_CAU, THOI_HAN, TRANG_THAI_NHIEM_VU, KET_QUA_TOM_TAT) VALUES
('NVXM001', 'CB0001', 'NV02', N'Kiểm tra thực tế tồn kho nước rửa tay Lifebuoy tại VT0001, xác nhận số lượng và đề xuất phương án', '2026-06-29 17:00:00', N'Hoàn thành', N'Xác nhận tồn thực tế 195 hộp, đúng như hệ thống, cần mua bổ sung'),
('NVXM002', 'CB0002', 'NV02', N'Kiểm tra tình trạng lô mì LOT0002 gần hết hạn, đề xuất ưu tiên xuất bán',                       '2026-06-29 17:00:00', N'Hoàn thành', N'Hàng còn tốt, đã đánh dấu ưu tiên xuất trước');
GO

-- ---------------------------------------------------------------------
-- 54. KetQuaXacMinhCanhBao
-- ---------------------------------------------------------------------
INSERT INTO KetQuaXacMinhCanhBao (MA_KET_QUA, MA_NHIEM_VU, MA_CANH_BAO, SO_LUONG_THUC_TE, MA_VI_TRI_THUC_TE, MA_LO_HANG_THUC_TE, TINH_TRANG_HANG, GHI_CHU, THOI_DIEM_CAP_NHAT, NGUOI_CAP_NHAT) VALUES
('KQXM001', 'NVXM001', 'CB0001', 195, 'VT0001', 'LOT0003', N'Tốt',                          N'Khớp với hệ thống',               '2026-06-29 09:00:00', 'NV02'),
('KQXM002', 'NVXM002', 'CB0002', 197, 'VT0002', 'LOT0002', N'Tốt, bao bì còn nguyên',        N'Đã dán nhãn ưu tiên xuất trước',  '2026-06-29 09:30:00', 'NV02');
GO

-- ---------------------------------------------------------------------
-- 55. PhuongAnXuLyCanhBao
-- ---------------------------------------------------------------------
INSERT INTO PhuongAnXuLyCanhBao (MA_PHUONG_AN, MA_CANH_BAO, LOAI_PHUONG_AN, NOI_DUNG_PHUONG_AN, NGUOI_CHON, THOI_DIEM_CHON, TRANG_THAI_PHUONG_AN, GHI_CHU) VALUES
('PACB001', 'CB0001', N'Mua bổ sung', N'Đề xuất mua thêm 300 hộp nước rửa tay Lifebuoy để đạt mức tồn an toàn', 'NV01', '2026-06-29 10:00:00', N'Đã duyệt', NULL),
('PACB002', 'CB0002', N'Theo dõi',    N'Ưu tiên xuất bán lô LOT0002 trước, theo dõi định kỳ hàng tuần',        'NV01', '2026-06-29 10:15:00', N'Đã duyệt', NULL);
GO

-- ---------------------------------------------------------------------
-- 56. YeuCauMuaBoSung (chỉ phát sinh từ phương án "Mua bổ sung" - PACB001)
-- ---------------------------------------------------------------------
INSERT INTO YeuCauMuaBoSung (MA_YEU_CAU_MUA, MA_CANH_BAO, MA_MAT_HANG, MA_KHO, SO_LUONG_DE_XUAT, LY_DO, TRANG_THAI_YEU_CAU, NGUOI_TAO, THOI_DIEM_TAO) VALUES
('YCM0001', 'CB0001', 'MH002', 'KHO01', 300, N'Tồn kho dưới mức tối thiểu, cần bổ sung để đáp ứng nhu cầu bán ra', N'Đang chờ duyệt mua hàng', 'NV04', '2026-06-29 11:00:00');
GO

-- ---------------------------------------------------------------------
-- 57. TaiKhoan
-- Mật khẩu demo cho TẤT CẢ tài khoản: Test@123 (đã băm bằng bcrypt,
-- cost factor 10). CHỈ dùng cho môi trường dev/test - đổi mật khẩu
-- và KHÔNG dùng các hash này khi đưa lên production.
-- ---------------------------------------------------------------------
INSERT INTO TaiKhoan (MA_TAI_KHOAN, MA_NHAN_VIEN, TEN_DANG_NHAP, MAT_KHAU_HASH, TRANG_THAI_TAI_KHOAN, NGAY_TAO, LAN_DANG_NHAP_CUOI, SO_LAN_DANG_NHAP_SAI, GHI_CHU) VALUES
('TK00001', 'NV01', 'an.nv',     '$2b$10$2c1ukE5P2.sj8gQn38Kg0O7vTlOXMiXnur0CsGLZp.JqNp1XAFsZG', N'Hoạt động', '2026-05-01 08:00:00', '2026-06-29 08:00:00', 0, NULL),
('TK00002', 'NV02', 'binh.tt',   '$2b$10$GpM1zQ9GS0PQZlpKHeXPYOiMhCPHIfvq2FDaeO/vK2maaU.yUDaAC', N'Hoạt động', '2026-05-01 08:05:00', '2026-06-29 07:45:00', 0, NULL),
('TK00003', 'NV03', 'cuong.lv',  '$2b$10$TNqlwWXgvhSDpZk2zK4BEO13i2PorD1RcnUAs8Cw8QNX2FQZgMYPu', N'Hoạt động', '2026-05-01 08:10:00', '2026-06-28 17:20:00', 0, NULL),
('TK00004', 'NV04', 'dung.pt',   '$2b$10$Z2s9AU8kRJGLx2YJySsfAuUjPgX3kKJfdp0bqWtHXJNfxvLDesB2S', N'Hoạt động', '2026-05-01 08:15:00', '2026-06-29 09:00:00', 0, NULL),
('TK00005', 'NV05', 'em.hv',     '$2b$10$f6w.OEF3THBeXaV1IG.imewoXnOofNrTUIVMcZgCf1mS/kNBpTk.a', N'Hoạt động', '2026-05-01 08:20:00', '2026-05-20 10:00:00', 0, NULL),
('TK00006', 'NV06', 'phuong.vt', '$2b$10$m2.7PBgcL2IW0weQ1SxxxOzQUy9XUDjza5cQu3eBn.EolAd41YC3u', N'Hoạt động', '2026-05-01 08:25:00', '2026-06-27 16:30:00', 0, NULL),
('TK00007', 'NV07', 'giang.dv',  '$2b$10$Ul/LPbEntaXzl.chxFeWaOA.biVx.umsEeXOigBMdSd4I6s0bap4C', N'Hoạt động', '2026-05-01 08:30:00', '2026-06-26 08:00:00', 0, NULL),
('TK00008', 'NV08', 'hoa.bt',    '$2b$10$oBwStnSE8hAK8KulO8xfcehy.ccdZI.775eKYxmxz8WcDf1d3v7JS', N'Khóa',     '2026-05-01 08:35:00', '2026-06-10 09:00:00', 5, N'Tự động khóa do nhập sai mật khẩu quá 5 lần');
GO

PRINT N'Hoàn tất: đã insert dữ liệu mẫu cho toàn bộ 57 bảng.';
GO

/* =====================================================================
   KIỂM TRA NHANH SAU KHI CHẠY (tùy chọn):
   SELECT t.name, p.rows
   FROM sys.tables t
   JOIN sys.partitions p ON t.object_id = p.object_id AND p.index_id IN (0,1)
   ORDER BY t.name;
   ===================================================================== */