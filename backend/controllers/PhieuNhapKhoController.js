const PhieuNhapKho = require('../models/PhieuNhapKho');

const PhieuNhapKhoController = {
  getAll: async (req, res) => {
    try {
      const data = await PhieuNhapKho.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy danh sách phiếu nhập kho", error: error.message });
    }
  },

  getByMa: async (req, res) => {
    try {
      const data = await PhieuNhapKho.getByMa(req.params.id);
      if (!data) return res.status(404).json({ message: "Không tìm thấy phiếu nhập kho" });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy thông tin phiếu nhập kho", error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const result = await PhieuNhapKho.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Lỗi tạo phiếu nhập kho", error: error.message });
    }
  }
};

module.exports = PhieuNhapKhoController;
