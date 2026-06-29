import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, 
  UserCheck, 
  Truck, 
  Warehouse, 
  Box, 
  FilePlus, 
  ArrowDownToLine, 
  Database, 
  BarChart3, 
  Navigation, 
  ClipboardCheck 
} from 'lucide-react';

const menuItems = [
  {
    section: 'Tổng quan',
    items: [
      { path: '/', icon: LayoutGrid, label: 'Dashboard' },
    ]
  },
  {
    section: 'Danh mục',
    items: [
      { path: '/nhanvien', icon: UserCheck, label: 'Nhân viên' },
      { path: '/nhacungcap', icon: Truck, label: 'Nhà cung cấp' },
      { path: '/kho', icon: Warehouse, label: 'Kho hàng' },
      { path: '/mathang', icon: Box, label: 'Mặt hàng' },
    ]
  },
  {
    section: 'Nghiệp vụ nhập',
    items: [
      { path: '/donmuahang', icon: FilePlus, label: 'Đơn mua hàng' },
      { path: '/phieunhapkho', icon: ArrowDownToLine, label: 'Phiếu nhập kho' },
      { path: '/thekho', icon: Database, label: 'Thẻ kho' },
    ]
  },
  {
    section: 'Tồn kho',
    items: [
      { path: '/tonkho', icon: BarChart3, label: 'Tồn kho' },
      { path: '/vitrikho', icon: Navigation, label: 'Vị trí kho' },
      { path: '/kiemke', icon: ClipboardCheck, label: 'Kiểm kê' },
    ]
  },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div 
        className={`sidebar-mobile-overlay ${isOpen ? 'show' : ''}`} 
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">KH</div>
          <div className="sidebar-brand-text">
            <h2>QL Kho hàng</h2>
            <span>Hệ thống quản lý</span>
          </div>
        </div>

        <div className="sidebar-menu">
          {menuItems.map((section, idx) => (
            <div key={idx} style={{ marginBottom: '12px' }}>
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
                      onClick={onClose}
                    >
                      <IconComponent className="sidebar-link-icon" size={18} strokeWidth={1.6} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
