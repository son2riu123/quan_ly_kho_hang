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
  FileCheck,
  ArrowDownLeft,
  Calendar
} from 'lucide-react';

function PhieuNhapKho() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    MA_PHIEU_NHAP_KHO: '', MA_BIEN_BAN_GIAO_NHAN: '', MA_DON_MUA: '',
    MA_KHO: '', MA_THU_KHO: '', NGUOI_GIAO: '', NGAY_LAP: new Date().toISOString().split('T')[0],
    TONG_SO_LUONG_THEO_CHUNG_TU: 0, TONG_SO_LUONG_THUC_NHAP: 0, TONG_TIEN: 0,
    GHI_CHU: '', details: []
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [receiptsRes, poRes, khoRes, empRes] = await Promise.all([
        api.get('/phieunhapkho'),
        api.get('/donmuahang'),
        api.get('/kho'),
        api.get('/nhanvien')
      ]);
      setData(receiptsRes.data);
      // Chỉ lấy các đơn đặt hàng chưa hoàn tất nhập kho
      setPurchaseOrders(poRes.data.filter(po => po.TRANG_THAI !== 'Nhập đủ'));
      setWarehouses(khoRes.data);
      setEmployees(empRes.data.filter(e => e.CHUC_VU === 'Thủ kho'));
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const handleGlobalSearch = (e) => { setSearch(e.detail || ''); };
    window.addEventListener('global-search', handleGlobalSearch);
    return () => window.removeEventListener('global-search', handleGlobalSearch);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSelectPO = async (e) => {
    const maDonMua = e.target.value;
    if (!maDonMua) {
      setForm(prev => ({ ...prev, MA_DON_MUA: '', details: [], TONG_TIEN: 0, TONG_SO_LUONG_THEO_CHUNG_TU: 0, TONG_SO_LUONG_THUC_NHAP: 0 }));
      return;
    }

    try {
      const res = await api.get(`/donmuahang/${maDonMua}`);
      const po = res.data;
      
      // Chuyển danh sách chi tiết đơn mua hàng thành danh sách chi tiết phiếu nhập
      const itemsToImport = po.details
        .filter(item => item.SO_LUONG_CON_CHO_NHAN > 0)
        .map(item => ({
          MA_CHI_TIET_PNK: 'NK' + Math.floor(1000 + Math.random() * 9000),
          MA_MAT_HANG: item.MA_MAT_HANG,
          TEN_MAT_HANG: item.TEN_MAT_HANG,
          MA_DON_VI_TINH: item.MA_DON_VI_TINH,
          MA_LO_HANG: 'L' + new Date().toISOString().slice(2,10).replace(/-/g,''), // Mã lô đề xuất
          SO_LUONG_THEO_CHUNG_TU: item.SO_LUONG_CON_CHO_NHAN,
          SO_LUONG_THUC_NHAP: item.SO_LUONG_CON_CHO_NHAN, // Default nhập hết
          DON_GIA: item.DON_GIA,
          THANH_TIEN: item.SO_LUONG_CON_CHO_NHAN * item.DON_GIA,
          GHI_CHU: ''
        }));

      setForm(prev => {
        const sumQty = itemsToImport.reduce((sum, item) => sum + item.SO_LUONG_THUC_NHAP, 0);
        const sumTotal = itemsToImport.reduce((sum, item) => sum + item.THANH_TIEN, 0);
        return {
          ...prev,
          MA_DON_MUA: maDonMua,
          MA_KHO: po.MA_KHO_NHAN, // Tự động lấy kho nhận từ PO
          details: itemsToImport,
          TONG_SO_LUONG_THEO_CHUNG_TU: sumQty,
          TONG_SO_LUONG_THUC_NHAP: sumQty,
          TONG_TIEN: sumTotal
        };
      });
    } catch (err) {
      alert('Lỗi tải thông tin PO: ' + err.message);
    }
  };

  const handleQtyChange = (idx, value) => {
    const qty = parseInt(value) || 0;
    setForm(prev => {
      const details = [...prev.details];
      details[idx].SO_LUONG_THUC_NHAP = qty;
      details[idx].THANH_TIEN = qty * details[idx].DON_GIA;
      
      const sumQty = details.reduce((sum, item) => sum + item.SO_LUONG_THUC_NHAP, 0);
      const sumTotal = details.reduce((sum, item) => sum + item.THANH_TIEN, 0);
      return {
        ...prev,
        details,
        TONG_SO_LUONG_THUC_NHAP: sumQty,
        TONG_TIEN: sumTotal
      };
    });
  };

  const handleLotChange = (idx, value) => {
    setForm(prev => {
      const details = [...prev.details];
      details[idx].MA_LO_HANG = value;
      return { ...prev, details };
    });
  };

  const openCreate = () => {
    setForm({
      MA_PHIEU_NHAP_KHO: 'NK' + Math.floor(1000 + Math.random() * 9000),
      MA_BIEN_BAN_GIAO_NHAN: 'BB' + Math.floor(1000 + Math.random() * 9000),
      MA_DON_MUA: '', MA_KHO: '', MA_THU_KHO: '', NGUOI_GIAO: '',
      NGAY_LAP: new Date().toISOString().split('T')[0],
      TONG_SO_LUONG_THEO_CHUNG_TU: 0, TONG_SO_LUONG_THUC_NHAP: 0, TONG_TIEN: 0,
      GHI_CHU: '', details: []
    });
    setShowModal(true);
  };

  const viewDetail = async (maPhieu) => {
    try {
      const res = await api.get(`/phieunhapkho/${maPhieu}`);
      setSelectedReceipt(res.data);
      setShowDetailModal(true);
    } catch (err) {
      alert('Lỗi tải chi tiết phiếu nhập: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.details.length === 0) return alert('Vui lòng chọn đơn mua hàng PO có mặt hàng cần nhập');
    try {
      await api.post('/phieunhapkho', form);
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi nhập kho: ' + (err.response?.data?.message || err.message));
    }
  };

  const filtered = data.filter(item =>
    (item.MA_PHIEU_NHAP_KHO || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.NGUOI_GIAO || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Phiếu nhập kho">
      <div className="page-header">
        <h2>Quản lý Nhập kho</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Lập phiếu nhập kho
        </button>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <Search className="data-table-search-icon" size={14} />
            <input type="text" placeholder="Tìm theo mã phiếu hoặc người giao..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Tổng số: <strong>{filtered.length}</strong> phiếu nhập</span>
        </div>

        {loading ? (
          <div className="loading-spinner"><Loader2 className="spinner" style={{ color: 'var(--primary)' }} /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <ArrowDownLeft size={40} className="empty-state-icon" />
            <div className="empty-state-text">Chưa có dữ liệu phiếu nhập kho</div>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã phiếu</th><th>Kho hàng</th><th>Thủ kho nhận</th><th>Ngày nhập</th>
                  <th>Người giao</th><th>Chứng từ</th><th>Thực nhập</th><th>Tổng tiền</th><th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.MA_PHIEU_NHAP_KHO}>
                    <td><strong style={{ color: 'var(--primary)' }}>{item.MA_PHIEU_NHAP_KHO}</strong></td>
                    <td>{item.TEN_KHO}</td>
                    <td>{item.TEN_THU_KHO}</td>
                    <td>{new Date(item.NGAY_LAP).toLocaleDateString('vi-VN')}</td>
                    <td>{item.NGUOI_GIAO}</td>
                    <td>{item.TONG_SO_LUONG_THEO_CHUNG_TU}</td>
                    <td><span style={{ color: 'var(--success)', fontWeight: '600' }}>{item.TONG_SO_LUONG_THUC_NHAP}</span></td>
                    <td><strong>{item.TONG_TIEN?.toLocaleString('vi-VN')}đ</strong></td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => viewDetail(item.MA_PHIEU_NHAP_KHO)} title="Xem chi tiết">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL LẬP PHIẾU NHẬP KHO */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Lập phiếu nhập kho thực tế</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ maxHeight: '70vh' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Mã phiếu nhập</label>
                    <input name="MA_PHIEU_NHAP_KHO" value={form.MA_PHIEU_NHAP_KHO} onChange={handleChange} required placeholder="NK001" />
                  </div>
                  <div className="form-group">
                    <label>Đơn mua hàng liên kết (PO)</label>
                    <select name="MA_DON_MUA" value={form.MA_DON_MUA} onChange={handleSelectPO} required>
                      <option value="">-- Chọn đơn đặt hàng PO --</option>
                      {purchaseOrders.map(po => <option key={po.MA_DON_MUA} value={po.MA_DON_MUA}>{po.MA_DON_MUA} - {po.TEN_NHA_CUNG_CAP}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Thủ kho nhận hàng</label>
                    <select name="MA_THU_KHO" value={form.MA_THU_KHO} onChange={handleChange} required>
                      <option value="">-- Chọn thủ kho --</option>
                      {employees.map(e => <option key={e.MA_NHAN_VIEN} value={e.MA_NHAN_VIEN}>{e.HO_TEN}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Kho nhận hàng</label>
                    <select name="MA_KHO" value={form.MA_KHO} onChange={handleChange} required disabled>
                      <option value="">-- Chọn kho nhận --</option>
                      {warehouses.map(w => <option key={w.MA_KHO} value={w.MA_KHO}>{w.TEN_KHO}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Mã biên bản giao nhận</label>
                    <input name="MA_BIEN_BAN_GIAO_NHAN" value={form.MA_BIEN_BAN_GIAO_NHAN} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Người giao hàng</label>
                    <input name="NGUOI_GIAO" value={form.NGUOI_GIAO} onChange={handleChange} required placeholder="Tên tài xế giao hàng" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ngày lập phiếu</label>
                    <input type="date" name="NGAY_LAP" value={form.NGAY_LAP} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Ghi chú</label>
                    <input name="GHI_CHU" value={form.GHI_CHU} onChange={handleChange} placeholder="Ghi chú đợt nhập kho" />
                  </div>
                </div>

                {/* DANH SÁCH CHI TIẾT MẶT HÀNG NHẬP */}
                {form.details.length > 0 && (
                  <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', marginTop: '16px' }}>
                    <h4 style={{ fontSize: '13px', marginBottom: '12px' }}>Danh sách sản phẩm kiểm thực tế</h4>
                    <table className="data-table" style={{ fontSize: '12.5px' }}>
                      <thead>
                        <tr>
                          <th>Tên mặt hàng</th><th>ĐVT</th><th>Mã lô (đề xuất)</th><th>SL chứng từ</th><th>SL thực nhập</th><th>Đơn giá</th><th>Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.details.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.TEN_MAT_HANG}</td>
                            <td>{item.MA_DON_VI_TINH}</td>
                            <td>
                              <input 
                                style={{ padding: '4px 8px', fontSize: '12px' }} 
                                value={item.MA_LO_HANG} 
                                onChange={(e) => handleLotChange(idx, e.target.value)} 
                                required
                              />
                            </td>
                            <td>{item.SO_LUONG_THEO_CHUNG_TU}</td>
                            <td>
                              <input 
                                type="number" 
                                min="0" 
                                max={item.SO_LUONG_THEO_CHUNG_TU} 
                                style={{ padding: '4px 8px', width: '70px', fontSize: '12px' }} 
                                value={item.SO_LUONG_THUC_NHAP} 
                                onChange={(e) => handleQtyChange(idx, e.target.value)} 
                                required
                              />
                            </td>
                            <td>{item.DON_GIA.toLocaleString('vi-VN')}đ</td>
                            <td>{item.THANH_TIEN.toLocaleString('vi-VN')}đ</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>
                  Tổng thực nhập: <span style={{ color: 'var(--primary)', fontSize: '16px' }}>{form.TONG_TIEN?.toLocaleString('vi-VN')}đ</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={14} /> Xác nhận nhập kho
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT PHIẾU NHẬP KHO */}
      {showDetailModal && selectedReceipt && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết phiếu nhập {selectedReceipt.MA_PHIEU_NHAP_KHO}</h3>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', fontSize: '13.5px' }}>
                <div>
                  <p><strong>Kho nhận:</strong> {selectedReceipt.TEN_KHO}</p>
                  <p><strong>Thủ kho:</strong> {selectedReceipt.TEN_THU_KHO}</p>
                  <p><strong>Biên bản liên kết:</strong> {selectedReceipt.MA_BIEN_BAN_GIAO_NHAN}</p>
                  <p><strong>Ghi chú:</strong> {selectedReceipt.GHI_CHU || '---'}</p>
                </div>
                <div>
                  <p><strong>Ngày nhập:</strong> {new Date(selectedReceipt.NGAY_LAP).toLocaleDateString('vi-VN')}</p>
                  <p><strong>Người giao:</strong> {selectedReceipt.NGUOI_GIAO}</p>
                  <p><strong>Trạng thái:</strong> <span className="badge badge-success">{selectedReceipt.TRANG_THAI}</span></p>
                </div>
              </div>

              <h4 style={{ fontSize: '13.5px', marginBottom: '8px' }}>Danh sách sản phẩm nhập thực tế</h4>
              <table className="data-table" style={{ fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th>Tên mặt hàng</th><th>ĐVT</th><th>Mã lô</th><th>SL chứng từ</th><th>Thực nhập</th><th>Đơn giá</th><th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReceipt.details?.map((detail) => (
                    <tr key={detail.MA_CHI_TIET_PNK}>
                      <td>{detail.TEN_MAT_HANG}</td>
                      <td>{detail.MA_DON_VI_TINH}</td>
                      <td><span className="badge badge-info">{detail.MA_LO_HANG}</span></td>
                      <td>{detail.SO_LUONG_THEO_CHUNG_TU}</td>
                      <td><strong style={{ color: 'var(--success)' }}>{detail.SO_LUONG_THUC_NHAP}</strong></td>
                      <td>{detail.DON_GIA?.toLocaleString('vi-VN')}đ</td>
                      <td>{(detail.SO_LUONG_THUC_NHAP * detail.DON_GIA).toLocaleString('vi-VN')}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>Tổng cộng: <strong style={{ color: 'var(--primary)', fontSize: '15px' }}>{selectedReceipt.TONG_TIEN?.toLocaleString('vi-VN')}đ</strong></div>
              <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default PhieuNhapKho;
