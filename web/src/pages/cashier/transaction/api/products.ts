import type { Product } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem("token");
}

export async function fetchProducts(search: string): Promise<{ data: Product[] }> {
  const params = new URLSearchParams();

  params.append("page", "1");
  params.append("limit", "50");

  if (search) {
    params.append("search", search);
  }

  const response = await fetch(`${API_URL}/api/products?${params.toString()}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
}