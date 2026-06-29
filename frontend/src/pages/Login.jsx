import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Package, AlertCircle, Loader } from 'lucide-react';
import authService from '../services/authService';
import loginBg from '../assets/login_bg.png';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ tenDangNhap: '', matKhau: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Nếu người dùng đã đăng nhập từ trước, không cho phép quay lại trang login mà đá thẳng về Dashboard
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tenDangNhap || !form.matKhau) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.login(form.tenDangNhap, form.matKhau);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* Background */}
      <div
        className="login-bg"
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      <div className="login-bg-overlay" />

      {/* Ambient glows */}
      <div className="login-glow login-glow--tl" />
      <div className="login-glow login-glow--br" />

      {/* Card */}
      <div className="login-card-wrapper">
        <div className="login-card">

          {/* Logo mark */}
          <div className="login-logo">
            <div className="login-logo-icon">
              <Package size={22} strokeWidth={1.5} color="currentColor" />
            </div>
            <div className="login-logo-text">
              <span className="login-logo-name">Kho Vận Pro</span>
              <span className="login-logo-sub">Hệ thống Quản lý Kho hàng</span>
            </div>
          </div>

          {/* Heading */}
          <div className="login-heading">
            <h1 className="login-title">Đăng nhập</h1>
            <p className="login-sub">Nhập thông tin tài khoản để tiếp tục làm việc</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="login-error">
              <AlertCircle size={15} strokeWidth={2} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label htmlFor="tenDangNhap" className="login-label">Tên đăng nhập</label>
              <input
                id="tenDangNhap"
                name="tenDangNhap"
                type="text"
                autoComplete="username"
                placeholder="Nhập tên đăng nhập..."
                className="login-input"
                value={form.tenDangNhap}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="login-field">
              <label htmlFor="matKhau" className="login-label">Mật khẩu</label>
              <div className="login-input-wrap">
                <input
                  id="matKhau"
                  name="matKhau"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu..."
                  className="login-input login-input--pass"
                  value={form.matKhau}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="login-toggle-pass"
                  onClick={() => setShowPass(v => !v)}
                  tabIndex={-1}
                  aria-label={showPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPass
                    ? <EyeOff size={16} strokeWidth={1.5} />
                    : <Eye size={16} strokeWidth={1.5} />
                  }
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className={`login-btn${loading ? ' login-btn--loading' : ''}`}
              disabled={loading}
            >
              {loading
                ? <><Loader size={16} strokeWidth={2} className="login-spinner" /> Đang xác thực...</>
                : 'Đăng nhập'
              }
            </button>
          </form>

          {/* Footer note */}
          <p className="login-footer-note">
            Quên mật khẩu? Liên hệ <strong>Quản lý kho</strong> để được hỗ trợ.
          </p>
        </div>

        {/* Role hint bar */}
        <div className="login-role-hint">
          <span className="login-role-tag">Quản lý kho</span>
          <span className="login-role-tag">Thủ kho</span>
          <span className="login-role-tag">KCS</span>
          <span className="login-role-tag">Kế toán</span>
        </div>
      </div>
    </div>
  );
}
