import { useCallback, useEffect, useState } from "react";
import { fetchShiftReport, type ShiftReport } from "../api/shiftReport.api";
import { getDifferenceLabel } from "../utils/shiftReport.utils";

export function useShiftReport() {
  const [shifts, setShifts] = useState<ShiftReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");

  const loadShifts = useCallback(
    async (overrides?: { date?: string }) => {
      try {
        setLoading(true);

        const result = await fetchShiftReport({
          date: overrides?.date ?? date,
        });

        setShifts(result.data);
      } catch (error) {
        console.error(error);

        alert(
          error instanceof Error ? error.message : "Gagal mengambil shift report",
        );
      } finally {
        setLoading(false);
      }
    },
    [date],
  );

  useEffect(() => {
    loadShifts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetFilter = () => {
    setDate("");
    loadShifts({ date: "" });
  };

  const openCount = shifts.filter((s) => s.status.toUpperCase() === "OPEN").length;
  const shortCount = shifts.filter(
    (s) => getDifferenceLabel(s.cashDifference) === "SHORT",
  ).length;
  const totalTransactions = shifts.reduce(
    (sum, s) => sum + (s.totalTransactions ?? 0),
    0,
  );

  return {
    shifts,
    loading,
    date,
    setDate,
    fetchShifts: loadShifts,
    resetFilter,
    openCount,
    shortCount,
    totalTransactions,
  };
}