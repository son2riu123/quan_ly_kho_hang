import Layout from '../components/Layout';
import { 
  Package, 
  FileDown, 
  AlertTriangle, 
  ShieldAlert, 
  Lock, 
  RefreshCw,
  Clock,
  ArrowUpRight
} from 'lucide-react';

function Dashboard() {
  const stats = [
    { label: 'Tổng mặt hàng', value: '156', icon: Package, type: 'info' },
    { label: 'Phiếu nhập hôm nay', value: '8', icon: FileDown, type: 'success' },
    { label: 'Hàng gần hết hạn', value: '12', icon: AlertTriangle, type: 'warning' },
    { label: 'Hàng lỗi/hỏng', value: '5', icon: ShieldAlert, type: 'danger' },
    { label: 'Đang cách ly', value: '3', icon: Lock, type: 'warning' },
    { label: 'Chờ trả NCC', value: '2', icon: RefreshCw, type: 'info' },
  ];

  const alerts = [
    {
      type: 'critical',
      title: 'Dầu gội Clear Bạc Hà - Lô LH003',
      desc: '3 thùng bị va đập gây hỏng vỡ bao bì',
      time: '2 giờ trước',
    },
    {
      type: 'warning',
      title: 'Nước rửa chén Sunlight Chanh - Lô LH002',
      desc: '2 thùng rách bao bì do máy cắt, chờ trả NCC',
      time: '5 giờ trước',
    },
    {
      type: 'warning',
      title: 'Bột giặt OMO Comfort - Lô LH007',
      desc: 'Hạn sử dụng còn 15 ngày, cần xử lý ưu tiên',
      time: '1 ngày trước',
    },
    {
      type: 'info',
      title: 'Đơn PO-TD2026-88 - Đợt 2',
      desc: 'Dự kiến giao hàng ngày 14/06/2026, 40 thùng',
      time: '2 ngày trước',
    },
  ];

  const recentEntries = [
    { id: 'PNK-2026-105/D1', date: '12/06/2026', supplier: 'Unilever Việt Nam', items: 4, quantity: 37, total: '25,550,000đ' },
    { id: 'PNK-2026-102', date: '10/06/2026', supplier: 'P&G Việt Nam', items: 3, quantity: 25, total: '18,200,000đ' },
    { id: 'PNK-2026-098', date: '08/06/2026', supplier: 'Masan Consumer', items: 5, quantity: 60, total: '42,300,000đ' },
  ];

  return (
    <Layout title="Tổng quan">
      <div className="dashboard-stats">
        {stats.map((stat, idx) => {
          const IconComp = stat.icon;
          return (
            <div className={`stat-card ${stat.type}`} key={idx}>
              <div className="stat-card-icon-wrapper">
                <IconComp size={20} />
              </div>
              <div className="stat-card-info">
                <div className="stat-card-value">{stat.value}</div>
                <div className="stat-card-label">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="section-card">
          <div className="section-card-header">
            <h3>⚡ Cảnh báo cần xử lý</h3>
            <button className="btn btn-sm btn-secondary">Xem chi tiết</button>
          </div>
          <div className="section-card-body" style={{ padding: '16px' }}>
            <div className="alert-list">
              {alerts.map((alert, idx) => (
                <div className={`alert-item ${alert.type}`} key={idx}>
                  <div className="alert-item-icon">
                    <ShieldAlert size={16} />
                  </div>
                  <div className="alert-item-content">
                    <div className="alert-item-title">{alert.title}</div>
                    <div className="alert-item-desc">{alert.desc}</div>
                  </div>
                  <div className="alert-item-time" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    {alert.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section-card">
          <div className="section-card-header">
            <h3>📥 Phiếu nhập kho gần đây</h3>
            <button className="btn btn-sm btn-secondary">Xem tất cả</button>
          </div>
          <div className="section-card-body" style={{ padding: '0' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã phiếu</th>
                  <th>Ngày</th>
                  <th>NCC</th>
                  <th>SL</th>
                  <th>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {recentEntries.map((entry, idx) => (
                  <tr key={idx}>
                    <td>
                      <span style={{ color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {entry.id}
                        <ArrowUpRight size={12} />
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
