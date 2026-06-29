const PhieuTraNhaCungCap = require("../models/PhieuTraNhaCungCap");

const PhieuTraNhaCungCapController = {

  getAll: async (req, res) => {
    try {
      const data = await PhieuTraNhaCungCap.getAll();
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  getByMa: async (req, res) => {
    try {
      const data = await PhieuTraNhaCungCap.getByMa(req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, message: "Không tìm thấy phiếu trả NCC" });
      }
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  create: async (req, res) => {
    try {
      const result = await PhieuTraNhaCungCap.create(req.body);
      res.status(201).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  update: async (req, res) => {
    try {
      const result = await PhieuTraNhaCungCap.update(req.params.id, req.body);
      res.status(200).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  delete: async (req, res) => {
    try {
      const result = await PhieuTraNhaCungCap.delete(req.params.id);
      res.status(200).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = PhieuTraNhaCungCapController;