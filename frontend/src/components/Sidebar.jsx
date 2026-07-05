import { NavLink } from 'react-router-dom';
import authService from '../services/authService';
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
  ClipboardCheck,
  ShieldCheck,
  FileText,
  Settings,
  ShieldAlert,
  AlertTriangle,
  ShoppingCart
} from 'lucide-react';

// Khai báo menu kèm theo danh sách vai trò (roles) được quyền nhìn thấy
const menuItems = [
  {
    section: 'Tổng quan',
    items: [
      { path: '/', icon: LayoutGrid, label: 'Dashboard', roles: ['Quản lý kho', 'Ban giám đốc', 'Kế toán kho', 'Thủ kho', 'Nhân viên KCS', 'Nhân viên mua hàng'] },
    ]
  },
  {
    section: 'Danh mục',
    items: [
      { path: '/nhanvien', icon: UserCheck, label: 'Nhân viên', roles: ['Quản lý kho', 'Ban giám đốc'] },
      { path: '/nhacungcap', icon: Truck, label: 'Nhà cung cấp', roles: ['Quản lý kho', 'Ban giám đốc'] },
      { path: '/kho', icon: Warehouse, label: 'Kho hàng', roles: ['Quản lý kho', 'Ban giám đốc'] },
      { path: '/mathang', icon: Box, label: 'Mặt hàng', roles: ['Quản lý kho', 'Ban giám đốc', 'Thủ kho'] },
    ]
  },
  {
    section: 'Nghiệp vụ nhập',
    items: [
      { path: '/yeucaumuabosung', icon: ShoppingCart, label: 'Yêu cầu mua sắm', roles: ['Quản lý kho', 'Ban giám đốc', 'Nhân viên mua hàng'] },
      { path: '/donmuahang', icon: FilePlus, label: 'Đơn mua hàng', roles: ['Quản lý kho', 'Ban giám đốc', 'Nhân viên mua hàng'] },
      { path: '/bienbangiaonhan', icon: ClipboardCheck, label: 'Biên bản giao nhận', roles: ['Quản lý kho', 'Thủ kho', 'Kế toán kho'] },
      { path: '/phieunhapkho', icon: ArrowDownToLine, label: 'Phiếu nhập kho', roles: ['Quản lý kho', 'Thủ kho', 'Kế toán kho'] },
      { path: '/kiemnghiem', icon: ShieldCheck, label: 'Kiểm nghiệm KCS', roles: ['Quản lý kho', 'Ban giám đốc', 'Nhân viên KCS'] },
      { path: '/thekho', icon: Database, label: 'Thẻ kho', roles: ['Quản lý kho', 'Thủ kho', 'Kế toán kho', 'Ban giám đốc'] },
    ]
  },
  {
    section: 'Tồn kho',
    items: [
      { path: '/tonkho', icon: BarChart3, label: 'Tồn kho', roles: ['Quản lý kho', 'Thủ kho', 'Kế toán kho', 'Ban giám đốc'] },
      { path: '/vitrikho', icon: Navigation, label: 'Vị trí kho', roles: ['Quản lý kho', 'Thủ kho', 'Kế toán kho'] },
      { path: '/kiemke', icon: ClipboardCheck, label: 'Kiểm kê', roles: ['Quản lý kho', 'Thủ kho'] },
      { path: '/canhbaoxacminh', icon: ShieldAlert, label: 'Cảnh báo & Xác minh', roles: ['Quản lý kho', 'Thủ kho', 'Ban giám đốc'] },
      { path: '/xulysailech', icon: AlertTriangle, label: 'Xử lý sai lệch', roles: ['Quản lý kho', 'Thủ kho', 'Ban giám đốc'] },
      { path: '/xulyhangloi', icon: ShieldAlert, label: 'Xử lý hàng lỗi', roles: ['Quản lý kho', 'Thủ kho', 'Ban giám đốc'] },
      { path: '/baocao', icon: FileText, label: 'Báo cáo tổng hợp', roles: ['Quản lý kho', 'Ban giám đốc', 'Kế toán kho'] },
    ]
  },
  {
    section: 'Cấu hình',
    items: [
      { path: '/caidat', icon: Settings, label: 'Cài đặt hệ thống', roles: ['Quản lý kho', 'Ban giám đốc'] },
      { path: '/cauhinhdinhmuc', icon: Settings, label: 'Cấu hình định mức', roles: ['Quản lý kho', 'Ban giám đốc'] },
    ]
  }
];

function Sidebar({ isOpen, onClose }) {
  const currentUser = authService.getCurrentUser();
  const userRole = currentUser ? currentUser.chucVu : '';

  // Lọc menu theo vai trò người dùng
  const visibleMenu = menuItems.map(section => {
    return {
      ...section,
      items: section.items.filter(item => item.roles.includes(userRole))
    };
  }).filter(section => section.items.length > 0);

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
          {visibleMenu.map((section, idx) => (
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
