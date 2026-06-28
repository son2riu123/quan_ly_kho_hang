import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/nhanvien" element={<NhanVien />} />
        <Route path="/nhacungcap" element={<NhaCungCap />} />
        <Route path="/kho" element={<Kho />} />
        <Route path="/mathang" element={<MatHang />} />
        <Route path="/donmuahang" element={<DonMuaHang />} />
        <Route path="/phieunhapkho" element={<PhieuNhapKho />} />
        <Route path="/vitrikho" element={<ViTriKho />} />
        <Route path="/tonkho" element={<TonKho />} />
        <Route path="/thekho" element={<TheKho />} />
        <Route path="/kiemke" element={<KiemKe />} />
      </Routes>
    </Router>
  );
}

export default App;
