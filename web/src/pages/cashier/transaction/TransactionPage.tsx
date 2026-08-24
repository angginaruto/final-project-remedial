import { useNavigate } from "react-router-dom";
import { useProductSearch } from "./hooks/useProductSearch";
import { useCart } from "./hooks/useCart";
import { usePayment } from "./hooks/usePayment";
import { ProductGrid } from "./components/ProductGrid";
import { CartSummary } from "./components/CartSummary";
import { PaymentPanel } from "./components/PaymentPanel";
import "./TransactionPage.css";

export default function TransactionPage() {
  const navigate = useNavigate();

  const { products, search, setSearch, loading, loadProducts } = useProductSearch();
  const { cart, addToCart, increaseQuantity, decreaseQuantity, getTotal, clearCart } =
    useCart();

  const {
    preview,
    paymentMethod,
    setPaymentMethod,
    cashReceived,
    setCashReceived,
    cardNumber,
    setCardNumber,
    requestPreview,
    confirmCash,
    confirmDebit,
  } = usePayment(clearCart);

  return (
    <div className="tx">
      <div className="tx-inner">
        <button className="tx-back-btn" onClick={() => navigate("/cashier")}>
          ← Kembali ke Dashboard
        </button>

        <div className="tx-header">
          <span className="tx-eyebrow">Kasir</span>
          <h1 className="tx-title">Transaksi</h1>
        </div>

        <div className="tx-layout">
          <div className="tx-main">
            <ProductGrid
              products={products}
              loading={loading}
              search={search}
              setSearch={setSearch}
              onSearch={loadProducts}
              onAddToCart={addToCart}
            />
          </div>

          <div className="tx-side">
            <CartSummary
              cart={cart}
              total={getTotal()}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onCheckout={() => requestPreview(cart)}
            />

            {preview && (
              <PaymentPanel
                preview={preview}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                cashReceived={cashReceived}
                setCashReceived={setCashReceived}
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                onConfirmCash={confirmCash}
                onConfirmDebit={confirmDebit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}