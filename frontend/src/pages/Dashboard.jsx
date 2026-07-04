import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { 
  Package, 
  FileDown, 
  Clock, 
  ArrowUpRight, 
  Zap, 
  XCircle, 
  ShieldAlert, 
  RefreshCw, 
  Hourglass,
  Users,
  Warehouse,
  Layers
} from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, alertsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/canh-bao-ton-kho')
        ]);
        setStats(statsRes.data);
        // Lọc lấy tối đa 3 cảnh báo chưa xử lý hoặc mới nhất
        const activeAlerts = (alertsRes.data || [])
          .filter(a => a.TRANG_THAI_CANH_BAO !== 'Đã xử lý')
          .slice(0, 3);
        setAlerts(activeAlerts);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const recentEntries = [
    { id: 'PNK-2026-105/D1', date: '12/06/2026', supplier: 'Unilever Việt Nam', items: 4, quantity: 37, total: '25,550,000đ' },
    { id: 'PNK-2026-102', date: '10/06/2026', supplier: 'P&G Việt Nam', items: 3, quantity: 25, total: '18,200,000đ' },
    { id: 'PNK-2026-098', date: '08/06/2026', supplier: 'Masan Consumer', items: 5, quantity: 60, total: '42,300,000đ' },
  ];

  return (
    <Layout title="Tổng quan">
      {/* Bento Grid Dashboard Layout - All inside a single grid for perfect vertical alignments */}
      <div className="bento-grid">
        
        {/* Bento Cell 1: Hero Storage Status (Spans 2 columns) */}
        <div className="section-card bento-item bento-span-2 bento-hero-card" style={{ marginBottom: 0 }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '8px' }}>
              Trạng thái Kho vận & Danh mục
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', maxWidth: '500px' }}>
              Hệ thống quản lý thông tin danh mục mặt hàng, kho bãi và nhà cung cấp hoạt động ổn định.
            </p>
          </div>
          
          <div className="bento-hero-stats">
            <div className="bento-hero-stat-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Mặt hàng</span>
                <Package size={15} style={{ color: 'var(--primary)' }} />
              </div>
              {loading ? (
                <div className="skeleton skeleton-text" style={{ height: '24px', width: '50px' }} />
              ) : (
                <div style={{ fontSize: '24px', fontWeight: '800' }}>{stats?.totalMatHang}</div>
              )}
            </div>

            <div className="bento-hero-stat-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Nhân viên</span>
                <Users size={15} style={{ color: 'var(--success)' }} />
              </div>
              {loading ? (
                <div className="skeleton skeleton-text" style={{ height: '24px', width: '50px' }} />
              ) : (
                <div style={{ fontSize: '24px', fontWeight: '800' }}>{stats?.totalNhanVien}</div>
              )}
            </div>

            <div className="bento-hero-stat-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Kho & NCC</span>
                <Warehouse size={15} style={{ color: 'var(--warning)' }} />
              </div>
              {loading ? (
                <div className="skeleton skeleton-text" style={{ height: '24px', width: '50px' }} />
              ) : (
                <div style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span>{stats?.totalKho}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>Kho</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>/</span>
                  <span>{stats?.totalNhaCungCap}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>NCC</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bento Cell 2: Today's Inward Activity (Spans 1 column) */}
        <div className="stat-card bento-item" style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Phiếu nhập & PO</span>
            <div className="stat-card-icon-wrapper" style={{ background: 'var(--success-light)', color: 'var(--success)', width: '32px', height: '32px', borderRadius: '6px' }}>
              <FileDown size={15} />
            </div>
          </div>
          <div>
            {loading ? (
              <div className="skeleton skeleton-text" style={{ height: '28px', width: '60px', marginBottom: '6px' }} />
            ) : (
              <div style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-1px' }}>
                {stats?.totalPhieuNhapKho} <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--text-secondary)' }}>phiếu</span>
              </div>
            )}
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Đã tạo <strong>{stats?.totalDonMuaHang || '...'}</strong> Đơn mua hàng (PO)
            </div>
          </div>
        </div>

        {/* Bento Cell 3: Alerts List (Spans 2 columns) */}
        <div className="section-card bento-span-2" style={{ marginBottom: 0 }}>
          <div className="section-card-header">
            <h3><Zap size={15} /> Cảnh báo cần xử lý</h3>
            <button className="btn btn-sm btn-secondary" onClick={() => navigate('/canhbaoxacminh')}>Xem tất cả</button>
          </div>
          <div className="section-card-body" style={{ padding: '14px' }}>
            <div className="alert-list">
              {alerts.length === 0 ? (
                <div style={{ padding: '12px 6px', fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  Không có cảnh báo tồn kho nào cần xử lý.
                </div>
              ) : (
                alerts.map((alert, idx) => {
                  const alertType = alert.MUC_DO_UU_TIEN === 'Cao' ? 'critical' : 'warning';
                  const titleStr = `${alert.TEN_MAT_HANG || 'Mặt hàng'} (${alert.MA_CANH_BAO.trim()})`;
                  const descStr = `${alert.LOAI_CANH_BAO || 'Cảnh báo'}: ${alert.MO_TA || 'Yêu cầu kiểm tra đối chiếu tồn thực tế'} (Trạng thái: ${alert.TRANG_THAI_CANH_BAO})`;
                  const timeStr = alert.THOI_DIEM_PHAT_SINH ? new Date(alert.THOI_DIEM_PHAT_SINH).toLocaleDateString('vi-VN') : 'Mới';
                  return (
                    <div className={`alert-item ${alertType}`} key={idx}>
                      <div className="alert-item-dot" />
                      <div className="alert-item-content">
                        <div className="alert-item-title">{titleStr}</div>
                        <div className="alert-item-desc">{descStr}</div>
                      </div>
                      <div className="alert-item-time" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={10} />
                        {timeStr}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Bento Cell 4: Operational Warning Cards Grid (Spans 1 column) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="stat-card warning">
            <div className="stat-card-icon-wrapper">
              <Hourglass size={18} />
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">12</div>
              <div className="stat-card-label">Hàng cận hạn</div>
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-card-icon-wrapper">
              <XCircle size={18} />
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">5</div>
              <div className="stat-card-label">Hàng lỗi/hỏng</div>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-card-icon-wrapper">
              <ShieldAlert size={18} />
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">3</div>
              <div className="stat-card-label">Đang cách ly</div>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-card-icon-wrapper">
              <RefreshCw size={18} />
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">2</div>
              <div className="stat-card-label">Chờ trả NCC</div>
            </div>
          </div>
        </div>

        {/* Bento Cell 5: Recent inward entries table (Spans all 3 columns) */}
        <div className="section-card bento-span-3" style={{ marginBottom: 0 }}>
          <div className="section-card-header">
            <h3><Layers size={15} /> Phiếu nhập kho gần đây</h3>
            <button className="btn btn-sm btn-secondary">Xem tất cả</button>
          </div>
          <div className="section-card-body" style={{ padding: '0' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã phiếu</th>
                  <th>Ngày</th>
                  <th>Nhà cung cấp</th>
                  <th>Số lượng mặt hàng</th>
                  <th>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {recentEntries.map((entry, idx) => (
                  <tr key={idx}>
                    <td>
                      <span style={{ color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {entry.id}
                        <ArrowUpRight size={11} />
                      </span>
                    </td>
                    <td>{entry.date}</td>
                    <td>{entry.supplier}</td>
                    <td>{entry.quantity}</td>
                    <td><strong>{entry.total}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;
