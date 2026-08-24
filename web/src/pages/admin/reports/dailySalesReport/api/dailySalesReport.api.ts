export type DailySales = {
  date: string;
  totalTransactions: number;
  totalSales: number;
  totalCash: number;
  totalDebit: number;
};

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

export async function fetchDailySalesReport(params: {
  startDate?: string;
  endDate?: string;
}): Promise<{ data: DailySales[] }> {
  const query = new URLSearchParams();

  if (params.startDate) {
    query.append("startDate", params.startDate);
  }

  if (params.endDate) {
    query.append("endDate", params.endDate);
  }

  const response = await fetch(
    `${API_URL}/api/reports/daily?${query.toString()}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    },
  );

  return parseOrThrow(response);
}