const CanhBaoTonKho = require("../models/CanhBaoTonKho");

const CanhBaoTonKhoController = {
  getAll: async (req, res) => {
    try {
      const result = await CanhBaoTonKho.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const result = await CanhBaoTonKho.getByMa(req.params.id);
      if (result) res.status(200).json(result);
      else res.status(404).json({ message: "Không tìm thấy" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  create: async (req, res) => {
    try {
      await CanhBaoTonKho.create(req.body);
      res.status(201).json({ message: "Tạo cảnh báo thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateStatus: async (req, res) => {
    try {
      const { trangThai } = req.body;
      await CanhBaoTonKho.updateStatus(req.params.id, trangThai);
      res.status(200).json({ message: "Cập nhật trạng thái thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getPendingPO: async (req, res) => {
    try {
      const alert = await CanhBaoTonKho.getByMa(req.params.id);
      if (!alert) return res.status(404).json({ message: "Không tìm thấy cảnh báo" });
      const pendingPOs = await CanhBaoTonKho.getPendingPO(alert.MA_MAT_HANG);
      res.status(200).json(pendingPOs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
module.exports = CanhBaoTonKhoController;
