import type { Cashier, CashierFormValues, Pagination } from "../types";

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

export async function fetchCashiers(params: {
  page: number;
  limit: number;
  search?: string;
}): Promise<{ data: Cashier[]; pagination: Pagination }> {
  const query = new URLSearchParams();

  query.append("page", String(params.page));
  query.append("limit", String(params.limit));

  if (params.search) {
    query.append("search", params.search);
  }

  const response = await fetch(`${API_URL}/api/cashier?${query.toString()}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return parseOrThrow(response);
}

export async function createCashier(values: CashierFormValues) {
  const response = await fetch(`${API_URL}/api/cashier`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(values),
  });

  return parseOrThrow(response);
}

export async function updateCashier(id: number, values: CashierFormValues) {
  // Password cuma dikirim kalau diisi
  const body: { name: string; email: string; password?: string } = {
    name: values.name,
    email: values.email,
  };

  if (values.password.trim() !== "") {
    body.password = values.password;
  }

  const response = await fetch(`${API_URL}/api/cashier/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });

  return parseOrThrow(response);
}

export async function deleteCashier(id: number) {
  const response = await fetch(`${API_URL}/api/cashier/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ confirm: true }),
  });

  return parseOrThrow(response);
}