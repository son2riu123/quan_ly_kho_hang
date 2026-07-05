import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Menu } from 'lucide-react';
import authService from '../services/authService';

const FEATURES = [
  { name: 'Tổng quan (Dashboard)', path: '/', roles: [], keywords: ['dashboard', 'tong quan', 'bieu do', 'thong ke'] },
  { name: 'Quản lý Nhân viên', path: '/nhanvien', roles: ['Quản lý kho', 'Ban giám đốc'], keywords: ['nhan vien', 'employee', 'chuc vu', 'nguoi dung', 'nhan su'] },
  { name: 'Quản lý Nhà cung cấp', path: '/nhacungcap', roles: ['Quản lý kho', 'Ban giám đốc'], keywords: ['nha cung cap', 'ncc', 'provider', 'supplier', 'doi tac'] },
  { name: 'Quản lý Kho bãi', path: '/kho', roles: ['Quản lý kho', 'Ban giám đốc'], keywords: ['kho hang', 'kho bai', 'warehouse', 'danh sach kho'] },
  { name: 'Quản lý Mặt hàng', path: '/mathang', roles: ['Quản lý kho', 'Ban giám đốc', 'Thủ kho'], keywords: ['mat hang', 'san pham', 'hang hoa', 'product', 'item'] },
  { name: 'Đơn mua hàng (PO)', path: '/donmuahang', roles: ['Quản lý kho', 'Ban giám đốc', 'Nhân viên mua hàng'], keywords: ['don mua hang', 'po', 'purchase order', 'dat hang', 'mua sam'] },
  { name: 'Biên bản giao nhận', path: '/bienbangiaonhan', roles: ['Quản lý kho', 'Thủ kho', 'Kế toán kho'], keywords: ['bien ban', 'giao nhan', 'bbgn', 'doi chieu', 'kiem hang'] },
  { name: 'Phiếu nhập kho', path: '/phieunhapkho', roles: ['Quản lý kho', 'Thủ kho', 'Kế toán kho'], keywords: ['phieu nhap', 'nhap kho', 'nhap hang', 'grn'] },
  { name: 'Vị trí kho lưu trữ', path: '/vitrikho', roles: ['Quản lý kho', 'Thủ kho', 'Kế toán kho'], keywords: ['vi tri', 'location', 'khu', 'day', 'ke'] },
  { name: 'Tồn kho theo vị trí', path: '/tonkho', roles: ['Quản lý kho', 'Thủ kho', 'Kế toán kho', 'Ban giám đốc'], keywords: ['ton kho', 'ton theo vi tri', 'so luong ton', 'stock'] },
  { name: 'Thẻ kho & Biến động', path: '/thekho', roles: ['Quản lý kho', 'Thủ kho', 'Kế toán kho', 'Ban giám đốc'], keywords: ['the kho', 'bien dong', 'nhat ky', 'lich su ton'] },
  { name: 'Đợt & Phiếu Kiểm kê', path: '/kiemke', roles: ['Quản lý kho', 'Thủ kho'], keywords: ['kiem ke', 'kiem kho', 'doi soat', 'dot kiem ke', 'audit'] },
  { name: 'Kiểm nghiệm chất lượng (KCS)', path: '/kiemnghiem', roles: ['Quản lý kho', 'Ban giám đốc', 'Nhân viên KCS'], keywords: ['kiem nghiem', 'kcs', 'chat luong', 'dat', 'khong dat'] },
  { name: 'Cảnh báo & Xác minh sai lệch', path: '/canhbaoxacminh', roles: ['Quản lý kho', 'Ban giám đốc', 'Thủ kho'], keywords: ['canh bao', 'xac minh', 'sai lech', 'xu ly', 'ho so'] },
  { name: 'Báo cáo & Thống kê động', path: '/baocao', roles: ['Quản lý kho', 'Ban giám đốc', 'Kế toán kho'], keywords: ['bao cao', 'thong ke', 'excel', 'chart', 'report'] },
  { name: 'Cài đặt hệ thống', path: '/caidat', roles: ['Quản lý kho', 'Ban giám đốc'], keywords: ['cai dat', 'setting', 'cau hinh', 'he thong'] }
];

function Header({ title, onToggleSidebar }) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const currentUser = authService.getCurrentUser();
  const displayName = currentUser ? currentUser.hoTen : 'Chưa đăng nhập';
  const displayRole = currentUser ? currentUser.chucVu : '';

  useEffect(() => {
    setSearchQuery('');
    setShowResults(false);
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
  }, [title]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Click outside listener to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const filteredFeatures = searchQuery ? FEATURES.filter(f => {
    const hasRoleAccess = f.roles.length === 0 || f.roles.includes(displayRole);
    if (!hasRoleAccess) return false;

    const q = searchQuery.toLowerCase();
    return f.name.toLowerCase().includes(q) || f.keywords.some(k => k.includes(q));
  }) : [];

  const handleNavigate = (path) => {
    navigate(path);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleKeyDown = (e) => {
    if (filteredFeatures.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredFeatures.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredFeatures.length) % filteredFeatures.length);
    } else if (e.key === 'Enter') {
      if (filteredFeatures[selectedIndex]) {
        e.preventDefault();
        handleNavigate(filteredFeatures[selectedIndex].path);
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="sidebar-mobile-toggle" onClick={onToggleSidebar} style={{ position: 'static', display: 'none' }}>
          <Menu size={18} />
        </button>
        <h1>{title}</h1>
      </div>
      <div className="header-right">
        {/* Quick Features Navigation Search */}
        <div className="header-search" ref={searchContainerRef} style={{ position: 'relative' }}>
          <Search className="header-search-icon" size={14} />
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Tìm chức năng nhanh..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
              setSelectedIndex(0);
            }}
            onFocus={() => setShowResults(true)}
            onKeyDown={handleKeyDown}
          />
          {showResults && filteredFeatures.length > 0 && (
            <div className="header-search-dropdown" style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 1000,
              maxHeight: '260px',
              overflowY: 'auto',
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              width: '260px'
            }}>
              <div style={{ padding: '4px 8px', fontSize: '10.5px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', marginBottom: '4px', fontWeight: 650 }}>
                KẾT QUẢ CHỨC NĂNG ({filteredFeatures.length})
              </div>
              {filteredFeatures.map((item, idx) => (
                <div 
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  style={{
                    padding: '8px 10px',
                    fontSize: '12.5px',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: selectedIndex === idx ? 'var(--bg-hover)' : 'transparent',
                    transition: 'background var(--transition)'
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <span style={{ fontWeight: selectedIndex === idx ? 600 : 500 }}>{item.name}</span>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{item.path}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="header-user" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="header-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {getInitials(displayName)}
          </div>
          <div className="header-user-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="header-username" style={{ fontWeight: 600, fontSize: '13px', lineHeight: '1.2' }}>{displayName}</span>
            <span className="header-user-role" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{displayRole}</span>
          </div>
          {authService.isAuthenticated() && (
            <button 
              onClick={() => authService.logout()}
              style={{
                marginLeft: '8px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                cursor: 'pointer',
                fontWeight: 550,
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#ef4444';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                e.target.style.color = '#ef4444';
              }}
            >
              Đăng xuất
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
