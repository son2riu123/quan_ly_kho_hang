const PhieuNhapKho = require('../models/PhieuNhapKho');
const inventoryService = require('../services/inventoryService');
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
      // 1. Lưu thông tin Phiếu Nhập Kho (Giao dịch 1)
      const result = await PhieuNhapKho.create(req.body);
      
      // 2. Kích hoạt giao dịch cập nhật Tồn kho liên hoàn (Giao dịch 2)
      // Lấy người ghi từ JWT token nếu có (mặc định NV_ADMIN để tránh lỗi nếu test ko token)
      const nguoiGhi = req.user ? req.user.maNhanVien : 'NV_ADMIN'; 
      await inventoryService.processImport(req.body, nguoiGhi);

      res.status(201).json({ ...result, message: "Nhập kho và cập nhật thẻ kho thành công!" });
    } catch (error) {
      console.error("SQL ERROR:", error);
      res.status(500).json({ message: "Lỗi tạo phiếu nhập kho hoặc cập nhật tồn", error: error.message });
    }
  }
};

module.exports = PhieuNhapKhoController;
