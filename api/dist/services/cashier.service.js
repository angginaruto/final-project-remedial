import bcrypt from "bcrypt";
import prisma from "../utils/prisma.js";
import { Role } from "@prisma/client";
// ============ GET CASHIER (LIST) ============
export const getCashierService = async (userId, filters) => {
    const { search, page, limit } = filters;
    const skip = (page - 1) * limit;
    const where = {
        role: Role.CASHIER,
        isDeleted: false,
        createdById: userId,
        ...(search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ],
            }
            : {}),
    };
    const [cashier, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: { id: true, name: true, email: true, role: true, createdAt: true },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma.user.count({ where }),
    ]);
    return {
        cashier,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};
// ============ GET CASHIER BY ID ============
export const getCashierByIdService = async (userId, id) => {
    const cashier = await prisma.user.findFirst({
        where: { id, role: Role.CASHIER, isDeleted: false, createdById: userId },
        select: { id: true, name: true, email: true, role: true },
    });
    if (!cashier) {
        throw new CashierNotFoundError("kasir tidak ditemukan");
    }
    return cashier;
};
// ============ CREATE CASHIER ============
export const createCashierService = async (userId, data) => {
    const { name, email, password } = data;
    const existingUser = await prisma.user.findUnique({
        where: { email, createdById: userId },
    });
    if (existingUser) {
        if (!existingUser.isDeleted) {
            throw new CashierConflictError("email sudah digunakan");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const restoredCashier = await prisma.user.update({
            where: { id: existingUser.id },
            data: { name, password: hashedPassword, role: Role.CASHIER, isDeleted: false },
            select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
        });
        return { restored: true, cashier: restoredCashier };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const cashier = await prisma.user.create({
        data: { name, email, password: hashedPassword, role: Role.CASHIER, createdById: userId },
        select: { id: true, name: true, email: true, role: true },
    });
    return { restored: false, cashier };
};
// ============ UPDATE CASHIER ============
export const updateCashierService = async (userId, id, data) => {
    const { name, email, password } = data;
    const existingUser = await prisma.user.findFirst({
        where: { id, role: Role.CASHIER, isDeleted: false, createdById: userId },
    });
    if (!existingUser) {
        throw new CashierNotFoundError("kasir tidak ditemukan");
    }
    if (email) {
        const duplicatedEmail = await prisma.user.findFirst({ where: { email, NOT: { id } } });
        if (duplicatedEmail) {
            throw new CashierConflictError("alamat email sudah digunakan");
        }
    }
    const updateData = {};
    if (name !== undefined)
        updateData.name = name;
    if (email !== undefined)
        updateData.email = email;
    if (password !== undefined)
        updateData.password = await bcrypt.hash(password, 10);
    const cashier = await prisma.user.update({
        where: { id },
        data: updateData,
        select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
    return cashier;
};
// ============ DELETE CASHIER ============
export const deleteCashierService = async (userId, id) => {
    const cashier = await prisma.user.findFirst({
        where: { id, role: Role.CASHIER, isDeleted: false, createdById: userId },
    });
    if (!cashier) {
        throw new CashierNotFoundError("kasir tidak ditemukan");
    }
    const activeShift = await prisma.shift.findFirst({ where: { cashierId: id, status: "OPEN" } });
    if (activeShift) {
        throw new CashierConflictError("kasir masih punya shift yang sedang berjalan, tutup shift dulu sebelum menghapus");
    }
    await prisma.user.update({ where: { id }, data: { isDeleted: true } });
};
// Error khusus supaya controller bisa membedakan status code (404 vs 409 vs 500)
export class CashierNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "CashierNotFoundError";
    }
}
export class CashierConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = "CashierConflictError";
    }
}
//# sourceMappingURL=cashier.service.js.map