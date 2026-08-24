import { useDailySalesReport } from "../hooks/useDailySalesReport";
import "./DailySalesReportPage.css";
import { useNavigate } from "react-router-dom";

export default function DailySalesReportPage() {
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
    totalTransactions,
    totalSales,
    totalCash,
    totalDebit,
    cashShare,
  } = useDailySalesReport();

  return (
    <div className="dsr">
      <button className="dsr-btn dsr-btn--ghost margin-bottom: 20px; " onClick={() => navigate("/admin/reports") }>Back</button>
      <header className="dsr-header">
        <h1 className="dsr-title">Daily Sales Report</h1>
      </header>

      <div className="dsr-filter">
        <div className="dsr-filter-field">
          <label>Mulai tanggal</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="dsr-filter-field">
          <label>Sampai tanggal</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="dsr-filter-actions">
          <button className="dsr-btn dsr-btn--primary" onClick={() => fetchReports()}>
            Filter
          </button>
          <button className="dsr-btn dsr-btn--ghost" onClick={resetFilter}>
            Reset
          </button>
        </div>
      </div>

      {!loading && reports.length > 0 && (
        <div className="dsr-summary">
          <div className="dsr-summary-main">
            <div className="dsr-summary-item">
              <span className="dsr-summary-label">Total Transaksi</span>
              <span className="dsr-summary-value">
                {totalTransactions.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="dsr-summary-divider" />
            <div className="dsr-summary-item">
              <span className="dsr-summary-label">Total Penjualan</span>
              <span className="dsr-summary-value dsr-summary-value--accent">
                Rp {totalSales.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="dsr-split">
            <div className="dsr-split-labels">
              <span>Cash · Rp {totalCash.toLocaleString("id-ID")}</span>
              <span>Debit · Rp {totalDebit.toLocaleString("id-ID")}</span>
            </div>
            <div className="dsr-split-bar">
              <div className="dsr-split-bar-cash" style={{ width: `${cashShare}%` }} />
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="dsr-state">Loading...</div>
      ) : reports.length === 0 ? (
        <div className="dsr-state">Belum ada data penjualan.</div>
      ) : (
        <div className="dsr-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Total Transaksi</th>
                <th>Total Penjualan</th>
                <th>Cash / Debit</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => {
                const rowTotal = report.totalCash + report.totalDebit;
                const rowCashShare = rowTotal > 0 ? (report.totalCash / rowTotal) * 100 : 50;

                return (
                  <tr key={report.date}>
                    <td className="dsr-cell--mono dsr-cell--date">
                      {new Date(`${report.date}T00:00:00`).toLocaleDateString("id-ID")}
                    </td>

                    <td className="dsr-cell--mono">{report.totalTransactions}</td>

                    <td className="dsr-cell--mono dsr-cell--sales">
                      Rp {report.totalSales.toLocaleString("id-ID")}
                    </td>

                    <td>
                      <div className="dsr-row-split">
                        <div className="dsr-row-split-bar">
                          <div
                            className="dsr-row-split-bar-cash"
                            style={{ width: `${rowCashShare}%` }}
                          />
                        </div>
                        <div className="dsr-row-split-values">
                          <span className="dsr-cell--mono">
                            Rp {report.totalCash.toLocaleString("id-ID")}
                          </span>
                          <span className="dsr-cell--mono dsr-row-split-debit">
                            Rp {report.totalDebit.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}