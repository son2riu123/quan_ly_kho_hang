import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import authService from '../services/authService';
import { Settings, Search, Plus, Loader2, X } from 'lucide-react';

function CauHinhDinhMuc() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    MA_KHO: '', MA_MAT_HANG: '', MUC_TON_TOI_THIEU: 0, MUC_TON_TOI_DA: 0, NGUONG_CAN_HAN: 30
  });

  const [khoList, setKhoList] = useState([]);
  const [matHangList, setMatHangList] = useState([]);

  const currentUser = authService.getCurrentUser();
  const userRole = currentUser ? currentUser.chucVu : '';
  const isManager = userRole === 'Quản lý kho' || userRole === 'Ban giám đốc';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [configRes, khoRes, mhRes] = await Promise.all([
        api.get('/cau-hinh-dinh-muc-ton'),
        api.get('/kho'),
        api.get('/mathang')
      ]);
      setData(configRes.data || []);
      setKhoList(khoRes.data.data || khoRes.data || []);
      setMatHangList(mhRes.data.data || mhRes.data || []);
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
      const payload = {
        MA_CAU_HINH: 'CH' + Math.floor(1000 + Math.random() * 9000),
        MA_KHO: form.MA_KHO,
        MA_MAT_HANG: form.MA_MAT_HANG,
        MUC_TON_TOI_THIEU: parseInt(form.MUC_TON_TOI_THIEU),
        MUC_TON_TOI_DA: parseInt(form.MUC_TON_TOI_DA),
        NGUONG_CAN_HAN: parseInt(form.NGUONG_CAN_HAN),
        TRANG_THAI: 'Hoạt động'
      };

      await api.post('/cau-hinh-dinh-muc-ton', payload);
      alert('Tạo cấu hình định mức thành công!');
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.error || err.message));
    }
  };

  const filteredData = data.filter(item => 
    (item.TEN_MAT_HANG || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.MA_MAT_HANG || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="page-header">
        <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Settings className="page-icon" size={24} style={{ color: 'var(--text-secondary)' }} />
          <div>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Cấu hình định mức tồn kho</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Thiết lập ngưỡng tồn tối đa, tối thiểu để hệ thống tự động cảnh báo</p>
          </div>
        </div>
        {isManager && (
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> Cấu hình mới
          </button>
        )}
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <Search className="data-table-search-icon" size={14} />
            <input 
              type="text" 
              placeholder="Tìm kiếm mặt hàng..." 
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
                <th>Mã CH</th>
                <th>Kho áp dụng</th>
                <th>Mặt hàng</th>
                <th>Min (Tối thiểu)</th>
                <th>Max (Tối đa)</th>
                <th>Ngưỡng cận hạn (ngày)</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign:'center'}}>Chưa có cấu hình nào</td></tr>
              ) : filteredData.map((item) => (
                <tr key={item.MA_CAU_HINH}>
                  <td><strong>{item.MA_CAU_HINH?.trim()}</strong></td>
                  <td>{item.TEN_KHO}</td>
                  <td>{item.TEN_MAT_HANG} ({item.MA_MAT_HANG?.trim()})</td>
                  <td style={{ color: 'var(--danger)', fontWeight: 600 }}>{item.MUC_TON_TOI_THIEU}</td>
                  <td style={{ color: 'var(--success)', fontWeight: 600 }}>{item.MUC_TON_TOI_DA}</td>
                  <td>{item.NGUONG_CAN_HAN} ngày</td>
                  <td><span className="badge badge-success">{item.TRANG_THAI}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Thêm cấu hình định mức mới</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Chọn kho</label>
                  <select className="form-control" required value={form.MA_KHO} onChange={e => setForm({...form, MA_KHO: e.target.value})}>
                    <option value="">-- Chọn kho --</option>
                    {khoList.map(k => <option key={k.MA_KHO} value={k.MA_KHO}>{k.TEN_KHO}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Chọn mặt hàng</label>
                  <select className="form-control" required value={form.MA_MAT_HANG} onChange={e => setForm({...form, MA_MAT_HANG: e.target.value})}>
                    <option value="">-- Chọn mặt hàng --</option>
                    {matHangList.map(m => <option key={m.MA_MAT_HANG} value={m.MA_MAT_HANG}>{m.TEN_MAT_HANG}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Mức tồn tối thiểu (Min)</label>
                  <input type="number" className="form-control" required min="0" value={form.MUC_TON_TOI_THIEU} onChange={e => setForm({...form, MUC_TON_TOI_THIEU: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Mức tồn tối đa (Max)</label>
                  <input type="number" className="form-control" required min="0" value={form.MUC_TON_TOI_DA} onChange={e => setForm({...form, MUC_TON_TOI_DA: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Ngưỡng cảnh báo cận hạn sử dụng (Số ngày)</label>
                  <input type="number" className="form-control" required min="0" value={form.NGUONG_CAN_HAN} onChange={e => setForm({...form, NGUONG_CAN_HAN: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu cấu hình</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default CauHinhDinhMuc;
