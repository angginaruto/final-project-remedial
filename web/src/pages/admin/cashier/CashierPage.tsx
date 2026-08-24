import { useState } from "react";
import { useCashiers } from "./hooks/useCashier";
import { CashierForm } from "./components/CashierForm";
import { CashierTable } from "./components/CashierTable";
import type { Cashier, CashierFormValues } from "./types";
import "./CashierPage.css";

export default function CashierPage() {
  const {
    cashiers,
    pagination,
    search,
    setSearch,
    page,
    setPage,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useCashiers();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCashier, setEditingCashier] = useState<Cashier | null>(null);

  const onCreateSubmit = async (values: CashierFormValues) => {
    try {
      await handleCreate(values);
      alert("Kasir berhasil dibuat");
      setShowCreateForm(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal membuat kasir");
    }
  };

  const onEditSubmit = async (values: CashierFormValues) => {
    if (!editingCashier) return;

    try {
      await handleUpdate(editingCashier.id, values);
      alert("Data kasir berhasil diupdate");
      setEditingCashier(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal mengupdate kasir");
    }
  };

  const onDeleteClick = async (id: number) => {
    if (!window.confirm("Yakin mau menghapus kasir ini?")) return;

    try {
      await handleDelete(id);
      alert("Kasir berhasil dihapus");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menghapus kasir");
    }
  };

  const activeForm = showCreateForm || editingCashier;

  return (
    <div className="cp">
      <header className="cp-header">
        <h1 className="cp-title">Cashier</h1>

        <span className="cp-count">
          {pagination?.total ?? cashiers.length} item
        </span>
      </header>

      <div className="cp-toolbar">
        <div className="cp-search">
          <input
            type="text"
            placeholder="Cari nama atau email kasir..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <button
            className="cp-btn cp-btn--ghost"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        <button
          className="cp-btn cp-btn--primary"
          onClick={() => setShowCreateForm(true)}
        >
          + Add Cashier
        </button>
      </div>

      {activeForm && (
        <div className="cp-modal-backdrop">
          <div className="cp-modal">
            {showCreateForm && (
              <CashierForm
                title="Tambah Kasir"
                submitLabel="Simpan"
                onSubmit={onCreateSubmit}
                onCancel={() => setShowCreateForm(false)}
              />
            )}

            {editingCashier && (
              <CashierForm
                title="Edit Kasir"
                isEdit
                submitLabel="Simpan Perubahan"
                initialValues={{
                  name: editingCashier.name,
                  email: editingCashier.email,
                  password: "",
                }}
                onSubmit={onEditSubmit}
                onCancel={() => setEditingCashier(null)}
              />
            )}
          </div>
        </div>
      )}

      <CashierTable
        cashiers={cashiers}
        pagination={pagination}
        page={page}
        setPage={setPage}
        onEdit={setEditingCashier}
        onDelete={onDeleteClick}
      />
    </div>
  );
}