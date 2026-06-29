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
  ShieldCheck, 
  AlertTriangle,
  ClipboardList
} from 'lucide-react';
import authService from '../services/authService';

function KiemNghiem() {
  const [records, setRecords] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [search, setSearch] = useState('');

  const currentUser = authService.getCurrentUser();

  const [form, setForm] = useState({
    MA_BIEN_BAN_KIEM_NGHIEM: '',
    MA_BIEN_BAN_GIAO_NHAN: '',
    NGAY_LAP: new Date().toISOString().substring(0, 10),
    MA_THU_KHO: '',
    NGUOI_KIEM_NGHIEM: currentUser ? currentUser.hoTen : '',
    KET_LUAN: '',
    TRANG_THAI: 'Đạt',
    GHI_CHU: '',
    CHI_TIET: []
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recordsRes, deliveriesRes, empRes] = await Promise.all([
        api.get('/bien-ban-kiem-nghiem'),
        api.get('/bien-ban-giao-nhan'),
        api.get('/nhanvien')
      ]);
      setRecords(recordsRes.data);
      setDeliveries(deliveriesRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectDelivery = async (e) => {
    const maDelivery = e.target.value;
    if (!maDelivery) {
      setForm(prev => ({ ...prev, MA_BIEN_BAN_GIAO_NHAN: '', MA_THU_KHO: '', CHI_TIET: [] }));
      return;
    }

    try {
      // Gọi chi tiết Biên bản giao nhận để lấy danh sách sản phẩm thực tế nhận
      const res = await api.get(`/bien-ban-giao-nhan/${maDelivery.trim()}`);
      const deliveryDetails = res.data.CHI_TIET || [];
      
      const mappedDetails = deliveryDetails.map(item => ({
        MA_CHI_TIET_BBKN: 'CK' + Math.floor(1000 + Math.random() * 9000),
        MA_CHI_TIET_BBGN: item.MA_CHI_TIET_BBGN.trim(),
        MA_MAT_HANG: item.MA_MAT_HANG.trim(),
        PHUONG_THUC_KIEM_NGHIEM: 'Cảm quan',
        MA_DON_VI_TINH: item.MA_DON_VI_TINH.trim(),
        SO_LUONG_THEO_CHUNG_TU: item.SO_LUONG_THEO_CHUNG_TU,
        SO_LUONG_KIEM_NGHIEM: item.SO_LUONG_THUC_NHAN, // Mặc định kiểm toàn bộ lượng thực nhận
        SO_LUONG_DAT: item.SO_LUONG_THUC_NHAN,
        SO_LUONG_KHONG_DAT: 0,
        LY_DO_KHONG_DAT: '',
        GHI_CHU: ''
      }));

      setForm(prev => ({
        ...prev,
        MA_BIEN_BAN_GIAO_NHAN: maDelivery,
        MA_THU_KHO: res.data.MA_THU_KHO ? res.data.MA_THU_KHO.trim() : '',
        CHI_TIET: mappedDetails
      }));
    } catch (err) {
      alert('Không thể tải chi tiết biên bản giao nhận: ' + err.message);
    }
  };

  const handleDetailQtyChange = (idx, field, val) => {
    const numVal = parseInt(val) || 0;
    setForm(prev => {
      const details = [...prev.CHI_TIET];
      details[idx][field] = numVal;

      // Tự động tính số lượng không đạt
      if (field === 'SO_LUONG_KIEM_NGHIEM' || field === 'SO_LUONG_DAT') {
        const checkQty = details[idx].SO_LUONG_KIEM_NGHIEM;
        const passQty = details[idx].SO_LUONG_DAT;
        details[idx].SO_LUONG_KHONG_DAT = Math.max(0, checkQty - passQty);
      }

      return { ...prev, CHI_TIET: details };
    });
  };

  const handleDetailTextChange = (idx, field, val) => {
    setForm(prev => {
      const details = [...prev.CHI_TIET];
      details[idx][field] = val;
      return { ...prev, CHI_TIET: details };
    });
  };

  const openCreate = () => {
    setForm({
      MA_BIEN_BAN_KIEM_NGHIEM: 'KN' + Math.floor(1000 + Math.random() * 9000),
      MA_BIEN_BAN_GIAO_NHAN: '',
      NGAY_LAP: new Date().toISOString().substring(0, 10),
      MA_THU_KHO: '',
      NGUOI_KIEM_NGHIEM: currentUser ? currentUser.hoTen : '',
      KET_LUAN: 'Toàn bộ lô hàng đạt tiêu chuẩn chất lượng',
      TRANG_THAI: 'Đạt',
      GHI_CHU: '',
      CHI_TIET: []
    });
    setShowCreateModal(true);
  };

  const handleDetailView = async (maBBKN) => {
    try {
      const res = await api.get(`/bien-ban-kiem-nghiem/${maBBKN.trim()}`);
      setSelectedRecord(res.data);
      setShowDetailModal(true);
    } catch (err) {
      alert('Không thể tải chi tiết biên bản kiểm nghiệm: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.CHI_TIET.length === 0) {
      return alert('Vui lòng chọn Biên bản giao nhận có sản phẩm kiểm nghiệm');
    }

    try {
      await api.post('/bien-ban-kiem-nghiem', form);
      alert('Tạo biên bản kiểm nghiệm thành công!');
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi tạo biên bản kiểm nghiệm: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredRecords = records.filter(item =>
    (item.MA_BIEN_BAN_KIEM_NGHIEM || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.NGUOI_KIEM_NGHIEM || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Kiểm nghiệm KCS">
      <div className="page-header">
        <h2>Kiểm nghiệm chất lượng sản phẩm (KCS)</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Lập biên bản kiểm nghiệm
        </button>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <Search className="data-table-search-icon" size={14} />
            <input 
              type="text" 
              placeholder="Tìm theo mã kiểm nghiệm hoặc người kiểm..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Tổng số: <strong>{filteredRecords.length}</strong> biên bản
          </span>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <Loader2 className="spinner" style={{ color: 'var(--primary)' }} />
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="empty-state">
            <ShieldCheck size={40} className="empty-state-icon" />
            <div className="empty-state-text">Chưa có dữ liệu biên bản kiểm nghiệm</div>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã biên bản</th>
                  <th>Mã BB Giao nhận</th>
                  <th>Ngày kiểm</th>
                  <th>Người kiểm nghiệm</th>
                  <th>Kết luận</th>
                  <th>Trạng thái</th>
                  <th style={{ width: '100px' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((item) => (
                  <tr key={item.MA_BIEN_BAN_KIEM_NGHIEM}>
                    <td><strong style={{ color: 'var(--primary)' }}>{item.MA_BIEN_BAN_KIEM_NGHIEM}</strong></td>
                    <td>{item.MA_BIEN_BAN_GIAO_NHAN}</td>
                    <td>{new Date(item.NGAY_LAP).toLocaleDateString('vi-VN')}</td>
                    <td>{item.NGUOI_KIEM_NGHIEM}</td>
                    <td>{item.KET_LUAN}</td>
                    <td>
                      <span className={`badge ${
                        item.TRANG_THAI === 'Đạt' ? 'badge-success' : 
                        item.TRANG_THAI === 'Đạt một phần' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {item.TRANG_THAI}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleDetailView(item.MA_BIEN_BAN_KIEM_NGHIEM)}>
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

      {/* MODAL LẬP BIÊN BẢN KIỂM NGHIỆM */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tạo biên bản kiểm nghiệm hàng hóa</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Mã biên bản kiểm nghiệm</label>
                    <input name="MA_BIEN_BAN_KIEM_NGHIEM" value={form.MA_BIEN_BAN_KIEM_NGHIEM} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Thuộc Biên bản giao nhận</label>
                    <select name="MA_BIEN_BAN_GIAO_NHAN" value={form.MA_BIEN_BAN_GIAO_NHAN} onChange={handleSelectDelivery} required>
                      <option value="">-- Chọn biên bản giao nhận --</option>
                      {deliveries.map(d => (
                        <option key={d.MA_BIEN_BAN_GIAO_NHAN} value={d.MA_BIEN_BAN_GIAO_NHAN}>
                          {d.MA_BIEN_BAN_GIAO_NHAN.trim()} ({new Date(d.NGAY_LAP).toLocaleDateString('vi-VN')})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Người lập phiếu (Thủ kho giao nhận)</label>
                    <select name="MA_THU_KHO" value={form.MA_THU_KHO} onChange={handleInputChange} required disabled>
                      <option value="">-- Tự động điền theo biên bản giao nhận --</option>
                      {employees.map(e => <option key={e.MA_NHAN_VIEN} value={e.MA_NHAN_VIEN}>{e.HO_TEN}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Chuyên viên KCS kiểm nghiệm</label>
                    <input name="NGUOI_KIEM_NGHIEM" value={form.NGUOI_KIEM_NGHIEM} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Kết luận kiểm nghiệm</label>
                    <input name="KET_LUAN" value={form.KET_LUAN} onChange={handleInputChange} required placeholder="VD: Hàng hóa đạt tiêu chuẩn nhập kho" />
                  </div>
                  <div className="form-group">
                    <label>Trạng thái biên bản</label>
                    <select name="TRANG_THAI" value={form.TRANG_THAI} onChange={handleInputChange}>
                      <option value="Đạt">Đạt tiêu chuẩn</option>
                      <option value="Đạt một phần">Đạt một phần (Có hàng hỏng)</option>
                      <option value="Không đạt">Không đạt (Hủy toàn bộ)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Ghi chú</label>
                  <input name="GHI_CHU" value={form.GHI_CHU} onChange={handleInputChange} />
                </div>

                {form.CHI_TIET.length > 0 && (
                  <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', marginTop: '16px' }}>
                    <h4 style={{ fontSize: '13px', marginBottom: '8px', color: '#10b981' }}>Kết quả kiểm nghiệm chi tiết mặt hàng</h4>
                    <table className="data-table" style={{ fontSize: '12px' }}>
                      <thead>
                        <tr>
                          <th>Mã sản phẩm</th>
                          <th>Phương thức</th>
                          <th>Số giao nhận</th>
                          <th>Số kiểm</th>
                          <th>Đạt (OK)</th>
                          <th>Lỗi (FAIL)</th>
                          <th>Lý do lỗi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.CHI_TIET.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.MA_MAT_HANG}</td>
                            <td>
                              <input 
                                value={item.PHUONG_THUC_KIEM_NGHIEM} 
                                onChange={(e) => handleDetailTextChange(idx, 'PHUONG_THUC_KIEM_NGHIEM', e.target.value)} 
                                style={{ width: '90px', padding: '4px' }}
                                required
                              />
                            </td>
                            <td><strong>{item.SO_LUONG_THEO_CHUNG_TU}</strong></td>
                            <td>
                              <input 
                                type="number" 
                                min="1" 
                                style={{ width: '60px', padding: '4px' }} 
                                value={item.SO_LUONG_KIEM_NGHIEM} 
                                onChange={(e) => handleDetailQtyChange(idx, 'SO_LUONG_KIEM_NGHIEM', e.target.value)} 
                                required
                              />
                            </td>
                            <td>
                              <input 
                                type="number" 
                                min="0" 
                                style={{ width: '60px', padding: '4px' }} 
                                value={item.SO_LUONG_DAT} 
                                onChange={(e) => handleDetailQtyChange(idx, 'SO_LUONG_DAT', e.target.value)} 
                                required
                              />
                            </td>
                            <td style={{ color: item.SO_LUONG_KHONG_DAT > 0 ? '#ef4444' : 'inherit', fontWeight: 'bold' }}>
                              {item.SO_LUONG_KHONG_DAT}
                            </td>
                            <td>
                              <input 
                                value={item.LY_DO_KHONG_DAT} 
                                onChange={(e) => handleDetailTextChange(idx, 'LY_DO_KHONG_DAT', e.target.value)} 
                                style={{ width: '130px', padding: '4px' }}
                                placeholder="Nếu có hàng hỏng"
                                disabled={item.SO_LUONG_KHONG_DAT === 0}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">
                  <Check size={14} /> Hoàn tất kiểm nghiệm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT BIÊN BẢN KIỂM NGHIỆM */}
      {showDetailModal && selectedRecord && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết biên bản kiểm nghiệm {selectedRecord.MA_BIEN_BAN_KIEM_NGHIEM}</h3>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', fontSize: '13px' }}>
                <div>
                  <p><strong>Mã biên bản:</strong> {selectedRecord.MA_BIEN_BAN_KIEM_NGHIEM}</p>
                  <p><strong>Ngày kiểm:</strong> {new Date(selectedRecord.NGAY_LAP).toLocaleDateString('vi-VN')}</p>
                  <p><strong>Thuộc biên bản giao nhận:</strong> {selectedRecord.MA_BIEN_BAN_GIAO_NHAN}</p>
                </div>
                <div>
                  <p><strong>KCS phụ trách:</strong> {selectedRecord.NGUOI_KIEM_NGHIEM}</p>
                  <p><strong>Trạng thái:</strong> <span className={`badge ${selectedRecord.TRANG_THAI === 'Đạt' ? 'badge-success' : 'badge-danger'}`}>{selectedRecord.TRANG_THAI}</span></p>
                  <p><strong>Kết luận:</strong> {selectedRecord.KET_LUAN}</p>
                </div>
              </div>

              <h4 style={{ fontSize: '13.5px', marginBottom: '8px' }}>Danh sách sản phẩm đã kiểm soát</h4>
              <table className="data-table" style={{ fontSize: '12.5px' }}>
                <thead>
                  <tr>
                    <th>Mã sản phẩm</th>
                    <th>Phương thức</th>
                    <th>Số giao nhận</th>
                    <th>Số kiểm</th>
                    <th>Số lượng ĐẠT</th>
                    <th>Số lượng LỖI</th>
                    <th>Lý do lỗi</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRecord.CHI_TIET?.map((detail, idx) => (
                    <tr key={idx}>
                      <td>{detail.MA_MAT_HANG}</td>
                      <td>{detail.PHUONG_THUC_KIEM_NGHIEM}</td>
                      <td>{detail.SO_LUONG_THEO_CHUNG_TU}</td>
                      <td>{detail.SO_LUONG_KIEM_NGHIEM}</td>
                      <td style={{ color: '#10b981', fontWeight: 'bold' }}>{detail.SO_LUONG_DAT}</td>
                      <td style={{ color: detail.SO_LUONG_KHONG_DAT > 0 ? '#ef4444' : 'inherit', fontWeight: 'bold' }}>{detail.SO_LUONG_KHONG_DAT}</td>
                      <td>{detail.LY_DO_KHONG_DAT || '---'}</td>
                    </tr>
                  ))}
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

export default KiemNghiem;
