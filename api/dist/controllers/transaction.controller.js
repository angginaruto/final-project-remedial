import {} from "express";
import { transactionPreviewSchema, createCashTransactionSchema, createDebitTransactionSchema, getTransactionHistorySchema } from "../validations/transaction.validation.js";
import { previewTransactionService, createCashTransactionService, createDebitTransactionService, getTransactionHistoryService, getTransactionByIdService, ProductNotFoundError, StockInsufficientError, ShiftNotFoundError, CashInsufficientError, TransactionNotFoundError, } from "../services/transaction.service.js";
export const previewTransaction = async (req, res) => {
    try {
        const validation = transactionPreviewSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ message: "Validasi transaction gagal", errors: validation.error.flatten() });
        }
        const { items } = validation.data;
        const result = await previewTransactionService(items);
        return res.status(200).json({ message: "Preview transaction berhasil", data: result });
    }
    catch (error) {
        if (error instanceof ProductNotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        if (error instanceof StockInsufficientError) {
            return res.status(400).json({
                message: error.message,
                availableStock: error.availableStock,
                requestedQuantity: error.requestedQuantity,
            });
        }
        console.error(error);
        return res.status(500).json({ message: "Terjadi error di internal server" });
    }
};
export const createCashTransaction = async (req, res) => {
    try {
        const validation = createCashTransactionSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ message: "terjadi error saat validasi", errors: validation.error.flatten() });
        }
        const { items, cashReceived } = validation.data;
        const cashierId = req.user.id;
        const transaction = await createCashTransactionService(cashierId, items, cashReceived);
        return res.status(201).json({ message: "Transaksi cash berhasil", data: transaction });
    }
    catch (error) {
        if (error instanceof ShiftNotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        if (error instanceof ProductNotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        if (error instanceof StockInsufficientError) {
            return res.status(400).json({
                message: error.message,
                availableStock: error.availableStock,
                requestedQuantity: error.requestedQuantity,
            });
        }
        if (error instanceof CashInsufficientError) {
            return res.status(400).json({
                message: error.message,
                totalAmount: error.totalAmount,
                cashReceived: error.cashReceived,
                shortage: error.totalAmount - error.cashReceived,
            });
        }
        // termasuk race-condition error "STOCK_INSUFFICIENT:<productId>" dari dalam $transaction
        console.error(error);
        return res.status(500).json({ message: "terjadi error di internal server" });
    }
};
export const createDebitTransaction = async (req, res) => {
    try {
        const validation = createDebitTransactionSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ message: "Validasi transaction gagal", errors: validation.error.flatten() });
        }
        const { items, cardNumber } = validation.data;
        if (!req.user) {
            return res.status(404).json({ message: "pengguna tidak ditemukan" });
        }
        const cashierId = req.user.id;
        const result = await createDebitTransactionService(cashierId, items, cardNumber);
        return res.status(201).json({ message: "Transaksi debit berhasil", data: result });
    }
    catch (error) {
        if (error instanceof ShiftNotFoundError) {
            return res.status(400).json({ message: error.message });
        }
        if (error instanceof ProductNotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        if (error instanceof StockInsufficientError) {
            return res.status(400).json({
                message: error.message,
                availableStock: error.availableStock,
                requestedQuantity: error.requestedQuantity,
            });
        }
        console.error(error);
        return res.status(500).json({ message: "Terjadi error di internal server" });
    }
};
export const getTransactionHistory = async (req, res) => {
    try {
        const validation = getTransactionHistorySchema.safeParse(req.query);
        if (!validation.success) {
            return res.status(400).json({ message: "Query parameter tidak valid", errors: validation.error.flatten() });
        }
        const cashierId = req.user.id;
        const { transactions, pagination } = await getTransactionHistoryService(cashierId, validation.data);
        return res.status(200).json({ message: "History transaksi berhasil diambil", data: transactions, pagination });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Terjadi error di internal server" });
    }
};
export const getTransactionById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: "id transaksi tidak valid" });
        }
        const cashierId = req.user.id;
        const transaction = await getTransactionByIdService(cashierId, id);
        return res.status(200).json({ message: "Detail transaksi berhasil diambil", data: transaction });
    }
    catch (error) {
        if (error instanceof TransactionNotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: "Terjadi error di internal server" });
    }
};
//# sourceMappingURL=transaction.controller.js.map