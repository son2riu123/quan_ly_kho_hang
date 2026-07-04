import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  MapPin, 
  X, 
  Check, 
  Loader2 
} from 'lucide-react';

function ViTriKho() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [search, setSearch] = useState('');
  
  const [form, setForm] = useState({
    MA_VI_TRI: '', MA_KHO: '', KHU: '', DAY: '', KE: '', 
    TANG: '', O: '', LOAI_VI_TRI: 'Thường', DIEU_KIEN_BAO_QUAN: '', 
    SUC_CHUA: 100, TRANG_THAI_VI_TRI: 'Trống'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vitriRes, khoRes] = await Promise.all([
        api.get('/vitrikho'),
        api.get('/kho')
      ]);
      setData(vitriRes.data);
      setWarehouses(khoRes.data);
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

  const openCreate = () => {
    setEditItem(null);
    setForm({ 
      MA_VI_TRI: '', MA_KHO: '', KHU: '', DAY: '', KE: '', 
      TANG: '', O: '', LOAI_VI_TRI: 'Thường', DIEU_KIEN_BAO_QUAN: '', 
      SUC_CHUA: 100, TRANG_THAI_VI_TRI: 'Trống'
    });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ ...item });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await api.put(`/vitrikho/${editItem.MA_VI_TRI}`, form);
      } else {
        await api.post('/vitrikho', form);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (ma) => {
    if (!window.confirm('Bạn có chắc muốn xóa vị trí kho này?')) return;
    try {
      await api.delete(`/vitrikho/${ma}`);
      fetchData();
    } catch (err) {
      alert('Lỗi xóa: ' + err.message);
    }
  };

  const filtered = data.filter(item =>
    (item.MA_VI_TRI || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.TEN_KHO || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.KHU || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Vị trí kho">
      <div className="page-header">
        <h2>Quản lý Vị trí kho lưu trữ</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Thêm vị trí mới
        </button>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <Search className="data-table-search-icon" size={14} />
            <input type="text" placeholder="Tìm theo mã vị trí, kho hoặc khu..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Tổng số: <strong>{filtered.length}</strong> vị trí</span>
        </div>

        {loading ? (
          <div className="loading-spinner"><Loader2 className="spinner" style={{ color: 'var(--primary)' }} /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <MapPin size={40} className="empty-state-icon" />
            <div className="empty-state-text">Chưa có dữ liệu vị trí kho bãi</div>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã vị trí</th><th>Kho bãi</th><th>Khu</th><th>Dãy - Kệ - Tầng - Ô</th>
                  <th>Loại vị trí</th><th>Sức chứa</th><th>Bảo quản</th><th>Trạng thái</th><th style={{ width: '100px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.MA_VI_TRI}>
                    <td><strong style={{ color: 'var(--primary)' }}>{item.MA_VI_TRI}</strong></td>
                    <td>{item.TEN_KHO}</td>
                    <td><span className="badge badge-info">{item.KHU || '---'}</span></td>
                    <td>
                      {item.DAY ? `Dãy ${item.DAY}` : ''} 
                      {item.KE ? ` - Kệ ${item.KE}` : ''} 
                      {item.TANG ? ` - Tầng ${item.TANG}` : ''} 
                      {item.O ? ` - Ô ${item.O}` : ''}
                    </td>
                    <td>{item.LOAI_VI_TRI}</td>
                    <td>{item.SUC_CHUA}</td>
                    <td>{item.DIEU_KIEN_BAO_QUAN || '---'}</td>
                    <td>
                      <span className={`badge ${
                        item.TRANG_THAI_VI_TRI === 'Trống' ? 'badge-success' : 
                        item.TRANG_THAI_VI_TRI === 'Đầy' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {item.TRANG_THAI_VI_TRI}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn btn-warning-link btn-sm" onClick={() => openEdit(item)} title="Sửa">
                          <Edit3 size={14} />
                        </button>
                        <button className="btn btn-danger-link btn-sm" onClick={() => handleDelete(item.MA_VI_TRI)} title="Xóa">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL THÊM/SỬA VỊ TRÍ */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editItem ? 'Sửa vị trí kho' : 'Thêm vị trí kho mới'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Mã vị trí</label>
                    <input name="MA_VI_TRI" value={form.MA_VI_TRI} onChange={handleChange} required disabled={!!editItem} placeholder="VD: VT001" />
                  </div>
                  <div className="form-group">
                    <label>Kho chứa hàng</label>
                    <select name="MA_KHO" value={form.MA_KHO} onChange={handleChange} required>
                      <option value="">-- Chọn kho --</option>
                      {warehouses.map(w => <option key={w.MA_KHO} value={w.MA_KHO}>{w.TEN_KHO}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Khu vực</label>
                    <input name="KHU" value={form.KHU} onChange={handleChange} placeholder="VD: Khu A, Khu gia dụng" />
                  </div>
                  <div className="form-group">
                    <label>Dãy</label>
                    <input name="DAY" value={form.DAY} onChange={handleChange} placeholder="VD: D1" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Kệ</label>
                    <input name="KE" value={form.KE} onChange={handleChange} placeholder="VD: K2" />
                  </div>
                  <div className="form-group">
                    <label>Tầng</label>
                    <input name="TANG" value={form.TANG} onChange={handleChange} placeholder="VD: T3" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ô</label>
                    <input name="O" value={form.O} onChange={handleChange} placeholder="VD: O5" />
                  </div>
                  <div className="form-group">
                    <label>Sức chứa (tối đa)</label>
                    <input type="number" name="SUC_CHUA" value={form.SUC_CHUA} onChange={handleChange} placeholder="Sức chứa tối đa của ô vị trí" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Loại vị trí</label>
                    <select name="LOAI_VI_TRI" value={form.LOAI_VI_TRI} onChange={handleChange} required>
                      <option value="Thường">Thường</option>
                      <option value="Cách ly">Cách ly</option>
                      <option value="Chờ xử lý">Chờ xử lý</option>
                      <option value="Chờ trả nhà cung cấp">Chờ trả nhà cung cấp</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Trạng thái vị trí</label>
                    <select name="TRANG_THAI_VI_TRI" value={form.TRANG_THAI_VI_TRI} onChange={handleChange} required>
                      <option value="Trống">Trống</option>
                      <option value="Có hàng">Có hàng</option>
                      <option value="Đầy">Đầy</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Điều kiện bảo quản đặc biệt</label>
                  <input name="DIEU_KIEN_BAO_QUAN" value={form.DIEU_KIEN_BAO_QUAN} onChange={handleChange} placeholder="VD: Nhiệt độ phòng, Tránh ẩm ướt" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} /> {editItem ? 'Cập nhật' : 'Lưu lại'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default ViTriKho;
