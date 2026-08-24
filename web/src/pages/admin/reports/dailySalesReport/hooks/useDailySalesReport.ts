import { useCallback, useEffect, useState } from "react";
import {
  fetchDailySalesReport,
  type DailySales,
} from "../api/dailySalesReport.api";

export function useDailySalesReport() {
  const [reports, setReports] = useState<DailySales[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadReports = useCallback(
    async (overrides?: { startDate?: string; endDate?: string }) => {
      try {
        setLoading(true);

        const result = await fetchDailySalesReport({
          startDate: overrides?.startDate ?? startDate,
          endDate: overrides?.endDate ?? endDate,
        });

        setReports(result.data);
      } catch (error) {
        console.error(error);

        alert(
          error instanceof Error
            ? error.message
            : "Gagal mengambil daily sales report",
        );
      } finally {
        setLoading(false);
      }
    },
    [startDate, endDate],
  );

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetFilter = () => {
    setStartDate("");
    setEndDate("");
    loadReports({ startDate: "", endDate: "" });
  };

  const totalTransactions = reports.reduce((sum, r) => sum + r.totalTransactions, 0);
  const totalSales = reports.reduce((sum, r) => sum + r.totalSales, 0);
  const totalCash = reports.reduce((sum, r) => sum + r.totalCash, 0);
  const totalDebit = reports.reduce((sum, r) => sum + r.totalDebit, 0);
  const cashShare =
    totalCash + totalDebit > 0 ? (totalCash / (totalCash + totalDebit)) * 100 : 50;

  return {
    reports,
    loading,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    fetchReports: loadReports,
    resetFilter,
    totalTransactions,
    totalSales,
    totalCash,
    totalDebit,
    cashShare,
  };
}