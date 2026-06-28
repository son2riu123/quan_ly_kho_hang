import Sidebar from './Sidebar';
import Header from './Header';

function Layout({ title, children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header title={title} />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
