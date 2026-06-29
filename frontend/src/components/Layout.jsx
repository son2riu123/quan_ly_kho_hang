import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

function Layout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Header title={title} onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
