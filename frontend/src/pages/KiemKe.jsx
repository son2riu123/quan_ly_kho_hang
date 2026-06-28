import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { 
  Search, 
  Plus, 
  Eye, 
  X, 
  Check, 
  Loader2, 
  CheckSquare,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

function KiemKe() {
  const [dots, setDots] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showDotModal, setShowDotModal] = useState(false);
  const [showPhieuModal, setShowPhieuModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPhieuDetailModal, setShowPhieuDetailModal] = useState(false);

  const [selectedDot, setSelectedDot] = useState(null);
  const [selectedPhieu, setSelectedPhieu] = useState(null);
  
  const [warehouses, setWarehouses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stockDetails, setStockDetails] = useState([]);
  const [search, setSearch] = useState('');

  const [dotForm, setDotForm] = useState({
    MA_DOT_KIEM_KE: '', TEN_DOT_KIEM_KE: '', MA_KHO: '', 
    LOAI_KIEM_KE: 'Đột xuất', PHAM_VI_KIEM_KE: 'Toàn bộ kho', 
    NGUOI_LAP: '', GHI_CHU: ''
  });

  const [phieuForm, setPhieuForm] = useState({
    MA_PHIEU_KIEM_KE: '', MA_DOT_KIEM_KE: '', NGUOI_PHU_TRACH: '',
    MA_NHOM_KIEM_KE: 'NK01', GHI_CHU: '', details: []
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dotsRes, khoRes, empRes] = await Promise.all([
        api.get('/kiemke/dot'),
        api.get('/kho'),
        api.get('/nhanvien')
      ]);
      setDots(dotsRes.data);
      setWarehouses(khoRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.error(err);
      setDots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDotChange = (e) => setDotForm({ ...dotForm, [e.target.name]: e.target.value });
  const handlePhieuChange = (e) => setPhieuForm({ ...phieuForm, [e.target.name]: e.target.value });

  const handleSelectDotForPhieu = async (e) => {
    const maDot = e.target.value;
    if (!maDot) {
      setPhieuForm(prev => ({ ...prev, MA_DOT_KIEM_KE: '', details: [] }));
      return;
    }

    try {
      // Tải thông tin tồn kho hiện tại để đối chiếu số sách
      const stockRes = await api.get('/tonkho');
      const dotInfo = dots.find(d => d.MA_DOT_KIEM_KE === maDot);
      
      // Lọc tồn kho của kho tương ứng với đợt kiểm kê
      const activeStock = stockRes.data.filter(item => item.MA_KHO === dotInfo.MA_KHO);

      const itemsToAudit = activeStock.map(item => ({
        MA_CHI_TIET_KIEM_KE: 'KK' + Math.floor(1000 + Math.random() * 9000),
        MA_MAT_HANG: item.MA_MAT_HANG,
        TEN_MAT_HANG: item.TEN_MAT_HANG,
        MA_LO_HANG: item.MA_LO_HANG,
        MA_VI_TRI_HE_THONG: item.MA_VI_TRI,
        TRANG_THAI_TON_HE_THONG: item.TRANG_THAI_TON,
        TRANG_THAI_TON_THUC_TE: item.TRANG_THAI_TON,
        SO_LUONG_SO_SACH: item.SO_LUONG,
        SO_LUONG_THUC_TE: item.SO_LUONG, // Default bằng số sách
        CHENH_LECH: 0,
        TINH_TRANG_HANG: 'Bình thường',
        GHI_CHU: ''
      }));

      setPhieuForm(prev => ({
        ...prev,
        MA_DOT_KIEM_KE: maDot,
        details: itemsToAudit
      }));
    } catch (err) {
      alert('Lỗi tải dữ liệu sổ sách: ' + err.message);
    }
  };

  const handleQtyChange = (idx, value) => {
    const qty = parseInt(value) || 0;
    setPhieuForm(prev => {
      const details = [...prev.details];
      details[idx].SO_LUONG_THUC_TE = qty;
      details[idx].CHENH_LECH = qty - details[idx].SO_LUONG_SO_SACH;
      return { ...prev, details };
    });
  };

  const handleStatusChange = (idx, value) => {
    setPhieuForm(prev => {
      const details = [...prev.details];
      details[idx].TINH_TRANG_HANG = value;
      return { ...prev, details };
    });
  };

  const openCreateDot = () => {
    setDotForm({
      MA_DOT_KIEM_KE: 'DK' + Math.floor(1000 + Math.random() * 9000),
      TEN_DOT_KIEM_KE: '',
      MA_KHO: '',
      LOAI_KIEM_KE: 'Đột xuất',
      PHAM_VI_KIEM_KE: 'Toàn bộ kho',
      NGUOI_LAP: '',
      GHI_CHU: ''
    });
    setShowDotModal(true);
  };

  const openCreatePhieu = () => {
    setPhieuForm({
      MA_PHIEU_KIEM_KE: 'PK' + Math.floor(1000 + Math.random() * 9000),
      MA_DOT_KIEM_KE: '',
      NGUOI_PHU_TRACH: '',
      MA_NHOM_KIEM_KE: 'NK01',
      GHI_CHU: '',
      details: []
    });
    setShowPhieuModal(true);
  };

  const viewDotDetails = async (maDot) => {
    try {
      const res = await api.get(`/kiemke/dot/${maDot}`);
      setSelectedDot(res.data);
      setShowDetailModal(true);
    } catch (err) {
      alert('Lỗi tải đợt kiểm kê: ' + err.message);
    }
  };

  const viewPhieuDetails = async (maPhieu) => {
    try {
      const res = await api.get(`/kiemke/phieu/${maPhieu}`);
      setSelectedPhieu(res.data);
      setShowPhieuDetailModal(true);
    } catch (err) {
      alert('Lỗi tải phiếu kiểm kê: ' + err.message);
    }
  };

  const handleDotSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/kiemke/dot', dotForm);
      setShowDotModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi tạo đợt kiểm kê: ' + (err.response?.data?.message || err.message));
    }
  };

  const handlePhieuSubmit = async (e) => {
    e.preventDefault();
    if (phieuForm.details.length === 0) return alert('Vui lòng chọn đợt kiểm kê có hàng hóa để kiểm kê');
    try {
      await api.post('/kiemke/phieu', phieuForm);
      setShowPhieuModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi lập phiếu kiểm kê: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredDots = dots.filter(item =>
    (item.TEN_DOT_KIEM_KE || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.MA_DOT_KIEM_KE || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Kiểm kê">
      <div className="page-header">
        <h2>✅ Kiểm kê & Đối soát tồn kho</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={openCreateDot}>
            <Plus size={16} /> Lập đợt kiểm kê
          </button>
          <button className="btn btn-primary" onClick={openCreatePhieu}>
            <CheckSquare size={16} /> Lập phiếu kiểm kê
          </button>
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <Search className="data-table-search-icon" size={14} />
            <input type="text" placeholder="Tìm theo mã hoặc tên đợt kiểm kê..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Tổng số đợt: <strong>{filteredDots.length}</strong> đợt</span>
        </div>

        {loading ? (
          <div className="loading-spinner"><Loader2 className="spinner" style={{ color: 'var(--primary)' }} /></div>
        ) : filteredDots.length === 0 ? (
          <div className="empty-state">
            <CheckSquare size={40} className="empty-state-icon" />
            <div className="empty-state-text">Chưa có dữ liệu đợt kiểm kê</div>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã đợt</th><th>Tên đợt kiểm kê</th><th>Kho kiểm kê</th>
                  <th>Loại</th><th>Phạm vi</th><th>Bắt đầu</th><th>Trạng thái</th><th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredDots.map((item) => (
                  <tr key={item.MA_DOT_KIEM_KE}>
                    <td><strong style={{ color: 'var(--primary)' }}>{item.MA_DOT_KIEM_KE}</strong></td>
                    <td>{item.TEN_DOT_KIEM_KE}</td>
                    <td>{item.TEN_KHO}</td>
                    <td>{item.LOAI_KIEM_KE}</td>
                    <td>{item.PHAM_VI_KIEM_KE}</td>
                    <td>{new Date(item.THOI_DIEM_BAT_DAU).toLocaleString('vi-VN')}</td>
                    <td>
                      <span className={`badge ${
                        item.TRANG_THAI_DOT === 'Đã hoàn thành' ? 'badge-success' : 
                        item.TRANG_THAI_DOT === 'Đang thực hiện' ? 'badge-info' : 'badge-warning'
                      }`}>
                        {item.TRANG_THAI_DOT}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => viewDotDetails(item.MA_DOT_KIEM_KE)} title="Xem chi tiết đợt">
                        <Eye size={14} /> Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL LẬP ĐỢT KIỂM KÊ */}
      {showDotModal && (
        <div className="modal-overlay" onClick={() => setShowDotModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>➕ Tạo đợt kiểm kê kho bãi mới</h3>
              <button className="modal-close" onClick={() => setShowDotModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleDotSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Mã đợt kiểm kê</label>
                  <input name="MA_DOT_KIEM_KE" value={dotForm.MA_DOT_KIEM_KE} onChange={handleDotChange} required />
                </div>
                <div className="form-group">
                  <label>Tên đợt kiểm kê</label>
                  <input name="TEN_DOT_KIEM_KE" value={dotForm.TEN_DOT_KIEM_KE} onChange={handleDotChange} required placeholder="VD: Kiểm kê định kỳ Cuối Tháng 6" />
                </div>
                <div className="form-group">
                  <label>Kho cần kiểm kê</label>
                  <select name="MA_KHO" value={dotForm.MA_KHO} onChange={handleDotChange} required>
                    <option value="">-- Chọn kho hàng --</option>
                    {warehouses.map(w => <option key={w.MA_KHO} value={w.MA_KHO}>{w.TEN_KHO}</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Loại kiểm kê</label>
                    <select name="LOAI_KIEM_KE" value={dotForm.LOAI_KIEM_KE} onChange={handleDotChange}>
                      <option value="Định kỳ">Định kỳ</option>
                      <option value="Đột xuất">Đột xuất</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Phạm vi</label>
                    <input name="PHAM_VI_KIEM_KE" value={dotForm.PHAM_VI_KIEM_KE} onChange={handleDotChange} placeholder="VD: Toàn bộ kho, Khu lạnh..." />
                  </div>
                </div>
                <div className="form-group">
                  <label>Người lập đợt</label>
                  <select name="NGUOI_LAP" value={dotForm.NGUOI_LAP} onChange={handleDotChange} required>
                    <option value="">-- Chọn người lập --</option>
                    {employees.map(e => <option key={e.MA_NHAN_VIEN} value={e.MA_NHAN_VIEN}>{e.HO_TEN}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Ghi chú</label>
                  <input name="GHI_CHU" value={dotForm.GHI_CHU} onChange={handleDotChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDotModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} /> Khởi tạo đợt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL LẬP PHIẾU KIỂM KÊ */}
      {showPhieuModal && (
        <div className="modal-overlay" onClick={() => setShowPhieuModal(false)}>
          <div className="modal" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📝 Lập phiếu kiểm kê thực tế</h3>
              <button className="modal-close" onClick={() => setShowPhieuModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handlePhieuSubmit}>
              <div className="modal-body" style={{ maxHeight: '70vh' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Mã phiếu kiểm kê</label>
                    <input name="MA_PHIEU_KIEM_KE" value={phieuForm.MA_PHIEU_KIEM_KE} onChange={handlePhieuChange} required />
                  </div>
                  <div className="form-group">
                    <label>Thuộc đợt kiểm kê</label>
                    <select name="MA_DOT_KIEM_KE" value={phieuForm.MA_DOT_KIEM_KE} onChange={handleSelectDotForPhieu} required>
                      <option value="">-- Chọn đợt kiểm kê --</option>
                      {dots.filter(d => d.TRANG_THAI_DOT !== 'Đã hoàn thành').map(d => (
                        <option key={d.MA_DOT_KIEM_KE} value={d.MA_DOT_KIEM_KE}>{d.TEN_DOT_KIEM_KE}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Người kiểm kê phụ trách</label>
                    <select name="NGUOI_PHU_TRACH" value={phieuForm.NGUOI_PHU_TRACH} onChange={handlePhieuChange} required>
                      <option value="">-- Chọn người phụ trách --</option>
                      {employees.map(e => <option key={e.MA_NHAN_VIEN} value={e.MA_NHAN_VIEN}>{e.HO_TEN}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nhóm kiểm kê phụ trách</label>
                    <input name="MA_NHOM_KIEM_KE" value={phieuForm.MA_NHOM_KIEM_KE} onChange={handlePhieuChange} placeholder="Mã nhóm kiểm" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Ghi chú phiếu kiểm</label>
                  <input name="GHI_CHU" value={phieuForm.GHI_CHU} onChange={handlePhieuChange} />
                </div>

                {phieuForm.details.length > 0 && (
                  <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', marginTop: '16px' }}>
                    <h4 style={{ fontSize: '13px', marginBottom: '8px' }}>📋 Danh sách mặt hàng kiểm kê đối soát</h4>
                    <table className="data-table" style={{ fontSize: '12px' }}>
                      <thead>
                        <tr>
                          <th>Tên sản phẩm</th><th>Lô</th><th>Vị trí</th><th>Sách tồn</th><th>Kiểm thực</th><th>Chênh lệch</th><th>Tình trạng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {phieuForm.details.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.TEN_MAT_HANG}</td>
                            <td>{item.MA_LO_HANG || '---'}</td>
                            <td>{item.MA_VI_TRI_HE_THONG}</td>
                            <td><strong>{item.SO_LUONG_SO_SACH}</strong></td>
                            <td>
                              <input 
                                type="number" 
                                min="0" 
                                style={{ width: '70px', padding: '4px' }} 
                                value={item.SO_LUONG_THUC_TE} 
                                onChange={(e) => handleQtyChange(idx, e.target.value)} 
                                required
                              />
                            </td>
                            <td>
                              <strong style={{ 
                                color: item.SO_LUONG_THUC_TE - item.SO_LUONG_SO_SACH === 0 ? 'var(--text-main)' :
                                       item.SO_LUONG_THUC_TE - item.SO_LUONG_SO_SACH > 0 ? 'var(--success)' : 'var(--danger)'
                              }}>
                                {item.SO_LUONG_THUC_TE - item.SO_LUONG_SO_SACH > 0 ? `+${item.SO_LUONG_THUC_TE - item.SO_LUONG_SO_SACH}` : item.SO_LUONG_THUC_TE - item.SO_LUONG_SO_SACH}
                              </strong>
                            </td>
                            <td>
                              <select 
                                style={{ padding: '2px', fontSize: '11px' }} 
                                value={item.TINH_TRANG_HANG} 
                                onChange={(e) => handleStatusChange(idx, e.target.value)}
                              >
                                <option value="Bình thường">Bình thường</option>
                                <option value="Hỏng vỏ bao bì">Hỏng bao bì</option>
                                <option value="Hết hạn sử dụng">Hết hạn</option>
                                <option value="Mất mát chưa rõ lý do">Mất mát</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPhieuModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} /> Xác nhận hoàn tất kiểm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT ĐỢT KIỂM KÊ (HIỂN THỊ CÁC PHIẾU KIỂM) */}
      {showDetailModal && selectedDot && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔍 Chi tiết đợt kiểm kê {selectedDot.MA_DOT_KIEM_KE}</h3>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', fontSize: '13px' }}>
                <div>
                  <p><strong>Tên đợt:</strong> {selectedDot.TEN_DOT_KIEM_KE}</p>
                  <p><strong>Kho kiểm kê:</strong> {selectedDot.TEN_KHO}</p>
                  <p><strong>Loại kiểm:</strong> {selectedDot.LOAI_KIEM_KE}</p>
                </div>
                <div>
                  <p><strong>Ngày tạo:</strong> {new Date(selectedDot.THOI_DIEM_BAT_DAU).toLocaleDateString('vi-VN')}</p>
                  <p><strong>Người lập đợt:</strong> {selectedDot.TEN_NGUOI_LAP || '---'}</p>
                  <p><strong>Trạng thái:</strong> <span className="badge badge-info">{selectedDot.TRANG_THAI_DOT}</span></p>
                </div>
              </div>

              <h4 style={{ fontSize: '13.5px', marginBottom: '8px' }}>Các phiếu kiểm kê thực tế đã tạo</h4>
              {selectedDot.sheets && selectedDot.sheets.length > 0 ? (
                <table className="data-table" style={{ fontSize: '12.5px' }}>
                  <thead>
                    <tr>
                      <th>Mã phiếu</th><th>Nhóm phụ trách</th><th>Người kiểm</th><th>Ngày lập</th><th>Trạng thái</th><th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDot.sheets.map((sheet) => (
                      <tr key={sheet.MA_PHIEU_KIEM_KE}>
                        <td><strong style={{ color: 'var(--primary)' }}>{sheet.MA_PHIEU_KIEM_KE}</strong></td>
                        <td>{sheet.MA_NHOM_KIEM_KE}</td>
                        <td>{sheet.TEN_NGUOI_PHU_TRACH}</td>
                        <td>{new Date(sheet.NGAY_TAO).toLocaleDateString('vi-VN')}</td>
                        <td><span className="badge badge-success">{sheet.TRANG_THAI_PHIEU}</span></td>
                        <td>
                          <button className="btn btn-secondary btn-sm" onClick={() => viewPhieuDetails(sheet.MA_PHIEU_KIEM_KE)}>
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-text">Chưa lập phiếu kiểm nào cho đợt này</div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT PHIẾU KIỂM KÊ (HIỂN THỊ SẢN PHẨM) */}
      {showPhieuDetailModal && selectedPhieu && (
        <div className="modal-overlay" onClick={() => setShowPhieuDetailModal(false)}>
          <div className="modal" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔍 Chi tiết phiếu kiểm kê {selectedPhieu.MA_PHIEU_KIEM_KE}</h3>
              <button className="modal-close" onClick={() => setShowPhieuDetailModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '65vh' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', fontSize: '13px' }}>
                <div>
                  <p><strong>Mã phiếu:</strong> {selectedPhieu.MA_PHIEU_KIEM_KE}</p>
                  <p><strong>Thuộc đợt:</strong> {selectedPhieu.TEN_DOT_KIEM_KE}</p>
                </div>
                <div>
                  <p><strong>Người phụ trách:</strong> {selectedPhieu.TEN_NGUOI_PHU_TRACH}</p>
                  <p><strong>Ngày tạo:</strong> {new Date(selectedPhieu.NGAY_TAO).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              <h4 style={{ fontSize: '13.5px', marginBottom: '8px' }}>Đối soát tồn kho thực tế</h4>
              <table className="data-table" style={{ fontSize: '12.5px' }}>
                <thead>
                  <tr>
                    <th>Tên sản phẩm</th><th>Mã lô</th><th>Số sách</th><th>Thực kiểm</th><th>Chênh lệch</th><th>Tình trạng</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPhieu.details?.map((detail) => (
                    <tr key={detail.MA_CHI_TIET_KIEM_KE}>
                      <td>{detail.TEN_MAT_HANG}</td>
                      <td><span className="badge badge-info">{detail.MA_LO_HANG || '---'}</span></td>
                      <td>{detail.SO_LUONG_SO_SACH}</td>
                      <td><strong style={{ color: 'var(--primary)' }}>{detail.SO_LUONG_THUC_TE}</strong></td>
                      <td>
                        <strong style={{ 
                          color: detail.CHENH_LECH === 0 ? 'var(--text-main)' :
                                 detail.CHENH_LECH > 0 ? 'var(--success)' : 'var(--danger)'
                        }}>
                          {detail.CHENH_LECH > 0 ? `+${detail.CHENH_LECH}` : detail.CHENH_LECH}
                        </strong>
                      </td>
                      <td><span className={`badge ${detail.TINH_TRANG_HANG === 'Bình thường' ? 'badge-success' : 'badge-warning'}`}>{detail.TINH_TRANG_HANG}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowPhieuDetailModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default KiemKe;
