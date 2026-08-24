import { useState } from "react";
import * as transactionApi from "../api/transaction";
import type { CartItem, PaymentMethod, TransactionPreview } from "../types";

export function usePayment(onPaid: () => void) {
  const [preview, setPreview] = useState<TransactionPreview | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [cashReceived, setCashReceived] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const resetPayment = () => {
    setPreview(null);
    setPaymentMethod(null);
    setCashReceived("");
    setCardNumber("");
  };

  const requestPreview = async (cart: CartItem[]) => {
    if (cart.length === 0) {
      alert("Cart masih kosong");
      return;
    }

    try {
      const result = await transactionApi.previewTransaction(cart);
      setPreview(result.data);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Gagal melakukan preview transaksi",
      );
    }
  };

  const confirmCash = async () => {
    if (!preview) return;

    const received = Number(cashReceived);

    if (!received || received <= 0) {
      alert("Masukkan jumlah uang yang diterima");
      return;
    }

    if (received < preview.totalAmount) {
      alert("Uang tidak mencukupi");
      return;
    }

    try {
      const result = await transactionApi.payCash(preview.items, received);

      alert(
        `Transaksi berhasil!\nKembalian: Rp ${Number(
          result.data.changeAmount,
        ).toLocaleString("id-ID")}`,
      );

      resetPayment();
      onPaid();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Gagal melakukan transaksi cash");
    }
  };

  const confirmDebit = async () => {
  if (!preview) return;

  const cleanedCardNumber = cardNumber.replace(/\D/g, ""); // buang semua non-digit

  if (!/^\d{16}$/.test(cleanedCardNumber)) {
    alert("Nomor kartu harus 16 digit angka");
    return;
  }

    try {
      await transactionApi.payDebit(preview.items, cardNumber.trim());

      alert("Transaksi debit berhasil");

      resetPayment();
      onPaid();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Gagal melakukan transaksi debit");
    }
  };

  return {
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
  };
}