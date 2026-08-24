import { useCallback, useEffect, useState } from "react";
import {
  fetchDailyProductSales,
  type DailyProductSales,
} from "../api/dailyProductSales.api";

export function useDailyProductSales() {
  const [reports, setReports] = useState<DailyProductSales[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadReports = useCallback(
    async (overrides?: { startDate?: string; endDate?: string }) => {
      try {
        setLoading(true);

        const result = await fetchDailyProductSales({
          startDate: overrides?.startDate ?? startDate,
          endDate: overrides?.endDate ?? endDate,
        });

        setReports(result.data);
      } catch (error) {
        console.error(error);

        alert(
          error instanceof Error
            ? error.message
            : "Gagal mengambil daily product sales report",
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

  const totalQuantity = reports.reduce((sum, r) => sum + r.quantitySold, 0);
  const totalSales = reports.reduce((sum, r) => sum + r.totalSales, 0);

  return {
    reports,
    loading,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    fetchReports: loadReports,
    resetFilter,
    totalQuantity,
    totalSales,
  };
}