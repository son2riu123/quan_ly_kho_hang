import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import authService from '../services/authService';
import { 
  FileText, Search, Plus, Eye, Check, Loader2, X, AlertTriangle, ShieldAlert
} from 'lucide-react';

function XuLyHangLoi() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPhieu, setSelectedPhieu] = useState(null);

  // Form states
  const [form, setForm] = useState({
    MA_PHIEU_BAO_CAO: '', MO_TA_CHUNG: '', NGUON_PHAT_HIEN: 'Phát hiện khi xuất/nhập hàng',
    details: [{ MA_MAT_HANG: '', MA_VI_TRI: '', MA_LO_HANG: '', SO_LUONG_BAO_CAO: 0, LOAI_VAN_DE: 'Hư hỏng vật lý', TINH_TRANG_HANG: '', MO_TA_CHI_TIET: '' }]
  });

  const currentUser = authService.getCurrentUser();
  const userRole = currentUser ? currentUser.chucVu : '';
  const userMa = currentUser ? currentUser.maNhanVien : '';
  const isManager = userRole === 'Quản lý kho' || userRole === 'Ban giám đốc';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/phieu-bao-cao-hang-loi');
      setData(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const maPhieu = 'HL' + Math.floor(1000 + Math.random() * 9000);
      
      const payload = {
        MA_PHIEU_BAO_CAO: maPhieu,
        NGUOI_LAP: userMa,
        THOI_DIEM_LAP: new Date().toISOString(),
        NGUON_PHAT_HIEN: form.NGUON_PHAT_HIEN,
        MO_TA_CHUNG: form.MO_TA_CHUNG,
        TRANG_THAI_PHIEU: 'Chờ xác minh',
        GHI_CHU: '',
        chiTietList: form.details.map((d, idx) => ({
          MA_CHI_TIET_PHIEU: maPhieu + 'CT' + idx,
          MA_MAT_HANG: d.MA_MAT_HANG,
          MA_LO_HANG: d.MA_LO_HANG || null,
          MA_VI_TRI: d.MA_VI_TRI,
          SO_LUONG_BAO_CAO: d.SO_LUONG_BAO_CAO,
          LOAI_VAN_DE: d.LOAI_VAN_DE,
          TINH_TRANG_HANG: d.TINH_TRANG_HANG,
          MO_TA_CHI_TIET: d.MO_TA_CHI_TIET
        }))
      };

      await api.post('/phieu-bao-cao-hang-loi', payload);
      alert('Tạo báo cáo hàng lỗi thành công!');
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const openDetail = async (id) => {
    try {
      const res = await api.get(`/phieu-bao-cao-hang-loi/${id}`);
      setSelectedPhieu(res.data.data || res.data);
      setShowDetailModal(true);
    } catch (err) {
      alert('Lỗi tải chi tiết: ' + err.message);
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!isManager) return alert('Chỉ Quản lý kho mới có quyền này');
    try {
      await api.put(`/phieu-bao-cao-hang-loi/${selectedPhieu.MA_PHIEU_BAO_CAO}`, {
        TRANG_THAI_PHIEU: status
      });
      alert('Cập nhật trạng thái thành công!');
      setShowDetailModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const filteredData = data.filter(item => 
    item.MA_PHIEU_BAO_CAO?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="page-header">
        <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldAlert className="page-icon" size={24} style={{ color: 'var(--text-secondary)' }} />
          <div>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Xử lý hàng lỗi, hỏng</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Báo cáo và xử lý các mặt hàng bị hư hỏng, hết hạn, không đạt chất lượng</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} /> Lập báo cáo hàng lỗi
        </button>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <Search className="data-table-search-icon" size={14} />
            <input 
              type="text" 
              placeholder="Tìm kiếm mã phiếu..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {loading ? (
          <div className="loading-state"><Loader2 className="spin" size={24} /> Đang tải...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã báo cáo</th>
                <th>Người lập</th>
                <th>Thời điểm</th>
                <th>Nguồn phát hiện</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign:'center'}}>Không có dữ liệu</td></tr>
              ) : filteredData.map((item) => (
                <tr key={item.MA_PHIEU_BAO_CAO}>
                  <td><strong>{item.MA_PHIEU_BAO_CAO}</strong></td>
                  <td>{item.NGUOI_LAP}</td>
                  <td>{new Date(item.THOI_DIEM_LAP).toLocaleString('vi-VN')}</td>
                  <td>{item.NGUON_PHAT_HIEN}</td>
                  <td>
                    <span className={`badge ${item.TRANG_THAI_PHIEU === 'Đã xử lý' ? 'badge-success' : 'badge-warning'}`}>
                      {item.TRANG_THAI_PHIEU}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-icon" onClick={() => openDetail(item.MA_PHIEU_BAO_CAO)}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h3>Lập Phiếu báo cáo hàng lỗi</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Mô tả chung</label>
                  <input type="text" className="form-control" required value={form.MO_TA_CHUNG} onChange={e => setForm({...form, MO_TA_CHUNG: e.target.value})} />
                </div>
                
                <h4>Chi tiết mặt hàng lỗi</h4>
                {form.details.map((d, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px', background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                    <input type="text" placeholder="Mã mặt hàng" className="form-control" required value={d.MA_MAT_HANG} onChange={e => {
                      const newD = [...form.details]; newD[idx].MA_MAT_HANG = e.target.value; setForm({...form, details: newD});
                    }} />
                    <input type="text" placeholder="Vị trí" className="form-control" required value={d.MA_VI_TRI} onChange={e => {
                      const newD = [...form.details]; newD[idx].MA_VI_TRI = e.target.value; setForm({...form, details: newD});
                    }} />
                    <input type="text" placeholder="Lô hàng (nếu có)" className="form-control" value={d.MA_LO_HANG} onChange={e => {
                      const newD = [...form.details]; newD[idx].MA_LO_HANG = e.target.value; setForm({...form, details: newD});
                    }} />
                    
                    <input type="number" placeholder="Số lượng lỗi" className="form-control" required value={d.SO_LUONG_BAO_CAO} onChange={e => {
                      const newD = [...form.details]; newD[idx].SO_LUONG_BAO_CAO = parseInt(e.target.value)||0; setForm({...form, details: newD});
                    }} />
                    <select className="form-control" value={d.LOAI_VAN_DE} onChange={e => {
                      const newD = [...form.details]; newD[idx].LOAI_VAN_DE = e.target.value; setForm({...form, details: newD});
                    }}>
                      <option value="Hư hỏng vật lý">Hư hỏng vật lý</option>
                      <option value="Hết hạn sử dụng">Hết hạn sử dụng</option>
                      <option value="Sắp hết hạn">Sắp hết hạn</option>
                      <option value="Sai quy cách">Sai quy cách</option>
                    </select>
                    <input type="text" placeholder="Tình trạng chi tiết" className="form-control" required value={d.TINH_TRANG_HANG} onChange={e => {
                      const newD = [...form.details]; newD[idx].TINH_TRANG_HANG = e.target.value; setForm({...form, details: newD});
                    }} />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Gửi báo cáo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && selectedPhieu && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h3>Chi tiết báo cáo lỗi: {selectedPhieu.MA_PHIEU_BAO_CAO}</h3>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <p><strong>Người lập:</strong> {selectedPhieu.NGUOI_LAP}</p>
              <p><strong>Mô tả chung:</strong> {selectedPhieu.MO_TA_CHUNG}</p>
              
              <table className="data-table" style={{ marginTop: '15px' }}>
                <thead>
                  <tr>
                    <th>Mặt hàng</th>
                    <th>Vị trí</th>
                    <th>Số lượng</th>
                    <th>Loại vấn đề</th>
                    <th>Tình trạng</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPhieu.CHI_TIET?.map((ct, i) => (
                    <tr key={i}>
                      <td>{ct.MA_MAT_HANG}</td>
                      <td>{ct.MA_VI_TRI}</td>
                      <td>{ct.SO_LUONG_BAO_CAO}</td>
                      <td><span className="badge badge-warning">{ct.LOAI_VAN_DE}</span></td>
                      <td>{ct.TINH_TRANG_HANG}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Đóng</button>
              {isManager && selectedPhieu.TRANG_THAI_PHIEU === 'Chờ xác minh' && (
                <>
                  <button className="btn btn-danger" onClick={() => handleUpdateStatus('Từ chối')}>Từ chối</button>
                  <button className="btn btn-primary" onClick={() => handleUpdateStatus('Đã xử lý')}>Duyệt cách ly</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default XuLyHangLoi;
