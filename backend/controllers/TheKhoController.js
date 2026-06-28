const TheKho = require('../models/TheKho');

const TheKhoController = {
  getAllCards: async (req, res) => {
    try {
      const data = await TheKho.getAllCards();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy danh sách thẻ kho", error: error.message });
    }
  },

  getCardDetails: async (req, res) => {
    try {
      const data = await TheKho.getCardDetails(req.params.id);
      if (!data) return res.status(404).json({ message: "Không tìm thấy thẻ kho" });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy chi tiết thẻ kho", error: error.message });
    }
  },

  createCard: async (req, res) => {
    try {
      const result = await TheKho.createCard(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Lỗi mở thẻ kho", error: error.message });
    }
  },

  addLogEntry: async (req, res) => {
    try {
      const result = await TheKho.addLogEntry(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Lỗi ghi nhận dòng thẻ kho", error: error.message });
    }
  }
};

module.exports = TheKhoController;
