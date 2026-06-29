import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  User, 
  X, 
  Check, 
  Loader2,
  Key
} from 'lucide-react';

function NhanVien() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    MA_NHAN_VIEN: '', HO_TEN: '', CHUC_VU: '', SO_DIEN_THOAI: '',
    EMAIL: '', TRANG_THAI: 'Đang làm việc'
  });

  // State cho Modal Cấp tài khoản
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [accountLoading, setAccountLoading] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [accountForm, setAccountForm] = useState({
    maTaiKhoan: '', maNhanVien: '', tenDangNhap: '', matKhau: '', ghiChu: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/nhanvien');
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
    const handleGlobalSearch = (e) => {
      setSearch(e.detail || '');
    };
    window.addEventListener('global-search', handleGlobalSearch);
    return () => window.removeEventListener('global-search', handleGlobalSearch);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ MA_NHAN_VIEN: '', HO_TEN: '', CHUC_VU: '', SO_DIEN_THOAI: '', EMAIL: '', TRANG_THAI: 'Đang làm việc' });
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
      const payload = { ...form, VAI_TRO: form.CHUC_VU };
      if (editItem) {
        await api.put(`/nhanvien/${editItem.MA_NHAN_VIEN}`, payload);
      } else {
        await api.post('/nhanvien', payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (ma) => {
    if (!window.confirm('Bạn có chắc muốn xóa nhân viên này?')) return;
    try {
      await api.delete(`/nhanvien/${ma}`);
      fetchData();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Lỗi xóa';
      const errDetail = err.response?.data?.error || err.message;
      alert(`${errMsg}\nChi tiết: ${errDetail}`);
    }
  };

  const openGrantAccount = (item) => {
    setSelectedEmployee(item);
    const formattedMaNV = (item.MA_NHAN_VIEN || '').trim();
    if (item.TEN_DANG_NHAP) {
      setIsResetPassword(true);
      setAccountForm({
        maTaiKhoan: item.MA_TAI_KHOAN || '',
        maNhanVien: formattedMaNV,
        tenDangNhap: item.TEN_DANG_NHAP,
        matKhau: '',
        ghiChu: ''
      });
    } else {
      setIsResetPassword(false);
      setAccountForm({
        maTaiKhoan: `TK_${formattedMaNV}`,
        maNhanVien: formattedMaNV,
        tenDangNhap: '',
        matKhau: '',
        ghiChu: `Tài khoản cấp cho ${item.HO_TEN}`
      });
    }
    setShowAccountModal(true);
  };

  const handleAccountFormChange = (e) => {
    setAccountForm({ ...accountForm, [e.target.name]: e.target.value });
  };

  const handleGrantAccountSubmit = async (e) => {
    e.preventDefault();
    try {
      setAccountLoading(true);
      if (isResetPassword) {
        const res = await api.put('/taikhoan/reset-password', {
          maTaiKhoan: accountForm.maTaiKhoan,
          matKhau: accountForm.matKhau
        });
        alert(res.data.message || 'Đặt lại mật khẩu thành công!');
      } else {
        const res = await api.post('/taikhoan/register', accountForm);
        alert(res.data.message || 'Cấp tài khoản thành công!');
      }
      setShowAccountModal(false);
      fetchData();
    } catch (err) {
      alert('Thất bại: ' + (err.response?.data?.message || err.message));
    } finally {
      setAccountLoading(false);
    }
  };

  const filtered = data.filter(item =>
    (item.HO_TEN || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.MA_NHAN_VIEN || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Nhân viên">
      <div className="page-header">
        <h2>Danh sách Nhân viên</h2>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> Thêm nhân viên
          </button>
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <Search className="data-table-search-icon" size={14} />
            <input
              type="text" placeholder="Tìm theo tên hoặc mã..."
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Tổng số: <strong>{filtered.length}</strong> nhân viên
          </span>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <Loader2 className="spinner" style={{ color: 'var(--primary)' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <User size={40} className="empty-state-icon" />
            <div className="empty-state-text">Chưa có dữ liệu nhân viên</div>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã NV</th>
                  <th>Họ tên</th>
                  <th>Chức vụ</th>
                  <th>Số điện thoại</th>
                  <th>Email</th>
                  <th>Trạng thái</th>
                  <th style={{ width: '100px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.MA_NHAN_VIEN}>
                    <td><strong style={{ color: 'var(--primary)' }}>{item.MA_NHAN_VIEN}</strong></td>
                    <td>{item.HO_TEN}</td>
                    <td>{item.CHUC_VU}</td>
                    <td>{item.SO_DIEN_THOAI}</td>
                    <td>{item.EMAIL}</td>
                    <td>
                      <span className={`badge ${item.TRANG_THAI === 'Đang làm việc' ? 'badge-success' : 'badge-warning'}`}>
                        {item.TRANG_THAI}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          className="btn btn-primary-link btn-sm" 
                          onClick={() => openGrantAccount(item)} 
                          title={item.TEN_DANG_NHAP ? "Đặt lại mật khẩu" : "Cấp tài khoản"} 
                          style={{ color: item.TEN_DANG_NHAP ? '#16a34a' : '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'inline-flex', alignItems: 'center' }}
                        >
                          <Key size={14} />
                        </button>
                        <button className="btn btn-warning-link btn-sm" onClick={() => openEdit(item)} title="Sửa">
                          <Edit3 size={14} />
                        </button>
                        <button className="btn btn-danger-link btn-sm" onClick={() => handleDelete(item.MA_NHAN_VIEN)} title="Xóa">
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
              <h3>{editItem ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Mã nhân viên</label>
                    <input name="MA_NHAN_VIEN" value={form.MA_NHAN_VIEN} onChange={handleChange}
                      required disabled={!!editItem} placeholder="VD: NV001" />
                  </div>
                  <div className="form-group">
                    <label>Họ tên</label>
                    <input name="HO_TEN" value={form.HO_TEN} onChange={handleChange}
                      required placeholder="Nhập họ tên đầy đủ" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Chức vụ</label>
                    <select name="CHUC_VU" value={form.CHUC_VU} onChange={handleChange}>
                      <option value="">-- Chọn chức vụ --</option>
                      <option value="Thủ kho">Thủ kho</option>
                      <option value="Quản lý kho">Quản lý kho</option>
                      <option value="Nhân viên KCS">Nhân viên KCS</option>
                      <option value="Nhân viên mua hàng">Nhân viên mua hàng</option>
                      <option value="Kế toán">Kế toán</option>
                    </select>
                  </div>

                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input name="SO_DIEN_THOAI" value={form.SO_DIEN_THOAI} onChange={handleChange}
                      placeholder="VD: 0901234567" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input name="EMAIL" value={form.EMAIL} onChange={handleChange}
                      type="email" placeholder="VD: nv@thanhdo.vn" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Trạng thái hoạt động</label>
                  <select name="TRANG_THAI" value={form.TRANG_THAI} onChange={handleChange}>
                    <option value="Đang làm việc">Đang làm việc</option>
                    <option value="Nghỉ phép">Nghỉ phép</option>
                    <option value="Đã nghỉ việc">Đã nghỉ việc</option>
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

      {showAccountModal && (
        <div className="modal-overlay" onClick={() => setShowAccountModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isResetPassword ? `Đặt lại mật khẩu: ${selectedEmployee?.HO_TEN}` : `Cấp tài khoản: ${selectedEmployee?.HO_TEN}`}</h3>
              <button className="modal-close" onClick={() => setShowAccountModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleGrantAccountSubmit}>
              <div className="modal-body">
                {!isResetPassword && (
                  <div className="form-group">
                    <label>Mã tài khoản</label>
                    <input name="maTaiKhoan" value={accountForm.maTaiKhoan} onChange={handleAccountFormChange}
                      required placeholder="VD: TK_NV001" />
                  </div>
                )}
                <div className="form-group">
                  <label>Tên đăng nhập</label>
                  <input name="tenDangNhap" value={accountForm.tenDangNhap} disabled={isResetPassword} onChange={handleAccountFormChange}
                    required placeholder="Nhập tên đăng nhập" />
                </div>
                <div className="form-group">
                  <label>{isResetPassword ? 'Mật khẩu mới' : 'Mật khẩu'}</label>
                  <input name="matKhau" type="password" value={accountForm.matKhau} onChange={handleAccountFormChange}
                    required placeholder="Nhập mật khẩu" />
                </div>
                {!isResetPassword && (
                  <div className="form-group">
                    <label>Ghi chú</label>
                    <input name="ghiChu" value={accountForm.ghiChu} onChange={handleAccountFormChange}
                      placeholder="Ghi chú thêm nếu có" />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAccountModal(false)}>Hủy bỏ</button>
                <button type="submit" className="btn btn-primary" disabled={accountLoading}>
                  {accountLoading ? 'Đang xử lý...' : isResetPassword ? 'Đặt lại mật khẩu' : 'Cấp tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default NhanVien;
