import { useState, useEffect } from 'react';
import { Search, Sun, Moon, Menu } from 'lucide-react';
import authService from '../services/authService';

function Header({ title, onToggleSidebar }) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const currentUser = authService.getCurrentUser();
  const displayName = currentUser ? currentUser.hoTen : 'Chưa đăng nhập';
  const displayRole = currentUser ? currentUser.chucVu : '';

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
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
        <div className="header-search">
          <Search className="header-search-icon" size={14} />
          <input 
            type="text" 
            placeholder="Tìm kiếm nhanh..." 
            onChange={(e) => {
              window.dispatchEvent(new CustomEvent('global-search', { detail: e.target.value }));
            }}
          />
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
