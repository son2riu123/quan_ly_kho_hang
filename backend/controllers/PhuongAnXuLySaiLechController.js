const PhuongAnXuLySaiLech = require("../models/PhuongAnXuLySaiLech");
const discrepancyService = require("../services/discrepancyService");

const PhuongAnXuLySaiLechController = {
  // Lấy danh sách tất cả phương án
  getAll: async (req, res) => {
    try {
      const data = await PhuongAnXuLySaiLech.getAll();
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Lấy chi tiết phương án theo mã
  getById: async (req, res) => {
    try {
      const data = await PhuongAnXuLySaiLech.getByMa(req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, message: "Không tìm thấy phương án" });
      }
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Lấy danh sách phương án theo mã Hồ sơ
  getByHoSo: async (req, res) => {
    try {
      const data = await PhuongAnXuLySaiLech.getByHoSo(req.params.maHoSo);
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Tạo mới phương án
  create: async (req, res) => {
    try {
      const result = await PhuongAnXuLySaiLech.create(req.body);
      res.status(201).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Cập nhật trạng thái phương án (Dùng khi phê duyệt hoặc thay đổi trạng thái)
  update: async (req, res) => {
    try {
      // Nếu là hành động Phê duyệt phương án -> Chạy qua Service Giao dịch
      if (req.body.TRANG_THAI_PHUONG_AN === 'Đã phê duyệt') {
        const nguoiDuyet = req.user ? req.user.maNhanVien : 'NV_ADMIN';
        const result = await discrepancyService.processDiscrepancyResolution(req.params.id, nguoiDuyet);
        return res.status(200).json(result);
      }
      
      // Nếu cập nhật bình thường
      const result = await PhuongAnXuLySaiLech.update(req.params.id, req.body);
      res.status(200).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Xóa phương án
  delete: async (req, res) => {
    try {
      const result = await PhuongAnXuLySaiLech.delete(req.params.id);
      res.status(200).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = PhuongAnXuLySaiLechController;