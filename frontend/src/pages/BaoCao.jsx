import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { 
  Search, 
  TrendingUp, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  AlertTriangle, 
  ClipboardCheck, 
  Loader2, 
  Printer, 
  Calendar,
  Download
} from 'lucide-react';

function BaoCao() {
  const [activeTab, setActiveTab] = useState('nxt'); // 'nxt', 'canhbao', 'discrepancy'
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Data states
  const [nxtData, setNxtData] = useState([]);
  const [canhBaos, setCanhBaos] = useState([]);
  const [dotsKiemKe, setDotsKiemKe] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, biendongRes, canhbaoRes, dotsRes, itemsRes] = await Promise.all([
        api.get('/tonkho/summary'),
        api.get('/bien-dong-ton-kho').catch(() => ({ data: [] })),
        api.get('/canh-bao-ton-kho').catch(() => ({ data: [] })),
        api.get('/kiemke/dot').catch(() => ({ data: [] })),
        api.get('/mathang')
      ]);

      const summaryList = summaryRes.data || [];
      const biendongs = biendongRes.data || [];
      const items = itemsRes.data || [];

      // Tính toán Nhập - Xuất - Tồn động từ lịch sử biến động
      const computedNXT = items.map(item => {
        const maMatHangTrim = item.MA_MAT_HANG.trim();
        
        // Tồn cuối kỳ hiện tại
        const stockSummary = summaryList.find(s => s.MA_MAT_HANG.trim() === maMatHangTrim);
        const tonCuoi = stockSummary ? stockSummary.TONG_SO_LUONG : 0;

        // Tổng nhập trong kỳ (Biến động loại "Nhập")
        const tongNhap = biendongs
          .filter(bd => bd.MA_MAT_HANG.trim() === maMatHangTrim && (bd.LOAI_BIEN_DONG === 'Nhập' || bd.LOAI_BIEN_DONG === 'Nhập kho'))
          .reduce((sum, bd) => sum + (bd.SO_LUONG || 0), 0);

        // Tổng xuất trong kỳ (Biến động loại "Xuất")
        const tongXuat = biendongs
          .filter(bd => bd.MA_MAT_HANG.trim() === maMatHangTrim && (bd.LOAI_BIEN_DONG === 'Xuất' || bd.LOAI_BIEN_DONG === 'Xuất kho'))
          .reduce((sum, bd) => sum + (bd.SO_LUONG || 0), 0);

        // Tồn đầu kỳ = Tồn cuối - Nhập + Xuất
        const tonDau = tonCuoi - tongNhap + tongXuat;

        return {
          MA_MAT_HANG: item.MA_MAT_HANG,
          TEN_MAT_HANG: item.TEN_MAT_HANG,
          NHOM_HANG: item.NHOM_HANG,
          TON_DAU: tonDau,
          NHAP: tongNhap,
          XUAT: tongXuat,
          TON_CUOI: tonCuoi
        };
      });

      setNxtData(computedNXT);
      setCanhBaos(canhbaoRes.data || []);
      setDotsKiemKe(dotsRes.data || []);
      setProducts(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleGlobalSearch = (e) => { setSearch(e.detail || ''); };
    window.addEventListener('global-search', handleGlobalSearch);
    return () => window.removeEventListener('global-search', handleGlobalSearch);
  }, []);

  const exportToExcel = (reportType) => {
    let headers = [];
    let rows = [];
    let title = '';
    let filename = '';

    if (reportType === 'nxt') {
      title = 'BÁO CÁO TỔNG HỢP NHẬP - XUẤT - TỒN KHO HÀNG';
      filename = 'Bao_cao_Nhap_Xuat_Ton.xls';
      headers = ['Mã sản phẩm', 'Tên sản phẩm', 'Nhóm hàng', 'Tồn đầu kỳ', 'Nhập trong kỳ', 'Xuất trong kỳ', 'Tồn cuối kỳ'];
      rows = filteredNxt.map(item => [
        item.MA_MAT_HANG.trim(),
        item.TEN_MAT_HANG,
        item.NHOM_HANG || '',
        item.TON_DAU,
        item.NHAP,
        item.XUAT,
        item.TON_CUOI
      ]);
    } else if (reportType === 'canhbao') {
      title = 'BÁO CÁO CẢNH BÁO ĐỊNH MỨC VÀ DATE TỒN KHO';
      filename = 'Bao_cao_Canh_bao_Ton_kho.xls';
      headers = ['Mã cảnh báo', 'Kho hàng', 'Mã sản phẩm', 'Tên sản phẩm', 'Loại cảnh báo', 'Mức độ', 'Số lượng hiện tại', 'Ngưỡng cảnh báo', 'Thời điểm phát sinh', 'Trạng thái', 'Mô tả'];
      const filteredCanhBao = canhBaos.filter(item =>
        (item.TEN_MAT_HANG || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.MA_MAT_HANG || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.LOAI_CANH_BAO || '').toLowerCase().includes(search.toLowerCase())
      );
      rows = filteredCanhBao.map(item => [
        item.MA_CANH_BAO.trim(),
        item.TEN_KHO,
        item.MA_MAT_HANG.trim(),
        item.TEN_MAT_HANG,
        item.LOAI_CANH_BAO,
        item.MUC_DO_UU_TIEN,
        item.SO_LUONG_HIEN_TAI,
        item.NGUONG_CANH_BAO || 0,
        new Date(item.THOI_DIEM_PHAT_SINH).toLocaleString('vi-VN'),
        item.TRANG_THAI_CANH_BAO,
        item.MO_TA || ''
      ]);
    } else if (reportType === 'discrepancy') {
      title = 'BÁO CÁO ĐỐI SOÁT SAI LỆCH KIỂM KÊ ĐỊNH KỲ';
      filename = 'Bao_cao_Doi_soat_Kiem_ke.xls';
      headers = ['Mã đợt', 'Tên đợt kiểm kê', 'Kho thực hiện', 'Loại kiểm kê', 'Phạm vi', 'Thời điểm bắt đầu', 'Trạng thái', 'Ghi chú'];
      const filteredDots = dotsKiemKe.filter(item =>
        (item.TEN_DOT_KIEM_KE || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.MA_DOT_KIEM_KE || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.TEN_KHO || '').toLowerCase().includes(search.toLowerCase())
      );
      rows = filteredDots.map(item => [
        item.MA_DOT_KIEM_KE.trim(),
        item.TEN_DOT_KIEM_KE,
        item.TEN_KHO,
        item.LOAI_KIEM_KE,
        item.PHAM_VI_KIEM_KE,
        new Date(item.THOI_DIEM_BAT_DAU).toLocaleString('vi-VN'),
        item.TRANG_THAI_DOT,
        item.GHI_CHU || ''
      ]);
    }

    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Báo Cáo</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          .header-org { font-family: 'Times New Roman', Arial; font-size: 12px; }
          .title { font-family: 'Times New Roman', Arial; font-size: 16px; font-weight: bold; text-align: center; }
          th { font-family: 'Times New Roman', Arial; background-color: #f2f2f2; font-weight: bold; border: 0.5px solid #000; text-align: center; }
          td { font-family: 'Times New Roman', Arial; border: 0.5px solid #000; text-align: left; }
          .number { text-align: right; }
          .center { text-align: center; }
        </style>
      </head>
      <body>
        <table style="width: 100%;">
          <tr>
            <td colspan="3" style="border: none;" class="header-org">
              <strong>TỔNG CÔNG TY KHO VẬN LOGISTICS</strong><br/>
              Bộ phận: Quản lý Kho bãi & Kiểm soát Chất lượng<br/>
              Địa chỉ: Đường số 4, Khu Công nghiệp Sóng Thần, Bình Dương
            </td>
            <td colspan="${headers.length - 3}" style="border: none;"></td>
          </tr>
          <tr><td colspan="${headers.length}" style="border: none; height: 20px;"></td></tr>
          <tr>
            <td colspan="${headers.length}" class="title" style="border: none;">
              ${title}<br/>
              <span style="font-size: 12px; font-weight: normal; font-style: italic;">Ngày xuất báo cáo: ${new Date().toLocaleString('vi-VN')}</span>
            </td>
          </tr>
          <tr><td colspan="${headers.length}" style="border: none; height: 10px;"></td></tr>
        </table>
        
        <table>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr>
                ${row.map((cell, idx) => {
                  let cellClass = '';
                  if (typeof cell === 'number') cellClass = 'class="number"';
                  else if (idx === 0 || cell === 'Chờ xử lý' || cell === 'Hoàn thành' || cell === 'Đang kiểm kê' || cell === 'Đang xác minh') cellClass = 'class="center"';
                  return `<td ${cellClass}>${cell !== null && cell !== undefined ? cell : ''}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <table style="width: 100%; margin-top: 40px;">
          <tr><td colspan="${headers.length}" style="border: none; height: 30px;"></td></tr>
          <tr>
            <td colspan="2" style="border: none; text-align: center; font-family: 'Times New Roman';">
              <strong>Người Lập Biểu</strong><br/>
              <span style="font-style: italic; font-size: 11px;">(Ký, ghi rõ họ tên)</span>
            </td>
            <td colspan="${headers.length - 4}" style="border: none;"></td>
            <td colspan="2" style="border: none; text-align: center; font-family: 'Times New Roman';">
              <strong>Thủ Kho Trưởng / Giám Đốc</strong><br/>
              <span style="font-style: italic; font-size: 11px;">(Ký tên và đóng dấu)</span>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = (reportTitle, elementId) => {
    const printContent = document.getElementById(elementId).innerHTML;
    const originalContent = document.body.innerHTML;

    const windowPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    windowPrint.document.write(`
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            body { font-family: 'Inter', 'Helvetica', Arial, sans-serif; padding: 30px; color: #333; }
            .header-org { text-align: left; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .header-org h2 { margin: 0; font-size: 16px; text-transform: uppercase; }
            .header-org p { margin: 3px 0 0 0; font-size: 12px; color: #666; }
            .report-title { text-align: center; margin: 30px 0; }
            .report-title h1 { margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 0.5px; }
            .report-title p { margin: 5px 0 0 0; font-style: italic; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; text-transform: uppercase; font-size: 11px; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .signature-block { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 60px; text-align: center; font-size: 13px; }
            .signature-box { height: 100px; display: flex; flex-direction: column; justify-content: space-between; }
            .signature-box strong { display: block; margin-bottom: 50px; }
          </style>
        </head>
        <body>
          <div class="header-org">
            <h2>TỔNG CÔNG TY KHO VẬN LOGISTICS</h2>
            <p>Bộ phận: Quản lý Kho bãi & Kiểm soát Chất lượng</p>
            <p>Địa chỉ: Đường số 4, Khu Công nghiệp Sóng Thần, Bình Dương</p>
          </div>
          <div class="report-title">
            <h1>${reportTitle.toUpperCase()}</h1>
            <p>Ngày xuất báo cáo: ${new Date().toLocaleString('vi-VN')}</p>
          </div>
          ${printContent}
          <div class="signature-block">
            <div class="signature-box">
              <strong>Người Lập Biểu</strong>
              <span>(Ký, ghi rõ họ tên)</span>
            </div>
            <div class="signature-box">
              <strong>Thủ Kho Trưởng</strong>
              <span>(Ký, ghi rõ họ tên)</span>
            </div>
            <div class="signature-box">
              <strong>Ban Giám Đốc Chi Nhánh</strong>
              <span>(Ký tên và đóng dấu)</span>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    windowPrint.document.close();
  };

  const filteredNxt = nxtData.filter(item =>
    (item.TEN_MAT_HANG || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.MA_MAT_HANG || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Báo cáo tổng hợp">
      <div className="page-header">
        <h2>Báo cáo tổng hợp & Mẫu chứng từ</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn ${activeTab === 'nxt' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('nxt'); setSearch(''); }}
          >
            Báo cáo Nhập-Xuất-Tồn (NXT)
          </button>
          <button 
            className={`btn ${activeTab === 'canhbao' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('canhbao'); setSearch(''); }}
          >
            Báo cáo Cảnh báo Tồn kho
          </button>
          <button 
            className={`btn ${activeTab === 'discrepancy' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('discrepancy'); setSearch(''); }}
          >
            Báo cáo Đối soát Kiểm kê
          </button>
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <Search className="data-table-search-icon" size={14} />
            <input 
              type="text" 
              placeholder="Tìm kiếm thông tin trong báo cáo..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn btn-secondary btn-sm" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#10b981', color: '#fff', border: 'none' }}
              onClick={() => exportToExcel(activeTab)}
            >
              <Download size={14} /> Xuất Excel báo cáo
            </button>
            <button 
              className="btn btn-secondary btn-sm" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => {
                const titles = {
                  nxt: 'Báo cáo Tổng hợp Nhập - Xuất - Tồn Kho hàng',
                  canhbao: 'Báo cáo Cảnh báo Định mức và Date Tồn kho',
                  discrepancy: 'Báo cáo Đối soát Sai lệch Kiểm kê Định kỳ'
                };
                handlePrint(titles[activeTab], `report-print-${activeTab}`);
              }}
            >
              <Printer size={14} /> In Mẫu Báo Cáo Chuẩn
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <Loader2 className="spinner" style={{ color: 'var(--primary)' }} />
          </div>
        ) : (
          <>
            {/* TAB 1: NHẬP XUẤT TỒN */}
            {activeTab === 'nxt' && (
              <div id="report-print-nxt">
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Mã sản phẩm</th>
                        <th>Tên sản phẩm</th>
                        <th>Nhóm hàng</th>
                        <th style={{ textAlign: 'right' }}>Tồn đầu kỳ</th>
                        <th style={{ textAlign: 'right', color: 'var(--success)' }}>Nhập trong kỳ</th>
                        <th style={{ textAlign: 'right', color: 'var(--danger)' }}>Xuất trong kỳ</th>
                        <th style={{ textAlign: 'right', fontWeight: 'bold' }}>Tồn cuối kỳ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNxt.map(item => (
                        <tr key={item.MA_MAT_HANG}>
                          <td><strong>{item.MA_MAT_HANG.trim()}</strong></td>
                          <td>{item.TEN_MAT_HANG}</td>
                          <td><span className="badge badge-info">{item.NHOM_HANG}</span></td>
                          <td style={{ textAlign: 'right' }}>{item.TON_DAU}</td>
                          <td style={{ textAlign: 'right', color: 'var(--success)', fontWeight: '500' }}>+{item.NHAP}</td>
                          <td style={{ textAlign: 'right', color: 'var(--danger)', fontWeight: '500' }}>-{item.XUAT}</td>
                          <td style={{ textAlign: 'right' }}><strong>{item.TON_CUOI}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: CẢNH BÁO TỒN KHO */}
            {activeTab === 'canhbao' && (
              <div id="report-print-canhbao">
                {canhBaos.length === 0 ? (
                  <div className="empty-state">
                    <AlertTriangle size={40} className="empty-state-icon" />
                    <div className="empty-state-text">Không có cảnh báo tồn kho nào hoạt động</div>
                  </div>
                ) : (
                  <div className="data-table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Mã cảnh báo</th>
                          <th>Mã sản phẩm</th>
                          <th>Loại cảnh báo</th>
                          <th>Mức độ</th>
                          <th style={{ textAlign: 'right' }}>Số lượng hiện tại</th>
                          <th style={{ textAlign: 'right' }}>Ngưỡng định mức</th>
                          <th>Thời điểm phát sinh</th>
                          <th>Mô tả chi tiết</th>
                        </tr>
                      </thead>
                      <tbody>
                        {canhBaos.filter(c => 
                          c.MA_CANH_BAO.toLowerCase().includes(search.toLowerCase()) ||
                          c.MA_MAT_HANG.toLowerCase().includes(search.toLowerCase())
                        ).map(item => (
                          <tr key={item.MA_CANH_BAO}>
                            <td><strong style={{ color: 'var(--primary)' }}>{item.MA_CANH_BAO.trim()}</strong></td>
                            <td>{item.MA_MAT_HANG}</td>
                            <td>{item.LOAI_CANH_BAO}</td>
                            <td>
                              <span className={`badge ${
                                item.MUC_DO_UU_TIEN === 'Cao' ? 'badge-danger' : 
                                item.MUC_DO_UU_TIEN === 'Trung bình' ? 'badge-warning' : 'badge-info'
                              }`}>
                                {item.MUC_DO_UU_TIEN}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}><strong>{item.SO_LUONG_HIEN_TAI}</strong></td>
                            <td style={{ textAlign: 'right' }}>{item.NGUONG_CANH_BAO || '---'}</td>
                            <td>{new Date(item.THOI_DIEM_PHAT_SINH).toLocaleString('vi-VN')}</td>
                            <td>{item.MO_TA}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ĐỐI SOÁT KIỂM KÊ */}
            {activeTab === 'discrepancy' && (
              <div id="report-print-discrepancy">
                {dotsKiemKe.length === 0 ? (
                  <div className="empty-state">
                    <ClipboardCheck size={40} className="empty-state-icon" />
                    <div className="empty-state-text">Chưa có dữ liệu đợt kiểm kê nào</div>
                  </div>
                ) : (
                  <div className="data-table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Mã đợt</th>
                          <th>Tên đợt kiểm kê</th>
                          <th>Kho thực hiện</th>
                          <th>Loại kiểm</th>
                          <th>Phạm vi</th>
                          <th>Bắt đầu</th>
                          <th>Trạng thái</th>
                          <th>Ghi chú</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dotsKiemKe.filter(d => 
                          d.TEN_DOT_KIEM_KE.toLowerCase().includes(search.toLowerCase()) ||
                          d.MA_DOT_KIEM_KE.toLowerCase().includes(search.toLowerCase())
                        ).map(item => (
                          <tr key={item.MA_DOT_KIEM_KE}>
                            <td><strong style={{ color: 'var(--primary)' }}>{item.MA_DOT_KIEM_KE.trim()}</strong></td>
                            <td>{item.TEN_DOT_KIEM_KE}</td>
                            <td>{item.TEN_KHO}</td>
                            <td>{item.LOAI_KIEM_KE}</td>
                            <td>{item.PHAM_VI_KIEM_KE}</td>
                            <td>{new Date(item.THOI_DIEM_BAT_DAU).toLocaleString('vi-VN')}</td>
                            <td>
                              <span className={`badge ${
                                item.TRANG_THAI_DOT === 'Đã hoàn thành' ? 'badge-success' : 'badge-warning'
                              }`}>
                                {item.TRANG_THAI_DOT}
                              </span>
                            </td>
                            <td>{item.GHI_CHU || '---'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default BaoCao;
