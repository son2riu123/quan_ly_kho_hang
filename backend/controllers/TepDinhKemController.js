const TepDinhKem = require("../models/TepDinhKem");
const fs = require("fs"); // Để xóa file vật lý trên server

const TepDinhKemController = {

  getAll: async (req, res) => {
    try {
      const data = await TepDinhKem.getAll();
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  getByDoiTuong: async (req, res) => {
    try {
      const { loai, ma } = req.query; 
      const data = await TepDinhKem.getByDoiTuong(loai, ma);
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  create: async (req, res) => {
    try {

      const result = await TepDinhKem.create(req.body);
      res.status(201).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  delete: async (req, res) => {
    try {
      const tep = await TepDinhKem.getByMa(req.params.id);
      if (!tep) return res.status(404).json({ success: false, message: "Không tìm thấy tệp" });

      // 1. Xóa file vật lý trên server
      if (fs.existsSync(tep.DUONG_DAN)) {
        fs.unlinkSync(tep.DUONG_DAN);
      }


      const result = await TepDinhKem.delete(req.params.id);
      res.status(200).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = TepDinhKemController;