import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Tự động đính kèm JWT Token vào Header của mọi yêu cầu
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý lỗi tập trung (Ví dụ: Token hết hạn -> Tự động logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token hết hạn hoặc không hợp lệ. Đang chuyển hướng về trang Login...");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Chuyển hướng người dùng về trang login nếu đang ở trình duyệt
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
