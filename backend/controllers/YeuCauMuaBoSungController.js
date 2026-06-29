const YeuCauMuaBoSung = require("../models/YeuCauMuaBoSung");

const YeuCauMuaBoSungController = {
  getAll: async (req, res) => {
    try {
      const result = await YeuCauMuaBoSung.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  create: async (req, res) => {
    try {
      await YeuCauMuaBoSung.create(req.body);
      res.status(201).json({ message: "Tạo yêu cầu mua bổ sung thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateStatus: async (req, res) => {
    try {
      const { trangThai } = req.body;
      await YeuCauMuaBoSung.updateStatus(req.params.id, trangThai);
      res.status(200).json({ message: "Cập nhật trạng thái thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
module.exports = YeuCauMuaBoSungController;
