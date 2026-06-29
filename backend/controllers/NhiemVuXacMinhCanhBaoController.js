const NhiemVuXacMinhCanhBao = require("../models/NhiemVuXacMinhCanhBao");

const NhiemVuXacMinhCanhBaoController = {
  getAll: async (req, res) => {
    try {
      const result = await NhiemVuXacMinhCanhBao.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const result = await NhiemVuXacMinhCanhBao.getByMa(req.params.id);
      if (result) res.status(200).json(result);
      else res.status(404).json({ message: "Không tìm thấy" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  create: async (req, res) => {
    try {
      await NhiemVuXacMinhCanhBao.create(req.body);
      res.status(201).json({ message: "Tạo nhiệm vụ xác minh thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  submitResult: async (req, res) => {
    try {
      const result = await NhiemVuXacMinhCanhBao.submitResult({
        ...req.body,
        MA_NHIEM_VU: req.params.id
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
module.exports = NhiemVuXacMinhCanhBaoController;
