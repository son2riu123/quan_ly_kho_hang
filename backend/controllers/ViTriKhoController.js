const ViTriKho = require('../models/ViTriKho');

const ViTriKhoController = {
  getAll: async (req, res) => {
    try {
      const data = await ViTriKho.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy danh sách vị trí kho", error: error.message });
    }
  },

  getByMa: async (req, res) => {
    try {
      const data = await ViTriKho.getByMa(req.params.id);
      if (!data) return res.status(404).json({ message: "Không tìm thấy vị trí kho" });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy vị trí kho", error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const result = await ViTriKho.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Lỗi tạo vị trí kho", error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const result = await ViTriKho.update(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Lỗi cập nhật vị trí kho", error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const result = await ViTriKho.delete(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Lỗi xóa vị trí kho", error: error.message });
    }
  }
};

module.exports = ViTriKhoController;
