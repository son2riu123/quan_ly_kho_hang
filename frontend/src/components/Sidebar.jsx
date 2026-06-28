import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Factory, 
  Warehouse, 
  Package, 
  ClipboardList, 
  FileDown, 
  Layers, 
  TrendingUp, 
  MapPin, 
  CheckSquare 
} from 'lucide-react';

const menuItems = [
  {
    section: 'Tổng quan',
    items: [
      { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    ]
  },
  {
    section: 'Danh mục',
    items: [
      { path: '/nhanvien', icon: Users, label: 'Nhân viên' },
      { path: '/nhacungcap', icon: Factory, label: 'Nhà cung cấp' },
      { path: '/kho', icon: Warehouse, label: 'Kho' },
      { path: '/mathang', icon: Package, label: 'Mặt hàng' },
    ]
  },
  {
    section: 'Nghiệp vụ nhập hàng',
    items: [
      { path: '/donmuahang', icon: ClipboardList, label: 'Đơn mua hàng (PO)' },
      { path: '/phieunhapkho', icon: FileDown, label: 'Phiếu nhập kho' },
      { path: '/thekho', icon: Layers, label: 'Thẻ kho' },
    ]
  },
  {
    section: 'Tồn kho',
    items: [
      { path: '/tonkho', icon: TrendingUp, label: 'Tồn kho' },
      { path: '/vitrikho', icon: MapPin, label: 'Vị trí kho' },
      { path: '/kiemke', icon: CheckSquare, label: 'Kiểm kê' },
    ]
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Warehouse size={18} />
        </div>
        <div className="sidebar-brand-text">
          <h2>QL Kho hàng</h2>
          <span>Hệ thống quản lý</span>
        </div>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '16px' }}>
            <div className="sidebar-section-title">{section.section}</div>
            <nav className="sidebar-nav">
              {section.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    end={item.path === '/'}
                  >
                    <IconComponent className="sidebar-link-icon" size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
