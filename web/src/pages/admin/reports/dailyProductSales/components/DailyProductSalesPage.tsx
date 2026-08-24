import { useDailyProductSales } from "../hooks/useDailyProductSales";
import "./DailyProductSalesPage.css";
import { useNavigate } from "react-router-dom";

export default function DailyProductSalesPage() {
  const navigate = useNavigate()
  const {
    reports,
    loading,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    fetchReports,
    resetFilter,
    totalQuantity,
    totalSales,
  } = useDailyProductSales();

  return (
    <div className="dps">
      <button className="dsr-btn dsr-btn--ghost margin-bottom: 20px; " onClick={() => navigate("/admin/reports") }>Back</button>
      <header className="dps-header">
        <h1 className="dps-title">Daily Product Sales</h1>
      </header>

      <div className="dps-filter">
        <div className="dps-filter-field">
          <label>Mulai tanggal</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="dps-filter-field">
          <label>Sampai tanggal</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="dps-filter-actions">
          <button className="dps-btn dps-btn--primary" onClick={() => fetchReports()}>
            Filter
          </button>
          <button className="dps-btn dps-btn--ghost" onClick={resetFilter}>
            Reset
          </button>
        </div>
      </div>

      {!loading && reports.length > 0 && (
        <div className="dps-summary">
          <div className="dps-summary-item">
            <span className="dps-summary-label">Total Terjual</span>
            <span className="dps-summary-value">
              {totalQuantity.toLocaleString("id-ID")} unit
            </span>
          </div>
          <div className="dps-summary-divider" />
          <div className="dps-summary-item">
            <span className="dps-summary-label">Total Penjualan</span>
            <span className="dps-summary-value dps-summary-value--accent">
              Rp {totalSales.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="dps-state">Loading...</div>
      ) : reports.length === 0 ? (
        <div className="dps-state">Belum ada data penjualan produk.</div>
      ) : (
        <div className="dps-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Produk</th>
                <th>Jumlah Terjual</th>
                <th>Total Penjualan</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr key={`${report.date}-${report.productId}`}>
                  <td className="dps-cell--mono dps-cell--date">
                    {new Date(`${report.date}T00:00:00`).toLocaleDateString("id-ID")}
                  </td>
                  <td className="dps-cell--name">{report.productName}</td>
                  <td className="dps-cell--mono">{report.quantitySold}</td>
                  <td className="dps-cell--mono dps-cell--sales">
                    Rp {report.totalSales.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}