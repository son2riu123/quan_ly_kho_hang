import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import authService from '../services/authService';
import { 
  ShieldAlert, 
  Search, 
  Plus, 
  Eye, 
  Check, 
  Loader2, 
  X, 
  ClipboardList, 
  CheckSquare, 
  FileText, 
  AlertTriangle,
  Send,
  Warehouse
} from 'lucide-react';

function CanhBaoXacMinh() {
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' or 'tasks'
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Data states
  const [alerts, setAlerts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // Modals state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDiscrepancyModal, setShowDiscrepancyModal] = useState(false);
  
  // Dossiers management states
  const [discrepancies, setDiscrepancies] = useState([]);
  const [faultyGoods, setFaultyGoods] = useState([]);
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState(null);
  const [selectedFaulty, setSelectedFaulty] = useState(null);
  const [showDiscrepancyDetailModal, setShowDiscrepancyDetailModal] = useState(false);
  const [showFaultyDetailModal, setShowFaultyDetailModal] = useState(false);

  // Form states
  const [assignForm, setAssignForm] = useState({
    MA_NHIEM_VU: '', MA_CANH_BAO: '', NGUOI_DUOC_PHAN_CONG: '', NOI_DUNG_YEU_CAU: '', THOI_HAN: ''
  });
  
  const [processForm, setProcessForm] = useState({
    MA_PHUONG_AN: '', MA_CANH_BAO: '', LOAI_PHUONG_AN: 'Điều chuyển vị trí', NOI_DUNG_PHUONG_AN: '', GHI_CHU: '', SO_LUONG_DE_XUAT: 0
  });

  const [reportForm, setReportForm] = useState({
    SO_LUONG_THUC_TE: 0, TINH_TRANG_HANG: 'Bình thường', MA_VI_TRI_THUC_TE: '', MA_LO_HANG_THUC_TE: '', GHI_CHU: ''
  });

  const [discrepancyForm, setDiscrepancyForm] = useState({
    MA_HO_SO: '', MO_TA_CHUNG: '', GHI_CHU: ''
  });

  // Current user info
  const currentUser = authService.getCurrentUser();
  const userRole = currentUser ? currentUser.chucVu : '';
  const userMa = currentUser ? currentUser.maNhanVien : ''; // Sử dụng đúng maNhanVien từ payload login

  // Phân quyền
  const isManager = userRole === 'Quản lý kho' || userRole === 'Ban giám đốc';
  const isStorekeeper = userRole === 'Thủ kho';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [alertsRes, tasksRes, empRes, discrepancyRes, faultyRes] = await Promise.all([
        api.get('/canh-bao-ton-kho'),
        api.get('/nhiem-vu-xac-minh-canh-bao'),
        api.get('/nhanvien'),
        api.get('/ho-so-xu-ly-sai-lech-ton-kho').catch(() => ({ data: [] })),
        api.get('/ho-so-xu-lu-hang-loi').catch(() => ({ data: [] }))
      ]);
      setAlerts(alertsRes.data || []);
      setTasks(tasksRes.data || []);
      setEmployees(empRes.data.filter(e => e.CHUC_VU === 'Thủ kho') || []);
      
      const discList = discrepancyRes.data?.data || discrepancyRes.data || [];
      setDiscrepancies(discList);
      
      const faultyList = faultyRes.data?.data || faultyRes.data || [];
      setFaultyGoods(faultyList);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    } finally {
      setLoading(false);
    }
  };

  // Duyệt/Từ chối hồ sơ sai lệch tồn kho (Diagram 2)
  const handleApproveDiscrepancy = async (maHoSo, status) => {
    const actionText = status === 'Đã hoàn thành' ? 'duyệt' : 'từ chối';
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} hồ sơ sai lệch ${maHoSo.trim()}?`)) return;
    try {
      await api.put(`/ho-so-xu-ly-sai-lech-ton-kho/${maHoSo.trim()}`, {
        TRANG_THAI_HO_SO: status,
        NGUOI_XU_LY: userMa || 'NV_QL001',
        THOI_DIEM_XU_LY: new Date().toISOString(),
        GHI_CHU: `Quyết định duyệt ${actionText} của Quản lý`
      });
      alert(`Đã ${actionText} hồ sơ sai lệch thành công!`);
      fetchData();
    } catch (err) {
      alert('Lỗi xử lý hồ sơ: ' + err.message);
    }
  };

  // Xem chi tiết hồ sơ sai lệch
  const handleViewDiscrepancyDetail = async (maHoSo) => {
    try {
      const res = await api.get(`/ho-so-xu-ly-sai-lech-ton-kho/${maHoSo.trim()}`);
      setSelectedDiscrepancy(res.data?.data || res.data);
      setShowDiscrepancyDetailModal(true);
    } catch (err) {
      alert('Lỗi tải chi tiết hồ sơ: ' + err.message);
    }
  };

  // Xem chi tiết hồ sơ hàng lỗi
  const handleViewFaultyDetail = async (faultyDossier) => {
    try {
      const res = await api.get(`/phieu-bao-cao-hang-loi/${faultyDossier.MA_PHIEU_BAO_CAO.trim()}`);
      setSelectedFaulty({
        ...faultyDossier,
        ChiTiet: res.data?.CHI_TIET || res.data || []
      });
      setShowFaultyDetailModal(true);
    } catch (err) {
      alert('Lỗi tải chi tiết phiếu báo cáo: ' + err.message);
    }
  };

  // Đóng/Hoàn thành hồ sơ hàng lỗi
  const handleCompleteFaulty = async (maHoSo) => {
    if (!window.confirm(`Bạn có chắc chắn muốn hoàn thành hồ sơ xử lý hàng lỗi ${maHoSo.trim()}?`)) return;
    try {
      await api.put(`/ho-so-xu-lu-hang-loi/${maHoSo.trim()}`, {
        MA_PHIEU_BAO_CAO: selectedFaulty?.MA_PHIEU_BAO_CAO || 'PL001',
        TRANG_THAI_HO_SO: 'Đã đóng',
        NGAY_DONG_HO_SO: new Date().toISOString(),
        GHI_CHU: 'Đã hoàn tất xử lý hàng lỗi'
      });
      alert('Đã đóng hồ sơ hàng lỗi thành công!');
      setShowFaultyDetailModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi xử lý: ' + err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Global search listener
  useEffect(() => {
    const handleGlobalSearch = (e) => { setSearch(e.detail || ''); };
    window.addEventListener('global-search', handleGlobalSearch);
    return () => window.removeEventListener('global-search', handleGlobalSearch);
  }, []);

  // Chi tiết cảnh báo
  const handleViewAlertDetail = async (maCB) => {
    try {
      const res = await api.get(`/canh-bao-ton-kho/${maCB}`);
      setSelectedAlert(res.data);
      setShowDetailModal(true);
    } catch (err) {
      alert('Lỗi tải chi tiết: ' + err.message);
    }
  };

  // Mở modal phân công
  const openAssignModal = (alertItem) => {
    setAssignForm({
      MA_NHIEM_VU: 'VM' + Math.floor(1000 + Math.random() * 9000),
      MA_CANH_BAO: alertItem.MA_CANH_BAO,
      NGUOI_DUOC_PHAN_CONG: '',
      NOI_DUNG_YEU_CAU: `Xác minh số lượng tồn thực tế của mặt hàng ${alertItem.MA_MAT_HANG?.trim()} (${alertItem.TEN_MAT_HANG}) tại kho.`,
      THOI_HAN: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0] // Deadline mai
    });
    setShowAssignModal(true);
  };

  // Submit phân công
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignForm.NGUOI_DUOC_PHAN_CONG) return alert('Vui lòng chọn thủ kho phụ trách!');
    try {
      // 1. Tạo nhiệm vụ xác minh
      await api.post('/nhiem-vu-xac-minh-canh-bao', assignForm);
      // 2. Đổi trạng thái cảnh báo sang 'Đang xác minh'
      await api.put(`/canh-bao-ton-kho/${assignForm.MA_CANH_BAO}/status`, { trangThai: 'Đang xác minh' });
      
      alert('Phân công nhiệm vụ xác minh thành công!');
      setShowAssignModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi phân công: ' + err.message);
    }
  };

  const [pendingPOs, setPendingPOs] = useState([]);

  // Mở modal xử lý cảnh báo
  const openProcessModal = async (alertItem) => {
    setProcessForm({
      MA_PHUONG_AN: 'PA' + Math.floor(1000 + Math.random() * 9000),
      MA_CANH_BAO: alertItem.MA_CANH_BAO,
      LOAI_PHUONG_AN: 'Điều chuyển vị trí',
      NOI_DUNG_PHUONG_AN: `Đề xuất phương án xử lý cảnh báo ${alertItem.MA_CANH_BAO}.`,
      GHI_CHU: '',
      SO_LUONG_DE_XUAT: alertItem.SO_LUONG_HIEN_TAI < alertItem.NGUONG_CANH_BAO ? (alertItem.NGUONG_CANH_BAO * 2) : 0,
      choNhapBoSung: false
    });
    setSelectedAlert(alertItem);
    setPendingPOs([]);
    setShowProcessModal(true);

    try {
      const res = await api.get(`/canh-bao-ton-kho/${alertItem.MA_CANH_BAO.trim()}/pending-po`);
      setPendingPOs(res.data || []);
      if (res.data && res.data.length > 0) {
        setProcessForm(prev => ({ ...prev, choNhapBoSung: true })); // Gợi ý chờ nhập
      }
    } catch (err) {
      console.error('Lỗi tải PO chờ nhận:', err);
    }
  };

  // Submit xử lý cảnh báo
  const handleProcessSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Tạo phương án xử lý cảnh báo
      await api.post('/phuong-an-xu-ly-canh-bao', {
        ...processForm,
        NGUOI_CHON: userMa || 'NV_QL001'
      });

      // 2. Nếu chọn phương án Mua bổ sung, tạo Yêu cầu mua bổ sung
      if (processForm.LOAI_PHUONG_AN === 'Mua bổ sung') {
        if (processForm.choNhapBoSung) {
          // Case 1: Chờ nhập bổ sung (Chỉ cập nhật trạng thái cảnh báo, không tạo yêu cầu mới)
        } else {
          // Case 2: Tạo yêu cầu mua bổ sung mới
          const maYCM = 'YCM' + Math.floor(1000 + Math.random() * 9000);
          await api.post('/yeu-cau-mua-bo-sung', {
            MA_YEU_CAU_MUA: maYCM,
            MA_CANH_BAO: processForm.MA_CANH_BAO,
            MA_MAT_HANG: selectedAlert.MA_MAT_HANG,
            MA_KHO: selectedAlert.MA_KHO,
            SO_LUONG_DE_XUAT: processForm.SO_LUONG_DE_XUAT,
            LY_DO: processForm.GHI_CHU || 'Tồn kho thực tế dưới ngưỡng tối thiểu',
            NGUOI_TAO: userMa || 'NV_QL001'
          });
        }
      }

      // 3. Nếu chọn Cách ly hàng lỗi hoặc Thanh lý tiêu hủy -> Tạo PhieuBaoCaoHangLoi & HoSoXuLyHangLoi
      if (processForm.LOAI_PHUONG_AN === 'Cách ly hàng lỗi' || processForm.LOAI_PHUONG_AN === 'Thanh lý tiêu hủy') {
        const maPhieu = 'PL' + Math.floor(1000 + Math.random() * 9000);
        const maChiTiet = 'CT' + Math.floor(1000 + Math.random() * 9000);

        // a. Tạo phiếu báo cáo hàng lỗi
        await api.post('/phieu-bao-cao-hang-loi', {
          MA_PHIEU_BAO_CAO: maPhieu,
          NGUOI_LAP: userMa || 'NV_QL001',
          THOI_DIEM_LAP: new Date().toISOString(),
          NGUON_PHAT_HIEN: 'Cảnh báo tự động',
          MO_TA_CHUNG: `Tự động tạo từ cảnh báo ${processForm.MA_CANH_BAO.trim()}`,
          TRANG_THAI_PHIEU: 'Đã lập',
          GHI_CHU: processForm.GHI_CHU || '',
          CHI_TIET: [{
            MA_CHI_TIET_PHIEU: maChiTiet,
            MA_PHIEU_BAO_CAO: maPhieu,
            MA_MAT_HANG: selectedAlert.MA_MAT_HANG.trim(),
            MA_LO_HANG: selectedAlert.details?.[0]?.MA_LO_HANG?.trim() || null,
            MA_VI_TRI: selectedAlert.details?.[0]?.MA_VI_TRI?.trim() || selectedAlert.MA_KHO.trim(),
            SO_LUONG_BAO_CAO: selectedAlert.SO_LUONG_HIEN_TAI,
            LOAI_VAN_DE: processForm.LOAI_PHUONG_AN === 'Thanh lý tiêu hủy' ? 'Thanh lý' : 'Cách ly',
            TINH_TRANG_HANG: selectedAlert.LOAI_CANH_BAO || 'Hỏng hóc',
            MO_TA_CHI_TIET: processForm.NOI_DUNG_PHUONG_AN || '',
            MINH_CHUNG: null
          }]
        });

        // b. Tạo hồ sơ xử lý hàng lỗi liên kết
        const maHoSo = 'HS' + Math.floor(1000 + Math.random() * 9000);
        await api.post('/ho-so-xu-lu-hang-loi', {
          MA_HO_SO: maHoSo,
          MA_PHIEU_BAO_CAO: maPhieu,
          MA_PHUONG_AN: null,
          MA_LENH_XU_LY: null,
          NGAY_TAO: new Date().toISOString(),
          TRANG_THAI_HO_SO: 'Đang xử lý',
          NGAY_DONG_HO_SO: null,
          GHI_CHU: `Tạo từ cảnh báo lỗi hàng ${processForm.MA_CANH_BAO.trim()}`
        });
      }

      // 4. Đổi trạng thái cảnh báo sang 'Đã xử lý'
      await api.put(`/canh-bao-ton-kho/${processForm.MA_CANH_BAO}/status`, { trangThai: 'Đã xử lý' });

      alert('Đã lưu phương án xử lý cảnh báo thành công!');
      setShowProcessModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi xử lý: ' + err.message);
    }
  };

  // Mở modal báo cáo kết quả của thủ kho
  const openReportModal = (taskItem) => {
    setSelectedTask(taskItem);
    setReportForm({
      SO_LUONG_THUC_TE: 0,
      TINH_TRANG_HANG: 'Bình thường',
      MA_VI_TRI_THUC_TE: '',
      MA_LO_HANG_THUC_TE: '',
      GHI_CHU: ''
    });
    setShowReportModal(true);
  };

  // Submit báo cáo kết quả xác minh
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/nhiem-vu-xac-minh-canh-bao/${selectedTask.MA_NHIEM_VU?.trim()}/result`, {
        MA_CANH_BAO: selectedTask.MA_CANH_BAO,
        SO_LUONG_THUC_TE: parseInt(reportForm.SO_LUONG_THUC_TE) || 0,
        MA_VI_TRI_THUC_TE: reportForm.MA_VI_TRI_THUC_TE || null,
        MA_LO_HANG_THUC_TE: reportForm.MA_LO_HANG_THUC_TE || null,
        TINH_TRANG_HANG: reportForm.TINH_TRANG_HANG,
        GHI_CHU: reportForm.GHI_CHU,
        NGUOI_CAP_NHAT: userMa || 'NV_TK001' // Mã thủ kho phụ trách
      });

      alert('Đã gửi báo cáo xác minh thành công! Cảnh báo đã được chuyển sang Đã xác minh.');
      setShowReportModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi gửi báo cáo: ' + err.message);
    }
  };

  // Đóng cảnh báo thủ công + Ghi log thao tác (Diagram 3)
  const handleCloseAlert = async (alertItem) => {
    if (!window.confirm(`Bạn có chắc chắn muốn đóng cảnh báo ${alertItem.MA_CANH_BAO.trim()}?`)) return;
    try {
      await api.put(`/canh-bao-ton-kho/${alertItem.MA_CANH_BAO.trim()}/status`, { trangThai: 'Đã đóng' });

      // Ghi nhật ký thao tác
      await api.post('/nhat-ky-thao-tac', {
        MA_LOG: 'LG' + Math.floor(1000 + Math.random() * 9000),
        NGUOI_THAO_TAC: userMa || 'NV_QL001',
        THOI_GIAN: new Date().toISOString(),
        HANH_DONG: 'Đóng cảnh báo',
        DOI_TUONG_BI_TAC_DONG: 'CanhBaoTonKho',
        MA_DOI_TUONG: alertItem.MA_CANH_BAO.trim(),
        DU_LIEU_TRUOC: JSON.stringify(alertItem),
        DU_LIEU_SAU: JSON.stringify({ ...alertItem, TRANG_THAI_CANH_BAO: 'Đã đóng' }),
        GHI_CHU: `Đóng thủ công cảnh báo ${alertItem.MA_CANH_BAO.trim()}`
      });

      alert('Đã đóng cảnh báo và ghi nhận nhật ký thao tác!');
      fetchData();
    } catch (err) {
      alert('Lỗi đóng cảnh báo: ' + err.message);
    }
  };

  // Mở modal xử lý sai lệch tồn kho (Diagram 2)
  const openDiscrepancyModal = (taskItem) => {
    setSelectedTask(taskItem);
    setDiscrepancyForm({
      MA_HO_SO: 'SL' + Math.floor(1000 + Math.random() * 9000),
      MO_TA_CHUNG: `Xử lý sai lệch phát sinh từ cảnh báo ${taskItem.MA_CANH_BAO.trim()}`,
      GHI_CHU: ''
    });
    setShowDiscrepancyModal(true);
  };

  // Submit xử lý sai lệch tồn kho (Diagram 2)
  const handleDiscrepancySubmit = async (e) => {
    e.preventDefault();
    try {
      const slSaiLech = selectedTask.SO_LUONG_THUC_TE - selectedTask.SO_LUONG_HIEN_TAI;
      const loaiSaiLech = slSaiLech > 0 ? 'Thừa' : 'Thiếu';
      const maChiTiet = 'CS' + Math.floor(1000 + Math.random() * 9000);

      // 1. Tạo hồ sơ xử lý sai lệch
      await api.post('/ho-so-xu-ly-sai-lech-ton-kho', {
        MA_HO_SO: discrepancyForm.MA_HO_SO,
        NGUOI_PHAT_HIEN: selectedTask.NGUOI_DUOC_PHAN_CONG.trim(),
        THOI_DIEM_PHAT_HIEN: new Date().toISOString(),
        NGUON_PHAT_HIEN: `Xác minh cảnh báo ${selectedTask.MA_CANH_BAO.trim()}`,
        MO_TA_CHUNG: discrepancyForm.MO_TA_CHUNG,
        TRANG_THAI_HO_SO: 'Chờ duyệt',
        NGUOI_XU_LY: userMa || 'NV_QL001',
        THOI_DIEM_XU_LY: new Date().toISOString(),
        GHI_CHU: discrepancyForm.GHI_CHU,
        chiTietList: [{
          MA_CHI_TIET_SAI_LECH: maChiTiet,
          MA_HO_SO: discrepancyForm.MA_HO_SO,
          MA_MAT_HANG: selectedTask.MA_MAT_HANG.trim(),
          MA_LO_HANG: selectedTask.MA_LO_HANG_THUC_TE ? selectedTask.MA_LO_HANG_THUC_TE.trim() : null,
          MA_VI_TRI: selectedTask.MA_VI_TRI_THUC_TE ? selectedTask.MA_VI_TRI_THUC_TE.trim() : selectedTask.MA_KHO.trim(),
          TRANG_THAI_HANG: selectedTask.TINH_TRANG_HANG || 'Bình thường',
          MA_DON_VI_TINH: 'DVT01',
          SO_LUONG_HE_THONG: selectedTask.SO_LUONG_HIEN_TAI,
          SO_LUONG_THUC_TE: selectedTask.SO_LUONG_THUC_TE,
          SO_LUONG_SAI_LECH: Math.abs(slSaiLech),
          LOAI_SAI_LECH: loaiSaiLech,
          MO_TA_SAI_LECH: selectedTask.GHICHU_XAC_MINH || '',
          MINH_CHUNG: null
        }]
      });

      // 2. Cập nhật trạng thái cảnh báo sang 'Đã xử lý'
      await api.put(`/canh-bao-ton-kho/${selectedTask.MA_CANH_BAO.trim()}/status`, { trangThai: 'Đã xử lý' });

      alert('Đã lập Hồ sơ xử lý sai lệch tồn kho thành công!');
      setShowDiscrepancyModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi xử lý sai lệch: ' + err.message);
    }
  };

  // Bộ lọc dữ liệu
  const filteredAlerts = alerts.filter(item => {
    const term = search.toLowerCase();
    return (
      (item.MA_CANH_BAO || '').toLowerCase().includes(term) ||
      (item.TEN_MAT_HANG || '').toLowerCase().includes(term) ||
      (item.LOAI_CANH_BAO || '').toLowerCase().includes(term) ||
      (item.TRANG_THAI_CANH_BAO || '').toLowerCase().includes(term)
    );
  });

  // Lọc nhiệm vụ: Nếu là thủ kho, chỉ hiển thị nhiệm vụ được giao cho mình
  const filteredTasks = tasks.filter(item => {
    const term = search.toLowerCase();
    const isAssignedToMe = (item.NGUOI_DUOC_PHAN_CONG || '').trim() === (userMa || '').trim();
    const passRoleFilter = isManager || (isStorekeeper && isAssignedToMe);
    
    return passRoleFilter && (
      (item.MA_NHIEM_VU || '').toLowerCase().includes(term) ||
      (item.MA_CANH_BAO || '').toLowerCase().includes(term) ||
      (item.NOI_DUNG_YEU_CAU || '').toLowerCase().includes(term) ||
      (item.TRANG_THAI_NHIEM_VU || '').toLowerCase().includes(term)
    );
  });

  return (
    <Layout title="Cảnh báo & Xác minh">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        
        {/* Navigation Tabs */}
        <div className="vercel-tabs">
          <button 
            className={`vercel-tab ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            Cảnh báo tồn kho ({filteredAlerts.length})
          </button>
          <button 
            className={`vercel-tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Nhiệm vụ xác minh ({filteredTasks.length})
          </button>
          <button 
            className={`vercel-tab ${activeTab === 'discrepancies' ? 'active' : ''}`}
            onClick={() => setActiveTab('discrepancies')}
          >
            Hồ sơ sai lệch ({discrepancies.length})
          </button>
          <button 
            className={`vercel-tab ${activeTab === 'faulty' ? 'active' : ''}`}
            onClick={() => setActiveTab('faulty')}
          >
            Hồ sơ lỗi hỏng ({faultyGoods.length})
          </button>
        </div>

        {/* Tab 1: Alert Lists */}
        {activeTab === 'alerts' && (
          <div className="vercel-settings-content">
            <div className="page-header">
              <h2>Quản lý Cảnh báo tồn kho</h2>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Tự động kích hoạt khi tồn thực tế vượt ngưỡng Min/Max hoặc cận Hạn sử dụng.
              </span>
            </div>

            <div className="data-table-container">
              <div className="data-table-toolbar">
                <div className="data-table-search">
                  <Search className="data-table-search-icon" size={14} />
                  <input 
                    type="text" 
                    placeholder="Tìm theo mã, mặt hàng, loại..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                  />
                </div>
              </div>

              {loading ? (
                <div className="loading-spinner"><Loader2 className="spinner" /></div>
              ) : filteredAlerts.length === 0 ? (
                <div className="empty-state">
                  <ShieldAlert size={40} className="empty-state-icon" />
                  <div className="empty-state-text">Không tìm thấy cảnh báo nào phù hợp</div>
                </div>
              ) : (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Mã CB</th>
                        <th>Kho</th>
                        <th>Mặt hàng</th>
                        <th>Loại cảnh báo</th>
                        <th>Độ ưu tiên</th>
                        <th>Tồn hiện tại</th>
                        <th>Ngưỡng</th>
                        <th>Trạng thái</th>
                        <th style={{ width: '220px' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAlerts.map(item => (
                        <tr key={item.MA_CANH_BAO}>
                          <td><strong>{item.MA_CANH_BAO.trim()}</strong></td>
                          <td>{item.TEN_KHO}</td>
                          <td>{item.TEN_MAT_HANG} ({item.MA_MAT_HANG.trim()})</td>
                          <td>
                            <span className={`badge ${
                              item.LOAI_CANH_BAO === 'Cận date' ? 'badge-warning' : 'badge-danger'
                            }`}>{item.LOAI_CANH_BAO}</span>
                          </td>
                          <td>
                            <span style={{
                              fontWeight: 600,
                              color: item.MUC_DO_UU_TIEN === 'Cao' ? 'var(--danger)' : 'var(--warning)'
                            }}>{item.MUC_DO_UU_TIEN}</span>
                          </td>
                          <td><strong>{item.SO_LUONG_HIEN_TAI}</strong></td>
                          <td>{item.NGUONG_CANH_BAO}</td>
                          <td>
                            <span className={`badge ${
                              item.TRANG_THAI_CANH_BAO === 'Chờ xử lý' ? 'badge-danger' :
                              item.TRANG_THAI_CANH_BAO === 'Đang xác minh' ? 'badge-warning' :
                              item.TRANG_THAI_CANH_BAO === 'Đã xác minh' ? 'badge-info' : 'badge-success'
                            }`}>{item.TRANG_THAI_CANH_BAO}</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button 
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleViewAlertDetail(item.MA_CANH_BAO)}
                                title="Xem chi tiết"
                              >
                                <Eye size={13} />
                              </button>
                              
                              {isManager && item.TRANG_THAI_CANH_BAO === 'Chờ xử lý' && (
                                <button 
                                  className="btn btn-primary btn-sm"
                                  onClick={() => openAssignModal(item)}
                                >
                                  Phân công
                                </button>
                              )}

                              {isManager && (item.TRANG_THAI_CANH_BAO === 'Chờ xử lý' || item.TRANG_THAI_CANH_BAO === 'Đã xác minh') && (
                                <button 
                                  className="btn btn-primary btn-sm"
                                  onClick={() => openProcessModal(item)}
                                >
                                  Xử lý
                                </button>
                              )}

                              {isManager && item.TRANG_THAI_CANH_BAO !== 'Đã xử lý' && item.TRANG_THAI_CANH_BAO !== 'Đã đóng' && (
                                <button 
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => handleCloseAlert(item)}
                                >
                                  Đóng
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Verification Tasks */}
        {activeTab === 'tasks' && (
          <div className="vercel-settings-content">
            <div className="page-header">
              <h2>Nhiệm vụ kiểm tra xác minh</h2>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {isStorekeeper ? "Danh sách các nhiệm vụ đối chiếu thực tế được giao cho bạn." : "Quản lý giám sát tiến độ thực hiện đối chiếu thực tế của thủ kho."}
              </span>
            </div>

            <div className="data-table-container">
              <div className="data-table-toolbar">
                <div className="data-table-search">
                  <Search className="data-table-search-icon" size={14} />
                  <input 
                    type="text" 
                    placeholder="Tìm theo mã nhiệm vụ, nội dung..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                  />
                </div>
              </div>

              {loading ? (
                <div className="loading-spinner"><Loader2 className="spinner" /></div>
              ) : filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <ClipboardList size={40} className="empty-state-icon" />
                  <div className="empty-state-text">Không tìm thấy nhiệm vụ nào</div>
                </div>
              ) : (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Mã NV</th>
                        <th>Mã Cảnh Báo</th>
                        <th>Người phụ trách</th>
                        <th>Nội dung yêu cầu</th>
                        <th>Thời hạn</th>
                        <th>Trạng thái</th>
                        <th>Kết quả tóm tắt</th>
                        <th style={{ width: '150px' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.map(item => (
                        <tr key={item.MA_NHIEM_VU}>
                          <td><strong>{item.MA_NHIEM_VU.trim()}</strong></td>
                          <td>{item.MA_CANH_BAO.trim()}</td>
                          <td>{item.HO_TEN || item.NGUOI_DUOC_PHAN_CONG.trim()}</td>
                          <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.NOI_DUNG_YEU_CAU}
                          </td>
                          <td>{item.THOI_HAN ? new Date(item.THOI_HAN).toLocaleDateString('vi-VN') : 'N/A'}</td>
                          <td>
                            <span className={`badge ${
                              item.TRANG_THAI_NHIEM_VU === 'Hoàn thành' ? 'badge-success' : 'badge-warning'
                            }`}>{item.TRANG_THAI_NHIEM_VU}</span>
                          </td>
                          <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {item.KET_QUA_TOM_TAT || 'Chưa cập nhật'}
                          </td>
                          <td>
                            {isStorekeeper && item.TRANG_THAI_NHIEM_VU === 'Chờ xử lý' && (
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => openReportModal(item)}
                              >
                                <CheckSquare size={13} style={{ marginRight: 4 }} /> Báo cáo
                              </button>
                            )}

                            {isManager && item.TRANG_THAI_NHIEM_VU === 'Hoàn thành' && item.SO_LUONG_HIEN_TAI !== item.SO_LUONG_THUC_TE && (
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => openDiscrepancyModal(item)}
                              >
                                Xử lý sai lệch
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Discrepancy Dossiers */}
        {activeTab === 'discrepancies' && (
          <div className="vercel-settings-content">
            <div className="page-header">
              <h2>Hồ sơ Xử lý Sai lệch Tồn kho</h2>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Giám sát và phê duyệt điều chỉnh số sách theo kết quả kiểm đếm thực tế của thủ kho.
              </span>
            </div>

            <div className="data-table-container">
              {discrepancies.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-text">Chưa có hồ sơ xử lý sai lệch nào</div>
                </div>
              ) : (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Mã HS</th>
                        <th>Nguồn phát hiện</th>
                        <th>Thời điểm</th>
                        <th>Trạng thái</th>
                        <th>Người xử lý</th>
                        <th style={{ width: '220px' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {discrepancies.map(item => (
                        <tr key={item.MA_HO_SO}>
                          <td><strong>{item.MA_HO_SO.trim()}</strong></td>
                          <td>{item.NGUON_PHAT_HIEN}</td>
                          <td>{item.THOI_DIEM_PHAT_HIEN ? new Date(item.THOI_DIEM_PHAT_HIEN).toLocaleString('vi-VN') : 'N/A'}</td>
                          <td>
                            <span className={`badge ${
                              item.TRANG_THAI_HO_SO === 'Đã hoàn thành' ? 'badge-success' :
                              item.TRANG_THAI_HO_SO === 'Đã từ chối' ? 'badge-danger' : 'badge-warning'
                            }`}>{item.TRANG_THAI_HO_SO}</span>
                          </td>
                          <td>{item.TEN_NGUOI_XU_LY || item.NGUOI_XU_LY || 'Chưa nhận'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button 
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleViewDiscrepancyDetail(item.MA_HO_SO)}
                              >
                                Chi tiết
                              </button>
                              
                              {isManager && item.TRANG_THAI_HO_SO === 'Chờ duyệt' && (
                                <>
                                  <button 
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleApproveDiscrepancy(item.MA_HO_SO, 'Đã hoàn thành')}
                                  >
                                    Duyệt
                                  </button>
                                  <button 
                                    className="btn btn-secondary btn-sm"
                                    style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                                    onClick={() => handleApproveDiscrepancy(item.MA_HO_SO, 'Đã từ chối')}
                                  >
                                    Từ chối
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Faulty Goods Dossiers */}
        {activeTab === 'faulty' && (
          <div className="vercel-settings-content">
            <div className="page-header">
              <h2>Hồ sơ Xử lý Hàng lỗi hỏng</h2>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Danh sách hồ sơ theo dõi cách ly, thanh lý hoặc tiêu hủy hàng lỗi, hàng cận date hỏng hóc.
              </span>
            </div>

            <div className="data-table-container">
              {faultyGoods.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-text">Chưa có hồ sơ hàng lỗi hỏng nào</div>
                </div>
              ) : (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Mã Hồ Sơ</th>
                        <th>Mã Phiếu Báo Cáo</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th>
                        <th>Ghi chú</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faultyGoods.map(item => (
                        <tr key={item.MA_HO_SO}>
                          <td><strong>{item.MA_HO_SO.trim()}</strong></td>
                          <td>{item.MA_PHIEU_BAO_CAO.trim()}</td>
                          <td>{item.NGAY_TAO ? new Date(item.NGAY_TAO).toLocaleDateString('vi-VN') : 'N/A'}</td>
                          <td>
                            <span className={`badge ${
                              item.TRANG_THAI_HO_SO === 'Đã hoàn thành' || item.TRANG_THAI_HO_SO === 'Đã đóng' ? 'badge-success' : 'badge-warning'
                            }`}>{item.TRANG_THAI_HO_SO}</span>
                          </td>
                          <td>{item.GHI_CHU}</td>
                          <td>
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleViewFaultyDetail(item)}
                            >
                              Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL 1: XEM CHI TIẾT CẢNH BÁO */}
        {showDetailModal && selectedAlert && (
          <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
            <div className="modal" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Chi tiết Cảnh báo {selectedAlert.MA_CANH_BAO.trim()}</h3>
                <button className="modal-close" onClick={() => setShowDetailModal(false)}><X size={16} /></button>
              </div>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                {/* Header Information */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Mặt hàng</span>
                    <div style={{ fontWeight: 600 }}>{selectedAlert.TEN_MAT_HANG} ({selectedAlert.MA_MAT_HANG.trim()})</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Kho bãi</span>
                    <div style={{ fontWeight: 600 }}>{selectedAlert.TEN_KHO}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Loại cảnh báo</span>
                    <div style={{ fontWeight: 600 }} className="text-danger">{selectedAlert.LOAI_CANH_BAO}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Mức độ ưu tiên</span>
                    <div style={{ fontWeight: 600, color: 'var(--warning)' }}>{selectedAlert.MUC_DO_UU_TIEN}</div>
                  </div>
                </div>

                {/* Warning details parameters */}
                <div style={{ background: 'var(--bg-app)', padding: 14, borderRadius: 6, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Số lượng hiện tại</span>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{selectedAlert.SO_LUONG_HIEN_TAI}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Ngưỡng cảnh báo</span>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--danger)' }}>{selectedAlert.NGUONG_CANH_BAO}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Trạng thái</span>
                    <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                      <span className="badge badge-warning">{selectedAlert.TRANG_THAI_CANH_BAO}</span>
                    </div>
                  </div>
                </div>

                {/* Sub details lists if any */}
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Chi tiết tồn kho liên quan</h4>
                  {selectedAlert.details && selectedAlert.details.length > 0 ? (
                    <div style={{ border: '1px solid var(--border-color)', borderRadius: 6, overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, textAlign: 'left' }}>
                        <thead style={{ background: 'var(--bg-app)' }}>
                          <tr>
                            <th style={{ padding: 8 }}>Mã Tồn</th>
                            <th style={{ padding: 8 }}>SL Vật Lý</th>
                            <th style={{ padding: 8 }}>SL Khả Dụng</th>
                            <th style={{ padding: 8 }}>Hạn sử dụng</th>
                            <th style={{ padding: 8 }}>Trạng thái tồn</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedAlert.details.map((detail, idx) => (
                            <tr key={idx} style={{ borderTop: '1px solid var(--border-color)' }}>
                              <td style={{ padding: 8 }}>{detail.MA_TON_VI_TRI.trim()}</td>
                              <td style={{ padding: 8 }}>{detail.SO_LUONG_VAT_LY}</td>
                              <td style={{ padding: 8 }}>{detail.SO_LUONG_KHA_DUNG}</td>
                              <td style={{ padding: 8 }}>{detail.HAN_SU_DUNG ? new Date(detail.HAN_SU_DUNG).toLocaleDateString('vi-VN') : 'Không có'}</td>
                              <td style={{ padding: 8 }}>{detail.TRANG_THAI_TON}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', italic: 'true' }}>Không tìm thấy chi tiết tồn kho con tại vị trí phát sinh cảnh báo.</p>
                  )}
                </div>

              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Đóng</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: PHÂN CÔNG XÁC MINH CẢNH BÁO */}
        {showAssignModal && (
          <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
            <form className="modal" onSubmit={handleAssignSubmit} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Phân công xác minh thực tế</h3>
                <button type="button" className="modal-close" onClick={() => setShowAssignModal(false)}><X size={16} /></button>
              </div>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                <div className="form-group">
                  <label>Mã nhiệm vụ</label>
                  <input value={assignForm.MA_NHIEM_VU} disabled />
                </div>
                
                <div className="form-group">
                  <label>Mã cảnh báo liên kết</label>
                  <input value={assignForm.MA_CANH_BAO.trim()} disabled />
                </div>

                <div className="form-group">
                  <label>Thủ kho phụ trách</label>
                  <select 
                    value={assignForm.NGUOI_DUOC_PHAN_CONG} 
                    onChange={e => setAssignForm({...assignForm, NGUOI_DUOC_PHAN_CONG: e.target.value})}
                    required
                  >
                    <option value="">-- Chọn thủ kho --</option>
                    {employees.map(e => (
                      <option key={e.MA_NHIEM_VU} value={e.MA_NHIEM_VU}>
                        {e.HO_TEN} ({e.MA_NHIEM_VU.trim()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Nội dung yêu cầu đối chiếu</label>
                  <textarea 
                    rows={3} 
                    value={assignForm.NOI_DUNG_YEU_CAU} 
                    onChange={e => setAssignForm({...assignForm, NOI_DUNG_YEU_CAU: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Thời hạn hoàn thành</label>
                  <input 
                    type="date" 
                    value={assignForm.THOI_HAN} 
                    onChange={e => setAssignForm({...assignForm, THOI_HAN: e.target.value})}
                    required
                  />
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary"><Send size={14} style={{ marginRight: 4 }} /> Giao việc</button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL 3: XỬ LÝ CẢNH BÁO (MANAGER) */}
        {showProcessModal && (
          <div className="modal-overlay" onClick={() => setShowProcessModal(false)}>
            <form className="modal" onSubmit={handleProcessSubmit} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Xử lý cảnh báo {processForm.MA_CANH_BAO.trim()}</h3>
                <button type="button" className="modal-close" onClick={() => setShowProcessModal(false)}><X size={16} /></button>
              </div>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                <div className="form-group">
                  <label>Mã phương án xử lý</label>
                  <input value={processForm.MA_PHUONG_AN} disabled />
                </div>

                <div className="form-group">
                  <label>Phương án lựa chọn</label>
                  <select 
                    value={processForm.LOAI_PHUONG_AN} 
                    onChange={e => setProcessForm({...processForm, LOAI_PHUONG_AN: e.target.value})}
                    required
                  >
                    <option value="Điều chuyển vị trí">Điều chuyển vị trí (Tối ưu hóa vị trí)</option>
                    <option value="Mua bổ sung">Lập đề xuất mua bổ sung (Low stock)</option>
                    <option value="Cách ly hàng lỗi">Cách ly kiểm nghiệm (Hàng hỏng hóc)</option>
                    <option value="Thanh lý tiêu hủy">Thanh lý / Tiêu hủy</option>
                  </select>
                </div>

                {processForm.LOAI_PHUONG_AN === 'Mua bổ sung' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {pendingPOs.length > 0 && (
                      <div style={{ background: '#fff9e6', border: '1px solid #ffe599', padding: 12, borderRadius: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#b78103', display: 'block', marginBottom: 4 }}>
                          ⚠️ Đơn đặt hàng (PO) chờ giao sẵn có:
                        </span>
                        <ul style={{ paddingLeft: 16, fontSize: 12.5, margin: 0 }}>
                          {pendingPOs.map((po, idx) => (
                            <li key={idx}>
                              Đơn <strong>{po.MA_DON_MUA.trim()}</strong> (Đặt: {po.SO_LUONG_DAT}, Đã nhận: {po.SO_LUONG_DA_NHAP}, Còn chờ: <strong>{po.SO_LUONG_CON_CHO_NHAN}</strong>)
                            </li>
                          ))}
                        </ul>
                        
                        <div style={{ marginTop: 8, display: 'flex', gap: 14, fontSize: 12.5 }}>
                          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <input 
                              type="radio" 
                              name="choNhapBoSung" 
                              checked={processForm.choNhapBoSung === true}
                              onChange={() => setProcessForm({ ...processForm, choNhapBoSung: true })}
                            />
                            Chờ nhập bổ sung từ đơn hàng cũ
                          </label>
                          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <input 
                              type="radio" 
                              name="choNhapBoSung" 
                              checked={processForm.choNhapBoSung === false}
                              onChange={() => setProcessForm({ ...processForm, choNhapBoSung: false })}
                            />
                            Vẫn lập yêu cầu mua mới
                          </label>
                        </div>
                      </div>
                    )}

                    {(!processForm.choNhapBoSung || pendingPOs.length === 0) && (
                      <div className="form-group" style={{ margin: 0 }}>
                        <label>Số lượng đề xuất mua thêm</label>
                        <input 
                          type="number" 
                          min="1"
                          value={processForm.SO_LUONG_DE_XUAT}
                          onChange={e => setProcessForm({...processForm, SO_LUONG_DE_XUAT: parseInt(e.target.value) || 0})}
                          required
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label>Nội dung quyết định chi tiết</label>
                  <textarea 
                    rows={3} 
                    placeholder="Ghi chú chi tiết cách thức thực hiện..." 
                    value={processForm.NOI_DUNG_PHUONG_AN}
                    onChange={e => setProcessForm({...processForm, NOI_DUNG_PHUONG_AN: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Ghi chú chung</label>
                  <input 
                    type="text" 
                    value={processForm.GHI_CHU}
                    onChange={e => setProcessForm({...processForm, GHI_CHU: e.target.value})}
                  />
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowProcessModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">
                  Áp dụng xử lý
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL 4: THỦ KHO BÁO CÁO KẾT QUẢ XÁC MINH */}
        {showReportModal && selectedTask && (
          <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
            <form className="modal" onSubmit={handleReportSubmit} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Báo cáo kết quả xác minh</h3>
                <button type="button" className="modal-close" onClick={() => setShowReportModal(false)}><X size={16} /></button>
              </div>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                <div style={{ background: 'var(--bg-app)', padding: 12, borderRadius: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Nhiệm vụ được giao:</div>
                  <div style={{ fontSize: 14, marginTop: 4, fontStyle: 'italic' }}>"{selectedTask.NOI_DUNG_YEU_CAU}"</div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Số lượng thực tế (Đếm được)</label>
                    <input 
                      type="number" 
                      min="0"
                      value={reportForm.SO_LUONG_THUC_TE}
                      onChange={e => setReportForm({...reportForm, SO_LUONG_THUC_TE: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Tình trạng hàng hóa</label>
                    <select 
                      value={reportForm.TINH_TRANG_HANG} 
                      onChange={e => setReportForm({...reportForm, TINH_TRANG_HANG: e.target.value})}
                      required
                    >
                      <option value="Bình thường">Bình thường (Đạt chuẩn)</option>
                      <option value="Hỏng hóc bao bì">Hỏng hóc bao bì</option>
                      <option value="Hết hạn sử dụng">Hết hạn sử dụng</option>
                      <option value="Thất thoát/Mất mát">Thất thoát / Mất mát</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Vị trí kho thực tế (Nếu lệch)</label>
                    <input 
                      type="text" 
                      placeholder="Mã vị trí (VD: VT001)"
                      value={reportForm.MA_VI_TRI_THUC_TE}
                      onChange={e => setReportForm({...reportForm, MA_VI_TRI_THUC_TE: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Mã lô hàng thực tế (Nếu lệch)</label>
                    <input 
                      type="text" 
                      placeholder="Mã lô (VD: L20261001)"
                      value={reportForm.MA_LO_HANG_THUC_TE}
                      onChange={e => setReportForm({...reportForm, MA_LO_HANG_THUC_TE: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Ảnh chụp đính kèm (Giả lập đính kèm tập tin)</label>
                  <div style={{
                    border: '1px dashed var(--border-color)', borderRadius: 6,
                    padding: 16, textAlign: 'center', cursor: 'pointer', background: 'var(--bg-app)'
                  }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>📸 Chụp/Tải lên hình ảnh bằng chứng đối chiếu thực tế</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Ghi chú chi tiết kết quả đối chiếu</label>
                  <textarea 
                    rows={3} 
                    placeholder="Báo cáo thêm chi tiết (Ví dụ: hàng bị móp méo góc kệ số 3...)"
                    value={reportForm.GHI_CHU}
                    onChange={e => setReportForm({...reportForm, GHI_CHU: e.target.value})}
                  />
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowReportModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary"><Check size={14} style={{ marginRight: 4 }} /> Hoàn thành & gửi</button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL 5: XỬ LÝ SAI LỆCH TỒN KHO (MANAGER - DIAGRAM 2) */}
        {showDiscrepancyModal && selectedTask && (
          <div className="modal-overlay" onClick={() => setShowDiscrepancyModal(false)}>
            <form className="modal" onSubmit={handleDiscrepancySubmit} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Xử lý sai lệch tồn kho</h3>
                <button type="button" className="modal-close" onClick={() => setShowDiscrepancyModal(false)}><X size={16} /></button>
              </div>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                <div className="form-group">
                  <label>Mã hồ sơ sai lệch</label>
                  <input value={discrepancyForm.MA_HO_SO} disabled />
                </div>

                <div style={{ background: 'var(--bg-app)', padding: 14, borderRadius: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Mặt hàng phát hiện lệch:</span>
                    <strong style={{ marginLeft: 6 }}>{selectedTask.MA_MAT_HANG?.trim()} ({selectedTask.LOAI_CANH_BAO})</strong>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>
                    <div>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Tồn hệ thống:</span>
                      <strong style={{ marginLeft: 6 }}>{selectedTask.SO_LUONG_HIEN_TAI}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Tồn thực tế đếm:</span>
                      <strong style={{ marginLeft: 6, color: 'var(--danger)' }}>{selectedTask.SO_LUONG_THUC_TE}</strong>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 6, marginTop: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Lượng sai lệch:</span>
                    <strong style={{ marginLeft: 6, color: 'var(--warning)', fontSize: 15 }}>
                      {Math.abs(selectedTask.SO_LUONG_THUC_TE - selectedTask.SO_LUONG_HIEN_TAI)} (
                      {selectedTask.SO_LUONG_THUC_TE > selectedTask.SO_LUONG_HIEN_TAI ? 'Thừa' : 'Thiếu'}
                      )
                    </strong>
                  </div>
                </div>

                <div className="form-group">
                  <label>Mô tả nguyên nhân & đánh giá chung</label>
                  <textarea 
                    rows={3}
                    value={discrepancyForm.MO_TA_CHUNG}
                    onChange={e => setDiscrepancyForm({...discrepancyForm, MO_TA_CHUNG: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Ghi chú quyết định xử lý</label>
                  <input 
                    type="text" 
                    placeholder="VD: Chờ duyệt quyết định điều chỉnh số sách..."
                    value={discrepancyForm.GHI_CHU}
                    onChange={e => setDiscrepancyForm({...discrepancyForm, GHI_CHU: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDiscrepancyModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">
                  Tạo hồ sơ xử lý sai lệch
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL 6: XEM CHI TIẾT HỒ SƠ SAI LỆCH */}
        {showDiscrepancyDetailModal && selectedDiscrepancy && (
          <div className="modal-overlay" onClick={() => setShowDiscrepancyDetailModal(false)}>
            <div className="modal" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Chi tiết Hồ sơ sai lệch {selectedDiscrepancy.MA_HO_SO.trim()}</h3>
                <button type="button" className="modal-close" onClick={() => setShowDiscrepancyDetailModal(false)}><X size={16} /></button>
              </div>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Mã hồ sơ</span>
                    <div style={{ fontWeight: 600 }}>{selectedDiscrepancy.MA_HO_SO.trim()}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Nguồn phát hiện</span>
                    <div style={{ fontWeight: 600 }}>{selectedDiscrepancy.NGUON_PHAT_HIEN}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Trạng thái</span>
                    <div>
                      <span className={`badge ${
                        selectedDiscrepancy.TRANG_THAI_HO_SO === 'Đã hoàn thành' ? 'badge-success' : 'badge-warning'
                      }`}>{selectedDiscrepancy.TRANG_THAI_HO_SO}</span>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Mô tả chung</span>
                    <div>{selectedDiscrepancy.MO_TA_CHUNG}</div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: 13, marginBottom: 8 }}>Danh sách mặt hàng sai lệch</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: 8, textAlign: 'left' }}>Mã hàng</th>
                        <th style={{ padding: 8, textAlign: 'left' }}>Vị trí</th>
                        <th style={{ padding: 8, textAlign: 'left' }}>Lô</th>
                        <th style={{ padding: 8, textAlign: 'center' }}>Hệ thống</th>
                        <th style={{ padding: 8, textAlign: 'center' }}>Thực tế</th>
                        <th style={{ padding: 8, textAlign: 'center' }}>Sai lệch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDiscrepancy.ChiTiet?.map((ct, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: 8 }}>{ct.MA_MAT_HANG.trim()}</td>
                          <td style={{ padding: 8 }}>{ct.MA_VI_TRI?.trim() || 'N/A'}</td>
                          <td style={{ padding: 8 }}>{ct.MA_LO_HANG?.trim() || 'Không lô'}</td>
                          <td style={{ padding: 8, textAlign: 'center' }}>{ct.SO_LUONG_HE_THONG}</td>
                          <td style={{ padding: 8, textAlign: 'center' }}>{ct.SO_LUONG_THUC_TE}</td>
                          <td style={{ padding: 8, textAlign: 'center', color: ct.LOAI_SAI_LECH === 'Thừa' ? 'var(--success)' : 'var(--danger)' }}>
                            {ct.LOAI_SAI_LECH === 'Thừa' ? '+' : '-'}{ct.SO_LUONG_SAI_LECH}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDiscrepancyDetailModal(false)}>Đóng</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 7: XEM CHI TIẾT HỒ SƠ HÀNG LỖI */}
        {showFaultyDetailModal && selectedFaulty && (
          <div className="modal-overlay" onClick={() => setShowFaultyDetailModal(false)}>
            <div className="modal" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Chi tiết Hồ sơ lỗi hỏng {selectedFaulty.MA_HO_SO.trim()}</h3>
                <button type="button" className="modal-close" onClick={() => setShowFaultyDetailModal(false)}><X size={16} /></button>
              </div>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Mã hồ sơ</span>
                    <div style={{ fontWeight: 600 }}>{selectedFaulty.MA_HO_SO.trim()}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Mã phiếu báo cáo</span>
                    <div style={{ fontWeight: 600 }}>{selectedFaulty.MA_PHIEU_BAO_CAO.trim()}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Trạng thái</span>
                    <div>
                      <span className={`badge ${
                        selectedFaulty.TRANG_THAI_HO_SO === 'Đã hoàn thành' || selectedFaulty.TRANG_THAI_HO_SO === 'Đã đóng' ? 'badge-success' : 'badge-warning'
                      }`}>{selectedFaulty.TRANG_THAI_HO_SO}</span>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Ghi chú hồ sơ</span>
                    <div>{selectedFaulty.GHI_CHU}</div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: 13, marginBottom: 8 }}>Chi tiết hàng lỗi báo cáo</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: 8, textAlign: 'left' }}>Mặt hàng</th>
                        <th style={{ padding: 8, textAlign: 'left' }}>Vị trí</th>
                        <th style={{ padding: 8, textAlign: 'left' }}>Phân loại lỗi</th>
                        <th style={{ padding: 8, textAlign: 'center' }}>Số lượng</th>
                        <th style={{ padding: 8, textAlign: 'left' }}>Tình trạng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedFaulty.ChiTiet?.map((ct, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: 8 }}>{ct.MA_MAT_HANG.trim()}</td>
                          <td style={{ padding: 8 }}>{ct.MA_VI_TRI.trim()}</td>
                          <td style={{ padding: 8 }}>{ct.LOAI_VAN_DE}</td>
                          <td style={{ padding: 8, textAlign: 'center' }}>{ct.SO_LUONG_BAO_CAO}</td>
                          <td style={{ padding: 8 }}>{ct.TINH_TRANG_HANG}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowFaultyDetailModal(false)}>Hủy</button>
                {isManager && (selectedFaulty.TRANG_THAI_HO_SO === 'Đang xử lý' || selectedFaulty.TRANG_THAI_HO_SO === 'Chờ xử lý') && (
                  <button type="button" className="btn btn-primary" onClick={() => handleCompleteFaulty(selectedFaulty.MA_HO_SO)}>
                    Hoàn thành xử lý
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

export default CanhBaoXacMinh;
