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
  ArrowDownLeft,
  MapPin
} from 'lucide-react';

function PhieuNhapKho() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  
  const [bbgns, setBbgns] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    MA_PHIEU_NHAP_KHO: '', MA_BIEN_BAN_GIAO_NHAN: '', MA_DON_MUA: '',
    MA_KHO: '', MA_THU_KHO: '', NGUOI_GIAO: '', NGAY_LAP: new Date().toISOString().split('T')[0],
    TONG_SO_LUONG_THEO_CHUNG_TU: 0, TONG_SO_LUONG_THUC_NHAP: 0, TONG_TIEN: 0,
    GHI_CHU: '', details: []
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [receiptsRes, bbgnRes, khoRes, empRes, locRes] = await Promise.all([
        api.get('/phieunhapkho').catch(() => ({ data: [] })),
        api.get('/bien-ban-giao-nhan').catch(() => ({ data: [] })),
        api.get('/kho').catch(() => ({ data: [] })),
        api.get('/nhanvien').catch(() => ({ data: [] })),
        api.get('/vitrikho').catch(() => ({ data: [] }))
      ]);
      setData(receiptsRes.data);
      const activeBbgns = bbgnRes.data.filter(bb => ['Hoàn thành', 'Đã duyệt', 'Đã xác nhận'].includes(bb.TRANG_THAI));
      
      // Lọc bỏ những BBGN đã được lập Phiếu Nhập Kho
      const usedBbgns = receiptsRes.data.map(nk => nk.MA_BIEN_BAN_GIAO_NHAN?.trim());
      const filteredBbgns = activeBbgns.filter(bb => !usedBbgns.includes(bb.MA_BIEN_BAN_GIAO_NHAN.trim()));
      
      // Cập nhật lại TONG_SO_LUONG_DAT cho label hiển thị nếu có phiếu KCS
      for (let bb of filteredBbgns) {
        try {
          const resKCS = await api.get(`/bien-ban-kiem-nghiem/by-bbgn/${bb.MA_BIEN_BAN_GIAO_NHAN.trim()}`);
          if (resKCS.data && resKCS.data.CHI_TIET) {
            let kcsSum = resKCS.data.CHI_TIET.reduce((sum, item) => sum + (item.SO_LUONG_DAT || 0), 0);
            bb.TONG_SO_LUONG_DAT = kcsSum;
          }
        } catch (e) {
          // No KCS found, keep original bb.TONG_SO_LUONG_DAT
        }
      }
      
      setBbgns(filteredBbgns);
      
      setWarehouses(khoRes.data);
      setEmployees(empRes.data.filter(e => e.CHUC_VU === 'Thủ kho'));
      setLocations(locRes.data);
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

  const handleSelectBBGN = async (e) => {
    const maBBGN = e.target.value;
    if (!maBBGN) {
      setForm(prev => ({ ...prev, MA_BIEN_BAN_GIAO_NHAN: '', MA_DON_MUA: '', details: [], TONG_TIEN: 0, TONG_SO_LUONG_THEO_CHUNG_TU: 0, TONG_SO_LUONG_THUC_NHAP: 0 }));
      return;
    }

    try {
      const resBBGN = await api.get(`/bien-ban-giao-nhan/${maBBGN}`);
      const bbgn = resBBGN.data;
      
      // Lấy thêm giá (đơn giá) từ PO (Đơn mua hàng)
      let poDetailsMap = {};
      if (bbgn.MA_DON_MUA) {
        const resPO = await api.get(`/donmuahang/${bbgn.MA_DON_MUA}`);
        const po = resPO.data;
        po.details.forEach(item => {
          poDetailsMap[item.MA_MAT_HANG.trim()] = item.DON_GIA || 0;
        });
      }

      // KCS Logic
      let kcsData = null;
      try {
        const resKCS = await api.get(`/bien-ban-kiem-nghiem/by-bbgn/${maBBGN}`);
        kcsData = resKCS.data;
      } catch (e) {
        // 404 or error
      }

      for (const item of bbgn.CHI_TIET) {
        let kcsDetail = null;
        if (kcsData && kcsData.CHI_TIET) {
          kcsDetail = kcsData.CHI_TIET.find(k => k.MA_MAT_HANG.trim() === item.MA_MAT_HANG.trim());
        }

        const requiresKcs = (item.CAN_KIEM_NGHIEM === true || item.CAN_KIEM_NGHIEM === 1 || item.CAN_KIEM_NGHIEM === 'Có KCS' || item.CAN_KIEM_NGHIEM === '1');

        if (requiresKcs) {
          if (!kcsData) {
            alert(`Sản phẩm ${item.MA_MAT_HANG} yêu cầu KCS nhưng BBGN này chưa có Phiếu kiểm nghiệm! Vui lòng lập phiếu KCS trước khi nhập kho.`);
            setForm(prev => ({ ...prev, MA_BIEN_BAN_GIAO_NHAN: '', MA_DON_MUA: '', details: [], TONG_TIEN: 0, TONG_SO_LUONG_THEO_CHUNG_TU: 0, TONG_SO_LUONG_THUC_NHAP: 0 }));
            return;
          }
          if (!kcsDetail) {
             alert(`Sản phẩm ${item.MA_MAT_HANG} chưa có trong kết quả Phiếu kiểm nghiệm!`);
             setForm(prev => ({ ...prev, MA_BIEN_BAN_GIAO_NHAN: '', MA_DON_MUA: '', details: [], TONG_TIEN: 0, TONG_SO_LUONG_THEO_CHUNG_TU: 0, TONG_SO_LUONG_THUC_NHAP: 0 }));
             return;
          }
        }

        // Bất kể có yêu cầu KCS hay không, nếu thực tế đã có kết quả KCS thì PHẢI LẤY KẾT QUẢ KCS
        if (kcsDetail) {
          item.SO_LUONG_DAT = kcsDetail.SO_LUONG_DAT; 
        }
      }
      
      // Lấy những hàng đạt (SO_LUONG_DAT > 0) để nhập kho
      const itemsToImport = bbgn.CHI_TIET
        .filter(item => item.SO_LUONG_DAT > 0)
        .map(item => {
          const donGia = poDetailsMap[item.MA_MAT_HANG.trim()] || 0;
          return {
            MA_CHI_TIET_PNK: 'NK' + Math.floor(1000 + Math.random() * 9000),
            MA_MAT_HANG: item.MA_MAT_HANG,
            TEN_MAT_HANG: item.TEN_MAT_HANG || item.MA_MAT_HANG,
            MA_DON_VI_TINH: item.MA_DON_VI_TINH,
            MA_LO_HANG: 'L' + new Date().toISOString().slice(2,10).replace(/-/g,''),
            SO_LUONG_THEO_CHUNG_TU: item.SO_LUONG_DAT,
            SO_LUONG_THUC_NHAP: item.SO_LUONG_DAT, 
            DON_GIA: donGia,
            THANH_TIEN: item.SO_LUONG_DAT * donGia,
            MA_VI_TRI: '', // Người dùng sẽ chọn
            GHI_CHU: ''
          };
        });

      setForm(prev => {
        const sumQty = itemsToImport.reduce((sum, item) => sum + item.SO_LUONG_THUC_NHAP, 0);
        const sumTotal = itemsToImport.reduce((sum, item) => sum + item.THANH_TIEN, 0);
        return {
          ...prev,
          MA_BIEN_BAN_GIAO_NHAN: maBBGN,
          MA_DON_MUA: bbgn.MA_DON_MUA,
          MA_THU_KHO: bbgn.MA_THU_KHO, // Tự động lấy thủ kho từ biên bản
          NGUOI_GIAO: bbgn.NGUOI_GIAO || '',
          details: itemsToImport,
          TONG_SO_LUONG_THEO_CHUNG_TU: sumQty,
          TONG_SO_LUONG_THUC_NHAP: sumQty,
          TONG_TIEN: sumTotal
        };
      });
    } catch (err) {
      alert('Lỗi tải thông tin BBGN: ' + err.message);
    }
  };

  const handleQtyChange = (idx, value) => {
    const qty = parseInt(value) || 0;
    setForm(prev => {
      const details = [...prev.details];
      details[idx].SO_LUONG_THUC_NHAP = qty;
      details[idx].THANH_TIEN = qty * details[idx].DON_GIA;
      
      const sumQty = details.reduce((sum, item) => sum + item.SO_LUONG_THUC_NHAP, 0);
      const sumTotal = details.reduce((sum, item) => sum + item.THANH_TIEN, 0);
      return {
        ...prev,
        details,
        TONG_SO_LUONG_THUC_NHAP: sumQty,
        TONG_TIEN: sumTotal
      };
    });
  };

  const handleDetailChange = (idx, field, value) => {
    setForm(prev => {
      const details = [...prev.details];
      details[idx][field] = value;
      return { ...prev, details };
    });
  };

  const openCreate = () => {
    setForm({
      MA_PHIEU_NHAP_KHO: 'NK' + Math.floor(1000 + Math.random() * 9000),
      MA_BIEN_BAN_GIAO_NHAN: '', MA_DON_MUA: '', MA_KHO: '', MA_THU_KHO: '', NGUOI_GIAO: '',
      NGAY_LAP: new Date().toISOString().split('T')[0],
      TONG_SO_LUONG_THEO_CHUNG_TU: 0, TONG_SO_LUONG_THUC_NHAP: 0, TONG_TIEN: 0,
      GHI_CHU: '', details: []
    });
    setShowModal(true);
  };

  const viewDetail = async (maPhieu) => {
    try {
      const res = await api.get(`/phieunhapkho/${maPhieu}`);
      setSelectedReceipt(res.data);
      setShowDetailModal(true);
    } catch (err) {
      alert('Lỗi tải chi tiết phiếu nhập: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.details.length === 0) return alert('Vui lòng chọn Biên bản giao nhận có mặt hàng cần nhập');
    
    // Kiểm tra xem đã chọn vị trí lưu kho chưa
    const missingLoc = form.details.find(d => !d.MA_VI_TRI);
    if (missingLoc) {
      return alert(`Vui lòng phân bổ vị trí lưu trữ cho mặt hàng ${missingLoc.MA_MAT_HANG}`);
    }

    try {
      await api.post('/phieunhapkho', form);
      alert('Đã lập Phiếu nhập kho thành công!');
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi nhập kho: ' + (err.response?.data?.message || err.response?.data?.error || err.message));
    }
  };

  const filtered = data.filter(item =>
    (item.MA_PHIEU_NHAP_KHO || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.NGUOI_GIAO || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.MA_BIEN_BAN_GIAO_NHAN || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Phiếu nhập kho">
      <div className="page-header">
        <h2>Quản lý Nhập kho</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Lập phiếu nhập kho
        </button>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <Search className="data-table-search-icon" size={14} />
            <input type="text" placeholder="Tìm mã phiếu, mã biên bản..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Tổng số: <strong>{filtered.length}</strong> phiếu nhập</span>
        </div>

        {loading ? (
          <div className="loading-spinner"><Loader2 className="spinner" style={{ color: 'var(--primary)' }} /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <ArrowDownLeft size={40} className="empty-state-icon" />
            <div className="empty-state-text">Chưa có dữ liệu phiếu nhập kho</div>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã phiếu</th><th>Biên bản GN</th><th>Kho hàng</th><th>Thủ kho nhận</th><th>Ngày nhập</th>
                  <th>Người giao</th><th>Thực nhập</th><th>Tổng tiền</th><th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.MA_PHIEU_NHAP_KHO}>
                    <td><strong style={{ color: 'var(--primary)' }}>{item.MA_PHIEU_NHAP_KHO}</strong></td>
                    <td>{item.MA_BIEN_BAN_GIAO_NHAN}</td>
                    <td>{item.TEN_KHO}</td>
                    <td>{item.TEN_THU_KHO}</td>
                    <td>{new Date(item.NGAY_LAP).toLocaleDateString('vi-VN')}</td>
                    <td>{item.NGUOI_GIAO}</td>
                    <td><span style={{ color: 'var(--success)', fontWeight: '600' }}>{item.TONG_SO_LUONG_THUC_NHAP}</span></td>
                    <td><strong>{item.TONG_TIEN?.toLocaleString('vi-VN')}đ</strong></td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => viewDetail(item.MA_PHIEU_NHAP_KHO)} title="Xem chi tiết">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL LẬP PHIẾU NHẬP KHO */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '900px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Lập phiếu nhập kho và Phân bổ vị trí</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ maxHeight: '75vh' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Mã phiếu nhập</label>
                    <input name="MA_PHIEU_NHAP_KHO" value={form.MA_PHIEU_NHAP_KHO} onChange={handleChange} required readOnly className="readonly" />
                  </div>
                  <div className="form-group">
                    <label>Biên bản giao nhận liên kết <span style={{ color: 'red' }}>*</span></label>
                    <select name="MA_BIEN_BAN_GIAO_NHAN" value={form.MA_BIEN_BAN_GIAO_NHAN} onChange={handleSelectBBGN} required>
                      <option value="">-- Chọn Biên bản giao nhận --</option>
                      {bbgns.map(bb => (
                        <option key={bb.MA_BIEN_BAN_GIAO_NHAN} value={bb.MA_BIEN_BAN_GIAO_NHAN}>
                          {bb.MA_BIEN_BAN_GIAO_NHAN} (PO: {bb.MA_DON_MUA || 'N/A'}) - SL đạt: {bb.TONG_SO_LUONG_DAT}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Thủ kho nhận hàng</label>
                    <select name="MA_THU_KHO" value={form.MA_THU_KHO} onChange={handleChange} required>
                      <option value="">-- Chọn thủ kho --</option>
                      {employees.map(e => <option key={e.MA_NHAN_VIEN} value={e.MA_NHAN_VIEN}>{e.HO_TEN}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Kho lưu trữ <span style={{ color: 'red' }}>*</span></label>
                    <select name="MA_KHO" value={form.MA_KHO} onChange={handleChange} required>
                      <option value="">-- Chọn kho lưu trữ chung --</option>
                      {warehouses.map(w => <option key={w.MA_KHO} value={w.MA_KHO}>{w.TEN_KHO}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ngày lập phiếu</label>
                    <input type="date" name="NGAY_LAP" value={form.NGAY_LAP} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Người giao hàng</label>
                    <input name="NGUOI_GIAO" value={form.NGUOI_GIAO} onChange={handleChange} required placeholder="Tên tài xế/Nhà cung cấp" />
                  </div>
                </div>

                {/* DANH SÁCH CHI TIẾT MẶT HÀNG NHẬP */}
                {form.details.length > 0 && (
                  <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
                      <MapPin size={18} style={{ color: 'var(--primary)' }} />
                      <h4 style={{ margin: 0 }}>Phân bổ vị trí lưu kho</h4>
                    </div>
                    <table className="data-table" style={{ fontSize: '12.5px' }}>
                      <thead>
                        <tr>
                          <th>Mã hàng</th>
                          <th>Mã lô (Lot)</th>
                          <th style={{ width: '220px' }}>Vị trí lưu kho <span style={{ color: 'red' }}>*</span></th>
                          <th>SL Đạt (BBGN)</th>
                          <th>Thực nhập</th>
                          <th>Đơn giá</th>
                          <th>Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.details.map((item, idx) => (
                          <tr key={idx}>
                            <td title={item.TEN_MAT_HANG}><strong>{item.MA_MAT_HANG}</strong></td>
                            <td>
                              <input 
                                style={{ padding: '4px 8px', fontSize: '12px', width: '100px' }} 
                                value={item.MA_LO_HANG} 
                                onChange={(e) => handleDetailChange(idx, 'MA_LO_HANG', e.target.value)} 
                                required
                              />
                            </td>
                            <td>
                              <select 
                                value={item.MA_VI_TRI} 
                                onChange={(e) => handleDetailChange(idx, 'MA_VI_TRI', e.target.value)}
                                style={{ fontSize: '12px', padding: '4px', borderColor: !item.MA_VI_TRI ? 'var(--danger)' : 'inherit' }}
                                required
                              >
                                <option value="">-- Chọn vị trí cất --</option>
                                {locations
                                  .filter(l => form.MA_KHO ? l.MA_KHO.trim() === form.MA_KHO.trim() : true)
                                  .map(l => (
                                  <option key={l.MA_VI_TRI} value={l.MA_VI_TRI}>
                                    {[l.KHU, l.DAY, l.KE, l.TANG, l.O].filter(Boolean).join(' - ')}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td style={{ textAlign: 'center' }}>{item.SO_LUONG_THEO_CHUNG_TU}</td>
                            <td>
                              <input 
                                type="number" 
                                min="0" 
                                max={item.SO_LUONG_THEO_CHUNG_TU} 
                                style={{ padding: '4px 8px', width: '70px', fontSize: '12px' }} 
                                value={item.SO_LUONG_THUC_NHAP} 
                                onChange={(e) => handleQtyChange(idx, e.target.value)} 
                                required
                              />
                            </td>
                            <td>{item.DON_GIA.toLocaleString('vi-VN')}đ</td>
                            <td>{item.THANH_TIEN.toLocaleString('vi-VN')}đ</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>
                  Tổng thực nhập: <span style={{ color: 'var(--primary)', fontSize: '16px' }}>{form.TONG_TIEN?.toLocaleString('vi-VN')}đ</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={14} /> Lưu & Phân bổ vị trí
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT PHIẾU NHẬP KHO */}
      {showDetailModal && selectedReceipt && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết phiếu nhập {selectedReceipt.MA_PHIEU_NHAP_KHO}</h3>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', fontSize: '13.5px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px' }}>
                <div>
                  <p><strong>Kho nhận:</strong> {selectedReceipt.TEN_KHO}</p>
                  <p><strong>Thủ kho:</strong> {selectedReceipt.TEN_THU_KHO}</p>
                  <p><strong>Biên bản liên kết:</strong> {selectedReceipt.MA_BIEN_BAN_GIAO_NHAN}</p>
                  <p><strong>Ghi chú:</strong> {selectedReceipt.GHI_CHU || '---'}</p>
                </div>
                <div>
                  <p><strong>Ngày nhập:</strong> {new Date(selectedReceipt.NGAY_LAP).toLocaleDateString('vi-VN')}</p>
                  <p><strong>Người giao:</strong> {selectedReceipt.NGUOI_GIAO}</p>
                  <p><strong>Trạng thái:</strong> <span className="badge badge-success">{selectedReceipt.TRANG_THAI}</span></p>
                </div>
              </div>

              <h4 style={{ fontSize: '13.5px', marginBottom: '8px' }}>Danh sách hàng lưu kho</h4>
              <table className="data-table" style={{ fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th>Mã hàng</th><th>ĐVT</th><th>Mã lô</th><th>Thực nhập</th><th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReceipt.details?.map((detail) => (
                    <tr key={detail.MA_CHI_TIET_PNK}>
                      <td>{detail.MA_MAT_HANG}</td>
                      <td>{detail.MA_DON_VI_TINH}</td>
                      <td><span className="badge badge-info">{detail.MA_LO_HANG}</span></td>
                      <td><strong style={{ color: 'var(--success)' }}>{detail.SO_LUONG_THUC_NHAP}</strong></td>
                      <td>{(detail.SO_LUONG_THUC_NHAP * detail.DON_GIA).toLocaleString('vi-VN')}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default PhieuNhapKho;
