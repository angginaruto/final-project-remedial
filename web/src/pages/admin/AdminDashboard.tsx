import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const menuItems = [
  {
    label: "Cashier",
    description: "Kelola kasir dan shift kerja",
    path: "/admin/cashiers",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Products",
    description: "Atur data produk dan stok",
    path: "/admin/products",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path
          d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M4 8.5 12 13l8-4.5M12 13v7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Reports",
    description: "Lihat laporan penjualan & shift",
    path: "/admin/reports",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path
          d="M5 20V10M12 20V4M19 20v-7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="ad">
      <header className="ad-header">
        <span className="ad-eyebrow">Admin Panel</span>
        <h1 className="ad-title">Dashboard</h1>
        <p className="ad-subtitle">Pilih menu yang ingin dikelola</p>
      </header>

      <div className="ad-grid">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className="ad-card"
            onClick={() => navigate(item.path)}
          >
            <span className="ad-card-icon">{item.icon}</span>
            <span className="ad-card-body">
              <span className="ad-card-label">{item.label}</span>
              <span className="ad-card-desc">{item.description}</span>
            </span>
            <span className="ad-card-arrow">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                <path
                  d="M6 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}