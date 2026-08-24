import { useState } from "react";
import { useProducts } from "./hooks/useProducts";
import { ProductForm } from "./components/ProductForm";
import { ProductTable } from "./components/ProductTable";
import type { Product, ProductFormValues } from "./types";
import "./ProductsPage.css";

export default function ProductsPage() {
  const {
    products,
    pagination,
    categories,
    search,
    setSearch,
    categoryId,
    page,
    setPage,
    handleSearch,
    handleFilterByCategory,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useProducts();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onCreateSubmit = async (values: ProductFormValues, image: File | null) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await handleCreate(values, image);
      alert("Produk berhasil dibuat");
      setShowCreateForm(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal membuat produk");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEditSubmit = async (values: ProductFormValues, image: File | null) => {
    if (!editingProduct || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await handleUpdate(editingProduct.id, values, image);
      alert("Produk berhasil diupdate");
      setEditingProduct(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal mengupdate produk");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDeleteClick = async (id: number) => {
    if (!window.confirm("Yakin mau menghapus produk ini?")) return;

    try {
      await handleDelete(id);
      alert("Produk berhasil dihapus");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menghapus produk");
    }
  };

  const activeForm = showCreateForm || editingProduct;

  return (
    <div className="pp">
      <header className="pp-header">
        <h1 className="pp-title">Products</h1>
        <span className="pp-count">{pagination?.total ?? products.length} item</span>
      </header>

      <div className="pp-toolbar">
        <div className="pp-search">
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="pp-btn pp-btn--ghost" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="pp-select-wrap">
          <select
            value={categoryId}
            onChange={(e) => handleFilterByCategory(e.target.value)}
          >
            <option value="">Semua kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="pp-btn pp-btn--primary"
          onClick={() => setShowCreateForm(true)}
        >
          + Add Product
        </button>
      </div>

      {activeForm && (
        <div className="pp-modal-backdrop">
          <div className="pp-modal">
            {showCreateForm && (
              <ProductForm
                title="Tambah Produk"
                categories={categories}
                submitLabel={isSubmitting ? "Menyimpan..." : "Simpan"}
                isSubmitting={isSubmitting}
                onSubmit={onCreateSubmit}
                onCancel={() => setShowCreateForm(false)}
              />
            )}

            {editingProduct && (
              <ProductForm
                title="Edit Produk"
                categories={categories}
                submitLabel={isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                isSubmitting={isSubmitting}
                currentImageUrl={editingProduct.image}
                initialValues={{
                  name: editingProduct.name,
                  price: String(editingProduct.price),
                  stock: String(editingProduct.stock),
                  categoryId: String(editingProduct.category.id),
                }}
                onSubmit={onEditSubmit}
                onCancel={() => setEditingProduct(null)}
              />
            )}
          </div>
        </div>
      )}

      <ProductTable
        products={products}
        pagination={pagination}
        page={page}
        setPage={setPage}
        onEdit={setEditingProduct}
        onDelete={onDeleteClick}
      />
    </div>
  );
}