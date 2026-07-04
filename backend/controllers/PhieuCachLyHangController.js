const PhieuCachLyHang = require("../models/PhieuCachLyHang");

const PhieuCachLyHangController = {
  getAll: async (req, res) => {
    try {
      const data = await PhieuCachLyHang.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getByMa: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await PhieuCachLyHang.getByMa(id);
      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy phiếu cách ly hàng" });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const result = await PhieuCachLyHang.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await PhieuCachLyHang.update(id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy phiếu cách ly hàng để cập nhật" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await PhieuCachLyHang.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy phiếu cách ly hàng để xóa" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = PhieuCachLyHangController;