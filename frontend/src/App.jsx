import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NhanVien from './pages/NhanVien';
import NhaCungCap from './pages/NhaCungCap';
import Kho from './pages/Kho';
import MatHang from './pages/MatHang';
import DonMuaHang from './pages/DonMuaHang';
import PhieuNhapKho from './pages/PhieuNhapKho';
import ViTriKho from './pages/ViTriKho';
import TonKho from './pages/TonKho';
import TheKho from './pages/TheKho';
import KiemKe from './pages/KiemKe';
import AuthGuard from './middlewares/authGuard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang đăng nhập - Không cần xác thực */}
        <Route path="/login" element={<Login />} />

        {/* Các trang nội bộ - Yêu cầu đăng nhập */}
        <Route path="/" element={<AuthGuard><Dashboard /></AuthGuard>} />
        <Route path="/nhanvien" element={<AuthGuard><NhanVien /></AuthGuard>} />
        <Route path="/nhacungcap" element={<AuthGuard><NhaCungCap /></AuthGuard>} />
        <Route path="/kho" element={<AuthGuard><Kho /></AuthGuard>} />
        <Route path="/mathang" element={<AuthGuard><MatHang /></AuthGuard>} />
        <Route path="/donmuahang" element={<AuthGuard><DonMuaHang /></AuthGuard>} />
        <Route path="/phieunhapkho" element={<AuthGuard><PhieuNhapKho /></AuthGuard>} />
        <Route path="/vitrikho" element={<AuthGuard><ViTriKho /></AuthGuard>} />
        <Route path="/tonkho" element={<AuthGuard><TonKho /></AuthGuard>} />
        <Route path="/thekho" element={<AuthGuard><TheKho /></AuthGuard>} />
        <Route path="/kiemke" element={<AuthGuard><KiemKe /></AuthGuard>} />
      </Routes>
    </Router>
  );
}

export default App;
