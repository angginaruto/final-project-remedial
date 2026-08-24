import type { Cashier, Pagination } from "../types";
import "./CashierTable.css";

type CashierTableProps = {
  cashiers: Cashier[];
  pagination: Pagination | null;
  page: number;
  setPage: (updater: (prev: number) => number) => void;
  onEdit: (cashier: Cashier) => void;
  onDelete: (id: number) => void;
};

export function CashierTable({
  cashiers,
  pagination,
  page,
  setPage,
  onEdit,
  onDelete,
}: CashierTableProps) {
  return (
    <div className="ct">
      <div className="ct-table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Dibuat</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {cashiers.length === 0 && (
              <tr>
                <td colSpan={6} className="ct-empty">
                  Belum ada kasir.
                </td>
              </tr>
            )}

            {cashiers.map((cashier) => (
              <tr key={cashier.id}>
                <td className="ct-cell--mono ct-cell--id">
                  {cashier.id}
                </td>

                <td className="ct-cell--name">
                  {cashier.name}
                </td>

                <td>{cashier.email}</td>

                <td>
                  <span className="ct-role">
                    {cashier.role}
                  </span>
                </td>

                <td className="ct-cell--mono ct-cell--date">
                  {new Date(cashier.createdAt).toLocaleDateString(
                    "id-ID"
                  )}
                </td>

                <td>
                  <div className="ct-actions">
                    <button
                      className="ct-action-btn ct-action-btn--edit"
                      onClick={() => onEdit(cashier)}
                    >
                      <svg
                        viewBox="0 0 16 16"
                        width="13"
                        height="13"
                        fill="none"
                      >
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
                      className="ct-action-btn ct-action-btn--danger"
                      onClick={() => onDelete(cashier.id)}
                    >
                      <svg
                        viewBox="0 0 16 16"
                        width="13"
                        height="13"
                        fill="none"
                      >
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
        <div className="ct-pagination">
          <button
            className="ct-page-btn"
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <svg
              viewBox="0 0 16 16"
              width="12"
              height="12"
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
            Previous
          </button>

          <span className="ct-page-label">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            className="ct-page-btn"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next

            <svg
              viewBox="0 0 16 16"
              width="12"
              height="12"
              fill="none"
            >
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