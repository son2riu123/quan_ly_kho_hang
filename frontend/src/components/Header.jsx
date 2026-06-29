import { useState, useEffect } from 'react';
import { Search, Sun, Moon, Menu } from 'lucide-react';

function Header({ title, onToggleSidebar }) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

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

        <div className="header-user">
          <div className="header-avatar">NV</div>
          <span className="header-username">Admin</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
