const ChungTuGiaoHang = require("../models/ChungTuGiaoHang");

const ChungTuGiaoHangController = {
  getAll: async (req, res) => {
    try {
      const data = await ChungTuGiaoHang.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getByMa: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await ChungTuGiaoHang.getByMa(id);
      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy chứng từ giao hàng" });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const result = await ChungTuGiaoHang.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await ChungTuGiaoHang.update(id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy chứng từ giao hàng để cập nhật" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await ChungTuGiaoHang.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy chứng từ giao hàng để xóa" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = ChungTuGiaoHangController;