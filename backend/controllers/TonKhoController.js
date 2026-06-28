const TonKho = require('../models/TonKho');

const TonKhoController = {
  getAll: async (req, res) => {
    try {
      const data = await TonKho.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy danh sách tồn kho", error: error.message });
    }
  },

  getSummary: async (req, res) => {
    try {
      const data = await TonKho.getSummary();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy tổng hợp tồn kho", error: error.message });
    }
  }
};

module.exports = TonKhoController;
