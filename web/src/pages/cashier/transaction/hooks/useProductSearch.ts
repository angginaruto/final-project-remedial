import { useEffect, useState } from "react";
import * as productsApi from "../api/products";
import type { Product } from "../types";

export function useProductSearch() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const result = await productsApi.fetchProducts(search);
      setProducts(result.data);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Gagal mengambil produk");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { products, search, setSearch, loading, loadProducts };
}