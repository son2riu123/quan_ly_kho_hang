const PhieuKiemKeXacMinh = require("../models/PhieuKiemKeXacMinh");

const PhieuKiemKeXacMinhController = {

  getAll: async (req, res) => {
    try {
      const data = await PhieuKiemKeXacMinh.getAll();
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  getById: async (req, res) => {
    try {
      const data = await PhieuKiemKeXacMinh.getByMa(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: "Không tìm thấy phiếu" });
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  getByIdWithChiTiet: async (req, res) => {
    try {
      const data = await PhieuKiemKeXacMinh.getByMaWithChiTiet(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: "Không tìm thấy phiếu" });
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  getByHoSo: async (req, res) => {
    try {
      const data = await PhieuKiemKeXacMinh.getByHoSo(req.params.maHoSo);
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  create: async (req, res) => {
    try {
      const result = await PhieuKiemKeXacMinh.create(req.body);
      res.status(201).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  update: async (req, res) => {
    try {
      const result = await PhieuKiemKeXacMinh.update(req.params.id, req.body);
      res.status(200).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  delete: async (req, res) => {
    try {
      const result = await PhieuKiemKeXacMinh.delete(req.params.id);
      res.status(200).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = PhieuKiemKeXacMinhController;