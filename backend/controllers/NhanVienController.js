const NhanVien = require('../models/NhanVien');

const NhanVienController = {
  getAll: async (req, res) => {
    try {
      const data = await NhanVien.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  getByMa: async (req, res) => {
    try {
      const data = await NhanVien.getByMa(req.params.id);
      if (!data) return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const result = await NhanVien.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Lỗi tạo mới", error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const result = await NhanVien.update(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const result = await NhanVien.delete(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      if (error.message && (error.message.includes("REFERENCE constraint") || error.message.includes("conflicted with the REFERENCE constraint"))) {
        return res.status(409).json({ 
          message: "Không thể xóa nhân viên này do đã có dữ liệu liên kết lịch sử trong hệ thống (đơn hàng, nhiệm vụ xác minh, yêu cầu mua...).",
          error: "Khuyên dùng: Đổi trạng thái hoạt động của nhân viên thành 'Đã nghỉ việc' thay vì xóa."
        });
      }
      res.status(500).json({ message: "Lỗi xóa", error: error.message });
    }
  }
};

module.exports = NhanVienController;
