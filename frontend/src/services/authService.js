import api from './api';

const authService = {
  // Gửi thông tin đăng nhập lên Backend
  login: async (tenDangNhap, matKhau) => {
    try {
      const response = await api.post('/taikhoan/login', { tenDangNhap, matKhau });
      if (response.data && response.data.token) {
        // Lưu trữ Token và thông tin User vào localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Lỗi mạng, vui lòng thử lại sau!");
    }
  },

  // Đăng xuất khỏi hệ thống
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Lấy thông tin user hiện tại từ localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Lấy token hiện tại
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Kiểm tra xem đã đăng nhập hay chưa
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
