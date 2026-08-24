import { useState } from "react";
import type { Category, ProductFormValues } from "../types";
import { emptyProductForm } from "../types";
import "./ProductForm.css";

type ProductFormProps = {
  title: string;
  categories: Category[];
  initialValues?: ProductFormValues;
  currentImageUrl?: string | null;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: ProductFormValues, image: File | null) => void;
  onCancel: () => void;
};

export function ProductForm({
  title,
  categories,
  initialValues = emptyProductForm,
  currentImageUrl,
  submitLabel,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(initialValues);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const updateField = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    onSubmit(values, image);
  };

  return (
    <div className="pf">
      <h2 className="pf-title">{title}</h2>

      <div className="pf-field">
        <label>Nama Produk</label>
        <input
          type="text"
          value={values.name}
          disabled={isSubmitting}
          onChange={(e) => updateField("name", e.target.value)}
        />
      </div>

      <div className="pf-row">
        <div className="pf-field pf-field--numeric">
          <label>Harga</label>
          <input
            type="number"
            min="0"
            value={values.price}
            disabled={isSubmitting}
            onChange={(e) => updateField("price", e.target.value)}
            step={1000}
          />
        </div>

        <div className="pf-field pf-field--numeric">
          <label>Stock</label>
          <input
            type="number"
            min="0"
            value={values.stock}
            disabled={isSubmitting}
            onChange={(e) => updateField("stock", e.target.value)}
          />
        </div>
      </div>

      <div className="pf-field">
        <label>Category</label>
        <div className="pf-select-wrap">
          <select
            value={values.categoryId}
            disabled={isSubmitting}
            onChange={(e) => updateField("categoryId", e.target.value)}
          >
            <option value="">Pilih kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pf-field">
        <label>Gambar Produk</label>
        <div className="pf-image-zone">
          {currentImageUrl && !preview && (
            <div className="pf-swatch">
              <img src={currentImageUrl} alt={values.name} />
              <span className="pf-swatch-label">Image saat ini</span>
            </div>
          )}

          {preview && (
            <div className="pf-swatch">
              <img src={preview} alt="preview" />
              <span className="pf-swatch-label">Image baru</span>
            </div>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={isSubmitting}
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      <div className="pf-actions">
        <button
          className="pf-btn pf-btn--primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {submitLabel}
        </button>
        <button
          className="pf-btn pf-btn--ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Batal
        </button>
      </div>
    </div>
  );
}