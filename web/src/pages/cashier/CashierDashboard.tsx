import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CashierDashboard.css";

type Shift = {
  id: number; cashierId: number;
  initialCash: number;
  finalCash: number | null;
  expectedCash: number | null;
  cashDifference: number | null;
  startedAt: string;
  endedAt: string | null;
  status: "OPEN" | "CLOSED";
};

export default function CashierDashboard() {
  const [shift, setShift] = useState<Shift | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialCash, setInitialCash] = useState("");
  const [showEndShiftForm, setShowEndShiftForm] = useState(false);
  const [finalCash, setFinalCash] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const fetchCurrentShift = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/shift/current`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.status === 404) {
        setShift(null);
        return;
      }

      if (!response.ok) {
        throw new Error(result.message);
      }

      setShift(result.data);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error ? error.message : "Gagal mengambil data shift",
      );
    } finally {
      setLoading(false);
    }
  };

  const startShift = async () => {
    const cash = Number(initialCash);

    if (!initialCash || cash < 0) {
      alert("Masukkan uang awal yang valid");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/shift/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          initialCash: cash,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      alert("Shift berhasil dimulai");

      setInitialCash("");
      setShift(result.data);
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Gagal memulai shift");
    }
  };

  const endShift = async () => {
    const cash = Number(finalCash);

    if (!finalCash || cash < 0) {
      alert("Masukkan uang akhir yang valid");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/shift/end`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          finalCash: cash,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      alert("Shift berhasil diakhiri");

      setFinalCash("");
      setShowEndShiftForm(false);
      setShift(null); // shift udah ditutup, balik ke tampilan "belum ada shift aktif"
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Gagal mengakhiri shift");
    }
  };

  useEffect(() => {
    fetchCurrentShift();
  }, []);

  if (loading) {
    return <div className="cd cd-loading">Loading...</div>;
  }

  return (
    <div className="cd">
      <div className="cd-inner">
      <header className="cd-header">
        <span className="cd-eyebrow">Kasir</span>
        <h1 className="cd-title">Dashboard</h1>
      </header>

      {!shift ? (
        <div className="cd-card">
          <h2 className="cd-card-title">Belum ada shift aktif</h2>
          <p className="cd-card-hint">
            Hitung uang di laci kasir, lalu mulai shift untuk mencatat
            transaksi.
          </p>

          <div className="cd-field">
            <label>Uang Awal</label>
            <input
              type="number"
              step={1000}
              value={initialCash}
              onChange={(e) => setInitialCash(e.target.value)}
              placeholder="Masukkan uang awal"
            />
          </div>

          <button
            className="cd-btn cd-btn--primary cd-btn--block"
            onClick={startShift}
          >
            Mulai Shift
          </button>
          <button className="cd-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="cd-card">
          <div className="cd-status-row">
            <h2 className="cd-card-title">Shift Aktif</h2>
            <span className="cd-status cd-status--open">{shift.status}</span>
          </div>

          <div className="cd-info-grid">
            <div className="cd-info-item">
              <span className="cd-info-label">Uang Awal</span>
              <span className="cd-info-value">
                Rp {Number(shift.initialCash).toLocaleString("id-ID")}
              </span>
            </div>
            <div className="cd-info-item">
              <span className="cd-info-label">Mulai</span>
              <span className="cd-info-value cd-info-value--sm">
                {new Date(shift.startedAt).toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="cd-actions">
            <button
              className="cd-btn cd-btn--primary cd-btn--block"
              onClick={() => navigate("/cashier/transaction")}
            >
              Mulai Transaksi
            </button>

            <button
              className="cd-btn cd-btn--ghost cd-btn--block"
              onClick={() => navigate("/cashier/transactions")}
            >
              Riwayat Transaksi
            </button>

            <button
              className="cd-btn cd-btn--danger-ghost cd-btn--block"
              onClick={() => setShowEndShiftForm(true)}
            >
              Akhiri Shift
            </button>
            <button className="cd-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {showEndShiftForm && (
            <div className="cd-modal-backdrop">
              <div className="cd-modal">
                <h3 className="cd-modal-title">Akhiri Shift</h3>
                {/* <p className="cd-card-hint">Uang awal nilainya sebagai berikut : {Number(shift.initialCash).toLocaleString("id-ID")}</p> */}
                <p className="cd-card-hint">
                  Hitung ulang uang fisik di laci kasir sebelum konfirmasi.
                </p>

                <div className="cd-field">
                  <label>Uang Akhir (hasil hitung fisik)</label>
                  <input
                    type="number"
                    value={finalCash}
                    onChange={(e) => setFinalCash(e.target.value)}
                    placeholder="Masukkan uang akhir di laci kasir"
                    step={1000}
                  />
                </div>

                <div className="cd-modal-actions">
                  <button className="cd-btn cd-btn--primary" onClick={endShift}>
                    Konfirmasi Akhiri Shift
                  </button>
                  <button
                    className="cd-btn cd-btn--ghost"
                    onClick={() => setShowEndShiftForm(false)}
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
            
          )}
        </div>
      )}
      </div>
    </div>
  );
}
