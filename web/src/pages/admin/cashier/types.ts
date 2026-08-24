export type Cashier = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CashierFormValues = {
  name: string;
  email: string;
  password: string;
};

export const emptyCashierForm: CashierFormValues = {
  name: "",
  email: "",
  password: "",
};