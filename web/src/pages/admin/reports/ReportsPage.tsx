import { useNavigate } from "react-router-dom";
import "./ReportsPage.css";

export default function ReportsPage() {
  const navigate = useNavigate();

  return (
    <div className="rp">
      <div className="rp-inner">
      <span className="rp-eyebrow">Admin Panel</span>
      <h1 className="rp-title">Reports</h1>
      <p className="rp-subtitle">Pilih laporan yang ingin dilihat</p>

      <div className="rp-grid">
        <button
          className="rp-card"
          onClick={() => navigate("/admin/reports/shift")}
        >
          <div className="rp-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h3 className="rp-card-title">Shift Report</h3>
          <p className="rp-card-desc">Rekap kerja per shift kasir</p>

          <span className="rp-card-arrow">›</span>
        </button>

        <button
          className="rp-card"
          onClick={() => navigate("/admin/reports/daily")}
        >
          <div className="rp-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 3v18h18M7 15l4-4 3 3 5-6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h3 className="rp-card-title">Daily Sales Report</h3>
          <p className="rp-card-desc">Total penjualan harian</p>

          <span className="rp-card-arrow">›</span>
        </button>

        <button
          className="rp-card"
          onClick={() => navigate("/admin/reports/products")}
        >
          <div className="rp-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.5 7.3 12 12m0 0L3.5 7.3M12 12v9.5M12 2.5l8.5 4.8v9.4L12 21.5l-8.5-4.8V7.3L12 2.5z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h3 className="rp-card-title">Daily Product Sales</h3>
          <p className="rp-card-desc">Produk terjual per hari</p>

          <span className="rp-card-arrow">›</span>
        </button>
      </div>
      </div>
    </div>
  );
}