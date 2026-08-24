import type { Category, Pagination, Product, ProductFormValues } from "../types";

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

function buildFormData(values: ProductFormValues, image?: File | null) {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("price", values.price);
  formData.append("stock", values.stock);
  formData.append("categoryId", values.categoryId);

  if (image) {
    formData.append("image", image);
  }

  return formData;
}

export async function fetchProducts(params: {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
}): Promise<{ data: Product[]; pagination: Pagination }> {
  const query = new URLSearchParams();

  query.append("page", String(params.page));
  query.append("limit", String(params.limit));

  if (params.search) {
    query.append("search", params.search);
  }

  if (params.categoryId) {
    query.append("categoryId", params.categoryId);
  }

  const response = await fetch(`${API_URL}/api/products?${query.toString()}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return parseOrThrow(response);
}

export async function fetchCategories(): Promise<{ data: Category[] }> {
  const response = await fetch(`${API_URL}/api/category`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return parseOrThrow(response);
}

export async function createProduct(values: ProductFormValues, image?: File | null) {
  const response = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: buildFormData(values, image),
  });

  return parseOrThrow(response);
}

export async function updateProduct(
  id: number,
  values: ProductFormValues,
  image?: File | null,
) {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: buildFormData(values, image),
  });

  return parseOrThrow(response);
}
export async function deleteProduct(id: number) {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ confirm: true }),
  });

  return parseOrThrow(response);
}