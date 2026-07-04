const HoSoXuLyHangLoi = require("../models/HoSoXuLyHangLoi");

const HoSoXuLyHangLoiController = {

  getAll: async (req, res) => {
    try {
      const data = await HoSoXuLyHangLoi.getAll();
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  getByMa: async (req, res) => {
    try {
      const data = await HoSoXuLyHangLoi.getByMa(req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ xử lý hàng lỗi" });
      }
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  create: async (req, res) => {
    try {
      const result = await HoSoXuLyHangLoi.create(req.body);
      res.status(201).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  update: async (req, res) => {
    try {
      const result = await HoSoXuLyHangLoi.update(req.params.id, req.body);
      res.status(200).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  delete: async (req, res) => {
    try {
      const result = await HoSoXuLyHangLoi.delete(req.params.id);
      res.status(200).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = HoSoXuLyHangLoiController;