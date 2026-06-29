const CauHinhDinhMucTon = require("../models/CauHinhDinhMucTon");

const CauHinhDinhMucTonController = {
  getAll: async (req, res) => {
    try {
      const result = await CauHinhDinhMucTon.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const result = await CauHinhDinhMucTon.getByMa(req.params.id);
      if (result) res.status(200).json(result);
      else res.status(404).json({ message: "Không tìm thấy" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  create: async (req, res) => {
    try {
      await CauHinhDinhMucTon.create(req.body);
      res.status(201).json({ message: "Tạo cấu hình định mức thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
module.exports = CauHinhDinhMucTonController;
