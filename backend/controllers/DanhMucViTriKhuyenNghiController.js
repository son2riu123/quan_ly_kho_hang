const DanhMucViTriKhuyenNghi = require("../models/DanhMucViTriKhuyenNghi");

const DanhMucViTriKhuyenNghiController = {
  getAll: async (req, res) => {
    try {
      const data = await DanhMucViTriKhuyenNghi.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getByMa: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await DanhMucViTriKhuyenNghi.getByMa(id);
      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy danh mục vị trí khuyến nghị" });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const result = await DanhMucViTriKhuyenNghi.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await DanhMucViTriKhuyenNghi.update(id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy danh mục vị trí khuyến nghị để cập nhật" });
      }
      res.status(200).json({ message: result.message });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await DanhMucViTriKhuyenNghi.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy danh mục vị trí khuyến nghị để xóa" });
      }
      res.status(200).json({ message: result.message });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = DanhMucViTriKhuyenNghiController;