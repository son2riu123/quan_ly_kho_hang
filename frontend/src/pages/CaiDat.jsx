import React from 'react';
import Layout from '../components/Layout';

function CaiDat() {
  return (
    <Layout title="Cài đặt hệ thống">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        <div className="page-header">
          <h2>Cài đặt nâng cao</h2>
        </div>

        {/* Card: Chuyển quyền */}
        <div className="section-card">
          <div className="section-card-body" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Chuyển quyền quản trị</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Chuyển giao quyền quản trị cao nhất của hệ thống kho cho một tài khoản giám đốc hoặc quản lý khác mà không làm gián đoạn quá trình vận hành.
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 24px', borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-app)'
          }}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Tìm hiểu thêm về <a href="#" style={{ color: '#0070f3', textDecoration: 'none' }}>Việc chuyển quyền quản trị ↗</a>
            </span>
            <button className="btn btn-primary">Chuyển quyền</button>
          </div>
        </div>

        {/* Card: Xóa dữ liệu */}
        <div className="section-card" style={{ borderColor: '#fca5a5' }}>
          <div className="section-card-body" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Xóa dữ liệu hệ thống</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Xóa vĩnh viễn toàn bộ dữ liệu của dự án này bao gồm danh mục mặt hàng, phiếu nhập/xuất kho, thẻ kho, và các cấu hình cảnh báo. Hành động này không thể hoàn tác.
            </p>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: 14, marginTop: 20,
              border: '1px solid var(--border-color)', borderRadius: 6,
              maxWidth: 360
            }}>
              <div style={{
                width: 44, height: 44, background: 'var(--bg-app)',
                border: '1px solid var(--border-color)', borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4 7.5 4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>quan-ly-kho-logistics</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Cập nhật lần cuối 6 phút trước</div>
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'flex-end',
            padding: '14px 24px', borderTop: '1px solid #fca5a5',
            background: '#fef2f2'
          }}>
            <button className="btn" style={{
              background: '#ee0000', color: '#fff', border: 'none'
            }}>Xóa dữ liệu</button>
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default CaiDat;
