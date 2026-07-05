const BienBanGiaoNhan = require("../models/BienBanGiaoNhan");

const BienBanGiaoNhanController = {
  getAll: async (req, res) => {
    try {
      const data = await BienBanGiaoNhan.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getByMa: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await BienBanGiaoNhan.getByMa(id);
      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy biên bản giao nhận" });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      console.log("BBGN payload received:", req.body);
      const result = await BienBanGiaoNhan.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error("SQL ERROR in BBGN create:", error);
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await BienBanGiaoNhan.update(id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy biên bản giao nhận để cập nhật" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await BienBanGiaoNhan.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy biên bản giao nhận để xóa" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = BienBanGiaoNhanController;