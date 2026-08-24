import type { CartItem, PreviewItem, TransactionPreview } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem("token");
}

async function parseOrThrow(response: Response) {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
}

export async function previewTransaction(
  cart: CartItem[],
): Promise<{ data: TransactionPreview }> {
  const response = await fetch(`${API_URL}/api/transaction/preview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    }),
  });

  return parseOrThrow(response);
}

export async function payCash(
  items: PreviewItem[],
  cashReceived: number,
): Promise<{ data: { changeAmount: number } }> {
  const response = await fetch(`${API_URL}/api/transaction/cash`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      cashReceived,
    }),
  });

  return parseOrThrow(response);
}

export async function payDebit(items: PreviewItem[], cardNumber: string) {
  const response = await fetch(`${API_URL}/api/transaction/debit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      cardNumber,
    }),
  });

  return parseOrThrow(response);
}