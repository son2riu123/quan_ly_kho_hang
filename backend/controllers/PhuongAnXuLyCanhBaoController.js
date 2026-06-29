const PhuongAnXuLyCanhBao = require("../models/PhuongAnXuLyCanhBao");

const PhuongAnXuLyCanhBaoController = {
  getAll: async (req, res) => {
    try {
      const result = await PhuongAnXuLyCanhBao.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  create: async (req, res) => {
    try {
      await PhuongAnXuLyCanhBao.create(req.body);
      res.status(201).json({ message: "Tạo phương án xử lý thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
module.exports = PhuongAnXuLyCanhBaoController;
