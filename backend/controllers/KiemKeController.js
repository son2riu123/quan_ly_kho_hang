const KiemKe = require('../models/KiemKe');

const KiemKeController = {
  getAllDots: async (req, res) => {
    try {
      const data = await KiemKe.getAllDots();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy danh sách đợt kiểm kê", error: error.message });
    }
  },

  getDotByMa: async (req, res) => {
    try {
      const data = await KiemKe.getDotByMa(req.params.id);
      if (!data) return res.status(404).json({ message: "Không tìm thấy đợt kiểm kê" });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy chi tiết đợt kiểm kê", error: error.message });
    }
  },

  createDot: async (req, res) => {
    try {
      const result = await KiemKe.createDot(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Lỗi tạo đợt kiểm kê", error: error.message });
    }
  },

  getPhieuDetails: async (req, res) => {
    try {
      const data = await KiemKe.getPhieuDetails(req.params.id);
      if (!data) return res.status(404).json({ message: "Không tìm thấy phiếu kiểm kê" });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy chi tiết phiếu kiểm kê", error: error.message });
    }
  },

  createPhieu: async (req, res) => {
    try {
      const result = await KiemKe.createPhieu(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lập phiếu kiểm kê", error: error.message });
    }
  }
};

module.exports = KiemKeController;
