const NhiemVuKiemKe = require("../models/NhiemVuKiemKe");

const NhiemVuKiemKeController = {

  getAll: async (req, res) => {
    try {
      const data = await NhiemVuKiemKe.getAll();
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  getByMa: async (req, res) => {
    try {
      const data = await NhiemVuKiemKe.getByMa(req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, message: "Không tìm thấy nhiệm vụ kiểm kê" });
      }
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  create: async (req, res) => {
    try {
      const result = await NhiemVuKiemKe.create(req.body);
      res.status(201).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  update: async (req, res) => {
    try {
      const result = await NhiemVuKiemKe.update(req.params.id, req.body);
      res.status(200).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  delete: async (req, res) => {
    try {
      const result = await NhiemVuKiemKe.delete(req.params.id);
      res.status(200).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = NhiemVuKiemKeController;