const DonMuaHang = require('../models/DonMuaHang');

const DonMuaHangController = {
  getAll: async (req, res) => {
    try {
      const data = await DonMuaHang.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy danh sách đơn mua hàng", error: error.message });
    }
  },

  getByMa: async (req, res) => {
    try {
      const data = await DonMuaHang.getByMa(req.params.id);
      if (!data) return res.status(404).json({ message: "Không tìm thấy đơn mua hàng" });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy thông tin đơn mua hàng", error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const result = await DonMuaHang.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Lỗi tạo đơn mua hàng", error: error.message });
    }
  }
};

module.exports = DonMuaHangController;
