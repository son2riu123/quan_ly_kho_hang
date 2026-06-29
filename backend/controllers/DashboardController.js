const Dashboard = require('../models/Dashboard');

const DashboardController = {
  getStats: async (req, res) => {
    try {
      const data = await Dashboard.getStats();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy thống kê dashboard", error: error.message });
    }
  }
};

module.exports = DashboardController;
