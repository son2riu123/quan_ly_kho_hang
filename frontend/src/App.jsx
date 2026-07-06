import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NhanVien from './pages/NhanVien';
import NhaCungCap from './pages/NhaCungCap';
import Kho from './pages/Kho';
import MatHang from './pages/MatHang';
import DonMuaHang from './pages/DonMuaHang';
import BienBanGiaoNhan from './pages/BienBanGiaoNhan';
import PhieuNhapKho from './pages/PhieuNhapKho';
import ViTriKho from './pages/ViTriKho';
import TonKho from './pages/TonKho';
import TheKho from './pages/TheKho';
import KiemKe from './pages/KiemKe';
import KiemNghiem from './pages/KiemNghiem';
import BaoCao from './pages/BaoCao';
import CaiDat from './pages/CaiDat';
import CanhBaoXacMinh from './pages/CanhBaoXacMinh';
import XuLySaiLech from './pages/XuLySaiLech';
import XuLyHangLoi from './pages/XuLyHangLoi';
import CauHinhDinhMuc from './pages/CauHinhDinhMuc';
import YeuCauMuaBoSung from './pages/YeuCauMuaBoSung';
import AuthGuard from './middlewares/authGuard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang đăng nhập - Không cần xác thực */}
        <Route path="/login" element={<Login />} />

        {/* Các trang nội bộ - Yêu cầu đăng nhập và đúng quyền truy cập */}
        <Route path="/" element={<AuthGuard><Dashboard /></AuthGuard>} />
        <Route path="/nhanvien" element={<AuthGuard allowedRoles={['Quản lý kho', 'Ban giám đốc']}><NhanVien /></AuthGuard>} />
        <Route path="/nhacungcap" element={<AuthGuard allowedRoles={['Quản lý kho', 'Ban giám đốc']}><NhaCungCap /></AuthGuard>} />
        <Route path="/kho" element={<AuthGuard allowedRoles={['Quản lý kho', 'Ban giám đốc']}><Kho /></AuthGuard>} />
        <Route path="/mathang" element={<AuthGuard allowedRoles={['Quản lý kho', 'Ban giám đốc', 'Thủ kho']}><MatHang /></AuthGuard>} />
        <Route path="/donmuahang" element={<AuthGuard allowedRoles={['Quản lý kho', 'Ban giám đốc', 'Nhân viên mua hàng']}><DonMuaHang /></AuthGuard>} />
        <Route path="/bienbangiaonhan" element={<AuthGuard allowedRoles={['Quản lý kho', 'Thủ kho', 'Kế toán kho']}><BienBanGiaoNhan /></AuthGuard>} />
        <Route path="/phieunhapkho" element={<AuthGuard allowedRoles={['Quản lý kho', 'Thủ kho', 'Kế toán kho']}><PhieuNhapKho /></AuthGuard>} />
        <Route path="/vitrikho" element={<AuthGuard allowedRoles={['Quản lý kho', 'Thủ kho', 'Kế toán kho']}><ViTriKho /></AuthGuard>} />
        <Route path="/tonkho" element={<AuthGuard allowedRoles={['Quản lý kho', 'Thủ kho', 'Kế toán kho', 'Ban giám đốc']}><TonKho /></AuthGuard>} />
        <Route path="/thekho" element={<AuthGuard allowedRoles={['Quản lý kho', 'Thủ kho', 'Kế toán kho', 'Ban giám đốc']}><TheKho /></AuthGuard>} />
        <Route path="/kiemke" element={<AuthGuard allowedRoles={['Quản lý kho', 'Thủ kho']}><KiemKe /></AuthGuard>} />
        <Route path="/kiemnghiem" element={<AuthGuard allowedRoles={['Quản lý kho', 'Ban giám đốc', 'Nhân viên KCS']}><KiemNghiem /></AuthGuard>} />
        <Route path="/baocao" element={<AuthGuard allowedRoles={['Quản lý kho', 'Ban giám đốc', 'Kế toán kho']}><BaoCao /></AuthGuard>} />
        <Route path="/caidat" element={<AuthGuard allowedRoles={['Quản lý kho', 'Ban giám đốc']}><CaiDat /></AuthGuard>} />
        <Route path="/canhbaoxacminh" element={<AuthGuard allowedRoles={['Quản lý kho', 'Ban giám đốc', 'Thủ kho']}><CanhBaoXacMinh /></AuthGuard>} />
        <Route path="/xulysailech" element={<AuthGuard allowedRoles={['Quản lý kho', 'Ban giám đốc', 'Thủ kho']}><XuLySaiLech /></AuthGuard>} />
        <Route path="/xulyhangloi" element={<AuthGuard allowedRoles={['Quản lý kho', 'Ban giám đốc', 'Thủ kho']}><XuLyHangLoi /></AuthGuard>} />
        <Route path="/cauhinhdinhmuc" element={<AuthGuard allowedRoles={['Quản lý kho', 'Ban giám đốc']}><CauHinhDinhMuc /></AuthGuard>} />
        <Route path="/yeucaumuabosung" element={<AuthGuard allowedRoles={['Quản lý kho', 'Ban giám đốc', 'Nhân viên mua hàng']}><YeuCauMuaBoSung /></AuthGuard>} />
      </Routes>
    </Router>
  );
}

export default App;
