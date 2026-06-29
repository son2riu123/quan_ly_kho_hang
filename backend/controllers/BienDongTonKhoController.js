const BienDongTonKho = require("../models/BienDongTonKho");

const BienDongTonKhoController = {
  getAll: async (req, res) => {
    try {
      const data = await BienDongTonKho.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getByMa: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await BienDongTonKho.getByMa(id);
      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy biến động tồn kho" });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const result = await BienDongTonKho.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = BienDongTonKhoController;