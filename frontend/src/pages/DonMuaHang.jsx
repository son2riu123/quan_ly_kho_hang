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
  FileText,
  Calendar,
  DollarSign
} from 'lucide-react';

function DonMuaHang() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  
  const [requisitions, setRequisitions] = useState([]);
  const [selectedReqId, setSelectedReqId] = useState('');
  
  const [form, setForm] = useState({
    MA_DON_MUA: '', MA_NHA_CUNG_CAP: '', MA_KHO_NHAN: '',
    NGAY_DAT: new Date().toISOString().split('T')[0],
    NGAY_DU_KIEN_GIAO: '', GHI_CHU: '', details: []
  });

  const [newDetail, setNewDetail] = useState({
    MA_MAT_HANG: '', MA_DON_VI_TINH: '', SO_LUONG_DAT: 1, DON_GIA: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [poRes, nccRes, khoRes, mhRes, reqsRes] = await Promise.all([
        api.get('/donmuahang'),
        api.get('/nhacungcap'),
        api.get('/kho'),
        api.get('/mathang'),
        api.get('/yeu-cau-mua-bo-sung').catch(() => ({ data: [] }))
      ]);
      setData(poRes.data);
      setSuppliers(nccRes.data);
      setWarehouses(khoRes.data);
      setProducts(mhRes.data);
      setRequisitions(reqsRes.data || []);
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

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setNewDetail(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'MA_MAT_HANG') {
        const prod = products.find(p => p.MA_MAT_HANG === value);
        if (prod) {
          updated.MA_DON_VI_TINH = prod.MA_DON_VI_TINH_NHAP;
        }
      }
      return updated;
    });
  };

  const addDetailItem = () => {
    if (!newDetail.MA_MAT_HANG) return alert('Vui lòng chọn mặt hàng');
    
    const prod = products.find(p => p.MA_MAT_HANG === newDetail.MA_MAT_HANG);
    const detailItem = {
      MA_CHI_TIET_DON_MUA: 'CT' + Math.floor(1000 + Math.random() * 9000),
      MA_MAT_HANG: newDetail.MA_MAT_HANG,
      TEN_MAT_HANG: prod ? prod.TEN_MAT_HANG : '',
      MA_DON_VI_TINH: newDetail.MA_DON_VI_TINH,
      SO_LUONG_DAT: parseInt(newDetail.SO_LUONG_DAT) || 1,
      DON_GIA: parseFloat(newDetail.DON_GIA) || 0,
      THANH_TIEN: (parseInt(newDetail.SO_LUONG_DAT) || 1) * (parseFloat(newDetail.DON_GIA) || 0),
      GHI_CHU: ''
    };

    setForm(prev => {
      const details = [...prev.details, detailItem];
      const tongTien = details.reduce((sum, item) => sum + item.THANH_TIEN, 0);
      const tongSoLuongDat = details.reduce((sum, item) => sum + item.SO_LUONG_DAT, 0);
      return { ...prev, details, TONG_TIEN: tongTien, TONG_SO_LUONG_DAT: tongSoLuongDat };
    });

    setNewDetail({ MA_MAT_HANG: '', MA_DON_VI_TINH: '', SO_LUONG_DAT: 1, DON_GIA: 0 });
  };

  const removeDetailItem = (idx) => {
    setForm(prev => {
      const details = prev.details.filter((_, i) => i !== idx);
      const tongTien = details.reduce((sum, item) => sum + item.THANH_TIEN, 0);
      const tongSoLuongDat = details.reduce((sum, item) => sum + item.SO_LUONG_DAT, 0);
      return { ...prev, details, TONG_TIEN: tongTien, TONG_SO_LUONG_DAT: tongSoLuongDat };
    });
  };

  const openCreate = () => {
    setForm({
      MA_DON_MUA: 'PO' + Math.floor(1000 + Math.random() * 9000), 
      MA_NHA_CUNG_CAP: '', MA_KHO_NHAN: '',
      NGAY_DAT: new Date().toISOString().split('T')[0],
      NGAY_DU_KIEN_GIAO: '', GHI_CHU: '', details: [], TONG_TIEN: 0, TONG_SO_LUONG_DAT: 0
    });
    setSelectedReqId('');
    setShowModal(true);
  };

  const handleSelectRequisition = (e) => {
    const reqId = e.target.value;
    setSelectedReqId(reqId);
    if (!reqId) return;

    const req = requisitions.find(r => r.MA_YEU_CAU_MUA.trim() === reqId.trim());
    if (req) {
      const prod = products.find(p => p.MA_MAT_HANG.trim() === req.MA_MAT_HANG.trim());
      if (prod) {
        const detailItem = {
          MA_CHI_TIET_DON_MUA: 'CT' + Math.floor(1000 + Math.random() * 9000),
          MA_MAT_HANG: req.MA_MAT_HANG.trim(),
          TEN_MAT_HANG: prod.TEN_MAT_HANG,
          MA_DON_VI_TINH: prod.MA_DON_VI_TINH_NHAP.trim(),
          SO_LUONG_DAT: req.SO_LUONG_DE_XUAT,
          DON_GIA: 0,
          THANH_TIEN: 0,
          GHI_CHU: `Đề xuất mua bổ sung từ cảnh báo tồn kho`
        };

        setForm(prev => {
          const details = [...prev.details, detailItem];
          const tongSoLuongDat = details.reduce((sum, item) => sum + item.SO_LUONG_DAT, 0);
          return {
            ...prev,
            MA_KHO_NHAN: req.MA_KHO.trim(),
            details,
            TONG_SO_LUONG_DAT: tongSoLuongDat
          };
        });
      }
    }
  };

  const viewDetail = async (maDonMua) => {
    try {
      const res = await api.get(`/donmuahang/${maDonMua}`);
      setSelectedPO(res.data);
      setShowDetailModal(true);
    } catch (err) {
      alert('Lỗi tải chi tiết đơn hàng: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.details.length === 0) return alert('Vui lòng thêm ít nhất 1 mặt hàng vào đơn hàng');
    try {
      await api.post('/donmuahang', form);
      if (selectedReqId) {
        // Cập nhật trạng thái yêu cầu mua bổ sung thành 'Đã lập PO'
        await api.put(`/yeu-cau-mua-bo-sung/${selectedReqId.trim()}/status`, { trangThai: 'Đã lập PO' });
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi tạo đơn hàng: ' + (err.response?.data?.message || err.message));
    }
  };

  const filtered = data.filter(item =>
    (item.MA_DON_MUA || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.TEN_NHA_CUNG_CAP || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Đơn mua hàng (PO)">
      <div className="page-header">
        <h2>Quản lý Đơn mua hàng (PO)</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Lập đơn đặt hàng
        </button>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <Search className="data-table-search-icon" size={14} />
            <input type="text" placeholder="Tìm theo mã PO hoặc NCC..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Tổng số: <strong>{filtered.length}</strong> đơn mua</span>
        </div>

        {loading ? (
          <div className="loading-spinner"><Loader2 className="spinner" style={{ color: 'var(--primary)' }} /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <FileText size={40} className="empty-state-icon" />
            <div className="empty-state-text">Chưa có dữ liệu đơn mua hàng</div>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã PO</th><th>Nhà cung cấp</th><th>Kho nhận</th><th>Ngày đặt</th>
                  <th>Dự kiến giao</th><th>Tổng mặt hàng</th><th>Tổng tiền</th><th>Trạng thái</th><th style={{ width: '80px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.MA_DON_MUA}>
                    <td><strong style={{ color: 'var(--primary)' }}>{item.MA_DON_MUA}</strong></td>
                    <td>{item.TEN_NHA_CUNG_CAP}</td>
                    <td>{item.TEN_KHO}</td>
                    <td>{new Date(item.NGAY_DAT).toLocaleDateString('vi-VN')}</td>
                    <td>{item.NGAY_DU_KIEN_GIAO ? new Date(item.NGAY_DU_KIEN_GIAO).toLocaleDateString('vi-VN') : '---'}</td>
                    <td>{item.TONG_SO_LUONG_DAT}</td>
                    <td><strong>{item.TONG_TIEN?.toLocaleString('vi-VN')}đ</strong></td>
                    <td>
                      <span className={`badge ${
                        item.TRANG_THAI === 'Nhập đủ' ? 'badge-success' : 
                        item.TRANG_THAI === 'Nhập một phần' ? 'badge-info' : 'badge-warning'
                      }`}>
                        {item.TRANG_THAI}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => viewDetail(item.MA_DON_MUA)} title="Xem chi tiết">
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

      {/* MODAL LẬP ĐƠN HÀNG */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3> lập đơn đặt hàng mới</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ maxHeight: '70vh' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Mã đơn mua (PO)</label>
                    <input name="MA_DON_MUA" value={form.MA_DON_MUA} onChange={handleChange} required placeholder="VD: PO001" />
                  </div>
                  <div className="form-group">
                    <label>Yêu cầu mua bổ sung liên kết (Nếu có)</label>
                    <select value={selectedReqId} onChange={handleSelectRequisition}>
                      <option value="">-- Không liên kết --</option>
                      {requisitions
                        .filter(r => r.TRANG_THAI_YEU_CAU === 'Chờ duyệt' || r.TRANG_THAI_YEU_CAU === 'Chờ xử lý' || r.TRANG_THAI_YEU_CAU === 'Chờ xác minh')
                        .map(r => (
                          <option key={r.MA_YEU_CAU_MUA} value={r.MA_YEU_CAU_MUA.trim()}>
                            {r.MA_YEU_CAU_MUA.trim()} - MH: {r.MA_MAT_HANG.trim()} (SL: {r.SO_LUONG_DE_XUAT})
                          </option>
                        ))
                      }
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Nhà cung cấp</label>
                    <select name="MA_NHA_CUNG_CAP" value={form.MA_NHA_CUNG_CAP} onChange={handleChange} required>
                      <option value="">-- Chọn nhà cung cấp --</option>
                      {suppliers.map(s => <option key={s.MA_NHA_CUNG_CAP} value={s.MA_NHA_CUNG_CAP}>{s.TEN_NHA_CUNG_CAP}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Kho nhận hàng</label>
                    <select name="MA_KHO_NHAN" value={form.MA_KHO_NHAN} onChange={handleChange} required>
                      <option value="">-- Chọn kho nhận --</option>
                      {warehouses.map(w => <option key={w.MA_KHO} value={w.MA_KHO}>{w.TEN_KHO}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Ngày đặt mua</label>
                    <input type="date" name="NGAY_DAT" value={form.NGAY_DAT} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ngày dự kiến giao</label>
                    <input type="date" name="NGAY_DU_KIEN_GIAO" value={form.NGAY_DU_KIEN_GIAO} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Ghi chú</label>
                    <input name="GHI_CHU" value={form.GHI_CHU} onChange={handleChange} placeholder="Ghi chú đơn hàng" />
                  </div>
                </div>

                {/* THÊM MẶT HÀNG CHI TIẾT */}
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', marginTop: '16px' }}>
                  <h4 style={{ fontSize: '13px', marginBottom: '12px', color: 'var(--text-main)' }}>Thêm sản phẩm đặt mua</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', alignItems: 'end' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Sản phẩm</label>
                      <select name="MA_MAT_HANG" value={newDetail.MA_MAT_HANG} onChange={handleDetailChange}>
                        <option value="">-- Chọn sản phẩm --</option>
                        {products.map(p => <option key={p.MA_MAT_HANG} value={p.MA_MAT_HANG}>{p.TEN_MAT_HANG} ({p.MA_MAT_HANG})</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Đơn vị nhập</label>
                      <input name="MA_DON_VI_TINH" value={newDetail.MA_DON_VI_TINH} readOnly disabled />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Số lượng</label>
                      <input type="number" min="1" name="SO_LUONG_DAT" value={newDetail.SO_LUONG_DAT} onChange={handleDetailChange} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Đơn giá</label>
                      <input type="number" min="0" name="DON_GIA" value={newDetail.DON_GIA} onChange={handleDetailChange} />
                    </div>
                    <button type="button" className="btn btn-primary" onClick={addDetailItem} style={{ height: '38px', padding: '0 12px' }}>
                      Thêm
                    </button>
                  </div>

                  {/* BẢNG MẶT HÀNG ĐÃ CHỌN */}
                  {form.details.length > 0 && (
                    <table className="data-table" style={{ marginTop: '16px', fontSize: '12.5px' }}>
                      <thead>
                        <tr>
                          <th>Mặt hàng</th><th>ĐVT</th><th>SL đặt</th><th>Đơn giá</th><th>Thành tiền</th><th>Xóa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.details.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.TEN_MAT_HANG}</td>
                            <td>{item.MA_DON_VI_TINH}</td>
                            <td>{item.SO_LUONG_DAT}</td>
                            <td>{item.DON_GIA.toLocaleString('vi-VN')}đ</td>
                            <td>{(item.SO_LUONG_DAT * item.DON_GIA).toLocaleString('vi-VN')}đ</td>
                            <td>
                              <button type="button" className="btn btn-danger-link btn-sm" onClick={() => removeDetailItem(idx)}>✕</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>
                  Tổng tiền: <span style={{ color: 'var(--primary)', fontSize: '16px' }}>{form.TONG_TIEN?.toLocaleString('vi-VN')}đ</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                  <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={14} /> Gửi duyệt PO
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      {showDetailModal && selectedPO && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết đơn mua {selectedPO.MA_DON_MUA}</h3>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', fontSize: '13.5px' }}>
                <div>
                  <p><strong>Nhà cung cấp:</strong> {selectedPO.TEN_NHA_CUNG_CAP}</p>
                  <p><strong>Kho nhận:</strong> {selectedPO.TEN_KHO}</p>
                  <p><strong>Ghi chú:</strong> {selectedPO.GHI_CHU || '---'}</p>
                </div>
                <div>
                  <p><strong>Ngày lập:</strong> {new Date(selectedPO.NGAY_DAT).toLocaleDateString('vi-VN')}</p>
                  <p><strong>Dự kiến giao:</strong> {selectedPO.NGAY_DU_KIEN_GIAO ? new Date(selectedPO.NGAY_DU_KIEN_GIAO).toLocaleDateString('vi-VN') : '---'}</p>
                  <p><strong>Trạng thái:</strong> <span className="badge badge-info">{selectedPO.TRANG_THAI}</span></p>
                </div>
              </div>

              <h4 style={{ fontSize: '13.5px', marginBottom: '8px' }}>Danh sách sản phẩm chi tiết</h4>
              <table className="data-table" style={{ fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th>Tên mặt hàng</th><th>ĐVT</th><th>Đặt mua</th><th>Đã nhận</th><th>Chờ nhận</th><th>Đơn giá</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPO.details?.map((detail) => (
                    <tr key={detail.MA_CHI_TIET_DON_MUA}>
                      <td>{detail.TEN_MAT_HANG}</td>
                      <td>{detail.MA_DON_VI_TINH}</td>
                      <td>{detail.SO_LUONG_DAT}</td>
                      <td><span style={{ color: 'var(--success)', fontWeight: '600' }}>{detail.SO_LUONG_DA_NHAP}</span></td>
                      <td><span style={{ color: detail.SO_LUONG_CON_CHO_NHAN > 0 ? 'var(--warning)' : 'var(--text-muted)' }}>{detail.SO_LUONG_CON_CHO_NHAN}</span></td>
                      <td>{detail.DON_GIA?.toLocaleString('vi-VN')}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>Tổng cộng: <strong style={{ color: 'var(--primary)', fontSize: '15px' }}>{selectedPO.TONG_TIEN?.toLocaleString('vi-VN')}đ</strong></div>
              <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default DonMuaHang;
