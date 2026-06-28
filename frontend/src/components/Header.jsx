import { useState, useEffect } from 'react';
import { Search, Sun, Moon } from 'lucide-react';

function Header({ title }) {
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
        <h1>{title}</h1>
      </div>
      <div className="header-right">
        <div className="header-search">
          <Search className="header-search-icon" size={14} />
          <input type="text" placeholder="Tìm kiếm nhanh..." />
        </div>
        
        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="header-user">
          <div className="header-avatar">NV</div>
          <span className="header-username">Nguyễn Văn Vũ</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
