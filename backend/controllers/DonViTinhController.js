const DonViTinh = require('../models/DonViTinh');

const DonViTinhController = {
  getAll: async (req, res) => {
    try {
      const data = await DonViTinh.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy danh sách đơn vị tính", error: error.message });
    }
  }
};

module.exports = DonViTinhController;
