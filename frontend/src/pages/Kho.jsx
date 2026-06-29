import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Warehouse, 
  X, 
  Check, 
  Loader2 
} from 'lucide-react';

function Kho() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    MA_KHO: '', TEN_KHO: '', DIA_CHI: '', SIEU_THI_GAN_NHAT: '', TRANG_THAI: 'Hoạt động'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/kho');
      setData(res.data);
    } catch (err) { console.error(err); setData([]); }
    finally { setLoading(false); }
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
    setForm({ MA_KHO: '', TEN_KHO: '', DIA_CHI: '', SIEU_THI_GAN_NHAT: '', TRANG_THAI: 'Hoạt động' });
    setShowModal(true);
  };

  const openEdit = (item) => { setEditItem(item); setForm({ ...item }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) await api.put(`/kho/${editItem.MA_KHO}`, form);
      else await api.post('/kho', form);
      setShowModal(false); fetchData();
    } catch (err) { alert('Lỗi: ' + (err.response?.data?.message || err.message)); }
  };

  const handleDelete = async (ma) => {
    if (!window.confirm('Bạn có chắc muốn xóa kho này?')) return;
    try { await api.delete(`/kho/${ma}`); fetchData(); }
    catch (err) { alert('Lỗi xóa: ' + err.message); }
  };

  const filtered = data.filter(item =>
    (item.TEN_KHO || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.MA_KHO || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Kho bãi">
      <div className="page-header">
        <h2>Danh sách Kho hàng</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Thêm kho mới
        </button>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <Search className="data-table-search-icon" size={14} />
            <input type="text" placeholder="Tìm theo tên hoặc mã..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Tổng số: <strong>{filtered.length}</strong> kho</span>
        </div>

        {loading ? (
          <div className="loading-spinner"><Loader2 className="spinner" style={{ color: 'var(--primary)' }} /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Warehouse size={40} className="empty-state-icon" />
            <div className="empty-state-text">Chưa có dữ liệu kho bãi</div>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã kho</th><th>Tên kho</th><th>Địa chỉ</th><th>Siêu thị gần nhất</th><th>Trạng thái</th><th style={{ width: '100px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.MA_KHO}>
                    <td><strong style={{ color: 'var(--primary)' }}>{item.MA_KHO}</strong></td>
                    <td>{item.TEN_KHO}</td>
                    <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.DIA_CHI}</td>
                    <td>{item.SIEU_THI_GAN_NHAT}</td>
                    <td><span className={`badge ${item.TRANG_THAI === 'Hoạt động' ? 'badge-success' : 'badge-warning'}`}>{item.TRANG_THAI}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn btn-warning-link btn-sm" onClick={() => openEdit(item)} title="Sửa">
                          <Edit3 size={14} />
                        </button>
                        <button className="btn btn-danger-link btn-sm" onClick={() => handleDelete(item.MA_KHO)} title="Xóa">
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

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editItem ? 'Sửa đổi thông tin kho' : 'Thêm kho lưu trữ mới'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Mã kho hàng</label>
                    <input name="MA_KHO" value={form.MA_KHO} onChange={handleChange} required disabled={!!editItem} placeholder="VD: KHO01" />
                  </div>
                  <div className="form-group">
                    <label>Tên kho hàng</label>
                    <input name="TEN_KHO" value={form.TEN_KHO} onChange={handleChange} required placeholder="VD: Kho tổng siêu thị Thành Đô" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Địa chỉ kho bãi</label>
                  <input name="DIA_CHI" value={form.DIA_CHI} onChange={handleChange} placeholder="Nhập địa chỉ vị trí kho" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Siêu thị phụ trách gần nhất</label>
                    <input name="SIEU_THI_GAN_NHAT" value={form.SIEU_THI_GAN_NHAT} onChange={handleChange} placeholder="VD: ST Thành Đô Hồ Tùng Mậu" />
                  </div>
                  <div className="form-group">
                    <label>Trạng thái</label>
                    <select name="TRANG_THAI" value={form.TRANG_THAI} onChange={handleChange}>
                      <option value="Hoạt động">Hoạt động</option>
                      <option value="Tạm đóng">Tạm đóng</option>
                      <option value="Đã đóng">Đã đóng</option>
                    </select>
                  </div>
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

export default Kho;
