const BienBanTieuHuy = require("../models/BienBanTieuHuy");

const BienBanTieuHuyController = {
  getAll: async (req, res) => {
    try {
      const data = await BienBanTieuHuy.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getByMa: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await BienBanTieuHuy.getByMa(id);
      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy biên bản tiêu hủy" });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const result = await BienBanTieuHuy.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await BienBanTieuHuy.update(id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy biên bản tiêu hủy để cập nhật" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await BienBanTieuHuy.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy biên bản tiêu hủy để xóa" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = BienBanTieuHuyController;