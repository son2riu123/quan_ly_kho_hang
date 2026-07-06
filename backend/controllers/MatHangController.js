const MatHang = require('../models/MatHang');

const MatHangController = {
  getAll: async (req, res) => {
    try {
      const data = await MatHang.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  getByMa: async (req, res) => {
    try {
      const data = await MatHang.getByMa(req.params.id);
      if (!data) return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const result = await MatHang.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Lỗi tạo mới", error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const result = await MatHang.update(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const result = await MatHang.delete(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      if (error.message.includes('REFERENCE constraint') || error.message.includes('conflicted') || error.number === 547) {
        return res.status(409).json({ 
          message: "Không thể xóa mặt hàng này vì đang có các dữ liệu liên quan liên kết (như Tồn kho, Lịch sử thẻ kho, Đơn mua hàng hoặc Phiếu nhập). Bạn nên chuyển trạng thái hoạt động của mặt hàng sang 'Ngừng kinh doanh' thay vì xóa hoàn toàn." 
        });
      }
      res.status(500).json({ message: "Lỗi xóa", error: error.message });
    }
  }
};

module.exports = MatHangController;
