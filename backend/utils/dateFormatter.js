const dateFormatter = {
  /**
   * Chuyển đổi ngày giờ Javascript sang chuẩn DATETIME2 của SQL Server
   * Nhằm loại bỏ các lỗi sai múi giờ khi lưu vào DB.
   * @param {Date|string} dateObj Đối tượng Date hoặc chuỗi ngày
   * @returns {string} Chuỗi format YYYY-MM-DD HH:mm:ss
   */
  formatForSQL: (dateObj) => {
    if (!dateObj) return null;
    const d = new Date(dateObj);
    if (isNaN(d.getTime())) return null;

    const pad = (num) => String(num).padStart(2, '0');
    
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
};

module.exports = dateFormatter;
