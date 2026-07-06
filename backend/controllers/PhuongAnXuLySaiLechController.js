const PhuongAnXuLySaiLech = require("../models/PhuongAnXuLySaiLech");

const PhuongAnXuLySaiLechController = {
  getByHoSo: async (req, res) => {
    try {
      const { maHoSo } = req.params;
      const data = await PhuongAnXuLySaiLech.getByHoSo(maHoSo);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const { phuongAn, nhiemVu } = req.body;
      const result = await PhuongAnXuLySaiLech.create(phuongAn, nhiemVu);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = PhuongAnXuLySaiLechController;