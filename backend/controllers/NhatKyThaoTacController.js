const NhatKyThaoTac = require("../models/NhatKyThaoTac");

const NhatKyThaoTacController = {

  getAll: async (req, res) => {
    try {
      const data = await NhatKyThaoTac.getAll();
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  getById: async (req, res) => {
    try {
      const data = await NhatKyThaoTac.getByMa(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: "Không tìm thấy log" });
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getByNguoi: async (req, res) => {
    try {
      const data = await NhatKyThaoTac.getByNguoi(req.params.nguoiThaoTac);
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  getByDoiTuong: async (req, res) => {
    try {
      const { loai, ma } = req.query;
      const data = await NhatKyThaoTac.getByDoiTuong(loai, ma);
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  create: async (req, res) => {
    try {
      const result = await NhatKyThaoTac.create(req.body);
      res.status(201).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = NhatKyThaoTacController;