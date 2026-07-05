import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import authService from '../services/authService';
import { 
  FileText, Search, Plus, Eye, Check, Loader2, X, AlertTriangle, Send
} from 'lucide-react';

function XuLySaiLech() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPhuongAnModal, setShowPhuongAnModal] = useState(false);
  const [selectedHoSo, setSelectedHoSo] = useState(null);
  const [phuongAnList, setPhuongAnList] = useState([]);

  // Form states
  const [form, setForm] = useState({
    MA_HO_SO: '', MO_TA_CHUNG: '', NGUON_PHAT_HIEN: 'Báo cáo thủ kho',
    details: [{ MA_MAT_HANG: '', MA_VI_TRI: '', MA_LO_HANG: '', SO_LUONG_HE_THONG: 0, SO_LUONG_THUC_TE: 0, MO_TA_SAI_LECH: '' }]
  });

  const [paForm, setPaForm] = useState({
    LOAI_PHUONG_AN: 'Điều chỉnh sổ sách', LY_DO: '', CAN_THAO_TAC_VAT_LY: false, CAN_DUYET_CAP_CAO: false,
    MA_NHIEM_VU: '', NGUOI_DUOC_PHAN_CONG: '', NOI_DUNG_NHIEM_VU: ''
  });

  const currentUser = authService.getCurrentUser();
  const userRole = currentUser ? currentUser.chucVu : '';
  const userMa = currentUser ? currentUser.maNhanVien : '';
  const isManager = userRole === 'Quản lý kho' || userRole === 'Ban giám đốc';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ho-so-xu-ly-sai-lech-ton-kho');
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
      const maHoSo = 'HS' + Math.floor(1000 + Math.random() * 9000);
      
      const payload = {
        MA_HO_SO: maHoSo,
        NGUOI_PHAT_HIEN: userMa,
        THOI_DIEM_PHAT_HIEN: new Date().toISOString(),
        NGUON_PHAT_HIEN: form.NGUON_PHAT_HIEN,
        MO_TA_CHUNG: form.MO_TA_CHUNG,
        TRANG_THAI_HO_SO: 'Chờ xác minh',
        GHI_CHU: '',
        chiTietList: form.details.map((d, idx) => ({
          MA_CHI_TIET_SAI_LECH: maHoSo + 'CT' + idx,
          MA_MAT_HANG: d.MA_MAT_HANG,
          MA_LO_HANG: d.MA_LO_HANG || null,
          MA_VI_TRI: d.MA_VI_TRI || null,
          MA_DON_VI_TINH: 'DVT01', // Mặc định tạm
          SO_LUONG_HE_THONG: d.SO_LUONG_HE_THONG,
          SO_LUONG_THUC_TE: d.SO_LUONG_THUC_TE,
          SO_LUONG_SAI_LECH: Math.abs(d.SO_LUONG_THUC_TE - d.SO_LUONG_HE_THONG),
          LOAI_SAI_LECH: d.SO_LUONG_THUC_TE > d.SO_LUONG_HE_THONG ? 'Thừa' : 'Thiếu',
          MO_TA_SAI_LECH: d.MO_TA_SAI_LECH
        }))
      };

      await api.post('/ho-so-xu-ly-sai-lech-ton-kho', payload);
      alert('Tạo hồ sơ sai lệch thành công!');
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const openDetail = async (id) => {
    try {
      const res = await api.get(`/ho-so-xu-ly-sai-lech-ton-kho/${id}`);
      setSelectedHoSo(res.data.data);
      
      try {
        const paRes = await api.get(`/phuong-an-xu-sai-lech/ho-so/${id}`);
        setPhuongAnList(paRes.data.data || []);
      } catch (err) {
        setPhuongAnList([]);
      }

      setShowDetailModal(true);
    } catch (err) {
      alert('Lỗi tải chi tiết: ' + err.message);
    }
  };

  const handleCreatePhuongAn = async (e) => {
    e.preventDefault();
    try {
      const maPhuongAn = 'PA' + Math.floor(1000 + Math.random() * 9000);
      const payload = {
        phuongAn: {
          MA_PHUONG_AN: maPhuongAn,
          MA_HO_SO: selectedHoSo.MA_HO_SO,
          LOAI_PHUONG_AN: paForm.LOAI_PHUONG_AN,
          LY_DO: paForm.LY_DO,
          NGUOI_CHON_PHUONG_AN: userMa,
          CAN_THAO_TAC_VAT_LY: paForm.CAN_THAO_TAC_VAT_LY,
          CAN_DUYET_CAP_CAO: paForm.CAN_DUYET_CAP_CAO,
          TRANG_THAI_PHUONG_AN: paForm.CAN_DUYET_CAP_CAO ? 'Chờ phê duyệt' : 'Đã duyệt'
        },
        nhiemVu: paForm.CAN_THAO_TAC_VAT_LY ? {
          MA_NHIEM_VU: 'NV' + Math.floor(1000 + Math.random() * 9000),
          NGUOI_DUOC_PHAN_CONG: paForm.NGUOI_DUOC_PHAN_CONG,
          NOI_DUNG_NHIEM_VU: paForm.NOI_DUNG_NHIEM_VU
        } : null
      };
      
      await api.post('/phuong-an-xu-sai-lech', payload);
      alert('Lập phương án thành công!');
      setShowPhuongAnModal(false);
      openDetail(selectedHoSo.MA_HO_SO);
      fetchData();
    } catch (err) {
      alert('Lỗi lập phương án: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!isManager) return alert('Chỉ Quản lý kho mới có quyền này');
    try {
      await api.put(`/ho-so-xu-ly-sai-lech-ton-kho/${selectedHoSo.MA_HO_SO}`, {
        TRANG_THAI_HO_SO: status,
        NGUOI_XU_LY: userMa,
        THOI_DIEM_XU_LY: new Date().toISOString()
      });
      alert('Cập nhật trạng thái thành công!');
      setShowDetailModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const filteredData = data.filter(item => 
    item.MA_HO_SO?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="page-header">
        <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle className="page-icon" size={24} style={{ color: 'var(--text-secondary)' }} />
          <div>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Xử lý sai lệch tồn kho</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Quản lý các hồ sơ báo cáo chênh lệch tồn kho so với thực tế</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} /> Báo cáo sai lệch
        </button>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <Search className="data-table-search-icon" size={14} />
            <input 
              type="text" 
              placeholder="Tìm kiếm mã hồ sơ..." 
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
                <th>Mã hồ sơ</th>
                <th>Người phát hiện</th>
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
                <tr key={item.MA_HO_SO}>
                  <td><strong>{item.MA_HO_SO}</strong></td>
                  <td>{item.NGUOI_PHAT_HIEN}</td>
                  <td>{new Date(item.THOI_DIEM_PHAT_HIEN).toLocaleString('vi-VN')}</td>
                  <td>{item.NGUON_PHAT_HIEN}</td>
                  <td>
                    <span className={`badge ${item.TRANG_THAI_HO_SO === 'Đã xử lý' ? 'badge-success' : 'badge-warning'}`}>
                      {item.TRANG_THAI_HO_SO}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-icon" onClick={() => openDetail(item.MA_HO_SO)}>
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
          <div className="modal" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3>Báo cáo sai lệch tồn kho</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Mô tả chung</label>
                  <input type="text" className="form-control" required value={form.MO_TA_CHUNG} onChange={e => setForm({...form, MO_TA_CHUNG: e.target.value})} />
                </div>
                
                <h4>Chi tiết mặt hàng sai lệch</h4>
                {form.details.map((d, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px', background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                    <input type="text" placeholder="Mã mặt hàng" className="form-control" required value={d.MA_MAT_HANG} onChange={e => {
                      const newD = [...form.details]; newD[idx].MA_MAT_HANG = e.target.value; setForm({...form, details: newD});
                    }} />
                    <input type="text" placeholder="Vị trí (nếu có)" className="form-control" value={d.MA_VI_TRI} onChange={e => {
                      const newD = [...form.details]; newD[idx].MA_VI_TRI = e.target.value; setForm({...form, details: newD});
                    }} />
                    <input type="text" placeholder="Lô hàng (nếu có)" className="form-control" value={d.MA_LO_HANG} onChange={e => {
                      const newD = [...form.details]; newD[idx].MA_LO_HANG = e.target.value; setForm({...form, details: newD});
                    }} />
                    
                    <input type="number" placeholder="Số lượng HT" className="form-control" required value={d.SO_LUONG_HE_THONG} onChange={e => {
                      const newD = [...form.details]; newD[idx].SO_LUONG_HE_THONG = parseInt(e.target.value)||0; setForm({...form, details: newD});
                    }} />
                    <input type="number" placeholder="Số lượng thực tế" className="form-control" required value={d.SO_LUONG_THUC_TE} onChange={e => {
                      const newD = [...form.details]; newD[idx].SO_LUONG_THUC_TE = parseInt(e.target.value)||0; setForm({...form, details: newD});
                    }} />
                    <input type="text" placeholder="Mô tả sai lệch" className="form-control" value={d.MO_TA_SAI_LECH} onChange={e => {
                      const newD = [...form.details]; newD[idx].MO_TA_SAI_LECH = e.target.value; setForm({...form, details: newD});
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

      {showDetailModal && selectedHoSo && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3>Chi tiết hồ sơ: {selectedHoSo.MA_HO_SO}</h3>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <p><strong>Người phát hiện:</strong> {selectedHoSo.NGUOI_PHAT_HIEN}</p>
              <p><strong>Mô tả:</strong> {selectedHoSo.MO_TA_CHUNG}</p>
              
              <table className="data-table" style={{ marginTop: '15px' }}>
                <thead>
                  <tr>
                    <th>Mặt hàng</th>
                    <th>SL Hệ thống</th>
                    <th>SL Thực tế</th>
                    <th>Chênh lệch</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedHoSo.ChiTiet?.map((ct, i) => (
                    <tr key={i}>
                      <td>{ct.MA_MAT_HANG}</td>
                      <td>{ct.SO_LUONG_HE_THONG}</td>
                      <td>{ct.SO_LUONG_THUC_TE}</td>
                      <td><span style={{ color: ct.LOAI_SAI_LECH === 'Thừa' ? 'green' : 'red' }}>{ct.LOAI_SAI_LECH} ({ct.SO_LUONG_SAI_LECH})</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {phuongAnList.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h4>Lịch sử phương án xử lý</h4>
                  <table className="data-table" style={{ marginTop: '10px' }}>
                    <thead>
                      <tr>
                        <th>Mã PA</th>
                        <th>Loại phương án</th>
                        <th>Lý do</th>
                        <th>Người lập</th>
                        <th>Thời điểm</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phuongAnList.map((pa) => (
                        <tr key={pa.MA_PHUONG_AN}>
                          <td><strong>{pa.MA_PHUONG_AN}</strong></td>
                          <td>{pa.LOAI_PHUONG_AN}</td>
                          <td>{pa.LY_DO}</td>
                          <td>{pa.TEN_NGUOI_CHON}</td>
                          <td>{new Date(pa.THOI_DIEM_CHON).toLocaleString('vi-VN')}</td>
                          <td><span className="badge badge-info">{pa.TRANG_THAI_PHUONG_AN}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Đóng</button>
              {isManager && selectedHoSo.TRANG_THAI_HO_SO === 'Chờ xác minh' && (
                <>
                  <button className="btn btn-primary" onClick={() => setShowPhuongAnModal(true)}>
                    <Plus size={16} style={{marginRight: '5px'}}/> Lập phương án xử lý
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showPhuongAnModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Lập phương án xử lý sai lệch</h3>
              <button className="modal-close" onClick={() => setShowPhuongAnModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreatePhuongAn}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Loại phương án</label>
                  <select className="form-control" value={paForm.LOAI_PHUONG_AN} onChange={e => setPaForm({...paForm, LOAI_PHUONG_AN: e.target.value})}>
                    <option value="Điều chỉnh sổ sách">Điều chỉnh sổ sách</option>
                    <option value="Phạt đền bù">Phạt đền bù</option>
                    <option value="Hủy hàng">Hủy hàng (Vứt bỏ)</option>
                    <option value="Chuyển kho cách ly">Chuyển kho cách ly</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Lý do / Giải trình chi tiết</label>
                  <textarea className="form-control" required rows="3" value={paForm.LY_DO} onChange={e => setPaForm({...paForm, LY_DO: e.target.value})}></textarea>
                </div>
                <div className="form-group" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal' }}>
                    <input type="checkbox" checked={paForm.CAN_DUYET_CAP_CAO} onChange={e => setPaForm({...paForm, CAN_DUYET_CAP_CAO: e.target.checked})} />
                    Cần BGĐ phê duyệt
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal' }}>
                    <input type="checkbox" checked={paForm.CAN_THAO_TAC_VAT_LY} onChange={e => setPaForm({...paForm, CAN_THAO_TAC_VAT_LY: e.target.checked})} />
                    Có thao tác vật lý
                  </label>
                </div>

                {paForm.CAN_THAO_TAC_VAT_LY && (
                  <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
                    <h4>Giao nhiệm vụ xử lý</h4>
                    <div className="form-group">
                      <label>Người thực hiện (Mã NV)</label>
                      <input type="text" className="form-control" required value={paForm.NGUOI_DUOC_PHAN_CONG} onChange={e => setPaForm({...paForm, NGUOI_DUOC_PHAN_CONG: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Nội dung nhiệm vụ</label>
                      <input type="text" className="form-control" required value={paForm.NOI_DUNG_NHIEM_VU} onChange={e => setPaForm({...paForm, NOI_DUNG_NHIEM_VU: e.target.value})} />
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPhuongAnModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Xác nhận lập phương án</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default XuLySaiLech;
