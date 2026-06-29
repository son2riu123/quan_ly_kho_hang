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
  Layers,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

function TheKho() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    MA_THE_KHO: '', MA_MAT_HANG: '', NGUOI_LAP_THE: '', TRANG_THAI: 'Hoạt động'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cardsRes, mhRes, empRes] = await Promise.all([
        api.get('/thekho'),
        api.get('/mathang'),
        api.get('/nhanvien')
      ]);
      setCards(cardsRes.data);
      setProducts(mhRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.error(err);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => {
    setForm({ 
      MA_THE_KHO: 'TK' + Math.floor(1000 + Math.random() * 9000), 
      MA_MAT_HANG: '', 
      NGUOI_LAP_THE: '', 
      TRANG_THAI: 'Hoạt động' 
    });
    setShowModal(true);
  };

  const viewCardDetails = async (maTheKho) => {
    try {
      const res = await api.get(`/thekho/${maTheKho}`);
      setSelectedCard(res.data);
      setShowDetailModal(true);
    } catch (err) {
      alert('Lỗi tải thẻ kho: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/thekho', form);
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi mở thẻ kho: ' + (err.response?.data?.message || err.message));
    }
  };

  const filtered = cards.filter(item =>
    (item.TEN_MAT_HANG || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.MA_THE_KHO || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Thẻ kho">
      <div className="page-header">
        <h2>Quản lý Thẻ kho hàng hóa</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Mở thẻ kho mới
        </button>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <Search className="data-table-search-icon" size={14} />
            <input type="text" placeholder="Tìm theo mã thẻ hoặc tên sản phẩm..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Tổng số: <strong>{filtered.length}</strong> thẻ kho</span>
        </div>

        {loading ? (
          <div className="loading-spinner"><Loader2 className="spinner" style={{ color: 'var(--primary)' }} /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Layers size={40} className="empty-state-icon" />
            <div className="empty-state-text">Chưa có dữ liệu thẻ kho</div>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã thẻ</th><th>Tên mặt hàng</th><th>Mã sản phẩm</th>
                  <th>Ngày mở thẻ</th><th>Người lập</th><th>Trạng thái</th><th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.MA_THE_KHO}>
                    <td><strong style={{ color: 'var(--primary)' }}>{item.MA_THE_KHO}</strong></td>
                    <td>{item.TEN_MAT_HANG}</td>
                    <td>{item.MA_MAT_HANG}</td>
                    <td>{new Date(item.NGAY_MO_THE).toLocaleDateString('vi-VN')}</td>
                    <td>{item.TEN_NGUOI_LAP || '---'}</td>
                    <td><span className="badge badge-success">{item.TRANG_THAI}</span></td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => viewCardDetails(item.MA_THE_KHO)} title="Xem chi tiết thẻ">
                        <Eye size={14} /> Xem sổ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL MỞ THẺ KHO */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Mở thẻ kho hàng hóa</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Mã số thẻ kho</label>
                  <input name="MA_THE_KHO" value={form.MA_THE_KHO} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Chọn mặt hàng theo dõi</label>
                  <select name="MA_MAT_HANG" value={form.MA_MAT_HANG} onChange={handleChange} required>
                    <option value="">-- Chọn mặt hàng --</option>
                    {products.map(p => <option key={p.MA_MAT_HANG} value={p.MA_MAT_HANG}>{p.TEN_MAT_HANG} ({p.MA_MAT_HANG})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Người lập thẻ</label>
                  <select name="NGUOI_LAP_THE" value={form.NGUOI_LAP_THE} onChange={handleChange} required>
                    <option value="">-- Chọn người lập --</option>
                    {employees.map(e => <option key={e.MA_NHAN_VIEN} value={e.MA_NHAN_VIEN}>{e.HO_TEN}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Trạng thái</label>
                  <select name="TRANG_THAI" value={form.TRANG_THAI} onChange={handleChange}>
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Tạm khóa">Tạm khóa</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} /> Mở sổ theo dõi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT SỔ THẺ KHO */}
      {showDetailModal && selectedCard && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nhật ký thẻ kho: {selectedCard.TEN_MAT_HANG} ({selectedCard.MA_THE_KHO})</h3>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '65vh' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', fontSize: '13px' }}>
                <div>
                  <p><strong>Tên sản phẩm:</strong> {selectedCard.TEN_MAT_HANG}</p>
                  <p><strong>Mã sản phẩm:</strong> {selectedCard.MA_MAT_HANG}</p>
                </div>
                <div>
                  <p><strong>Ngày lập sổ:</strong> {new Date(selectedCard.NGAY_MO_THE).toLocaleDateString('vi-VN')}</p>
                  <p><strong>Người phụ trách:</strong> {selectedCard.TEN_NGUOI_LAP || '---'}</p>
                </div>
              </div>

              <h4 style={{ fontSize: '13.5px', marginBottom: '8px' }}>Lịch sử biến động nhập / xuất</h4>
              <table className="data-table" style={{ fontSize: '12.5px' }}>
                <thead>
                  <tr>
                    <th>Ngày ghi</th><th>Số chứng từ</th><th>Loại CT</th><th>Diễn giải</th><th>Nhập vào</th><th>Xuất ra</th><th>Tồn cuối</th><th>Người ghi</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCard.logs && selectedCard.logs.length > 0 ? (
                    selectedCard.logs.map((log) => (
                      <tr key={log.MA_DONG_THE_KHO}>
                        <td>{new Date(log.NGAY_GHI).toLocaleDateString('vi-VN')}</td>
                        <td><strong style={{ color: 'var(--primary)' }}>{log.MA_CHUNG_TU || '---'}</strong></td>
                        <td>{log.LOAI_CHUNG_TU || '---'}</td>
                        <td>{log.DIEN_GIAI}</td>
                        <td>
                          {log.SO_LUONG_NHAP > 0 ? (
                            <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                              <ArrowDownLeft size={12} /> +{log.SO_LUONG_NHAP}
                            </span>
                          ) : '---'}
                        </td>
                        <td>
                          {log.SO_LUONG_XUAT > 0 ? (
                            <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                              <ArrowUpRight size={12} /> -{log.SO_LUONG_XUAT}
                            </span>
                          ) : '---'}
                        </td>
                        <td><strong>{log.SO_LUONG_TON}</strong></td>
                        <td>{log.TEN_NGUOI_GHI || '---'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có phát sinh nhập xuất hàng hóa</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default TheKho;
