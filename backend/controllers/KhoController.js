const Kho = require('../models/Kho');

const KhoController = {
  getAll: async (req, res) => {
    try {
      const data = await Kho.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  getByMa: async (req, res) => {
    try {
      const data = await Kho.getByMa(req.params.id);
      if (!data) return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const result = await Kho.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Lỗi tạo mới", error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const result = await Kho.update(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const result = await Kho.delete(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      if (error.message.includes('REFERENCE constraint') || error.message.includes('conflicted') || error.number === 547) {
        return res.status(409).json({ 
          message: "Không thể xóa kho hàng này vì đang có các dữ liệu liên quan liên kết (như Vị trí kho, Đơn mua hàng, Phiếu nhập hoặc Đợt kiểm kê). Bạn nên chuyển trạng thái kho sang 'Tạm đóng' hoặc 'Đã đóng' để tạm dừng hoạt động." 
        });
      }
      res.status(500).json({ message: "Lỗi xóa", error: error.message });
    }
  }
};

module.exports = KhoController;
