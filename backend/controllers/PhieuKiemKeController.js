const PhieuKiemKe = require("../models/PhieuKiemKe");

const PhieuKiemKeController = {
  getAll: async (req, res) => {
    try {
      const data = await PhieuKiemKe.getAll();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const data = await PhieuKiemKe.getByMa(req.params.id);
      if (!data) return res.status(404).json({ message: "Không tìm thấy phiếu" });
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      // req.body phải bao gồm thông tin phiếu và mảng chiTiet
      const result = await PhieuKiemKe.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const result = await PhieuKiemKe.delete(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = PhieuKiemKeController;