/**
 * Định dạng tiền tệ VND (Ví dụ: 1500000 -> 1.500.000 ₫)
 * @param {number} value - Giá trị số cần định dạng
 */
export const formatCurrency = (value) => {
  if (value === undefined || value === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};

/**
 * Định dạng ngày giờ chuẩn hiển thị thân thiện (Ví dụ: 2026-06-29T12:00:00 -> 29/06/2026 12:00)
 * @param {string|Date} dateString - Chuỗi ngày giờ
 * @param {boolean} includeTime - Có bao gồm giờ phút hay không
 */
export const formatDate = (dateString, includeTime = true) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  if (!includeTime) {
    return `${day}/${month}/${year}`;
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Định dạng chỉ ngày (không kèm giờ)
 */
export const formatOnlyDate = (dateString) => {
  return formatDate(dateString, false);
};
