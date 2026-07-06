import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import authService from '../services/authService';
import { ShoppingCart, Search, Loader2 } from 'lucide-react';

function YeuCauMuaBoSung() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const currentUser = authService.getCurrentUser();
  const userRole = currentUser ? currentUser.chucVu : '';
  const isPurchasing = userRole === 'Nhân viên mua hàng' || userRole === 'Quản lý kho' || userRole === 'Ban giám đốc';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/yeu-cau-mua-bo-sung');
      setData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    if (!window.confirm(`Xác nhận chuyển trạng thái thành: ${newStatus}?`)) return;
    try {
      await api.put(`/yeu-cau-mua-bo-sung/${id}/status`, { trangThai: newStatus });
      alert('Cập nhật trạng thái thành công!');
      fetchData();
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.error || err.message));
    }
  };

  const filteredData = data.filter(item => 
    (item.MA_YEU_CAU_MUA || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.TEN_MAT_HANG || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="page-header">
        <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShoppingCart className="page-icon" size={24} style={{ color: 'var(--text-secondary)' }} />
          <div>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Yêu cầu mua bổ sung</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Danh sách các yêu cầu nhập hàng được tạo tự động từ cảnh báo tồn kho</p>
          </div>
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <Search className="data-table-search-icon" size={14} />
            <input 
              type="text" 
              placeholder="Tìm theo mã YC, mặt hàng..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {loading ? (
          <div className="loading-state"><Loader2 className="spin" size={24} /> Đang tải...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã Yêu Cầu</th>
                <th>Từ Cảnh Báo</th>
                <th>Kho</th>
                <th>Mặt hàng</th>
                <th>SL Đề xuất</th>
                <th>Lý do</th>
                <th>Người tạo</th>
                <th>Thời điểm</th>
                <th>Trạng thái</th>
                {isPurchasing && <th>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr><td colSpan={isPurchasing ? "10" : "9"} style={{textAlign:'center'}}>Không có yêu cầu nào</td></tr>
              ) : filteredData.map((item) => (
                <tr key={item.MA_YEU_CAU_MUA}>
                  <td><strong>{item.MA_YEU_CAU_MUA?.trim()}</strong></td>
                  <td>{item.MA_CANH_BAO?.trim()}</td>
                  <td>{item.TEN_KHO}</td>
                  <td>{item.TEN_MAT_HANG}</td>
                  <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{item.SO_LUONG_DE_XUAT}</td>
                  <td>{item.LY_DO}</td>
                  <td>{item.NGUOI_TAO}</td>
                  <td>{new Date(item.THOI_DIEM_TAO).toLocaleString('vi-VN')}</td>
                  <td>
                    <span className={`badge ${
                      item.TRANG_THAI_YEU_CAU === 'Đã hoàn thành' ? 'badge-success' : 
                      item.TRANG_THAI_YEU_CAU === 'Đã tiếp nhận' ? 'badge-info' : 'badge-warning'
                    }`}>
                      {item.TRANG_THAI_YEU_CAU}
                    </span>
                  </td>
                  {isPurchasing && (
                    <td>
                      {(item.TRANG_THAI_YEU_CAU === 'Chờ duyệt' || item.TRANG_THAI_YEU_CAU === 'Đã gửi đề xuất' || item.TRANG_THAI_YEU_CAU === 'Chờ xử lý') && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(item.MA_YEU_CAU_MUA.trim(), 'Đã tiếp nhận')}>
                          Tiếp nhận
                        </button>
                      )}
                      {item.TRANG_THAI_YEU_CAU === 'Đã tiếp nhận' && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(item.MA_YEU_CAU_MUA.trim(), 'Đã tạo đơn mua')}>
                          Tạo PO
                        </button>
                      )}
                      {item.TRANG_THAI_YEU_CAU === 'Đã tạo đơn mua' && (
                        <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(item.MA_YEU_CAU_MUA.trim(), 'Đã hoàn thành')}>
                          Hoàn thành
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

export default YeuCauMuaBoSung;
