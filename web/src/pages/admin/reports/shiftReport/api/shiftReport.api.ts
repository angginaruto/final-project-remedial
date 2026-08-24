export type ShiftReport = {
  shiftId: number;
  cashierId: number;
  cashier: {
    id: number;
    name: string;
    email: string;
  };

  startedAt: string;
  endedAt: string | null;

  initialCash: number;
  finalCash: number | null;
  expectedCash: number | null;
  cashDifference: number | null;

  status: string;

  totalTransactions?: number;
  totalDebit?: number;
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

export async function fetchShiftReport(params: {
  date?: string;
}): Promise<{ data: ShiftReport[] }> {
  const query = new URLSearchParams();

  if (params.date) {
    query.append("date", params.date);
  }

  const response = await fetch(
    `${API_URL}/api/reports/shifts?${query.toString()}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    },
  );

  return parseOrThrow(response);
}