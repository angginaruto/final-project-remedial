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

export type CartItem = {
  product: Product;
  quantity: number;
};

export type PreviewItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type TransactionPreview = {
  items: PreviewItem[];
  totalAmount: number;
};

export type PaymentMethod = "CASH" | "DEBIT" | null;