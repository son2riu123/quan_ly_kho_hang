import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { 
  Search, 
  Layers, 
  Warehouse, 
  TrendingUp, 
  MapPin, 
  Loader2 
} from 'lucide-react';

function TonKho() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' or 'details'
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [detailsRes, summaryRes] = await Promise.all([
        api.get('/tonkho'),
        api.get('/tonkho/summary')
      ]);
      setData(detailsRes.data);
      setSummary(summaryRes.data);
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

  const filteredDetails = data.filter(item =>
    (item.TEN_MAT_HANG || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.MA_MAT_HANG || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.MA_LO_HANG || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.MA_VI_TRI || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Tồn kho">
      <div className="page-header">
        <h2>Thống kê Tồn kho thực tế</h2>
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
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <Search className="data-table-search-icon" size={14} />
            <input 
              type="text" 
              placeholder={activeTab === 'summary' ? "Tìm theo tên hoặc mã sản phẩm..." : "Tìm theo tên, lô hoặc mã vị trí..."}
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Tổng số dòng: <strong>{activeTab === 'summary' ? filteredSummary.length : filteredDetails.length}</strong>
          </span>
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
                  <th>Tổng tồn thực tế</th><th>Số lượng lô</th><th>Số vị trí lưu trữ</th>
                </tr>
              </thead>
              <tbody>
                {filteredSummary.map((item) => (
                  <tr key={item.MA_MAT_HANG}>
                    <td><strong style={{ color: 'var(--primary)' }}>{item.MA_MAT_HANG}</strong></td>
                    <td>{item.TEN_MAT_HANG}</td>
                    <td><span className="badge badge-info">{item.NHOM_HANG}</span></td>
                    <td><strong style={{ color: item.TONG_SO_LUONG > 10 ? 'var(--text-main)' : 'var(--danger)' }}>{item.TONG_SO_LUONG}</strong></td>
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
                {filteredDetails.map((item) => (
                  <tr key={item.MA_TON_VI_TRI}>
                    <td><strong style={{ color: 'var(--primary)' }}>{item.MA_MAT_HANG}</strong></td>
                    <td>{item.TEN_MAT_HANG}</td>
                    <td><span className="badge badge-info">{item.MA_LO_HANG}</span></td>
                    <td>{item.TEN_KHO}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} style={{ color: 'var(--text-secondary)' }} />
                        {`Khu ${item.KHU} - Dãy ${item.DAY} - Kệ ${item.KE} - Tầng ${item.TANG} - Ô ${item.O}`}
                      </span>
                    </td>
                    <td><strong style={{ color: 'var(--primary)' }}>{item.SO_LUONG}</strong></td>
                    <td>{new Date(item.NGAY_CAP_NHAT_GAN_NHAT).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <span className={`badge ${item.TRANG_THAI_TON === 'Bình thường' ? 'badge-success' : 'badge-warning'}`}>
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
