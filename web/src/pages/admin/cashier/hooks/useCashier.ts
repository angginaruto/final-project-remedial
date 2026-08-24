import { useEffect, useState } from "react";
import * as cashierApi from "../api/cashier";
import type { Cashier, CashierFormValues, Pagination } from "../types";

const LIMIT = 10;

export function useCashiers() {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const loadCashiers = async () => {
    try {
      const result = await cashierApi.fetchCashiers({
        page,
        limit: LIMIT,
        search,
      });

      setCashiers(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Gagal mengambil data kasir");
    }
  };

  useEffect(() => {
    loadCashiers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    loadCashiers();
  };

  const handleCreate = async (values: CashierFormValues) => {
    await cashierApi.createCashier(values);
    setPage(1);
    await loadCashiers();
  };

  const handleUpdate = async (id: number, values: CashierFormValues) => {
    await cashierApi.updateCashier(id, values);
    await loadCashiers();
  };

  const handleDelete = async (id: number) => {
    await cashierApi.deleteCashier(id);
    await loadCashiers();
  };

  return {
    cashiers,
    pagination,
    search,
    setSearch,
    page,
    setPage,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}