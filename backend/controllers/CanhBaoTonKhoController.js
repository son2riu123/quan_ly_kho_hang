const CanhBaoTonKho = require("../models/CanhBaoTonKho");

const CanhBaoTonKhoController = {
  getAll: async (req, res) => {
    try {
      const result = await CanhBaoTonKho.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const result = await CanhBaoTonKho.getByMa(req.params.id);
      if (result) res.status(200).json(result);
      else res.status(404).json({ message: "Không tìm thấy" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  create: async (req, res) => {
    try {
      await CanhBaoTonKho.create(req.body);
      res.status(201).json({ message: "Tạo cảnh báo thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
module.exports = CanhBaoTonKhoController;
