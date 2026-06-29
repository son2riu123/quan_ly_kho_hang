import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

/**
 * Route Guard chặn người dùng chưa đăng nhập hoặc không đủ thẩm quyền (Role)
 * @param {React.ReactNode} children - Component trang con muốn hiển thị
 * @param {Array<string>} allowedRoles - Danh sách các chức vụ được phép truy cập (Tùy chọn)
 */
const AuthGuard = ({ children, allowedRoles }) => {
  const isAuth = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  // 1. Nếu chưa đăng nhập -> Đá về trang đăng nhập
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu có giới hạn role và role người dùng không khớp -> Đá về trang tổng quan
  if (allowedRoles && currentUser) {
    const hasPermission = allowedRoles.includes(currentUser.chucVu);
    if (!hasPermission) {
      console.warn(`Tài khoản thuộc nhóm [${currentUser.chucVu}] không có quyền truy cập trang này.`);
      return <Navigate to="/" replace />;
    }
  }

  // 3. Hợp lệ -> Cho đi tiếp vào trang con
  return children;
};

export default AuthGuard;
