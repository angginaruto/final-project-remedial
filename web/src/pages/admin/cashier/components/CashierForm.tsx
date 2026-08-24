import { useState } from "react";
import type { CashierFormValues } from "../types";
import { emptyCashierForm } from "../types";
import "./CashierForm.css"

type CashierFormProps = {
  title: string;
  initialValues?: CashierFormValues;
  isEdit?: boolean;
  submitLabel: string;
  onSubmit: (values: CashierFormValues) => void;
  onCancel: () => void;
};

export function CashierForm({
  title,
  initialValues = emptyCashierForm,
  isEdit = false,
  submitLabel,
  onSubmit,
  onCancel,
}: CashierFormProps) {
  const [values, setValues] =
    useState<CashierFormValues>(initialValues);

  return (
    <div className="cf">
      <div className="cf-header">
        <h2 className="cf-title">{title}</h2>
        <span className="cf-indicator" />
      </div>

      <div className="cf-body">
        <div className="cf-field">
          <label htmlFor="cashier-name">Nama</label>

          <input
            id="cashier-name"
            type="text"
            value={values.name}
            onChange={(e) =>
              setValues({
                ...values,
                name: e.target.value,
              })
            }
            placeholder="Masukkan nama kasir"
          />
        </div>

        <div className="cf-field">
          <label htmlFor="cashier-email">Email</label>

          <input
            id="cashier-email"
            type="email"
            value={values.email}
            onChange={(e) =>
              setValues({
                ...values,
                email: e.target.value,
              })
            }
            placeholder="Masukkan email kasir"
          />
        </div>

        <div className="cf-field">
          <label htmlFor="cashier-password">
            {isEdit
              ? "Password baru (opsional)"
              : "Password"}
          </label>

          <input
            id="cashier-password"
            type="password"
            placeholder={
              isEdit
                ? "Kosongkan jika tidak ingin mengganti"
                : "Masukkan password"
            }
            value={values.password}
            onChange={(e) =>
              setValues({
                ...values,
                password: e.target.value,
              })
            }
          />

          {isEdit && (
            <span className="cf-hint">
              Biarkan kosong jika password tidak ingin diubah.
            </span>
          )}
        </div>
      </div>

      <div className="cf-footer">
        <button
          type="button"
          className="cf-btn cf-btn--secondary"
          onClick={onCancel}
        >
          Batal
        </button>

        <button
          type="button"
          className="cf-btn cf-btn--primary"
          onClick={() => onSubmit(values)}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}