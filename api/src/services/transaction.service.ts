import prisma from "../utils/prisma.js";

// ============ PREVIEW TRANSACTION ============

export const previewTransactionService = async (
  items: { productId: number; quantity: number }[]
) => {
  const productIds = items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isDeleted: false },
    select: { id: true, name: true, price: true, stock: true },
  });

  if (products.length !== productIds.length) {
    throw new ProductNotFoundError("Ada product yang tidak ditemukan");
  }

  const transactionItems = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);

    if (!product) {
      throw new ProductNotFoundError(`Product dengan id ${item.productId} tidak ditemukan`);
    }

    if (item.quantity > product.stock) {
      throw new StockInsufficientError(`Stock ${product.name} tidak mencukupi`, product.stock, item.quantity);
    }

    const price = Number(product.price);
    const subtotal = price * item.quantity;

    transactionItems.push({ productId: product.id, name: product.name, price, quantity: item.quantity, subtotal });
  }

  const totalAmount = transactionItems.reduce((total, item) => total + item.subtotal, 0);

  return { items: transactionItems, totalAmount };
};

// ============ CREATE CASH TRANSACTION ============

export const createCashTransactionService = async (
  cashierId: number,
  items: { productId: number; quantity: number }[],
  cashReceived: number
) => {
  const shift = await prisma.shift.findFirst({ where: { cashierId, status: "OPEN" } });
  if (!shift) {
    throw new ShiftNotFoundError("cashier belum memiliki shift yang aktif");
  }

  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isDeleted: false },
    select: { id: true, name: true, price: true, stock: true },
  });

  if (products.length !== productIds.length) {
    throw new ProductNotFoundError("ada produk yang tidak lengkap");
  }

  // 1. VALIDASI SEMUA ITEM DULU (gak nyentuh DB write, cuma nyicil array di memory)
  const transactionItems: { productId: number; quantity: number; price: number; subTotal: number }[] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      throw new ProductNotFoundError(`produk ${item.productId} tidak ditemukan`);
    }
    if (item.quantity > product.stock) {
      throw new StockInsufficientError(`stock ${product.name} tidak mencukupi`, product.stock, item.quantity);
    }

    const price = Number(product.price);
    const subTotal = price * item.quantity;
    transactionItems.push({ productId: product.id, quantity: item.quantity, price, subTotal });
  }

  // 2. HITUNG TOTAL SETELAH SEMUA ITEM SELESAI DIVALIDASI
  const totalAmount = transactionItems.reduce((total, item) => total + item.subTotal, 0);

  if (cashReceived < totalAmount) {
    throw new CashInsufficientError("uang tidak mencukupi", totalAmount, cashReceived);
  }

  const changeAmount = cashReceived - totalAmount;

  // 3. TRANSAKSI DATABASE SEKALI AJA, DI LUAR LOOP
  const transaction = await prisma.$transaction(async (tx) => {
    const createdTransaction = await tx.transaction.create({
      data: { shiftId: shift.id, cashierId, totalAmount, paymentMethod: "CASH", cashReceived, changeAmount },
    });

    await tx.transactionItem.createMany({
      data: transactionItems.map((item) => ({
        transactionId: createdTransaction.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subTotal,
      })),
    });

    for (const item of transactionItems) {
      const updated = await tx.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
      if (updated.count === 0) {
        throw new Error(`STOCK_INSUFFICIENT:${item.productId}`);
      }
    }

    return createdTransaction;
  });

  return transaction;
};

// ============ CREATE DEBIT TRANSACTION ============

export const createDebitTransactionService = async (
  cashierId: number,
  items: { productId: number; quantity: number }[],
  cardNumber: string
) => {
  const shift = await prisma.shift.findFirst({ where: { cashierId, status: "OPEN" } });
  if (!shift) {
    throw new ShiftNotFoundError("Cashier belum memiliki shift yang aktif");
  }

  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isDeleted: false },
    select: { id: true, name: true, price: true, stock: true },
  });

  if (products.length !== productIds.length) {
    throw new ProductNotFoundError("Ada product yang tidak ditemukan");
  }

  const transactionItems: { productId: number; quantity: number; price: number; subtotal: number }[] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);

    if (!product) {
      throw new ProductNotFoundError(`Product ${item.productId} tidak ditemukan`);
    }

    if (item.quantity > product.stock) {
      throw new StockInsufficientError(`Stock ${product.name} tidak mencukupi`, product.stock, item.quantity);
    }

    const price = Number(product.price);
    const subtotal = price * item.quantity;

    transactionItems.push({ productId: product.id, quantity: item.quantity, price, subtotal });
  }

  const totalAmount = transactionItems.reduce((total, item) => total + item.subtotal, 0);
  const cardLastFour = cardNumber.slice(-4);

  const transaction = await prisma.$transaction(async (tx) => {
    const createdTransaction = await tx.transaction.create({
      data: { shiftId: shift.id, cashierId, totalAmount, paymentMethod: "DEBIT", cardLastFour },
    });

    await tx.transactionItem.createMany({
      data: transactionItems.map((item) => ({
        transactionId: createdTransaction.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
    });

    for (const item of transactionItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return createdTransaction;
  });

  return { transaction, items: transactionItems, totalAmount, cardLastFour };
};

// ============ GET TRANSACTION HISTORY ============

export const getTransactionHistoryService = async (
  cashierId: number,
  filters: { page: number; limit: number }
) => {
  const { page, limit } = filters;
  const skip = (page - 1) * limit;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const where = { cashierId, createdAt: { gte: startOfDay, lt: endOfDay } };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { items: { include: { product: { select: { id: true, name: true } } } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

// ============ GET TRANSACTION BY ID ============

export const getTransactionByIdService = async (cashierId: number, id: number) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id, cashierId },
    include: {
      items: { include: { product: { select: { id: true, name: true } } } },
      shift: { select: { id: true, startedAt: true, endedAt: true } },
    },
  });

  if (!transaction) {
    throw new TransactionNotFoundError("Transaksi tidak ditemukan");
  }

  return transaction;
};

// Error khusus supaya controller bisa membedakan status code

export class ProductNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductNotFoundError";
  }
}

export class StockInsufficientError extends Error {
  availableStock: number;
  requestedQuantity: number;

  constructor(message: string, availableStock: number, requestedQuantity: number) {
    super(message);
    this.name = "StockInsufficientError";
    this.availableStock = availableStock;
    this.requestedQuantity = requestedQuantity;
  }
}

export class ShiftNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShiftNotFoundError";
  }
}

export class CashInsufficientError extends Error {
  totalAmount: number;
  cashReceived: number;

  constructor(message: string, totalAmount: number, cashReceived: number) {
    super(message);
    this.name = "CashInsufficientError";
    this.totalAmount = totalAmount;
    this.cashReceived = cashReceived;
  }
}

export class TransactionNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TransactionNotFoundError";
  }
}