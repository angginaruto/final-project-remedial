import type { PaymentMethod, TransactionPreview } from "../types";
import "./PaymentPanel.css";

type PaymentPanelProps = {
  preview: TransactionPreview;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  cashReceived: string;
  setCashReceived: (value: string) => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  onConfirmCash: () => void;
  onConfirmDebit: () => void;
};

export function PaymentPanel({
  preview,
  paymentMethod,
  setPaymentMethod,
  cashReceived,
  setCashReceived,
  cardNumber,
  setCardNumber,
  onConfirmCash,
  onConfirmDebit,
}: PaymentPanelProps) {
  const change = Number(cashReceived) - preview.totalAmount;
  const isShort = cashReceived !== "" && change < 0;

  // PERBAIKAN: Tipe data event diperjelas untuk TypeScript yang aman
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const limitedValue = rawValue.slice(0, 16);
    setCardNumber(limitedValue);
  };

  return (
    <div className="pmt">
      <h2 className="pmt-title">Preview Transaksi</h2>

      <div className="pmt-items">
        {preview.items.map((item) => (
          <div className="pmt-item" key={item.productId}>
            <div className="pmt-item-info">
              <span className="pmt-item-name">{item.name}</span>
              <span className="pmt-item-meta">
                {item.quantity} × Rp {Number(item.price).toLocaleString("id-ID")}
              </span>
            </div>
            <span className="pmt-item-subtotal">
              Rp {Number(item.subtotal).toLocaleString("id-ID")}
            </span>
          </div>
        ))}
      </div>

      <div className="pmt-total-row">
        <span>Total</span>
        <span className="pmt-total-value">
          Rp {Number(preview.totalAmount).toLocaleString("id-ID")}
        </span>
      </div>

      <div className="pmt-method-switch">
        <button
          className={`pmt-method-btn ${paymentMethod === "CASH" ? "pmt-method-btn--active" : ""}`}
          onClick={() => setPaymentMethod("CASH")}
        >
          Cash
        </button>
        <button
          className={`pmt-method-btn ${paymentMethod === "DEBIT" ? "pmt-method-btn--active" : ""}`}
          onClick={() => setPaymentMethod("DEBIT")}
        >
          Debit
        </button>
      </div>

      {paymentMethod === "CASH" && (
        <div className="pmt-form">
          <div className="pmt-field">
            <label>Uang Diterima</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              step={1000}
            />
          </div>

          {cashReceived && (
            <div className={`pmt-change ${isShort ? "pmt-change--short" : "pmt-change--ok"}`}>
              <span className="pmt-change-label">
                {isShort ? "Kurang" : "Kembalian"}
              </span>
              <span className="pmt-change-value">
                Rp {Math.abs(change).toLocaleString("id-ID")}
              </span>
            </div>
          )}

          <button
            className="pmt-confirm-btn"
            onClick={onConfirmCash}
            disabled={isShort || !cashReceived}
          >
            Konfirmasi Pembayaran
          </button>
        </div>
      )}

      {paymentMethod === "DEBIT" && (
        <div className="pmt-form">
          <div className="pmt-field">
            <label>Nomor Kartu Debit</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={handleChange} 
            />
          </div>

          <button 
            className="pmt-confirm-btn" 
            onClick={onConfirmDebit}
            disabled={cardNumber.replace(/\s/g, '').length < 16}           >
            Konfirmasi Pembayaran
          </button>
        </div>
      )}
    </div>
  );
}
