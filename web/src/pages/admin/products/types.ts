export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: string | number;
  stock: number;
  image?: string | null;
  category: Category;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProductFormValues = {
  name: string;
  price: string;
  stock: string;
  categoryId: string;
};

export const emptyProductForm: ProductFormValues = {
  name: "",
  price: "",
  stock: "",
  categoryId: "",
};

