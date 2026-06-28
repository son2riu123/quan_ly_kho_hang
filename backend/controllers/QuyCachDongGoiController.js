const QuyCachDongGoi = require("../models/QuyCachDongGoi");

const QuyCachDongGoiController = {
  getAll: async (req, res) => {
    try {
      const data = await QuyCachDongGoi.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getByMa: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await QuyCachDongGoi.getByMa(id);
      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy quy cách đóng gói" });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const result = await QuyCachDongGoi.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await QuyCachDongGoi.update(id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy quy cách đóng gói để cập nhật" });
      }
      res.status(200).json({ message: result.message });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await QuyCachDongGoi.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy quy cách đóng gói để xóa" });
      }
      res.status(200).json({ message: result.message });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = QuyCachDongGoiController;