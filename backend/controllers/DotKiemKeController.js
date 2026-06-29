const DotKiemKe = require("../models/DotKiemKe");

const DotKiemKeController = {
  getAll: async (req, res) => {
    try {
      const data = await DotKiemKe.getAll();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const result = await DotKiemKe.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const result = await DotKiemKe.update(req.params.id, req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const result = await DotKiemKe.delete(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = DotKiemKeController;