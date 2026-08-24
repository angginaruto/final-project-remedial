import { type Request, type Response } from "express";
import { createCashierSchema, updateCashierSchema, getCashierSchema } from "../validations/cashier.validation.js";
import { deleteConfirmationSchema } from "../validations/product.validation.js";
import {
  getCashierService,
  getCashierByIdService,
  createCashierService,
  updateCashierService,
  deleteCashierService,
  CashierNotFoundError,
  CashierConflictError,
} from "../services/cashier.service.js";

export const getCashier = async (req: Request, res: Response) => {
  try {
    const validation = getCashierSchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).json({ message: "query-nya tidak valid", errors: validation.error.flatten() });
    }

    if (!req.user) {
      return res.status(200).json({ message: "akun belum terotorisasi" });
    }

    const { cashier, pagination } = await getCashierService(req.user.id, validation.data);

    return res.status(200).json({ message: "data kasir berhasil diambil", data: cashier, pagination });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ messsage: "terjadi error di internal server" });
  }
};

export const getCashierById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "id kasirnya tidak valid" });
    }

    if (!req.user) {
      return res.status(200).json({ message: "akun belum terotorisasi" });
    }

    const cashier = await getCashierByIdService(req.user.id, id);

    return res.status(200).json({ message: "kasir berhasil diambil", data: cashier });
  } catch (error) {
    if (error instanceof CashierNotFoundError) {
      return res.status(404).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: "terjadi error di internal server" });
  }
};

export const createCashier = async (req: Request, res: Response) => {
  try {
    const validation = createCashierSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: "validasi error", errors: validation.error.flatten() });
    }

    if (!req.user) {
      return res.status(200).json({ message: "akun belum terotorisasi" });
    }

    const result = await createCashierService(req.user.id, validation.data);

    if (result.restored) {
      return res.status(200).json({ message: "user sudah berhasil dipulihkan", data: result.cashier });
    }

    return res.status(200).json({ message: "kasir baru berhasil dibuat", data: result.cashier });
  } catch (error) {
    if (error instanceof CashierConflictError) {
      return res.status(409).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: "terjadi error di internal server" });
  }
};

export const updateCashier = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "id tidak valid" });
    }

    const validation = updateCashierSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: "gagal validasi", errors: validation.error.flatten() });
    }

    if (!req.user) {
      return res.status(200).json({ message: "akun belum terotorisasi" });
    }

    const cashier = await updateCashierService(req.user.id, id, validation.data);

    return res.status(200).json({ message: "data kasir berhasil diupdate", data: cashier });
  } catch (error) {
    if (error instanceof CashierNotFoundError) {
      return res.status(404).json({ message: error.message });
    }

    if (error instanceof CashierConflictError) {
      return res.status(409).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: "error di server internal" });
  }
};

export const deleteCashier = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "id tidak valid" });
    }

    if (!req.user) {
      return res.status(200).json({ message: "akun belum terotorisasi" });
    }

    const validation = deleteConfirmationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: "harus konfirmasi dulu sebelum delete", errors: validation.error.flatten() });
    }

    await deleteCashierService(req.user.id, id);

    return res.status(200).json({ message: "kasir berhasil dihapus" });
  } catch (error) {
    if (error instanceof CashierNotFoundError) {
      return res.status(404).json({ message: error.message });
    }

    if (error instanceof CashierConflictError) {
      return res.status(409).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: "internal server error" });
  }
};