const NhaCungCap = require('../models/NhaCungCap');

const NhaCungCapController = {
  getAll: async (req, res) => {
    try {
      const data = await NhaCungCap.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  getByMa: async (req, res) => {
    try {
      const data = await NhaCungCap.getByMa(req.params.id);
      if (!data) return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const result = await NhaCungCap.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Lỗi tạo mới", error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const result = await NhaCungCap.update(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const result = await NhaCungCap.delete(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      if (error.message.includes('REFERENCE constraint') || error.message.includes('conflicted') || error.number === 547) {
        return res.status(409).json({ 
          message: "Không thể xóa nhà cung cấp này vì đang có các dữ liệu liên quan liên kết (như Đơn mua hàng PO hoặc Phiếu nhập kho). Bạn nên chuyển trạng thái nhà cung cấp sang 'Tạm ngừng hoạt động' hoặc 'Đã đóng' thay vì xóa hoàn toàn." 
        });
      }
      res.status(500).json({ message: "Lỗi xóa", error: error.message });
    }
  }
};

module.exports = NhaCungCapController;
