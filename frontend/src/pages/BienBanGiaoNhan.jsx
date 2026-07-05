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
  ClipboardCheck,
  ShieldAlert
} from 'lucide-react';

function BienBanGiaoNhan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    MA_BIEN_BAN_GIAO_NHAN: '', MA_DON_MUA: '', MA_CHUNG_TU_GIAO: '',
    MA_THU_KHO: '', NGUOI_GIAO: '', DIA_DIEM_GIAO_NHAN: '',
    NGAY_LAP: new Date().toISOString().split('T')[0],
    TONG_SO_LUONG_THEO_CHUNG_TU: 0, TONG_SO_LUONG_THUC_NHAN: 0, 
    TONG_SO_LUONG_DAT: 0, TONG_SO_LUONG_KHONG_DAT: 0,
    TRANG_THAI: 'Hoàn thành',
    GHI_CHU: '', CHI_TIET: []
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bbgnRes, poRes, empRes] = await Promise.all([
        api.get('/bien-ban-giao-nhan').catch(() => ({ data: [] })),
        api.get('/donmuahang').catch(() => ({ data: [] })),
        api.get('/nhanvien').catch(() => ({ data: [] }))
      ]);
      setData(bbgnRes.data);
      setPurchaseOrders(poRes.data.filter(po => po.TRANG_THAI !== 'Nhập đủ'));
      setEmployees(empRes.data.filter(e => e.CHUC_VU === 'Thủ kho'));
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

  const handleSelectPO = async (e) => {
    const maDonMua = e.target.value;
    if (!maDonMua) {
      setForm(prev => ({ ...prev, MA_DON_MUA: '', CHI_TIET: [], TONG_SO_LUONG_THEO_CHUNG_TU: 0, TONG_SO_LUONG_THUC_NHAN: 0, TONG_SO_LUONG_DAT: 0, TONG_SO_LUONG_KHONG_DAT: 0 }));
      return;
    }

    try {
      const res = await api.get(`/donmuahang/${maDonMua}`);
      const po = res.data;
      
      const itemsToImport = po.details
        .filter(item => item.SO_LUONG_CON_CHO_NHAN > 0)
        .map(item => ({
          MA_CHI_TIET_BBGN: 'CBB' + Math.floor(1000 + Math.random() * 9000),
          MA_MAT_HANG: item.MA_MAT_HANG,
          TEN_MAT_HANG: item.TEN_MAT_HANG,
          MA_DON_VI_TINH: item.MA_DON_VI_TINH,
          MA_LO_HANG: '',
          SO_LUONG_THEO_CHUNG_TU: item.SO_LUONG_CON_CHO_NHAN,
          SO_LUONG_THUC_NHAN: item.SO_LUONG_CON_CHO_NHAN, 
          SO_LUONG_DAT: item.SO_LUONG_CON_CHO_NHAN,
          SO_LUONG_KHONG_DAT: 0,
          TINH_TRANG_HANG: 'Bình thường',
          CAN_KIEM_NGHIEM: false,
          GHI_CHU: ''
        }));

      setForm(prev => {
        const sumQtyChungTu = itemsToImport.reduce((sum, item) => sum + item.SO_LUONG_THEO_CHUNG_TU, 0);
        const sumQtyThucNhan = itemsToImport.reduce((sum, item) => sum + item.SO_LUONG_THUC_NHAN, 0);
        const sumQtyDat = itemsToImport.reduce((sum, item) => sum + item.SO_LUONG_DAT, 0);
        return {
          ...prev,
          MA_DON_MUA: maDonMua,
          CHI_TIET: itemsToImport,
          TONG_SO_LUONG_THEO_CHUNG_TU: sumQtyChungTu,
          TONG_SO_LUONG_THUC_NHAN: sumQtyThucNhan,
          TONG_SO_LUONG_DAT: sumQtyDat,
          TONG_SO_LUONG_KHONG_DAT: 0
        };
      });
    } catch (err) {
      alert('Lỗi tải thông tin PO: ' + err.message);
    }
  };

  const handleQtyChange = (idx, field, value) => {
    let numVal = parseInt(value);
    if (isNaN(numVal)) numVal = 0;

    setForm(prev => {
      const details = [...prev.CHI_TIET];
      details[idx][field] = numVal;

      // Auto balance dat/khong dat
      if (field === 'SO_LUONG_THUC_NHAN') {
        details[idx].SO_LUONG_DAT = numVal;
        details[idx].SO_LUONG_KHONG_DAT = 0;
      } else if (field === 'SO_LUONG_DAT') {
        details[idx].SO_LUONG_KHONG_DAT = Math.max(0, details[idx].SO_LUONG_THUC_NHAN - numVal);
      } else if (field === 'SO_LUONG_KHONG_DAT') {
        details[idx].SO_LUONG_DAT = Math.max(0, details[idx].SO_LUONG_THUC_NHAN - numVal);
      }

      // Tự động đánh dấu Yêu cầu KCS nếu có số lượng Không Đạt hoặc có chênh lệch so với chứng từ
      if (details[idx].SO_LUONG_KHONG_DAT > 0 || details[idx].SO_LUONG_THUC_NHAN !== details[idx].SO_LUONG_THEO_CHUNG_TU) {
        details[idx].CAN_KIEM_NGHIEM = true;
      }

      const sumQtyThucNhan = details.reduce((sum, item) => sum + item.SO_LUONG_THUC_NHAN, 0);
      const sumQtyDat = details.reduce((sum, item) => sum + item.SO_LUONG_DAT, 0);
      const sumQtyKhongDat = details.reduce((sum, item) => sum + item.SO_LUONG_KHONG_DAT, 0);

      return {
        ...prev,
        CHI_TIET: details,
        TONG_SO_LUONG_THUC_NHAN: sumQtyThucNhan,
        TONG_SO_LUONG_DAT: sumQtyDat,
        TONG_SO_LUONG_KHONG_DAT: sumQtyKhongDat
      };
    });
  };

  const handleCheckboxChange = (idx) => {
    setForm(prev => {
      const details = [...prev.CHI_TIET];
      details[idx] = { ...details[idx], CAN_KIEM_NGHIEM: !details[idx].CAN_KIEM_NGHIEM };
      return { ...prev, CHI_TIET: details };
    });
  };

  const handleDetailChange = (idx, field, value) => {
    setForm(prev => {
      const details = [...prev.CHI_TIET];
      details[idx][field] = value;
      return { ...prev, CHI_TIET: details };
    });
  };

  const openCreate = () => {
    setForm({
      MA_BIEN_BAN_GIAO_NHAN: 'BB' + Math.floor(1000 + Math.random() * 9000),
      MA_DON_MUA: '', MA_CHUNG_TU_GIAO: '', MA_THU_KHO: '', NGUOI_GIAO: '', DIA_DIEM_GIAO_NHAN: '',
      NGAY_LAP: new Date().toISOString().split('T')[0],
      TONG_SO_LUONG_THEO_CHUNG_TU: 0, TONG_SO_LUONG_THUC_NHAN: 0, 
      TONG_SO_LUONG_DAT: 0, TONG_SO_LUONG_KHONG_DAT: 0,
      TRANG_THAI: 'Hoàn thành',
      GHI_CHU: '', CHI_TIET: []
    });
    setShowModal(true);
  };

  const viewDetail = async (maBB) => {
    try {
      const res = await api.get(`/bien-ban-giao-nhan/${maBB}`);
      setSelectedRecord(res.data);
      setShowDetailModal(true);
    } catch (err) {
      alert('Lỗi tải chi tiết BBGN: ' + err.message);
    }
  };

  const saveForm = async () => {
    if (!form.MA_DON_MUA || !form.MA_THU_KHO) {
      alert('Vui lòng chọn Đơn mua hàng và Thủ kho!');
      return;
    }
    if (form.CHI_TIET.length === 0) {
      alert('Biên bản phải có ít nhất 1 mặt hàng!');
      return;
    }

    try {
      await api.post('/bien-ban-giao-nhan', form);
      alert('Lập biên bản giao nhận thành công!');
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi lưu biên bản giao nhận: ' + (err.response?.data?.message || err.message));
    }
  };

  const deleteBBGN = async (maBB) => {
    if(!window.confirm(`Bạn có chắc chắn muốn xóa BBGN ${maBB}?`)) return;
    try {
      await api.delete(`/bien-ban-giao-nhan/${maBB}`);
      alert('Đã xóa thành công!');
      fetchData();
    } catch (err) {
      alert('Lỗi khi xóa: ' + (err.response?.data?.error || err.message));
    }
  };

  const filteredData = data.filter(item =>
    item.MA_BIEN_BAN_GIAO_NHAN.toLowerCase().includes(search.toLowerCase()) ||
    (item.MA_DON_MUA && item.MA_DON_MUA.toLowerCase().includes(search.toLowerCase())) ||
    (item.NGUOI_GIAO && item.NGUOI_GIAO.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout title="Biên bản giao nhận">
      <div className="page-header">
        <h2>Quản lý Biên bản Giao nhận</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Lập Biên bản mới
        </button>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <Search className="data-table-search-icon" size={14} />
            <input 
              type="text" 
              placeholder="Tìm mã biên bản, mã PO, người giao..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner"><Loader2 className="spinner" /></div>
        ) : filteredData.length === 0 ? (
          <div className="empty-state">
            <ClipboardCheck size={40} className="empty-state-icon" />
            <div className="empty-state-text">Không tìm thấy biên bản giao nhận nào</div>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã BBGN</th>
                  <th>Mã Đơn Mua (PO)</th>
                  <th>Ngày lập</th>
                  <th>Thủ kho</th>
                  <th>Người giao</th>
                  <th>Số lượng nhận</th>
                  <th>Trạng thái</th>
                  <th style={{ width: '120px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.MA_BIEN_BAN_GIAO_NHAN}>
                    <td><strong>{item.MA_BIEN_BAN_GIAO_NHAN}</strong></td>
                    <td>{item.MA_DON_MUA}</td>
                    <td>{item.NGAY_LAP ? new Date(item.NGAY_LAP).toLocaleDateString('vi-VN') : ''}</td>
                    <td>{item.MA_THU_KHO}</td>
                    <td>{item.NGUOI_GIAO}</td>
                    <td><strong>{item.TONG_SO_LUONG_THUC_NHAN}</strong></td>
                    <td>
                      <span className={`badge ${
                        item.TRANG_THAI === 'Hoàn thành' ? 'badge-success' : 'badge-warning'
                      }`}>{item.TRANG_THAI}</span>
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => viewDetail(item.MA_BIEN_BAN_GIAO_NHAN)} style={{ marginRight: '4px' }}>
                        <Eye size={13} />
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => deleteBBGN(item.MA_BIEN_BAN_GIAO_NHAN)} style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                        <X size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '1000px' }}>
            <div className="modal-header">
              <h3>Lập Biên bản Giao nhận</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Mã Biên bản</label>
                  <input name="MA_BIEN_BAN_GIAO_NHAN" value={form.MA_BIEN_BAN_GIAO_NHAN} readOnly className="readonly" />
                </div>
                <div className="form-group">
                  <label>Đơn mua hàng (PO) liên kết <span style={{ color: 'red' }}>*</span></label>
                  <select name="MA_DON_MUA" value={form.MA_DON_MUA} onChange={handleSelectPO}>
                    <option value="">-- Chọn đơn mua hàng --</option>
                    {purchaseOrders.map(po => (
                      <option key={po.MA_DON_MUA} value={po.MA_DON_MUA}>
                        {po.MA_DON_MUA} - {po.NHA_CUNG_CAP?.TEN_NHA_CUNG_CAP || ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Chứng từ giao (Tùy chọn)</label>
                  <input name="MA_CHUNG_TU_GIAO" value={form.MA_CHUNG_TU_GIAO} onChange={handleChange} placeholder="Mã phiếu giao của NCC" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Thủ kho nhận <span style={{ color: 'red' }}>*</span></label>
                  <select name="MA_THU_KHO" value={form.MA_THU_KHO} onChange={handleChange}>
                    <option value="">-- Chọn thủ kho --</option>
                    {employees.map(e => <option key={e.MA_NHAN_VIEN} value={e.MA_NHAN_VIEN}>{e.HO_TEN}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Người giao hàng</label>
                  <input name="NGUOI_GIAO" value={form.NGUOI_GIAO} onChange={handleChange} placeholder="Tên tài xế/người giao" />
                </div>
                <div className="form-group">
                  <label>Ngày lập</label>
                  <input type="date" name="NGAY_LAP" value={form.NGAY_LAP} onChange={handleChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Địa điểm giao nhận</label>
                  <input name="DIA_DIEM_GIAO_NHAN" value={form.DIA_DIEM_GIAO_NHAN} onChange={handleChange} placeholder="VD: Sân kho C, Cổng số 2" />
                </div>
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Ghi chú chung</label>
                  <input name="GHI_CHU" value={form.GHI_CHU} onChange={handleChange} placeholder="Lưu ý khi giao nhận" />
                </div>
              </div>

              {form.MA_DON_MUA && (
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ClipboardCheck size={16} /> Danh sách đối chiếu và kiểm đếm
                    </h4>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Tổng nhận: <strong>{form.TONG_SO_LUONG_THUC_NHAN}</strong> / PO: {form.TONG_SO_LUONG_THEO_CHUNG_TU}
                    </span>
                  </div>
                  
                  <div className="data-table-wrapper" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Mã HH</th>
                          <th>Tên HH</th>
                          <th>Số lượng PO</th>
                          <th>Thực nhận</th>
                          <th>S.L Đạt</th>
                          <th>S.L Lỗi</th>
                          <th>Tình trạng (Ghi chú)</th>
                          <th title="Tích chọn để tự động đẩy yêu cầu sang bộ phận KCS" style={{ color: 'var(--primary)' }}>Y/C KCS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.CHI_TIET.map((item, idx) => (
                          <tr key={idx} style={{ background: item.SO_LUONG_THUC_NHAN !== item.SO_LUONG_THEO_CHUNG_TU ? 'rgba(255, 170, 0, 0.05)' : 'inherit' }}>
                            <td><strong>{item.MA_MAT_HANG}</strong></td>
                            <td style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.TEN_MAT_HANG}>
                              {item.TEN_MAT_HANG}
                            </td>
                            <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{item.SO_LUONG_THEO_CHUNG_TU}</td>
                            <td>
                              <input 
                                type="number" 
                                min="0" 
                                className="number-input"
                                style={{ width: '70px', padding: '4px' }}
                                value={item.SO_LUONG_THUC_NHAN} 
                                onChange={(e) => handleQtyChange(idx, 'SO_LUONG_THUC_NHAN', e.target.value)} 
                              />
                            </td>
                            <td>
                              <input 
                                type="number" 
                                min="0" 
                                className="number-input"
                                style={{ width: '70px', padding: '4px', borderColor: item.SO_LUONG_DAT < item.SO_LUONG_THUC_NHAN ? 'var(--warning)' : 'inherit' }}
                                value={item.SO_LUONG_DAT} 
                                onChange={(e) => handleQtyChange(idx, 'SO_LUONG_DAT', e.target.value)} 
                              />
                            </td>
                            <td>
                              <input 
                                type="number" 
                                min="0" 
                                className="number-input"
                                style={{ width: '70px', padding: '4px', color: item.SO_LUONG_KHONG_DAT > 0 ? 'var(--danger)' : 'inherit' }}
                                value={item.SO_LUONG_KHONG_DAT} 
                                onChange={(e) => handleQtyChange(idx, 'SO_LUONG_KHONG_DAT', e.target.value)} 
                              />
                            </td>
                            <td>
                              <input 
                                type="text" 
                                style={{ width: '120px', padding: '4px' }}
                                value={item.TINH_TRANG_HANG} 
                                onChange={(e) => handleDetailChange(idx, 'TINH_TRANG_HANG', e.target.value)} 
                                placeholder="Bình thường"
                              />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <input 
                                type="checkbox" 
                                checked={item.CAN_KIEM_NGHIEM} 
                                onChange={() => handleCheckboxChange(idx)} 
                                style={{ transform: 'scale(1.3)', cursor: 'pointer', accentColor: 'var(--primary)' }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {form.TONG_SO_LUONG_THUC_NHAN !== form.TONG_SO_LUONG_THEO_CHUNG_TU && (
                    <div className="alert-message warning" style={{ marginTop: '12px' }}>
                      <ShieldAlert size={14} style={{ marginRight: '6px' }} />
                      Cảnh báo: Tổng số lượng thực nhận ({form.TONG_SO_LUONG_THUC_NHAN}) đang lệch so với số lượng trên đơn mua hàng PO ({form.TONG_SO_LUONG_THEO_CHUNG_TU}).
                    </div>
                  )}
                  {form.TONG_SO_LUONG_KHONG_DAT > 0 && (
                    <div className="alert-message error" style={{ marginTop: '12px' }}>
                      <ShieldAlert size={14} style={{ marginRight: '6px' }} />
                      Lưu ý: Có {form.TONG_SO_LUONG_KHONG_DAT} sản phẩm bị ghi nhận lỗi/không đạt chất lượng. Yêu cầu tạo phiếu KCS ngay lập tức.
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={saveForm}><Check size={16} /> Lưu & Xác nhận Biên bản</button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {showDetailModal && selectedRecord && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h3>Chi tiết Biên bản Giao nhận: {selectedRecord.MA_BIEN_BAN_GIAO_NHAN}</h3>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px' }}>
                <div>
                  <p><strong>Mã PO:</strong> {selectedRecord.MA_DON_MUA}</p>
                  <p><strong>Thủ kho:</strong> {selectedRecord.MA_THU_KHO}</p>
                  <p><strong>Người giao:</strong> {selectedRecord.NGUOI_GIAO || '---'}</p>
                  <p><strong>Ngày lập:</strong> {selectedRecord.NGAY_LAP ? new Date(selectedRecord.NGAY_LAP).toLocaleDateString('vi-VN') : ''}</p>
                </div>
                <div>
                  <p><strong>Địa điểm:</strong> {selectedRecord.DIA_DIEM_GIAO_NHAN || '---'}</p>
                  <p><strong>Trạng thái:</strong> <span className="badge badge-success">{selectedRecord.TRANG_THAI}</span></p>
                  <p><strong>Số lượng đặt:</strong> {selectedRecord.TONG_SO_LUONG_THEO_CHUNG_TU}</p>
                  <p><strong>Số lượng nhận:</strong> <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{selectedRecord.TONG_SO_LUONG_THUC_NHAN}</span></p>
                </div>
              </div>
              <h4>Danh sách hàng hóa thực nhận</h4>
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã hàng</th>
                      <th>ĐVT</th>
                      <th>PO</th>
                      <th>Thực nhận</th>
                      <th>Đạt</th>
                      <th>Không đạt</th>
                      <th>Tình trạng</th>
                      <th>Y/C KCS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRecord.CHI_TIET?.map((item, idx) => (
                      <tr key={idx}>
                        <td><strong>{item.MA_MAT_HANG}</strong></td>
                        <td>{item.MA_DON_VI_TINH}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{item.SO_LUONG_THEO_CHUNG_TU}</td>
                        <td><strong>{item.SO_LUONG_THUC_NHAN}</strong></td>
                        <td><span style={{ color: 'var(--success)', fontWeight: '600' }}>{item.SO_LUONG_DAT}</span></td>
                        <td><span style={{ color: item.SO_LUONG_KHONG_DAT > 0 ? 'var(--danger)' : 'inherit', fontWeight: item.SO_LUONG_KHONG_DAT > 0 ? '600' : 'normal' }}>{item.SO_LUONG_KHONG_DAT}</span></td>
                        <td>{item.TINH_TRANG_HANG}</td>
                        <td>
                          {item.CAN_KIEM_NGHIEM ? <span className="badge badge-warning">Có KCS</span> : <span style={{ color: 'var(--text-secondary)' }}>Không</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default BienBanGiaoNhan;
