import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Factory, 
  X, 
  Check, 
  Loader2 
} from 'lucide-react';

function NhaCungCap() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    MA_NHA_CUNG_CAP: '', TEN_NHA_CUNG_CAP: '', DIA_CHI: '', SO_DIEN_THOAI: '',
    EMAIL: '', MA_SO_THUE: '', NGUOI_DAI_DIEN: '', TRANG_THAI: 'Đang hợp tác'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/nhacungcap');
      setData(res.data);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
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
    setForm({ MA_NHA_CUNG_CAP: '', TEN_NHA_CUNG_CAP: '', DIA_CHI: '', SO_DIEN_THOAI: '', EMAIL: '', MA_SO_THUE: '', NGUOI_DAI_DIEN: '', TRANG_THAI: 'Đang hợp tác' });
    setShowModal(true);
  };

  const openEdit = (item) => { setEditItem(item); setForm({ ...item }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) await api.put(`/nhacungcap/${editItem.MA_NHA_CUNG_CAP}`, form);
      else await api.post('/nhacungcap', form);
      setShowModal(false); fetchData();
    } catch (err) { alert('Lỗi: ' + (err.response?.data?.message || err.message)); }
  };

  const handleDelete = async (ma) => {
    if (!window.confirm('Bạn có chắc muốn xóa nhà cung cấp này?')) return;
    try { await api.delete(`/nhacungcap/${ma}`); fetchData(); }
    catch (err) { alert('Lỗi xóa: ' + err.message); }
  };

  const filtered = data.filter(item =>
    (item.TEN_NHA_CUNG_CAP || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.MA_NHA_CUNG_CAP || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Nhà cung cấp">
      <div className="page-header">
        <h2>Danh sách Nhà cung cấp</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Thêm nhà cung cấp
        </button>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <Search className="data-table-search-icon" size={14} />
            <input type="text" placeholder="Tìm theo tên hoặc mã..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Tổng số: <strong>{filtered.length}</strong> NCC</span>
        </div>

        {loading ? (
          <div className="loading-spinner"><Loader2 className="spinner" style={{ color: 'var(--primary)' }} /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Factory size={40} className="empty-state-icon" />
            <div className="empty-state-text">Chưa có dữ liệu nhà cung cấp</div>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã NCC</th><th>Tên nhà cung cấp</th><th>Địa chỉ</th><th>SĐT</th>
                  <th>Email</th><th>Người đại diện</th><th>Trạng thái</th><th style={{ width: '100px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.MA_NHA_CUNG_CAP}>
                    <td><strong style={{ color: 'var(--primary)' }}>{item.MA_NHA_CUNG_CAP}</strong></td>
                    <td>{item.TEN_NHA_CUNG_CAP}</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.DIA_CHI}</td>
                    <td>{item.SO_DIEN_THOAI}</td>
                    <td>{item.EMAIL}</td>
                    <td>{item.NGUOI_DAI_DIEN}</td>
                    <td><span className={`badge ${item.TRANG_THAI === 'Đang hợp tác' ? 'badge-success' : 'badge-warning'}`}>{item.TRANG_THAI}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn btn-warning-link btn-sm" onClick={() => openEdit(item)} title="Sửa">
                          <Edit3 size={14} />
                        </button>
                        <button className="btn btn-danger-link btn-sm" onClick={() => handleDelete(item.MA_NHA_CUNG_CAP)} title="Xóa">
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
              <h3>{editItem ? 'Sửa thông tin nhà cung cấp' : 'Thêm nhà cung cấp mới'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Mã nhà cung cấp</label>
                    <input name="MA_NHA_CUNG_CAP" value={form.MA_NHA_CUNG_CAP} onChange={handleChange} required disabled={!!editItem} placeholder="VD: NCC001" />
                  </div>
                  <div className="form-group">
                    <label>Tên nhà cung cấp</label>
                    <input name="TEN_NHA_CUNG_CAP" value={form.TEN_NHA_CUNG_CAP} onChange={handleChange} required placeholder="Nhập tên nhà cung cấp" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Địa chỉ văn phòng / kho</label>
                  <input name="DIA_CHI" value={form.DIA_CHI} onChange={handleChange} placeholder="Nhập địa chỉ" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Số điện thoại liên hệ</label>
                    <input name="SO_DIEN_THOAI" value={form.SO_DIEN_THOAI} onChange={handleChange} placeholder="VD: 028.3823xxxx" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input name="EMAIL" value={form.EMAIL} onChange={handleChange} type="email" placeholder="VD: lienhe@unilever.com" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Mã số thuế</label>
                    <input name="MA_SO_THUE" value={form.MA_SO_THUE} onChange={handleChange} placeholder="Mã số thuế doanh nghiệp" />
                  </div>
                  <div className="form-group">
                    <label>Người đại diện kinh doanh</label>
                    <input name="NGUOI_DAI_DIEN" value={form.NGUOI_DAI_DIEN} onChange={handleChange} placeholder="Họ tên người liên hệ đại diện" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Trạng thái hợp tác</label>
                  <select name="TRANG_THAI" value={form.TRANG_THAI} onChange={handleChange}>
                    <option value="Đang hợp tác">Đang hợp tác</option>
                    <option value="Ngừng hợp tác">Ngừng hợp tác</option>
                  </select>
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

export default NhaCungCap;
