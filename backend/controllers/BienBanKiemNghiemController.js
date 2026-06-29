const BienBanKiemNghiem = require("../models/BienBanKiemNghiem");

const BienBanKiemNghiemController = {
  getAll: async (req, res) => {
    try {
      const data = await BienBanKiemNghiem.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getByMa: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await BienBanKiemNghiem.getByMa(id);
      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy biên bản kiểm nghiệm" });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const result = await BienBanKiemNghiem.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await BienBanKiemNghiem.update(id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy biên bản kiểm nghiệm để cập nhật" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await BienBanKiemNghiem.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy biên bản kiểm nghiệm để xóa" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = BienBanKiemNghiemController;