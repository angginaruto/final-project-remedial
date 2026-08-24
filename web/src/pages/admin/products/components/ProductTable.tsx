import type { Pagination, Product } from "../types";
import "./ProductTable.css";

type ProductTableProps = {
  products: Product[];
  pagination: Pagination | null;
  page: number;
  setPage: (updater: (prev: number) => number) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
};

export function ProductTable({
  products,
  pagination,
  page,
  setPage,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="pt">
      <div className="pt-table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Stock</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="pt-empty">
                  Belum ada produk.
                </td>
              </tr>
            )}

            {products.map((product) => (
              <tr key={product.id}>
                <td className="pt-cell--mono pt-cell--id">{product.id}</td>
                <td className="pt-cell--name">{product.name}</td>
                <td>{product.category.name}</td>
                <td className="pt-cell--mono pt-cell--price">
                  Rp {Number(product.price).toLocaleString("id-ID")}
                </td>
                <td className="pt-cell--mono">{product.stock}</td>
                <td>
                  {product.image ? (
                    <img
                      className="pt-thumb"
                      src={product.image}
                      alt={product.name}
                    />
                  ) : (
                    <div className="pt-thumb-empty">—</div>
                  )}
                </td>
                <td>
                  <div className="pt-actions">
                    <button
                      className="pt-action-btn pt-action-btn--edit"
                      onClick={() => onEdit(product)}
                    >
                      <svg viewBox="0 0 16 16" width="13" height="13" fill="none">
                        <path
                          d="M11.5 2.5a1.4 1.4 0 0 1 2 2L5 13l-3 1 1-3 8.5-8.5Z"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      className="pt-action-btn pt-action-btn--danger"
                      onClick={() => onDelete(product.id)}
                    >
                      <svg viewBox="0 0 16 16" width="13" height="13" fill="none">
                        <path
                          d="M3 4.5h10M6.5 4.5V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5M4.5 4.5 5 13a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1l.5-8.5"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="pt-pagination">
          <button
            className="pt-page-btn"
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
              <path
                d="M10 3 5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Previous
          </button>

          <span className="pt-page-label">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            className="pt-page-btn"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}