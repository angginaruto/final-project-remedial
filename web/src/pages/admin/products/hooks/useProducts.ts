import { useEffect, useState } from "react";
import * as productsApi from "../api/products";
import type { Category, Pagination, Product, ProductFormValues } from "../types";

const LIMIT = 10;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);

  const loadProducts = async () => {
    try {
      const result = await productsApi.fetchProducts({
        page,
        limit: LIMIT,
        search,
        categoryId,
      });

      setProducts(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error(error);
    }
  };

  const loadCategories = async () => {
    try {
      const result = await productsApi.fetchCategories();
      setCategories(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, categoryId]);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSearch = () => {
    setPage(1);
    loadProducts();
  };

  const handleFilterByCategory = (id: string) => {
    setCategoryId(id);
    setPage(1);
  };

  const handleCreate = async (values: ProductFormValues, image?: File | null) => {
    await productsApi.createProduct(values, image);
    setPage(1);
    await loadProducts();
  };

  const handleUpdate = async (
    id: number,
    values: ProductFormValues,
    image?: File | null,
  ) => {
    await productsApi.updateProduct(id, values, image);
    await loadProducts();
  };

  const handleDelete = async (id: number) => {
    await productsApi.deleteProduct(id);
    await loadProducts();
  };

  return {
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
  };
}