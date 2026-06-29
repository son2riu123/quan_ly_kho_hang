const PhieuBaoCaoHangLoi = require("../models/PhieuBaoCaoHangLoi");

const PhieuBaoCaoHangLoiController = {
  getAll: async (req, res) => {
    try {
      const data = await PhieuBaoCaoHangLoi.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getByMa: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await PhieuBaoCaoHangLoi.getByMa(id);
      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy phiếu báo cáo hàng lỗi" });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const result = await PhieuBaoCaoHangLoi.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await PhieuBaoCaoHangLoi.update(id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy phiếu báo cáo hàng lỗi để cập nhật" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await PhieuBaoCaoHangLoi.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy phiếu báo cáo hàng lỗi để xóa" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = PhieuBaoCaoHangLoiController;