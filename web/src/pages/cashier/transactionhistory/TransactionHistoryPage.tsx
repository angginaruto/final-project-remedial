import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TransactionHistoryPage.css";

type TransactionItem = {
  id: number;
  productId: number;
  quantity: number;
  price: number | string;
  subtotal: number | string;
  product: {
    id: number;
    name: string;
  };
};

type Transaction = {
  id: number;
  totalAmount: number | string;
  paymentMethod: "CASH" | "DEBIT";
  cashReceived: number | string | null;
  changeAmount: number | string | null;
  cardLastFour: string | null;
  createdAt: string;
  items: TransactionItem[];
};

export default function TransactionHistoryPage() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/transaction?page=1&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setTransactions(result.data);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Gagal mengambil history transaksi",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
  <div className="th">
    <button
      className="th-back-btn"
      onClick={() => navigate("/cashier")}
    >
      <svg
        viewBox="0 0 16 16"
        width="13"
        height="13"
        fill="none"
      >
        <path
          d="M10 3 5 8l5 5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Kembali ke Dashboard
    </button>

    <header className="th-header">
      <div>
        <span className="th-eyebrow">CASHIER</span>
        <h1 className="th-title">Transaction History</h1>
      </div>

      <span className="th-count">
        {transactions.length} transaksi
      </span>
    </header>

    {loading ? (
      <div className="th-empty">
        <p>Loading...</p>
      </div>
    ) : transactions.length === 0 ? (
      <div className="th-empty">
        <p>Belum ada transaksi hari ini.</p>
      </div>
    ) : (
      <div className="th-table-wrap">
        <table className="th-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Waktu</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Detail</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="th-cell--mono th-cell--id">
                  #{transaction.id}
                </td>

                <td className="th-cell--date">
                  {formatDateTime(transaction.createdAt)}
                </td>

                <td className="th-cell--mono th-cell--total">
                  Rp{" "}
                  {Number(transaction.totalAmount).toLocaleString(
                    "id-ID",
                  )}
                </td>

                <td>
                  <span
                    className={`th-payment th-payment--${transaction.paymentMethod.toLowerCase()}`}
                  >
                    {transaction.paymentMethod}
                  </span>
                </td>

                <td>
                  <div className="th-items">
                    {transaction.items.map((item) => (
                      <div key={item.id} className="th-item">
                        <span className="th-item-name">
                          {item.product.name}
                        </span>
                        <span className="th-item-qty">
                          × {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>

                <td>
                  <button
                    className="th-detail-btn"
                    onClick={() =>
                      setSelectedTransaction(transaction)
                    }
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {selectedTransaction && (
      <div className="th-modal-backdrop">
        <div className="th-modal">
          <div className="th-modal-header">
            <div>
              <span className="th-eyebrow">TRANSACTION</span>

              <h2 className="th-modal-title">
                Detail Transaksi #{selectedTransaction.id}
              </h2>
            </div>

            <button
              className="th-close-btn"
              onClick={() => setSelectedTransaction(null)}
              aria-label="Tutup"
            >
              ×
            </button>
          </div>

          <div className="th-modal-info">
            <div className="th-info-item">
              <span>Waktu</span>
              <strong>
                {formatDateTime(selectedTransaction.createdAt)}
              </strong>
            </div>

            <div className="th-info-item">
              <span>Payment</span>
              <strong>
                {selectedTransaction.paymentMethod}
              </strong>
            </div>
          </div>

          <div className="th-detail-section">
            <h3 className="th-section-title">Items</h3>

            <div className="th-detail-items">
              {selectedTransaction.items.map((item) => (
                <div
                  key={item.id}
                  className="th-detail-item"
                >
                  <div>
                    <p className="th-detail-product">
                      {item.product.name}
                    </p>

                    <span className="th-detail-quantity">
                      {item.quantity} × Rp{" "}
                      {Number(item.price).toLocaleString(
                        "id-ID",
                      )}
                    </span>
                  </div>

                  <span className="th-detail-subtotal">
                    Rp{" "}
                    {Number(item.subtotal).toLocaleString(
                      "id-ID",
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="th-total">
            <span>Total</span>

            <strong>
              Rp{" "}
              {Number(
                selectedTransaction.totalAmount,
              ).toLocaleString("id-ID")}
            </strong>
          </div>

          {selectedTransaction.paymentMethod === "CASH" && (
            <div className="th-payment-info">
              <div>
                <span>Uang diterima</span>
                <strong>
                  Rp{" "}
                  {Number(
                    selectedTransaction.cashReceived ?? 0,
                  ).toLocaleString("id-ID")}
                </strong>
              </div>

              <div>
                <span>Kembalian</span>
                <strong>
                  Rp{" "}
                  {Number(
                    selectedTransaction.changeAmount ?? 0,
                  ).toLocaleString("id-ID")}
                </strong>
              </div>
            </div>
          )}

          {selectedTransaction.paymentMethod === "DEBIT" && (
            <div className="th-card-info">
              <span>Kartu</span>
              <strong>
                ****{" "}
                {selectedTransaction.cardLastFour ?? "----"}
              </strong>
            </div>
          )}

          <div className="th-modal-footer">
            <button
              className="th-close-modal-btn"
              onClick={() => setSelectedTransaction(null)}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}