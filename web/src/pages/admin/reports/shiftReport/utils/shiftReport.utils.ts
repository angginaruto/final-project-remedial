export function getDifferenceLabel(cashDifference: number | null) {
  const difference = Number(cashDifference ?? 0);

  if (difference === 0) {
    return "MATCH";
  }

  return difference > 0 ? "OVER" : "SHORT";
}

export function formatDateTime(date: string | null) {
  if (!date) return "-";

  return new Date(date).toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}