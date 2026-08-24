import type { Product } from "../types";
import "./ProductGrid.css";

type ProductGridProps = {
  products: Product[];
  loading: boolean;
  search: string;
  setSearch: (value: string) => void;
  onSearch: () => void;
  onAddToCart: (product: Product) => void;
};

const LOW_STOCK_THRESHOLD = 5;

export function ProductGrid({
  products,
  loading,
  search,
  setSearch,
  onSearch,
  onAddToCart,
}: ProductGridProps) {
  return (
    <div className="pg">
      <div className="pg-search">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
        <button className="pg-search-btn" onClick={onSearch}>
          Search
        </button>
      </div>

      <h2 className="pg-title">Produk</h2>

      {loading ? (
        <div className="pg-state">Loading...</div>
      ) : products.length === 0 ? (
        <div className="pg-state">Produk tidak ditemukan.</div>
      ) : (
        <div className="pg-grid">
          {products.map((product) => {
            const outOfStock = product.stock <= 0;
            const lowStock = !outOfStock && product.stock <= LOW_STOCK_THRESHOLD;

            return (
              <div
                key={product.id}
                className={`pg-card ${outOfStock ? "pg-card--out" : ""}`}
              >
                <div className="pg-card-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="pg-card-image-empty">No Image</div>
                  )}

                  {outOfStock && <span className="pg-card-overlay">Stock Habis</span>}

                  {lowStock && <span className="pg-badge pg-badge--low">Sisa {product.stock}</span>}
                </div>

                <div className="pg-card-body">
                  <span className="pg-card-category">{product.category.name}</span>
                  <h3 className="pg-card-name">{product.name}</h3>
                  <span className="pg-card-price">
                    Rp {Number(product.price).toLocaleString("id-ID")}
                  </span>
                </div>

                <button
                  className="pg-add-btn"
                  disabled={outOfStock}
                  onClick={() => onAddToCart(product)}
                >
                  {outOfStock ? "Stock Habis" : "Tambah"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}