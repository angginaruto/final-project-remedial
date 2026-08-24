import type { CartItem } from "../types";
import "./CartSummary.css";

type CartSummaryProps = {
  cart: CartItem[];
  total: number;
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onCheckout: () => void;
};

export function CartSummary({
  cart,
  total,
  onIncrease,
  onDecrease,
  onCheckout,
}: CartSummaryProps) {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="cs">
      <div className="cs-header">
        <h2 className="cs-title">Cart</h2>
        {cart.length > 0 && <span className="cs-count">{itemCount} item</span>}
      </div>

      {cart.length === 0 ? (
        <div className="cs-empty">
          <span className="cs-empty-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
              <path
                d="M4 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="21" r="1.4" fill="currentColor" />
              <circle cx="17" cy="21" r="1.4" fill="currentColor" />
            </svg>
          </span>
          <p>Cart masih kosong.</p>
        </div>
      ) : (
        <>
          <div className="cs-items">
            {cart.map((item) => (
              <div className="cs-item" key={item.product.id}>
                <div className="cs-item-info">
                  <strong className="cs-item-name">{item.product.name}</strong>
                  <span className="cs-item-price">
                    Rp {Number(item.product.price).toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="cs-stepper">
                  <button
                    className="cs-stepper-btn"
                    onClick={() => onDecrease(item.product.id)}
                    aria-label={`Kurangi ${item.product.name}`}
                  >
                    −
                  </button>
                  <span className="cs-stepper-qty">{item.quantity}</span>
                  <button
                    className="cs-stepper-btn"
                    onClick={() => onIncrease(item.product.id)}
                    aria-label={`Tambah ${item.product.name}`}
                  >
                    +
                  </button>
                </div>

                <span className="cs-item-subtotal">
                  Rp {(Number(item.product.price) * item.quantity).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>

          <div className="cs-footer">
            <div className="cs-total-row">
              <span>Total</span>
              <span className="cs-total-value">Rp {total.toLocaleString("id-ID")}</span>
            </div>

            <button className="cs-checkout-btn" onClick={onCheckout}>
              Lanjut Pembayaran
            </button>
          </div>
        </>
      )}
    </div>
  );
}