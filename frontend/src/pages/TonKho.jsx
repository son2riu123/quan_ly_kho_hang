import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { 
  Search, 
  Layers, 
  Warehouse, 
  TrendingUp, 
  MapPin, 
  Loader2,
  Download,
  Filter
} from 'lucide-react';

function TonKho() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' or 'details'
  
  // Basic search
  const [search, setSearch] = useState('');
  
  // Advanced filters
  const [filterKho, setFilterKho] = useState('');
  const [filterViTri, setFilterViTri] = useState('');
  const [filterLo, setFilterLo] = useState('');
  const [filterTrangThai, setFilterTrangThai] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [detailsRes, summaryRes, khoRes] = await Promise.all([
        api.get('/tonkho').catch(() => ({ data: [] })),
        api.get('/tonkho/summary').catch(() => ({ data: [] })),
        api.get('/kho').catch(() => ({ data: [] }))
      ]);
      setData(detailsRes.data);
      setSummary(summaryRes.data);
      setWarehouses(khoRes.data);
    } catch (err) {
      console.error(err);
      setData([]);
      setSummary([]);
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

  const filteredSummary = summary.filter(item =>
    (item.TEN_MAT_HANG || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.MA_MAT_HANG || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredDetails = data.filter(item => {
    const matchSearch = 
      (item.TEN_MAT_HANG || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.MA_MAT_HANG || '').toLowerCase().includes(search.toLowerCase());
      
    const matchKho = filterKho ? (item.MA_KHO || '').trim() === (filterKho || '').trim() || item.TEN_KHO === filterKho : true;
    const matchViTri = filterViTri ? 
      (item.MA_VI_TRI || '').toLowerCase().includes(filterViTri.toLowerCase()) ||
      ([item.KHU, item.DAY, item.KE, item.TANG, item.O].filter(Boolean).join(' - ')).toLowerCase().includes(filterViTri.toLowerCase())
      : true;
    const matchLo = filterLo ? (item.MA_LO_HANG || '').toLowerCase().includes(filterLo.toLowerCase()) : true;
    const matchTrangThai = filterTrangThai ? item.TRANG_THAI_TON === filterTrangThai : true;

    return matchSearch && matchKho && matchViTri && matchLo && matchTrangThai;
  });

  const handleExportCSV = () => {
    const exportData = activeTab === 'summary' ? filteredSummary : filteredDetails;
    if (exportData.length === 0) {
      alert('Không có dữ liệu để xuất!');
      return;
    }

    let csvContent = '\uFEFF'; // BOM for UTF-8
    let headers = [];
    
    if (activeTab === 'summary') {
      headers = ['Mã sản phẩm', 'Tên sản phẩm', 'Nhóm hàng', 'Tồn vật lý', 'Tồn khả dụng', 'Số lượng lô', 'Số vị trí lưu trữ'];
      csvContent += headers.join(',') + '\n';
      exportData.forEach(row => {
        csvContent += `${row.MA_MAT_HANG},"${row.TEN_MAT_HANG || ''}","${row.NHOM_HANG || ''}",${row.TONG_SO_LUONG || 0},${row.TON_KHA_DUNG || 0},${row.SO_LU_ONG_LO || 0},${row.SO_VI_TRI || 0}\n`;
      });
    } else {
      headers = ['Mã sản phẩm', 'Tên sản phẩm', 'Mã lô hàng', 'Kho hàng', 'Mã Vị trí', 'Vị trí chi tiết', 'Số lượng tồn', 'Trạng thái', 'Cập nhật lần cuối'];
      csvContent += headers.join(',') + '\n';
      exportData.forEach(row => {
        const viTriText = [row.KHU, row.DAY, row.KE, row.TANG, row.O].filter(Boolean).join(' - ');
        const dateText = row.NGAY_CAP_NHAT_GAN_NHAT ? new Date(row.NGAY_CAP_NHAT_GAN_NHAT).toLocaleDateString('vi-VN') : '';
        csvContent += `${row.MA_MAT_HANG},"${row.TEN_MAT_HANG || ''}","${row.MA_LO_HANG || ''}","${row.TEN_KHO || ''}",${row.MA_VI_TRI || ''},"${viTriText}",${row.SO_LUONG || 0},"${row.TRANG_THAI_TON || ''}",${dateText}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `BaoCao_TonKho_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout title="Tồn kho">
      <div className="page-header">
        <h2>Tra cứu Tồn kho và Biến động</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn ${activeTab === 'summary' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('summary')}
          >
            Tổng hợp sản phẩm
          </button>
          <button 
            className={`btn ${activeTab === 'details' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('details')}
          >
            Chi tiết theo vị trí
          </button>
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar" style={{ flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <div className="data-table-search" style={{ flex: 1, minWidth: '300px' }}>
            <Search className="data-table-search-icon" size={14} />
            <input 
              type="text" 
              placeholder={activeTab === 'summary' ? "Tìm theo tên hoặc mã sản phẩm..." : "Tìm theo tên hoặc mã sản phẩm..."}
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
          
          {activeTab === 'details' && (
            <button 
              className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`} 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={14} style={{ marginRight: 4 }} /> Bộ lọc
            </button>
          )}

          <button className="btn btn-secondary" onClick={handleExportCSV} style={{ color: 'var(--success)', borderColor: 'var(--success)' }}>
            <Download size={14} style={{ marginRight: 4 }} /> Xuất Excel
          </button>
        </div>

        {/* ADVANCED FILTERS SECTION */}
        {activeTab === 'details' && showFilters && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', padding: '16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>Kho hàng</label>
              <select className="number-input" style={{ width: '100%', padding: '6px' }} value={filterKho} onChange={e => setFilterKho(e.target.value)}>
                <option value="">Tất cả kho</option>
                {warehouses.map(k => <option key={k.MA_KHO} value={k.MA_KHO}>{k.TEN_KHO}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>Vị trí lưu kho (Khu/Kệ)</label>
              <input type="text" className="number-input" style={{ width: '100%', padding: '6px' }} placeholder="VD: Khu A, Kệ 1..." value={filterViTri} onChange={e => setFilterViTri(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>Số lô (Lot)</label>
              <input type="text" className="number-input" style={{ width: '100%', padding: '6px' }} placeholder="Nhập mã lô..." value={filterLo} onChange={e => setFilterLo(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>Trạng thái hàng</label>
              <select className="number-input" style={{ width: '100%', padding: '6px' }} value={filterTrangThai} onChange={e => setFilterTrangThai(e.target.value)}>
                <option value="">Tất cả trạng thái</option>
                <option value="Bình thường">Bình thường</option>
                <option value="Cách ly">Cách ly</option>
                <option value="Hết hạn">Hết hạn</option>
                <option value="Chờ xử lý">Chờ xử lý</option>
              </select>
            </div>
          </div>
        )}

        <div style={{ padding: '8px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Tổng số dòng: <strong>{activeTab === 'summary' ? filteredSummary.length : filteredDetails.length}</strong>
        </div>

        {loading ? (
          <div className="loading-spinner"><Loader2 className="spinner" style={{ color: 'var(--primary)' }} /></div>
        ) : (activeTab === 'summary' ? filteredSummary.length : filteredDetails.length) === 0 ? (
          <div className="empty-state">
            <TrendingUp size={40} className="empty-state-icon" />
            <div className="empty-state-text">Không tìm thấy dữ liệu tồn kho phù hợp</div>
          </div>
        ) : activeTab === 'summary' ? (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã sản phẩm</th><th>Tên sản phẩm</th><th>Nhóm hàng</th>
                  <th>Tồn vật lý</th><th>Tồn khả dụng</th><th>Số lượng lô</th><th>Số vị trí lưu trữ</th>
                </tr>
              </thead>
              <tbody>
                {filteredSummary.map((item) => (
                  <tr key={item.MA_MAT_HANG}>
                    <td><strong style={{ color: 'var(--primary)' }}>{item.MA_MAT_HANG}</strong></td>
                    <td>{item.TEN_MAT_HANG}</td>
                    <td><span className="badge badge-info">{item.NHOM_HANG}</span></td>
                    <td><strong style={{ color: 'var(--text-secondary)' }}>{item.TONG_SO_LUONG}</strong></td>
                    <td><strong style={{ color: item.TON_KHA_DUNG > 10 ? 'var(--success)' : 'var(--danger)' }}>{item.TON_KHA_DUNG}</strong></td>
                    <td>{item.SO_LU_ONG_LO}</td>
                    <td>{item.SO_VI_TRI} vị trí</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã sản phẩm</th><th>Tên sản phẩm</th><th>Mã lô hàng</th><th>Kho hàng</th>
                  <th>Vị trí chi tiết</th><th>Số lượng tồn</th><th>Ngày cập nhật</th><th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredDetails.map((item, idx) => (
                  <tr key={idx}>
                    <td><strong style={{ color: 'var(--primary)' }}>{item.MA_MAT_HANG}</strong></td>
                    <td>{item.TEN_MAT_HANG}</td>
                    <td><span className="badge badge-info">{item.MA_LO_HANG}</span></td>
                    <td>{item.TEN_KHO}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} style={{ color: 'var(--text-secondary)' }} />
                        {[item.KHU, item.DAY, item.KE, item.TANG, item.O].filter(Boolean).join(' - ')}
                      </span>
                    </td>
                    <td><strong style={{ color: 'var(--primary)' }}>{item.SO_LUONG}</strong></td>
                    <td>{new Date(item.NGAY_CAP_NHAT_GAN_NHAT).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <span className={`badge ${
                        item.TRANG_THAI_TON === 'Bình thường' ? 'badge-success' : 
                        item.TRANG_THAI_TON === 'Cách ly' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {item.TRANG_THAI_TON}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default TonKho;
