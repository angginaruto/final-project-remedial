import { useShiftReport } from "../hooks/useShiftReport";
import { getDifferenceLabel, formatDateTime } from "../utils/shiftReport.utils";
import "./ShiftReportPage.css";
import { useNavigate } from "react-router-dom";

export default function ShiftReportPage() {
  const navigate = useNavigate()
//   const confimation = () => {
//     if(window.confirm("yakin mau kembali?")){
//         return navigate("/admin/reports")
//     }
//   }
  const {
    shifts,
    loading,
    date,
    setDate,
    fetchShifts,
    resetFilter,
    openCount,
    shortCount,
    totalTransactions,
  } = useShiftReport();

  return (
    <div className="srp">
    <button className="srp-btn srp-btn--ghost margin-bottom: 20px; " onClick={() => {navigate("/admin/reports")}}>Back</button>
      <header className="srp-header">
        <h1 className="srp-title">Shift Report</h1>
      </header>

      <div className="srp-filter">
        <div className="srp-filter-field">
          <label>Tanggal</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="srp-filter-actions">
          <button className="srp-btn srp-btn--primary" onClick={() => fetchShifts()}>
            Filter
          </button>
          <button className="srp-btn srp-btn--ghost" onClick={resetFilter}>
            Reset
          </button>
        </div>
      </div>

      {!loading && shifts.length > 0 && (
        <div className="srp-summary">
          <div className="srp-summary-item">
            <span className="srp-summary-label">Total Shift</span>
            <span className="srp-summary-value">{shifts.length}</span>
          </div>
          <div className="srp-summary-divider" />
          <div className="srp-summary-item">
            <span className="srp-summary-label">Sedang Berjalan</span>
            <span className="srp-summary-value">{openCount}</span>
          </div>
          <div className="srp-summary-divider" />
          <div className="srp-summary-item">
            <span className="srp-summary-label">Total Transaksi</span>
            <span className="srp-summary-value">{totalTransactions}</span>
          </div>
          <div className="srp-summary-divider" />
          <div className="srp-summary-item">
            <span className="srp-summary-label">Selisih Short</span>
            <span
              className={`srp-summary-value ${shortCount > 0 ? "srp-summary-value--warn" : "srp-summary-value--accent"}`}
            >
              {shortCount} shift
            </span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="srp-state">Loading...</div>
      ) : shifts.length === 0 ? (
        <div className="srp-state">Belum ada data shift.</div>
      ) : (
        <div className="srp-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Kasir</th>
                <th>Mulai</th>
                <th>Selesai</th>
                <th>Uang Awal</th>
                <th>Total Transaksi</th>
                <th>Debit</th>
                <th>Expected Cash</th>
                <th>Uang Akhir</th>
                <th>Selisih</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {shifts.map((shift) => {
                const diffLabel = getDifferenceLabel(shift.cashDifference);
                const diffValue = Number(shift.cashDifference ?? 0);

                return (
                  <tr key={shift.shiftId}>
                    <td className="srp-cell--name">{shift.cashier.name}</td>

                    <td className="srp-cell--mono srp-cell--muted">
                      {formatDateTime(shift.startedAt)}
                    </td>

                    <td className="srp-cell--mono srp-cell--muted">
                      {formatDateTime(shift.endedAt)}
                    </td>

                    <td className="srp-cell--mono">
                      Rp {Number(shift.initialCash).toLocaleString("id-ID")}
                    </td>

                    <td className="srp-cell--mono">{shift.totalTransactions ?? 0}</td>

                    <td className="srp-cell--mono">
                      Rp {Number(shift.totalDebit ?? 0).toLocaleString("id-ID")}
                    </td>

                    <td className="srp-cell--mono">
                      Rp {Number(shift.expectedCash ?? 0).toLocaleString("id-ID")}
                    </td>

                    <td className="srp-cell--mono">
                      Rp {Number(shift.finalCash ?? 0).toLocaleString("id-ID")}
                    </td>

                    <td>
                      <div className="srp-diff">
                        <span className="srp-cell--mono">
                          Rp {diffValue.toLocaleString("id-ID")}
                        </span>
                        <span className={`srp-badge srp-badge--${diffLabel.toLowerCase()}`}>
                          {diffLabel}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className={`srp-status srp-status--${shift.status.toLowerCase()}`}>
                        {shift.status}
                      </span>
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