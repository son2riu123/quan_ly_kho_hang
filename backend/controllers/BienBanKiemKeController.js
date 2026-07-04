const BienBanKiemKe = require("../models/BienBanKiemKe");

const BienBanKiemKeController = {
  // Lấy danh sách tất cả biên bản kiểm kê
  getAll: async (req, res) => {
    try {
      const data = await BienBanKiemKe.getAll();
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Lấy chi tiết một biên bản kiểm kê theo mã
  getById: async (req, res) => {
    try {
      const data = await BienBanKiemKe.getByMa(req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, message: "Không tìm thấy biên bản kiểm kê" });
      }
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Tạo mới Biên bản kèm theo danh sách chi tiết (Master-Detail)
  create: async (req, res) => {
    try {
      // Dữ liệu client gửi lên phải có cấu trúc:
      // { ...thông tin biên bản, chiTiet: [ {dòng 1}, {dòng 2}, ... ] }
      const data = req.body;
      
      if (!data.MA_BIEN_BAN_KIEM_KE || !data.chiTiet) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin biên bản hoặc chi tiết" });
      }

      const result = await BienBanKiemKe.create(data);
      res.status(201).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Xóa biên bản (Model đã xử lý xóa chi tiết trong transaction)
  delete: async (req, res) => {
    try {
      const result = await BienBanKiemKe.delete(req.params.id);
      res.status(200).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = BienBanKiemKeController;