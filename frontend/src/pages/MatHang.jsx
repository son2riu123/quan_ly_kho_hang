import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Package, 
  X, 
  Check, 
  Loader2 
} from 'lucide-react';

function MatHang() {
  const [data, setData] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    MA_MAT_HANG: '', TEN_MAT_HANG: '', NHOM_HANG: '', MA_DON_VI_TINH_NHAP: '',
    QUY_CACH_DONG_GOI: '', CO_HAN_SU_DUNG: true, DIEU_KIEN_BAO_QUAN: '', TRANG_THAI: 'Đang kinh doanh'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mhRes, dvtRes] = await Promise.all([
        api.get('/mathang'),
        api.get('/donvitinh')
      ]);
      setData(mhRes.data);
      setUnits(dvtRes.data);
    } catch (err) { console.error(err); setData([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const handleGlobalSearch = (e) => {
      setSearch(e.detail || '');
    };
    window.addEventListener('global-search', handleGlobalSearch);
    return () => window.removeEventListener('global-search', handleGlobalSearch);
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ MA_MAT_HANG: '', TEN_MAT_HANG: '', NHOM_HANG: '', MA_DON_VI_TINH_NHAP: '', QUY_CACH_DONG_GOI: '', CO_HAN_SU_DUNG: true, DIEU_KIEN_BAO_QUAN: '', TRANG_THAI: 'Đang kinh doanh' });
    setShowModal(true);
  };

  const openEdit = (item) => { setEditItem(item); setForm({ ...item }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) await api.put(`/mathang/${editItem.MA_MAT_HANG}`, form);
      else await api.post('/mathang', form);
      setShowModal(false); fetchData();
    } catch (err) { alert('Lỗi: ' + (err.response?.data?.message || err.message)); }
  };

  const handleDelete = async (ma) => {
    if (!window.confirm('Bạn có chắc muốn xóa mặt hàng này?')) return;
    try { await api.delete(`/mathang/${ma}`); fetchData(); }
    catch (err) { alert('Lỗi xóa: ' + err.message); }
  };

  const filtered = data.filter(item =>
    (item.TEN_MAT_HANG || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.MA_MAT_HANG || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.NHOM_HANG || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Mặt hàng">
      <div className="page-header">
        <h2>Danh sách Mặt hàng</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Thêm mặt hàng
        </button>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <Search className="data-table-search-icon" size={14} />
            <input type="text" placeholder="Tìm theo tên, mã hoặc nhóm..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Tổng số: <strong>{filtered.length}</strong> mặt hàng</span>
        </div>

        {loading ? (
          <div className="loading-spinner"><Loader2 className="spinner" style={{ color: 'var(--primary)' }} /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Package size={40} className="empty-state-icon" />
            <div className="empty-state-text">Chưa có dữ liệu mặt hàng</div>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã MH</th><th>Tên mặt hàng</th><th>Nhóm hàng</th><th>ĐVT nhập</th>
                  <th>Quy cách</th><th>Có HSD</th><th>Bảo quản</th><th>Trạng thái</th><th style={{ width: '100px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.MA_MAT_HANG}>
                    <td><strong style={{ color: 'var(--primary)' }}>{item.MA_MAT_HANG}</strong></td>
                    <td>{item.TEN_MAT_HANG}</td>
                    <td><span className="badge badge-info">{item.NHOM_HANG}</span></td>
                    <td>{item.TEN_DON_VI_TINH || item.MA_DON_VI_TINH_NHAP}</td>
                    <td>{item.QUY_CACH_DONG_GOI}</td>
                    <td>{item.CO_HAN_SU_DUNG ? 'Có' : 'Không'}</td>
                    <td>{item.DIEU_KIEN_BAO_QUAN}</td>
                    <td><span className={`badge ${item.TRANG_THAI === 'Đang kinh doanh' ? 'badge-success' : 'badge-warning'}`}>{item.TRANG_THAI}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn btn-warning-link btn-sm" onClick={() => openEdit(item)} title="Sửa">
                          <Edit3 size={14} />
                        </button>
                        <button className="btn btn-danger-link btn-sm" onClick={() => handleDelete(item.MA_MAT_HANG)} title="Xóa">
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
              <h3>{editItem ? 'Chỉnh sửa mặt hàng' : 'Thêm mặt hàng mới'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Mã mặt hàng</label>
                    <input name="MA_MAT_HANG" value={form.MA_MAT_HANG} onChange={handleChange} required disabled={!!editItem} placeholder="VD: VT01" />
                  </div>
                  <div className="form-group">
                    <label>Tên mặt hàng</label>
                    <input name="TEN_MAT_HANG" value={form.TEN_MAT_HANG} onChange={handleChange} required placeholder="VD: Nước lau sàn Sunlight" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nhóm ngành hàng</label>
                    <select name="NHOM_HANG" value={form.NHOM_HANG} onChange={handleChange}>
                      <option value="">-- Chọn nhóm hàng --</option>
                      <option value="Đồ gia dụng">Đồ gia dụng</option>
                      <option value="Thực phẩm">Thực phẩm</option>
                      <option value="Đồ uống">Đồ uống</option>
                      <option value="Chăm sóc cá nhân">Chăm sóc cá nhân</option>
                      <option value="Hóa phẩm">Hóa phẩm</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Đơn vị tính nhập</label>
                    <select name="MA_DON_VI_TINH_NHAP" value={form.MA_DON_VI_TINH_NHAP} onChange={handleChange} required>
                      <option value="">-- Chọn đơn vị --</option>
                      {units.map(u => <option key={u.MA_DON_VI_TINH} value={u.MA_DON_VI_TINH}>{u.TEN_DON_VI_TINH}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Quy cách đóng gói</label>
                    <input name="QUY_CACH_DONG_GOI" value={form.QUY_CACH_DONG_GOI} onChange={handleChange} placeholder="VD: Túi 3.4kg, Chai 630g" />
                  </div>
                  <div className="form-group">
                    <label>Điều kiện bảo quản</label>
                    <input name="DIEU_KIEN_BAO_QUAN" value={form.DIEU_KIEN_BAO_QUAN} onChange={handleChange} placeholder="VD: Khô ráo, Tránh ánh nắng" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
                    <input type="checkbox" name="CO_HAN_SU_DUNG" checked={form.CO_HAN_SU_DUNG} onChange={handleChange} style={{ width: 'auto' }} />
                    <label style={{ margin: 0 }}>Hàng hóa có hạn sử dụng</label>
                  </div>
                  <div className="form-group">
                    <label>Trạng thái</label>
                    <select name="TRANG_THAI" value={form.TRANG_THAI} onChange={handleChange}>
                      <option value="Đang kinh doanh">Đang kinh doanh</option>
                      <option value="Ngừng kinh doanh">Ngừng kinh doanh</option>
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

export default MatHang;
